/**
 * app/api/stripe/webhook/route.ts — Stripe Webhook ハンドラー
 *
 * 決済完了時にクレジットを加算します。
 * また、同じカードで複数アカウントを作っていないかチェックし、
 * 疑いがある場合はアカウントにフラグを立てます。
 */

import { NextResponse } from "next/server";
import { stripe, getPlanByPriceId } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "署名がありません" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "署名が無効です" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const priceId = session.metadata?.price_id;

    if (!userId || !priceId) {
      return NextResponse.json({ received: true });
    }

    const plan = getPlanByPriceId(priceId);
    if (!plan) {
      return NextResponse.json({ received: true });
    }

    const supabase = createAdminClient();

    // ==============================
    // カードのフィンガープリント（識別ID）を取得
    // ==============================
    // フィンガープリントとは：同じカードには必ず同じIDが割り当てられる
    // カード番号が変わっても同じ物理カードなら同じIDになる
    let cardFingerprint: string | null = null;

    try {
      if (session.payment_intent) {
        // 決済の詳細情報を取得（カード情報を含む）
        const paymentIntent = await stripe.paymentIntents.retrieve(
          session.payment_intent as string,
          { expand: ["payment_method"] } // 支払い方法の詳細も一緒に取得
        );
        const paymentMethod = paymentIntent.payment_method as Stripe.PaymentMethod;
        cardFingerprint = paymentMethod?.card?.fingerprint ?? null;
      }
    } catch {
      // フィンガープリント取得に失敗しても処理は続ける
    }

    // ==============================
    // 同じカードが他のアカウントで使われていないかチェック
    // ==============================
    if (cardFingerprint) {
      const { data: sameCardPurchases } = await supabase
        .from("credit_purchases")
        .select("user_id")
        .eq("card_fingerprint", cardFingerprint)
        .neq("user_id", userId) // 自分以外のユーザーを対象に
        .limit(1);

      if (sameCardPurchases && sameCardPurchases.length > 0) {
        // 同じカードで別アカウントが存在する → フラグを立てる
        await supabase
          .from("profiles")
          .update({ is_flagged: true })
          .eq("id", userId);

        console.warn(
          `⚠️ 不正の疑い: user=${userId} が他アカウントと同じカードを使用`
        );
      }
    }

    // ==============================
    // クレジットを加算
    // ==============================
    const { error: creditError } = await supabase.rpc("add_credits", {
      target_user_id: userId,
      amount: plan.credits,
    });

    if (creditError) {
      console.error("クレジット加算エラー:", creditError);
      return NextResponse.json(
        { error: "クレジット加算に失敗しました" },
        { status: 500 }
      );
    }

    // ==============================
    // 購入履歴を保存（カードのフィンガープリントも記録）
    // ==============================
    await supabase.from("credit_purchases").insert({
      user_id: userId,
      price_id: priceId,
      credits_added: plan.credits,
      stripe_session_id: session.id,
      card_fingerprint: cardFingerprint, // カードIDを保存
    });
  }

  return NextResponse.json({ received: true });
}

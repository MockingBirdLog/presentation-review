/**
 * app/api/stripe/checkout/route.ts — Stripe 決済セッション作成 API
 *
 * フロントエンド（ブラウザ）からこの API を呼ぶと、
 * Stripe の決済ページへの URL を返します。
 *
 * 流れ：
 * 1. ブラウザが priceId を送ってくる
 * 2. ログイン中のユーザーを確認
 * 3. 初回限定プランの場合、すでに購入済みかチェック
 * 4. Stripe に決済セッションを作成してもらう
 * 5. 決済ページの URL をブラウザに返す
 */

import { NextResponse } from "next/server";
import { stripe, PLANS, getPlanByPriceId } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { priceId } = await request.json();

    // priceId が正しいか確認
    const plan = getPlanByPriceId(priceId);
    if (!plan) {
      return NextResponse.json(
        { error: "無効なプランです" },
        { status: 400 }
      );
    }

    // ログイン中のユーザーを取得
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 }
      );
    }

    // ==============================
    // 初回限定プランのチェック
    // ==============================
    if (plan.isOneTime) {
      const { data: existingPurchase } = await supabase
        .from("credit_purchases")
        .select("id")
        .eq("user_id", user.id)
        .eq("price_id", priceId)
        .single();

      if (existingPurchase) {
        return NextResponse.json(
          { error: "このプランはすでに購入済みです" },
          { status: 400 }
        );
      }
    }

    // ==============================
    // Stripe 決済セッションを作成
    // ==============================
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "payment",           // 都度払い（サブスクではない）
      locale: "ja",              // 決済画面を日本語にする
      // 決済完了後にリダイレクトする URL
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      // キャンセルした場合のリダイレクト先
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      // メタデータ：Webhook でクレジットを加算するために必要
      metadata: {
        user_id: user.id,
        price_id: priceId,
      },
    });

    // 決済ページの URL をブラウザに返す
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "決済の準備に失敗しました" },
      { status: 500 }
    );
  }
}

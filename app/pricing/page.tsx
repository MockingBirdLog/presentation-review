/**
 * app/pricing/page.tsx — 料金ページ（/pricing）
 *
 * サーバーコンポーネントで、Stripe から最新の価格情報を取得して表示します。
 * 初回限定プランは、すでに購入済みの場合はボタンを無効にします。
 */

import { stripe, PLANS } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import PurchaseButton from "./PurchaseButton";
import Link from "next/link";

export default async function PricingPage() {
  const supabase = createClient();

  // ログイン中のユーザーを取得（未ログインでも閲覧できる）
  const { data: { user } } = await supabase.auth.getUser();

  // ==============================
  // Stripe から価格情報を取得
  // ==============================
  // price ID が設定されているプランだけ取得する
  const pricesWithDetails = (
    await Promise.all(
      PLANS.filter((plan) => plan.priceId?.startsWith("price_")).map(async (plan) => {
        try {
          const price = await stripe.prices.retrieve(plan.priceId);
          return {
            ...plan,
            amount: price.unit_amount ?? 0,
          };
        } catch {
          return null; // 取得失敗したプランはスキップ
        }
      })
    )
  ).filter((p) => p !== null) as typeof pricesWithDetails;

  // ==============================
  // 初回限定プランの購入済みチェック
  // ==============================
  let purchasedPriceIds: string[] = [];
  if (user) {
    const { data: purchases } = await supabase
      .from("credit_purchases")
      .select("price_id")
      .eq("user_id", user.id);
    purchasedPriceIds = purchases?.map((p) => p.price_id) ?? [];
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">

      {/* ヘッダー */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-lg">
            プレゼン添削AI
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              className="text-slate-300 hover:text-white text-sm transition-colors"
            >
              ダッシュボードへ →
            </Link>
          ) : (
            <Link
              href="/login"
              className="bg-white text-slate-900 text-sm font-medium px-4 py-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              ログイン
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">

        {/* タイトル */}
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="text-4xl font-bold text-white mb-4">クレジットを購入</h1>
          <p className="text-slate-400 text-lg">
            1クレジット = プレゼン1ページの添削
          </p>
        </div>

        {/* プランカード一覧 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
          {pricesWithDetails.map((plan) => {
            const isPurchased = plan.isOneTime && purchasedPriceIds.includes(plan.priceId);

            return (
              <div
                key={plan.id}
                className={`relative bg-white/5 border rounded-2xl p-6 flex flex-col transition-all animate-fadeInUp ${
                  plan.badge === "人気"
                    ? "border-blue-400/50 bg-blue-500/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                {/* バッジ（人気・お得など） */}
                {plan.badge && (
                  <span className={`absolute -top-3 left-4 text-xs font-bold px-3 py-1 rounded-full ${
                    plan.badge === "初回限定"
                      ? "bg-yellow-400 text-slate-900"
                      : plan.badge === "人気"
                      ? "bg-blue-500 text-white"
                      : "bg-green-500 text-white"
                  }`}>
                    {plan.badge}
                  </span>
                )}

                {/* プラン名 */}
                <h2 className="text-white font-bold text-lg mb-1">{plan.name}</h2>

                {/* 価格 */}
                <p className="text-3xl font-bold text-white mb-1">
                  ¥{plan.amount.toLocaleString()}
                </p>

                {/* クレジット数と説明 */}
                <p className="text-blue-300 font-medium mb-1">
                  {plan.credits} クレジット
                </p>
                <p className="text-slate-400 text-sm mb-6">{plan.description}</p>

                {/* 購入ボタン */}
                <div className="mt-auto">
                  {isPurchased ? (
                    <div className="w-full py-2.5 rounded-lg bg-slate-600/50 text-slate-400 text-sm font-medium text-center">
                      購入済み
                    </div>
                  ) : (
                    <PurchaseButton
                      priceId={plan.priceId}
                      isLoggedIn={!!user}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 注意書き */}
        <p className="text-center text-slate-500 text-sm mt-10">
          クレジットに有効期限はありません。購入後すぐに使えます。
        </p>
      </main>
    </div>
  );
}

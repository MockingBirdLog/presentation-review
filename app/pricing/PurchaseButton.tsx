/**
 * app/pricing/PurchaseButton.tsx — 購入ボタン（クライアントコンポーネント）
 *
 * ボタンのクリック処理はブラウザ側で行うため "use client" が必要です。
 * クリックすると /api/stripe/checkout を呼び出し、
 * 返ってきた Stripe の決済ページ URL にリダイレクトします。
 */

"use client";

import { useState } from "react";
import Link from "next/link";

interface PurchaseButtonProps {
  priceId: string;
  isLoggedIn: boolean;
}

export default function PurchaseButton({ priceId, isLoggedIn }: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  async function handlePurchase() {
    // ログインしていない場合はアカウント作成を促す
    if (!isLoggedIn) {
      setShowSignupPrompt(true);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "エラーが発生しました");
        setIsLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("通信エラーが発生しました");
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handlePurchase}
        disabled={isLoading}
        className="w-full py-2.5 rounded-lg bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-semibold transition-colors text-sm"
      >
        {isLoading ? "処理中..." : "購入する"}
      </button>

      {/* ログインしていない場合のアカウント作成案内 */}
      {showSignupPrompt && (
        <div className="mt-3 bg-slate-800 border border-white/20 rounded-xl p-4">
          <p className="text-white text-sm font-semibold mb-0.5">
            購入にはアカウントが必要です
          </p>
          <p className="text-slate-400 text-xs mb-3">
            登録すると 5クレジット が無料でもらえます
          </p>
          <Link
            href="/signup"
            className="block w-full text-center py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold transition-colors mb-2"
          >
            無料で登録する
          </Link>
          <Link
            href="/login?next=/pricing"
            className="block w-full text-center py-2 rounded-lg border border-white/20 hover:border-white/40 text-slate-300 hover:text-white text-sm transition-colors"
          >
            ログイン
          </Link>
        </div>
      )}

      {error && (
        <p className="text-red-400 text-xs mt-2 text-center">{error}</p>
      )}
    </div>
  );
}

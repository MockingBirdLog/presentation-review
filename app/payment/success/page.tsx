/**
 * app/payment/success/page.tsx — 決済完了ページ（/payment/success）
 *
 * Stripe での決済が完了すると、このページにリダイレクトされます。
 * クレジットの加算は Webhook が処理するため、
 * ここでは完了メッセージを表示するだけです。
 */

import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-10 text-center">

        {/* 完了アイコン */}
        <div className="w-16 h-16 bg-green-500/20 border border-green-400/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">✓</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          購入ありがとうございます！
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          クレジットはまもなくアカウントに反映されます。
          <br />
          反映まで少し時間がかかる場合があります。
        </p>

        {/* ダッシュボードへのボタン */}
        <Link
          href="/dashboard"
          className="block w-full bg-blue-500 hover:bg-blue-400 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          ダッシュボードへ戻る
        </Link>

        <Link
          href="/pricing"
          className="block mt-3 text-slate-400 hover:text-white text-sm transition-colors"
        >
          追加購入する
        </Link>
      </div>
    </div>
  );
}

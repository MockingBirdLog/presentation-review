"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function DeleteConfirmationPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [invalidToken, setInvalidToken] = useState(!token);

  async function handleConfirm() {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/delete-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "エラーが発生しました");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError("通信エラーが発生しました");
      setIsLoading(false);
    }
  }

  if (!token || invalidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-6">
        <div className="bg-white/5 border border-white/10 rounded-lg p-8 max-w-md w-full text-center animate-fadeInScale">
          <h1 className="text-2xl font-bold text-white mb-4">無効なリンク</h1>
          <p className="text-slate-400 mb-6">
            削除用のリンクが無効です。新しいリクエストを送信してください。
          </p>
          <Link
            href="/dashboard/settings"
            className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            設定に戻る
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-6">
        <div className="bg-white/5 border border-white/10 rounded-lg p-8 max-w-md w-full text-center animate-fadeInScale">
          <h1 className="text-2xl font-bold text-white mb-4">アカウントが削除されました</h1>
          <p className="text-slate-400 mb-6">
            アカウントとすべてのデータが永久に削除されました。
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-6">
      <div className="bg-white/5 border border-white/10 rounded-lg p-8 max-w-md w-full animate-fadeInScale">
        <h1 className="text-2xl font-bold text-white mb-4">アカウント削除の確認</h1>

        <div className="bg-red-500/10 border border-red-400/30 rounded p-4 mb-6">
          <p className="text-red-300 text-sm font-semibold">⚠ 最終確認</p>
          <p className="text-red-200 text-sm mt-2">
            このアクションは取り消せません。すべてのデータが永久に削除されます。
          </p>
        </div>

        <p className="text-slate-400 text-sm mb-6">
          本当にアカウントを削除しますか？以下の項目が削除されます：
        </p>

        <ul className="text-slate-400 text-sm space-y-2 mb-6">
          <li>✓ アカウント情報</li>
          <li>✓ アップロードされたプレゼン</li>
          <li>✓ 購入履歴</li>
          <li>✓ クレジット</li>
        </ul>

        {error && <p className="text-red-400 text-xs mb-4">{error}</p>}

        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className="flex-1 text-center px-4 py-2 rounded-lg border border-white/20 text-slate-300 hover:text-white transition-colors font-semibold"
          >
            キャンセル
          </Link>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors disabled:opacity-50"
          >
            {isLoading ? "削除中..." : "完全に削除する"}
          </button>
        </div>
      </div>
    </div>
  );
}

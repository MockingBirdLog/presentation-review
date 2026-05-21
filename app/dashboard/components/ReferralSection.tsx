/**
 * app/dashboard/components/ReferralSection.tsx — 友達紹介セクション
 *
 * ユーザーの紹介リンクを表示し、コピーボタンを提供します。
 * コピーボタンはクライアント側の処理が必要なので "use client" を使います。
 */

"use client";

import { useState } from "react";

type Props = {
  referralUrl: string; // 紹介用 URL（例: https://xxx.com/signup?ref=abc12345）
  referralCount: number; // 紹介して登録してくれた人数
};

export default function ReferralSection({ referralUrl, referralCount }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    // 2秒後に「コピーしました」の表示をリセット
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      {/* タイトル */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">🎁</span>
        <h2 className="text-white font-semibold text-lg">友達を紹介して +5 クレジット</h2>
      </div>
      <p className="text-slate-400 text-sm mb-5">
        あなたの紹介リンクから登録してくれた友達と、あなたの両方に <span className="text-yellow-300 font-medium">+5 クレジット</span> が付与されます。
      </p>

      {/* 紹介リンク + コピーボタン */}
      <div className="flex gap-2">
        <input
          type="text"
          value={referralUrl}
          readOnly
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-slate-300 text-sm focus:outline-none select-all"
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
        <button
          onClick={handleCopy}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            copied
              ? "bg-green-500/30 border border-green-400/50 text-green-300"
              : "bg-blue-500/20 border border-blue-400/30 text-blue-300 hover:bg-blue-500/30"
          }`}
        >
          {copied ? "✓ コピー済み" : "コピー"}
        </button>
      </div>

      {/* 紹介実績 */}
      {referralCount > 0 && (
        <p className="text-slate-500 text-xs mt-3">
          これまでに <span className="text-slate-300 font-medium">{referralCount} 人</span> があなたの紹介で登録しました
        </p>
      )}
    </div>
  );
}

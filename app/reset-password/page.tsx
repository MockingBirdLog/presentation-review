/**
 * app/reset-password/page.tsx — パスワードリセット申請ページ（/reset-password）
 *
 * メールアドレスを入力すると、Supabase がリセット用リンクを送信します。
 * リンクをクリックすると /reset-password/new に遷移して新しいパスワードを設定できます。
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // リセット完了後にこのURLへリダイレクトされる
      // /auth/callback が code を受け取り、セッション確立後に /reset-password/new へ遷移する
      redirectTo: `${location.origin}/auth/callback?next=/reset-password/new`,
    });

    if (error) {
      setError("送信に失敗しました。メールアドレスを確認してください。");
      setLoading(false);
      return;
    }

    setDone(true);
  }

  // 送信完了画面
  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 text-center animate-fadeInScale">
          <p className="text-4xl mb-4">📧</p>
          <h2 className="text-xl font-bold text-white mb-2">メールを送信しました</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            <span className="text-blue-300 font-medium">{email}</span>{" "}
            にパスワードリセット用のリンクを送りました。
            <br />
            メール内のリンクをクリックしてください。
          </p>
          <p className="text-slate-500 text-xs mt-4">
            メールが届かない場合は迷惑メールフォルダをご確認ください
          </p>
          <Link
            href="/login"
            className="inline-block mt-6 text-blue-400 hover:text-blue-300 text-sm underline"
          >
            ログインページへ →
          </Link>
        </div>
      </div>
    );
  }

  // メールアドレス入力画面
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 animate-fadeInScale">

        <div className="text-center mb-8 animate-fadeInUp">
          <h1 className="text-2xl font-bold text-white mb-1">パスワードをリセット</h1>
          <p className="text-slate-400 text-sm">
            登録済みのメールアドレスを入力してください
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? "送信中..." : "リセットメールを送信"}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          <Link href="/login" className="text-blue-400 hover:text-blue-300 underline">
            ← ログインに戻る
          </Link>
        </p>
      </div>
    </div>
  );
}

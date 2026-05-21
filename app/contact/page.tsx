/**
 * app/contact/page.tsx — お問い合わせページ（/contact）
 *
 * 名前・メールアドレス・内容を入力して送信するフォームです。
 * 送信内容は Supabase に保存され、管理者が確認できます。
 */

"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "送信に失敗しました。しばらくしてから再度お試しください。");
      setLoading(false);
      return;
    }

    setDone(true);
  }

  // ==============================
  // 送信完了後の画面
  // ==============================
  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 text-center">
          <p className="text-4xl mb-4">✅</p>
          <h2 className="text-xl font-bold text-white mb-2">送信が完了しました</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            お問い合わせを受け付けました。
            <br />
            内容を確認の上、ご返信いたします。
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            トップへ戻る
          </Link>
        </div>
      </div>
    );
  }

  // ==============================
  // フォーム画面
  // ==============================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">

      {/* ヘッダー */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-lg">
            プレゼン添削AI
          </Link>
          <Link
            href="/login"
            className="text-slate-300 hover:text-white text-sm transition-colors"
          >
            ログイン
          </Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-16">

        {/* タイトル */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">お問い合わせ</h1>
          <p className="text-slate-400 text-sm">
            ご質問・ご要望はこちらからお送りください。
          </p>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">
              お名前 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="山田 太郎"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">
              メールアドレス <span className="text-red-400">*</span>
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

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">
              お問い合わせ内容 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              placeholder="ご質問・ご要望をご記入ください"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? "送信中..." : "送信する"}
          </button>
        </form>

        <p className="text-center text-slate-500 text-xs mt-8">
          通常 1〜3 営業日以内にご返信いたします
        </p>
      </main>
    </div>
  );
}

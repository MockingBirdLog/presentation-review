/**
 * app/signup/page.tsx — 新規登録ページ（/signup）
 *
 * メールアドレスとパスワードで新しいアカウントを作成する画面です。
 * URL に ?ref=コード が付いていれば、友達紹介として処理します。
 * 使い捨てメールドメインはサーバー側でブロックします。
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  // URL の ?ref=XXXXXX から紹介コードを読み取る
  const [refCode, setRefCode] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) setRefCode(ref);
  }, []);

  // ==============================
  // サインアップ処理
  // ==============================
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // ==============================
    // Step 1: サーバー側でメールドメインをチェック
    // ==============================
    const checkRes = await fetch("/api/auth/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!checkRes.ok) {
      const data = await checkRes.json();
      setError(data.error ?? "このメールアドレスは使用できません");
      setLoading(false);
      return;
    }

    // ==============================
    // Step 2: Supabase でアカウントを作成
    // ==============================
    // 紹介コードがあればユーザーメタデータに保存する
    // → メール確認後の /auth/callback で紹介処理に使う
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: refCode ? { referral_code: refCode } : undefined,
      },
    });

    if (error) {
      setError(
        error.message === "User already registered"
          ? "このメールアドレスはすでに登録されています"
          : error.message
      );
      setLoading(false);
      return;
    }

    setDone(true);
  }

  // ==============================
  // 登録完了後の画面
  // ==============================
  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 text-center animate-fadeInScale">
          {/* 無料クレジット付与の通知 */}
          <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl px-4 py-3 mb-6">
            <p className="text-blue-300 font-semibold">
              🎉 {refCode ? "10" : "5"} クレジットをプレゼント！
            </p>
            <p className="text-blue-200/70 text-sm mt-0.5">
              {refCode
                ? "登録ボーナス 5 ＋ 紹介ボーナス 5 クレジット"
                : "登録完了後すぐに使えます"}
            </p>
          </div>

          <p className="text-4xl mb-4">📧</p>
          <h2 className="text-xl font-bold text-white mb-2">確認メールを送信しました</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            <span className="text-blue-300 font-medium">{email}</span>{" "}
            に確認メールを送りました。
            <br />
            メール内のリンクをクリックすると登録が完了し、
            <br />
            クレジットが付与されます。
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

  // ==============================
  // 登録フォームの画面
  // ==============================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 animate-fadeInScale">

        {/* タイトル */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">新規登録</h1>
          {/* クレジットのアピール */}
          {refCode ? (
            <div className="space-y-1 mt-2">
              <div className="inline-flex items-center gap-1.5 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm px-3 py-1 rounded-full">
                🎁 登録で 5 クレジット無料プレゼント
              </div>
              <div className="block">
                <div className="inline-flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 text-sm px-3 py-1 rounded-full">
                  ✨ 友達紹介ボーナス ＋5 クレジット
                </div>
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm px-3 py-1 rounded-full mt-2">
              🎁 登録で 5 クレジット無料プレゼント
            </div>
          )}
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* 登録フォーム */}
        <form onSubmit={handleSignup} className="space-y-5">
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

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••（6文字以上）"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>

          {/* 利用規約への同意 */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-blue-500 cursor-pointer shrink-0"
            />
            <span className="text-slate-400 text-sm leading-relaxed">
              <Link href="/terms" target="_blank" className="text-blue-400 hover:text-blue-300 underline">
                利用規約
              </Link>
              {" "}および{" "}
              <Link href="/privacy" target="_blank" className="text-blue-400 hover:text-blue-300 underline">
                プライバシーポリシー
              </Link>
              に同意します
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || !agreed}
            className="w-full bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? "確認中..." : "無料で登録する"}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          すでにアカウントをお持ちの方は{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 underline">
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}

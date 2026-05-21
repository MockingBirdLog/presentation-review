/**
 * app/login/page.tsx — ログインページ（/login）
 *
 * "use client" を使うクライアントコンポーネントです。
 * フォームへの入力やボタンのクリックはブラウザ側の操作なので、
 * クライアントコンポーネントにする必要があります。
 *
 * useState：入力値やエラーメッセージを管理する React の機能
 */

"use client"; // ブラウザで動くコンポーネントであることを宣言

import { useState } from "react";
import { useRouter } from "next/navigation"; // ページ遷移に使う Next.js のフック
import Link from "next/link"; // <a> タグの代わりに使う Next.js のリンクコンポーネント
import { createClient } from "@/lib/supabase/client"; // ブラウザ用 Supabase クライアント

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  // ==============================
  // State（状態管理）
  // ==============================
  // useState(初期値) で状態変数を作る。[値, 値を更新する関数] という形
  const [email, setEmail] = useState("");       // メールアドレスの入力値
  const [password, setPassword] = useState(""); // パスワードの入力値
  const [error, setError] = useState("");       // エラーメッセージ
  const [loading, setLoading] = useState(false); // 送信中かどうか

  // ==============================
  // ログイン処理
  // ==============================
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); // フォームのデフォルト動作（ページリロード）を止める
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // エラーが起きた場合はメッセージを表示
      setError("メールアドレスまたはパスワードが正しくありません");
      setLoading(false);
      return;
    }

    // 成功したらダッシュボードへ移動
    router.push("/dashboard");
    router.refresh(); // サーバー側のセッションも更新する
  }

  return (
    // 画面全体を使って中央に配置
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">

      {/* ログインカード */}
      {/* backdrop-blur：すりガラス風の効果 */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 animate-fadeInScale">

        {/* タイトル */}
        <div className="text-center mb-8 animate-fadeInUp">
          <h1 className="text-2xl font-bold text-white mb-1">ログイン</h1>
          <p className="text-slate-400 text-sm">アカウントにサインインする</p>
        </div>

        {/* エラーメッセージ（エラーがある場合だけ表示） */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* ログインフォーム */}
        <form onSubmit={handleLogin} className="space-y-5 animate-fadeInUp" style={{ animationDelay: "0.1s" }}>

          {/* メールアドレス入力欄 */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // 入力するたびに state を更新
              required
              placeholder="you@example.com"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>

          {/* パスワード入力欄 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-slate-300 text-sm font-medium">
                パスワード
              </label>
              <Link
                href="/reset-password"
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                パスワードを忘れた方
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>

          {/* ログインボタン */}
          <button
            type="submit"
            disabled={loading} // 送信中は無効化
            className="w-full bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>

        {/* サインアップへのリンク */}
        <p className="text-center text-slate-400 text-sm mt-6">
          アカウントをお持ちでない方は{" "}
          {/* Link コンポーネントはページ全体をリロードせず高速に遷移する */}
          <Link href="/signup" className="text-blue-400 hover:text-blue-300 underline">
            新規登録
          </Link>
        </p>
      </div>
    </div>
  );
}

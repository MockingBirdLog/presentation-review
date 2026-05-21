/**
 * app/reset-password/new/page.tsx — 新しいパスワード設定ページ（/reset-password/new）
 *
 * パスワードリセットメールのリンクを踏んだ後にリダイレクトされるページです。
 * /auth/callback でセッションが確立済みなので、ここで新パスワードを設定できます。
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // パスワードの一致確認
    if (password !== confirm) {
      setError("パスワードが一致しません");
      return;
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上で設定してください");
      return;
    }

    setLoading(true);

    // Supabase でパスワードを更新する
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("パスワードの更新に失敗しました。リセットメールのリンクが期限切れの可能性があります。");
      setLoading(false);
      return;
    }

    // 成功したらダッシュボードへ
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">新しいパスワードを設定</h1>
          <p className="text-slate-400 text-sm">6文字以上で入力してください</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">
              新しいパスワード
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

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1.5">
              新しいパスワード（確認）
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>

          {/* パスワードが一致しているかをリアルタイムで表示 */}
          {confirm && (
            <p className={`text-xs ${password === confirm ? "text-green-400" : "text-red-400"}`}>
              {password === confirm ? "✓ パスワードが一致しています" : "✗ パスワードが一致しません"}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || password !== confirm || password.length < 6}
            className="w-full bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? "更新中..." : "パスワードを更新する"}
          </button>
        </form>
      </div>
    </div>
  );
}

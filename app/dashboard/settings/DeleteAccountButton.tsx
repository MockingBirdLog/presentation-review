"use client";

import { useState } from "react";

export default function DeleteAccountButton() {
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleDelete() {
    if (!password) {
      setError("パスワードを入力してください");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/delete-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "エラーが発生しました");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setShowModal(false);
    } catch (err) {
      setError("通信エラーが発生しました");
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-6 text-center">
        <h3 className="text-white font-semibold mb-2">確認メールを送信しました</h3>
        <p className="text-slate-400 text-sm">
          メールに記載されたリンクをクリックして、アカウント削除を完了してください。
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        アカウントを削除
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full border border-white/10">
            <h2 className="text-white font-bold text-lg mb-4">アカウント削除</h2>

            <div className="bg-red-500/10 border border-red-400/30 rounded p-4 mb-6">
              <p className="text-red-300 text-sm font-semibold">⚠ 警告</p>
              <p className="text-red-200 text-sm mt-2">
                このアクションは取り消せません。すべてのデータが永久に削除されます。
              </p>
            </div>

            <p className="text-slate-400 text-sm mb-4">
              パスワードを入力して、削除リクエストを送信してください。確認メールが届きます。
            </p>

            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              disabled={isLoading}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-500 mb-4 disabled:opacity-50"
            />

            {error && <p className="text-red-400 text-xs mb-4">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setPassword("");
                  setError("");
                }}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors disabled:opacity-50"
              >
                {isLoading ? "送信中..." : "リクエスト送信"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

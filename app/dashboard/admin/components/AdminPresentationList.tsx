/**
 * app/dashboard/admin/components/AdminPresentationList.tsx — 管理者用プレゼン一覧
 *
 * すべてのプレゼンテーションを管理用ビューで表示します。
 */

"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import AdminFileUploadDialog from "./AdminFileUploadDialog";

interface Presentation {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  review_style?: string;
  custom_instructions?: string;
  status?: string;
  reviewed_file_path?: string;
  corrections_file_path?: string;
  created_at: string;
  updated_at?: string;
  user?: {
    id: string;
    email: string;
  };
}

interface AdminPresentationListProps {
  presentations: Presentation[];
  flaggedUserIds: string[]; // 不正フラグが立っているユーザーIDの一覧
}

export default function AdminPresentationList({
  presentations,
  flaggedUserIds,
}: AdminPresentationListProps) {
  const supabase = createClient();
  const router = useRouter();

  const [statusChanging, setStatusChanging] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  // ==============================
  // 管理者用ダウンロード
  // ==============================
  async function handleAdminDownload(filePath: string, fileName: string) {
    setDownloading(filePath);
    try {
      const res = await fetch(
        `/api/admin/download?path=${encodeURIComponent(filePath)}&name=${encodeURIComponent(fileName)}`
      );
      const data = await res.json();

      if (!res.ok) {
        alert("ダウンロードに失敗しました: " + data.error);
        setDownloading(null);
        return;
      }

      // 署名付きURLを使ってファイルをダウンロード
      const link = document.createElement("a");
      link.href = data.url;
      link.download = fileName;
      link.click();
    } catch {
      alert("ダウンロードエラーが発生しました");
    }
    setDownloading(null);
  }

  // ==============================
  // ステータスを変更（完了時はメール通知も送る）
  // ==============================
  async function handleStatusChange(presentationId: string, newStatus: string) {
    setStatusChanging(presentationId);

    try {
      const res = await fetch("/api/admin/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ presentationId, newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert("ステータス変更に失敗しました: " + (data.error ?? "不明なエラー"));
        setStatusChanging(null);
        return;
      }

      router.refresh();
    } catch {
      alert("エラーが発生しました");
      setStatusChanging(null);
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + " KB";
    }
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getStatusBadge(status?: string) {
    switch (status) {
      case "processing":
        return {
          label: "添削中",
          color: "bg-yellow-500/20 text-yellow-300",
          emoji: "⏳",
        };
      case "completed":
        return {
          label: "完了",
          color: "bg-green-500/20 text-green-300",
          emoji: "✅",
        };
      default:
        return {
          label: "受付中",
          color: "bg-blue-500/20 text-blue-300",
          emoji: "📝",
        };
    }
  }

  return (
    <div className="space-y-3">
      {presentations.map((pres) => {
        const statusBadge = getStatusBadge(pres.status);
        const isCompleted = pres.status === "completed";

        const isFlagged = flaggedUserIds.includes(pres.user?.id ?? "");

        return (
          <div
            key={pres.id}
            className={`border rounded-xl p-6 transition-colors ${
              isFlagged
                ? "bg-yellow-500/5 border-yellow-400/30 hover:bg-yellow-500/10"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            {/* 上部：ユーザーとファイル情報 */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                {/* ユーザー情報（フラグ付き） */}
                <p className="text-slate-400 text-sm mb-2 flex items-center gap-2">
                  {isFlagged && (
                    <span title="複数アカウントの疑いあり">🚩</span>
                  )}
                  {pres.user?.email || "Unknown"}
                </p>

                {/* ファイル名 */}
                <p className="text-white font-semibold text-lg truncate">
                  {pres.file_name}
                </p>

                {/* メタデータ */}
                <p className="text-slate-400 text-sm mt-1">
                  {formatFileSize(pres.file_size)} • {formatDate(pres.created_at)}
                </p>
              </div>

              {/* ステータスバッジ */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold flex-shrink-0 ml-4 ${statusBadge.color}`}
              >
                <span>{statusBadge.emoji}</span>
                {statusBadge.label}
              </span>
            </div>

            {/* リクエスト情報 */}
            <div className="bg-white/5 rounded-lg p-4 mb-4 space-y-2">
              {/* 添削スタイル */}
              <p className="text-slate-300 text-sm">
                <span className="text-slate-400">添削スタイル：</span>
                {pres.review_style === "lenient" ? "😊 優しめ"
                  : pres.review_style === "strict" ? "🔥 厳しめ"
                  : "😐 普通"}
              </p>
              {/* カスタムリクエスト */}
              {pres.custom_instructions && (
                <p className="text-slate-300 text-sm">
                  <span className="text-slate-400">リクエスト：</span>
                  {pres.custom_instructions}
                </p>
              )}
            </div>

            {/* ユーザーファイルのダウンロード */}
            <div className="mb-4">
              <p className="text-slate-400 text-xs mb-2 font-medium">元ファイル</p>
              <button
                onClick={() => handleAdminDownload(pres.file_path, pres.file_name)}
                disabled={downloading === pres.file_path}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-600/50 border border-slate-500/50 text-slate-200 hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {downloading === pres.file_path ? (
                  "ダウンロード中..."
                ) : (
                  <>
                    📥 {pres.file_name}
                  </>
                )}
              </button>
            </div>

            {/* ステータス変更ボタン */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() =>
                  handleStatusChange(
                    pres.id,
                    pres.status === "processing" ? "pending" : "processing"
                  )
                }
                disabled={statusChanging === pres.id}
                className="px-4 py-2 rounded-lg bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 hover:bg-yellow-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {pres.status === "processing" ? "📝 受付中に戻す" : "⏳ 添削中へ"}
              </button>

              {pres.status !== "completed" && (
                <button
                  onClick={() =>
                    handleStatusChange(pres.id, "completed")
                  }
                  disabled={statusChanging === pres.id}
                  className="px-4 py-2 rounded-lg bg-green-500/20 border border-green-400/30 text-green-300 hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  ✅ 完了にする
                </button>
              )}
            </div>

            {/* ファイルアップロード（完了時のみ表示） */}
            {isCompleted && (
              <div>
                {/* 既にアップロード済みの場合 */}
                {pres.reviewed_file_path && pres.corrections_file_path ? (
                  <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4 mb-4">
                    <p className="text-green-300 text-sm font-semibold mb-2">
                      ✅ 両方のファイルがアップロード済みです
                    </p>
                    <ul className="text-green-300 text-sm space-y-1">
                      <li>• 添削済みプレゼン：アップロード済み</li>
                      <li>• 修正点 (PDF)：アップロード済み</li>
                    </ul>
                  </div>
                ) : (
                  <button
                    onClick={() => setUploadingId(pres.id)}
                    className="w-full px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300 hover:bg-blue-500/30 transition-colors text-sm font-medium"
                  >
                    📤 ファイルをアップロード
                  </button>
                )}

                {/* アップロードダイアログ */}
                {uploadingId === pres.id && (
                  <AdminFileUploadDialog
                    presentationId={pres.id}
                    fileName={pres.file_name}
                    originalFileType={pres.file_type}
                    onClose={() => setUploadingId(null)}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

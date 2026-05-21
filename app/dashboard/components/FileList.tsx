/**
 * app/dashboard/components/FileList.tsx — アップロード済みファイルの一覧
 *
 * ステータス、編集日時、コメント編集機能を表示します。
 * 「受付中」のみコメントが編集できます。
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import EditCommentDialog from "./EditCommentDialog";

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
}

interface FileListProps {
  presentations: Presentation[];
}

export default function FileList({ presentations }: FileListProps) {
  const router = useRouter();
  const supabase = createClient();

  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  async function handleDelete(id: string, filePath: string) {
    if (!confirm("このファイルを削除してもよろしいですか？")) {
      return;
    }

    setIsDeleting(id);

    try {
      const { error: storageError } = await supabase.storage
        .from("presentations")
        .remove([filePath]);

      if (storageError) {
        alert("削除に失敗しました: " + storageError.message);
        setIsDeleting(null);
        return;
      }

      const { error: dbError } = await supabase
        .from("presentations")
        .delete()
        .eq("id", id);

      if (dbError) {
        alert("データベースから削除できませんでした: " + dbError.message);
        setIsDeleting(null);
        return;
      }

      router.refresh();
    } catch (err) {
      alert("予期しないエラーが発生しました");
      setIsDeleting(null);
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

  function getFileIcon(fileType: string): string {
    if (fileType.includes("pdf")) {
      return "📄";
    }
    if (fileType.includes("presentationml")) {
      return "📊";
    }
    return "📃";
  }

  function getReviewStyleLabel(style?: string): { label: string; emoji: string } {
    switch (style) {
      case "lenient":
        return { label: "優しめ", emoji: "😊" };
      case "strict":
        return { label: "厳しめ", emoji: "🔥" };
      default:
        return { label: "普通", emoji: "😐" };
    }
  }

  function getStatusInfo(status?: string): { label: string; color: string; emoji: string } {
    switch (status) {
      case "processing":
        return { label: "添削中", color: "bg-yellow-500/20 text-yellow-300", emoji: "⏳" };
      case "completed":
        return { label: "完了", color: "bg-green-500/20 text-green-300", emoji: "✅" };
      default:
        return { label: "受付中", color: "bg-blue-500/20 text-blue-300", emoji: "📝" };
    }
  }

  // ==============================
  // ファイルをダウンロード
  // ==============================
  async function handleDownload(filePath: string, fileName: string) {
    setDownloading(filePath);

    try {
      const { data, error } = await supabase.storage
        .from("presentations")
        .download(filePath);

      if (error) {
        alert("ダウンロードに失敗しました: " + error.message);
        setDownloading(null);
        return;
      }

      // ブラウザでダウンロード
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);

      setDownloading(null);
    } catch (err) {
      alert("ダウンロードエラーが発生しました");
      setDownloading(null);
    }
  }

  if (presentations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-slate-400">
          アップロードされたファイルはまだありません
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {presentations.map((file) => {
        const styleInfo = getReviewStyleLabel(file.review_style);
        const statusInfo = getStatusInfo(file.status);
        const isPending = file.status === "pending" || !file.status;
        const editingFile = editingId === file.id ? file : null;

        return (
          <div
            key={file.id}
            className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors"
          >
            {/* ファイル情報と削除ボタン */}
            <div className="flex items-start justify-between gap-4 mb-3">
              {/* 左側：アイコンとファイル情報 */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {/* アイコン */}
                <span className="text-2xl flex-shrink-0 mt-1">
                  {getFileIcon(file.file_type)}
                </span>

                {/* ファイル名とメタデータ */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {file.file_name}
                  </p>
                  <p className="text-slate-400 text-sm">
                    {formatFileSize(file.file_size)} • {formatDate(file.created_at)}
                  </p>
                </div>
              </div>

              {/* 削除ボタン */}
              <button
                onClick={() => handleDelete(file.id, file.file_path)}
                disabled={isDeleting !== null}
                className="text-slate-400 hover:text-red-400 text-sm px-4 py-1.5 rounded-lg border border-slate-600 hover:border-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 whitespace-nowrap"
              >
                {isDeleting === file.id ? "削除中..." : "削除"}
              </button>
            </div>

            {/* ステータスと更新日時 */}
            <div className="ml-12 mb-3 flex items-center gap-3">
              {/* ステータスバッジ */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}
              >
                <span>{statusInfo.emoji}</span>
                {statusInfo.label}
              </span>

              {/* 更新日時 */}
              {file.updated_at && (
                <span className="text-slate-500 text-xs">
                  更新：{formatDate(file.updated_at)}
                </span>
              )}
            </div>

            {/* 添削設定 */}
            <div className="ml-12 space-y-2 text-sm mb-4">
              {/* 添削スタイル */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400">添削スタイル：</span>
                <span className="text-lg">{styleInfo.emoji}</span>
                <span className="text-slate-300 font-medium">{styleInfo.label}</span>
              </div>

              {/* カスタムコメント */}
              {file.custom_instructions && (
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 flex-shrink-0">リクエスト：</span>
                  <span className="text-slate-300 italic break-words">
                    「{file.custom_instructions}」
                  </span>
                </div>
              )}
            </div>

            {/* 編集ボタン（受付中のみ） */}
            {isPending && (
              <div className="ml-12">
                <button
                  onClick={() => setEditingId(file.id)}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium underline"
                >
                  ✏️ 添削設定を編集
                </button>
              </div>
            )}

            {/* 完了時のダウンロード */}
            {file.status === "completed" && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-white font-semibold text-sm mb-3">
                  📥 添削完了ファイル
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* 添削済みプレゼン */}
                  <button
                    onClick={() => {
                      if (file.reviewed_file_path) {
                        const fileName = file.reviewed_file_path.includes(".pdf")
                          ? `${file.file_name.replace(/\.[^/.]+$/, "")}-reviewed.pdf`
                          : `${file.file_name.replace(/\.[^/.]+$/, "")}-reviewed.pptx`;
                        handleDownload(file.reviewed_file_path, fileName);
                      }
                    }}
                    disabled={downloading !== null || !file.reviewed_file_path}
                    className="px-4 py-2 rounded-lg bg-green-500/20 border border-green-400/30 text-green-300 hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {downloading === file.reviewed_file_path
                      ? "ダウンロード中..."
                      : "📊 添削済みプレゼン"}
                  </button>

                  {/* 修正点 PDF */}
                  <button
                    onClick={() => {
                      if (file.corrections_file_path) {
                        const fileName = `${file.file_name.replace(/\.[^/.]+$/, "")}-修正点.pdf`;
                        handleDownload(file.corrections_file_path, fileName);
                      }
                    }}
                    disabled={downloading !== null || !file.corrections_file_path}
                    className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300 hover:bg-blue-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {downloading === file.corrections_file_path
                      ? "ダウンロード中..."
                      : "📝 修正点ファイル"}
                  </button>
                </div>
              </div>
            )}

            {/* 編集ダイアログ */}
            {editingFile && (
              <EditCommentDialog
                presentationId={file.id}
                fileName={file.file_name}
                reviewStyle={file.review_style || "normal"}
                customInstructions={file.custom_instructions || null}
                onClose={() => setEditingId(null)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * app/dashboard/admin/components/AdminFileUploadDialog.tsx — 管理者用ファイルアップロード
 *
 * 添削済みプレゼンと修正点(PDF)をアップロードします。
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface AdminFileUploadDialogProps {
  presentationId: string;
  fileName: string;
  originalFileType: string;
  onClose: () => void;
}

export default function AdminFileUploadDialog({
  presentationId,
  fileName,
  originalFileType,
  onClose,
}: AdminFileUploadDialogProps) {
  const supabase = createClient();
  const router = useRouter();

  const [reviewedFile, setReviewedFile] = useState<File | null>(null);
  const [correctionsFile, setCorrectionsFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");

  // ==============================
  // ファイル検証
  // ==============================
  function validateFiles(): string | null {
    if (!reviewedFile) {
      return "添削済みプレゼンを選択してください";
    }
    if (!correctionsFile) {
      return "修正点 PDF を選択してください";
    }

    // 添削済みプレゼンはPDFまたはPowerPoint
    if (
      !reviewedFile.type.includes("pdf") &&
      !reviewedFile.type.includes("presentationml")
    ) {
      return "添削済みプレゼンは PDF または PowerPoint のみ対応です";
    }

    // 修正点は PDF のみ
    if (!correctionsFile.type.includes("pdf")) {
      return "修正点は PDF ファイルのみ対応です";
    }

    return null;
  }

  // ==============================
  // ファイルをアップロード
  // ==============================
  async function handleUpload() {
    setError("");
    const validationError = validateFiles();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);

    try {
      const timestamp = Date.now();
      const adminFolder = `admin/${presentationId}`;

      // 添削済みプレゼンをアップロード
      setProgress("添削済みプレゼンをアップロード中...");
      const reviewedExtension = reviewedFile!.name.split(".").pop();
      const reviewedPath = `${adminFolder}/${timestamp}-reviewed.${reviewedExtension}`;

      const { error: reviewedError } = await supabase.storage
        .from("presentations")
        .upload(reviewedPath, reviewedFile!);

      if (reviewedError) {
        setError("添削済みプレゼンのアップロードに失敗: " + reviewedError.message);
        setIsUploading(false);
        return;
      }

      // 修正点をアップロード
      setProgress("修正点ファイルをアップロード中...");
      const correctionsPath = `${adminFolder}/${timestamp}-corrections.pdf`;

      const { error: correctionsError } = await supabase.storage
        .from("presentations")
        .upload(correctionsPath, correctionsFile!);

      if (correctionsError) {
        setError("修正点ファイルのアップロードに失敗: " + correctionsError.message);
        setIsUploading(false);
        return;
      }

      // データベースに保存
      setProgress("情報を保存中...");
      const { error: dbError } = await supabase
        .from("presentations")
        .update({
          reviewed_file_path: reviewedPath,
          corrections_file_path: correctionsPath,
        })
        .eq("id", presentationId);

      if (dbError) {
        setError("情報の保存に失敗: " + dbError.message);
        setIsUploading(false);
        return;
      }

      // 成功
      setProgress("");
      router.refresh();
      onClose();
    } catch (err) {
      setError("予期しないエラーが発生しました");
      setIsUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full">
        {/* ヘッダー */}
        <div className="border-b border-white/10 px-6 py-4">
          <h2 className="text-xl font-bold text-white">ファイルをアップロード</h2>
          <p className="text-slate-400 text-sm mt-1 truncate">{fileName}</p>
        </div>

        {/* コンテンツ */}
        <div className="px-6 py-6 space-y-6">
          {/* 添削済みプレゼン */}
          <div>
            <label className="block text-white font-semibold mb-2">
              📊 添削済みプレゼン
            </label>
            <p className="text-slate-400 text-sm mb-3">
              元のファイルと同じ形式（PDF または PowerPoint）
            </p>
            <input
              type="file"
              onChange={(e) => setReviewedFile(e.target.files?.[0] || null)}
              accept=".pdf,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation"
              disabled={isUploading}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm file:bg-blue-500 file:text-white file:border-0 file:rounded file:px-4 file:py-1 file:cursor-pointer disabled:opacity-50"
            />
            {reviewedFile && (
              <p className="text-green-300 text-sm mt-2">
                ✓ {reviewedFile.name}
              </p>
            )}
          </div>

          {/* 修正点 PDF */}
          <div>
            <label className="block text-white font-semibold mb-2">
              📝 修正点ファイル (PDF)
            </label>
            <p className="text-slate-400 text-sm mb-3">
              直した点や改善案をまとめたPDF
            </p>
            <input
              type="file"
              onChange={(e) => setCorrectionsFile(e.target.files?.[0] || null)}
              accept=".pdf,application/pdf"
              disabled={isUploading}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm file:bg-blue-500 file:text-white file:border-0 file:rounded file:px-4 file:py-1 file:cursor-pointer disabled:opacity-50"
            />
            {correctionsFile && (
              <p className="text-green-300 text-sm mt-2">
                ✓ {correctionsFile.name}
              </p>
            )}
          </div>

          {/* プログレス */}
          {progress && (
            <div className="bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm rounded-lg px-4 py-3">
              {progress}
            </div>
          )}

          {/* エラー */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="border-t border-white/10 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            disabled={isUploading}
            className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-slate-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            キャンセル
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading || !reviewedFile || !correctionsFile}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/50 text-white font-semibold transition-colors disabled:cursor-not-allowed"
          >
            {isUploading ? "アップロード中..." : "アップロード"}
          </button>
        </div>
      </div>
    </div>
  );
}

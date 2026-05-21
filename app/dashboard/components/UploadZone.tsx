/**
 * app/dashboard/components/UploadZone.tsx — ファイルアップロード用コンポーネント
 *
 * ドラッグ&ドロップでファイルをアップロードする機能を提供します。
 * アップロード前にページ数を自動カウントし、クレジットを消費します。
 *
 * 流れ：
 * 1. ファイルを選択・ドロップ
 * 2. ページ数を自動カウント（PDF・PPTX対応）
 * 3. 確認画面を表示（何クレジット消費するか）
 * 4. 確認後にアップロード＆クレジット消費
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ReviewSettingsDialog from "./ReviewSettingsDialog";

interface UploadZoneProps {
  userId: string;
  credits: number; // 現在のクレジット残高
}

export default function UploadZone({ userId, credits }: UploadZoneProps) {
  const router = useRouter();
  const supabase = createClient();

  // ==============================
  // State（状態管理）
  // ==============================
  const [isDragging, setIsDragging] = useState(false);
  const [isCounting, setIsCounting] = useState(false);   // ページ数カウント中
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [uploadedPresentationId, setUploadedPresentationId] = useState("");

  // 確認ステップ用
  const [pendingFile, setPendingFile] = useState<File | null>(null); // 確認待ちのファイル
  const [pageCount, setPageCount] = useState<number>(0);             // カウントしたページ数

  const ALLOWED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  // ==============================
  // ファイル検証
  // ==============================
  function validateFile(file: File): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "PDF または PowerPoint ファイルのみ対応しています";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "ファイルサイズは 50MB 以下にしてください";
    }
    return null;
  }

  // ==============================
  // PDF のページ数をカウント
  // ==============================
  async function countPdfPages(file: File): Promise<number> {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // PDF のバイナリを文字列として読み込む
    let str = "";
    for (let i = 0; i < bytes.length; i++) {
      str += String.fromCharCode(bytes[i]);
    }

    // /Type /Page（/Type /Pages とは別物）の数がページ数
    const matches = str.match(/\/Type\s*\/Page[^s]/g);
    return matches ? matches.length : 1;
  }

  // ==============================
  // PPTX（PowerPoint）のスライド数をカウント
  // ==============================
  async function countPptxSlides(file: File): Promise<number> {
    // jszip を動的に読み込む（PPTX は zip 形式のファイル）
    const JSZip = (await import("jszip")).default;
    const zip = await JSZip.loadAsync(file);

    // ppt/slides/slide1.xml, slide2.xml ... の数がスライド数
    const slideFiles = Object.keys(zip.files).filter((name) =>
      /^ppt\/slides\/slide\d+\.xml$/.test(name)
    );

    return slideFiles.length || 1;
  }

  // ==============================
  // ファイル選択時：ページ数をカウントして確認画面へ
  // ==============================
  async function handleFileSelect(file: File) {
    setError("");
    setSuccess("");
    setPendingFile(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsCounting(true);

    try {
      let pages = 1;
      if (file.type === "application/pdf") {
        pages = await countPdfPages(file);
      } else {
        pages = await countPptxSlides(file);
      }

      setPageCount(pages);
      setPendingFile(file); // 確認画面を表示する
    } catch {
      setError("ページ数の取得に失敗しました。もう一度お試しください。");
    }

    setIsCounting(false);
  }

  // ==============================
  // 確認後：アップロード＆クレジット消費
  // ==============================
  async function handleConfirmUpload() {
    if (!pendingFile) return;

    setIsUploading(true);
    setError("");

    try {
      // Step 1: ストレージにアップロード
      const timestamp = Date.now();
      const extension = pendingFile.name.split(".").pop();
      const filePath = `${userId}/${timestamp}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("presentations")
        .upload(filePath, pendingFile);

      if (uploadError) {
        setError("アップロードに失敗しました: " + uploadError.message);
        setIsUploading(false);
        return;
      }

      // Step 2: データベースに保存
      const { data: insertedData, error: dbError } = await supabase
        .from("presentations")
        .insert({
          user_id: userId,
          file_name: pendingFile.name,
          file_path: filePath,
          file_size: pendingFile.size,
          file_type: pendingFile.type,
          page_count: pageCount,
        })
        .select("id")
        .single();

      if (dbError) {
        setError("ファイル情報の保存に失敗しました: " + dbError.message);
        setIsUploading(false);
        return;
      }

      // Step 3: クレジットを消費
      const { data: deducted, error: creditError } = await supabase.rpc(
        "deduct_credits",
        { target_user_id: userId, amount: pageCount }
      );

      if (creditError || !deducted) {
        setError("クレジットの消費に失敗しました。残高を確認してください。");
        setIsUploading(false);
        return;
      }

      // 成功
      setSuccess(`アップロード完了！${pageCount} クレジットを消費しました。`);
      setPendingFile(null);
      setIsUploading(false);

      if (insertedData) {
        setUploadedPresentationId(insertedData.id);
        setShowSettings(true);
      }
    } catch {
      setError("予期しないエラーが発生しました");
      setIsUploading(false);
    }
  }

  // ==============================
  // ドラッグ&ドロップ
  // ==============================
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFileSelect(files[0]);
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.currentTarget.files;
    if (files && files.length > 0) handleFileSelect(files[0]);
    e.currentTarget.value = ""; // 同じファイルを再選択できるようにリセット
  }

  const isBusy = isCounting || isUploading;

  return (
    <div>
      {/* ==============================
          確認画面（ファイル選択後に表示）
          ============================== */}
      {pendingFile && !isUploading && (
        <div className="mb-6 bg-white/5 border border-white/20 rounded-2xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4">
            アップロードの確認
          </h3>

          {/* ファイル情報 */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">ファイル名</span>
              <span className="text-white truncate ml-4">{pendingFile.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">ページ数</span>
              <span className="text-white font-semibold">{pageCount} ページ</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">消費クレジット</span>
              <span className="text-blue-300 font-bold text-base">
                💎 {pageCount} クレジット
              </span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-white/10">
              <span className="text-slate-400">残高</span>
              <span className={credits >= pageCount ? "text-green-300" : "text-red-400"}>
                {credits} → {credits - pageCount} クレジット
              </span>
            </div>
          </div>

          {/* クレジット不足の場合 */}
          {credits < pageCount ? (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-3 mb-4">
              <p className="text-red-300 text-sm font-medium">
                クレジットが不足しています（あと {pageCount - credits} クレジット必要）
              </p>
              <a
                href="/pricing"
                className="text-red-200 underline text-sm mt-1 inline-block"
              >
                クレジットを購入する →
              </a>
            </div>
          ) : null}

          {/* ボタン */}
          <div className="flex gap-3">
            <button
              onClick={() => setPendingFile(null)}
              className="flex-1 py-2.5 rounded-lg border border-white/20 text-slate-300 hover:text-white transition-colors text-sm"
            >
              キャンセル
            </button>
            <button
              onClick={handleConfirmUpload}
              disabled={credits < pageCount}
              className="flex-1 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/30 disabled:cursor-not-allowed text-white font-semibold transition-colors text-sm"
            >
              確認してアップロード
            </button>
          </div>
        </div>
      )}

      {/* ==============================
          ドロップゾーン
          ============================== */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
          isDragging
            ? "border-blue-400 bg-blue-500/10"
            : "border-white/20 hover:border-blue-400/50 bg-white/5"
        } ${isBusy ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <p className="text-5xl mb-4">
          {isCounting ? "🔍" : isUploading ? "⏳" : "📤"}
        </p>

        <p className="text-white font-medium text-lg mb-2">
          {isCounting
            ? "ページ数を確認中..."
            : isUploading
            ? "アップロード中..."
            : "ここに資料をドロップ"}
        </p>
        <p className="text-slate-400 text-sm mb-6">
          PDF・PowerPoint ファイルに対応（最大 50MB）
        </p>

        <button
          type="button"
          disabled={isBusy}
          onClick={() => document.getElementById("file-input")?.click()}
          className="bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          ファイルを選択する
        </button>

        <input
          id="file-input"
          type="file"
          onChange={handleFileInputChange}
          accept=".pdf,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          disabled={isBusy}
          className="hidden"
        />

        {error && (
          <div className="mt-6 bg-red-500/20 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 bg-green-500/20 border border-green-500/30 text-green-300 text-sm rounded-lg px-4 py-3">
            {success}
          </div>
        )}
      </div>

      {/* 添削設定ダイアログ */}
      {showSettings && uploadedPresentationId && (
        <ReviewSettingsDialog
          presentationId={uploadedPresentationId}
          fileName={pendingFile?.name ?? ""}
          onClose={() => {
            setShowSettings(false);
            setSuccess("");
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

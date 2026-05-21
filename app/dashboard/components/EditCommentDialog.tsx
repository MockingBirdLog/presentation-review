/**
 * app/dashboard/components/EditCommentDialog.tsx — コメント編集ダイアログ
 *
 * 「受付中」ステータスのみ、添削スタイルとコメントを編集できます。
 */

"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface EditCommentDialogProps {
  presentationId: string;
  fileName: string;
  reviewStyle: string;
  customInstructions: string | null;
  onClose: () => void;
}

export default function EditCommentDialog({
  presentationId,
  fileName,
  reviewStyle: initialStyle,
  customInstructions: initialInstructions,
  onClose,
}: EditCommentDialogProps) {
  const supabase = createClient();
  const router = useRouter();

  // ==============================
  // State
  // ==============================
  const [reviewStyle, setReviewStyle] = useState<"lenient" | "normal" | "strict">(
    (initialStyle as any) || "normal"
  );
  const [customInstructions, setCustomInstructions] = useState(
    initialInstructions || ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // ==============================
  // 変更を保存
  // ==============================
  async function handleSave() {
    setError("");
    setIsSaving(true);

    try {
      const { error: updateError } = await supabase
        .from("presentations")
        .update({
          review_style: reviewStyle,
          custom_instructions: customInstructions || null,
        })
        .eq("id", presentationId);

      if (updateError) {
        setError("保存に失敗しました: " + updateError.message);
        setIsSaving(false);
        return;
      }

      // 成功
      router.refresh();
      onClose();
    } catch (err) {
      setError("予期しないエラーが発生しました");
      setIsSaving(false);
    }
  }

  return (
    // モーダルのオーバーレイ
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      {/* ダイアログボックス */}
      <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full">
        {/* ヘッダー */}
        <div className="border-b border-white/10 px-6 py-4">
          <h2 className="text-xl font-bold text-white">添削設定を編集</h2>
          <p className="text-slate-400 text-sm mt-1 truncate">
            {fileName}
          </p>
        </div>

        {/* コンテンツ */}
        <div className="px-6 py-6 space-y-6">
          {/* 添削スタイルの選択 */}
          <div>
            <label className="block text-white font-semibold mb-4">
              添削スタイル
            </label>
            <div className="space-y-3">
              {/* 優しめ */}
              <button
                onClick={() => setReviewStyle("lenient")}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  reviewStyle === "lenient"
                    ? "border-blue-400 bg-blue-500/20"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">😊</span>
                  <div>
                    <p className="font-semibold text-white">優しめ</p>
                    <p className="text-sm text-slate-400">
                      良い点を褒めてくれる、励ましてほしい場合
                    </p>
                  </div>
                </div>
              </button>

              {/* 普通 */}
              <button
                onClick={() => setReviewStyle("normal")}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  reviewStyle === "normal"
                    ? "border-blue-400 bg-blue-500/20"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">😐</span>
                  <div>
                    <p className="font-semibold text-white">普通（推奨）</p>
                    <p className="text-sm text-slate-400">
                      バランスの取れた、実用的なフィードバック
                    </p>
                  </div>
                </div>
              </button>

              {/* 厳しめ */}
              <button
                onClick={() => setReviewStyle("strict")}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  reviewStyle === "strict"
                    ? "border-blue-400 bg-blue-500/20"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <p className="font-semibold text-white">厳しめ</p>
                    <p className="text-sm text-slate-400">
                      細かい点までしっかり指摘してほしい場合
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* カスタムコメント */}
          <div>
            <label className="block text-white font-semibold mb-2">
              特別なリクエスト（オプション）
            </label>
            <p className="text-slate-400 text-sm mb-3">
              例：「営業向けなので分かりやすさを重視してほしい」
            </p>
            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="ここにコメントを入力..."
              maxLength={500}
              rows={4}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 transition-colors resize-none"
            />
            <p className="text-slate-500 text-xs mt-2">
              {customInstructions.length}/500
            </p>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="border-t border-white/10 px-6 py-4 flex gap-3">
          {/* キャンセルボタン */}
          <button
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-slate-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            キャンセル
          </button>

          {/* 保存ボタン */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/50 text-white font-semibold transition-colors disabled:cursor-not-allowed"
          >
            {isSaving ? "保存中..." : "保存"}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * app/opengraph-image.tsx — OG画像の自動生成
 *
 * Next.js がこのファイルを自動で検出し、/opengraph-image として配信します。
 * SNS（LINE・Twitter・Facebookなど）でシェアされたときにこの画像が表示されます。
 * サイズは 1200×630px が標準です。
 */

import { ImageResponse } from "next/og";

export const runtime = "nodejs";

// OG 画像のサイズ（SNS 標準サイズ）
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          // ダークグラデーション背景（アプリのテーマに合わせた色）
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
          padding: "60px",
        }}
      >
        {/* サービス名 */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 24,
            letterSpacing: "-1px",
          }}
        >
          プレゼン添削AI
        </div>

        {/* キャッチコピー */}
        <div
          style={{
            fontSize: 32,
            color: "#93c5fd",
            marginBottom: 48,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          あなたのプレゼンをAIが添削します
        </div>

        {/* 特徴タグ */}
        <div
          style={{
            display: "flex",
            gap: 16,
          }}
        >
          {["構成", "デザイン", "伝わりやすさ"].map((tag) => (
            <div
              key={tag}
              style={{
                background: "rgba(59, 130, 246, 0.2)",
                border: "1px solid rgba(96, 165, 250, 0.4)",
                borderRadius: 999,
                padding: "10px 24px",
                fontSize: 22,
                color: "#93c5fd",
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* 下部の装飾ライン */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            fontSize: 20,
            color: "#475569",
          }}
        >
          登録するだけで 5クレジット 無料プレゼント
        </div>
      </div>
    ),
    { ...size }
  );
}

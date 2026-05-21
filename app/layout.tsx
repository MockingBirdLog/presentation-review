/**
 * layout.tsx — サイト全体の「外枠」を定義するファイル
 *
 * App Router では、このファイルがすべてのページを包む共通レイアウトになります。
 * ヘッダーやフッターなど「どのページにも表示したいもの」をここに書きます。
 *
 * children（子要素）には、各ページの内容（page.tsx の中身）が自動的に入ります。
 */

import type { Metadata } from "next"; // ページのタイトルや説明文の型定義
import localFont from "next/font/local"; // ローカルフォントを読み込む Next.js の機能
import "./globals.css"; // サイト全体に適用するスタイル（CSS）

// ==============================
// フォントの設定
// ==============================

// 通常テキスト用フォント（Geist Sans）
const geistSans = localFont({
  src: "./fonts/GeistVF.woff", // フォントファイルの場所
  variable: "--font-geist-sans", // CSS 変数名（Tailwind から使えるようになる）
  weight: "100 900", // 使用できる太さの範囲
});

// コード表示用フォント（Geist Mono）
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// ==============================
// メタデータ（SEO・OGP・SNSシェア用の情報）
// ==============================
export const metadata: Metadata = {
  // ブラウザのタブタイトル
  // template を使うと各ページで "ページ名 | プレゼン添削AI" という形式になる
  title: {
    default: "プレゼン添削AI",
    template: "%s | プレゼン添削AI",
  },
  description:
    "スライドをアップロードするだけ。構成・デザイン・伝わりやすさをAIが添削し、具体的な改善案をお届けします。",

  // OGP 画像などの絶対URLを作るための基準URL
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
  ),

  // ==============================
  // Open Graph（LINE・Facebook・Slackなどでシェアされたときの表示）
  // ==============================
  openGraph: {
    title: "プレゼン添削AI",
    description:
      "スライドをアップロードするだけ。構成・デザイン・伝わりやすさをAIが添削し、具体的な改善案をお届けします。",
    siteName: "プレゼン添削AI",
    locale: "ja_JP",
    type: "website",
  },

  // ==============================
  // Twitter / X でシェアされたときの表示
  // ==============================
  twitter: {
    card: "summary_large_image", // 大きな画像付きカード形式
    title: "プレゼン添削AI",
    description:
      "スライドをアップロードするだけ。構成・デザイン・伝わりやすさをAIが添削します。",
  },

  // ==============================
  // 検索エンジン向け設定
  // ==============================
  robots: {
    index: true,
    follow: true,
  },
};

// ==============================
// ルートレイアウト（全ページ共通の外枠）
// ==============================
// { children } はページの中身が入ってくる「穴」のようなものです
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // React.ReactNode = React が表示できる何でも（テキスト・コンポーネントなど）
}>) {
  return (
    // <html> タグ：ページ全体を囲む HTML のルート要素
    <html lang="ja"> {/* lang="ja" で日本語サイトと宣言 */}
      {/* <body> タグ：実際に画面に表示される部分 */}
      <body
        // className：Tailwind CSS のクラスを当てる場所
        // antialiased：フォントを滑らかに表示するクラス
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* children にページごとの内容が入ります */}
        {children}
      </body>
    </html>
  );
}

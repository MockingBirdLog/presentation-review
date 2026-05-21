/**
 * tailwind.config.ts — Tailwind CSS の設定ファイル
 *
 * Tailwind CSS をカスタマイズするための設定を書くファイルです。
 * どのファイルに Tailwind を適用するか、色やフォントの追加なども行えます。
 */

import type { Config } from "tailwindcss"; // TypeScript 用の型定義を読み込む

const config: Config = {

  // ==============================
  // content：Tailwind を適用するファイルのパターン
  // ==============================
  // Tailwind は使われているクラスだけを CSS に含める仕組みです。
  // ここに書いたファイルを全部スキャンして、使われているクラスを探します。
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",     // pages フォルダ（従来の Pages Router）
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // コンポーネントフォルダ
    "./app/**/*.{js,ts,jsx,tsx,mdx}",        // app フォルダ（App Router）
  ],

  // ==============================
  // theme：デザインのテーマ設定
  // ==============================
  theme: {
    extend: {
      // extend の中に書くと、デフォルトの設定に「追加」できます（上書きではない）

      // カスタムカラーの追加
      // CSS 変数（globals.css で定義した --background など）を色として使えるようにする
      colors: {
        background: "var(--background)", // globals.css の --background を "background" という色名で使える
        foreground: "var(--foreground)", // globals.css の --foreground を "foreground" という色名で使える
      },
    },
  },

  // ==============================
  // plugins：Tailwind のプラグイン
  // ==============================
  // 追加機能が必要なときにプラグインをここに追加します
  plugins: [],
};

export default config;

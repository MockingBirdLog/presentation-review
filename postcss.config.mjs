/**
 * postcss.config.mjs — PostCSS の設定ファイル
 *
 * PostCSS は CSS を変換するツールです。
 * Tailwind CSS は PostCSS のプラグインとして動作するため、このファイルが必要です。
 *
 * Next.js がビルド時に自動的にこの設定を読み込みます。
 * 通常は変更する必要はありません。
 */

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // tailwindcss プラグインを有効にする
    // これにより @tailwind base; などのディレクティブが処理される
    tailwindcss: {},
  },
};

export default config;

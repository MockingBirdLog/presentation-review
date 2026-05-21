/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // クリックジャッキング攻撃を防ぐ（本サイト以外での iframe 埋め込みを禁止）
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // ブラウザが Content-Type を勝手に変更するのを防ぐ
          { key: "X-Content-Type-Options", value: "nosniff" },
          // リファラー情報を必要最小限に絞る（外部リンク先にURLが漏れにくくなる）
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // カメラ・マイク・位置情報へのアクセスを禁止
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;

/**
 * page.tsx — トップページ（ http://localhost:3000/ で表示される画面）
 *
 * このファイルがサイトのトップページです。
 * App Router では app/page.tsx が "/" のURL に対応します。
 */

import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col">
      {/* min-h-screen：画面の高さいっぱいに広げる */}
      {/* bg-gradient-to-br：左上から右下へのグラデーション背景 */}
      {/* flex flex-col：縦方向に並べるレイアウト */}

      {/* ===== ヘッダー ===== */}
      <header className="px-8 py-6">
        {/* max-w-5xl mx-auto：最大幅を決めて中央に配置 */}
        <div className="max-w-5xl mx-auto flex items-center justify-between">

          {/* サイトタイトル */}
          <span className="text-white text-xl font-bold tracking-tight">
            プレゼン添削AI
          </span>

          {/* ナビゲーションリンク（右側） */}
          <nav className="flex items-center gap-6">
            <a href="/guide" className="text-slate-300 hover:text-white text-sm transition-colors">
              使い方
            </a>
            <a href="/pricing" className="text-slate-300 hover:text-white text-sm transition-colors">
              料金
            </a>
            <a
              href="/login"
              className="bg-white text-slate-900 text-sm font-medium px-4 py-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              ログイン
            </a>
          </nav>
        </div>
      </header>

      {/* ===== メインコンテンツ（画面中央に配置） ===== */}
      {/* flex-1：残りの縦スペースをすべて使う */}
      {/* flex items-center justify-center：上下左右の中央に配置 */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-3xl mx-auto text-center">

          {/* バッジ（小さなラベル） */}
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm px-4 py-1.5 rounded-full mb-8 animate-fadeInUp">
            {/* w-2 h-2：幅・高さ 8px の小さな丸 */}
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            AIが即座にフィードバック
          </div>

          {/* メインのキャッチコピー */}
          {/* text-5xl sm:text-6xl：スマホは5xl、それ以上の画面は6xl */}
          {/* leading-tight：行間を詰める */}
          <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6 animate-fadeInUp">
            あなたのプレゼンを
            <br />
            {/* text-transparent bg-clip-text：テキストにグラデーションをかけるテクニック */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              AIが添削します
            </span>
          </h1>

          {/* サブテキスト（説明文） */}
          <p className="text-slate-400 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl mx-auto animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
            スライドをアップロードするだけ。構成・デザイン・伝わりやすさを
            数秒で分析し、具体的な改善案をお伝えします。
          </p>

          {/* ===== ボタンエリア ===== */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInScale" style={{ animationDelay: "0.2s" }}>

            {/* メインボタン「無料で試す」 */}
            {/* group：ホバー時に子要素をまとめてスタイル変更するためのクラス */}
            <a
              href="/signup"
              className="group flex flex-col items-center bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-400/40 hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-2 text-lg">
                無料で 5 クレジットを獲得
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </span>
              <span className="text-blue-200 text-sm font-normal">
                プレゼン 5 枚分・クレジットカード不要
              </span>
            </a>

            {/* サブボタン「デモを見る」 */}
            <a
              href="/demo"
              className="flex items-center gap-2 text-slate-300 hover:text-white text-lg px-6 py-4 rounded-2xl border border-slate-600 hover:border-slate-400 transition-all duration-200"
            >
              ▶ デモを見る
            </a>

          </div>

          {/* 補足テキスト */}
          <p className="text-slate-500 text-sm mt-6 animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
            クレジットカード不要・登録1分
          </p>
        </div>
      </main>

      {/* ===== 料金比較セクション ===== */}
      <section className="bg-white/5 border-y border-white/10 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-2 animate-fadeInUp">
            なぜプレゼン添削AIが選ばれるのか
          </h2>
          <p className="text-slate-400 text-center mb-12 animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
            他の添削サービスと比べて、圧倒的にお得で使いやすい
          </p>

          {/* 比較テーブル */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-slate-400 font-semibold">
                    サービス
                  </th>
                  <th className="text-center py-4 px-4 text-blue-300 font-bold">
                    プレゼン添削AI
                  </th>
                  <th className="text-center py-4 px-4 text-slate-400 font-semibold">
                    人間による添削
                  </th>
                  <th className="text-center py-4 px-4 text-slate-400 font-semibold">
                    テンプレート集
                  </th>
                </tr>
              </thead>
              <tbody className="space-y-0.5">
                {[
                  { item: "1ページの単価", ai: "¥20〜", human: "¥2,000〜", template: "〜¥30" },
                  { item: "初期無料", ai: "5クレジット", human: "なし", template: "なし" },
                  { item: "返却時間", ai: "1〜3日", human: "1週間〜", template: "すぐ" },
                  { item: "カスタマイズ性", ai: "◎", human: "◯", template: "△" },
                  { item: "24時間対応", ai: "◎", human: "✗", template: "◎" },
                  { item: "コスト効率", ai: "★★★★★", human: "★★", template: "★" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-4 px-4 text-slate-300 font-medium">
                      {row.item}
                    </td>
                    <td className="py-4 px-4 text-center text-blue-300 font-semibold bg-blue-500/5">
                      {row.ai}
                    </td>
                    <td className="py-4 px-4 text-center text-slate-400">
                      {row.human}
                    </td>
                    <td className="py-4 px-4 text-center text-slate-400">
                      {row.template}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* メリット */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: "⚡",
                title: "高速で便利",
                desc: "1〜3日で返却。何度でも何ページでも使える",
              },
              {
                icon: "💰",
                title: "圧倒的に安い",
                desc: "1ページ¥20から。無料の5ページからスタート",
              },
              {
                icon: "🎯",
                title: "AI + 人間のサポート",
                desc: "AIツールと人間の目で、質の高い添削を実現",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 animate-fadeInUp"
                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
              >
                <p className="text-4xl mb-3">{item.icon}</p>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== フッター ===== */}
      <Footer />
    </div>
  );
}

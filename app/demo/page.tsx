/**
 * app/demo/page.tsx — デモページ（/demo）
 *
 * 実際の添削例を見せるページです。
 * サンプルのスライドに対してどんなフィードバックが届くかを示します。
 */

import Link from "next/link";

const feedbacks = [
  {
    page: 1,
    title: "表紙",
    tags: ["構成", "デザイン"],
    original: "新商品マーケティング戦略 2026年度",
    comment:
      "タイトルは明確ですが、「誰向けの資料か」が一目でわかるとより良いです。例えば「経営陣向け」「社内共有用」など対象を添えると読み手が心構えできます。フォントサイズのコントラストをつけてタイトルを大きく、サブテキストを小さくするとメリハリが出ます。",
    score: 72,
  },
  {
    page: 2,
    title: "目次・アジェンダ",
    tags: ["構成"],
    original: "1. 市場分析 / 2. 競合調査 / 3. 戦略案 / 4. 予算 / 5. スケジュール",
    comment:
      "構成は論理的で良いです。ただし「なぜこの順番なのか」が伝わるとより説得力が増します。矢印や番号に加え、各項目に一言コメントを添えると読み手がストーリーを追いやすくなります。",
    score: 80,
  },
  {
    page: 3,
    title: "市場分析",
    tags: ["伝わりやすさ", "デザイン"],
    original: "国内市場規模：1兆円（前年比+8%）/ ターゲット層：25〜40歳 / 成長ドライバー：SNS拡散",
    comment:
      "数字は具体的で良いのですが、グラフや図がなく文字だけで読みにくい印象です。棒グラフや円グラフで視覚化すると一目で伝わります。「前年比+8%」はハイライト色で強調すると重要な数字が目に入りやすくなります。",
    score: 65,
  },
];

const tagColors: Record<string, string> = {
  構成: "bg-blue-500/10 border-blue-400/20 text-blue-300",
  デザイン: "bg-purple-500/10 border-purple-400/20 text-purple-300",
  伝わりやすさ: "bg-green-500/10 border-green-400/20 text-green-300",
};

const avgScore = Math.round(feedbacks.reduce((s, f) => s + f.score, 0) / feedbacks.length);

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">

      {/* ヘッダー */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-lg">
            プレゼン添削AI
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/guide" className="text-slate-300 hover:text-white text-sm transition-colors">
              使い方
            </Link>
            <Link
              href="/signup"
              className="bg-white text-slate-900 text-sm font-medium px-4 py-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              無料で始める
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">

        {/* タイトル */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm px-4 py-1.5 rounded-full mb-6">
            実際の添削例（サンプル）
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">こんな添削が届きます</h1>
          <p className="text-slate-400">
            「新商品マーケティング戦略」資料をサンプルとして添削した例です
          </p>
        </div>

        {/* サマリーバー */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-slate-400 text-xs mb-1">添削ページ数</p>
            <p className="text-2xl font-bold text-white">{feedbacks.length}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-slate-400 text-xs mb-1">平均スコア</p>
            <p className="text-2xl font-bold text-blue-300">
              {avgScore}<span className="text-sm text-slate-400">/100</span>
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-slate-400 text-xs mb-1">消費クレジット</p>
            <p className="text-2xl font-bold text-white">💎 {feedbacks.length}</p>
          </div>
        </div>

        {/* フィードバック一覧 */}
        <div className="space-y-5 mb-16">
          {feedbacks.map((fb) => (
            <div key={fb.page} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">

              {/* ページヘッダー */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-bold text-slate-500 bg-white/10 px-2 py-0.5 rounded">
                    P.{fb.page}
                  </span>
                  <span className="text-white font-semibold">{fb.title}</span>
                  {fb.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-xs border px-2 py-0.5 rounded-full ${tagColors[tag] ?? ""}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {/* スコアバー */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-400 rounded-full"
                      style={{ width: `${fb.score}%` }}
                    />
                  </div>
                  <span className="text-blue-300 text-sm font-semibold">{fb.score}</span>
                </div>
              </div>

              <div className="px-6 py-5 space-y-4">
                {/* 元の内容 */}
                <div>
                  <p className="text-xs text-slate-500 mb-1.5">スライドの内容</p>
                  <p className="text-slate-400 text-sm bg-white/5 rounded-lg px-4 py-3 border border-white/5">
                    {fb.original}
                  </p>
                </div>
                {/* フィードバック */}
                <div>
                  <p className="text-xs text-slate-500 mb-1.5">添削コメント</p>
                  <p className="text-slate-300 text-sm leading-relaxed">{fb.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 補足 */}
        <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 mb-12 text-sm text-slate-400 flex gap-3">
          <span className="text-blue-300 shrink-0">ℹ️</span>
          <p>
            添削はAIツールを活用して運営者が手作業で行います。自動処理ではないため、ページごとに丁寧なコメントが届きます。通常 <span className="text-white">1〜3営業日</span> 以内にダッシュボードへアップします。
          </p>
        </div>

        {/* CTA */}
        <div className="text-center bg-blue-500/10 border border-blue-400/20 rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-white mb-3">あなたのプレゼンも添削してみる</h2>
          <p className="text-slate-400 mb-6">
            登録するだけで 5クレジット 無料。5ページのスライドまでタダで試せます。
          </p>
          <Link
            href="/signup"
            className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            無料で登録する →
          </Link>
          <p className="text-slate-500 text-xs mt-4">クレジットカード不要・登録1分</p>
        </div>
      </main>
    </div>
  );
}

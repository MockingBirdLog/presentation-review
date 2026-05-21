/**
 * app/guide/page.tsx — 使い方ページ（/guide）
 */

import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "無料で登録する",
    description:
      "メールアドレスとパスワードで30秒で登録完了。登録するだけで 5クレジット を無料プレゼント。友達を紹介するとさらに +5クレジット もらえます。",
    note: "クレジットカード不要",
  },
  {
    number: "02",
    title: "プレゼン資料をアップロード",
    description:
      "PDF または PowerPoint（.pptx）形式のファイルをドラッグ&ドロップするだけ。1クレジット = 1ページ分の添削です。10ページのスライドなら10クレジット消費します。",
    note: "最大 50MB まで対応",
  },
  {
    number: "03",
    title: "添削の希望を伝える（任意）",
    description:
      "「就活の面接で使う」「投資家向けピッチ」「デザインを重点的に見てほしい」など、用途や重点的に見てほしい点を自由に伝えられます。",
    note: "入力しなくても OK",
  },
  {
    number: "04",
    title: "添削結果を受け取る",
    description:
      "運営者がAIツールを活用してページごとに丁寧に添削します。通常 1〜3営業日以内 に添削済みファイルとフィードバックをダッシュボードにアップします。",
    note: "通常 1〜3 営業日",
  },
  {
    number: "05",
    title: "フィードバックを確認して改善",
    description:
      "ダッシュボードから添削結果をダウンロード。構成・デザイン・伝わりやすさなど具体的な改善案を参考に、プレゼンをブラッシュアップしましょう。",
    note: "何度でも見返せる",
  },
];

const faqs = [
  {
    q: "どんなプレゼンでも対応できますか？",
    a: "就活・営業・社内報告・ピッチデックなど、あらゆる用途のプレゼンに対応しています。ただし、内容の正確性（数値の正しさなど）の保証はできません。",
  },
  {
    q: "クレジットはどのくらい使いますか？",
    a: "1クレジット = 1ページです。登録時に無料で5クレジットもらえるので、5ページのスライドまでなら無料で試せます。",
  },
  {
    q: "添削結果が気に入らない場合は？",
    a: "お問い合わせフォームからご連絡ください。内容を確認の上、対応いたします。",
  },
  {
    q: "ファイルの内容は外部に漏れませんか？",
    a: "アップロードされたファイルは添削目的のみに使用し、AI学習データとしての使用や第三者への提供は一切行いません。",
  },
  {
    q: "購入したクレジットの有効期限は？",
    a: "有効期限はありません。購入後いつでも使えます。",
  },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">

      {/* ヘッダー */}
      <header className="border-b border-white/10 px-6 py-4 animate-slideInDown">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-lg">
            プレゼン添削AI
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-slate-300 hover:text-white text-sm transition-colors">
              料金
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
        <div className="text-center mb-16 animate-fadeInUp">
          <h1 className="text-4xl font-bold text-white mb-4">使い方</h1>
          <p className="text-slate-400 text-lg">
            登録から添削結果受け取りまで、たった5ステップ
          </p>
        </div>

        {/* ステップ */}
        <div className="space-y-6 mb-20">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-6 bg-white/5 border border-white/10 rounded-2xl p-6 animate-fadeInUp" style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
              {/* 番号 */}
              <div className="shrink-0 w-14 h-14 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                <span className="text-blue-300 font-bold text-sm">{step.number}</span>
              </div>

              {/* テキスト */}
              <div className="flex-1">
                <h2 className="text-white font-semibold text-lg mb-1">{step.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-2">{step.description}</p>
                <span className="inline-block text-xs text-blue-300 bg-blue-500/10 border border-blue-400/20 px-2.5 py-0.5 rounded-full">
                  {step.note}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center animate-fadeInUp">よくある質問</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 animate-fadeInUp" style={{ animationDelay: `${0.2 + i * 0.05}s` }}>
                <p className="text-white font-medium mb-2">Q. {faq.q}</p>
                <p className="text-slate-400 text-sm leading-relaxed">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-blue-500/10 border border-blue-400/20 rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-white mb-3">まずは無料で試してみる</h2>
          <p className="text-slate-400 mb-6">登録するだけで 5クレジット プレゼント。クレジットカード不要。</p>
          <Link
            href="/signup"
            className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            無料で登録する →
          </Link>
          <p className="text-slate-500 text-xs mt-4">
            登録1分・すぐに使えます
          </p>
        </div>
      </main>
    </div>
  );
}

/**
 * app/law/page.tsx — 特定商取引法に基づく表示
 */

export default function LawPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <a href="/" className="text-white font-bold text-lg hover:text-blue-400">
            プレゼン添削AI
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">特定商取引法に基づく表示</h1>
        <p className="text-sm text-slate-400 mb-10">最終更新日：2026年5月20日</p>

        <div className="space-y-0 text-slate-300 text-sm">
          {/* テーブル形式で表示 */}
          <table className="w-full border-collapse">
            <tbody>
              {[
                {
                  label: "販売業者",
                  value: "プレゼン添削AI",
                },
                {
                  label: "代表者",
                  value: "請求があった場合は、遅滞なく開示します",
                },
                {
                  label: "所在地",
                  value: "請求があった場合は、遅滞なく開示します",
                },
                {
                  label: "電話番号",
                  value: "請求があった場合は、遅滞なく開示します",
                },
                {
                  label: "メールアドレス",
                  value: "mockingbirdlog@gmail.com",
                },
                {
                  label: "サービス名",
                  value: "プレゼン添削AI",
                },
                {
                  label: "サービス内容",
                  value:
                    "ユーザーがアップロードしたプレゼンテーション資料（PDF・PowerPoint）に対して、運営者がAIツールを活用して添削・フィードバックを作成し提供するサービス",
                },
                {
                  label: "対応ファイル形式",
                  value: "PDF、PowerPoint（.pptx）",
                },
                {
                  label: "販売価格",
                  value: (
                    <ul className="space-y-1">
                      <li>初回限定10クレジット：Stripeの販売価格に準じます</li>
                      <li>10クレジット：Stripeの販売価格に準じます</li>
                      <li>25クレジット：Stripeの販売価格に準じます</li>
                      <li>100クレジット：Stripeの販売価格に準じます</li>
                      <li>300クレジット：Stripeの販売価格に準じます</li>
                      <li className="text-slate-400 text-xs mt-1">
                        ※ 表示価格はすべて日本円（税込）です
                      </li>
                    </ul>
                  ),
                },
                {
                  label: "支払方法",
                  value: "クレジットカード（Visa / Mastercard / American Express / JCB など、Stripeが対応するカード）",
                },
                {
                  label: "支払時期",
                  value: "購入手続き完了時に即時決済",
                },
                {
                  label: "サービス提供時期",
                  value: "クレジット購入後すぐにアップロード・利用可能。添削結果は通常1〜3営業日以内に提供します（混雑状況により前後する場合があります）",
                },
                {
                  label: "キャンセル・返品",
                  value: (
                    <div>
                      <p>購入後のクレジットの返金は原則として行いません。</p>
                      <p className="mt-1 text-slate-400">
                        ただし、システムの重大な不具合によりサービスが提供できなかった場合は、個別に対応します。
                        お問い合わせフォームよりご連絡ください。
                      </p>
                    </div>
                  ),
                },
                {
                  label: "動作環境",
                  value: "最新バージョンの Chrome / Safari / Firefox / Edge（JavaScript 有効）",
                },
                {
                  label: "特記事項",
                  value: (
                    <ul className="space-y-1">
                      <li>新規登録で5クレジットを無償付与します</li>
                      <li>友達紹介制度により、紹介した方・された方の双方に+5クレジットを付与します</li>
                      <li>初回限定プランは1アカウントにつき1回のみ購入可能です</li>
                    </ul>
                  ),
                },
              ].map(({ label, value }) => (
                <tr key={label} className="border-b border-white/10">
                  <td className="py-4 pr-6 align-top font-semibold text-white whitespace-nowrap w-40">
                    {label}
                  </td>
                  <td className="py-4 align-top leading-relaxed">
                    {typeof value === "string" ? value : value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-10 border-t border-white/10 mt-4">
            <p className="text-slate-400 text-xs leading-relaxed">
              ※「所在地」および「電話番号」は、ご請求があった場合に遅滞なく開示します。
              <a href="/contact" className="text-blue-400 hover:text-blue-300 underline ml-1">
                お問い合わせフォーム
              </a>
              よりご連絡ください。
            </p>
          </div>
        </div>

        <div className="mt-12 flex gap-6 text-sm">
          <a href="/terms" className="text-blue-400 hover:text-blue-300 underline">
            利用規約
          </a>
          <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
            プライバシーポリシー
          </a>
          <a href="/" className="text-blue-400 hover:text-blue-300 underline">
            ← トップページ
          </a>
        </div>
      </main>
    </div>
  );
}

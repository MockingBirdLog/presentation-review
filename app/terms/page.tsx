/**
 * app/terms/page.tsx — 利用規約
 */

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-white mb-2">利用規約</h1>
        <p className="text-sm text-slate-400 mb-10">最終更新日：2026年5月20日</p>

        <div className="space-y-10 text-slate-300 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">第1条（適用）</h2>
            <p>
              本規約は、プレゼン添削AI（以下「本サービス」）の利用条件を定めるものです。ユーザーは本規約に同意した上で本サービスをご利用ください。本サービスを利用した時点で、本規約に同意したものとみなします。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">第2条（サービスの内容）</h2>
            <p className="mb-3">
              本サービスは、ユーザーがアップロードしたプレゼンテーション資料（PDF・PowerPoint 形式）に対して、運営者がAIツールを活用して添削・フィードバックを作成し、結果をユーザーに提供するサービスです。
            </p>
            <p className="text-slate-400">
              ※ 本サービスの添削はAIが自動で行うものではなく、運営者が手作業でAIツールを使用して行います。そのため、添削結果の提供まで一定の時間（通常1〜3営業日）がかかります。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">第3条（クレジット制度）</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>本サービスはクレジット制です。1クレジット = プレゼン1ページ分の添削に相当します。</li>
              <li>新規登録ユーザーには初回登録ボーナスとして5クレジットを無償で付与します。</li>
              <li>友達紹介制度を利用した場合、紹介した方・された方の双方に+5クレジットを付与します。</li>
              <li>クレジットは決済完了後すぐに付与されます。有効期限はありません。</li>
              <li>クレジットは日本円やその他の通貨に換金することはできません。</li>
              <li>アカウント削除時に残クレジットは消滅します。返金は行いません。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">第4条（料金・支払い）</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>クレジットの購入は Stripe を通じてクレジットカードで行います。</li>
              <li>初回限定プランは1アカウントにつき1回のみ購入可能です。</li>
              <li>購入したクレジットの返金は原則として行いません。ただし、システムの重大な不具合によりサービスが提供できなかった場合はこの限りではありません。</li>
              <li>料金は日本円（税込）で表示されます。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">第5条（アップロードファイルの取り扱い）</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>ユーザーがアップロードしたファイルは、添削サービスの提供のみを目的として使用します。</li>
              <li>アップロードされたファイルをAIの学習データとして使用することはありません。</li>
              <li>運営者は、添削業務のためにファイルの内容を閲覧します。</li>
              <li>ユーザーは、アップロードするファイルについて、第三者の著作権・知的財産権を侵害しないことを保証してください。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">第6条（禁止事項）</h2>
            <p className="mb-3">ユーザーは以下の行為を行ってはなりません。</p>
            <ul className="space-y-2 list-disc pl-5">
              <li>法令または公序良俗に違反する行為</li>
              <li>他者の著作権・肖像権・プライバシー等の権利を侵害するコンテンツのアップロード</li>
              <li>複数アカウントを作成して無料クレジットを不正に取得する行為</li>
              <li>他人のクレジットカードや決済情報を不正に使用する行為</li>
              <li>本サービスのシステムへの不正アクセス、改ざん、リバースエンジニアリング</li>
              <li>運営者が不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">第7条（不正利用の検知）</h2>
            <p>
              運営者は、不正利用を防止するため、Stripe のカードフィンガープリント機能を用いて、同一クレジットカードによる複数アカウント作成を検知します。不正利用が確認された場合、予告なくアカウントを停止または削除することがあります。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">第8条（サービスの変更・中断・終了）</h2>
            <p>
              運営者は、ユーザーへの事前通知なく、本サービスの内容の変更、一時的な中断、または終了を行うことがあります。これによりユーザーに損害が生じた場合でも、運営者は一切の責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">第9条（免責事項）</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>本サービスの添削結果は参考情報です。内容の正確性・完全性を保証するものではありません。</li>
              <li>本サービスの利用により生じた損害について、運営者は一切の責任を負いません。</li>
              <li>ユーザー間または第三者との間のトラブルについて、運営者は責任を負いません。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">第10条（規約の変更）</h2>
            <p>
              運営者は、必要と判断した場合、本規約を変更することがあります。変更後の規約は本ページへの掲載をもって効力を生じ、以後の利用はすべて変更後の規約が適用されます。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">第11条（準拠法・管轄裁判所）</h2>
            <p>
              本規約は日本法に準拠します。本サービスに関する紛争については、運営者の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </section>

          <section className="pt-8 border-t border-white/10">
            <h3 className="text-base font-semibold text-white mb-2">お問い合わせ</h3>
            <p>
              本規約に関するご質問は、
              <a href="/contact" className="text-blue-400 hover:text-blue-300 underline ml-1">
                お問い合わせフォーム
              </a>
              からお願いします。
            </p>
          </section>
        </div>

        <div className="mt-12">
          <a href="/" className="text-blue-400 hover:text-blue-300 underline text-sm">
            ← トップページに戻る
          </a>
        </div>
      </main>
    </div>
  );
}

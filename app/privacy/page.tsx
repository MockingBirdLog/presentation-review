/**
 * app/privacy/page.tsx — プライバシーポリシー
 */

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-white mb-2">プライバシーポリシー</h1>
        <p className="text-sm text-slate-400 mb-10">最終更新日：2026年5月20日</p>

        <div className="space-y-10 text-slate-300 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. 収集する情報</h2>
            <p className="mb-3">本サービスでは、以下の情報を収集します。</p>
            <ul className="space-y-2 list-disc pl-5">
              <li><span className="text-white font-medium">アカウント情報</span> — メールアドレス（登録時に取得）</li>
              <li><span className="text-white font-medium">パスワード</span> — ハッシュ化して保存します。平文では保存しません</li>
              <li><span className="text-white font-medium">アップロードファイル</span> — 添削のためにアップロードされた PDF・PowerPoint ファイル</li>
              <li><span className="text-white font-medium">クレジット購入履歴</span> — 購入日時・プラン・クレジット数</li>
              <li><span className="text-white font-medium">カードフィンガープリント</span> — 不正利用検知のため、Stripe が発行するカード固有の識別子（カード番号そのものではありません）</li>
              <li><span className="text-white font-medium">紹介情報</span> — 友達紹介制度を利用した場合の紹介コード・紹介関係</li>
              <li><span className="text-white font-medium">アクセスログ</span> — IPアドレス、ブラウザ情報、アクセス日時</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. 情報の利用目的</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>本サービスの提供（添削サービスの実施・結果の送付）</li>
              <li>クレジットの管理・決済処理</li>
              <li>不正利用の検知・防止（複数アカウント作成などの不正行為）</li>
              <li>ユーザーサポート・お問い合わせへの対応</li>
              <li>サービス改善のための統計・分析（個人を特定しない形で行います）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. 利用する外部サービス</h2>
            <p className="mb-3">本サービスは以下の外部サービスを利用しており、各社のプライバシーポリシーが適用されます。</p>
            <ul className="space-y-3 list-disc pl-5">
              <li>
                <span className="text-white font-medium">Supabase</span>（米国）—
                ユーザー認証・データベース・ファイルストレージに使用します。
              </li>
              <li>
                <span className="text-white font-medium">Stripe</span>（米国）—
                クレジットカード決済の処理に使用します。カード番号などの決済情報はStripeが管理し、本サービスは保持しません。
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. アップロードファイルの取り扱い</h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>アップロードされたファイルは、添削サービスの提供のみを目的として使用します</li>
              <li>AIの学習データとして使用することはありません</li>
              <li>添削業務のため、運営者がファイルの内容を閲覧します</li>
              <li>添削完了後のファイルは、ユーザーが削除するまで保管されます</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. 第三者への開示</h2>
            <p>
              収集した個人情報は、以下の場合を除き、第三者に開示・提供しません。
            </p>
            <ul className="space-y-2 list-disc pl-5 mt-3">
              <li>ユーザー本人の同意がある場合</li>
              <li>法令に基づく場合（裁判所・警察等からの適法な要求）</li>
              <li>人の生命・身体または財産の保護のために必要な場合</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Cookie・セッション管理</h2>
            <p>
              本サービスはログイン状態を維持するためにCookieを使用します。Cookieはブラウザの設定で無効にできますが、その場合サービスの一部が利用できなくなる場合があります。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. 個人情報の削除・開示要求</h2>
            <p>
              ご自身の個人情報の開示・訂正・削除をご希望の場合は、
              <a href="/contact" className="text-blue-400 hover:text-blue-300 underline mx-1">
                お問い合わせフォーム
              </a>
              からご連絡ください。本人確認の上、対応いたします。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. セキュリティ</h2>
            <p>
              運営者は、収集した個人情報への不正アクセス・漏えい・改ざんを防止するため、適切なセキュリティ対策を実施します。ただし、インターネットを通じた通信の完全な安全性を保証するものではありません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. ポリシーの変更</h2>
            <p>
              本プライバシーポリシーは、法令の改正やサービス内容の変更に伴い、予告なく改定することがあります。変更後は本ページへの掲載をもって効力を生じます。
            </p>
          </section>

          <section className="pt-8 border-t border-white/10">
            <h3 className="text-base font-semibold text-white mb-2">お問い合わせ</h3>
            <p>
              個人情報の取り扱いに関するご質問・ご要望は、
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

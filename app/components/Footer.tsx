/**
 * app/components/Footer.tsx — フッター（全ページ共通）
 */

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-12 bg-white/5">
      <div className="max-w-5xl mx-auto">
        {/* フッターのコンテンツ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          {/* 左側：ロゴとキャッチコピー */}
          <div>
            <h3 className="text-white font-bold text-lg mb-2">プレゼン添削AI</h3>
            <p className="text-slate-400 text-sm">
              あなたのプレゼンを AI が添削します
            </p>
          </div>

          {/* 右側：リンク集 */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">サービス</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/guide" className="text-slate-400 hover:text-white transition-colors">
                    使い方
                  </a>
                </li>
                <li>
                  <a href="/pricing" className="text-slate-400 hover:text-white transition-colors">
                    料金
                  </a>
                </li>
                <li>
                  <a href="/demo" className="text-slate-400 hover:text-white transition-colors">
                    デモ
                  </a>
                </li>
                <li>
                  <a href="/login" className="text-slate-400 hover:text-white transition-colors">
                    ログイン
                  </a>
                </li>
                <li>
                  <a href="/signup" className="text-slate-400 hover:text-white transition-colors">
                    新規登録
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-3">その他</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/contact" className="text-slate-400 hover:text-white transition-colors">
                    お問い合わせ
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-slate-400 hover:text-white transition-colors">
                    利用規約
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-slate-400 hover:text-white transition-colors">
                    プライバシー
                  </a>
                </li>
                <li>
                  <a href="/law" className="text-slate-400 hover:text-white transition-colors">
                    特商法表示
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* コピーライト */}
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-slate-500 text-sm">
            © 2026 プレゼン添削AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

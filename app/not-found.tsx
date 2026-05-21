/**
 * app/not-found.tsx — 404 ページ
 *
 * 存在しない URL にアクセスされたときに自動で表示されます。
 * Next.js App Router はこのファイルを自動で検出します。
 */

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-6">
      <div className="text-center">

        {/* 404 の数字 */}
        <p className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">
          404
        </p>

        <h1 className="text-2xl font-bold text-white mb-3">
          ページが見つかりません
        </h1>
        <p className="text-slate-400 text-sm mb-10">
          お探しのページは存在しないか、移動した可能性があります。
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            トップページへ
          </Link>
          <Link
            href="/dashboard"
            className="border border-white/20 hover:border-white/40 text-slate-300 hover:text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            ダッシュボードへ
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * app/dashboard/admin/page.tsx — 管理者ダッシュボード
 *
 * 管理者のみがアクセス可能。
 * すべてのプレゼンテーションを管理し、ステータスを変更したり、
 * 添削済みファイルと修正点を送信できます。
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminPresentationList from "./components/AdminPresentationList";

export default async function AdminPage() {
  const supabase = createClient();

  // ユーザー情報を取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ログインしていない場合はログインページへ
  if (!user) {
    redirect("/login");
  }

  // 管理者メールアドレスを取得
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // 管理者でない場合はダッシュボードへ戻す
  if (user.email !== adminEmail) {
    redirect("/dashboard");
  }

  // すべてのプレゼンテーション（ユーザーフィルタなし）を取得
  const { data: presentations } = await supabase
    .from("presentations")
    .select(
      `
      *,
      user:user_id (
        id,
        email
      )
    `
    )
    .order("created_at", { ascending: false });

  // フラグが立っているユーザーを取得
  const { data: flaggedProfiles } = await supabase
    .from("profiles")
    .select("id, is_flagged")
    .eq("is_flagged", true);

  // お問い合わせメッセージを取得（管理者のみ読み取れる）
  const adminClient = createAdminClient();
  const { data: contactMessages } = await adminClient
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* ヘッダー */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-lg">管理者ダッシュボード</h1>
            <p className="text-slate-400 text-sm mt-1">
              すべてのプレゼンテーションを管理
            </p>
          </div>
          <a
            href="/dashboard"
            className="text-slate-300 hover:text-white text-sm border border-slate-600 hover:border-slate-400 px-4 py-2 rounded-lg transition-colors"
          >
            ← 戻る
          </a>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* ⚠️ 不正フラグアラート */}
        {flaggedProfiles && flaggedProfiles.length > 0 && (
          <div className="mb-8 bg-yellow-500/20 border border-yellow-400/30 rounded-xl px-6 py-4">
            <p className="text-yellow-300 font-semibold mb-1">
              ⚠️ 複数アカウントの疑いがあるユーザー（{flaggedProfiles.length} 件）
            </p>
            <p className="text-yellow-200/70 text-sm">
              同じクレジットカードで複数のアカウントを作成した可能性があります。
              該当ユーザーのプレゼンには🚩マークが表示されます。
            </p>
          </div>
        )}

        {/* 統計情報 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {/* 受付中 */}
          <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
            <p className="text-blue-300 text-sm font-semibold">受付中</p>
            <p className="text-2xl font-bold text-white mt-1">
              {presentations?.filter((p) => p.status === "pending" || !p.status)
                .length || 0}
            </p>
          </div>

          {/* 添削中 */}
          <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4">
            <p className="text-yellow-300 text-sm font-semibold">添削中</p>
            <p className="text-2xl font-bold text-white mt-1">
              {presentations?.filter((p) => p.status === "processing").length ||
                0}
            </p>
          </div>

          {/* 完了 */}
          <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4">
            <p className="text-green-300 text-sm font-semibold">完了</p>
            <p className="text-2xl font-bold text-white mt-1">
              {presentations?.filter((p) => p.status === "completed").length ||
                0}
            </p>
          </div>
        </div>

        {/* プレゼンテーション一覧 */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">
            プレゼンテーション一覧
          </h2>
          <AdminPresentationList
            presentations={presentations || []}
            flaggedUserIds={flaggedProfiles?.map((p) => p.id) ?? []}
          />
        </div>

        {/* お問い合わせ一覧 */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            お問い合わせ
            {contactMessages && contactMessages.length > 0 && (
              <span className="text-sm font-normal text-slate-400 ml-2">
                （{contactMessages.length} 件）
              </span>
            )}
          </h2>

          {!contactMessages || contactMessages.length === 0 ? (
            <p className="text-slate-500 text-sm">お問い合わせはまだありません</p>
          ) : (
            <div className="space-y-4">
              {contactMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-5"
                >
                  {/* ヘッダー行 */}
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="text-white font-semibold">{msg.name}</span>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-blue-400 hover:text-blue-300 text-sm underline"
                    >
                      {msg.email}
                    </a>
                    <span className="text-slate-500 text-xs ml-auto">
                      {new Date(msg.created_at).toLocaleString("ja-JP")}
                    </span>
                  </div>
                  {/* 本文 */}
                  <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

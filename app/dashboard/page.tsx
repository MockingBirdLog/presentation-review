/**
 * app/dashboard/page.tsx — ダッシュボードページ（/dashboard）
 *
 * ログイン後に表示されるページです。
 * サーバーコンポーネントとして動作し、ログインしていない場合は
 * ログインページにリダイレクトします。
 *
 * "use client" がないのでサーバーコンポーネントです。
 * サーバー側でユーザー情報とアップロード済みファイルを取得してから HTML を返します。
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";
import UploadZone from "./components/UploadZone";
import FileList from "./components/FileList";
import ReferralSection from "./components/ReferralSection";
import Footer from "@/app/components/Footer";

export default async function DashboardPage() {
  const supabase = createClient();

  // ログイン中のユーザー情報を取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ログインしていない場合はログインページへリダイレクト
  if (!user) {
    redirect("/login");
  }

  // クレジット残高と紹介コードを取得
  const { data: profile } = await supabase
    .from("profiles")
    .select("credits, referral_code")
    .eq("id", user.id)
    .single();

  const credits = profile?.credits ?? 0;
  const referralCode = profile?.referral_code ?? null;

  // 紹介コードを使って登録した人数を取得
  const { count: referralCount } = referralCode
    ? await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("referred_by", referralCode)
    : { count: 0 };

  // 紹介用URL（開発中は http://localhost:3000/signup?ref=xxx）
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const referralUrl = referralCode ? `${baseUrl}/signup?ref=${referralCode}` : "";

  // ユーザーがアップロードしたファイル一覧を取得
  const { data: presentations } = await supabase
    .from("presentations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false }); // 新しい順に並べる

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">

      {/* ヘッダー */}
      <header className="border-b border-white/10 px-6 py-4 animate-slideInDown">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-white font-bold text-lg">プレゼン添削AI</span>
          <div className="flex items-center gap-4">
            {/* クレジット残高 */}
            <a
              href="/pricing"
              className="flex items-center gap-1.5 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm px-3 py-1.5 rounded-full hover:bg-blue-500/30 transition-colors"
            >
              <span>💎</span>
              <span className="font-semibold">{credits}</span>
              <span className="text-blue-400">クレジット</span>
            </a>
            <span className="text-slate-400 text-sm hidden sm:block">{user.email}</span>
            <a
              href="/dashboard/settings"
              className="text-slate-300 hover:text-white text-sm px-3 py-1.5 rounded transition-colors"
            >
              ⚙️ 設定
            </a>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-2 animate-fadeInUp">ダッシュボード</h1>
        <p className="text-slate-400 mb-10 animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
          ここにプレゼン資料をアップロードして、AI による添削を受けられます。
        </p>

        {/* ======== アップロードエリア ======== */}
        <div className="mb-16 animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-xl font-semibold text-white mb-4">資料をアップロード</h2>
          <UploadZone userId={user.id} credits={credits} />
        </div>

        {/* ======== 友達紹介セクション ======== */}
        {referralUrl && (
          <div className="mb-16">
            <ReferralSection
              referralUrl={referralUrl}
              referralCount={referralCount ?? 0}
            />
          </div>
        )}

        {/* ======== アップロード済みファイル一覧 ======== */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            アップロード済みの資料
            {presentations && presentations.length > 0 && (
              <span className="text-sm font-normal text-slate-400 ml-2">
                ({presentations.length} 件)
              </span>
            )}
          </h2>
          <FileList presentations={presentations || []} />
        </div>
      </main>

      {/* フッター */}
      <Footer />
    </div>
  );
}

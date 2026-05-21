import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DeleteAccountButton from "./DeleteAccountButton";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();

  const createdDate = user.created_at ? new Date(user.created_at).toLocaleDateString("ja-JP") : "不明";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8 animate-fadeInUp">アカウント設定</h1>

        <div className="bg-white/5 border border-white/10 rounded-lg p-8 mb-8 animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-white font-semibold text-lg mb-6">アカウント情報</h2>

          <div className="space-y-4">
            <div>
              <p className="text-slate-400 text-sm">メールアドレス</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">残りクレジット</p>
              <p className="text-white font-medium">{profile?.credits || 0} クレジット</p>
            </div>

            <div>
              <p className="text-slate-400 text-sm">アカウント作成日</p>
              <p className="text-white font-medium">{createdDate}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-red-500/20 rounded-lg p-8 animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-white font-semibold text-lg mb-2">危険ゾーン</h2>
          <p className="text-slate-400 text-sm mb-6">以下のアクションは取り消すことができません。</p>

          <DeleteAccountButton />
        </div>
      </div>
    </div>
  );
}

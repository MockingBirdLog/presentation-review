/**
 * app/dashboard/LogoutButton.tsx — ログアウトボタン
 *
 * ログアウト処理はブラウザ側（Supabase クライアント）から実行するため、
 * "use client" をつけたクライアントコンポーネントにします。
 *
 * サーバーコンポーネント（dashboard/page.tsx）の中に
 * クライアントコンポーネントを入れることができます。
 */

"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut(); // Supabase のセッションを削除
    router.push("/");              // トップページへ移動
    router.refresh();             // サーバー側のキャッシュをリセット
  }

  return (
    <button
      onClick={handleLogout}
      className="text-slate-400 hover:text-white text-sm border border-slate-600 hover:border-slate-400 px-4 py-1.5 rounded-lg transition-colors"
    >
      ログアウト
    </button>
  );
}

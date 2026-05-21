/**
 * lib/supabase/client.ts — ブラウザ用 Supabase クライアント
 *
 * "use client" のついたクライアントコンポーネント（ブラウザで動くコード）から
 * Supabase を使うときに呼び出します。
 *
 * createBrowserClient は @supabase/ssr が提供する関数で、
 * Next.js App Router のブラウザ環境に最適化されています。
 */

import { createBrowserClient } from "@supabase/ssr";

/**
 * ブラウザ用 Supabase クライアントを作成して返す関数
 *
 * 使い方：
 *   const supabase = createClient()
 *   const { data } = await supabase.auth.signInWithPassword({ email, password })
 */
export function createClient() {
  return createBrowserClient(
    // process.env.NEXT_PUBLIC_... で .env.local の値を読み込む
    process.env.NEXT_PUBLIC_SUPABASE_URL!,    // ! は「この値は必ずある」という TypeScript への宣言
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

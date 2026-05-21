/**
 * lib/supabase/server.ts — サーバー用 Supabase クライアント
 *
 * サーバーコンポーネント（"use client" がないファイル）や
 * Route Handler（API）・Middleware から Supabase を使うときに呼び出します。
 *
 * サーバー側ではブラウザの Cookie を直接触れないため、
 * Next.js の cookies() 関数を使って Cookie を読み書きします。
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers"; // Next.js のサーバー側 Cookie ユーティリティ

/**
 * サーバー用 Supabase クライアントを作成して返す関数
 *
 * 使い方（サーバーコンポーネント内）：
 *   const supabase = createClient()
 *   const { data: { user } } = await supabase.auth.getUser()
 */
export function createClient() {
  const cookieStore = cookies(); // サーバー側の Cookie ストアを取得

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Supabase がセッション情報を Cookie から読み込む関数
        getAll() {
          return cookieStore.getAll();
        },
        // Supabase がセッション情報を Cookie に書き込む関数
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // サーバーコンポーネントから呼ばれた場合は Cookie の書き込みができない
            // middleware.ts で代わりに処理されるので、ここではエラーを無視する
          }
        },
      },
    }
  );
}

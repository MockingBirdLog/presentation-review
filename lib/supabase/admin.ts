/**
 * lib/supabase/admin.ts — Supabase 管理者用クライアント
 *
 * service_role キーを使った特別なクライアントです。
 * 通常のクライアントはログインユーザーのデータしか触れませんが、
 * このクライアントはすべてのユーザーのデータを操作できます。
 *
 * ⚠️ 絶対にサーバー側（API Route・サーバーコンポーネント）でのみ使ってください。
 * ブラウザのコードで使うと service_role キーが漏洩します。
 *
 * 主な用途：Stripe の Webhook でクレジットを加算するとき
 */

import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // 管理者キー（RLS を無視してすべてのデータにアクセスできる）
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

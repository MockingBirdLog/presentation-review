/**
 * app/auth/callback/route.ts — 認証コールバックの Route Handler
 *
 * Supabase がメール確認などの認証処理を完了したあと、
 * ブラウザをこの URL にリダイレクトしてきます。
 * ここでセッションを確立し、友達紹介の処理を行ってから
 * ダッシュボードへ転送します。
 */

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createClient();

    // 認証コードをセッションに交換する（ユーザー情報も取得する）
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      const user = data.session.user;

      // ==============================
      // 友達紹介の処理
      // ==============================
      // サインアップ時に referral_code をメタデータに保存してあれば処理する
      const referralCode = user.user_metadata?.referral_code as string | undefined;
      if (referralCode) {
        try {
          const adminClient = createAdminClient();
          // 紹介者と新規ユーザー両方に +5 クレジットを付与
          await adminClient.rpc("process_referral", {
            new_user_id: user.id,
            referral_code_used: referralCode,
          });
        } catch {
          // 紹介処理に失敗してもログインは続行する
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=認証に失敗しました`);
}

/**
 * middleware.ts — ミドルウェア（すべてのリクエストの前に実行される処理）
 *
 * Next.js のミドルウェアはページが表示される前に毎回実行されます。
 * ここでは Supabase のセッション（ログイン状態）を更新するために使います。
 *
 * セッションの有効期限が切れていた場合、自動的にリフレッシュしてくれます。
 * これがないとログイン状態が正しく維持されません。
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // レスポンスを一旦そのまま通す（後でセッション情報を付け加える）
  let supabaseResponse = NextResponse.next({
    request,
  });

  // ミドルウェア用の Supabase クライアントを作成
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // リクエストとレスポンスの両方に Cookie をセット
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // セッションを更新する（これが middleware の主な仕事）
  // ※ getUser() を呼ぶことで期限切れトークンが自動更新される
  await supabase.auth.getUser();

  return supabaseResponse;
}

// middleware を実行するパスの設定
// 下記のパスは除外（静的ファイルや API には middleware は不要）
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

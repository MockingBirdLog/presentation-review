import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Resend } from "resend";
import { generateDeleteToken } from "@/lib/delete-tokens";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

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

    const { data: { user }, error: getUserError } = await supabase.auth.getUser();

    if (getUserError || !user) {
      return Response.json({ error: "認証エラー" }, { status: 401 });
    }

    if (!password) {
      return Response.json({ error: "パスワードが必要です" }, { status: 400 });
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: password,
    });

    if (signInError) {
      return Response.json({ error: "パスワードが正しくありません" }, { status: 401 });
    }

    const deleteToken = generateDeleteToken(user.id, user.email!);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const confirmLink = `${baseUrl}/dashboard/delete-confirmation?token=${deleteToken}`;

    await resend.emails.send({
      from: "プレゼン添削AI <noreply@resend.dev>",
      to: user.email!,
      subject: "アカウント削除のご確認",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #171717;">アカウント削除のご確認</h2>
          <p>アカウント削除のリクエストを受け取りました。</p>
          <p style="color: #ef4444; font-weight: bold;">
            このアクションは取り消せません。すべてのデータが永久削除されます。
          </p>
          <p>以下のリンクをクリックして、アカウント削除を完了してください。このリンクは24時間有効です。</p>
          <a href="${confirmLink}" style="display: inline-block; padding: 12px 24px; background-color: #ef4444; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            アカウントを削除する
          </a>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            このメールに心当たりがない場合は、このメールを無視してください。
          </p>
        </div>
      `,
    });

    return Response.json({ success: true, message: "確認メールを送信しました" });
  } catch (error) {
    console.error("Delete request error:", error);
    return Response.json({ error: "エラーが発生しました" }, { status: 500 });
  }
}

/**
 * app/api/admin/update-status/route.ts — ステータス更新 + 完了通知メール
 *
 * 管理者がステータスを「完了」に変更したとき、ユーザーにメールを送ります。
 * 直接 Supabase を呼ばずにこの API を経由することで、サーバー側でメール送信できます。
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  // ==============================
  // 管理者チェック
  // ==============================
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return NextResponse.json({ error: "権限がありません" }, { status: 403 });
  }

  // ==============================
  // リクエストの解析
  // ==============================
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  const { presentationId, newStatus } = body as {
    presentationId: string;
    newStatus: string;
  };

  if (!presentationId || !newStatus) {
    return NextResponse.json({ error: "パラメーターが不足しています" }, { status: 400 });
  }

  const adminClient = createAdminClient();

  // ==============================
  // ステータスを更新
  // ==============================
  const { data: presentation, error: updateError } = await adminClient
    .from("presentations")
    .update({ status: newStatus })
    .eq("id", presentationId)
    .select("id, file_name, user_id")
    .single();

  if (updateError || !presentation) {
    return NextResponse.json(
      { error: "ステータスの更新に失敗しました" },
      { status: 500 }
    );
  }

  // ==============================
  // 完了になった場合だけメールを送信
  // ==============================
  if (newStatus === "completed") {
    try {
      // ユーザーのメールアドレスを取得
      const { data: { user: targetUser } } = await adminClient.auth.admin.getUserById(
        presentation.user_id
      );

      if (targetUser?.email) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

        await resend.emails.send({
          // ※ 独自ドメインを Resend で認証済みの場合はそのアドレスに変更してください
          // 　 テスト中は onboarding@resend.dev のまま（自分のメールにのみ届きます）
          from: "プレゼン添削AI <onboarding@resend.dev>",
          to: targetUser.email,
          subject: `【添削完了】「${presentation.file_name}」の添削が届きました`,
          html: buildEmailHtml(presentation.file_name, baseUrl),
        });
      }
    } catch (emailError) {
      // メール送信に失敗してもステータス更新は成功扱いにする
      console.error("メール送信エラー:", emailError);
    }
  }

  return NextResponse.json({ success: true });
}

// ==============================
// メールの HTML テンプレート
// ==============================
function buildEmailHtml(fileName: string, baseUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- ロゴ -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <p style="color:#60a5fa;font-size:20px;font-weight:700;margin:0;">プレゼン添削AI</p>
            </td>
          </tr>

          <!-- メインカード -->
          <tr>
            <td style="background-color:#1e293b;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:40px 32px;">

              <!-- アイコン -->
              <p style="font-size:48px;text-align:center;margin:0 0 16px;">✅</p>

              <!-- タイトル -->
              <h1 style="color:#ffffff;font-size:24px;font-weight:700;text-align:center;margin:0 0 8px;">
                添削が完了しました！
              </h1>
              <p style="color:#94a3b8;font-size:14px;text-align:center;margin:0 0 32px;">
                お待たせしました。添削結果をご確認ください。
              </p>

              <!-- ファイル名 -->
              <div style="background-color:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:16px;margin-bottom:32px;">
                <p style="color:#94a3b8;font-size:12px;margin:0 0 4px;">添削されたファイル</p>
                <p style="color:#ffffff;font-size:15px;font-weight:600;margin:0;word-break:break-all;">
                  ${escapeHtml(fileName)}
                </p>
              </div>

              <!-- ボタン -->
              <div style="text-align:center;">
                <a href="${baseUrl}/dashboard"
                   style="display:inline-block;background-color:#3b82f6;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:10px;">
                  ダッシュボードで確認する →
                </a>
              </div>
            </td>
          </tr>

          <!-- フッター -->
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="color:#475569;font-size:12px;margin:0;">
                このメールはプレゼン添削AIからお送りしています。<br />
                心当たりのない場合は無視してください。
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

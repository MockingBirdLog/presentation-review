/**
 * app/api/admin/download/route.ts — 管理者用ファイルダウンロード API
 *
 * 管理者だけがユーザーのファイルをダウンロードできる API です。
 * 通常のストレージポリシーは「自分のファイルしか取得できない」ですが、
 * ここでは管理者クライアント（service_role）を使ってその制限を回避します。
 *
 * 流れ：
 * 1. 管理者かどうか確認
 * 2. 管理者クライアントで「署名付きURL」を発行（60秒間だけ有効なダウンロードURL）
 * 3. その URL をフロントエンドに返す
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get("path");       // ダウンロードするファイルのパス
  const fileName = searchParams.get("name") ?? "download"; // 保存時のファイル名

  if (!filePath) {
    return NextResponse.json({ error: "パスが必要です" }, { status: 400 });
  }

  // ==============================
  // 管理者チェック
  // ==============================
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  if (user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 });
  }

  // ==============================
  // 署名付きURL を発行（管理者クライアントで RLS をバイパス）
  // ==============================
  const adminClient = createAdminClient();
  const { data, error } = await adminClient.storage
    .from("presentations")
    .createSignedUrl(filePath, 60); // 60秒間有効な URL を発行

  if (error || !data) {
    return NextResponse.json(
      { error: "URLの生成に失敗しました: " + error?.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: data.signedUrl, fileName });
}

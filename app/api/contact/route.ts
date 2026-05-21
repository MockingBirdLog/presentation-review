/**
 * app/api/contact/route.ts — お問い合わせ保存 API
 *
 * フォームから送信された内容を Supabase の contact_messages テーブルに保存します。
 * 同じ IP から短時間に大量送信されるのを防ぐレート制限付き。
 */

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  // ==============================
  // レート制限（1時間に5回まで）
  // ==============================
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`contact:${ip}`, 5, 60 * 60);

  if (!allowed) {
    return NextResponse.json(
      { error: "送信回数の上限に達しました。しばらく時間をおいてから再度お試しください。" },
      { status: 429 }
    );
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

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  const { name, email, message } = body as Record<string, unknown>;

  // ==============================
  // バリデーション
  // ==============================
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "お名前を入力してください" }, { status: 400 });
  }

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "メールアドレスを入力してください" }, { status: 400 });
  }

  // メールアドレスの形式チェック
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "メールアドレスの形式が正しくありません" }, { status: 400 });
  }

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json({ error: "お問い合わせ内容を入力してください" }, { status: 400 });
  }

  if (message.length > 3000) {
    return NextResponse.json(
      { error: "お問い合わせ内容は 3000 文字以内でご入力ください" },
      { status: 400 }
    );
  }

  // ==============================
  // Supabase に保存
  // ==============================
  const supabase = createAdminClient();

  const { error } = await supabase.from("contact_messages").insert({
    name: name.trim().slice(0, 100),
    email: email.trim().slice(0, 200),
    message: message.trim().slice(0, 3000),
  });

  if (error) {
    console.error("お問い合わせ保存エラー:", error);
    return NextResponse.json(
      { error: "送信に失敗しました。しばらくしてから再度お試しください。" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

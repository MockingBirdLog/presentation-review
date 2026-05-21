/**
 * app/api/auth/check-email/route.ts — メールドメイン検証 API
 *
 * サインアップ前にメールアドレスが使い捨てドメインでないかを確認します。
 * レート制限付き（10分間に20回まで）。
 */

import { NextResponse } from "next/server";
import { isBlockedEmailDomain } from "@/lib/blocked-email-domains";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  // レート制限（10分間に20回まで）
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`check-email:${ip}`, 20, 10 * 60);

  if (!allowed) {
    return NextResponse.json(
      { error: "リクエストが多すぎます。しばらく時間をおいてから再度お試しください。" },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  const email = (body as Record<string, unknown>)?.email;

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "メールアドレスが必要です" }, { status: 400 });
  }

  if (isBlockedEmailDomain(email)) {
    return NextResponse.json(
      { blocked: true, error: "このメールアドレスは使用できません。通常のメールアドレスでご登録ください。" },
      { status: 400 }
    );
  }

  return NextResponse.json({ blocked: false });
}

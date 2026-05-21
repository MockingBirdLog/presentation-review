/**
 * lib/rate-limit.ts — シンプルなレート制限
 *
 * 同じ IP アドレスから短時間に大量のリクエストが来るのを防ぎます。
 * サーバーのメモリで管理するシンプルな実装です。
 */

type Record = { count: number; resetAt: number };

const store = new Map<string, Record>();

// 古いレコードを1分ごとに削除してメモリを節約
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (now > record.resetAt) store.delete(key);
  }
}, 60_000);

/**
 * レート制限をチェックする
 * @param key      識別キー（例: "contact:192.168.1.1"）
 * @param limit    許可するリクエスト数
 * @param windowSec 時間ウィンドウ（秒）
 * @returns allowed: 許可 / blocked: 制限中
 */
export function rateLimit(
  key: string,
  limit: number,
  windowSec: number
): { allowed: boolean } {
  const now = Date.now();
  const record = store.get(key);

  if (!record || now > record.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    return { allowed: true };
  }

  if (record.count >= limit) {
    return { allowed: false };
  }

  record.count++;
  return { allowed: true };
}

/**
 * リクエストから IP アドレスを取得する
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  );
}

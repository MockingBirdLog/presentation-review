interface DeleteToken {
  userId: string;
  userEmail: string;
  expiresAt: number;
}

const tokens = new Map<string, DeleteToken>();

export function generateDeleteToken(userId: string, userEmail: string): string {
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  tokens.set(token, { userId, userEmail, expiresAt });
  return token;
}

export function verifyDeleteToken(token: string): { userId: string; userEmail: string } | null {
  const data = tokens.get(token);
  if (!data) return null;
  if (data.expiresAt < Date.now()) {
    tokens.delete(token);
    return null;
  }
  return { userId: data.userId, userEmail: data.userEmail };
}

export function consumeDeleteToken(token: string): boolean {
  return tokens.delete(token);
}

setInterval(() => {
  for (const [token, data] of tokens.entries()) {
    if (data.expiresAt < Date.now()) {
      tokens.delete(token);
    }
  }
}, 60 * 60 * 1000);

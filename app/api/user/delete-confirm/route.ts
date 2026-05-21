import { createServerClient } from "@supabase/ssr";
import { createAdminClient } from "@/lib/supabase/admin";
import { cookies } from "next/headers";
import { verifyDeleteToken, consumeDeleteToken } from "@/lib/delete-tokens";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return Response.json({ error: "無効なトークンです" }, { status: 400 });
    }

    const tokenData = verifyDeleteToken(token);
    if (!tokenData) {
      return Response.json({ error: "トークンが無効または期限切れです" }, { status: 400 });
    }

    const adminClient = createAdminClient();

    const userId = tokenData.userId;
    const userEmail = tokenData.userEmail;

    await adminClient.from("presentations").delete().eq("user_id", userId);

    await adminClient.from("credit_purchases").delete().eq("user_id", userId);

    await adminClient.from("contact_messages").delete().eq("user_email", userEmail);

    await adminClient.from("profiles").delete().eq("id", userId);

    const { data: files } = await adminClient.storage.from("presentations").list(`${userId}/`);

    if (files && files.length > 0) {
      const filePaths = files.map((f) => `${userId}/${f.name}`);
      await adminClient.storage.from("presentations").remove(filePaths);
    }

    await adminClient.auth.admin.deleteUser(userId);

    consumeDeleteToken(token);

    return Response.json({ success: true, message: "アカウントが削除されました" });
  } catch (error) {
    console.error("Delete confirm error:", error);
    return Response.json({ error: "削除処理中にエラーが発生しました" }, { status: 500 });
  }
}

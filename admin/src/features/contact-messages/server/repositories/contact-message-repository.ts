import "server-only";

import { createAdminClient } from "@mirai-gikai/supabase";
import type { ContactMessage, ContactStatus } from "../../shared/types";

const TABLE = "gikai_contact_messages";

/** お問い合わせを新しい順に取得（最大 200 件） */
export async function findContactMessages(): Promise<ContactMessage[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select(
      "id, category, name, reply_to, message, page_path, status, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    throw new Error(`お問い合わせの取得に失敗しました: ${error.message}`);
  }
  return data ?? [];
}

export async function updateContactMessageStatus(
  id: string,
  status: ContactStatus
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from(TABLE).update({ status }).eq("id", id);

  if (error) {
    throw new Error(`対応状況の更新に失敗しました: ${error.message}`);
  }
}

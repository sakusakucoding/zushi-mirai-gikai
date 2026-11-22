import "server-only";

import { createAdminClient } from "@mirai-gikai/supabase";
import type { ContactData } from "../../shared/contact-schema";

const TABLE = "gikai_contact_messages";

/** お問い合わせを保存する */
export async function insertContactMessage(
  data: Omit<ContactData, "website"> & { ipHash: string | null }
) {
  const supabase = createAdminClient();
  const { error } = await supabase.from(TABLE).insert({
    category: data.category,
    name: data.name,
    reply_to: data.replyTo,
    message: data.message,
    page_path: data.pagePath,
    ip_hash: data.ipHash,
  });

  if (error) {
    throw new Error(`Failed to insert contact message: ${error.message}`);
  }
}

/** 指定時刻以降に同じ IP ハッシュから送られた件数 */
export async function countRecentContactMessages(
  ipHash: string,
  since: Date
): Promise<number> {
  const supabase = createAdminClient();
  const { count, error } = await supabase
    .from(TABLE)
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since.toISOString());

  if (error) {
    throw new Error(`Failed to count contact messages: ${error.message}`);
  }
  return count ?? 0;
}

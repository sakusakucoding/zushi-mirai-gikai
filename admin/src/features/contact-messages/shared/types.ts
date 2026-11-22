export const CONTACT_STATUSES = ["new", "in_progress", "done"] as const;
export type ContactStatus = (typeof CONTACT_STATUSES)[number];

export const CONTACT_STATUS_LABELS: Record<ContactStatus, string> = {
  new: "未対応",
  in_progress: "対応中",
  done: "対応済み",
};

export const CONTACT_CATEGORY_LABELS: Record<string, string> = {
  site: "サイトについて",
  correction: "掲載内容の誤り",
  bill: "議案について",
  other: "その他",
};

export function isContactStatus(value: unknown): value is ContactStatus {
  return (
    typeof value === "string" &&
    (CONTACT_STATUSES as readonly string[]).includes(value)
  );
}

export type ContactMessage = {
  id: string;
  category: string;
  name: string | null;
  reply_to: string | null;
  message: string;
  page_path: string | null;
  status: string;
  created_at: string;
};

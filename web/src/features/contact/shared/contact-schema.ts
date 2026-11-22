import { z } from "zod";

export const CONTACT_CATEGORIES = [
  "site",
  "correction",
  "bill",
  "other",
] as const;
export type ContactCategory = (typeof CONTACT_CATEGORIES)[number];

export const CONTACT_CATEGORY_LABELS: Record<ContactCategory, string> = {
  site: "サイトについて",
  correction: "掲載内容の誤り",
  bill: "議案について",
  other: "その他",
};

export const CONTACT_MESSAGE_MAX_LENGTH = 2000;

/** 空文字は未入力（null）として扱う */
const optionalText = (max: number, message: string) =>
  z
    .string()
    .trim()
    .max(max, message)
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()
    .transform((v) => v ?? null);

export const contactSchema = z.object({
  category: z.enum(CONTACT_CATEGORIES, {
    message: "お問い合わせの種類を選んでください",
  }),
  name: optionalText(100, "お名前は100文字以内で入力してください"),
  replyTo: optionalText(200, "連絡先は200文字以内で入力してください"),
  message: z
    .string()
    .trim()
    .min(1, "お問い合わせ内容を入力してください")
    .max(
      CONTACT_MESSAGE_MAX_LENGTH,
      `お問い合わせ内容は${CONTACT_MESSAGE_MAX_LENGTH}文字以内で入力してください`
    ),
  pagePath: optionalText(500, "ページのパスが長すぎます"),
  /** ボット対策の見えない入力欄。人が送信するときは空のまま */
  website: z.string().optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

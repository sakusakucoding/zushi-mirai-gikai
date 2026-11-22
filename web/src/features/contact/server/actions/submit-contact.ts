"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { type ContactInput, contactSchema } from "../../shared/contact-schema";
import {
  countRecentContactMessages,
  insertContactMessage,
} from "../repositories/contact-repository";

export interface SubmitContactResult {
  success: boolean;
  error?: string;
}

/** 同じ IP からの送信は 1 時間に 5 件まで */
const RATE_LIMIT_COUNT = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

async function getIpHash(): Promise<string | null> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip");
  if (!ip) return null;
  // 生の IP は保存しない。サーバー側の秘密値を混ぜてハッシュ化する
  const salt = process.env.REVALIDATE_SECRET ?? "";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

/**
 * お問い合わせフォームの送信
 */
export async function submitContact(
  input: ContactInput
): Promise<SubmitContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "入力内容に誤りがあります",
    };
  }

  // ボット対策の見えない欄が埋まっていたら、保存せずに成功扱いで返す
  if (parsed.data.website) {
    return { success: true };
  }

  try {
    const ipHash = await getIpHash();
    if (ipHash) {
      const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
      const recent = await countRecentContactMessages(ipHash, since);
      if (recent >= RATE_LIMIT_COUNT) {
        return {
          success: false,
          error:
            "短時間に送信できる回数を超えました。時間をおいて再度お試しください",
        };
      }
    }

    const { website: _website, ...data } = parsed.data;
    await insertContactMessage({ ...data, ipHash });
    return { success: true };
  } catch (e) {
    console.error("[submitContact]", e);
    return {
      success: false,
      error: "送信に失敗しました。時間をおいて再度お試しください",
    };
  }
}

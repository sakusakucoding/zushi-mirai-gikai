import { describe, expect, it } from "vitest";
import { CONTACT_MESSAGE_MAX_LENGTH, contactSchema } from "./contact-schema";

describe("contactSchema", () => {
  it("必須項目だけで通り、任意項目の空文字は null になる", () => {
    const result = contactSchema.safeParse({
      category: "site",
      name: "",
      replyTo: "  ",
      message: "  文字が読みにくいです  ",
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data).toMatchObject({
      category: "site",
      name: null,
      replyTo: null,
      message: "文字が読みにくいです",
      pagePath: null,
    });
  });

  it("内容が空なら弾く", () => {
    const result = contactSchema.safeParse({ category: "other", message: " " });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues[0]?.message).toBe(
      "お問い合わせ内容を入力してください"
    );
  });

  it("内容が長すぎると弾く", () => {
    const result = contactSchema.safeParse({
      category: "other",
      message: "あ".repeat(CONTACT_MESSAGE_MAX_LENGTH + 1),
    });
    expect(result.success).toBe(false);
  });

  it("未知の種類は弾く", () => {
    const result = contactSchema.safeParse({
      category: "spam",
      message: "test",
    });
    expect(result.success).toBe(false);
  });
});

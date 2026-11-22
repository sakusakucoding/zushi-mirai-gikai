"use client";

import { usePathname } from "next/navigation";
import { type FormEvent, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_ANCHOR } from "@/config/site";
import { submitContact } from "../../server/actions/submit-contact";
import {
  CONTACT_CATEGORIES,
  CONTACT_CATEGORY_LABELS,
  CONTACT_MESSAGE_MAX_LENGTH,
  type ContactCategory,
} from "../../shared/contact-schema";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * サイト下部のお問い合わせフォーム。送信内容は Supabase の
 * gikai_contact_messages に保存され、管理画面の「お問い合わせ」で確認できる。
 */
export function ContactForm() {
  const pathname = usePathname();
  const baseId = useId();
  const [category, setCategory] = useState<ContactCategory>("site");
  const [name, setName] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const result = await submitContact({
      category,
      name,
      replyTo,
      message,
      pagePath: pathname,
      website,
    });
    if (result.success) {
      setStatus("sent");
      setName("");
      setReplyTo("");
      setMessage("");
    } else {
      setStatus("error");
      setError(result.error ?? "送信に失敗しました");
    }
  };

  return (
    <section
      id={CONTACT_ANCHOR}
      aria-labelledby={`${baseId}-title`}
      className="w-full scroll-mt-24 rounded-2xl bg-white p-6 text-left shadow-sm mb-12"
    >
      <h2 id={`${baseId}-title`} className="text-lg font-bold text-black">
        お問い合わせ
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-mirai-text-note">
        サイトへのご意見、掲載内容の誤りのご指摘などはこちらからお送りください。個別の返信はお約束できません。
      </p>

      {status === "sent" ? (
        <div
          role="status"
          className="mt-5 rounded-lg bg-mirai-brand-mint px-4 py-5 text-sm text-black"
        >
          送信しました。ありがとうございます。
          <button
            type="button"
            className="ml-2 underline"
            onClick={() => setStatus("idle")}
          >
            続けて送る
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`${baseId}-category`}
              className="text-sm font-semibold"
            >
              種類
            </label>
            <select
              id={`${baseId}-category`}
              value={category}
              onChange={(e) => setCategory(e.target.value as ContactCategory)}
              className="h-10 rounded-md border border-input bg-white px-3 text-sm"
            >
              {CONTACT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CONTACT_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${baseId}-name`} className="text-sm font-semibold">
              お名前<span className="ml-1 text-xs font-normal">（任意）</span>
            </label>
            <Input
              id={`${baseId}-name`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              autoComplete="name"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`${baseId}-reply`}
              className="text-sm font-semibold"
            >
              返信先<span className="ml-1 text-xs font-normal">（任意）</span>
            </label>
            <Input
              id={`${baseId}-reply`}
              value={replyTo}
              onChange={(e) => setReplyTo(e.target.value)}
              maxLength={200}
              placeholder="返信を希望する場合のみ、メールアドレスなど"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`${baseId}-message`}
              className="text-sm font-semibold"
            >
              内容<span className="ml-1 text-xs font-normal">（必須）</span>
            </label>
            <Textarea
              id={`${baseId}-message`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={CONTACT_MESSAGE_MAX_LENGTH}
              rows={5}
              required
            />
            <p className="text-right text-xs text-mirai-text-muted">
              {message.length} / {CONTACT_MESSAGE_MAX_LENGTH}
            </p>
          </div>

          {/* ボット対策（人には見えない欄） */}
          <div aria-hidden="true" className="absolute -left-[9999px]">
            <label htmlFor={`${baseId}-website`}>Website</label>
            <input
              id={`${baseId}-website`}
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-stance-against">
              {error}
            </p>
          )}

          <p className="text-xs leading-relaxed text-mirai-text-note">
            送信内容は運営者のみが確認し、サイトの改善と対応のために使います。詳しくはプライバシーポリシーをご覧ください。
          </p>

          <Button
            type="submit"
            disabled={status === "sending" || message.trim() === ""}
            className="self-center rounded-full px-10"
          >
            {status === "sending" ? "送信中…" : "送信する"}
          </Button>
        </form>
      )}
    </section>
  );
}

import { ContactStatusSelect } from "@/features/contact-messages/client/components/contact-status-select";
import { findContactMessages } from "@/features/contact-messages/server/repositories/contact-message-repository";
import { CONTACT_CATEGORY_LABELS } from "@/features/contact-messages/shared/types";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Date(value).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
}

export default async function ContactMessagesPage() {
  const messages = await findContactMessages();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-2">お問い合わせ</h1>
      <p className="mb-8 text-sm text-gray-500">
        公開サイト下部のフォームから送られた内容です（新しい順・最大200件）。
      </p>

      {messages.length === 0 ? (
        <p className="text-gray-500">まだお問い合わせはありません</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {messages.map((m) => (
            <li key={m.id} className="rounded-lg border bg-white p-5">
              <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded bg-gray-100 px-2 py-0.5 font-medium">
                  {CONTACT_CATEGORY_LABELS[m.category] ?? m.category}
                </span>
                <span className="text-gray-500">
                  {formatDate(m.created_at)}
                </span>
                {m.page_path && (
                  <span className="text-gray-500">送信元: {m.page_path}</span>
                )}
                <span className="ml-auto">
                  <ContactStatusSelect id={m.id} status={m.status} />
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {m.message}
              </p>
              {(m.name || m.reply_to) && (
                <p className="mt-3 text-xs text-gray-600">
                  {m.name && <>お名前: {m.name}　</>}
                  {m.reply_to && <>返信先: {m.reply_to}</>}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

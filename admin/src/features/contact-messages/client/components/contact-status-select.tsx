"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateContactStatus } from "../../server/actions/update-contact-status";
import { CONTACT_STATUS_LABELS, CONTACT_STATUSES } from "../../shared/types";

export function ContactStatusSelect({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      aria-label="対応状況"
      defaultValue={status}
      disabled={isPending}
      className="h-8 rounded-md border bg-white px-2 text-sm"
      onChange={(e) => {
        const next = e.target.value;
        startTransition(async () => {
          const result = await updateContactStatus({ id, status: next });
          if ("error" in result) toast.error(result.error);
          else toast.success("対応状況を更新しました");
        });
      }}
    >
      {CONTACT_STATUSES.map((s) => (
        <option key={s} value={s}>
          {CONTACT_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}

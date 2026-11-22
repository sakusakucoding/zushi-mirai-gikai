"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/auth/server/lib/auth-server";
import { routes } from "@/lib/routes";
import { getErrorMessage } from "@/lib/utils/get-error-message";
import { isContactStatus } from "../../shared/types";
import { updateContactMessageStatus } from "../repositories/contact-message-repository";

export async function updateContactStatus(input: {
  id: string;
  status: string;
}): Promise<{ success: true } | { error: string }> {
  try {
    await requireAdmin();
    if (!isContactStatus(input.status)) {
      return { error: "不正な対応状況です" };
    }
    await updateContactMessageStatus(input.id, input.status);
    revalidatePath(routes.contactMessages());
    return { success: true };
  } catch (error) {
    console.error("Update contact status error:", error);
    return {
      error: getErrorMessage(error, "対応状況の更新中にエラーが発生しました"),
    };
  }
}

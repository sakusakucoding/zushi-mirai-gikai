import type { BillUpdateInput } from "../types";

/**
 * 議案のステータス変更時に、関連する公開中インタビューを自動クローズすべきかを判定する。
 * 現状は議案成立 (enacted) 時のみ対象。
 */
export function shouldAutoCloseInterviewOnBillStatus(
  status: BillUpdateInput["status"]
): boolean {
  // 可決・撤回された議案は審議が終わっているため、インタビューを自動で閉じる
  return status === "enacted" || status === "withdrawn";
}

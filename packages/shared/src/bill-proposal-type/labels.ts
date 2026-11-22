import type { Database } from "@mirai-gikai/supabase";

export type BillProposalType =
  Database["public"]["Enums"]["bill_proposal_type"];

export const BILL_PROPOSAL_TYPE_LABELS: Record<BillProposalType, string> = {
  cabinet: "市長提出",
  member: "議員提出",
};

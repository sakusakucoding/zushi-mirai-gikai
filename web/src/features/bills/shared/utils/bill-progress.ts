import type { BillStatusEnum, HouseEnum } from "../types";

// ステップ番号マッピング
const STATUS_TO_STEP: Record<BillStatusEnum, number> = {
  preparing: 0,
  introduced: 1,
  in_originating_house: 2,
  in_receiving_house: 3,
  enacted: 4,
  rejected: 4,
  // 撤回は提出の段階で審議が止まった扱いにする
  withdrawn: 1,
} as const;

// プログレス比率
const PROGRESS_RATIOS = [0, 1 / 8, 3 / 8, 5 / 8, 1] as const;

/**
 * ステータスとステータスノートからメッセージを生成する
 */
export function getStatusMessage(
  status: BillStatusEnum,
  statusNote: string | null | undefined
): string {
  if (status === "preparing") return "議案提出前";
  return statusNote || "";
}

/**
 * ステップ番号と現在のステップからステップの状態を判定する
 */
export function getStepState(
  stepNumber: number,
  currentStep: number,
  isPreparing: boolean
): "active" | "inactive" {
  if (isPreparing) return "inactive";
  return stepNumber <= currentStep ? "active" : "inactive";
}

/**
 * ステップ一覧を返す。
 * 市議会は一院制のため、国会版のような発議院によるステップの入れ替えは行わない。
 */
export function getOrderedSteps(
  _originatingHouse: HouseEnum,
  baseSteps: readonly { readonly label: string }[]
): { label: string }[] {
  return baseSteps.map((s) => ({ label: s.label }));
}

/**
 * 現在のステップからプログレスバーの幅(%)を計算する
 */
export function calculateProgressWidth(currentStep: number): number {
  const ratio = PROGRESS_RATIOS[currentStep] ?? 0;
  return ratio * 100;
}

/**
 * ステータスからステップ番号を取得する
 */
export function getCurrentStep(status: BillStatusEnum): number {
  return STATUS_TO_STEP[status] ?? 0;
}

import { describe, expect, it } from "vitest";
import { shouldAutoCloseInterviewOnBillStatus } from "./should-auto-close-interview";

describe("shouldAutoCloseInterviewOnBillStatus", () => {
  it.each([
    ["enacted"],
    ["withdrawn"],
  ] as const)("%s のときは true を返す", (status) => {
    expect(shouldAutoCloseInterviewOnBillStatus(status)).toBe(true);
  });

  it.each([
    ["preparing"],
    ["introduced"],
    ["in_originating_house"],
    ["in_receiving_house"],
    ["rejected"],
  ] as const)("%s のときは false を返す", (status) => {
    expect(shouldAutoCloseInterviewOnBillStatus(status)).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import { isContactStatus } from "./types";

describe("isContactStatus", () => {
  it("定義済みの状態だけを受け付ける", () => {
    expect(isContactStatus("new")).toBe(true);
    expect(isContactStatus("in_progress")).toBe(true);
    expect(isContactStatus("done")).toBe(true);
    expect(isContactStatus("deleted")).toBe(false);
    expect(isContactStatus(1)).toBe(false);
  });
});

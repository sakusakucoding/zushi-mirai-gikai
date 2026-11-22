import { describe, expect, it } from "vitest";

import { getBillStatusLabel } from "./index";

describe("getBillStatusLabel", () => {
  it("returns '準備中' for preparing", () => {
    expect(getBillStatusLabel("preparing")).toBe("準備中");
  });

  it("returns '提出済み' for introduced", () => {
    expect(getBillStatusLabel("introduced")).toBe("提出済み");
  });

  it("returns '可決' for enacted", () => {
    expect(getBillStatusLabel("enacted")).toBe("可決");
  });

  it("returns '否決' for rejected", () => {
    expect(getBillStatusLabel("rejected")).toBe("否決");
  });

  // 逗子市議会は一院制のため、発議院に関係なく同じラベルになる
  it.each([
    ["HR", "委員会審査中"],
    ["HC", "委員会審査中"],
    [undefined, "委員会審査中"],
    [null, "委員会審査中"],
  ] as const)("in_originating_house (%s) → %s", (house, expected) => {
    expect(getBillStatusLabel("in_originating_house", house)).toBe(expected);
  });

  it.each([
    ["HR", "本会議審議中"],
    ["HC", "本会議審議中"],
    [undefined, "本会議審議中"],
    [null, "本会議審議中"],
  ] as const)("in_receiving_house (%s) → %s", (house, expected) => {
    expect(getBillStatusLabel("in_receiving_house", house)).toBe(expected);
  });

  it("returns the status string as-is for unknown status", () => {
    // biome-ignore lint/suspicious/noExplicitAny: テスト用に未知のステータスを渡す
    expect(getBillStatusLabel("unknown_status" as any)).toBe("unknown_status");
  });
});

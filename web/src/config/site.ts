/**
 * サイト全体の設定（みらい議会＠逗子市）
 *
 * 地域名・運営者名・免責文言などはここに集約しています。
 * 運営者が決まったら OPERATOR_NAME などを書き換えてください。
 */
export const SITE = {
  /** サービス名（Fork ガイドラインにより「みらい議会＠地域名」の形式） */
  NAME: "みらい議会＠逗子市",
  /** 自治体名 */
  CITY_NAME: "逗子市",
  /** 議会名 */
  COUNCIL_NAME: "逗子市議会",
  /** キャッチコピー */
  TAGLINE: "逗子市議会の議論をわかりやすく",
  /** サイトの説明文 */
  DESCRIPTION:
    "逗子市議会で今どんな議案が検討されているか、わかりやすく伝えるプラットフォーム",
  /** 運営者名 */
  OPERATOR_NAME: "お茶の間みらい会議のさく",
  /** コピーライト表記 */
  COPYRIGHT: "© 2026 みらい議会＠逗子市",
  /** Fork ガイドラインで表示が義務付けられている免責文言 */
  DISCLAIMER: "これは政党チームみらいが運営しているものではありません",
  /** テーマカラー（globals.css の --primary と合わせる） */
  THEME_COLOR: "#1f78b4",
  /** 機能の ON/OFF */
  FEATURES: {
    /** AI チャット（AI Gateway の API キーが必要）。現在は使わない */
    AI_CHAT: false,
  },
} as const;

/** お問い合わせフォームのページ内アンカー */
export const CONTACT_ANCHOR = "contact";

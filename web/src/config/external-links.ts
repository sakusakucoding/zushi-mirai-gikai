/**
 * 外部リンク定数
 *
 * TODO（運営者が決めること）:
 * - FAQ: FAQ ページを作ったら URL を差し替える
 * - GITHUB_REPO: Fork 先リポジトリの URL（AGPL-3.0 によりソースコード公開先の表示が必須）
 */
export const EXTERNAL_LINKS = {
  /** 誤り・不具合の報告先（サイト下部のお問い合わせフォーム） */
  REPORT: "/#contact",
  /** 逗子市議会の公式ページ */
  COUNCIL_OFFICIAL:
    "https://www.city.zushi.kanagawa.jp/shisei/gikai/index.html",
  FAQ: "https://github.com/sakusakucoding/zushi-mirai-gikai#readme",
  /** Fork 元（本家）サービス */
  ORIGINAL_SERVICE: "https://gikai.team-mir.ai/",
  /** Fork 元（本家）リポジトリ */
  ORIGINAL_REPO: "https://github.com/team-mirai/mirai-gikai",
  /** 本サービス（Fork 版）のソースコード公開先 */
  GITHUB_REPO: "https://github.com/sakusakucoding/zushi-mirai-gikai",
} as const;

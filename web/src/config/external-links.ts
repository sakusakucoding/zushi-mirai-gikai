/**
 * 外部リンク定数
 *
 * TODO（運営者が決めること）:
 * - REPORT: 不具合・誤り報告フォームの URL（Google フォーム等）
 * - ABOUT / FAQ: 運営者の紹介ページ・FAQ の URL（未作成ならサイト内の about へ）
 * - GITHUB_REPO: Fork 先リポジトリの URL（AGPL-3.0 によりソースコード公開先の表示が必須）
 */
export const EXTERNAL_LINKS = {
  REPORT: "https://github.com/sakusakucoding/zushi-mirai-gikai/issues",
  /** 逗子市議会の公式ページ */
  COUNCIL_OFFICIAL: "https://www.city.zushi.kanagawa.jp/",
  FAQ: "https://github.com/sakusakucoding/zushi-mirai-gikai#readme",
  /** Fork 元（本家）サービス */
  ORIGINAL_SERVICE: "https://gikai.team-mir.ai/",
  /** Fork 元（本家）リポジトリ */
  ORIGINAL_REPO: "https://github.com/team-mirai/mirai-gikai",
  /** 本サービス（Fork 版）のソースコード公開先 */
  GITHUB_REPO: "https://github.com/sakusakucoding/zushi-mirai-gikai",
} as const;

# みらい議会＠逗子市 運営開始までのチェックリスト

コードの書き換えは済んでいます。以下は **運営者が判断・入力する必要がある項目** です。

## 1. 運営者情報（必須）

`web/src/config/site.ts`

| 項目 | 現在の値（仮） | やること |
|---|---|---|
| `OPERATOR_NAME` | みらい議会＠逗子市 運営事務局 | 実際の運営者名・団体名に変更 |
| `CONTACT_EMAIL` | contact@example.com | 問い合わせ先メールアドレスに変更 |
| `COPYRIGHT` | © 2026 みらい議会＠逗子市 | 必要なら変更 |

## 2. リンク先（必須）

`web/src/config/external-links.ts`

| 項目 | 現在の値（仮） | やること |
|---|---|---|
| `GITHUB_REPO` | https://github.com/sakusakucoding/zushi-mirai-gikai | fork 先のリポジトリ名が違う場合は変更（AGPL-3.0 で表示が必須） |
| `COUNCIL_OFFICIAL` | https://www.city.zushi.kanagawa.jp/ | 逗子市議会のページの正確な URL に変更 |
| `REPORT` | GitHub Issues | 不具合・誤り報告フォーム（Google フォーム等）があれば変更 |
| `FAQ` | README | FAQ ページがあれば変更 |

## 3. 利用規約・プライバシーポリシー（必須・法的確認）

本家（政党チームみらい）の文面をもとに、運営者名・問い合わせ先・管轄裁判所（横浜地方裁判所）だけを差し替えています。
運営主体に合わせて、内容全体を確認・修正してください。

- `web/src/app/(main)/terms/page.tsx`
- `web/src/app/(main)/privacy/page.tsx`
- `web/src/app/(main)/developers/interview-data-terms/page.tsx`

## 4. 逗子市議会の情報（AI チャットの精度に影響）

`web/src/lib/prompt/source-code/templates/shared-sections.ts` の `COUNCIL_OVERVIEW` には、確認できた一般的な情報だけを書いています。
公式情報で確認したうえで、次の情報を追記してください。

- 議員定数・現在の議員名簿・会派
- 常任委員会の名称
- 定例会の開催月

## 5. 画像（任意）

ロゴ・OGP・アイコン・トップ画像は仮のオリジナル画像です。差し替える場合は以下を置き換えてください。

- `web/public/img/logo.svg`（ロゴマーク）／`web/public/img/service-logo.svg`（ロゴ文字）
- `packages/shared/src/og/ogp-logo.png`（OGP 画像内のロゴ）
- `web/public/ogp.jpg`（OGP 画像 2400×1260）
- `web/public/icons/pwa/`、`admin/public/icons/pwa/`（アイコン）
- `web/public/img/archive-hero-7f3d06.png`（会期ページのトップ画像。逗子の海などの写真に差し替えるのがおすすめ。写真の利用許諾に注意）

## 6. インフラ・外部サービス（必須）

- Supabase プロジェクトの作成 → `.env` の `SUPABASE_URL` / `SUPABASE_SECRET_KEY` / `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Vercel プロジェクトの作成（`web` と `admin` の2つ）と環境変数の設定
- AI チャットを使う場合：Vercel AI Gateway の `AI_GATEWAY_API_KEY`、コスト上限（`CHAT_DAILY_*` / `CHAT_MONTHLY_*`）
- 管理画面に Google ログインする場合：Google OAuth のクライアント ID／シークレット

## 7. コンテンツ登録

管理画面（admin）から登録します。

1. 「会期管理」で定例会・臨時会を登録（例：令和8年第4回定例会）
2. 議案を登録（議案名・提出日・提出者（市長／議員）・ステータス・市議会の議案ページ URL）
3. 議案の解説記事を作成（AI 生成または手書き）

ステータスの対応：準備中 → 提出済み → 委員会審査中 → 本会議審議中 → 可決／否決

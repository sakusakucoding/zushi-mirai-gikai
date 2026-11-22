# みらい議会＠逗子市

逗子市議会で今どんな議案が検討されているか、わかりやすく伝えるプラットフォームです。

> [!IMPORTANT]
> これは政党チームみらいが運営しているものではありません。
> 本リポジトリは [team-mirai/mirai-gikai](https://github.com/team-mirai/mirai-gikai)（AGPL-3.0）を fork し、逗子市議会向けに改変したものです。

## 本家からの主な変更点（2026年11月）

- サービス名を「みらい議会＠逗子市」に変更（`web/src/config/site.ts` に集約）
- ロゴ・OGP画像・PWAアイコン・トップ画像を独自のものに差し替え
- テーマカラーを緑系から青系（`#1f78b4`）に変更
- フッター等に免責文言・本家へのリンク・本リポジトリ（ソースコード公開先）へのリンクを追加
- 「国会」「法案」「衆議院／参議院」の表記を「逗子市議会」「議案」「委員会審査／本会議」に変更
  - DB スキーマは本家と同じまま。`bill_status_enum` の `in_originating_house` を「委員会審査中」、`in_receiving_house` を「本会議審議中」、`enacted` を「可決」として表示
  - `house_enum` は `HR`（逗子市議会）のみ使用、`HC` は未使用
  - 議案の種類 `cabinet` / `member` を「市長提出」／「議員提出」として表示
  - 「国会会期（diet_sessions）」は「会期（定例会・臨時会）」として使用（URL は `/kokkai/...` のまま）
- AI チャットのシステムプロンプトを逗子市議会向けに変更
- 「チームみらいの賛否」を「運営者の賛否」に変更
- 運営者が決めるべき項目の一覧は [ZUSHI_SETUP.md](./ZUSHI_SETUP.md) を参照

---

以下は本家の README です。

## 開発者向け（本家 README）

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/team-mirai-volunteer/mirai-gikai)
[![codecov](https://codecov.io/gh/team-mirai/mirai-gikai/branch/develop/graph/badge.svg)](https://codecov.io/gh/team-mirai/mirai-gikai)

## セットアップ

```bash
# Supabaseの起動
npx supabase start

# 環境変数の設定（必要に応じて.envの内容を変更してください）
cp .env.example .env

# パッケージインストール
pnpm install

# SupabaseのDB初期化, 開発用シードデータのセットアップ
pnpm db:reset

# サーバー起動
pnpm dev
```

## マイグレーション

```bash
# マイグレーションファイル生成
npx supabase migration new マイグレーション名

# マイグレーション実行 & 型ファイル更新
pnpm db:migrate
```

## Adminユーザーの作成

1. Supabase Studio上で Authentication > Add User からユーザーを作成
2. Supabase Studio上で以下のSQLを実行

```sql
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"roles": ["admin"]}'::jsonb
WHERE email = '<1で作成したユーザーのemail>';
```

> [!NOTE]
> ローカル開発環境では、`pnpm seed`（`pnpm db:reset` からも実行されます）によって `email: admin@example.com, password: admin123456` のAdminユーザーが作成されます。
> このAdminユーザーは `SUPABASE_URL` が localhost を指している場合のみ作成され、ホスト環境（staging・preview ブランチ等）には作成されません。
> メールアドレス・パスワードを変えたい場合は `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` を設定してください。

## Fork して独自サービスを運営する場合

本リポジトリを fork して独自にサービスを運営する場合は、[Fork ガイドライン](./FORK_GUIDELINES.md) を確認してください。本家サービスとの混同防止のため、ロゴ・カラー・サービス名称などの変更が必要です。

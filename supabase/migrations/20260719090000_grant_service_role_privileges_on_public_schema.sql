-- Supabase CLI v2.106.0 以降でのローカル開発権限エラーへの対応 (#878)
--
-- CLI v2.106.0 の breaking change により `[api].auto_expose_new_tables` が
-- 未設定時 false となり、ローカルの start / db reset で public スキーマの
-- オブジェクトへの Data API 権限（anon / authenticated / service_role への
-- 自動 GRANT）が付与されなくなった。
-- そのため `pnpm db:reset` 後の `pnpm seed`（secret key = service_role）が
-- "permission denied for table tags" で失敗する。
--
-- 公式が案内する恒久対応は「アクセスすべきロールへ明示的に GRANT する」こと。
-- 本プロジェクトの public スキーマへのアクセスは全てサーバーサイド
-- （secret key = service_role）経由のため（AGENTS.md「RLSとアクセスパターン」）、
-- service_role のみに付与し、anon / authenticated / public からは明示的に
-- REVOKE して deny-by-default を権限レイヤーでも保証する。
-- （GRANT は他ロールの既存権限を削除しないため、旧仕様で自動付与された
--   環境に残る anon / authenticated への権限はここで明示的に取り除く）

-- 【みらい議会＠逗子市での変更】
-- 本家は `revoke ... on all tables in schema public` と `alter default privileges` で
-- public スキーマ全体を deny-by-default にしていたが、逗子版は他のアプリ（kanko / zukan 等）と
-- 同じ Supabase プロジェクトを共有するため、それをすると他アプリの anon アクセスが壊れる。
-- そこで、みらい議会が作ったテーブル・関数だけを名前で指定して同じ権限設定をする。
-- 以降のマイグレーションで増えたオブジェクトは 20261122100200_zushi_scope_gikai_privileges.sql で
-- まとめて同じ設定をかけ直す。

do $$
declare
  gikai_tables text[] := array[
    'api_rate_limits',
    'bill_article_reports',
    'bill_contents',
    'bill_status_changes',
    'bill_supplementary_resolutions',
    'bill_videos',
    'bills',
    'bills_tags',
    'chat_usage_events',
    'chats',
    'diet_sessions',
    'expert_registrations',
    'gikai_contact_messages',
    'interview_configs',
    'interview_messages',
    'interview_opinion',
    'interview_questions',
    'interview_rating_feedbacks',
    'interview_report',
    'interview_sessions',
    'mirai_stances',
    'preview_tokens',
    'report_reactions',
    'tags',
    'topic',
    'topic_analysis_classifications',
    'topic_analysis_topics',
    'topic_analysis_version',
    'topic_analysis_versions',
    'topic_opinion'
  ];
  gikai_functions text[] := array[
    'bulk_publish_reports',
    'count_bulk_publish_targets',
    'count_public_reports_by_bill_ids',
    'count_public_reports_by_stance',
    'count_reactions_by_report_ids',
    'count_sessions_by_config_ids',
    'extract_assistant_question_id',
    'find_open_data_interview_reports',
    'find_public_reports_by_bill_id_ordered_by_reactions',
    'find_sessions_ordered_by_helpful_count',
    'find_sessions_ordered_by_message_count',
    'find_sessions_ordered_by_moderation_score',
    'find_sessions_ordered_by_total_content_richness',
    'find_sessions_ordered_by_total_score',
    'get_admin_users',
    'get_chat_usage_metrics',
    'get_interview_message_counts',
    'get_interview_metrics_by_bill',
    'get_interview_statistics',
    'get_question_answer_counts',
    'increment_api_rate_limit',
    'is_admin',
    'mark_opinions_extracted',
    'publish_topic_analysis_version',
    'record_bill_status_change',
    'replace_bill_videos',
    'set_active_diet_session',
    'set_bills_first_published_at',
    'set_interview_configs_published_at',
    'set_mirai_stances_published_at',
    'sum_chat_usage_cost',
    'sync_bills_published_submitted',
    'unpublish_reports_by_config_id',
    'update_updated_at_column'
  ];
  t text;
  obj record;
begin
  -- テーブル
  foreach t in array gikai_tables loop
    if to_regclass(format('public.%I', t)) is not null then
      execute format('revoke all on table public.%I from public, anon, authenticated', t);
      execute format('grant all on table public.%I to service_role', t);
    end if;
  end loop;

  -- 上記テーブルが所有するシーケンス
  for obj in
    select s.oid::regclass as seq
    from pg_class s
    join pg_depend d on d.objid = s.oid and d.deptype in ('a', 'i')
    join pg_class tb on tb.oid = d.refobjid
    where s.relkind = 'S'
      and tb.relnamespace = 'public'::regnamespace
      and tb.relname = any (gikai_tables)
  loop
    execute format('revoke all on sequence %s from public, anon, authenticated', obj.seq);
    execute format('grant all on sequence %s to service_role', obj.seq);
  end loop;

  -- 関数（引数違いのオーバーロードも含めて全部）
  for obj in
    select p.oid::regprocedure as fn
    from pg_proc p
    where p.pronamespace = 'public'::regnamespace
      and p.proname = any (gikai_functions)
  loop
    execute format('revoke execute on function %s from public, anon, authenticated', obj.fn);
    execute format('grant execute on function %s to service_role', obj.fn);
  end loop;
end
$$;

grant usage on schema public to service_role;

-- 例外: is_admin() は storage.objects の RLS ポリシー評価（サムネイル
-- アップロード時に authenticated として実行）とクライアントからの RPC で
-- anon / authenticated からも実行されるため、EXECUTE を再付与する
do $$
begin
  if to_regprocedure('public.is_admin()') is not null then
    grant execute on function public.is_admin() to anon, authenticated;
  end if;
end
$$;

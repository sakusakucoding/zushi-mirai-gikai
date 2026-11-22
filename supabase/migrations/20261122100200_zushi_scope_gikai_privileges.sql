-- みらい議会＠逗子市: みらい議会のテーブル・関数だけを deny-by-default にする（最終状態の保証）
--
-- 20260719090000 の説明のとおり、他アプリと Supabase プロジェクトを共有するため、
-- public スキーマ全体ではなく、みらい議会のオブジェクトだけを名前で指定して
-- anon / authenticated / public の権限を外し、service_role にだけ付与する。
-- 本家から新しいテーブル・関数を取り込んだら、下の配列に名前を追加してこのファイルと同じ内容の
-- マイグレーションを追加すること。

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

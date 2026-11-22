-- みらい議会＠逗子市: サイト下部のお問い合わせフォームの送信内容を保存するテーブル
-- 他のアプリと同じ Supabase プロジェクトを使っても名前がぶつからないよう gikai_ を付ける
create table public.gikai_contact_messages (
  id uuid primary key default gen_random_uuid(),
  category text not null
    check (category in ('site', 'correction', 'bill', 'other')),
  name text check (name is null or char_length(name) <= 100),
  reply_to text check (reply_to is null or char_length(reply_to) <= 200),
  message text not null
    check (char_length(message) between 1 and 2000),
  page_path text check (page_path is null or char_length(page_path) <= 500),
  -- 連投対策用。生の IP は保存せず、ハッシュだけを持つ
  ip_hash text,
  status text not null default 'new'
    check (status in ('new', 'in_progress', 'done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_gikai_contact_messages_created_at
  on public.gikai_contact_messages (created_at desc);
create index idx_gikai_contact_messages_ip_hash_created_at
  on public.gikai_contact_messages (ip_hash, created_at desc);

create trigger update_gikai_contact_messages_updated_at
  before update on public.gikai_contact_messages
  for each row execute function update_updated_at_column();

-- 読み書きはサーバー側（service_role）からのみ。anon / authenticated 向けのポリシーは作らない
alter table public.gikai_contact_messages enable row level security;
grant all on public.gikai_contact_messages to service_role;

comment on table public.gikai_contact_messages is 'みらい議会＠逗子市 お問い合わせフォームの送信内容。category: site=サイトについて, correction=掲載内容の誤り, bill=議案について, other=その他';
comment on column public.gikai_contact_messages.reply_to is '返信を希望する場合の連絡先（任意）';
comment on column public.gikai_contact_messages.page_path is '送信時に開いていたページのパス';
comment on column public.gikai_contact_messages.ip_hash is '連投対策用の IP アドレスのハッシュ（生の IP は保存しない）';
comment on column public.gikai_contact_messages.status is '対応状況: new=未対応, in_progress=対応中, done=対応済み';

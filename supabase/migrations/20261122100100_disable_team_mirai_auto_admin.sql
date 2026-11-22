-- みらい議会＠逗子市: 本家の「team-mir.ai ドメインの Google ログインユーザーを自動で admin にする」仕組みを無効化する
-- （fork 版では本家メンバーに管理権限を与えないため）
drop trigger if exists on_auth_user_created_set_admin_role on auth.users;
drop function if exists public.handle_google_workspace_admin_role();
drop function if exists public.apply_admin_role_if_eligible(uuid);

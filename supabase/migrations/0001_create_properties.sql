-- 物件テーブルの作成
-- 物件名・家賃・エリア名・間取りと、登録したユーザーのIDを保存する
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  rent integer not null check (rent >= 0),
  area text not null,
  layout text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 自分の物件を素早く絞り込めるようにインデックスを付与
create index if not exists properties_user_id_idx on public.properties (user_id);

-- 更新時に updated_at を自動更新するトリガー
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
  before update on public.properties
  for each row
  execute function public.set_updated_at();

-- RLS(行レベルセキュリティ)を有効化
alter table public.properties enable row level security;

-- 自分が登録した物件のみ閲覧できる
drop policy if exists "Users can view own properties" on public.properties;
create policy "Users can view own properties"
  on public.properties
  for select
  using (auth.uid() = user_id);

-- 自分のユーザーIDでのみ新規登録できる
drop policy if exists "Users can insert own properties" on public.properties;
create policy "Users can insert own properties"
  on public.properties
  for insert
  with check (auth.uid() = user_id);

-- 自分が登録した物件のみ編集できる
drop policy if exists "Users can update own properties" on public.properties;
create policy "Users can update own properties"
  on public.properties
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 自分が登録した物件のみ削除できる
drop policy if exists "Users can delete own properties" on public.properties;
create policy "Users can delete own properties"
  on public.properties
  for delete
  using (auth.uid() = user_id);

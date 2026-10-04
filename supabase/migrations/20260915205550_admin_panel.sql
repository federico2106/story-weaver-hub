-- Panel de administración: profiles.is_admin, token_transactions, content_generations,
-- custom_characters (migrada desde localStorage) y policies de lectura para admins.
-- Todo el bloque es idempotente y corre en una sola transacción: si algo falla,
-- no queda nada a medio crear.

begin;

create extension if not exists pgcrypto;

-- =========================================================
-- 1. is_admin en profiles + función helper para RLS
-- =========================================================

alter table public.profiles
  add column if not exists is_admin boolean not null default false;

-- security definer: evita recursión de RLS cuando esta función se usa
-- DENTRO de una policy de la propia tabla profiles.
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select p.is_admin from public.profiles p where p.id = uid), false);
$$;

grant execute on function public.is_admin(uuid) to authenticated;

drop policy if exists "Admins leen todos los perfiles" on public.profiles;
create policy "Admins leen todos los perfiles"
  on public.profiles for select
  using (public.is_admin(auth.uid()));

-- Te marco como admin usando tu email real de auth.users (no un UUID a mano).
-- Si ya tenías fila en profiles, solo le prende is_admin; si no existía, la crea.
do $$
declare
  v_count integer;
begin
  insert into public.profiles (id, is_admin)
  select u.id, true
  from auth.users u
  where u.email = 'linarifederico@gmail.com'
  on conflict (id) do update set is_admin = true;

  get diagnostics v_count = row_count;

  if v_count = 0 then
    raise notice 'ATENCION: no se encontró ningún usuario con ese email en auth.users.';
  else
    raise notice 'OK: usuario marcado como admin (% fila afectada).', v_count;
  end if;
end $$;

-- =========================================================
-- 2. token_transactions: ledger de compras (hoy solo se llena
--    vía record_token_purchase, que es admin-only)
-- =========================================================

create table if not exists public.token_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null default 'purchase' check (type in ('purchase')),
  pack_id text,
  tokens_delta integer not null,
  amount_cents integer not null,
  currency text not null default 'USD',
  reason text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.token_transactions enable row level security;

drop policy if exists "Usuarios leen sus propias transacciones" on public.token_transactions;
create policy "Usuarios leen sus propias transacciones"
  on public.token_transactions for select
  using (auth.uid() = user_id);

drop policy if exists "Admins leen todas las transacciones" on public.token_transactions;
create policy "Admins leen todas las transacciones"
  on public.token_transactions for select
  using (public.is_admin(auth.uid()));

-- RPC admin-only: acredita tokens a la propia wallet del admin que la llama
-- y deja registro en token_transactions. Verifica is_admin ANTES de tocar nada.
create or replace function public.record_token_purchase(
  p_pack_id text,
  p_tokens integer,
  p_amount_cents integer,
  p_currency text default 'USD'
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin_id uuid := auth.uid();
  v_new_balance integer;
  v_updated integer;
begin
  if v_admin_id is null then
    return json_build_object('success', false, 'error', 'not_authenticated');
  end if;

  if not public.is_admin(v_admin_id) then
    return json_build_object('success', false, 'error', 'not_authorized');
  end if;

  if p_tokens is null or p_tokens <= 0 then
    return json_build_object('success', false, 'error', 'invalid_tokens');
  end if;

  update public.wallets
  set tokens = tokens + p_tokens
  where user_id = v_admin_id
  returning tokens into v_new_balance;

  get diagnostics v_updated = row_count;

  if v_updated = 0 then
    insert into public.wallets (user_id, tokens)
    values (v_admin_id, p_tokens)
    returning tokens into v_new_balance;
  end if;

  insert into public.token_transactions (
    user_id, type, pack_id, tokens_delta, amount_cents, currency, reason, created_by
  ) values (
    v_admin_id, 'purchase', p_pack_id, p_tokens, p_amount_cents, p_currency, 'compra_prueba_admin', v_admin_id
  );

  return json_build_object('success', true, 'balance', v_new_balance);
end;
$$;

grant execute on function public.record_token_purchase(text, integer, integer, text) to authenticated;

-- =========================================================
-- 3. content_generations: schema listo para cuando exista la
--    feature de fotos/videos generados (hoy no hay ninguna,
--    la tabla queda vacía por diseño)
-- =========================================================

create table if not exists public.content_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('image', 'video')),
  status text not null default 'completed',
  metadata jsonb,
  created_at timestamptz not null default now()
);

alter table public.content_generations enable row level security;

drop policy if exists "Usuarios leen sus propias generaciones" on public.content_generations;
create policy "Usuarios leen sus propias generaciones"
  on public.content_generations for select
  using (auth.uid() = user_id);

drop policy if exists "Usuarios crean sus propias generaciones" on public.content_generations;
create policy "Usuarios crean sus propias generaciones"
  on public.content_generations for insert
  with check (auth.uid() = user_id);

drop policy if exists "Admins leen todas las generaciones" on public.content_generations;
create policy "Admins leen todas las generaciones"
  on public.content_generations for select
  using (public.is_admin(auth.uid()));

-- =========================================================
-- 4. custom_characters: migra lo que hoy vive en localStorage
--    (custom_chars_${user.id}) a una tabla real
-- =========================================================

create table if not exists public.custom_characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null,
  name text not null,
  subtitle text,
  image text,
  description text,
  created_at timestamptz not null default now(),
  unique (user_id, slug)
);

alter table public.custom_characters enable row level security;

drop policy if exists "Usuarios leen sus propios personajes" on public.custom_characters;
create policy "Usuarios leen sus propios personajes"
  on public.custom_characters for select
  using (auth.uid() = user_id);

drop policy if exists "Usuarios crean sus propios personajes" on public.custom_characters;
create policy "Usuarios crean sus propios personajes"
  on public.custom_characters for insert
  with check (auth.uid() = user_id);

drop policy if exists "Usuarios borran sus propios personajes" on public.custom_characters;
create policy "Usuarios borran sus propios personajes"
  on public.custom_characters for delete
  using (auth.uid() = user_id);

drop policy if exists "Admins leen todos los personajes" on public.custom_characters;
create policy "Admins leen todos los personajes"
  on public.custom_characters for select
  using (public.is_admin(auth.uid()));

-- =========================================================
-- 5. Policies de lectura admin sobre tablas EXISTENTES
--    (wallets, game_progress). No toco su estado de RLS
--    actual (no lo puedo verificar desde acá) -- esto solo
--    SUMA una policy de lectura para admins, sin quitar nada
--    de lo que ya funciona hoy.
-- =========================================================

drop policy if exists "Admins leen todas las wallets" on public.wallets;
create policy "Admins leen todas las wallets"
  on public.wallets for select
  using (public.is_admin(auth.uid()));

drop policy if exists "Admins leen todo el progreso de juego" on public.game_progress;
create policy "Admins leen todo el progreso de juego"
  on public.game_progress for select
  using (public.is_admin(auth.uid()));

commit;

-- Refresca el cache de esquema de PostgREST para que las tablas/columnas/
-- funciones nuevas queden disponibles de inmediato vía API.
notify pgrst, 'reload schema';

-- Completa el schema real de token_transactions y custom_characters,
-- que ya existían de antes con columnas distintas a las que asumió
-- 20260915205550_admin_panel.sql (su "create table if not exists" fue
-- un no-op silencioso en ambos casos).
--
-- Confirmado por sondeo directo contra PostgREST (sin information_schema
-- disponible, solo anon key):
--   token_transactions ya tenía: id, user_id, amount, reason, created_at
--   custom_characters ya tenía:  id (uuid), user_id, name, subtitle,
--                                image_url, description, created_at
--                                (sin slug)

begin;

-- =========================================================
-- 1. token_transactions: agrega las columnas que faltaban,
--    sin tocar amount/reason (siguen siendo de spend_tokens).
-- =========================================================

alter table public.token_transactions
  add column if not exists type text,
  add column if not exists pack_id text,
  add column if not exists tokens_delta integer,
  add column if not exists amount_cents integer,
  add column if not exists currency text not null default 'USD',
  add column if not exists created_by uuid references auth.users(id);

alter table public.token_transactions drop constraint if exists token_transactions_type_check;
alter table public.token_transactions
  add constraint token_transactions_type_check check (type is null or type = 'purchase');

-- Reemplaza el RPC: ahora también rellena amount/reason (las columnas
-- viejas) en cada compra de prueba, por si tienen NOT NULL -- no lo pude
-- confirmar sin information_schema, así que se rellenan siempre por las
-- dudas. 'reason' queda en 'compra_prueba_admin' para diferenciarlo de
-- los reasons reales de gasto (mensaje_chat, desbloqueo_foto, juego_decision).
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
    user_id, type, pack_id, tokens_delta, amount_cents, currency,
    amount, reason, created_by
  ) values (
    v_admin_id, 'purchase', p_pack_id, p_tokens, p_amount_cents, p_currency,
    p_tokens, 'compra_prueba_admin', v_admin_id
  );

  return json_build_object('success', true, 'balance', v_new_balance);
end;
$$;

grant execute on function public.record_token_purchase(text, integer, integer, text) to authenticated;

-- =========================================================
-- 2. custom_characters: agrega slug, SIN backfill ni
--    constraints todavía -- eso depende de cuántas filas haya.
--    El aviso de abajo te dice cuántas hay; si son >0, avisame
--    antes de que yo arme el paso 2 (backfill o limpieza).
-- =========================================================

alter table public.custom_characters
  add column if not exists slug text;

do $$
declare
  v_count integer;
begin
  select count(*) into v_count from public.custom_characters;

  if v_count = 0 then
    raise notice 'OK: custom_characters está vacía (0 filas) -- no hace falta backfill, se puede poner slug NOT NULL + unique directamente en el próximo paso.';
  else
    raise notice 'ATENCION: custom_characters tiene % fila(s) existente(s). Todavía NO se hizo backfill de slug -- decime ese número y decidimos si son datos reales o de prueba antes de continuar.', v_count;
  end if;
end $$;

commit;

notify pgrst, 'reload schema';

-- Tabla de perfiles con balance de tokens por usuario
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  token_balance integer not null default 100 check (token_balance >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Usuarios leen su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuarios actualizan su propio perfil"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Usuarios crean su propio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Perfil automático al registrarse (100 tokens de bienvenida)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, token_balance)
  values (new.id, 100)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Envía mensaje y descuenta tokens de forma atómica
create or replace function public.send_chat_message(
  p_content text,
  p_character text,
  p_token_cost integer default 1
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_balance integer;
  v_message_id uuid;
begin
  if v_user_id is null then
    return json_build_object('success', false, 'error', 'not_authenticated');
  end if;

  if p_content is null or trim(p_content) = '' then
    return json_build_object('success', false, 'error', 'empty_message');
  end if;

  insert into public.profiles (id, token_balance)
  values (v_user_id, 100)
  on conflict (id) do nothing;

  select token_balance into v_balance
  from public.profiles
  where id = v_user_id
  for update;

  if v_balance < p_token_cost then
    return json_build_object(
      'success', false,
      'error', 'insufficient_tokens',
      'balance', v_balance
    );
  end if;

  update public.profiles
  set
    token_balance = token_balance - p_token_cost,
    updated_at = now()
  where id = v_user_id;

  insert into public.messages (content, role, user_id, character)
  values (trim(p_content), 'user', v_user_id, lower(p_character))
  returning id into v_message_id;

  return json_build_object(
    'success', true,
    'message_id', v_message_id,
    'balance', v_balance - p_token_cost
  );
end;
$$;

grant execute on function public.send_chat_message(text, text, integer) to authenticated;

-- Paso 2 de la migración de custom_characters: confirmado que la tabla
-- tiene 0 filas (ver raise notice de 20260915231221_fix_preexisting_tables.sql),
-- así que no hace falta backfill -- se pueden aplicar las constraints directo.

begin;

alter table public.custom_characters
  alter column slug set not null;

alter table public.custom_characters drop constraint if exists custom_characters_user_id_slug_key;
alter table public.custom_characters
  add constraint custom_characters_user_id_slug_key unique (user_id, slug);

commit;

notify pgrst, 'reload schema';

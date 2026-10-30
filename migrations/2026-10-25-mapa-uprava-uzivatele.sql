-- Mapa informatických konceptů — úprava existujícího uživatele bez změny hesla.
-- km_update_editor mění jméno a roli; heslo jen když je zadané (jinak zůstává).
-- Spustit v Supabase SQL editoru po 2026-10-25-mapa-role-ctenar.sql. Bezpečné opakovat.

create or replace function public.km_update_editor(p_admin_login text, p_admin_secret text, p_email text, p_name text, p_role text, p_password text default null)
returns void language plpgsql security definer set search_path = public, extensions as $$
declare v_role text := coalesce(nullif(p_role, ''), 'editor');
begin
  if not km_is_admin(p_admin_login, p_admin_secret) then raise exception 'Jen admin může upravovat uživatele.'; end if;
  if v_role not in ('admin', 'editor', 'viewer') then raise exception 'Neznámá role: %', v_role; end if;
  if p_password is not null and length(p_password) < 6 then raise exception 'Heslo musí mít aspoň 6 znaků.'; end if;
  if not exists (select 1 from km_editors where email = lower(p_email)) then raise exception 'Uživatel % neexistuje.', p_email; end if;
  update km_editors
     set name = nullif(p_name, ''),
         role = v_role,
         pass_hash = case when p_password is null then pass_hash else crypt(p_password, gen_salt('bf')) end,
         active = true
   where email = lower(p_email);
end $$;

grant execute on function public.km_update_editor(text, text, text, text, text, text) to anon, authenticated;

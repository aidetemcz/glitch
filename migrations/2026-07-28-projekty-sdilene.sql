-- Sdílené editování projektu: spolupracovník smí číst a upravovat projekt,
-- do kterého je přizvaný (project_collaborators). Spusť v Supabase → SQL Editoru.
-- Idempotentní. Vyžaduje už existující tabulky projects a project_collaborators.

-- čtení projektu, kde jsem spolupracovník
drop policy if exists "Projects collaborator read" on projects;
create policy "Projects collaborator read" on projects
  for select using (
    exists (
      select 1 from project_collaborators pc
      where pc.owner_id = projects.user_id
        and pc.glitch_id = projects.glitch_id
        and pc.collaborator_id = auth.uid()
    )
  );

-- úpravy projektu spolupracovníkem (společné editování plánu/zdrojů)
drop policy if exists "Projects collaborator update" on projects;
create policy "Projects collaborator update" on projects
  for update using (
    exists (
      select 1 from project_collaborators pc
      where pc.owner_id = projects.user_id
        and pc.glitch_id = projects.glitch_id
        and pc.collaborator_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from project_collaborators pc
      where pc.owner_id = projects.user_id
        and pc.glitch_id = projects.glitch_id
        and pc.collaborator_id = auth.uid()
    )
  );

-- Aby spolupracovník viděl, s kým dalším projekt sdílí (celý seznam, ne jen sebe):
-- kdo je na projektu, na kterém jsem i já, smí vidět ostatní členy.
drop policy if exists "PC members read" on project_collaborators;
create policy "PC members read" on project_collaborators
  for select using (
    exists (
      select 1 from project_collaborators mine
      where mine.owner_id = project_collaborators.owner_id
        and mine.glitch_id = project_collaborators.glitch_id
        and mine.collaborator_id = auth.uid()
    )
  );

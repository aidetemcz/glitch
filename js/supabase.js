// ── SUPABASE CLIENT ──────────────────────────

const SUPABASE_URL = 'https://pfpqwxqayuvihnqnuyvv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_xUSlFUWpapqMCW--b6LDsQ_P0HCKsg6';

if (!window.supabase) {
  console.warn('Supabase CDN not loaded');
}

const sb = window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

let sbCurrentUser = null;

// ── INIT ─────────────────────────────────────

async function sbInit() {
  if (!sb) return null;
  const { data: { user } } = await sb.auth.getUser();
  sbCurrentUser = user;
  if (user) await sbMergeToLocal(user.id);
  return user;
}

// ── AUTH ─────────────────────────────────────

async function sbSignUp(email, password) {
  const { data, error } = await sb.auth.signUp({ email, password });
  if (error) throw error;
  sbCurrentUser = data.user;
  if (sbCurrentUser && data.session) {
    await sbCreateProfile(sbCurrentUser.id);
    await sbSyncLocalToSupabase(sbCurrentUser.id);
    await sbMergeToLocal(sbCurrentUser.id);
  }
  return data;
}

async function sbSignIn(email, password) {
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  sbCurrentUser = data.user;
  if (sbCurrentUser) {
    await sbCreateProfile(sbCurrentUser.id);
    await sbSyncLocalToSupabase(sbCurrentUser.id);
    await sbMergeToLocal(sbCurrentUser.id);
  }
  return data;
}

async function sbSignInWithGoogle() {
  if (!sb) throw new Error('Supabase není dostupné');
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + window.location.pathname },
  });
  if (error) throw error;
  // Browser will redirect to Google — no further code runs here
}

async function sbHandleOAuthCallback() {
  if (!sb) return null;
  // Check URL for OAuth tokens after redirect back from Google
  const hash = window.location.hash || '';
  const search = window.location.search || '';
  if (!hash.includes('access_token') && !search.includes('code=') && !hash.includes('error')) return null;

  // If error in URL, clean up and bail
  if (hash.includes('error') || search.includes('error')) {
    history.replaceState(null, '', window.location.pathname);
    return null;
  }

  const { data: { session }, error } = await sb.auth.getSession();
  if (error || !session?.user) return null;

  sbCurrentUser = session.user;
  await sbCreateProfile(sbCurrentUser.id);
  await sbSyncLocalToSupabase(sbCurrentUser.id);
  await sbMergeToLocal(sbCurrentUser.id);

  // Clean URL
  history.replaceState(null, '', window.location.pathname);
  return sbCurrentUser;
}

async function sbSignOut() {
  await sb.auth.signOut();
  sbCurrentUser = null;
}

// ── PROFILE ──────────────────────────────────

async function sbCreateProfile(userId) {
  const local = JSON.parse(localStorage.getItem('tg_user') || '{}');
  await sb.from('profiles').upsert({
    id: userId,
    nickname: local.nickname || null,
    full_name: local.fullName || null,
    gender: local.gender || null,
    learning_style: local.learningStyle || null,
    vek: local.age || null,
  }, { onConflict: 'id', ignoreDuplicates: true });
}

async function sbSaveProfile(fields) {
  if (!sb || !sbCurrentUser) return;
  await sb.from('profiles').upsert({ id: sbCurrentUser.id, ...fields });
}

// ── NASTAVENÍ (profiles.settings jsonb) ──────
async function sbSaveSettings(settings) {
  if (!sb || !sbCurrentUser) return { ok: false };
  try {
    const { error } = await sb.from('profiles').upsert(
      { id: sbCurrentUser.id, settings }, { onConflict: 'id' });
    return { ok: !error };
  } catch (_) { return { ok: false }; }
}

async function sbLoadSettings() {
  if (!sb || !sbCurrentUser) return null;
  try {
    const { data, error } = await sb.from('profiles')
      .select('settings').eq('id', sbCurrentUser.id).single();
    if (error) return null;
    return (data && data.settings) || null;
  } catch (_) { return null; }
}

// ── PROGRESS ─────────────────────────────────

// Úroveň zvládnutí konceptu (žákova knowledge map). Ukládá se nejvyšší dosažená.
async function sbSaveMastery(conceptId, uroven) {
  if (!sb || !sbCurrentUser || !conceptId || !uroven) return;
  await sb.from('concept_mastery').upsert({
    user_id: sbCurrentUser.id,
    concept_id: conceptId,
    uroven: uroven,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id,concept_id' });
}

async function sbSaveGlitchDone(glitchId, correct) {
  if (!sb || !sbCurrentUser) return;
  await sb.from('progress').upsert({
    user_id: sbCurrentUser.id,
    glitch_id: glitchId,
    completed: true,
    quiz_answer: correct ? 'correct' : 'incorrect',
    completed_at: new Date().toISOString()
  }, { onConflict: 'user_id,glitch_id' });
}

async function sbResetProgress() {
  if (!sb || !sbCurrentUser) return;
  await sb.from('progress').delete().eq('user_id', sbCurrentUser.id);
}

// ── PROJEKTY ─────────────────────────────────
// Založí / aktualizuje projekt (jeden na uživatele+glitch). Tiše degraduje.
async function sbCreateProject(p) {
  if (!sb || !sbCurrentUser || !p || !p.glitch_id) return;
  try {
    await sb.from('projects').upsert({
      user_id: sbCurrentUser.id,
      glitch_id: p.glitch_id,
      quest_topic: p.quest_topic || null,
      title: p.title || null,
      brief: p.brief || null,
      shared: !!p.shared,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,glitch_id' });
  } catch (_) {}
}

async function sbRemoveProject(glitchId) {
  if (!sb || !sbCurrentUser || !glitchId) return;
  try { await sb.from('projects').delete().eq('user_id', sbCurrentUser.id).eq('glitch_id', glitchId); } catch (_) {}
}

async function sbListProjects() {
  if (!sb || !sbCurrentUser) return [];
  try {
    const { data } = await sb.from('projects').select('*').eq('user_id', sbCurrentUser.id).order('created_at', { ascending: false });
    return data || [];
  } catch (_) { return []; }
}

// ── MENU GLITCHE: uložené + „nezajímá" ───────
async function sbSaveSaved(info) {
  if (!sb || !sbCurrentUser || !info || !info.id) return;
  try {
    await sb.from('saved_glitches').upsert({
      user_id: sbCurrentUser.id, glitch_id: info.id,
      topic: info.topic || null, title: info.title || null, glitch_type: info.type || null
    }, { onConflict: 'user_id,glitch_id' });
  } catch (_) {}
}
async function sbUnsaveSaved(id) {
  if (!sb || !sbCurrentUser || !id) return;
  try { await sb.from('saved_glitches').delete().eq('user_id', sbCurrentUser.id).eq('glitch_id', id); } catch (_) {}
}
async function sbMarkNotInterested(topic) {
  if (!sb || !sbCurrentUser || !topic) return;
  try {
    await sb.from('topic_signals').upsert({
      user_id: sbCurrentUser.id, topic: topic, signal: 'not_interested'
    }, { onConflict: 'user_id,topic' });
  } catch (_) {}
}

// ── STATISTIKY: události Glitchů ─────────────
// Zapíše událost (view | interact | complete | save | project) do glitch_events.
// Jen přihlášený uživatel (RLS: insert jen vlastní user_id). Tiše degraduje.
async function sbLogEvent(eventType, glitchId, meta) {
  if (!sb || !sbCurrentUser || !eventType || !glitchId) return;
  try {
    await sb.from('glitch_events').insert({
      user_id: sbCurrentUser.id,
      glitch_id: glitchId,
      event_type: eventType,
      meta: meta || {}
    });
  } catch (_) {}
}

// ── NAHLÁŠENÍ NEVHODNÉHO OBSAHU ──────────────
// Zapíše nahlášení Glitche do tabulky content_reports. Nahlašovat může jen
// přihlášený uživatel (RLS: insert jen na vlastní user_id). Vrací {ok, reason}.
async function sbReportGlitch(info, reason) {
  if (!sb || !sbCurrentUser) return { ok: false, reason: 'auth' };
  if (!info || !info.id) return { ok: false, reason: 'input' };
  try {
    const { error } = await sb.from('content_reports').insert({
      user_id: sbCurrentUser.id,
      glitch_id: info.id,
      glitch_type: info.type || null,
      topic: info.topic || null,
      reason: (reason || '').trim().slice(0, 2000) || null
    });
    return { ok: !error, reason: error ? 'db' : null };
  } catch (_) { return { ok: false, reason: 'db' }; }
}

// ── MOOD ─────────────────────────────────────
// Uloží náladu (focus/energy 0–100). Vždy lokálně; při přihlášení i do DB.
// Primárně do dedikované tabulky `mood_entries`, sekundárně do `activity_log`.
async function sbSaveMood(focus, energy) {
  const entry = { focus, energy, ts: Date.now() };
  try {
    localStorage.setItem('tg_mood_last', JSON.stringify(entry));
    const hist = JSON.parse(localStorage.getItem('tg_mood_history') || '[]');
    hist.push(entry);
    localStorage.setItem('tg_mood_history', JSON.stringify(hist.slice(-200)));
  } catch (_) {}

  if (!sb || !sbCurrentUser) return { ok: false, reason: 'auth' };

  let dbOk = false;
  // 1) dedikovaná tabulka mood_entries (pokud existuje)
  try {
    const { error } = await sb.from('mood_entries').insert({
      user_id: sbCurrentUser.id, focus, energy
    });
    if (!error) dbOk = true;
  } catch (_) {}
  // 2) obecný activity_log (funguje, pokud tabulka existuje; jinak tiše degraduje)
  try {
    await sbTrackEvent('mood', { focus, energy });
    if (_activityLogAvailable) dbOk = true;
  } catch (_) {}

  return { ok: dbOk, reason: dbOk ? null : 'db' };
}

// ── SYNC ─────────────────────────────────────

async function sbSyncLocalToSupabase(userId) {
  const local = JSON.parse(localStorage.getItem('tg_progress') || '{}');
  const entries = Object.entries(local);
  if (!entries.length) return;
  const rows = entries.map(([glitchId, d]) => ({
    user_id: userId,
    glitch_id: glitchId,
    completed: d.completed,
    quiz_answer: d.correct ? 'correct' : 'incorrect',
    completed_at: d.ts ? new Date(d.ts).toISOString() : new Date().toISOString()
  }));
  await sb.from('progress').upsert(rows, { onConflict: 'user_id,glitch_id' });
}

// ── ACTIVITY TRACKING ───────────────────────

let _activityLogAvailable = null;
async function sbTrackEvent(eventType, data) {
  if (!sb || !sbCurrentUser) return;
  if (_activityLogAvailable === false) return;
  try {
    const { error } = await sb.from('activity_log').insert({
      user_id: sbCurrentUser.id,
      event_type: eventType,
      event_data: data
    });
    if (error) _activityLogAvailable = false;
    else _activityLogAvailable = true;
  } catch(e) { _activityLogAvailable = false; }
}

// ── SYNC ─────────────────────────────────────

async function sbMergeToLocal(userId) {
  // Progress: Supabase → localStorage (add missing entries)
  const { data: rows } = await sb.from('progress').select('*').eq('user_id', userId);
  if (rows && rows.length) {
    const local = JSON.parse(localStorage.getItem('tg_progress') || '{}');
    rows.forEach(row => {
      if (!local[row.glitch_id]) {
        local[row.glitch_id] = {
          completed: row.completed,
          correct: row.quiz_answer === 'correct',
          ts: row.completed_at ? new Date(row.completed_at).getTime() : Date.now()
        };
      }
    });
    localStorage.setItem('tg_progress', JSON.stringify(local));
  }

  // Profile: Supabase → localStorage
  const { data: profile } = await sb.from('profiles').select('*').eq('id', userId).single();
  if (profile) {
    const user = JSON.parse(localStorage.getItem('tg_user') || '{}');
    localStorage.setItem('tg_user', JSON.stringify({
      ...user,
      nickname: profile.nickname || user.nickname,
      fullName: profile.full_name || user.fullName,
      gender: profile.gender || user.gender,
      learningStyle: profile.learning_style || user.learningStyle,
      age: profile.vek || user.age,
    }));
  }
}

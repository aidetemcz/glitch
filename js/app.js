/* ============================================
   Tiny Glitch — SPA
   ============================================ */

// ── STATE ────────────────────────────────────

const State = {
  get user() { return JSON.parse(localStorage.getItem('tg_user') || 'null'); },
  setUser(u) { localStorage.setItem('tg_user', JSON.stringify(u)); },

  get progress() { return JSON.parse(localStorage.getItem('tg_progress') || '{}'); },
  setGlitchDone(id, correct) {
    const p = this.progress;
    p[id] = { completed: true, correct, ts: Date.now() };
    localStorage.setItem('tg_progress', JSON.stringify(p));
    sbSaveGlitchDone(id, correct);
    trackEvent('glitch_complete', { glitchId: id, correct });
    setTimeout(() => checkMissionComplete(id), 500);
  },
  isDone(id) { return !!(this.progress[id]?.completed); },
};

// ── ACTIVITY TRACKING ───────────────────────

function trackEvent(eventType, data) {
  const events = JSON.parse(localStorage.getItem('tg_events') || '[]');
  events.push({ type: eventType, data: data || {}, ts: Date.now() });
  localStorage.setItem('tg_events', JSON.stringify(events));
  sbTrackEvent(eventType, data || {});
}

// ── BADGE / QUEST CELEBRATION ───────────────

function checkMissionComplete(glitchId) {
  const mission = MISSIONS.find(m => m.glitches.includes(glitchId));
  if (!mission) return;
  const allDone = mission.glitches.every(gId => State.isDone(gId));
  if (!allDone) return;
  // Check if badge already earned
  const badges = JSON.parse(localStorage.getItem('tg_badges') || '[]');
  if (badges.some(b => b.missionId === mission.id)) return;
  badges.push({ missionId: mission.id, title: mission.title, ts: Date.now() });
  localStorage.setItem('tg_badges', JSON.stringify(badges));
  trackEvent('mission_complete', { missionId: mission.id });
  showBadgeCelebration(mission.title);
}

function showBadgeCelebration(missionTitle) {
  const el = document.createElement('div');
  el.className = 'badge-overlay';
  el.innerHTML = `
    <div class="badge-card">
      <div class="badge-emoji">\uD83C\uDF96\uFE0F</div>
      <div class="badge-title">Quest dokoncen!</div>
      <div class="badge-sub">${missionTitle}</div>
    </div>`;
  el.addEventListener('click', () => el.remove());
  document.body.appendChild(el);
  setTimeout(() => { if (el.parentNode) el.remove(); }, 3000);
}

// ── INIT ─────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  let appReady = false;

  const splashBtn = document.getElementById('splash-enter');
  splashBtn.addEventListener('click', () => {
    enterApp();
    if (!appReady) {
      // Show loading state inside feed while data loads
      document.getElementById('feed-container').innerHTML =
        '<p style="color:var(--text-muted);text-align:center;padding:60px 0">Načítám...</p>';
    }
  });

  try {
    // Handle OAuth redirect (user returning from Google login)
    const oauthUser = await sbHandleOAuthCallback();
    if (!oauthUser) await sbInit();

    await loadGlitches();
    renderFeed();
    renderMap();
    renderMissions();

    // If OAuth login just happened, skip splash and go straight to app
    if (oauthUser) enterApp();
  } catch (e) {
    console.error('Init error:', e);
  }

  appReady = true;

  updateProfileBtn();
  bindNav();
  bindProfileBtn();
  document.getElementById('logo-btn').addEventListener('click', () => {
    const feedBtn = document.querySelector('.nav-btn[data-view="feed"]');
    if (feedBtn) feedBtn.click();
  });
  bindAccountPage();

  // Deep link handling
  handleDeepLink();
  window.addEventListener('hashchange', handleDeepLink);

  document.addEventListener('wheel', (e) => {
    const activeView = document.querySelector('.view.active');
    if (!activeView) return;
    let el = e.target;
    while (el) {
      if (el === activeView) return; // view scrolls natively
      if (el.scrollHeight > el.clientHeight + 1 &&
          ['auto', 'scroll'].includes(getComputedStyle(el).overflowY)) return;
      el = el.parentElement;
    }
    // Find the actual scrollable element inside the active view
    const scrollTarget = activeView.querySelector('.missions-body') || activeView;
    scrollTarget.scrollBy({ top: e.deltaY, behavior: 'auto' });
  }, { passive: true });
});

function enterApp() {
  document.getElementById('splash').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
}

// ── NAVIGATION ───────────────────────────────

function updateSpotlight(index) {
  const spotlight = document.querySelector('.nav-spotlight');
  if (spotlight) spotlight.style.transform = `translateX(${index * 100}%)`;
}

function bindNav() {
  const btns = document.querySelectorAll('.nav-btn');
  btns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      const overlay = document.getElementById('detail-overlay');
      if (overlay && !overlay.classList.contains('hidden')) {
        closeDetail();
      }
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateSpotlight(i);
      showView(btn.dataset.view);
    });
  });
  updateSpotlight(1);
}

function showView(name) {
  document.querySelectorAll('.view').forEach(v => {
    v.classList.remove('active');
    v.classList.add('hidden');
  });
  const target = document.getElementById('view-' + name);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('active');
    if (name === 'feed') triggerFeedAnimations();
    if (name === 'missions') renderMissions();
    if (name === 'komunita') { trackEvent('community_view', {}); renderKomunita(); }
  }
}

// ── PROFILE ──────────────────────────────────

function getUserNickname() {
  const u = State.user;
  return u ? (u.nickname || u.name || '') : '';
}

function updateProfileBtn() {
  const btn = document.getElementById('profile-btn');
  const bell = document.getElementById('bell-icon');
  const user = State.user;
  const loggedIn = user || sbCurrentUser;
  if (loggedIn) {
    btn.title = getUserNickname() || (sbCurrentUser && sbCurrentUser.user_metadata && sbCurrentUser.user_metadata.full_name) || '';
    if (bell) bell.classList.add('hidden');
  } else {
    btn.title = 'Přihlásit se';
    if (bell) bell.classList.remove('hidden');
  }
}

function bindProfileBtn() {
  document.getElementById('profile-btn').addEventListener('click', openAccountPage);
}

// ── ACCOUNT PAGE ──────────────────────────────

function openAccountPage() {
  const user = State.user || {};
  const overlay = document.getElementById('account-overlay');

  // Populate nickname
  setAccountDisplayField('account-nickname-val', getUserNickname());

  // Populate fullName and email
  setAccountDisplayField('account-fullname-val', user.fullName);
  setAccountDisplayField('account-email-val', user.email);

  // Populate radio groups
  setAccountRadio('gender', user.gender);
  setAccountRadio('learning', user.learningStyle);

  // Auth section
  if (sbCurrentUser) {
    document.getElementById('account-auth-logged-out').style.display = 'none';
    document.getElementById('account-auth-logged-in').style.display = '';
    const meta = sbCurrentUser.user_metadata || {};
    const displayName = meta.full_name || meta.name || sbCurrentUser.email;
    document.getElementById('account-auth-email').textContent = displayName;
    // Pre-fill profile fields from Google metadata if empty
    if (!user.nickname && (meta.full_name || meta.name)) {
      setAccountDisplayField('account-nickname-val', meta.full_name || meta.name);
    }
    if (!user.fullName && meta.full_name) {
      setAccountDisplayField('account-fullname-val', meta.full_name);
    }
    if (!user.email && sbCurrentUser.email) {
      setAccountDisplayField('account-email-val', sbCurrentUser.email);
    }
  } else {
    document.getElementById('account-auth-logged-out').style.display = '';
    document.getElementById('account-auth-logged-in').style.display = 'none';
    document.getElementById('auth-email-input').value = '';
    document.getElementById('auth-password-input').value = '';
    document.getElementById('auth-error').style.display = 'none';
  }

  // Show logout only when logged in (local or Supabase)
  document.getElementById('account-logout').style.display = (State.user || sbCurrentUser) ? '' : 'none';

  // Render badges
  const badgesEl = document.getElementById('account-badges');
  const badges = JSON.parse(localStorage.getItem('tg_badges') || '[]');
  if (badges.length) {
    badgesEl.innerHTML = '<div class="account-label">Moje odznaky</div>' +
      badges.map(b => '<span class="badge-item">\uD83C\uDF96\uFE0F ' + b.title + '</span>').join('');
    badgesEl.style.display = '';
  } else {
    badgesEl.style.display = 'none';
  }

  overlay.classList.remove('hidden');
  overlay.scrollTop = 0;
}

function setAccountDisplayField(elId, value) {
  const el = document.getElementById(elId);
  if (value) {
    el.textContent = value;
    el.classList.remove('empty');
  } else {
    el.textContent = el.dataset.placeholder || '—';
    el.classList.add('empty');
  }
}

function setAccountRadio(group, value) {
  document.querySelectorAll('.account-radio-opt[data-group="' + group + '"]').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.val === value);
  });
}

function saveAccountField(field, value) {
  const user = State.user || {};
  user[field] = value;
  State.setUser(user);
  const profileMap = { nickname: 'nickname', fullName: 'full_name', gender: 'gender', learningStyle: 'learning_style' };
  if (profileMap[field]) sbSaveProfile({ [profileMap[field]]: value });
}

function closeAccountPage() {
  document.getElementById('account-overlay').classList.add('hidden');
}

function bindAccountPage() {
  document.getElementById('account-close').addEventListener('click', closeAccountPage);

  // Inline editable fields
  [['account-nickname-val',  'account-nickname-input', 'nickname'],
   ['account-fullname-val',  'account-fullname-input', 'fullName'],
   ['account-email-val',     'account-email-input',    'email']].forEach(([valId, inputId, field]) => {
    const valEl = document.getElementById(valId);
    const inputEl = document.getElementById(inputId);
    function startEdit() {
      inputEl.value = State.user?.[field] || '';
      valEl.classList.add('hidden');
      inputEl.classList.remove('hidden');
      inputEl.focus();
    }
    function saveEdit() {
      const val = inputEl.value.trim();
      if (field === 'nickname' && val && !State.user) State.setUser({});
      if (State.user || val) saveAccountField(field, val);
      if (field === 'nickname') {
        setAccountDisplayField(valId, val);
        document.getElementById('account-logout').style.display = val ? '' : 'none';
        updateProfileBtn();
      } else {
        setAccountDisplayField(valId, val);
      }
      valEl.classList.remove('hidden');
      inputEl.classList.add('hidden');
    }
    valEl.addEventListener('click', startEdit);
    inputEl.addEventListener('blur', saveEdit);
    inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); saveEdit(); } });
  });

  // Radio buttons
  document.querySelectorAll('.account-radio-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      const val = btn.dataset.val;
      document.querySelectorAll('.account-radio-opt[data-group="' + group + '"]').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      saveAccountField(group === 'gender' ? 'gender' : 'learningStyle', val);
    });
  });

  // Reset progress
  const resetBtn = document.getElementById('account-reset');
  const resetConfirm = document.getElementById('account-reset-confirm');
  resetBtn.addEventListener('click', () => {
    resetBtn.style.display = 'none';
    resetConfirm.style.display = 'block';
  });
  document.getElementById('account-reset-yes').addEventListener('click', async () => {
    localStorage.removeItem('tg_progress');
    await sbResetProgress();
    renderFeed();
    renderMapContent(document.getElementById('map-container'), '');
    resetConfirm.style.display = 'none';
    resetBtn.style.display = '';
    closeAccountPage();
  });
  document.getElementById('account-reset-no').addEventListener('click', () => {
    resetConfirm.style.display = 'none';
    resetBtn.style.display = '';
  });

  // Shared: after successful login, save name, close modal, refresh UI
  function afterLogin() {
    // Save name from Supabase user metadata to local state
    if (sbCurrentUser) {
      const meta = sbCurrentUser.user_metadata || {};
      const user = State.user || {};
      if (!user.nickname && (meta.full_name || meta.name)) {
        user.nickname = meta.full_name || meta.name;
      }
      if (!user.email && sbCurrentUser.email) {
        user.email = sbCurrentUser.email;
      }
      if (!user.fullName && meta.full_name) {
        user.fullName = meta.full_name;
      }
      State.setUser(user);
    }
    updateProfileBtn();
    closeAccountPage();
    renderFeed();
    renderMissions();
  }

  // Auth: login / register
  async function handleAuth(isRegister) {
    const email = document.getElementById('auth-email-input').value.trim();
    const password = document.getElementById('auth-password-input').value;
    const errEl = document.getElementById('auth-error');
    errEl.style.display = 'none';
    if (!email || !password) { errEl.textContent = 'Vyplň e-mail a heslo.'; errEl.style.display = ''; return; }
    try {
      if (isRegister) {
        await sbSignUp(email, password);
      } else {
        await sbSignIn(email, password);
      }
      afterLogin();
    } catch (e) {
      errEl.textContent = e.message || 'Chyba přihlášení.';
      errEl.style.display = '';
    }
  }
  document.getElementById('auth-login-btn').addEventListener('click', () => handleAuth(false));
  document.getElementById('auth-register-btn').addEventListener('click', () => handleAuth(true));

  // Google OAuth (redirect)
  document.getElementById('auth-google-btn').addEventListener('click', async () => {
    const errEl = document.getElementById('auth-error');
    errEl.style.display = 'none';
    try {
      await sbSignInWithGoogle();
      // Browser redirects to Google — nothing further happens here
    } catch (e) {
      errEl.textContent = e.message || 'Google přihlášení selhalo.';
      errEl.style.display = '';
    }
  });

  // Logout
  document.getElementById('account-logout').addEventListener('click', async () => {
    await sbSignOut();
    localStorage.removeItem('tg_user');
    updateProfileBtn();
    closeAccountPage();
  });
}


// ── FEED ─────────────────────────────────────

function renderFeed() {
  const container = document.getElementById('feed-container');
  container.innerHTML = '';
  GLITCHES.filter(g => !State.isDone(g.id))
    .forEach((g, i) => container.appendChild(buildFeedCard(g, i)));
  triggerFeedAnimations();
}

function buildFeedCard(glitch, index) {
  const topic = TOPICS[glitch.topic];
  const done = State.isDone(glitch.id);
  const blob = String((index % 20) + 1).padStart(2, '0');
  const hook = glitch.hook || glitch.teaser || '→';

  const card = document.createElement('article');
  card.className = 'glitch-card';
  card.dataset.id = glitch.id;

  card.innerHTML =
    '<div class="card-bg"></div>' +
    '<img class="card-blob-img" src="assets/blob-images_' + blob + '.png" alt="">' +
    '<div class="card-header">' +
      '<span class="card-topic-badge">' + topic.label + '</span>' +
      '<span class="card-done-indicator' + (done ? ' done' : '') + '">' +
        (done ? '<img src="assets/done.svg" width="21" height="21" alt="">' : '') +
      '</span>' +
    '</div>' +
    '<div class="card-content">' +
      '<h2 class="card-title">' + glitch.title + '</h2>' +
      '<p class="card-teaser">' + glitch.teaser + '</p>' +
      '<div class="card-footer">' +
        '<span class="card-hook-pill">' + hook + '</span>' +
        '<button class="card-cta" aria-label="Otevřít">' +
          '<img src="assets/go.svg" width="31" height="31" alt="">' +
        '</button>' +
      '</div>' +
    '</div>';

  card.addEventListener('click', () => openDetail(glitch.id));
  return card;
}

function triggerFeedAnimations() {
  const cards = document.querySelectorAll('.glitch-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach((card, i) => {
    card.style.transitionDelay = (i * 0.07) + 's';
    observer.observe(card);
  });
}

// ── MAP ───────────────────────────────────────

function renderMap() {
  const container = document.getElementById('map-container');
  const searchInput = document.getElementById('map-search');

  renderMapDefault(container);

  searchInput.addEventListener('input', e => {
    const query = e.target.value.toLowerCase().trim();
    if (query) {
      renderMapSearch(container, query);
    } else {
      renderMapDefault(container);
    }
  });
}

function renderMapDefault(container) {
  container.innerHTML = '';

  const stickyExtra = document.getElementById('map-sticky-extra');
  if (stickyExtra) stickyExtra.innerHTML = '<p class="map-section-label">Nebo zvol téma</p>';

  CATEGORIES.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'map-cat-card';
    card.dataset.catId = cat.id;
    card.innerHTML =
      '<div class="map-cat-title">' + cat.title + '</div>' +
      '<img class="map-cat-blob" src="assets/' + cat.blob + '" alt="">';
    card.addEventListener('click', () => renderMapCategory(container, cat));
    container.appendChild(card);
  });
}

function renderMapCategory(container, cat) {
  container.innerHTML = '';
  const stickyExtra = document.getElementById('map-sticky-extra');
  if (stickyExtra) stickyExtra.innerHTML = '';

  const backRow = document.createElement('div');
  backRow.className = 'detail-nav map-cat-back-row';
  backRow.innerHTML =
    '<button class="detail-back-btn" aria-label="Zpět"><img src="assets/back.svg" width="30" height="30" alt=""></button>' +
    '<span class="detail-topic-pill">' + cat.title + '</span>';
  backRow.querySelector('.detail-back-btn').addEventListener('click', () => {
    document.getElementById('map-search').value = '';
    renderMapDefault(container);
  });
  container.appendChild(backRow);

  const missions = MISSIONS.filter(m => cat.missionIds.includes(m.id));

  missions.forEach(mission => {
    const glitches = mission.glitches.map(id => GLITCHES.find(g => g.id === id)).filter(Boolean);
    if (!glitches.length) return;

    const group = document.createElement('div');
    group.className = 'map-topic-group';

    const header = document.createElement('div');
    header.className = 'map-topic-header';
    header.innerHTML = '<span class="map-topic-label">' + mission.title + '</span>';
    group.appendChild(header);

    const tiles = document.createElement('div');
    tiles.className = 'map-tiles';

    glitches.forEach(g => {
      const done = State.isDone(g.id);
      const tile = document.createElement('div');
      tile.className = 'map-tile';
      tile.innerHTML =
        '<div class="map-tile-body">' +
          '<div class="map-tile-title">' + g.title + '</div>' +
        '</div>' +
        (done ? '<div class="map-tile-check"><img src="assets/done.svg" width="21" height="21" alt=""></div>' : '');
      tile.addEventListener('click', () => openDetail(g.id));
      tiles.appendChild(tile);
    });

    group.appendChild(tiles);
    container.appendChild(group);
  });
}

function renderMapSearch(container, query) {
  container.innerHTML = '';
  const stickyExtra = document.getElementById('map-sticky-extra');
  if (stickyExtra) stickyExtra.innerHTML = '';

  const glitches = GLITCHES.filter(g =>
    g.title.toLowerCase().includes(query) ||
    (TOPICS[g.topic] && TOPICS[g.topic].label.toLowerCase().includes(query))
  );

  if (!glitches.length) {
    container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px 0">Žádný glitch nenalezen.</p>';
    return;
  }

  glitches.forEach(g => {
    const done = State.isDone(g.id);
    const topic = TOPICS[g.topic];
    const tile = document.createElement('div');
    tile.className = 'map-tile';
    tile.innerHTML =
      '<div class="map-tile-body">' +
        '<div class="map-tile-title">' + g.title + '</div>' +
        '<div class="map-tile-tag">' + (topic ? topic.label : '') + '</div>' +
      '</div>' +
      (done ? '<div class="map-tile-check"><img src="assets/done.svg" width="21" height="21" alt=""></div>' : '');
    tile.addEventListener('click', () => openDetail(g.id));
    container.appendChild(tile);
  });
}

// Compatibility wrapper used by closeDetail and account reset
function renderMapContent(container, query) {
  if (query) {
    renderMapSearch(container, query);
  } else {
    renderMapDefault(container);
  }
}

// ── MISSIONS ─────────────────────────────────

let activeCategoryId = null;
let activeCategoryIdx = 0;

function renderMissions() {
  activeCategoryId = activeCategoryId || (CATEGORIES[0] && CATEGORIES[0].id);
  activeCategoryIdx = Math.max(0, CATEGORIES.findIndex(c => c.id === activeCategoryId));
  renderCategoryCarousel();
  renderMissionList(null);
}

function renderCategoryCarousel() {
  const carousel = document.getElementById('category-carousel');
  carousel.innerHTML = '';

  const track = document.createElement('div');
  track.className = 'cat-track';

  function switchToIdx(newIdx) {
    if (newIdx === activeCategoryIdx || !CATEGORIES[newIdx]) return;
    const dir = newIdx > activeCategoryIdx ? 'next' : 'prev';
    activeCategoryId = CATEGORIES[newIdx].id;
    activeCategoryIdx = newIdx;
    renderMissionList(dir);
  }

  // Touch: react on touchend, before snap animation finishes
  let touchStartX = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 20) return;
    switchToIdx(dx < 0
      ? Math.min(activeCategoryIdx + 1, CATEGORIES.length - 1)
      : Math.max(activeCategoryIdx - 1, 0));
  }, { passive: true });

  // Desktop: scrollend or debounced scroll
  function onScrollSettle() {
    if (!CATEGORIES.length) return;
    const cardWidth = track.scrollWidth / CATEGORIES.length;
    const idx = Math.min(Math.round(track.scrollLeft / cardWidth), CATEGORIES.length - 1);
    switchToIdx(idx);
  }
  if ('onscrollend' in window) {
    track.addEventListener('scrollend', onScrollSettle, { passive: true });
  } else {
    let scrollTimer;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(onScrollSettle, 50);
    }, { passive: true });
  }

  CATEGORIES.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'cat-card' + (cat.id === activeCategoryId ? ' active' : '');
    card.dataset.catId = cat.id;

    const starsHtml = buildStarsHtml(cat);

    card.innerHTML =
      '<div class="cat-card-title">' + cat.title + '</div>' +
      '<div class="cat-card-bottom">' +
        '<div class="cat-card-progress">' + starsHtml + '</div>' +
        '<img class="cat-blob-img" src="assets/' + cat.blob + '" alt="">' +
      '</div>';

    card.addEventListener('click', () => {
      const newIdx = CATEGORIES.findIndex(c => c.id === cat.id);
      const dir = newIdx > activeCategoryIdx ? 'next' : newIdx < activeCategoryIdx ? 'prev' : null;
      activeCategoryId = cat.id;
      activeCategoryIdx = newIdx;
      renderCategoryCarousel();
      renderMissionList(dir);
      const track = document.querySelector('.cat-track');
      if (track) track.scrollTo({ left: newIdx * track.offsetWidth, behavior: 'smooth' });
    });

    track.appendChild(card);
  });

  const prevBtn = document.createElement('button');
  prevBtn.className = 'cat-arrow cat-arrow-left';
  prevBtn.innerHTML = '<img src="assets/arrow.svg" width="21" height="21" alt="Předchozí" style="transform:rotate(180deg)">';
  prevBtn.addEventListener('click', () => {
    const newIdx = Math.max(0, activeCategoryIdx - 1);
    if (newIdx === activeCategoryIdx) return;
    activeCategoryId = CATEGORIES[newIdx].id;
    activeCategoryIdx = newIdx;
    renderCategoryCarousel();
    renderMissionList('prev');
    const t = document.querySelector('.cat-track');
    if (t) t.scrollTo({ left: newIdx * t.offsetWidth, behavior: 'smooth' });
  });

  const nextBtn = document.createElement('button');
  nextBtn.className = 'cat-arrow cat-arrow-right';
  nextBtn.innerHTML = '<img src="assets/arrow.svg" width="21" height="21" alt="Další">';
  nextBtn.addEventListener('click', () => {
    const newIdx = Math.min(CATEGORIES.length - 1, activeCategoryIdx + 1);
    if (newIdx === activeCategoryIdx) return;
    activeCategoryId = CATEGORIES[newIdx].id;
    activeCategoryIdx = newIdx;
    renderCategoryCarousel();
    renderMissionList('next');
    const t = document.querySelector('.cat-track');
    if (t) t.scrollTo({ left: newIdx * t.offsetWidth, behavior: 'smooth' });
  });

  function updateArrows() {
    const canLeft = track.scrollLeft > 1;
    const canRight = track.scrollLeft < track.scrollWidth - track.offsetWidth - 1;
    prevBtn.style.visibility = canLeft ? 'visible' : 'hidden';
    nextBtn.style.visibility = canRight ? 'visible' : 'hidden';
  }

  carousel.appendChild(prevBtn);
  carousel.appendChild(track);
  carousel.appendChild(nextBtn);

  // Restore scroll position to match active category
  requestAnimationFrame(() => {
    if (activeCategoryIdx > 0) {
      const card = track.querySelector('.cat-card');
      const cardWidth = card ? card.offsetWidth : track.offsetWidth;
      track.scrollLeft = activeCategoryIdx * (cardWidth + 12);
    }
    updateArrows();
  });
  track.addEventListener('scroll', updateArrows, { passive: true });
}

const STAR_PATH = 'M8.65934 5.11583C10.0559 2.79522 13.4203 2.79522 14.8168 5.11583C15.3186 5.94952 16.1369 6.54409 17.0849 6.76363C19.7234 7.37474 20.7631 10.5745 18.9876 12.6198C18.3498 13.3546 18.0372 14.3166 18.1213 15.286C18.3555 17.9843 15.6337 19.9618 13.1398 18.9053C12.2439 18.5257 11.2323 18.5257 10.3364 18.9053C7.84252 19.9618 5.12069 17.9843 5.35486 15.286C5.43899 14.3166 5.1264 13.3546 4.48856 12.6198C2.71309 10.5745 3.75274 7.37474 6.39134 6.76363C7.33926 6.54409 8.15762 5.94952 8.65934 5.11583Z';

function starSvg(filled) {
  const color = filled ? '#FFF062' : '#483B58';
  return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="' + STAR_PATH + '" fill="' + color + '"/></svg>';
}

function buildStarsHtml(cat) {
  const catMissions = MISSIONS.filter(m => cat.missionIds.includes(m.id));
  const totalMissions = catMissions.length;
  const doneMissions = catMissions.filter(m => {
    const done = m.glitches.filter(id => State.isDone(id)).length;
    return done === m.glitches.length && m.glitches.length > 0;
  }).length;
  const starCount = 5;
  let html = '';
  for (let i = 0; i < starCount; i++) {
    html += starSvg(i < Math.round((doneMissions / Math.max(totalMissions, 1)) * starCount));
  }
  return html;
}

function fillMissionList(container) {
  container.innerHTML = '';
  const cat = CATEGORIES.find(c => c.id === activeCategoryId);
  if (!cat) return;

  const catMissions = MISSIONS.filter(m => cat.missionIds.includes(m.id));

  catMissions.forEach((mission, idx) => {
    const total = mission.glitches.length;
    const done = mission.glitches.filter(id => State.isDone(id)).length;
    const complete = done === total && total > 0;

    const card = document.createElement('div');
    card.className = 'mission-card';

    const starsHtml = buildMissionStarsHtml(done, total);

    card.innerHTML =
      '<div class="mission-body">' +
        '<div class="mission-title">' + mission.title + '</div>' +
        '<div class="mission-desc">' + mission.description + '</div>' +
        '<div class="mission-footer">' +
          '<div class="mission-meta-row">' +
            '<span class="mission-meta">' + total + ' glitchů · splněno ' + done + '/' + total + '</span>' +
          '</div>' +
          '<div class="mission-bottom-row">' +
            '<div class="mission-stars">' + starsHtml + '</div>' +
            '<button class="mission-go-btn" aria-label="Spustit misi">' +
              '<img src="assets/go.svg" width="21" height="21" alt="">' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    if (idx < catMissions.length - 1) {
      card.classList.add('mission-card--sep');
    }

    card.addEventListener('click', () => {
      const nextId = mission.glitches.find(id => !State.isDone(id)) || mission.glitches[0];
      openDetail(nextId);
    });

    container.appendChild(card);
  });
}

function renderMissionList(dir) {
  const container = document.getElementById('missions-container');

  if (!dir || !container.children.length) {
    fillMissionList(container);
    return;
  }

  // slide out
  const outX = dir === 'next' ? '-20px' : '20px';
  const inX  = dir === 'next' ?  '20px' : '-20px';
  container.style.cssText = 'opacity:0;transform:translateX(' + outX + ');transition:opacity 0.07s ease,transform 0.07s ease;overflow:hidden';

  setTimeout(() => {
    fillMissionList(container);
    container.style.cssText = 'opacity:0;transform:translateX(' + inX + ');transition:none;overflow:hidden';
    container.getBoundingClientRect(); // force reflow
    container.style.cssText = 'opacity:1;transform:translateX(0);transition:opacity 0.14s ease,transform 0.14s ease;overflow:hidden';
  }, 75);
}

function buildMissionStarsHtml(done, total) {
  const starCount = 5;
  const filled = Math.round((done / Math.max(total, 1)) * starCount);
  let html = '';
  for (let i = 0; i < starCount; i++) {
    html += starSvg(i < filled);
  }
  return html;
}

// ── DETAIL / CHATBOT ─────────────────────────

let currentGlitchId = null;

function openDetail(glitchId) {
  const glitch = GLITCHES.find(g => g.id === glitchId);
  if (!glitch) return;
  currentGlitchId = glitchId;
  trackEvent('glitch_view', { glitchId });

  const chatContainer = document.getElementById('chat-container');
  chatContainer.innerHTML = '';
  chatContainer.scrollTop = 0;
  document.getElementById('detail-overlay').classList.remove('hidden');

  history.replaceState(null, '', '#glitch/' + glitchId);

  // Nav row: back btn + topic pill + share btn
  const topic = TOPICS[glitch.topic];
  const navRow = document.createElement('div');
  navRow.className = 'detail-nav';
  navRow.innerHTML =
    '<button class="detail-back-btn" aria-label="Zpět"><img src="assets/back.svg" width="30" height="30" alt=""></button>' +
    '<span class="detail-topic-pill">' + (topic ? topic.label : '') + '</span>' +
    '<button class="share-btn" aria-label="Sdílet">&#x1F517;</button>';
  navRow.querySelector('.share-btn').addEventListener('click', (e) => { e.stopPropagation(); shareLink('glitch', glitchId); });
  navRow.querySelector('.detail-back-btn').addEventListener('click', closeDetail);
  chatContainer.appendChild(navRow);

  // Large title
  const titleEl = document.createElement('h1');
  titleEl.className = 'detail-title-large';
  titleEl.textContent = glitch.title;
  chatContainer.appendChild(titleEl);

  const progress = State.progress[glitchId];
  if (progress && progress.completed) {
    replayFull(glitch);
  } else {
    runChat(glitch);
  }
}

function addDeepdive(glitch) {
  if (!glitch.deepdive || !glitch.deepdive.length) return;
  const container = document.getElementById('chat-container');
  const section = document.createElement('div');
  section.className = 'deepdive-section';
  glitch.deepdive.forEach(para => {
    if (typeof para === 'object' && para.mermaid) {
      addMermaidBlock(para.mermaid, section);
    } else {
      const p = document.createElement('p');
      p.innerHTML = renderBotText(para);
      section.appendChild(p);
    }
  });
  container.appendChild(section);
  scrollChatToBottom();
}

function showDeepDiveAndEnd(glitch, showRetry) {
  addDeepdive(glitch);
  showEndActions(glitch);
  if (showRetry) showRetryQuiz(glitch);
}

function showRetryQuiz(glitch) {
  const quizStep = glitch.chat.find(s => s.quiz);
  if (!quizStep) return;
  const container = document.getElementById('chat-container');

  const label = document.createElement('div');
  label.className = 'chat-bubble bot';
  label.textContent = 'Zkus kvíz znovu — tentokrát to dáš! 💪';
  container.appendChild(label);
  scrollChatToBottom();

  setTimeout(() => {
    showQuiz(quizStep.quiz, correct => {
      State.setGlitchDone(glitch.id, correct);
    });
  }, 400);
}

function closeDetail() {
  document.getElementById('detail-overlay').classList.add('hidden');
  currentGlitchId = null;
  history.replaceState(null, '', window.location.pathname);
  renderFeed();
  renderMapContent(
    document.getElementById('map-container'),
    document.getElementById('map-search').value.toLowerCase()
  );
}

// ── CHAT ENGINE ──────────────────────────────

function replayFull(glitch) {
  const container = document.getElementById('chat-container');

  glitch.chat.forEach(step => {
    if (step.bot) {
      const bubble = document.createElement('div');
      bubble.className = 'chat-bubble bot';
      bubble.style.opacity = '1';
      bubble.style.transform = 'none';
      bubble.innerHTML = renderBotText(step.bot);
      container.appendChild(bubble);
    } else if (step.mermaid) {
      addMermaidBlock(step.mermaid, container);
    } else if (step.quiz) {
      const quiz = step.quiz;
      const block = document.createElement('div');
      block.className = 'quiz-block';
      block.style.opacity = '1';
      block.style.transform = 'none';

      const optionsHTML = quiz.options.map((opt, i) => {
        const isCorrect = i === quiz.correct;
        return '<button class="quiz-option' + (isCorrect ? ' correct' : '') + '" disabled>' +
          '<span class="quiz-dot' + (isCorrect ? ' correct' : '') + '"></span><span>' + opt.text + '</span>' +
        '</button>';
      }).join('');

      block.innerHTML =
        '<div class="quiz-question">' + quiz.question + '</div>' +
        '<div class="quiz-options">' + optionsHTML + '</div>';

      if (quiz.explanation) {
        const explanation = document.createElement('div');
        explanation.className = 'quiz-explanation';
        explanation.textContent = quiz.explanation;
        block.appendChild(explanation);
      }
      container.appendChild(block);
    }
  });

  if (glitch.deepdive && glitch.deepdive.length) {
    const section = document.createElement('div');
    section.className = 'deepdive-section';
    glitch.deepdive.forEach(para => {
      if (typeof para === 'object' && para.mermaid) {
        addMermaidBlock(para.mermaid, section);
      } else {
        const p = document.createElement('p');
        p.innerHTML = renderBotText(para);
        section.appendChild(p);
      }
    });
    container.appendChild(section);
  }

  showFlashcard(glitch);
  showEndActions(glitch, false);
}

function runChat(glitch) {
  const steps = glitch.chat;
  let stepIndex = 0;

  function nextStep() {
    if (stepIndex >= steps.length) return;
    const step = steps[stepIndex++];

    if (step.mermaid) {
      showTyping().then(() => {
        addMermaidBlock(step.mermaid);
        if (stepIndex < steps.length) setTimeout(nextStep, 600);
      });
    } else if (step.bot) {
      showTyping().then(() => {
        addBotBubble(step.bot);
        if (stepIndex < steps.length) setTimeout(nextStep, 600);
      });
    } else if (step.quiz) {
      setTimeout(() => {
        showQuiz(step.quiz, correct => {
          State.setGlitchDone(glitch.id, correct);
          setTimeout(() => {
            showFlashcard(glitch);
            showEndActions(glitch, true);
          }, 800);
        });
      }, 400);
    }
  }

  setTimeout(nextStep, 300);
}

function renderBotText(text) {
  // Support ![alt](url) images and **bold**
  let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // Fix relative asset paths to absolute
  html = html.replace(/!\[([^\]]*)\]\(assets\//g, '![$1](/assets/');
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img class="chat-inline-img" src="$2" alt="$1">');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  return html;
}

function addBotBubble(text) {
  const container = document.getElementById('chat-container');
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble bot';
  bubble.innerHTML = renderBotText(text);
  container.appendChild(bubble);
  scrollChatToBottom();
}

function addMermaidBlock(code, container) {
  if (!container) container = document.getElementById('chat-container');
  const wrapper = document.createElement('div');
  wrapper.className = 'mermaid-block';
  const id = 'mermaid-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
  const mDiv = document.createElement('div');
  mDiv.className = 'mermaid';
  mDiv.id = id;
  mDiv.textContent = code;
  wrapper.appendChild(mDiv);
  container.appendChild(wrapper);
  try {
    if (typeof mermaid !== 'undefined') {
      mermaid.run({ nodes: [mDiv] });
    }
  } catch(e) { console.warn('Mermaid render error:', e); }
  scrollChatToBottom();
}

function addUserBubble(text) {
  const container = document.getElementById('chat-container');
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble user';
  bubble.textContent = text;
  container.appendChild(bubble);
  scrollChatToBottom();
}

function showTyping() {
  return new Promise(resolve => {
    const container = document.getElementById('chat-container');
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML =
      '<div class="typing-dot"></div>' +
      '<div class="typing-dot"></div>' +
      '<div class="typing-dot"></div>';
    container.appendChild(indicator);
    scrollChatToBottom();

    const delay = 700 + Math.random() * 500;
    setTimeout(() => {
      indicator.remove();
      resolve();
    }, delay);
  });
}

function showQuiz(quiz, onDone) {
  const container = document.getElementById('chat-container');
  const block = document.createElement('div');
  block.className = 'quiz-block';

  const optionsHTML = quiz.options.map((opt, i) =>
    '<button class="quiz-option" data-idx="' + i + '">' +
      '<span class="quiz-dot"></span><span>' + opt.text + '</span>' +
    '</button>'
  ).join('');

  block.innerHTML =
    '<div class="quiz-question">' + quiz.question + '</div>' +
    '<div class="quiz-options">' + optionsHTML + '</div>';

  const optionsBtns = block.querySelectorAll('.quiz-option');
  optionsBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const chosen = parseInt(btn.dataset.idx);
      const correct = chosen === quiz.correct;
      const chosenOpt = quiz.options[chosen];

      optionsBtns.forEach(b => {
        b.disabled = true;
        const idx = parseInt(b.dataset.idx);
        if (idx === quiz.correct) b.classList.add('correct');
        if (idx === chosen && !correct) b.classList.add('wrong');
        if (idx === chosen) b.classList.add('selected');
      });

      // Per-option feedback or fallback to general explanation
      const explanation = document.createElement('div');
      explanation.className = 'quiz-explanation ' + (correct ? 'correct' : 'wrong');
      const feedbackText = chosenOpt.feedback || quiz.explanation;
      explanation.textContent = correct ? feedbackText : feedbackText;
      block.appendChild(explanation);

      scrollChatToBottom();
      onDone(correct);
    });
  });

  container.appendChild(block);
  scrollChatToBottom();
}

function showFlashcard(glitch) {
  if (!glitch.flashcard) return;
  const container = document.getElementById('chat-container');
  const card = document.createElement('div');
  card.className = 'flashcard';
  card.innerHTML =
    '<div class="flashcard-label">Zapamatuj si</div>' +
    '<div class="flashcard-q">' + glitch.flashcard.q + '</div>' +
    '<div class="flashcard-a hidden">' + glitch.flashcard.a + '</div>';
  const revealBtn = document.createElement('button');
  revealBtn.className = 'flashcard-reveal';
  revealBtn.textContent = 'Ukaž odpověď';
  revealBtn.addEventListener('click', () => {
    card.querySelector('.flashcard-a').classList.remove('hidden');
    revealBtn.remove();
  });
  card.appendChild(revealBtn);
  container.appendChild(card);
  scrollChatToBottom();
}

function showEndActions(glitch, withReadMore = false) {
  const container = document.getElementById('chat-container');
  const actionsEl = document.createElement('div');
  actionsEl.className = 'chat-actions';

  const mission = MISSIONS.find(m => m.glitches.includes(glitch.id));
  let nextGlitchId = null;
  if (mission) {
    const idx = mission.glitches.indexOf(glitch.id);
    if (idx < mission.glitches.length - 1) {
      nextGlitchId = mission.glitches[idx + 1];
    }
  }

  if (nextGlitchId) {
    const nextBtn = document.createElement('button');
    nextBtn.className = 'chat-action-btn primary-action';
    nextBtn.textContent = 'Další glitch';
    nextBtn.addEventListener('click', () => openDetail(nextGlitchId));
    actionsEl.appendChild(nextBtn);
  } else {
    // Find next mission in the same category
    const cat = CATEGORIES.find(c => c.missionIds.some(mid => {
      const m = MISSIONS.find(ms => ms.id === mid);
      return m && m.glitches.includes(glitch.id);
    }));
    if (cat && mission) {
      const missionIdx = cat.missionIds.indexOf(mission.id);
      const nextMissionId = cat.missionIds[missionIdx + 1];
      const nextMission = nextMissionId && MISSIONS.find(m => m.id === nextMissionId);
      if (nextMission && nextMission.glitches.length) {
        const chapBtn = document.createElement('button');
        chapBtn.className = 'chat-action-btn primary-action';
        chapBtn.textContent = 'Další kapitola';
        chapBtn.addEventListener('click', () => openDetail(nextMission.glitches[0]));
        actionsEl.appendChild(chapBtn);
      }
    }
  }

  // Mission progress: show all glitches in the mission as a mini-list
  if (mission) {
    const progressEl = document.createElement('div');
    progressEl.className = 'mission-progress';
    const mTitle = document.createElement('div');
    mTitle.className = 'mission-progress-title';
    mTitle.textContent = mission.title;
    progressEl.appendChild(mTitle);

    mission.glitches.forEach(gId => {
      const g = GLITCHES.find(gl => gl.id === gId);
      if (!g) return;
      const done = State.isDone(gId);
      const isCurrent = gId === glitch.id;
      const row = document.createElement('button');
      row.className = 'mission-progress-item' + (done ? ' done' : '') + (isCurrent ? ' current' : '');
      row.innerHTML =
        '<span class="mp-dot">' + (done ? '<img src="assets/done.svg" width="14" height="14" alt="">' : '') + '</span>' +
        '<span class="mp-title">' + g.title + '</span>';
      if (!isCurrent) {
        row.addEventListener('click', () => openDetail(gId));
      }
      progressEl.appendChild(row);
    });
    actionsEl.appendChild(progressEl);
  }

  if (withReadMore && glitch.deepdive && glitch.deepdive.length) {
    const readMoreLink = document.createElement('button');
    readMoreLink.className = 'read-more-link';
    readMoreLink.textContent = 'Nebo si přečti více →';
    readMoreLink.addEventListener('click', () => {
      // Remove entire actions row, show deepdive, then show next btn below
      actionsEl.remove();
      addDeepdive(glitch);
      const afterBtn = document.createElement('button');
      afterBtn.className = 'chat-action-btn primary-action';
      afterBtn.style.alignSelf = 'flex-start';
      if (nextGlitchId) {
        afterBtn.textContent = 'Další glitch';
        afterBtn.addEventListener('click', () => openDetail(nextGlitchId));
        container.appendChild(afterBtn);
      } else {
        const cat = CATEGORIES.find(c => c.missionIds.some(mid => {
          const m = MISSIONS.find(ms => ms.id === mid);
          return m && m.glitches.includes(glitch.id);
        }));
        if (cat && mission) {
          const missionIdx = cat.missionIds.indexOf(mission.id);
          const nextMissionId = cat.missionIds[missionIdx + 1];
          const nextMission = nextMissionId && MISSIONS.find(m => m.id === nextMissionId);
          if (nextMission && nextMission.glitches.length) {
            afterBtn.textContent = 'Další kapitola';
            afterBtn.addEventListener('click', () => openDetail(nextMission.glitches[0]));
            container.appendChild(afterBtn);
          }
        }
      }
      // Scroll to deepdive section (force, user clicked "read more")
      const deepdiveEl = container.querySelector('.deepdive-section');
      if (deepdiveEl) {
        setTimeout(() => deepdiveEl.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
      }
    });
    actionsEl.appendChild(readMoreLink);
  }

  container.appendChild(actionsEl);
  scrollChatToBottom();
}

function scrollChatToBottom() {
  const container = document.getElementById('chat-container');
  setTimeout(() => {
    const distFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    if (distFromBottom < 150) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }, 50);
}

// ── KOMUNITA ────────────────────────────────

let communityData = null;
let activeTag = null;
let supabaseTeams = [];
let supabaseTeamMembers = [];

function isUUID(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

async function loadCommunity() {
  if (communityData) return;
  const resp = await fetch('glitches/community.json');
  communityData = await resp.json();

  // Merge Supabase tips on top of seed data
  try {
    if (sb) {
      const { data: sbTips, error } = await sb.from('community_tips').select('*').neq('tag', 'dev-message').order('created_at', { ascending: false });
      if (!error && sbTips && sbTips.length) {
        const sbMapped = sbTips.map(t => ({
          id: t.id,
          author: t.author_name,
          title: t.title,
          content: t.content,
          tag: t.tag,
          upvotes: t.upvotes || 0,
          comments: [],
          _supabase: true,
          _userId: t.user_id
        }));
        // Load comments for Supabase tips
        const tipIds = sbTips.map(t => t.id);
        try {
          const { data: sbComments } = await sb.from('tip_comments').select('*').in('tip_id', tipIds).order('created_at', { ascending: true });
          if (sbComments) {
            sbComments.forEach(c => {
              const tip = sbMapped.find(t => t.id === c.tip_id);
              if (tip) tip.comments.push({ author: c.author_name, text: c.content });
            });
          }
        } catch (e) { console.warn('Chyba při načítání komentářů:', e); }
        // Supabase tips go on top (newest first)
        communityData.tips = [...sbMapped, ...communityData.tips];
      }
    }
  } catch (e) { console.warn('Chyba při načítání tipů ze Supabase:', e); }

  // Load Supabase teams
  try {
    if (sb) {
      const { data: teams } = await sb.from('community_teams').select('*').order('created_at', { ascending: false });
      if (teams) supabaseTeams = teams;
      const { data: members } = await sb.from('team_members').select('*');
      if (members) supabaseTeamMembers = members;
    }
  } catch (e) { console.warn('Chyba při načítání týmů:', e); }
}

function renderKomunita() {
  loadCommunity().then(() => {
    renderKomunitaTags();
    renderKomunitaFeed();
    document.getElementById('add-tip-btn').onclick = openAddTip;
  });
}

function renderKomunitaTags() {
  const container = document.getElementById('komunita-tags');
  if (!container || !communityData) return;
  const allBtn = document.createElement('button');
  allBtn.className = 'komunita-tag' + (activeTag === null ? ' active' : '');
  allBtn.textContent = 'Vše';
  allBtn.style.setProperty('--tag-color', 'var(--accent)');
  allBtn.addEventListener('click', () => { activeTag = null; renderKomunitaTags(); renderKomunitaFeed(); });
  container.innerHTML = '';
  container.appendChild(allBtn);

  communityData.tags.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'komunita-tag' + (activeTag === tag.id ? ' active' : '');
    btn.textContent = tag.label;
    btn.style.setProperty('--tag-color', tag.color);
    btn.addEventListener('click', () => { activeTag = tag.id; renderKomunitaTags(); renderKomunitaFeed(); });
    container.appendChild(btn);
  });
}

function renderKomunitaFeed() {
  const container = document.getElementById('komunita-feed');
  if (!container || !communityData) return;
  container.innerHTML = '';

  // "Moje tymy" section at top if logged in and has teams
  if (sbCurrentUser && (!activeTag || activeTag === 'tym')) {
    const myTeams = supabaseTeams.filter(t =>
      supabaseTeamMembers.some(m => m.team_id === t.id && m.user_id === sbCurrentUser.id)
    );
    if (myTeams.length) {
      const section = document.createElement('div');
      section.className = 'my-teams-section';
      section.innerHTML = '<div class="my-teams-title">Moje tymy</div>';
      myTeams.forEach(team => {
        const members = supabaseTeamMembers.filter(m => m.team_id === team.id);
        const card = document.createElement('div');
        card.className = 'team-card';
        card.style.cursor = 'pointer';
        card.innerHTML = `
          <div class="team-name">${team.name}</div>
          <div class="team-desc">${team.description}</div>
          <div class="team-members-row">${members.map(m => '<span class="team-member">' + m.display_name + '</span>').join('')}</div>
        `;
        card.addEventListener('click', () => openTeamDetailOverlay(team));
        section.appendChild(card);
      });
      container.appendChild(section);
    }
  }

  const tips = activeTag
    ? communityData.tips.filter(t => t.tag === activeTag)
    : communityData.tips;

  // Sort by upvotes descending
  const sorted = [...tips].sort((a, b) => b.upvotes - a.upvotes);

  sorted.forEach(tip => {
    const tagMeta = communityData.tags.find(t => t.id === tip.tag);
    const upvoted = (JSON.parse(localStorage.getItem('tg_upvotes') || '[]')).includes(tip.id);
    const card = document.createElement('div');
    card.className = 'tip-card';
    card.innerHTML = `
      <div class="tip-card-top">
        <span class="tip-author">${tip.author}</span>
        <span class="tip-tag-badge" style="background:${tagMeta ? tagMeta.color : 'var(--accent)'}; color:#1a1200">${tagMeta ? tagMeta.label : tip.tag}</span>
      </div>
      <div class="tip-title">${tip.title}</div>
      <div class="tip-preview">${tip.content}</div>
      <div class="tip-footer">
        <button class="tip-upvote-btn ${upvoted ? 'upvoted' : ''}" data-tipid="${tip.id}">&hearts; ${tip.upvotes}</button>
        <span class="tip-comments">${tip.comments ? tip.comments.length : 0} odpovědí</span>
      </div>
    `;
    card.querySelector('.tip-upvote-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleUpvote(tip);
      e.target.textContent = '\u2665 ' + tip.upvotes;
      e.target.classList.toggle('upvoted');
    });
    card.addEventListener('click', () => openTipDetail(tip.id));
    container.appendChild(card);
  });

  // Teams section (only when no tag filter or 'tym' tag)
  if (!activeTag || activeTag === 'tym') {
    const teamHeader = document.createElement('div');
    teamHeader.className = 'komunita-section-header';
    teamHeader.innerHTML = '<h3>Týmy</h3><p class="komunita-sub">Přidej se k týmu nebo založ vlastní</p>' +
      '<button class="komunita-add-btn" style="margin-top:8px;font-size:12px;padding:6px 14px" id="create-team-btn">+ Založit tým</button>';
    container.appendChild(teamHeader);

    // Render Supabase teams first (newest)
    supabaseTeams.forEach(team => {
      const members = supabaseTeamMembers.filter(m => m.team_id === team.id);
      const isMember = sbCurrentUser && members.some(m => m.user_id === sbCurrentUser.id);
      const card = document.createElement('div');
      card.className = 'team-card';
      card.innerHTML = `
        <div class="team-name">${team.name}</div>
        <div class="team-desc">${team.description}</div>
        ${team.project ? '<div class="team-project"><strong>Projekt:</strong> ' + team.project + '</div>' : ''}
        <div class="team-members-row">
          ${members.map(m => '<span class="team-member">' + m.display_name + '</span>').join('')}
        </div>
        ${team.looking_for ? '<div class="team-looking">' + team.looking_for + '</div>' : ''}
        <div class="team-actions">
          ${isMember
            ? '<button class="team-conv-btn">Konverzace</button>'
            : '<button class="team-join-btn">Chci se přidat</button>'}
          ${sbCurrentUser && team.created_by === sbCurrentUser.id
            ? '<button class="tip-delete-btn team-del-btn">Smazat tým</button>'
            : ''}
        </div>
      `;
      const delTeamBtn = card.querySelector('.team-del-btn');
      if (delTeamBtn) {
        delTeamBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          if (!confirm('Opravdu chceš smazat tým "' + team.name + '"?')) return;
          try {
            await sb.from('community_teams').delete().eq('id', team.id);
            supabaseTeams = supabaseTeams.filter(t => t.id !== team.id);
            renderKomunitaFeed();
          } catch (err) { alert('Chyba při mazání: ' + err.message); }
        });
      }
      if (isMember) {
        card.querySelector('.team-conv-btn').addEventListener('click', (e) => { e.stopPropagation(); openTeamDetailOverlay(team); });
      } else {
        card.querySelector('.team-join-btn').addEventListener('click', async (e) => {
          e.stopPropagation();
          if (!sbCurrentUser) { alert('Pro připojení k týmu se nejdřív přihlas!'); return; }
          const btn = e.target;
          btn.textContent = 'Přidávám...'; btn.disabled = true;
          try {
            const user = State.user || {};
            const displayName = user.nickname || (sbCurrentUser.user_metadata && sbCurrentUser.user_metadata.full_name) || sbCurrentUser.email || 'Anonym';
            await sb.from('team_members').insert({ team_id: team.id, user_id: sbCurrentUser.id, display_name: displayName, role: 'member' });
            supabaseTeamMembers.push({ team_id: team.id, user_id: sbCurrentUser.id, display_name: displayName, role: 'member' });
            renderKomunitaFeed();
          } catch (err) { btn.textContent = 'Chyba'; btn.disabled = false; }
        });
      }
      container.appendChild(card);
    });

    // Seed teams (inspiration only, no actions)
    communityData.teams.forEach(team => {
      const card = document.createElement('div');
      card.className = 'team-card seed-team';
      card.innerHTML = `
        <div class="team-name">${team.name} <span class="team-seed-badge">inspirace</span></div>
        <div class="team-desc">${team.description}</div>
        <div class="team-project"><strong>Projekt:</strong> ${team.project}</div>
        <div class="team-members-row">
          ${team.members.map(m => '<span class="team-member">' + m + '</span>').join('')}
        </div>
      `;
      container.appendChild(card);
    });

    // "Založit tým" button handler
    const createTeamBtn = document.getElementById('create-team-btn');
    if (createTeamBtn) {
      createTeamBtn.addEventListener('click', () => {
        if (!sbCurrentUser) { alert('Pro založení týmu se nejdřív přihlas!'); return; }
        openCreateTeamModal();
      });
    }
  }

  // "Napsat vývojovému týmu" footer
  const devFooter = document.createElement('div');
  devFooter.className = 'komunita-dev-footer';
  devFooter.innerHTML = '<p>Máš nápad, chybu nebo zpětnou vazbu?</p>' +
    '<button class="komunita-dev-btn" id="dev-msg-btn">Napsat vývojovému týmu</button>';
  container.appendChild(devFooter);
  document.getElementById('dev-msg-btn').addEventListener('click', () => {
    if (!sbCurrentUser) { alert('Pro odeslání zprávy se nejdřív přihlas!'); return; }
    openDevMessageModal();
  });
}

// ── TEAM DETAIL OVERLAY ─────────────────────

function openTeamDetailOverlay(team) {
  history.replaceState(null, '', '#team/' + team.id);
  const overlay = document.getElementById('tip-detail-overlay');
  const members = supabaseTeamMembers.filter(m => m.team_id === team.id);
  const isLeader = sbCurrentUser && members.some(m => m.user_id === sbCurrentUser.id && m.role === 'leader');

  async function loadAndRender() {
    let comments = [];
    try {
      if (sb) {
        const { data } = await sb.from('tip_comments').select('*').eq('tip_id', team.id).order('created_at', { ascending: true });
        if (data) comments = data;
      }
    } catch(e) { /* silent */ }

    const membersHtml = members.map(m => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border)">
        <span>${m.display_name} <span style="font-size:11px;color:var(--text-muted)">(${m.role === 'leader' ? 'vedouci' : 'clen'})</span></span>
        ${isLeader && m.user_id !== sbCurrentUser.id ? '<button class="btn-delete remove-member-btn" data-uid="' + m.user_id + '" style="font-size:11px;padding:2px 8px">Odebrat</button>' : ''}
      </div>
    `).join('');

    const commentsHtml = comments.map(c => `
      <div class="tip-comment">
        <span class="tip-comment-author">${c.author_name}</span>
        <span class="tip-comment-text">${c.content}</span>
      </div>
    `).join('');

    overlay.innerHTML = `
      <div class="tip-detail-inner">
        <button class="tip-detail-close">&times;</button>
        <h3 style="color:var(--accent);margin-bottom:4px">${team.name}</h3>
        <p style="color:var(--text-muted);font-size:14px;margin-bottom:8px">${team.description}</p>
        ${team.project ? '<p style="font-size:13px;margin-bottom:12px"><strong>Projekt:</strong> ' + team.project + '</p>' : ''}
        <div class="tip-detail-actions"><button class="share-btn" id="team-share-btn">&#x1F517; Sdílet pozvánku</button></div>
        <div style="font-size:13px;font-weight:700;color:var(--text-muted);margin-bottom:6px">Členové (${members.length})</div>
        <div style="margin-bottom:16px">${membersHtml}</div>
        <div class="tip-detail-comments-header">Diskuze (${comments.length})</div>
        <div class="tip-detail-comments">${commentsHtml}</div>
        <div class="tip-reply-form">
          <textarea class="tip-reply-input" id="team-reply-text" placeholder="${sbCurrentUser ? 'Napsat do diskuze...' : 'Pro diskuzi se nejdriv prihlas'}" ${sbCurrentUser ? '' : 'disabled'}></textarea>
          <button class="tip-reply-btn" id="team-reply-submit" ${sbCurrentUser ? '' : 'disabled'}>Odpovedět</button>
        </div>
      </div>`;

    overlay.classList.remove('hidden');
    overlay.querySelector('.tip-detail-close').addEventListener('click', () => {
      overlay.classList.add('hidden');
      history.replaceState(null, '', window.location.pathname);
      renderKomunitaFeed();
    });

    document.getElementById('team-share-btn').addEventListener('click', () => shareLink('team', team.id));

    // Reply handler
    const replyBtn = document.getElementById('team-reply-submit');
    if (replyBtn && sbCurrentUser) {
      replyBtn.addEventListener('click', async () => {
        const text = document.getElementById('team-reply-text').value.trim();
        if (!text) return;
        replyBtn.disabled = true;
        replyBtn.textContent = 'Odesilam...';
        try {
          const user = State.user || {};
          const authorName = user.nickname || (sbCurrentUser.user_metadata && sbCurrentUser.user_metadata.full_name) || sbCurrentUser.email || 'Anonym';
          await sb.from('tip_comments').insert({
            tip_id: team.id,
            user_id: sbCurrentUser.id,
            author_name: authorName,
            content: text
          });
          loadAndRender();
        } catch(e) {
          replyBtn.textContent = 'Chyba';
          replyBtn.disabled = false;
        }
      });
    }

    // Remove member handlers
    if (isLeader) {
      overlay.querySelectorAll('.remove-member-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const uid = btn.dataset.uid;
          if (!confirm('Odebrat clena z tymu?')) return;
          try {
            await sb.from('team_members').delete().eq('team_id', team.id).eq('user_id', uid);
            const idx = supabaseTeamMembers.findIndex(m => m.team_id === team.id && m.user_id === uid);
            if (idx >= 0) supabaseTeamMembers.splice(idx, 1);
            loadAndRender();
          } catch(e) { alert('Chyba: ' + e.message); }
        });
      });
    }
  }

  loadAndRender();
}

// ── CREATE TEAM MODAL ───────────────────────

function openCreateTeamModal() {
  const overlay = document.getElementById('add-tip-overlay');
  const user = State.user || {};
  const authorName = user.nickname || (sbCurrentUser.user_metadata && sbCurrentUser.user_metadata.full_name) || sbCurrentUser.email || 'Anonym';

  overlay.innerHTML = `
    <div class="tip-detail-inner">
      <button class="tip-detail-close">&times;</button>
      <h3 style="margin-bottom:16px;color:var(--accent)">Založit nový tým</h3>
      <label class="add-tip-label">Název týmu</label>
      <input type="text" id="team-name-input" class="add-tip-input" placeholder="Název tvého týmu..." maxlength="60">
      <label class="add-tip-label">Popis</label>
      <textarea id="team-desc-input" class="add-tip-input add-tip-textarea" placeholder="Čím se tým zabývá..." maxlength="500" style="min-height:80px"></textarea>
      <label class="add-tip-label">Projektový nápad</label>
      <input type="text" id="team-project-input" class="add-tip-input" placeholder="Na čem chcete pracovat..." maxlength="120">
      <label class="add-tip-label">Koho hledáte</label>
      <input type="text" id="team-looking-input" class="add-tip-input" placeholder="Hledáme někoho, kdo..." maxlength="200">
      <button class="komunita-add-btn" id="team-create-submit" style="margin-top:16px;width:100%">Založit tým</button>
      <div id="team-create-error" class="auth-error" style="display:none;margin-top:8px"></div>
    </div>
  `;
  overlay.classList.remove('hidden');
  overlay.querySelector('.tip-detail-close').addEventListener('click', () => overlay.classList.add('hidden'));

  document.getElementById('team-create-submit').addEventListener('click', async () => {
    const name = document.getElementById('team-name-input').value.trim();
    const description = document.getElementById('team-desc-input').value.trim();
    const project = document.getElementById('team-project-input').value.trim();
    const lookingFor = document.getElementById('team-looking-input').value.trim();
    const errEl = document.getElementById('team-create-error');

    if (!name || !description) {
      errEl.textContent = 'Vyplň název i popis týmu.';
      errEl.style.display = 'block';
      return;
    }

    const submitBtn = document.getElementById('team-create-submit');
    submitBtn.textContent = 'Vytvářím...';
    submitBtn.disabled = true;

    try {
      if (!sb) throw new Error('Supabase není dostupné');

      const { data: teamData, error: teamError } = await sb.from('community_teams').insert({
        name: name,
        description: description,
        project: project || null,
        looking_for: lookingFor || null,
        created_by: sbCurrentUser.id
      }).select().single();

      if (teamError) throw teamError;

      // Add creator as first member
      const { error: memberError } = await sb.from('team_members').insert({
        team_id: teamData.id,
        user_id: sbCurrentUser.id,
        display_name: authorName,
        role: 'leader'
      });
      if (memberError) throw memberError;

      // Update local state
      supabaseTeams.unshift(teamData);
      supabaseTeamMembers.push({ team_id: teamData.id, user_id: sbCurrentUser.id, display_name: authorName, role: 'leader' });

      overlay.classList.add('hidden');
      renderKomunitaFeed();
    } catch (err) {
      errEl.textContent = 'Chyba při vytváření týmu: ' + err.message;
      errEl.style.display = 'block';
      submitBtn.textContent = 'Založit tým';
      submitBtn.disabled = false;
    }
  });
}

// ── DEV MESSAGE MODAL ───────────────────────

function openDevMessageModal() {
  const overlay = document.getElementById('add-tip-overlay');
  const user = State.user || {};
  const authorName = user.nickname || (sbCurrentUser.user_metadata && sbCurrentUser.user_metadata.full_name) || sbCurrentUser.email || 'Anonym';

  overlay.innerHTML = `
    <div class="tip-detail-inner">
      <button class="tip-detail-close">&times;</button>
      <h3 style="margin-bottom:16px;color:var(--accent)">Napsat vývojovému týmu</h3>
      <label class="add-tip-label">Předmět</label>
      <input type="text" id="dev-msg-subject" class="add-tip-input" placeholder="Nápad, chyba, zpětná vazba..." maxlength="100">
      <label class="add-tip-label">Zpráva</label>
      <textarea id="dev-msg-content" class="add-tip-input add-tip-textarea" placeholder="Popiš svůj nápad, chybu nebo zpětnou vazbu..." maxlength="2000"></textarea>
      <button class="komunita-add-btn" id="dev-msg-submit" style="margin-top:16px;width:100%">Odeslat zprávu</button>
      <div id="dev-msg-error" class="auth-error" style="display:none;margin-top:8px"></div>
    </div>
  `;
  overlay.classList.remove('hidden');
  overlay.querySelector('.tip-detail-close').addEventListener('click', () => overlay.classList.add('hidden'));

  document.getElementById('dev-msg-submit').addEventListener('click', async () => {
    const subject = document.getElementById('dev-msg-subject').value.trim();
    const content = document.getElementById('dev-msg-content').value.trim();
    const errEl = document.getElementById('dev-msg-error');

    if (!subject || !content) {
      errEl.textContent = 'Vyplň předmět i zprávu.';
      errEl.style.display = 'block';
      return;
    }

    const submitBtn = document.getElementById('dev-msg-submit');
    submitBtn.textContent = 'Odesílám...';
    submitBtn.disabled = true;

    try {
      if (!sb) throw new Error('Supabase není dostupné');

      await sb.from('community_tips').insert({
        user_id: sbCurrentUser.id,
        author_name: authorName,
        title: subject,
        content: content,
        tag: 'dev-message',
        upvotes: 0
      });

      // Show confirmation
      overlay.innerHTML = `
        <div class="tip-detail-inner" style="text-align:center;padding:40px 20px">
          <button class="tip-detail-close">&times;</button>
          <div style="font-size:48px;margin-bottom:16px">&#10004;</div>
          <h3 style="color:var(--accent);margin-bottom:8px">Zpráva odeslána!</h3>
          <p style="color:var(--text-muted);font-size:14px">Děkujeme za zpětnou vazbu. Odpovíme co nejdříve.</p>
        </div>
      `;
      overlay.querySelector('.tip-detail-close').addEventListener('click', () => overlay.classList.add('hidden'));
    } catch (err) {
      errEl.textContent = 'Chyba při odesílání: ' + err.message;
      errEl.style.display = 'block';
      submitBtn.textContent = 'Odeslat zprávu';
      submitBtn.disabled = false;
    }
  });
}

function openEditTip(tip) {
  const overlay = document.getElementById('add-tip-overlay');
  overlay.innerHTML = `
    <div class="tip-detail-inner">
      <button class="tip-detail-close">&times;</button>
      <h3 style="margin-bottom:16px;color:var(--accent)">Upravit příspěvek</h3>
      <label class="add-tip-label">Název</label>
      <input type="text" id="edit-tip-title" class="add-tip-input" value="${tip.title.replace(/"/g, '&quot;')}" maxlength="100">
      <label class="add-tip-label">Obsah</label>
      <textarea id="edit-tip-content" class="add-tip-input add-tip-textarea" maxlength="1000">${tip.content}</textarea>
      <button class="komunita-add-btn" id="edit-tip-submit" style="margin-top:16px;width:100%">Uložit změny</button>
      <div id="edit-tip-error" class="auth-error" style="display:none;margin-top:8px"></div>
    </div>
  `;
  overlay.classList.remove('hidden');
  overlay.querySelector('.tip-detail-close').addEventListener('click', () => overlay.classList.add('hidden'));
  document.getElementById('edit-tip-submit').addEventListener('click', async () => {
    const title = document.getElementById('edit-tip-title').value.trim();
    const content = document.getElementById('edit-tip-content').value.trim();
    if (!title || !content) { document.getElementById('edit-tip-error').textContent = 'Vyplň název i obsah.'; document.getElementById('edit-tip-error').style.display = 'block'; return; }
    try {
      await sb.from('community_tips').update({ title, content }).eq('id', tip.id);
      tip.title = title;
      tip.content = content;
      overlay.classList.add('hidden');
      renderKomunitaFeed();
    } catch (e) { document.getElementById('edit-tip-error').textContent = 'Chyba: ' + e.message; document.getElementById('edit-tip-error').style.display = 'block'; }
  });
}

function toggleUpvote(tip) {
  const upvotes = JSON.parse(localStorage.getItem('tg_upvotes') || '[]');
  const idx = upvotes.indexOf(tip.id);
  if (idx >= 0) {
    upvotes.splice(idx, 1);
    tip.upvotes = Math.max(0, tip.upvotes - 1);
  } else {
    upvotes.push(tip.id);
    tip.upvotes++;
  }
  localStorage.setItem('tg_upvotes', JSON.stringify(upvotes));
}

function openTipDetail(tipId) {
  trackEvent('tip_view', { tipId });
  const tip = communityData.tips.find(t => t.id === tipId);
  if (!tip) return;
  history.replaceState(null, '', '#tip/' + tipId);
  const tagMeta = communityData.tags.find(t => t.id === tip.tag);
  const upvoted = (JSON.parse(localStorage.getItem('tg_upvotes') || '[]')).includes(tip.id);
  const overlay = document.getElementById('tip-detail-overlay');

  // Load comments from Supabase for Supabase tips if not already loaded
  const showDetail = (comments) => {
    const commentsHtml = (comments || []).map(c => `
      <div class="tip-comment">
        <span class="tip-comment-author">${c.author}</span>
        <span class="tip-comment-text">${c.text}</span>
      </div>
    `).join('');

    const replyForm = `
      <div class="tip-reply-form">
        <textarea class="tip-reply-input" id="tip-reply-text" placeholder="${sbCurrentUser ? 'Napiš odpověď...' : 'Pro odpověď se nejdřív přihlas'}" ${sbCurrentUser ? '' : 'disabled'}></textarea>
        <button class="tip-reply-btn" id="tip-reply-submit" ${sbCurrentUser ? '' : 'disabled'}>Odpovědět</button>
      </div>
    `;

    overlay.innerHTML = `
      <div class="tip-detail-inner">
        <button class="tip-detail-close">&times;</button>
        <div class="tip-card-top">
          <span class="tip-author">${tip.author}</span>
          <span class="tip-tag-badge" style="background:${tagMeta ? tagMeta.color : 'var(--accent)'}; color:#1a1200">${tagMeta ? tagMeta.label : tip.tag}</span>
        </div>
        <div class="tip-title" style="font-size:20px;margin:12px 0">${tip.title}</div>
        <div class="tip-detail-content">${tip.content}</div>
        <div class="tip-detail-actions">
          <button class="tip-upvote-btn detail-upvote ${upvoted ? 'upvoted' : ''}" id="detail-upvote-btn">&hearts; ${tip.upvotes}</button>
          ${(tip._supabase && sbCurrentUser && tip._userId === sbCurrentUser.id) ? '<button class="tip-edit-btn" id="tip-edit-btn">Upravit</button><button class="tip-delete-btn" id="tip-delete-btn">Smazat</button>' : ''}
          <button class="share-btn" id="tip-share-btn">&#x1F517; Sdílet</button>
        </div>
        <div class="tip-detail-comments-header">Odpovědi (${comments ? comments.length : 0})</div>
        <div class="tip-detail-comments" id="tip-comments-list">${commentsHtml}</div>
        ${replyForm}
      </div>
    `;

    overlay.classList.remove('hidden');
    overlay.querySelector('.tip-detail-close').addEventListener('click', () => {
      overlay.classList.add('hidden');
      history.replaceState(null, '', window.location.pathname);
      renderKomunitaFeed();
    });

    document.getElementById('tip-share-btn').addEventListener('click', () => shareLink('tip', tipId));

    document.getElementById('detail-upvote-btn').addEventListener('click', () => {
      toggleUpvote(tip);
      const btn = document.getElementById('detail-upvote-btn');
      btn.textContent = '\u2665 ' + tip.upvotes;
      btn.classList.toggle('upvoted');
    });

    // Edit own tip
    const editBtn = document.getElementById('tip-edit-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        overlay.classList.add('hidden');
        openEditTip(tip);
      });
    }
    // Delete own tip
    const deleteBtn = document.getElementById('tip-delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async () => {
        if (!confirm('Opravdu chceš smazat tento příspěvek?')) return;
        try {
          await sb.from('community_tips').delete().eq('id', tip.id);
          communityData.tips = communityData.tips.filter(t => t.id !== tip.id);
          overlay.classList.add('hidden');
          renderKomunitaFeed();
        } catch (e) { alert('Chyba při mazání: ' + e.message); }
      });
    }

    const submitBtn = document.getElementById('tip-reply-submit');
    if (submitBtn && sbCurrentUser) {
      submitBtn.addEventListener('click', async () => {
        const text = document.getElementById('tip-reply-text').value.trim();
        if (!text) return;
        const user = State.user || {};
        const authorName = user.nickname || (sbCurrentUser.user_metadata && sbCurrentUser.user_metadata.full_name) || sbCurrentUser.email || 'Anonym';
        const newComment = { author: authorName, text: text };
        if (!tip.comments) tip.comments = [];
        tip.comments.push(newComment);
        document.getElementById('tip-reply-text').value = '';

        // Save to Supabase if it's a Supabase tip
        if (isUUID(tip.id) && sb) {
          try {
            await sb.from('tip_comments').insert({
              tip_id: tip.id,
              user_id: sbCurrentUser.id,
              author_name: authorName,
              content: text
            });
          } catch (e) { console.warn('Chyba při ukládání komentáře:', e); }
        }

        // Re-render comments
        const list = document.getElementById('tip-comments-list');
        const el = document.createElement('div');
        el.className = 'tip-comment new';
        const aSpan = document.createElement('span'); aSpan.className = 'tip-comment-author'; aSpan.textContent = authorName;
        const tSpan = document.createElement('span'); tSpan.className = 'tip-comment-text'; tSpan.textContent = text;
        el.appendChild(aSpan); el.appendChild(tSpan);
        list.appendChild(el);
        // Update header count
        overlay.querySelector('.tip-detail-comments-header').textContent = 'Odpovědi (' + tip.comments.length + ')';
      });
    }
  };

  // If Supabase tip, refresh comments from DB
  if (isUUID(tipId) && sb) {
    sb.from('tip_comments').select('*').eq('tip_id', tipId).order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) {
          tip.comments = data.map(c => ({ author: c.author_name, text: c.content }));
        }
        showDetail(tip.comments);
      })
      .catch(() => showDetail(tip.comments));
  } else {
    showDetail(tip.comments);
  }
}

function openAddTip() {
  const overlay = document.getElementById('add-tip-overlay');
  if (!sbCurrentUser) {
    overlay.innerHTML = `
      <div class="tip-detail-inner">
        <button class="tip-detail-close">&times;</button>
        <div class="add-tip-login-msg">
          <p>Pro přidání tipu se nejdřív přihlas</p>
          <button class="komunita-add-btn" onclick="document.getElementById('add-tip-overlay').classList.add('hidden'); document.getElementById('profile-btn').click();">Přihlásit se</button>
        </div>
      </div>
    `;
    overlay.classList.remove('hidden');
    overlay.querySelector('.tip-detail-close').addEventListener('click', () => overlay.classList.add('hidden'));
    return;
  }

  const user = State.user || {};
  const authorName = user.nickname || (sbCurrentUser.user_metadata && sbCurrentUser.user_metadata.full_name) || sbCurrentUser.email || 'Anonym';

  overlay.innerHTML = `
    <div class="tip-detail-inner">
      <button class="tip-detail-close">&times;</button>
      <h3 style="margin-bottom:16px;color:var(--accent)">Nový tip</h3>
      <label class="add-tip-label">Název</label>
      <input type="text" id="add-tip-title" class="add-tip-input" placeholder="Název tvého tipu..." maxlength="100">
      <label class="add-tip-label">Obsah</label>
      <textarea id="add-tip-content" class="add-tip-input add-tip-textarea" placeholder="Poděl se o svůj tip nebo trik..." maxlength="1000"></textarea>
      <label class="add-tip-label">Tag</label>
      <select id="add-tip-tag" class="add-tip-input">
        ${communityData.tags.map(t => '<option value="' + t.id + '">' + t.label + '</option>').join('')}
      </select>
      <button class="komunita-add-btn" id="add-tip-submit" style="margin-top:16px;width:100%">Odeslat tip</button>
      <div id="add-tip-error" class="auth-error" style="display:none;margin-top:8px"></div>
    </div>
  `;
  overlay.classList.remove('hidden');
  overlay.querySelector('.tip-detail-close').addEventListener('click', () => overlay.classList.add('hidden'));

  document.getElementById('add-tip-submit').addEventListener('click', async () => {
    const title = document.getElementById('add-tip-title').value.trim();
    const content = document.getElementById('add-tip-content').value.trim();
    const tag = document.getElementById('add-tip-tag').value;
    const errEl = document.getElementById('add-tip-error');

    if (!title || !content) {
      errEl.textContent = 'Vyplň název i obsah.';
      errEl.style.display = 'block';
      return;
    }

    const submitBtn = document.getElementById('add-tip-submit');
    submitBtn.textContent = 'Odesílám...';
    submitBtn.disabled = true;

    try {
      let newId = 'user-' + Date.now();

      // Save to Supabase
      if (sb) {
        const { data: inserted, error } = await sb.from('community_tips').insert({
          user_id: sbCurrentUser.id,
          author_name: authorName,
          title: title,
          content: content,
          tag: tag,
          upvotes: 0
        }).select().single();
        if (error) throw error;
        if (inserted) newId = inserted.id;
      }

      // Add to local data
      const newTip = {
        id: newId,
        author: authorName,
        title: title,
        content: content,
        tag: tag,
        upvotes: 0,
        comments: [],
        _supabase: isUUID(newId)
      };
      communityData.tips.unshift(newTip);

      overlay.classList.add('hidden');
      renderKomunitaFeed();
    } catch (err) {
      errEl.textContent = 'Chyba při odesílání: ' + err.message;
      errEl.style.display = 'block';
      submitBtn.textContent = 'Odeslat tip';
      submitBtn.disabled = false;
    }
  });
}

// ── DEEP LINKS & SHARING ────────────────────

function handleDeepLink() {
  const hash = window.location.hash.slice(1);
  if (!hash) return;

  // Skip OAuth tokens
  if (hash.includes('access_token') || hash.includes('error')) return;

  enterApp();

  if (hash.startsWith('glitch/')) {
    const id = hash.slice(7);
    if (GLITCHES.find(g => g.id === id)) openDetail(id);
  } else if (hash.startsWith('tip/')) {
    const id = hash.slice(4);
    const nav = document.querySelector('.nav-btn[data-view="komunita"]');
    if (nav) nav.click();
    loadCommunity().then(() => openTipDetail(id));
  } else if (hash.startsWith('team/')) {
    const id = hash.slice(5);
    const nav = document.querySelector('.nav-btn[data-view="komunita"]');
    if (nav) nav.click();
    loadCommunity().then(() => {
      const team = supabaseTeams.find(t => t.id === id) || communityData.teams.find(t => t.id === id);
      if (team) openTeamDetailOverlay(team);
    });
  }
}

function shareLink(type, id) {
  const url = window.location.origin + '/#' + type + '/' + id;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => showToast('Odkaz zkopírován!'));
  } else {
    prompt('Zkopíruj odkaz:', url);
  }
}

function showToast(text) {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--accent);color:#1a1200;padding:10px 24px;border-radius:100px;font-size:14px;font-weight:700;z-index:999;animation:badge-pop .3s ease';
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}

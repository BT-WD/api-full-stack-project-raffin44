/* ═══════════════════════════════════════════════════════════════
   FIFA WORLD CUP 2026 — index.js
   ─ Real API calls via fetch()
   ─ localStorage for favorites & cache
   ─ Console-friendly logging with [WC26] prefix
   ─ All errors handled gracefully
   ═══════════════════════════════════════════════════════════════ */
 
"use strict";
 
/* ── Constants ─────────────────────────────────────────────── */
const LOG   = (...a) => console.log  ("%c[WC26]", "color:#3d6fff;font-weight:bold", ...a);
const WARN  = (...a) => console.warn ("%c[WC26]", "color:#f5c842;font-weight:bold", ...a);
const ERROR = (...a) => console.error("%c[WC26]", "color:#ff3a5c;font-weight:bold", ...a);
 
// ── football-data.org (free tier, no key needed for basic endpoints)
const FD_BASE   = "https://www.balldontlie.io/openapi/fifa.yml";
const FD_HEADS  = { "X-Auth-Token": "e55d30d7-18d1-40ed-aef5-420113bd3e85" }; 
const WC_ID     = 2000; // FIFA World Cup competition ID
 
// ── REST Countries (no key required) – for flags & country data
const COUNTRIES_BASE = "https://restcountries.com/v3.1";
 
// ── Open-Meteo (no key) – weather at venue cities
const WEATHER_BASE = "https://api.open-meteo.com/v1/forecast";
 
// ── LocalStorage keys
const LS = {
  FAVORITES : "wc26_favorites",
  CACHE_PFX : "wc26_cache_",
  LAST_VISIT: "wc26_lastVisit",
};
 
/* ── Static fallback data (used when API key not set / rate-limited) ── */
const FALLBACK_MATCHES = [
  { id:1,  type:"group",    date:"2026-06-11", time:"11:00", home:"Mexico",        away:"TBD",          venue:"Estadio Azteca, Mexico City",    status:"SCHEDULED" },
  { id:2,  type:"group",    date:"2026-06-11", time:"14:00", home:"United States", away:"TBD",          venue:"SoFi Stadium, Los Angeles",      status:"SCHEDULED" },
  { id:3,  type:"group",    date:"2026-06-12", time:"15:00", home:"Canada",        away:"TBD",          venue:"BC Place, Vancouver",            status:"SCHEDULED" },
  { id:4,  type:"group",    date:"2026-06-13", time:"13:00", home:"Brazil",        away:"Argentina",    venue:"MetLife Stadium, New York",      status:"SCHEDULED" },
  { id:5,  type:"group",    date:"2026-06-14", time:"16:00", home:"Germany",       away:"France",       venue:"AT&T Stadium, Dallas",           status:"SCHEDULED" },
  { id:6,  type:"group",    date:"2026-06-15", time:"12:00", home:"England",       away:"Spain",        venue:"Levi's Stadium, San Francisco",  status:"SCHEDULED" },
  { id:7,  type:"knockout", date:"2026-07-04", time:"18:00", home:"TBD",           away:"TBD",          venue:"Arrowhead Stadium, Kansas City", status:"SCHEDULED" },
  { id:8,  type:"knockout", date:"2026-07-14", time:"15:00", home:"TBD",           away:"TBD",          venue:"Rose Bowl, Pasadena",            status:"SCHEDULED" },
  { id:9,  type:"knockout", date:"2026-07-19", time:"18:00", home:"TBD",           away:"TBD",          venue:"MetLife Stadium, New York",      status:"SCHEDULED", isFinal:true },
];
 
const FALLBACK_TEAMS = [
  { id:1,  name:"Mexico",        flag:"🇲🇽", group:"A", conf:"CONCACAF", rank:12 },
  { id:2,  name:"United States", flag:"🇺🇸", group:"A", conf:"CONCACAF", rank:13 },
  { id:3,  name:"Canada",        flag:"🇨🇦", group:"B", conf:"CONCACAF", rank:47 },
  { id:4,  name:"Brazil",        flag:"🇧🇷", group:"B", conf:"CONMEBOL", rank:5  },
  { id:5,  name:"Argentina",     flag:"🇦🇷", group:"B", conf:"CONMEBOL", rank:1  },
  { id:6,  name:"France",        flag:"🇫🇷", group:"C", conf:"UEFA",     rank:2  },
  { id:7,  name:"England",       flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", group:"C", conf:"UEFA",     rank:3  },
  { id:8,  name:"Germany",       flag:"🇩🇪", group:"D", conf:"UEFA",     rank:16 },
  { id:9,  name:"Spain",         flag:"🇪🇸", group:"D", conf:"UEFA",     rank:6  },
  { id:10, name:"Portugal",      flag:"🇵🇹", group:"E", conf:"UEFA",     rank:7  },
  { id:11, name:"Netherlands",   flag:"🇳🇱", group:"E", conf:"UEFA",     rank:7  },
  { id:12, name:"Japan",         flag:"🇯🇵", group:"F", conf:"AFC",      rank:18 },
  { id:13, name:"South Korea",   flag:"🇰🇷", group:"F", conf:"AFC",      rank:22 },
  { id:14, name:"Morocco",       flag:"🇲🇦", group:"G", conf:"CAF",      rank:14 },
  { id:15, name:"Senegal",       flag:"🇸🇳", group:"G", conf:"CAF",      rank:20 },
  { id:16, name:"Australia",     flag:"🇦🇺", group:"H", conf:"AFC",      rank:25 },
];
 
const VENUES = [
  { name:"Estadio Azteca",   city:"Mexico City",    country:"Mexico",  cap:"87,523", lat:19.3029, lon:-99.1505, matches:6  },
  { name:"MetLife Stadium",  city:"East Rutherford",country:"USA",     cap:"82,500", lat:40.8135, lon:-74.0745, matches:"8 (Final)" },
  { name:"SoFi Stadium",     city:"Los Angeles",    country:"USA",     cap:"70,240", lat:33.9535, lon:-118.3392,matches:7  },
  { name:"BC Place",         city:"Vancouver",      country:"Canada",  cap:"54,500", lat:49.2767, lon:-123.1117,matches:6  },
  { name:"AT&T Stadium",     city:"Dallas",         country:"USA",     cap:"80,000", lat:32.7478, lon:-97.0928, matches:6  },
  { name:"Levi's Stadium",   city:"San Francisco",  country:"USA",     cap:"68,500", lat:37.4033, lon:-121.9694,matches:6  },
];
 
const TICKER_ITEMS = [
  "🏆 FIFA World Cup 2026 kicks off June 11 in Mexico City",
  "⚽ 48 nations compete across 16 venues in USA, Canada & Mexico",
  "🥅 104 matches total — the biggest World Cup in history",
  "🌎 First ever 3-nation co-hosted FIFA World Cup",
  "🔔 Save your favorite teams using the ★ button",
  "📍 Explore venues and get live weather updates",
];
 
/* ═══════════════════════════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════════════════════════ */
const state = {
  matches        : [],
  teams          : [],
  venues         : VENUES,
  favorites      : new Set(),
  activeFilter   : "all",   // all | group | knockout | favorites
  scheduleSearch : "",
  teamSearch     : "",
  groupFilter    : "",
  confFilter     : "",
  apiKeySet      : false,
};
 
/* ═══════════════════════════════════════════════════════════════
   LOCAL STORAGE HELPERS
   ═══════════════════════════════════════════════════════════════ */
function lsGet(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
  catch(e) { WARN("lsGet error", key, e); return null; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); return true; }
  catch(e) { WARN("lsSet error — storage may be full", e); return false; }
}
 
function loadFavorites() {
  const saved = lsGet(LS.FAVORITES);
  if (Array.isArray(saved)) { state.favorites = new Set(saved); LOG("Loaded", saved.length, "favorites from localStorage"); }
}
function saveFavorites() {
  lsSet(LS.FAVORITES, [...state.favorites]);
  LOG("Favorites saved →", [...state.favorites]);
}
 
function cacheSet(key, data, ttlMs = 5 * 60 * 1000) {
  lsSet(LS.CACHE_PFX + key, { data, expires: Date.now() + ttlMs });
}
function cacheGet(key) {
  const entry = lsGet(LS.CACHE_PFX + key);
  if (!entry) return null;
  if (Date.now() > entry.expires) { localStorage.removeItem(LS.CACHE_PFX + key); return null; }
  LOG(`Cache hit: ${key}`);
  return entry.data;
}
 
function recordLastVisit() {
  lsSet(LS.LAST_VISIT, new Date().toISOString());
  const last = lsGet(LS.LAST_VISIT);
  if (last) LOG("Last visit recorded:", last);
}
 
/* ═══════════════════════════════════════════════════════════════
   FETCH HELPERS
   ═══════════════════════════════════════════════════════════════ */
async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, { ...opts, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  return res.json();
}
 
/* ═══════════════════════════════════════════════════════════════
   API: WEATHER  (Open-Meteo — free, no key)
   ═══════════════════════════════════════════════════════════════ */
async function fetchWeather(lat, lon) {
  const cacheKey = `weather_${lat}_${lon}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;
 
  try {
    const url = `${WEATHER_BASE}?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,windspeed_10m&timezone=auto`;
    const data = await fetchJSON(url);
    const result = {
      temp  : data.current.temperature_2m,
      unit  : data.current_units.temperature_2m,
      code  : data.current.weathercode,
      wind  : data.current.windspeed_10m,
    };
    cacheSet(cacheKey, result, 10 * 60 * 1000);
    LOG(`Weather for (${lat},${lon}):`, result);
    return result;
  } catch(e) {
    ERROR("Weather fetch failed:", e.message);
    return null;
  }
}
 
function weatherCodeEmoji(code) {
  if (code === 0) return "☀️";
  if (code <= 3)  return "🌤️";
  if (code <= 48) return "🌫️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌦️";
  return "⛈️";
}
 
/* ═══════════════════════════════════════════════════════════════
   API: FOOTBALL-DATA.ORG (requires free API key)
   ═══════════════════════════════════════════════════════════════ */
async function fetchMatchesFromAPI() {
  if (FD_HEADS["X-Auth-Token"] === "REPLACE_WITH_YOUR_KEY") {
    WARN("football-data.org API key not set — using fallback data. Get a free key at https://www.football-data.org/");
    return null;
  }
  const cacheKey = "fd_matches";
  const cached = cacheGet(cacheKey);
  if (cached) return cached;
 
  try {
    const data = await fetchJSON(`${FD_BASE}/competitions/${WC_ID}/matches`, { headers: FD_HEADS });
    const matches = (data.matches || []).slice(0, 30).map(m => ({
      id    : m.id,
      type  : m.stage?.toLowerCase().includes("group") ? "group" : "knockout",
      date  : m.utcDate?.split("T")[0],
      time  : m.utcDate?.split("T")[1]?.slice(0,5),
      home  : m.homeTeam?.name || "TBD",
      away  : m.awayTeam?.name || "TBD",
      scoreH: m.score?.fullTime?.home ?? null,
      scoreA: m.score?.fullTime?.away ?? null,
      status: m.status,
      venue : m.venue || "TBD",
    }));
    cacheSet(cacheKey, matches, 5 * 60 * 1000);
    LOG(`Fetched ${matches.length} matches from football-data.org API`);
    return matches;
  } catch(e) {
    ERROR("football-data.org fetch failed:", e.message);
    return null;
  }
}
 
async function fetchTeamsFromAPI() {
  if (FD_HEADS["X-Auth-Token"] === "REPLACE_WITH_YOUR_KEY") return null;
  const cacheKey = "fd_teams";
  const cached = cacheGet(cacheKey);
  if (cached) return cached;
 
  try {
    const data = await fetchJSON(`${FD_BASE}/competitions/${WC_ID}/teams`, { headers: FD_HEADS });
    const teams = (data.teams || []).map((t, i) => ({
      id   : t.id,
      name : t.name,
      flag : t.crestUrl ? null : "🏳️", // crest image URL available
      crest: t.crestUrl,
      group: String.fromCharCode(65 + Math.floor(i / 4)), // placeholder grouping
      conf : t.area?.name || "—",
      rank : "—",
    }));
    cacheSet(cacheKey, teams, 10 * 60 * 1000);
    LOG(`Fetched ${teams.length} teams from football-data.org API`);
    return teams;
  } catch(e) {
    ERROR("Teams fetch failed:", e.message);
    return null;
  }
}
 
/* ═══════════════════════════════════════════════════════════════
   RENDER: TICKER
   ═══════════════════════════════════════════════════════════════ */
function renderTicker() {
  const el = document.getElementById("ticker-content");
  if (!el) return;
  // Duplicate for seamless loop
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  el.innerHTML = items.map(t => `<span>${t}</span>`).join("");
}
 
/* ═══════════════════════════════════════════════════════════════
   RENDER: MATCHES
   ═══════════════════════════════════════════════════════════════ */
function matchStatusLabel(status) {
  const map = {
    SCHEDULED : { text:"Upcoming",  cls:"upcoming" },
    LIVE      : { text:"🔴 LIVE",   cls:"live"     },
    IN_PLAY   : { text:"🔴 LIVE",   cls:"live"     },
    FINISHED  : { text:"Full Time", cls:"finished" },
    POSTPONED : { text:"Postponed", cls:"upcoming" },
  };
  return map[status] || { text: status, cls:"upcoming" };
}
 
function matchTypeLabel(type, isFinal) {
  if (isFinal)           return { text:"🏆 FINAL",     cls:"final"    };
  if (type === "group")  return { text:"Group Stage",  cls:"group"    };
  return                        { text:"Knockout",     cls:"knockout" };
}
 
function buildMatchCard(m) {
  const isFav   = state.favorites.has(`match_${m.id}`);
  const statusL = matchStatusLabel(m.status);
  const typeL   = matchTypeLabel(m.type, m.isFinal);
  const score   = (m.scoreH !== null && m.scoreA !== null)
    ? `<span class="score">${m.scoreH} – ${m.scoreA}</span>`
    : `<span class="vs-text">VS</span>`;
 
  return `
  <div class="match-card ${m.isFinal ? "match-card--final" : m.type === "group" ? "" : "match-card--knockout"}"
       data-id="${m.id}" data-type="${m.type}">
    <div class="match-card__meta">
      <span class="badge badge--${typeL.cls}">${typeL.text}</span>
      <span class="match-card__date">📅 ${m.date}&nbsp;&nbsp;🕐 ${m.time}</span>
      <span class="match-card__venue">📍 ${m.venue}</span>
      <button class="fav-btn match-fav ${isFav ? "fav-btn--active" : ""}"
              data-key="match_${m.id}" aria-label="Favorite match"
              title="${isFav ? "Remove from favorites" : "Save to favorites"}">
        ${isFav ? "★" : "☆"}
      </button>
    </div>
    <div class="match-card__fixture">
      <div class="team">
        <span class="team__name">${m.home}</span>
      </div>
      <div class="match-card__vs">
        ${score}
        <span class="match-card__status match-card__status--${statusL.cls}">${statusL.text}</span>
      </div>
      <div class="team team--right">
        <span class="team__name">${m.away}</span>
      </div>
    </div>
  </div>`;
}
 
function renderMatches() {
  const container = document.getElementById("matches-container");
  if (!container) return;
 
  const q     = state.scheduleSearch.toLowerCase();
  const filt  = state.activeFilter;
 
  const filtered = state.matches.filter(m => {
    if (filt === "group"     && m.type !== "group")                        return false;
    if (filt === "knockout"  && m.type !== "knockout")                     return false;
    if (filt === "favorites" && !state.favorites.has(`match_${m.id}`))     return false;
    if (q && !m.home.toLowerCase().includes(q)
          && !m.away.toLowerCase().includes(q)
          && !m.venue.toLowerCase().includes(q))                           return false;
 
    const fromEl = document.getElementById("date-from");
    const toEl   = document.getElementById("date-to");
    if (fromEl?.value && m.date < fromEl.value) return false;
    if (toEl?.value   && m.date > toEl.value)   return false;
 
    return true;
  });
 
  if (!filtered.length) {
    container.innerHTML = `<div class="placeholder-notice">
      <span>🔍</span><p>No matches found for your filter. <button class="btn-ghost" id="clear-filters-btn">Clear filters</button></p>
    </div>`;
    document.getElementById("clear-filters-btn")?.addEventListener("click", clearFilters);
    return;
  }
 
  container.innerHTML = filtered.map(buildMatchCard).join("");
  bindFavButtons();
  LOG(`Rendered ${filtered.length} matches`);
}
 
function clearFilters() {
  state.activeFilter   = "all";
  state.scheduleSearch = "";
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.toggle("filter-btn--active", b.dataset.filter === "all"));
  const si = document.getElementById("schedule-search");
  if (si) si.value = "";
  renderMatches();
}
 
/* ═══════════════════════════════════════════════════════════════
   RENDER: TEAMS
   ═══════════════════════════════════════════════════════════════ */
function buildTeamCard(t) {
  const isFav = state.favorites.has(`team_${t.id}`);
  const img   = t.crest
    ? `<img src="${t.crest}" alt="${t.name}" class="team-card__crest" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">`
    : "";
  const flag  = `<span class="team-card__flag" ${t.crest ? 'style="display:none"' : ""}>${t.flag || "🏳️"}</span>`;
 
  return `
  <div class="team-card" data-id="${t.id}" data-group="${t.group}" data-conf="${t.conf}">
    <div class="team-card__media">${img}${flag}</div>
    <div class="team-card__info">
      <h3 class="team-card__name">${t.name}</h3>
      <span class="team-card__group">Group ${t.group}</span>
      <span class="team-card__rank">FIFA Rank: #${t.rank}</span>
    </div>
    <button class="fav-btn team-fav ${isFav ? "fav-btn--active" : ""}"
            data-key="team_${t.id}" aria-label="Favorite ${t.name}">
      ${isFav ? "★" : "☆"}
    </button>
  </div>`;
}
 
function renderTeams() {
  const container = document.getElementById("teams-container");
  if (!container) return;
 
  const q    = state.teamSearch.toLowerCase();
  const gf   = state.groupFilter;
  const cf   = state.confFilter;
 
  const filtered = state.teams.filter(t => {
    if (q  && !t.name.toLowerCase().includes(q))  return false;
    if (gf && t.group !== gf)                      return false;
    if (cf && t.conf  !== cf)                      return false;
    return true;
  });
 
  if (!filtered.length) {
    container.innerHTML = `<div class="placeholder-notice" style="grid-column:1/-1">
      <span>🔍</span><p>No teams match your search.</p>
    </div>`;
    return;
  }
 
  container.innerHTML = filtered.map(buildTeamCard).join("");
  bindFavButtons();
  LOG(`Rendered ${filtered.length} teams`);
}
 
/* ═══════════════════════════════════════════════════════════════
   RENDER: VENUES + WEATHER
   ═══════════════════════════════════════════════════════════════ */
async function renderVenues() {
  const container = document.getElementById("venues-container");
  if (!container) return;
 
  const countryFlag = { Mexico:"🇲🇽", USA:"🇺🇸", Canada:"🇨🇦" };
 
  // Show skeleton first
  container.innerHTML = state.venues.map(v => `
    <div class="venue-card" id="venue-${v.name.replace(/\s+/g,"_")}">
      <div class="venue-card__country">${countryFlag[v.country] || ""} ${v.country}</div>
      <h3 class="venue-card__name">${v.name}</h3>
      <p class="venue-card__city">${v.city}</p>
      <div class="venue-card__details">
        <span>🪑 ${v.cap}</span>
        <span>⚽ ${v.matches} matches</span>
      </div>
      <div class="venue-card__weather" id="wx-${v.name.replace(/\s+/g,"_")}">
        <span class="weather-loading">Fetching weather…</span>
      </div>
    </div>`).join("");
 
  // Fetch weather for each venue in parallel
  await Promise.allSettled(
    state.venues.map(async v => {
      const wx = await fetchWeather(v.lat, v.lon);
      const el = document.getElementById(`wx-${v.name.replace(/\s+/g,"_")}`);
      if (!el) return;
      if (wx) {
        el.innerHTML = `
          <span class="weather-emoji">${weatherCodeEmoji(wx.code)}</span>
          <span class="weather-temp">${Math.round(wx.temp)}${wx.unit}</span>
          <span class="weather-wind">💨 ${wx.wind} km/h</span>`;
      } else {
        el.innerHTML = `<span class="weather-na">Weather unavailable</span>`;
      }
    })
  );
 
  LOG("Venues rendered with weather");
}
 
/* ═══════════════════════════════════════════════════════════════
   RENDER: FAVORITES PANEL
   ═══════════════════════════════════════════════════════════════ */
function renderFavoritesPanel() {
  const el = document.getElementById("favorites-panel");
  if (!el) return;
 
  const count = state.favorites.size;
  const badge = document.getElementById("fav-count");
  if (badge) badge.textContent = count;
 
  if (count === 0) {
    el.innerHTML = `<p class="fav-empty">No favorites yet — tap ★ on any team or match!</p>`;
    return;
  }
 
  const items = [...state.favorites].map(key => {
    const [type, idStr] = key.split("_");
    const id = parseInt(idStr);
    if (type === "team") {
      const t = state.teams.find(t => t.id === id);
      return t ? `<div class="fav-item">${t.flag || "🏳️"} <strong>${t.name}</strong> <button class="fav-remove" data-key="${key}">✕</button></div>` : "";
    }
    if (type === "match") {
      const m = state.matches.find(m => m.id === id);
      return m ? `<div class="fav-item">⚽ <strong>${m.home} vs ${m.away}</strong> <small>${m.date}</small> <button class="fav-remove" data-key="${key}">✕</button></div>` : "";
    }
    return "";
  }).join("");
 
  el.innerHTML = items || `<p class="fav-empty">Saved items will appear here.</p>`;
 
  el.querySelectorAll(".fav-remove").forEach(btn => {
    btn.addEventListener("click", () => {
      toggleFavorite(btn.dataset.key);
    });
  });
}
 
/* ═══════════════════════════════════════════════════════════════
   FAVORITES TOGGLE
   ═══════════════════════════════════════════════════════════════ */
function toggleFavorite(key) {
  if (state.favorites.has(key)) {
    state.favorites.delete(key);
    LOG("Removed favorite:", key);
    showToast(`Removed from favorites`);
  } else {
    state.favorites.add(key);
    LOG("Added favorite:", key);
    showToast(`Added to favorites ★`);
  }
  saveFavorites();
 
  // Update all buttons with this key
  document.querySelectorAll(`[data-key="${key}"]`).forEach(btn => {
    const isNow = state.favorites.has(key);
    btn.classList.toggle("fav-btn--active", isNow);
    btn.textContent = isNow ? "★" : "☆";
  });
 
  renderFavoritesPanel();
  if (state.activeFilter === "favorites") renderMatches();
}
 
function bindFavButtons() {
  document.querySelectorAll(".fav-btn[data-key]").forEach(btn => {
    // Clone to remove old listeners
    const fresh = btn.cloneNode(true);
    btn.parentNode.replaceChild(fresh, btn);
    fresh.addEventListener("click", e => {
      e.stopPropagation();
      toggleFavorite(fresh.dataset.key);
    });
  });
}
 
/* ═══════════════════════════════════════════════════════════════
   TOAST NOTIFICATION
   ═══════════════════════════════════════════════════════════════ */
function showToast(msg, type = "success") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
 
  const t = document.createElement("div");
  t.className = `toast toast--${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
 
  requestAnimationFrame(() => t.classList.add("toast--show"));
  setTimeout(() => {
    t.classList.remove("toast--show");
    setTimeout(() => t.remove(), 300);
  }, 2500);
}
 
/* ═══════════════════════════════════════════════════════════════
   SEARCH + FILTER WIRING
   ═══════════════════════════════════════════════════════════════ */
function setupFilters() {
  // Schedule filter buttons
  document.querySelectorAll(".filter-btn[data-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("filter-btn--active"));
      btn.classList.add("filter-btn--active");
      state.activeFilter = btn.dataset.filter;
      renderMatches();
    });
  });
 
  // Schedule search
  const si = document.getElementById("schedule-search");
  if (si) {
    let debounce;
    si.addEventListener("input", () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        state.scheduleSearch = si.value;
        renderMatches();
      }, 250);
    });
  }
 
  // Date filters
  ["date-from","date-to"].forEach(id => {
    document.getElementById(id)?.addEventListener("change", renderMatches);
  });
  document.getElementById("date-clear")?.addEventListener("click", () => {
    ["date-from","date-to"].forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
    renderMatches();
  });
 
  // Team search
  const ts = document.getElementById("team-search");
  if (ts) {
    let debounce;
    ts.addEventListener("input", () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => { state.teamSearch = ts.value; renderTeams(); }, 250);
    });
  }
 
  // Group filter
  document.getElementById("group-filter")?.addEventListener("change", e => {
    state.groupFilter = e.target.value;
    renderTeams();
  });
 
  // Confederation filter
  document.getElementById("confederation-filter")?.addEventListener("change", e => {
    state.confFilter = e.target.value;
    renderTeams();
  });
}
 
/* ═══════════════════════════════════════════════════════════════
   NAV: scroll spy + hamburger
   ═══════════════════════════════════════════════════════════════ */
function setupNav() {
  const nav = document.querySelector(".nav");
 
  // Sticky background on scroll
  window.addEventListener("scroll", () => {
    nav?.classList.toggle("nav--scrolled", window.scrollY > 60);
  }, { passive: true });
 
  // Hamburger
  document.querySelector(".nav__hamburger")?.addEventListener("click", () => {
    document.querySelector(".nav__links")?.classList.toggle("nav__links--open");
  });
 
  // Smooth scroll for nav links
  document.querySelectorAll(".nav__links a[href^='#']").forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      document.querySelector(a.getAttribute("href"))?.scrollIntoView({ behavior:"smooth" });
      document.querySelector(".nav__links")?.classList.remove("nav__links--open");
    });
  });
}
 
/* ═══════════════════════════════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════════════════════════════ */
function setupScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
 
  document.querySelectorAll(".section, .stat-card, .venue-card").forEach(el => {
    el.classList.add("reveal");
    observer.observe(el);
  });
}
 
/* ═══════════════════════════════════════════════════════════════
   FAVORITES DRAWER TOGGLE
   ═══════════════════════════════════════════════════════════════ */
function setupFavoritesDrawer() {
  const toggle = document.getElementById("fav-drawer-toggle");
  const drawer = document.getElementById("fav-drawer");
  const close  = document.getElementById("fav-drawer-close");
 
  toggle?.addEventListener("click", () => {
    drawer?.classList.toggle("fav-drawer--open");
    renderFavoritesPanel();
  });
  close?.addEventListener("click", () => {
    drawer?.classList.remove("fav-drawer--open");
  });
}
 
/* ═══════════════════════════════════════════════════════════════
   COUNTDOWN TIMER
   ═══════════════════════════════════════════════════════════════ */
function setupCountdown() {
  const target = new Date("2026-06-11T11:00:00-06:00"); // Mexico City kickoff
  const el     = document.getElementById("countdown");
  if (!el) return;
 
  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) { el.textContent = "The World Cup has begun! ⚽"; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.innerHTML = `<span>${d}<em>d</em></span><span>${h}<em>h</em></span><span>${m}<em>m</em></span><span>${s}<em>s</em></span>`;
  }
 
  tick();
  setInterval(tick, 1000);
  LOG("Countdown timer started — target:", target.toUTCString());
}
 
/* ═══════════════════════════════════════════════════════════════
   API STATUS INDICATOR
   ═══════════════════════════════════════════════════════════════ */
function setAPIStatus(label, ok) {
  const el = document.getElementById("api-status");
  if (!el) return;
  el.textContent = label;
  el.className   = `api-status ${ok ? "api-status--ok" : "api-status--warn"}`;
}
 
/* ═══════════════════════════════════════════════════════════════
   INIT — main entry point
   ═══════════════════════════════════════════════════════════════ */
async function init() {
  LOG("App initializing…");
  recordLastVisit();
  loadFavorites();
 
  // Boot UI
  renderTicker();
  setupNav();
  setupFilters();
  setupFavoritesDrawer();
  setupCountdown();
 
  // -- MATCHES --
  setAPIStatus("Fetching matches…", true);
  const apiMatches = await fetchMatchesFromAPI();
  state.matches = apiMatches || FALLBACK_MATCHES;
  setAPIStatus(
    apiMatches ? `✓ Live data — ${state.matches.length} matches` : "⚠ Demo data (add API key)",
    !!apiMatches
  );
  renderMatches();
 
  // -- TEAMS --
  const apiTeams = await fetchTeamsFromAPI();
  state.teams = apiTeams || FALLBACK_TEAMS;
  renderTeams();
 
  // -- VENUES + WEATHER --
  await renderVenues();
 
  // -- SCROLL REVEAL --
  setupScrollReveal();
 
  LOG("App ready. Favorites:", [...state.favorites]);
  console.groupCollapsed("%c[WC26] localStorage snapshot", "color:#3d6fff;font-weight:bold");
  console.table({
    favorites  : JSON.stringify([...state.favorites]),
    lastVisit  : lsGet(LS.LAST_VISIT),
    cachedItems: Object.keys(localStorage).filter(k => k.startsWith(LS.CACHE_PFX)).length,
  });
  console.groupEnd();
}
 
// Kick off when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
 

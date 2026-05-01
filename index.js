"use strict";
 
/* ═══════════════════════════════════════════════════
   FIFA WORLD CUP 2026 — index.js
   All match, team, venue & stats data is hardcoded.
   Features:
     • Dynamic rendering of all sections
     • Filter buttons (All / Group / Knockout / Favorites)
     • Live search for matches and teams
     • Group & confederation dropdowns
     • ★ Favorites saved to localStorage
     • Last-visited section tracked in localStorage
     • Scroll-reveal animations via IntersectionObserver
     • Sticky nav + mobile hamburger
     • Toast notifications
     • Animated ticker
     • Console logging throughout for browser DevTools
═══════════════════════════════════════════════════ */
 
/* ─────────────────────────────────────
   DATA — MATCHES
───────────────────────────────────── */
const MATCHES = [
  // ── GROUP STAGE ──
  {
    id: 1, type: "group", label: "Opening Match",
    date: "2026-06-11", time: "11:00 AM",
    home: { name: "Mexico",        code: "MEX", flag: "🇲🇽" },
    away: { name: "Argentina",     code: "ARG", flag: "🇦🇷" },
    venue: "Estadio Azteca, Mexico City", status: "upcoming",
  },
  {
    id: 2, type: "group", label: "Group Stage",
    date: "2026-06-11", time: "2:00 PM",
    home: { name: "United States", code: "USA", flag: "🇺🇸" },
    away: { name: "Brazil",        code: "BRA", flag: "🇧🇷" },
    venue: "SoFi Stadium, Los Angeles", status: "upcoming",
  },
  {
    id: 3, type: "group", label: "Group Stage",
    date: "2026-06-12", time: "3:00 PM",
    home: { name: "Canada",        code: "CAN", flag: "🇨🇦" },
    away: { name: "Portugal",      code: "POR", flag: "🇵🇹" },
    venue: "BC Place, Vancouver", status: "upcoming",
  },
  {
    id: 4, type: "group", label: "Group Stage",
    date: "2026-06-13", time: "5:00 PM",
    home: { name: "France",        code: "FRA", flag: "🇫🇷" },
    away: { name: "Germany",       code: "GER", flag: "🇩🇪" },
    venue: "AT&T Stadium, Dallas", status: "upcoming",
  },
  {
    id: 5, type: "group", label: "Group Stage",
    date: "2026-06-14", time: "6:00 PM",
    home: { name: "Spain",         code: "ESP", flag: "🇪🇸" },
    away: { name: "England",       code: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    venue: "Rose Bowl, Pasadena", status: "upcoming",
  },
  {
    id: 6, type: "group", label: "Group Stage",
    date: "2026-06-15", time: "4:00 PM",
    home: { name: "Netherlands",   code: "NED", flag: "🇳🇱" },
    away: { name: "Italy",         code: "ITA", flag: "🇮🇹" },
    venue: "MetLife Stadium, New York", status: "upcoming",
  },
  {
    id: 7, type: "group", label: "Group Stage",
    date: "2026-06-16", time: "3:00 PM",
    home: { name: "Uruguay",       code: "URU", flag: "🇺🇾" },
    away: { name: "Colombia",      code: "COL", flag: "🇨🇴" },
    venue: "Levi's Stadium, San Francisco", status: "upcoming",
  },
  {
    id: 8, type: "group", label: "Group Stage",
    date: "2026-06-17", time: "5:00 PM",
    home: { name: "Japan",         code: "JPN", flag: "🇯🇵" },
    away: { name: "Morocco",       code: "MAR", flag: "🇲🇦" },
    venue: "Arrowhead Stadium, Kansas City", status: "upcoming",
  },
  {
    id: 9, type: "group", label: "Group Stage",
    date: "2026-06-18", time: "7:00 PM",
    home: { name: "Belgium",       code: "BEL", flag: "🇧🇪" },
    away: { name: "Croatia",       code: "CRO", flag: "🇭🇷" },
    venue: "Gillette Stadium, Boston", status: "upcoming",
  },
  {
    id: 10, type: "group", label: "Group Stage",
    date: "2026-06-20", time: "4:00 PM",
    home: { name: "Senegal",       code: "SEN", flag: "🇸🇳" },
    away: { name: "South Korea",   code: "KOR", flag: "🇰🇷" },
    venue: "NRG Stadium, Houston", status: "upcoming",
  },
  // ── KNOCKOUT ──
  {
    id: 11, type: "knockout", label: "Round of 16",
    date: "2026-07-04", time: "3:00 PM",
    home: { name: "1st Group A",   code: "G-A1", flag: "🏆" },
    away: { name: "2nd Group B",   code: "G-B2", flag: "🏆" },
    venue: "MetLife Stadium, New York", status: "upcoming",
  },
  {
    id: 12, type: "knockout", label: "Quarter-Final",
    date: "2026-07-10", time: "6:00 PM",
    home: { name: "QF Winner 1",   code: "QF1",  flag: "🏆" },
    away: { name: "QF Winner 2",   code: "QF2",  flag: "🏆" },
    venue: "SoFi Stadium, Los Angeles", status: "upcoming",
  },
  {
    id: 13, type: "knockout", label: "Semi-Final",
    date: "2026-07-14", time: "7:00 PM",
    home: { name: "SF Winner 1",   code: "SF1",  flag: "🏆" },
    away: { name: "SF Winner 2",   code: "SF2",  flag: "🏆" },
    venue: "AT&T Stadium, Dallas", status: "upcoming",
  },
  {
    id: 14, type: "knockout", label: "🏆 FINAL",
    date: "2026-07-19", time: "6:00 PM",
    home: { name: "Finalist 1",    code: "F1",   flag: "🏆" },
    away: { name: "Finalist 2",    code: "F2",   flag: "🏆" },
    venue: "MetLife Stadium, New York", status: "upcoming",
  },
];
 
/* ─────────────────────────────────────
   DATA — TEAMS
───────────────────────────────────── */
const TEAMS = [
  { name: "Argentina",     code: "ARG", flag: "🇦🇷", group: "A", conf: "CONMEBOL", rank: 1,  titles: 3 },
  { name: "France",        code: "FRA", flag: "🇫🇷", group: "B", conf: "UEFA",     rank: 2,  titles: 2 },
  { name: "Brazil",        code: "BRA", flag: "🇧🇷", group: "C", conf: "CONMEBOL", rank: 5,  titles: 5 },
  { name: "England",       code: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "D", conf: "UEFA",     rank: 4,  titles: 1 },
  { name: "Portugal",      code: "POR", flag: "🇵🇹", group: "A", conf: "UEFA",     rank: 6,  titles: 0 },
  { name: "Spain",         code: "ESP", flag: "🇪🇸", group: "B", conf: "UEFA",     rank: 7,  titles: 1 },
  { name: "Netherlands",   code: "NED", flag: "🇳🇱", group: "C", conf: "UEFA",     rank: 8,  titles: 0 },
  { name: "Germany",       code: "GER", flag: "🇩🇪", group: "D", conf: "UEFA",     rank: 16, titles: 4 },
  { name: "Mexico",        code: "MEX", flag: "🇲🇽", group: "E", conf: "CONCACAF", rank: 15, titles: 0 },
  { name: "United States", code: "USA", flag: "🇺🇸", group: "E", conf: "CONCACAF", rank: 13, titles: 0 },
  { name: "Canada",        code: "CAN", flag: "🇨🇦", group: "F", conf: "CONCACAF", rank: 47, titles: 0 },
  { name: "Belgium",       code: "BEL", flag: "🇧🇪", group: "F", conf: "UEFA",     rank: 3,  titles: 0 },
  { name: "Uruguay",       code: "URU", flag: "🇺🇾", group: "G", conf: "CONMEBOL", rank: 18, titles: 2 },
  { name: "Colombia",      code: "COL", flag: "🇨🇴", group: "G", conf: "CONMEBOL", rank: 11, titles: 0 },
  { name: "Italy",         code: "ITA", flag: "🇮🇹", group: "H", conf: "UEFA",     rank: 10, titles: 4 },
  { name: "Croatia",       code: "CRO", flag: "🇭🇷", group: "H", conf: "UEFA",     rank: 12, titles: 0 },
  { name: "Japan",         code: "JPN", flag: "🇯🇵", group: "I", conf: "AFC",      rank: 17, titles: 0 },
  { name: "South Korea",   code: "KOR", flag: "🇰🇷", group: "I", conf: "AFC",      rank: 22, titles: 0 },
  { name: "Morocco",       code: "MAR", flag: "🇲🇦", group: "J", conf: "CAF",      rank: 14, titles: 0 },
  { name: "Senegal",       code: "SEN", flag: "🇸🇳", group: "J", conf: "CAF",      rank: 20, titles: 0 },
];
 
/* ─────────────────────────────────────
   DATA — VENUES
───────────────────────────────────── */
const VENUES = [
  { name: "MetLife Stadium",   city: "New York / New Jersey", country: "🇺🇸 USA",     capacity: "82,500", matches: 8,  note: "Hosts the Final"         },
  { name: "Estadio Azteca",    city: "Mexico City",           country: "🇲🇽 Mexico",   capacity: "87,523", matches: 6,  note: "Opening Match venue"     },
  { name: "SoFi Stadium",      city: "Los Angeles",           country: "🇺🇸 USA",     capacity: "70,240", matches: 7,  note: "Iconic LA venue"         },
  { name: "AT&T Stadium",      city: "Dallas",                country: "🇺🇸 USA",     capacity: "80,000", matches: 6,  note: "Hosts a Semi-Final"      },
  { name: "Rose Bowl",         city: "Pasadena",              country: "🇺🇸 USA",     capacity: "88,565", matches: 6,  note: "Legendary stadium"       },
  { name: "BC Place",          city: "Vancouver",             country: "🇨🇦 Canada",   capacity: "54,500", matches: 6,  note: "Canada's main venue"     },
  { name: "BMO Field",         city: "Toronto",               country: "🇨🇦 Canada",   capacity: "45,000", matches: 5,  note: "Toronto's soccer home"   },
  { name: "Gillette Stadium",  city: "Boston",                country: "🇺🇸 USA",     capacity: "65,878", matches: 5,  note: "New England powerhouse"  },
  { name: "Levi's Stadium",    city: "San Francisco",         country: "🇺🇸 USA",     capacity: "68,500", matches: 5,  note: "Bay Area showcase"       },
  { name: "NRG Stadium",       city: "Houston",               country: "🇺🇸 USA",     capacity: "72,220", matches: 5,  note: "Domed retractable roof"  },
  { name: "Arrowhead Stadium", city: "Kansas City",           country: "🇺🇸 USA",     capacity: "76,416", matches: 5,  note: "Loudest stadium in NFL"  },
  { name: "Empower Field",     city: "Denver",                country: "🇺🇸 USA",     capacity: "76,125", matches: 5,  note: "Mile-high altitude"      },
];
 
/* ─────────────────────────────────────
   DATA — STATS
───────────────────────────────────── */
const TOP_SCORERS = [
  { name: "Miroslav Klose",  country: "Germany",   goals: 16, flag: "🇩🇪" },
  { name: "Ronaldo",         country: "Brazil",    goals: 15, flag: "🇧🇷" },
  { name: "Gerd Müller",     country: "Germany",   goals: 14, flag: "🇩🇪" },
  { name: "Just Fontaine",   country: "France",    goals: 13, flag: "🇫🇷" },
  { name: "Pelé",            country: "Brazil",    goals: 12, flag: "🇧🇷" },
  { name: "Lionel Messi",    country: "Argentina", goals: 13, flag: "🇦🇷" },
  { name: "Sándor Kocsis",   country: "Hungary",   goals: 11, flag: "🇭🇺" },
  { name: "Jürgen Klinsmann",country: "Germany",   goals: 11, flag: "🇩🇪" },
];
 
const WINNERS = [
  { year: 2022, team: "Argentina", flag: "🇦🇷", runner: "France"    },
  { year: 2018, team: "France",    flag: "🇫🇷", runner: "Croatia"   },
  { year: 2014, team: "Germany",   flag: "🇩🇪", runner: "Argentina" },
  { year: 2010, team: "Spain",     flag: "🇪🇸", runner: "Netherlands"},
  { year: 2006, team: "Italy",     flag: "🇮🇹", runner: "France"    },
  { year: 2002, team: "Brazil",    flag: "🇧🇷", runner: "Germany"   },
  { year: 1998, team: "France",    flag: "🇫🇷", runner: "Brazil"    },
  { year: 1994, team: "Brazil",    flag: "🇧🇷", runner: "Italy"     },
];
 
const GROUP_A_STANDINGS = [
  { team: "Argentina", flag: "🇦🇷", p: 3, w: 3, d: 0, l: 0, gf: 8, ga: 2, pts: 9 },
  { team: "Portugal",  flag: "🇵🇹", p: 3, w: 2, d: 0, l: 1, gf: 5, ga: 4, pts: 6 },
  { team: "Mexico",    flag: "🇲🇽", p: 3, w: 1, d: 0, l: 2, gf: 3, ga: 5, pts: 3 },
  { team: "Canada",    flag: "🇨🇦", p: 3, w: 0, d: 0, l: 3, gf: 1, ga: 6, pts: 0 },
];
 
const TICKER_ITEMS = [
  "🏆 FIFA World Cup 2026 — June 11 to July 19",
  "⚽ Opening match: Mexico vs Argentina at Estadio Azteca",
  "🏟️ Final hosted at MetLife Stadium, New York — July 19",
  "🌍 48 nations compete for the first time in history",
  "🇦🇷 Argentina enter as defending World Cup champions",
  "🇧🇷 Brazil chasing a record 6th World Cup title",
  "📅 Group stage: June 11 – July 2 · Knockouts from July 4",
  "🔥 First ever three-nation co-hosted World Cup",
];
 
/* ─────────────────────────────────────
   STATE
───────────────────────────────────── */
const state = {
  activeFilter: "all",
  matchSearch:  "",
  teamSearch:   "",
  groupFilter:  "",
  confFilter:   "",
  favorites:    new Set(),
};
 
/* ─────────────────────────────────────
   LOCALSTORAGE
───────────────────────────────────── */
function saveFavorites() {
  localStorage.setItem("wc26_favorites", JSON.stringify([...state.favorites]));
  console.log("[localStorage] Favorites saved:", [...state.favorites]);
}
 
function loadFavorites() {
  try {
    const raw = localStorage.getItem("wc26_favorites");
    if (raw) {
      state.favorites = new Set(JSON.parse(raw));
      console.log("[localStorage] Favorites loaded:", [...state.favorites]);
    }
  } catch (e) {
    console.error("[localStorage] Failed to load favorites:", e);
  }
}
 
function trackVisit(sectionId) {
  try {
    const raw   = localStorage.getItem("wc26_visits") || "{}";
    const visits = JSON.parse(raw);
    visits[sectionId] = (visits[sectionId] || 0) + 1;
    localStorage.setItem("wc26_visits", JSON.stringify(visits));
    console.log(`[localStorage] Section "${sectionId}" visited ${visits[sectionId]}x`);
  } catch (e) {
    console.warn("[localStorage] visit tracking failed:", e);
  }
}
 
/* ─────────────────────────────────────
   TOAST
───────────────────────────────────── */
function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("toast--visible");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove("toast--visible"), 2800);
}
 
/* ─────────────────────────────────────
   RENDER — MATCHES
───────────────────────────────────── */
function getFilteredMatches() {
  let list = [...MATCHES];
 
  if (state.activeFilter === "group")     list = list.filter(m => m.type === "group");
  if (state.activeFilter === "knockout")  list = list.filter(m => m.type === "knockout");
  if (state.activeFilter === "favorites") {
    list = list.filter(m =>
      state.favorites.has(m.home.code) || state.favorites.has(m.away.code)
    );
  }
 
  const q = state.matchSearch.toLowerCase();
  if (q) {
    list = list.filter(m =>
      m.home.name.toLowerCase().includes(q) ||
      m.away.name.toLowerCase().includes(q) ||
      m.venue.toLowerCase().includes(q)
    );
  }
 
  return list;
}
 
function renderMatches() {
  const container = document.getElementById("matches-container");
  if (!container) return;
 
  const list = getFilteredMatches();
 
  if (list.length === 0) {
    container.innerHTML = `<div class="empty-state"><span>⚽</span><p>No matches found. Try a different filter.</p></div>`;
    return;
  }
 
  container.innerHTML = list.map((m, i) => {
    const isOpening = m.label === "Opening Match";
    const isFinal   = m.label === "🏆 FINAL";
    const extraClass = isOpening ? "match-card--opening" : isFinal ? "match-card--final" : "";
    const badgeClass = m.type === "knockout" ? "badge--knockout" : isOpening ? "badge--opening" : "badge--group";
 
    return `
    <div class="match-card ${extraClass} reveal" style="--delay:${i * 0.06}s">
      <div class="match-card__top">
        <span class="badge ${badgeClass}">${m.label}</span>
        <span class="match-card__meta-info">📅 ${m.date} &nbsp; 🕐 ${m.time}</span>
        <span class="match-card__venue">📍 ${m.venue}</span>
      </div>
      <div class="match-card__fixture">
        <div class="fixture-team">
          <span class="fixture-flag">${m.home.flag}</span>
          <span class="fixture-code">${m.home.code}</span>
          <span class="fixture-name">${m.home.name}</span>
        </div>
        <div class="fixture-center">
          <span class="vs">VS</span>
          <span class="status status--${m.status}">${m.status === "live" ? "🔴 LIVE" : m.status === "finished" ? "Full Time" : "Upcoming"}</span>
        </div>
        <div class="fixture-team fixture-team--right">
          <span class="fixture-flag">${m.away.flag}</span>
          <span class="fixture-code">${m.away.code}</span>
          <span class="fixture-name">${m.away.name}</span>
        </div>
      </div>
    </div>`;
  }).join("");
 
  observeReveal();
  console.log(`[Matches] Rendered ${list.length} matches (filter: "${state.activeFilter}")`);
}
 
/* ─────────────────────────────────────
   RENDER — TEAMS
───────────────────────────────────── */
function getFilteredTeams() {
  let list = [...TEAMS];
 
  const q = state.teamSearch.toLowerCase();
  if (q)                 list = list.filter(t => t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q));
  if (state.groupFilter) list = list.filter(t => t.group === state.groupFilter);
  if (state.confFilter)  list = list.filter(t => t.conf  === state.confFilter);
 
  return list;
}
 
function renderTeams() {
  const container = document.getElementById("teams-container");
  if (!container) return;
 
  const list = getFilteredTeams();
 
  if (list.length === 0) {
    container.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><span>🏳️</span><p>No teams found.</p></div>`;
    return;
  }
 
  container.innerHTML = list.map((t, i) => {
    const fav = state.favorites.has(t.code);
    return `
    <div class="team-card ${fav ? "team-card--fav" : ""} reveal" style="--delay:${i * 0.05}s">
      <button class="fav-btn ${fav ? "fav-btn--active" : ""}"
              onclick="toggleFavorite('${t.code}', '${t.name}')"
              title="${fav ? "Remove from favorites" : "Add to favorites"}">
        ${fav ? "★" : "☆"}
      </button>
      <div class="team-card__flag">${t.flag}</div>
      <div class="team-card__body">
        <h3 class="team-card__name">${t.name}</h3>
        <div class="team-card__tags">
          <span class="tag tag--group">Group ${t.group}</span>
          <span class="tag tag--conf">${t.conf}</span>
        </div>
        <div class="team-card__stats">
          <span>FIFA #${t.rank}</span>
          <span>${t.titles > 0 ? `🏆 ${t.titles} title${t.titles > 1 ? "s" : ""}` : "0 titles"}</span>
        </div>
      </div>
    </div>`;
  }).join("");
 
  observeReveal();
  updateFavBadge();
  console.log(`[Teams] Rendered ${list.length} teams`);
}
 
function toggleFavorite(code, name) {
  if (state.favorites.has(code)) {
    state.favorites.delete(code);
    showToast(`Removed ${name} from favorites`);
    console.log(`[Favorites] Removed: ${code}`);
  } else {
    state.favorites.add(code);
    showToast(`⭐ ${name} added to favorites!`);
    console.log(`[Favorites] Added: ${code}`);
  }
  saveFavorites();
  renderTeams();
  renderMatches(); // re-render matches so favorites filter updates
}
 
function updateFavBadge() {
  const badge = document.getElementById("fav-badge");
  if (badge) badge.textContent = state.favorites.size > 0 ? `(${state.favorites.size})` : "";
}
 
/* ─────────────────────────────────────
   RENDER — VENUES
───────────────────────────────────── */
function renderVenues() {
  const container = document.getElementById("venues-container");
  if (!container) return;
 
  container.innerHTML = VENUES.map((v, i) => `
    <div class="venue-card reveal" style="--delay:${i * 0.07}s">
      <div class="venue-card__country">${v.country}</div>
      <h3 class="venue-card__name">${v.name}</h3>
      <p class="venue-card__city">${v.city}</p>
      <div class="venue-card__row">
        <span>🪑 ${v.capacity}</span>
        <span>⚽ ${v.matches} matches</span>
      </div>
      <div class="venue-card__note">${v.note}</div>
    </div>`
  ).join("");
 
  observeReveal();
  console.log(`[Venues] Rendered ${VENUES.length} venues`);
}
 
/* ─────────────────────────────────────
   RENDER — STATS
───────────────────────────────────── */
function renderStats() {
  // Top Scorers
  const scorersList = document.getElementById("scorers-list");
  if (scorersList) {
    scorersList.innerHTML = TOP_SCORERS.map((s, i) => `
      <div class="stats-row">
        <span class="stats-row__rank">${i + 1}</span>
        <span class="stats-row__flag">${s.flag}</span>
        <span class="stats-row__name">${s.name}</span>
        <span class="stats-row__val">${s.goals} goals</span>
      </div>`
    ).join("");
  }
 
  // Winners
  const winnersList = document.getElementById("winners-list");
  if (winnersList) {
    winnersList.innerHTML = WINNERS.map(w => `
      <div class="stats-row">
        <span class="stats-row__rank">${w.year}</span>
        <span class="stats-row__flag">${w.flag}</span>
        <span class="stats-row__name">${w.team}</span>
        <span class="stats-row__val muted">vs ${w.runner}</span>
      </div>`
    ).join("");
  }
 
  // Standings table
  const table = document.getElementById("standings-table");
  if (table) {
    table.innerHTML = `
      <thead>
        <tr>
          <th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th>
          <th>GF</th><th>GA</th><th>GD</th><th>Pts</th>
        </tr>
      </thead>
      <tbody>
        ${GROUP_A_STANDINGS.map((r, i) => `
          <tr class="${i < 2 ? "tr--qualify" : ""}">
            <td>${i + 1}</td>
            <td><span class="table-flag">${r.flag}</span> ${r.team}</td>
            <td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td>
            <td>${r.gf}</td><td>${r.ga}</td><td>${r.gf - r.ga}</td>
            <td><strong>${r.pts}</strong></td>
          </tr>`
        ).join("")}
      </tbody>`;
  }
 
  console.log("[Stats] Rendered scorers, winners, standings");
}
 
/* ─────────────────────────────────────
   TICKER
───────────────────────────────────── */
function initTicker() {
  const inner = document.getElementById("ticker-inner");
  if (!inner) return;
  // Double the list for seamless infinite loop
  const msgs = [...TICKER_ITEMS, ...TICKER_ITEMS];
  inner.innerHTML = msgs.map(m => `<span class="ticker-item">${m}</span>`).join("");
}
 
/* ─────────────────────────────────────
   FILTERS & SEARCH EVENTS
───────────────────────────────────── */
function initControls() {
  // Filter buttons
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.activeFilter = btn.dataset.filter;
      renderMatches();
      console.log(`[Filter] Active: "${state.activeFilter}"`);
    });
  });
 
  // Match search
  const matchSearch = document.getElementById("match-search");
  if (matchSearch) {
    matchSearch.addEventListener("input", debounce(() => {
      state.matchSearch = matchSearch.value;
      renderMatches();
    }, 200));
  }
 
  // Team search
  const teamSearch = document.getElementById("team-search");
  if (teamSearch) {
    teamSearch.addEventListener("input", debounce(() => {
      state.teamSearch = teamSearch.value;
      renderTeams();
    }, 200));
  }
 
  // Group dropdown — populate dynamically
  const groupSelect = document.getElementById("group-filter");
  if (groupSelect) {
    const groups = [...new Set(TEAMS.map(t => t.group))].sort();
    groups.forEach(g => {
      const opt = document.createElement("option");
      opt.value = g;
      opt.textContent = `Group ${g}`;
      groupSelect.appendChild(opt);
    });
    groupSelect.addEventListener("change", () => {
      state.groupFilter = groupSelect.value;
      renderTeams();
    });
  }
 
  // Confederation dropdown
  const confSelect = document.getElementById("conf-filter");
  if (confSelect) {
    confSelect.addEventListener("change", () => {
      state.confFilter = confSelect.value;
      renderTeams();
    });
  }
}
 
/* ─────────────────────────────────────
   NAV — STICKY + MOBILE
───────────────────────────────────── */
function initNav() {
  // Sticky on scroll
  const nav = document.getElementById("main-nav");
  if (nav) {
    window.addEventListener("scroll", () => {
      nav.classList.toggle("nav--scrolled", window.scrollY > 60);
    }, { passive: true });
  }
 
  // Hamburger
  const hamburger = document.getElementById("hamburger");
  const navLinks   = document.getElementById("nav-links");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      hamburger.textContent = navLinks.classList.contains("open") ? "✕" : "☰";
    });
    // Close on link click
    navLinks.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        hamburger.textContent = "☰";
      });
    });
  }
}
 
/* ─────────────────────────────────────
   SCROLL-REVEAL (IntersectionObserver)
───────────────────────────────────── */
function observeReveal() {
  const els = document.querySelectorAll(".reveal:not(.revealed)");
  if (!els.length) return;
 
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
 
  els.forEach(el => io.observe(el));
}
 
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        trackVisit(e.target.id);
        document.querySelectorAll(".nav__links a").forEach(a => {
          a.classList.toggle("active-link", a.getAttribute("href") === `#${e.target.id}`);
        });
      }
    });
  }, { threshold: 0.25 });
 
  sections.forEach(s => io.observe(s));
}
 
/* ─────────────────────────────────────
   UTILITY
───────────────────────────────────── */
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
 
/* ─────────────────────────────────────
   BOOT
───────────────────────────────────── */
function init() {
  console.log("🏆 [WC26] Initializing app…");
 
  loadFavorites();
  initNav();
  initTicker();
  initControls();
  initScrollSpy();
 
  renderMatches();
  renderTeams();
  renderVenues();
  renderStats();
 
  // Initial scroll-reveal for static cards
  setTimeout(observeReveal, 100);
 
  console.log("✅ [WC26] App ready!");
  console.log(`   📋 Matches: ${MATCHES.length} | Teams: ${TEAMS.length} | Venues: ${VENUES.length}`);
  console.log(`   ⭐ Favorites in localStorage: ${[...state.favorites]}`);
  console.log("   💾 localStorage keys:", Object.keys(localStorage).filter(k => k.startsWith("wc26")));
}
 
document.addEventListener("DOMContentLoaded", init);
 
// Shared header, footer and small behaviours for every page.
// ponytail: header/footer are injected by script so they live in one place. Move to a build step if search engines need the nav in the HTML.
const REAL = 'https://investablefoundation.org'; // pages not rebuilt yet still live here
const NAV = [
  ['Programmes', '/programmes'], ['Mentorship', '/mentorship'], ['Market access', '/market-access'],
  ['Partner', '/partner'], ['About', '/about'], ['Governance', '/governance'],
];
const here = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
const DONATE = REAL + '/donate';
const LOGO = REAL + '/assets/logo-inverted-web.png';

const header = document.getElementById('site-header');
if (header) header.innerHTML = `
  <div class="wrap">
    <a href="/"><img src="${LOGO}" alt="Investable Foundation NPC, home" width="139" height="44" /></a>
    <button class="menu-btn" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav id="site-nav" aria-label="Main">
      ${NAV.map(([t, h]) => `<a href="${h}"${h === here ? ' aria-current="page"' : ''}>${t}</a>`).join('')}
    </nav>
    <a class="btn btn-gold" href="${DONATE}">Donate</a>
  </div>`;

const menuBtn = document.querySelector('.menu-btn');
if (menuBtn) menuBtn.addEventListener('click', () => {
  const open = menuBtn.getAttribute('aria-expanded') !== 'true';
  menuBtn.setAttribute('aria-expanded', open);
  document.getElementById('site-nav').classList.toggle('open', open);
});

const footer = document.getElementById('site-footer');
if (footer) footer.innerHTML = `
  <div class="wrap">
    <div class="top">
      <h2>Turn potential into a paying customer.</h2>
      <div class="actions">
        <a class="btn btn-gold" href="${DONATE}">Donate</a>
        <a class="btn btn-line" href="${REAL}/contact">Contact us</a>
      </div>
    </div>
    <div class="meta">
      <div>
        <img src="${LOGO}" alt="Investable Foundation NPC" width="151" height="48" loading="lazy" />
        <p>South African nonprofit company. Registered NPO. SARS-approved PBO with Section 18A status.</p>
        <p>NPC 2026/031990/08, NPO 334-886-NPO, PBO 930089484</p>
      </div>
      <div>
        <p>Remote first. 19th Avenue, Centurion, Gauteng, South Africa.</p>
        <p><a href="mailto:hello@investablefoundation.org">hello@investablefoundation.org</a></p>
        <p class="foot-nav">${NAV.map(([t, h]) => `<a href="${h}">${t}</a>`).join('')}</p>
      </div>
    </div>
  </div>`;

// Home: "Where are you starting from?" tabs. Click or arrow keys.
const tabs = [...document.querySelectorAll('[role=tab]')];
function selectTab(tab) {
  tabs.forEach(t => {
    const on = t === tab;
    t.setAttribute('aria-selected', on);
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
  });
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => selectTab(t));
  t.addEventListener('keydown', e => {
    const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    const next = tabs[(i + d + tabs.length) % tabs.length];
    selectTab(next); next.focus();
  });
});

// Home: LeaderEx seats. 12 planned, 36 came.
const seats = document.getElementById('seats');
if (seats) seats.innerHTML = Array.from({ length: 36 }, (_, i) => `<i class="${i < 12 ? 'planned' : ''}"></i>`).join('');

// ---------- v2: faces, ticker, video and movement ----------
const TEAM = [
  ['keshni', 'Keshni Morar', 'CEO and Executive Director', 'https://linkedin.com/in/keshni-morar'],
  ['johann', 'Johann Ungerer', 'CTO', 'https://www.linkedin.com/in/johannungerer/'],
  ['pommie', 'Pommie Lutchman', 'Entrepreneur in Residence', 'https://www.linkedin.com/in/pommielutchman/'],
  ['maushami', 'Maushami Chetty', 'Lawyer', 'https://www.linkedin.com/in/maushami-chetty-03529b60/'],
  ['ashlin', 'Ashlin Govender', 'Sales Strategy and GTM', 'https://www.linkedin.com/in/ashlingovender30/'],
  ['lily', 'Lily Makaleng', 'Programme Manager and Success Manager', 'https://www.linkedin.com/in/lilymakaleng/'],
  ['john', 'John Zabula', 'Success Manager', 'https://www.linkedin.com/in/john-zabula/'],
  ['victoria', 'Victoria Odimba', 'Success Manager and Social Media Manager', 'https://www.linkedin.com/in/victoriaodimba/'],
];
const photo = id => `${REAL}/assets/team-${id}.jpg`;
const team = document.getElementById('team');
if (team) team.innerHTML = TEAM.map(([id, name, role, link]) =>
  `<li><figure><img src="${photo(id)}" alt="${name}" loading="lazy" /></figure><b>${name}</b><span>${role}</span><a href="${link}">LinkedIn</a></li>`).join('');
const mini = document.getElementById('faces-mini');
if (mini) mini.innerHTML = TEAM.slice(0, 5).map(([id]) => `<img src="${photo(id)}" alt="" />`).join('');

// Ticker under the hero: countries on the home page, track record everywhere else.
const hero = document.querySelector('.hero');
if (hero) {
  const words = hero.classList.contains('inner')
    ? ['Delivering since 2020', '9 cohorts', '300+ founders supported', '90+ alumni', '150+ mentors', '13 African countries']
    : ['South Africa', 'Angola', 'Botswana', 'Egypt', 'Kenya', 'Mauritania', 'Mauritius', 'Mozambique', 'Nigeria', 'Rwanda', 'Tanzania', 'Tunisia', 'Uganda'];
  const run = words.map(w => `<span>${w}</span>`).join('');
  hero.insertAdjacentHTML('afterend', `<div class="ticker" aria-hidden="true"><div>${run}${run}${run}${run}</div></div>`);
}

// Video: load YouTube only when someone presses play.
const player = document.querySelector('.player');
if (player) player.addEventListener('click', () => {
  player.outerHTML = `<div class="player"><iframe style="opacity:1" src="https://www.youtube-nocookie.com/embed/${player.dataset.video}?autoplay=1" title="Demo Day video" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe></div>`;
});

if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('motion');

  // Home headline cycles through the three pathways.
  const swaps = [...document.querySelectorAll('.swap')];
  let turn = 0;
  if (swaps.length) setInterval(() => {
    turn++;
    swaps.forEach(s => {
      const w = s.dataset.words.split('|');
      s.textContent = w[turn % w.length];
      s.classList.remove('go'); void s.offsetWidth; s.classList.add('go');
    });
  }, 2800);

  // Numbers count up from zero the first time they are seen.
  function countUp(el) {
    const m = el.textContent.match(/^(\d+)(.*)$/);
    if (!m || +m[1] > 1000) return; // leave years alone
    const end = +m[1], t0 = performance.now();
    (function tick(t) {
      const p = Math.min((t - t0) / 1400, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + m[2];
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  // Things slide in as you scroll to them.
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const el = e.target;
    if (el.matches('.stats b, .nums b')) return countUp(el);
    const i = [...el.parentNode.children].indexOf(el);
    const wait = el.matches('.seats') ? 0 : Math.min(i, 6) * 90;
    setTimeout(() => el.classList.add('in'), wait);
    // Drop the reveal classes afterwards so hover effects take over.
    if (el.matches('.rv')) setTimeout(() => el.classList.remove('rv', 'in'), wait + 900);
  }), { threshold: 0.15 });
  document.querySelectorAll('section .wrap > *, .items > li, .trio > a, .faces > li, .nums > div, .way').forEach(el => { el.classList.add('rv'); io.observe(el); });
  document.querySelectorAll('.stats b, .nums b, .seats').forEach(el => io.observe(el));
  document.querySelectorAll('.seats i').forEach((el, i) => el.style.setProperty('--i', i < 12 ? i : i + 8));
}

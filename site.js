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

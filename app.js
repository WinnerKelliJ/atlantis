const VALID_TABS = ['plan', 'stay', 'play', 'eat', 'tools'];
const DEFAULT_TAB = 'plan';

function showTab(tabId) {
  if (!VALID_TABS.includes(tabId)) tabId = DEFAULT_TAB;

  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('tab-active', t.dataset.tab === tabId);
  });
  document.querySelectorAll('.panel').forEach(p => {
    p.hidden = p.dataset.panel !== tabId;
  });

  if (window.location.hash !== '#' + tabId) {
    history.replaceState(null, '', '#' + tabId);
  }
}

document.querySelectorAll('.tab').forEach(t => {
  t.addEventListener('click', () => showTab(t.dataset.tab));
});

window.addEventListener('hashchange', () => {
  showTab(window.location.hash.replace('#', ''));
});

const initialTab = window.location.hash.replace('#', '') || DEFAULT_TAB;
showTab(initialTab);

// ─── Stay tab: render towers from data/towers.json ──────

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function towerCard(t) {
  const fee = t.resort_fee_per_night_usd != null
    ? `~$${t.resort_fee_per_night_usd.toFixed(2)} / night (incl. VAT)`
    : 'Ask Kelli';
  const closest = (t.closest_to || []).map(escapeHtml).join(' · ');
  return `
    <article class="tower-card" data-tower-id="${escapeHtml(t.id)}">
      <header class="tower-card-header">
        <h3 class="tower-card-name">${escapeHtml(t.name)}</h3>
        <span class="tower-card-tier">${escapeHtml(t.tier)}</span>
      </header>
      <p class="tower-card-vibe">${escapeHtml(t.vibe)}</p>
      <div class="tower-card-meta">
        <div class="tower-card-row">
          <span class="tower-card-label">Best for</span>
          <span class="tower-card-value">${escapeHtml(t.best_for)}</span>
        </div>
        <div class="tower-card-row">
          <span class="tower-card-label">Closest to</span>
          <span class="tower-card-value">${closest}</span>
        </div>
        <div class="tower-card-row">
          <span class="tower-card-label">Resort fee</span>
          <span class="tower-card-value">${fee}</span>
        </div>
      </div>
    </article>
  `;
}

async function renderStay() {
  const container = document.getElementById('towers-list');
  if (!container) return;
  try {
    const res = await fetch('data/towers.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const towers = await res.json();
    container.innerHTML = towers.map(towerCard).join('');
  } catch (err) {
    console.error('renderStay failed', err);
    container.innerHTML = '<p class="panel-placeholder">Towers couldn\'t load — refresh to try again.</p>';
  }
}

renderStay();

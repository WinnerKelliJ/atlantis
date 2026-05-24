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

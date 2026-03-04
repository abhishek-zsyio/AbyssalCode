/* ===================== PYTHON QUEST - THEME SYSTEM ===================== */

import { appState } from '../core/state.js';
import { totalXP, saveState, levelInfo } from '../core/state.js';
import { TOPICS } from '../data/data.js';
import { updateHUD, refreshIcons } from '../ui/ui.js';
import { triggerReiatsu, spawnEmojis } from '../ui/ui.js';
import { setThemeMusic, playThemeStinger, playUI } from '../core/sound.js';

const OTAKU_BASE = 'https://api.otakugifs.xyz/gif';

import { COLOR_SCHEMES } from '../data/themeData.js';

let activeThemeId = localStorage.getItem('cq-theme') || 'minimal-mist';

async function fetchOtakuGif(reaction) {
  try {
    const resp = await fetch(`${OTAKU_BASE}?reaction=${reaction}&format=gif`);
    const data = await resp.json();
    const url = data?.url || null;
    return url;
  } catch (e) {
    console.error('OtakuGIF Fetch Error:', e);
    return null;
  }
}

async function randomizeMascot() {
  const heroMascot = document.querySelector('.hero-mascot img');
  if (!heroMascot) return;

  const reactions = ['happy', 'dance', 'smile', 'wave', 'laugh', 'celebrate', 'yay'];
  const reaction = reactions[Math.floor(Math.random() * reactions.length)];
  const gifUrl = await fetchOtakuGif(reaction);

  if (gifUrl) {
    heroMascot.style.opacity = '0.3';
    setTimeout(() => {
      heroMascot.src = `${gifUrl}?t=${Date.now()}`;
      heroMascot.style.opacity = '1';
    }, 300);
  }
}
let activeFilter = 'all'; // 'all' | 'recent' | 'editor' | 'minimal' | 'anime' | 'bollywood' | 'hollywood'
let themeSearchQuery = '';
let selectedIndex = 0;
let lastFilteredThemes = [];
let recentThemes = JSON.parse(localStorage.getItem('cq-recent-themes') || '[]');

const TABS = ['all', 'recent', 'editor', 'minimal', 'anime', 'bollywood', 'hollywood', 'modern'];

function saveRecentTheme(id) {
  if (id === 'minimal-mist') return; // Don't track default?
  recentThemes = [id, ...recentThemes.filter(t => t !== id)].slice(0, 5);
  localStorage.setItem('cq-recent-themes', JSON.stringify(recentThemes));
}

function showMiniToast(icon, title, sub) {
  const t = document.getElementById('toast');
  const iconEl = document.getElementById('toast-icon');
  const titleEl = document.getElementById('toast-title');
  const subEl = document.getElementById('toast-sub');
  if (!t || !iconEl || !titleEl || !subEl) return;

  iconEl.textContent = icon;
  titleEl.textContent = title;
  subEl.textContent = sub;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

function popOverlay(className, ms = 1000) {
  const el = document.createElement('div');
  el.className = className;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), ms);
}

function shakeBody() {
  const wrapper = document.getElementById('app-wrapper');
  if (wrapper) {
    wrapper.classList.add('theme-shake');
    setTimeout(() => wrapper.classList.remove('theme-shake'), 450);
  }
}

function confettiBurst(colors) {
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || typeof window.confetti !== 'function') return;
  window.confetti({ particleCount: 80, spread: 75, origin: { y: 0.65 }, colors });
}

function runThemeEasterEgg(id, scheme) {
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Global aura flash removed to prevent blinding users on every theme switch
  switch (id) {
    case 'editor-dracula':
      showMiniToast('🦇', 'Dracula', 'Bite the bugs.');
      confettiBurst(['#ff5555', '#bd93f9', '#50fa7b']);
      break;
    case 'editor-monokai':
      showMiniToast('🎨', 'Monokai', 'Classic beauty.');
      confettiBurst(['#f92672', '#a6e22e', '#66d9ef']);
      break;
    case 'anime-jjk':
      showMiniToast('🌀', 'Cursed Energy', 'Domain expanding...');
      if (!reduced) shakeBody();
      confettiBurst(['#8b5cf6', '#06b6d4', '#ff3b7f', '#fbbf24']);
      playThemeStinger('jjk'); break;
    case 'anime-aot':
      showMiniToast('🧱', 'The Walls', 'Shinzou wo sasageyo.');
      if (!reduced) shakeBody();
      confettiBurst(['#d79921', '#cc241d', '#98971a', '#689d6a']);
      playThemeStinger('aot'); break;
    case 'bolly-yjhd':
      showMiniToast('🏔️', 'Manali Heights', 'Life is a trek.');
      confettiBurst(['#38bdf8', '#ffffff', '#fb7185']);
      break;
    default: break;
  }
}

async function applyTheme(id) {
  const modal = document.getElementById('theme-modal');
  if (modal) modal.classList.remove('open');

  const scheme = COLOR_SCHEMES.find(s => s.id === id);
  if (!scheme) return;
  activeThemeId = id;
  window.activeThemeId = id;
  localStorage.setItem('cq-theme', id);
  const root = document.documentElement;
  for (const [k, v] of Object.entries(scheme.vars)) root.style.setProperty(k, v);

  // Toggle light mode class
  if (scheme.isLight) {
    document.body.classList.add('theme-light');
  } else {
    document.body.classList.remove('theme-light');
  }

  const bg = document.getElementById('theme-bg');
  if (bg && scheme.bgImage) {
    bg.style.backgroundImage = `url(${scheme.bgImage})`;
    bg.classList.add('is-on');
    setTimeout(() => bg.classList.remove('is-on'), 700);
  } else if (bg) {
    bg.style.backgroundImage = '';
  }
  // Handle Theme Songs (All categories now)
  if (scheme.musicStationId) {
    setThemeMusic(scheme.musicStationId, id);
  }

  // Set Unique Mascot GIF via OtakuGIFs (only use verified reactions)
  if (scheme.mascotReaction) {
    const heroMascot = document.querySelector('.hero-mascot img');
    if (heroMascot) {
      const VALID_REACTIONS = ['happy', 'dance', 'smile', 'wave', 'laugh', 'celebrate', 'yay', 'think', 'sleep', 'mad', 'confused'];
      const reaction = VALID_REACTIONS.includes(scheme.mascotReaction) ? scheme.mascotReaction : 'smile';
      const url = await fetchOtakuGif(reaction);
      if (url) {
        heroMascot.style.opacity = '0';
        setTimeout(() => {
          heroMascot.src = `${url}?t=${Date.now()}`;
          heroMascot.style.opacity = '1';
        }, 300);
      }
    }
  }

  if (appState.editor) appState.editor.setOption('theme', 'codequest');
  saveRecentTheme(id);
  renderThemeList(); // Updated to renderThemeList
  runThemeEasterEgg(id, scheme);
  playUI('click');
}

export function setThemeFilter(filter) {
  activeFilter = filter;
  selectedIndex = 0; // Reset index when category changes
  playUI('click');
  renderThemeList();

  // Scroll the active tab into center view
  setTimeout(() => {
    const activeTab = document.querySelector(`.theme-tab-btn[data-filter="${filter}"]`);
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, 50);
}

window.setThemeFilter = setThemeFilter;

export function searchThemes(query) {
  themeSearchQuery = query.toLowerCase().trim();
  selectedIndex = 0;
  renderThemeList();
}
window.searchThemes = searchThemes;

function handleThemeKeydown(e) {
  if (!document.getElementById('theme-modal').classList.contains('open')) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    selectedIndex = (selectedIndex + 1) % lastFilteredThemes.length;
    updateSelection(true);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    selectedIndex = (selectedIndex - 1 + lastFilteredThemes.length) % lastFilteredThemes.length;
    updateSelection(true);
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    const curIdx = TABS.indexOf(activeFilter);
    setThemeFilter(TABS[(curIdx + 1) % TABS.length]);
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    const curIdx = TABS.indexOf(activeFilter);
    setThemeFilter(TABS[(curIdx - 1 + TABS.length) % TABS.length]);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (lastFilteredThemes[selectedIndex]) {
      applyTheme(lastFilteredThemes[selectedIndex].id);
    }
  }
}

function updateSelection(shouldScroll = false) {
  const items = document.querySelectorAll('.theme-list-item');
  items.forEach((item, i) => {
    item.classList.toggle('selected', i === selectedIndex);
    if (i === selectedIndex && shouldScroll) {
      item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });
}

document.addEventListener('keydown', handleThemeKeydown);

function renderThemeList() {
  const container = document.getElementById('theme-grid-container');
  const modalContent = document.querySelector('.theme-modal-content');
  if (!container || !modalContent) return;

  // Ensure tabs wrapper exists
  let tabsWrapper = modalContent.querySelector('.theme-tabs-wrapper');
  if (!tabsWrapper) {
    tabsWrapper = document.createElement('div');
    tabsWrapper.className = 'theme-tabs-wrapper';
    tabsWrapper.innerHTML = `
      <button class="theme-nav-btn tabs-prev" onclick="window.scrollThemeTabs(-1)"><i data-lucide="chevron-left"></i></button>
      <div class="theme-tabs"></div>
      <button class="theme-nav-btn tabs-next" onclick="window.scrollThemeTabs(1)"><i data-lucide="chevron-right"></i></button>
    `;
    modalContent.insertBefore(tabsWrapper, container);
  }
  const tabsContainer = tabsWrapper.querySelector('.theme-tabs');

  const categories = [
    { id: 'all', label: 'All', icon: 'layout-grid' },
    { id: 'recent', label: 'Recent', icon: 'clock' },
    { id: 'editor', label: 'Editors', icon: 'code' },
    { id: 'minimal', label: 'Minimal', icon: 'leaf' },
    { id: 'anime', label: 'Anime', icon: 'sparkles' },
    { id: 'bollywood', label: 'Bollywood', icon: 'film' },
    { id: 'hollywood', label: 'Hollywood', icon: 'clapperboard' },
    { id: 'modern', label: 'Modern', icon: 'zap' }
  ];

  tabsContainer.innerHTML = categories.map(cat => `
    <button class="theme-tab-btn ${activeFilter === cat.id ? 'active' : ''}" 
            onclick="window.setThemeFilter('${cat.id}')"
            data-filter="${cat.id}">
      <i data-lucide="${cat.icon}"></i>
      <span>${cat.label}</span>
    </button>
  `).join('');

  const fragment = document.createDocumentFragment();

  let filtered;
  if (activeFilter === 'recent') {
    filtered = recentThemes.map(id => COLOR_SCHEMES.find(s => s.id === id)).filter(Boolean);
    if (themeSearchQuery) {
      filtered = filtered.filter(s => s.name.toLowerCase().includes(themeSearchQuery));
    }
  } else {
    filtered = COLOR_SCHEMES.filter(s => {
      const matchesCategory = activeFilter === 'all' || s.category === activeFilter;
      const matchesSearch = s.name.toLowerCase().includes(themeSearchQuery) ||
        s.category.toLowerCase().includes(themeSearchQuery);
      return matchesCategory && matchesSearch;
    });
  }

  lastFilteredThemes = filtered;

  if (filtered.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'theme-empty-state';
    empty.innerHTML = `
      <i data-lucide="search-x" style="width:32px; height:32px; display:block; margin: 0 auto 12px; opacity:0.5;"></i> 
      ${activeFilter === 'recent' ? 'No recent themes yet.' : `No themes found matching "${themeSearchQuery}"`}
    `;
    container.innerHTML = '';
    container.appendChild(empty);
    import('../ui/ui.js').then(m => m.refreshIcons(modalContent));
    return;
  }

  filtered.forEach((s, i) => {
    const item = document.createElement('div');
    const isActive = s.id === activeThemeId;
    const isSelected = i === selectedIndex;
    item.className = `theme-list-item ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}`;
    item.style.animationDelay = `${i * 10}ms`;

    // Sync highlight with mouse hover
    item.onmouseenter = () => {
      selectedIndex = i;
      updateSelection(false);
    };

    item.onclick = () => applyTheme(s.id);

    const catDisplayName = s.category.charAt(0).toUpperCase() + s.category.slice(1);
    const themeIndex = (i + 1).toString().padStart(2, '0');

    item.innerHTML = `
      <div class="theme-item-info">
        <span class="theme-item-number">#${themeIndex}</span>
        <span class="theme-item-name"><i data-lucide="${s.icon || 'palette'}"></i> ${s.name}</span>
        <span class="list-cat-badge">${catDisplayName}</span>
      </div>
      <div class="theme-item-colors">
        ${s.dots.map(c => `<div class="list-dot" style="background:${c}"></div>`).join('')}
        ${isSelected ? '<span class="theme-item-shortcut">Enter</span>' : ''}
      </div>
    `;

    fragment.appendChild(item);
  });

  container.innerHTML = '';
  container.appendChild(fragment);

  import('../ui/ui.js').then(m => m.refreshIcons(modalContent));
}

export function openThemePicker() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
  renderThemeList();
  const modal = document.getElementById('theme-modal');
  modal.classList.add('open');

  const input = document.getElementById('theme-search-input');
  if (input) {
    input.value = '';
    themeSearchQuery = '';
    setTimeout(() => input.focus(), 50);
  }

  // Randomize Mascot GIF
  randomizeMascot();
}

export function scrollThemeTabs(dir) {
  const tabs = document.querySelector('.theme-tabs');
  if (tabs) {
    const amount = 150;
    tabs.scrollBy({ left: dir * amount, behavior: 'smooth' });
  }
}

window.scrollThemeTabs = scrollThemeTabs;
window.openThemePicker = openThemePicker;
window.activeThemeId = activeThemeId;
window.COLOR_SCHEMES = COLOR_SCHEMES;
if (activeThemeId !== 'minimal-mist') applyTheme(activeThemeId);
else applyTheme('minimal-mist'); // Ensure initial theme variables are set

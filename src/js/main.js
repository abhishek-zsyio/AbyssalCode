// ===================== MAIN - Entry point =====================

import { appState } from './core/state.js';
import { toggleSound, updateVolume, initSound, toggleMusicPause, nextTrack, prevTrack, seekTo } from './core/sound.js';
import { initPyodide, runCode } from './core/engine.js';
import {
  updateHUD,
  renderTabs,
  renderContent,
  filterQuests,
  openCodeModal,
  closeModal,
  toggleModalHint,
  observeAll,
  initMusicPicker,
  refreshIcons,
  renderHeatmap,
  openSurpriseQuest,
  hideSearchDropdown
} from './ui/ui.js';
import { playUI, setVibe } from './core/sound.js';
import { openAchievements, closeAchievements } from './features/rewards.js';
import { initDailyQuest, openDailyQuest, openLeaderboard } from './features/leaderboard.js';
import './ui/themes.js';

// Expose handlers for HTML onclick (keeping some for backward compatibility if needed, but moving to event listeners where possible)
window.runCode = runCode;
window.closeModal = closeModal;
window.toggleModalHint = toggleModalHint;
window.updateVolume = (val) => updateVolume(val);
window.toggleSound = toggleSound;
window.toggleMusicPause = toggleMusicPause;
window.nextTrack = nextTrack;
window.prevTrack = prevTrack;
window.filterQuests = filterQuests;
window.openLeaderboard = openLeaderboard;
window.openAchievements = openAchievements;
window.closeAchievements = closeAchievements;
window.openDailyQuest = openDailyQuest;
window.refreshIcons = refreshIcons;
window.openSurpriseQuest = openSurpriseQuest;
window.scrollTabs = (direction) => {
  const container = document.getElementById('tabs-container');
  if (!container) return;
  const scrollAmount = 300;
  container.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth'
  });
};

// Sync editor ref for themes
Object.defineProperty(window, 'editor', {
  get: () => appState.editor,
  configurable: true,
});

initSound();

function spawnSymbols() {
  const SYMS = ['{', '}', '[]', 'def', 'class', 'async', 'await', 'yield', 'import', '=>', 'for', 'if', 'pass', 'True', 'self'];
  const ICONS = ['terminal', 'cpu', 'code-2', 'binary', 'database', 'layers', 'git-branch', 'activity'];
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const fragment = document.createDocumentFragment();
  const isSmallScreen = window.innerWidth <= 768;
  const count = isSmallScreen ? 8 : 15; // Reduced density

  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.className = 'sym';

    if (i % 3 === 0) {
      const iconName = ICONS[Math.floor(i / 3) % ICONS.length];
      span.innerHTML = `<i data-lucide="${iconName}"></i>`;
    } else {
      span.textContent = SYMS[i % SYMS.length];
    }

    const size = 10 + Math.random() * 16;
    span.style.cssText = `font-size:${size}px; left:${Math.random() * 100}%; animation-duration:${14 + Math.random() * 20}s; animation-delay:-${Math.random() * 20}s; will-change: transform;`;
    fragment.appendChild(span);
  }
  canvas.appendChild(fragment);
  refreshIcons(canvas);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'm' || e.key === 'M') {
    if (document.activeElement.tagName !== 'TEXTAREA' && document.activeElement.tagName !== 'INPUT') {
      toggleSound();
    }
  }
  if (e.key === '?' || e.key === '¿') {
    document.getElementById('help-modal').classList.add('open');
  }
  if (e.key === '/') {
    if (document.activeElement.tagName !== 'TEXTAREA' && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      document.getElementById('quest-search').focus();
    }
  }
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
  }
  if ((e.key === 's' || e.key === 'S') && document.activeElement.tagName !== 'TEXTAREA' && document.activeElement.tagName !== 'INPUT') {
    if (!document.querySelector('.modal-overlay.open')) openSurpriseQuest();
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  spawnSymbols();

  const splash = document.getElementById('splash-screen');
  const bar = document.getElementById('splash-progress');
  const splashLogo = splash?.querySelector('.splash-logo');
  const splashSub = splash?.querySelector('.splash-subtitle');

  // Apply theme to splash screen immediately
  const activeThemeId = localStorage.getItem('cq-theme') || 'minimal-mist';
  if (splash && splashLogo && splashSub) {
    import('./data/themeData.js').then(({ COLOR_SCHEMES }) => {
      const theme = COLOR_SCHEMES.find(t => t.id === activeThemeId);
      if (theme) {
        splashLogo.innerHTML = `<i data-lucide="${theme.icon || 'swords'}"></i>`;
        splashSub.textContent = theme.splashSubtitle || 'LEVELLING UP...';

        // Apply theme variables for splash screen
        const root = document.documentElement;
        for (const [k, v] of Object.entries(theme.vars)) {
          root.style.setProperty(k, v);
        }

        // Handle Light Mode
        if (theme.isLight) {
          document.body.classList.add('theme-light');
        } else {
          document.body.classList.remove('theme-light');
        }
        refreshIcons();
      }
    });
  }

  if (splash && bar) {
    let progress = 0;
    const updateProgress = () => {
      progress += Math.random() * 0.8; // Smoother increments
      if (progress >= 100) {
        progress = 100;
        bar.style.width = '100%';
        setTimeout(() => {
          splash.classList.add('hidden');
          observeAll();
        }, 600);
      } else {
        bar.style.width = progress + '%';
        requestAnimationFrame(updateProgress);
      }
    };
    requestAnimationFrame(updateProgress);
  }

  renderTabs();
  renderContent();
  updateHUD();
  renderHeatmap();
  initDailyQuest();
  // initPyodide(); // Lazy loaded now
  initMusicPicker();
  refreshIcons();

  // Global SFX for buttons
  document.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('.quest-card') || e.target.closest('.tab-btn')) {
      playUI('click');
    }
  });

  // Header Dynamic Behavior
  const headerRight = document.getElementById('header-right');
  const searchInput = document.getElementById('quest-search');
  const expandBtn = document.getElementById('header-expand-btn');
  const collapseBtn = document.getElementById('header-collapse-btn');

  const setHeaderState = (isHidden) => {
    headerRight.classList.toggle('icons-hidden', isHidden);
    refreshIcons();
  };

  if (searchInput) {
    searchInput.addEventListener('focus', () => setHeaderState(true));
    searchInput.addEventListener('blur', () => {
      // Small timeout to allow click events on toggle buttons / dropdown items
      setTimeout(() => {
        if (document.activeElement !== searchInput) {
          setHeaderState(false);
          hideSearchDropdown();
        }
      }, 200);
    });
    // Dismiss dropdown on Escape
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hideSearchDropdown();
        searchInput.blur();
      }
    });
  }

  if (expandBtn) expandBtn.addEventListener('click', () => setHeaderState(true));
  if (collapseBtn) collapseBtn.addEventListener('click', () => setHeaderState(false));

  // Attach Other UI Event Listeners
  const attachListener = (id, event, handler) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, handler);
  };

  attachListener('header-expand-btn', 'click', () => setHeaderState(true));
  attachListener('header-collapse-btn', 'click', () => setHeaderState(false));
  attachListener('tabs-prev', 'click', () => window.scrollTabs(-1));
  attachListener('tabs-next', 'click', () => window.scrollTabs(1));
  attachListener('modal-hint-btn', 'click', () => toggleModalHint());
  attachListener('run-code-btn', 'click', () => runCode());

  // Header Scroll Effect - Optimized with rAF
  const header = document.querySelector('.main-header');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Progress Bar Interaction
  const progressContainer = document.getElementById('music-progress-container');
  if (progressContainer) {
    progressContainer.addEventListener('click', (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = (x / rect.width) * 100;
      seekTo(percent);
    });
  }
});


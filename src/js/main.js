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
import { initTutorial } from './features/tutorial.js';

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
window.selectAuraModel = (val, text, el) => {
  document.getElementById('aura-model-select').value = val;
  document.getElementById('aura-model-selected-text').textContent = text;
  document.querySelectorAll('#aura-model-dropdown .dropdown-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('aura-model-dropdown').style.display = 'none';
};
window.resetApp = () => {
  if (confirm("Are you sure you want to reset all your progress, XP, and settings? This cannot be undone!")) {
    const theme = localStorage.getItem('cq-theme');
    localStorage.clear();
    if (theme) {
      localStorage.setItem('cq-theme', theme);
    }
    window.location.reload();
  }
};
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

let lastKey = '';

document.addEventListener('keydown', (e) => {
  const isInput = document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'INPUT';

  // NvChad/Vim Style Shortcuts
  if (!isInput) {
    if (e.key === ' ') {
      e.preventDefault(); // prevent default space scroll
      lastKey = 'Space';
      return;
    }

    // Space combinations
    if (lastKey === 'Space') {
      if (e.key === '/') {
        e.preventDefault();
        document.getElementById('quest-search').focus();
        lastKey = '';
        return;
      }
      if (e.key === 't') {
        if (typeof window.openThemePicker === 'function') window.openThemePicker();
        lastKey = '';
        return;
      }
      if (e.key === 'l') {
        if (typeof window.openLeaderboard === 'function') window.openLeaderboard();
        lastKey = '';
        return;
      }
    }

    // Vim Scrolling 
    if (e.key === 'j') {
      window.scrollBy({ top: 120, behavior: 'smooth' });
    } else if (e.key === 'k') {
      window.scrollBy({ top: -120, behavior: 'smooth' });
    } else if (e.key === 'G') {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } else if (e.key === 'g') {
      if (lastKey === 'g') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        lastKey = '';
      } else {
        lastKey = 'g';
      }
      return;
    }
  }

  // Existing Shortcuts
  if ((e.key === 'm' || e.key === 'M') && !isInput) {
    toggleSound();
  }
  if ((e.key === '?' || e.key === '¿') && !isInput) {
    document.getElementById('help-modal').classList.add('open');
  }
  // Optional: keep original '/' if user prefers it too, but we disabled it for Space+/ above.
  // Actually, let's keep it if they just press '/'
  if (e.key === '/' && !isInput && lastKey !== 'Space') {
    e.preventDefault();
    document.getElementById('quest-search').focus();
  }
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
  }
  if ((e.key === 's' || e.key === 'S') && !isInput) {
    if (!document.querySelector('.modal-overlay.open')) openSurpriseQuest();
  }

  // Reset lastKey if it wasn't a prefix key
  if (e.key !== ' ' && e.key !== 'g') {
    lastKey = '';
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
          setTimeout(() => initTutorial(), 500); // Show tutorial after splash is gone
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

  // Global SFX for buttons and dropdown closing
  document.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('.quest-card') || e.target.closest('.tab-btn')) {
      playUI('click');
    }

    // Auto-close AI model dropdown if clicking outside
    const dropdown = document.getElementById('aura-model-dropdown');
    const display = document.getElementById('aura-model-display');
    if (dropdown && dropdown.style.display === 'flex') {
      if (!dropdown.contains(e.target) && !display.contains(e.target)) {
        dropdown.style.display = 'none';
      }
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

  // Coding Activity accordion toggle
  const heatmapToggle = document.getElementById('heatmap-toggle');
  const heatmapSection = document.getElementById('heatmap-section');
  if (heatmapToggle && heatmapSection) {
    heatmapSection.classList.add('collapsed'); // start collapsed
    heatmapToggle.addEventListener('click', () => {
      const isCollapsed = heatmapSection.classList.toggle('collapsed');
      heatmapToggle.setAttribute('aria-expanded', String(!isCollapsed));
    });
  }

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

  // Aura Weaver Logic
  const auraGenBtn = document.getElementById('aura-weaver-generate-btn');
  const auraLinkInput = document.getElementById('aura-yt-link');
  const auraDescInput = document.getElementById('aura-description');
  const auraKeyInput = document.getElementById('aura-api-key');
  const auraModal = document.getElementById('aura-weaver-modal');

  if (auraGenBtn) {
    auraGenBtn.addEventListener('click', async () => {
      const link = auraLinkInput?.value?.trim();
      const desc = auraDescInput?.value?.trim();
      const key = auraKeyInput?.value?.trim();

      if (!link) return alert('Please enter a YouTube link.');
      if (!key) return alert('Please enter your Gemini API key.');

      // Save key to state (persistent via state.js setter)
      appState.aiApiKey = key;

      auraGenBtn.classList.add('loading');
      auraGenBtn.disabled = true;

      try {
        const { generateThemeFromAi, extractYoutubeId } = await import('./core/ai.js');
        const { applyDynamicTheme } = await import('./ui/themes.js');

        const videoId = extractYoutubeId(link);
        let enhancedDesc = desc;

        // Try to fetch metadata for better vibe seeding
        if (videoId) {
          try {
            const metaRes = await fetch(`http://localhost:3001/metadata/${videoId}`);
            if (metaRes.ok) {
              const metaData = await metaRes.json();
              if (metaData.success) {
                const vibeInfo = `Title: ${metaData.title}. Tags: ${metaData.tags.join(', ')}. Description: ${metaData.description.slice(0, 300)}...`;
                enhancedDesc = desc ? `${desc} (Music Context: ${vibeInfo})` : vibeInfo;
              }
            }
          } catch (e) {
            console.warn('Metadata fetch failed, falling back to basic prompt.');
          }
        }

        const modelSelect = document.getElementById('aura-model-select');
        const selectedModel = modelSelect ? modelSelect.value : null;

        const themeData = await generateThemeFromAi(link, enhancedDesc, selectedModel);
        await applyDynamicTheme(themeData);

        auraModal.classList.remove('open');
        // Clear inputs
        auraLinkInput.value = '';
        auraDescInput.value = '';
      } catch (err) {
        alert(err.message || 'Failed to generate theme.');
      } finally {
        auraGenBtn.classList.remove('loading');
        auraGenBtn.disabled = false;
      }
    });
  }

  if (auraKeyInput) {
    auraKeyInput.addEventListener('change', () => {
      appState.aiApiKey = auraKeyInput.value.trim();
    });
  }

  const discoverBtn = document.getElementById('aura-discover-models');
  if (discoverBtn) {
    discoverBtn.addEventListener('click', async () => {
      const { listAvailableModels } = await import('./core/ai.js');
      const originalHtml = discoverBtn.innerHTML;
      discoverBtn.innerHTML = '<i class="spin-icon"></i> Checking...';
      const models = await listAvailableModels();
      const dropdown = document.getElementById('aura-model-dropdown');

      if (models.length > 0) {
        if (dropdown) {
          dropdown.innerHTML = models.map((m, i) => {
            const displayName = m.split('/').pop().replace('models/', '');
            return `<div class="dropdown-item ${i === 0 ? 'active' : ''}" data-value="${m}" onclick="window.selectAuraModel('${m}', '${displayName}', this)">${displayName}</div>`;
          }).join('');

          // Auto select first
          const firstModel = models[0];
          const firstDisplayName = firstModel.split('/').pop().replace('models/', '');
          document.getElementById('aura-model-select').value = firstModel;
          document.getElementById('aura-model-selected-text').textContent = firstDisplayName;
        }

        discoverBtn.innerHTML = '<i data-lucide="check"></i> Ready';
        if (window.lucide) window.lucide.createIcons();
      } else {
        const supportedList = document.getElementById('aura-supported-models');
        if (supportedList) {
          supportedList.textContent = 'No models found. Check API key.';
          supportedList.style.display = 'block';
        }
        discoverBtn.textContent = 'Retry discovery';
      }
      setTimeout(() => { if (discoverBtn.textContent === 'Ready' || discoverBtn.innerHTML.includes('Ready')) discoverBtn.innerHTML = originalHtml; }, 3000);
    });
  }
});


// ===================== REWARDS & ACHIEVEMENTS =====================

import { appState, saveState, ACHIEVEMENTS } from '../core/state.js';
import { levelInfo, totalXP } from '../core/state.js';
import { playSound } from '../core/sound.js';
import { updateHUD, renderTabs, showToast, fireConfetti, spawnEmojis, triggerReiatsu, showLevelUpModal, refreshIcons } from '../ui/ui.js';

export function handleQuestComplete(prob, xpBefore, extraText, multiplier) {
  updateHUD();
  renderTabs();

  const card = document.querySelector('[data-id="' + prob.id + '"]');
  if (card) {
    card.classList.add('completed');
    const btn = card.querySelector('.solve-btn');
    if (btn) btn.textContent = 'Review Solution ✓';
  }

  const icons = { easy: 'star', medium: 'sparkles', hard: 'flame' };
  const icon = icons[prob.difficulty] || '⭐';
  const isDaily = prob.id === appState.state._meta.daily.id;
  const displayXp = Math.floor(prob.xp * (multiplier || 1.0) * (isDaily ? 2 : 1));

  if (window.activeThemeId === 'bleach') triggerReiatsu();

  showToast(icon, 'Quest Complete: ' + prob.title, '+' + displayXp + ' XP earned!' + (extraText || ''));
  spawnEmojis(icon);
  fireConfetti();

  const newXp = totalXP();
  const oldLevel = levelInfo(xpBefore || 0).level;
  const newLevel = levelInfo(newXp).level;
}

export function checkAchievement(id) {
  if (!appState.state._meta.achievements.includes(id)) {
    appState.state._meta.achievements.push(id);
    saveState();
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (ach) {
      setTimeout(() => {
        showToast('trophy', 'Achievement Unlocked!', ach.title);
        playSound('success');
      }, 2500);
    }
  }
}

export function openAchievements() {
  const modal = document.getElementById('ach-modal');
  if (!modal) return;
  
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
  
  const grid = document.getElementById('ach-grid-container');
  if (!grid) return;

  const fragment = document.createDocumentFragment();
  
  ACHIEVEMENTS.forEach(a => {
    const unlocked = appState.state._meta.achievements.includes(a.id);
    const card = document.createElement('div');
    card.className = 'ach-card' + (unlocked ? ' unlocked' : '');
    card.innerHTML =
      '<div class="ach-icon"><i data-lucide="' + a.icon + '"></i></div>' +
      '<div class="ach-info"><div class="ach-title">' + a.title + '</div><div class="ach-desc">' + a.desc + '</div></div>';
    fragment.appendChild(card);
  });

  grid.innerHTML = '';
  grid.appendChild(fragment);
  refreshIcons(grid);
  modal.classList.add('open');
}

export function closeAchievements() {
  document.getElementById('ach-modal').classList.remove('open');
}

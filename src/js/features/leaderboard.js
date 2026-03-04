// ===================== DAILY QUEST & LEADERBOARD =====================

import { appState } from '../core/state.js';
import { totalXP, saveState, levelInfo } from '../core/state.js';
import { TOPICS } from '../data/data.js';
import { openCodeModal, refreshIcons } from '../ui/ui.js';

export function initDailyQuest() {
  const today = new Date().toISOString().split('T')[0];
  if (appState.state._meta.daily.date !== today) {
    const allProbs = TOPICS.flatMap(t => t.problems);
    const randomProb = allProbs[Math.floor(Math.random() * allProbs.length)];
    appState.state._meta.daily = { date: today, id: randomProb.id };
    saveState();
  }
  const dailyProb = TOPICS.flatMap(t => t.problems).find(p => p.id === appState.state._meta.daily.id);
  if (dailyProb) {
    document.getElementById('daily-quest-title').textContent = dailyProb.title;
  }
}

export function openDailyQuest() {
  const dailyProb = TOPICS.flatMap(t => t.problems).find(p => p.id === appState.state._meta.daily.id);
  if (dailyProb) openCodeModal(dailyProb);
}

export function updateLeaderboard(questId, timeTaken) {
  if (!appState.state._meta.leaderboard[questId]) appState.state._meta.leaderboard[questId] = [];
  appState.state._meta.leaderboard[questId].push({ name: 'You', time: parseFloat(timeTaken) });
  appState.state._meta.leaderboard[questId].sort((a, b) => a.time - b.time);
  appState.state._meta.leaderboard[questId] = appState.state._meta.leaderboard[questId].slice(0, 3);
  saveState();
}

export function openLeaderboard() {
  const modal = document.getElementById('leaderboard-modal');
  if (!modal) return;

  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));

  const list = document.getElementById('leaderboard-list');
  if (!list) return;

  const fragment = document.createDocumentFragment();
  const solvedIds = Object.keys(appState.state).filter(k => appState.state[k].done && k !== '_meta');

  if (solvedIds.length === 0) {
    const empty = document.createElement('div');
    empty.style.cssText = 'text-align:center; opacity:0.6; padding: 20px;';
    empty.textContent = 'No records yet. Solve a quest to get on the wall!';
    fragment.appendChild(empty);
  } else {
    solvedIds.forEach(id => {
      const records = appState.state._meta.leaderboard[id] || [];
      const prob = TOPICS.flatMap(t => t.problems).find(p => p.id === id);
      if (!prob) return;

      const row = document.createElement('div');
      row.className = 'leaderboard-row';
      row.style.cssText = 'margin-bottom: 12px; background: var(--rp-bg1); padding: 10px; border-radius: 8px;';

      let innerHTML = `<div style="font-weight:700; color:var(--rp-gold); font-size:0.9rem;">${prob.title}</div>`;
      records.forEach((r, idx) => {
        innerHTML += `<div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-top:4px;">
          <span>${idx + 1}. ${r.name}</span>
          <span style="color:var(--rp-foam)">${r.time}s</span>
        </div>`;
      });
      row.innerHTML = innerHTML;
      fragment.appendChild(row);
    });
  }

  list.innerHTML = '';
  list.appendChild(fragment);
  refreshIcons(list);
  modal.classList.add('open');
}

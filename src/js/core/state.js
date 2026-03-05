// ===================== STATE =====================
import { store } from './store.js';

export const appState = {
  get state() { return store.state; },
  set state(v) { store.state = v; },

  get currentTab() { return store.getSession('currentTab'); },
  set currentTab(v) { store.setSession('currentTab', v); },

  get currentQuestId() { return store.getSession('currentQuestId'); },
  set currentQuestId(v) { store.setSession('currentQuestId', v); },

  get currentLang() { return store.getSession('currentLang'); },
  set currentLang(v) { store.setSession('currentLang', v); },

  get pyodideReady() { return store.getSession('pyodideReady'); },
  set pyodideReady(v) { store.setSession('pyodideReady', v); },

  get pyodide() { return store.getSession('pyodide'); },
  set pyodide(v) { store.setSession('pyodide', v); },

  get editor() { return store.getSession('editor'); },
  set editor(v) { store.setSession('editor', v); },

  get questStartTime() { return store.getSession('questStartTime'); },
  set questStartTime(v) { store.setSession('questStartTime', v); },

  get sessionErrorsCount() { return store.getSession('sessionErrorsCount'); },
  set sessionErrorsCount(v) { store.setSession('sessionErrorsCount', v); },

  get onLevelUp() { return store.getSession('onLevelUp'); },
  set onLevelUp(v) { store.setSession('onLevelUp', v); },
};

// Getter/setters for meta fields
Object.defineProperty(appState, 'isSoundEnabled', {
  get: () => store.meta.isSoundEnabled,
  set: (v) => { store.meta.isSoundEnabled = v; store.save(); }
});
Object.defineProperty(appState, 'isMusicPaused', {
  get: () => store.meta.isMusicPaused,
  set: (v) => { store.meta.isMusicPaused = v; store.save(); }
});
Object.defineProperty(appState, 'musicVibe', {
  get: () => store.meta.musicVibe,
  set: (v) => { store.meta.musicVibe = v; store.save(); }
});
Object.defineProperty(appState, 'aiApiKey', {
  get: () => store.meta.aiApiKey,
  set: (v) => { store.meta.aiApiKey = v; store.save(); }
});

export const ACHIEVEMENTS = [
  { id: 'first_blood', icon: 'zap', title: 'First Blood', desc: 'Complete your very first quest.' },
  { id: 'speed_demon', icon: 'gauge', title: 'Speed Demon', desc: 'Solve a quest in less than 30 seconds.' },
  { id: 'unstoppable', icon: 'flame', title: 'Unstoppable', desc: 'Reach the maximum 3.0x Combo Multiplier.' },
  { id: 'persistence', icon: 'shield-check', title: 'Persistence', desc: 'Fail a quest 3 times in a row, but keep trying and pass it.' },
  { id: 'boss_slayer', icon: 'swords', title: 'Boss Slayer', desc: 'Defeat your first Boss Battle.' },
  { id: 'daily_devotee', icon: 'calendar-check', title: 'Daily Devotee', desc: 'Complete the Daily Quest 7 days in a row.' },
  { id: 'polyglot', icon: 'languages', title: 'Polyglot', desc: 'Solve the same quest in both Python and JavaScript.' },
  { id: 'all_rounder', icon: 'layout-grid', title: 'All-Rounder', desc: 'Complete at least one quest from every category.' },
  { id: 'night_owl', icon: 'moon', title: 'Night Owl', desc: 'Solve a quest after midnight.' },
  { id: 'combo_king', icon: 'crown', title: 'Combo King', desc: 'Maintain the 3.0x Combo Multiplier for 5 consecutive quest solves.' },
];

export function levelInfo(xp) {
  const levels = [
    { min: 0, max: 500, level: 1, name: 'Python Novice', icon: 'egg', title: 'LEVEL 1 — HATCHLING' },
    { min: 500, max: 1200, level: 2, name: 'Script Apprentice', icon: 'bird', title: 'LEVEL 2 — APPRENTICE' },
    { min: 1200, max: 2200, level: 3, name: 'Code Journeyman', icon: 'terminal', title: 'LEVEL 3 — JOURNEYMAN' },
    { min: 2200, max: 3500, level: 4, name: 'Syntax Sorcerer', icon: 'wand-2', title: 'LEVEL 4 — SORCERER' },
    { min: 3500, max: 999999, level: 5, name: 'Pythonic Master', icon: 'trophy', title: 'LEVEL 5 — MASTER' },
  ];
  return levels.find(l => xp >= l.min && xp < l.max) || levels[levels.length - 1];
}

export function totalXP() {
  const xp = Object.values(store.state).reduce((sum, v) => {
    if (typeof v === 'object' && v !== null && v.xp) return sum + v.xp;
    return sum;
  }, 0);
  return xp;
}

export function addXP(amount) {
  const oldXP = totalXP();
  const oldLevel = levelInfo(oldXP).level;

  const newXP = oldXP + amount;
  const newLevel = levelInfo(newXP).level;

  if (newLevel > oldLevel && appState.onLevelUp) {
    appState.onLevelUp(newLevel);
  }
}

export function totalDone() {
  return Object.values(store.state).filter(v => v.done).length;
}

export function saveState() {
  store.save();
}

export function getLocalDataString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

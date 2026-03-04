// ===================== UI =====================
import * as lucide from 'lucide';

import { appState } from '../core/state.js';
import { levelInfo, totalXP, totalDone, saveState, getLocalDataString } from '../core/state.js';
import { TOPICS } from '../data/data.js';

function diffIcon(d) { return { easy: 'circle', medium: 'circle-dot', hard: 'alert-circle' }[d] || 'help-circle'; }
function diffLabel(d) { return { easy: 'BEGINNER', medium: 'INTERMEDIATE', hard: 'ADVANCED' }[d] || d.toUpperCase(); }

export function refreshIcons(container = document) {
  try {
    if (lucide && lucide.createIcons) {
      lucide.createIcons({
        icons: lucide.icons,
        root: container
      });
    }
  } catch (e) {
    console.warn('Lucide icons failed to refresh:', e);
  }
}

import { playUI, playThemeStinger, setVibe } from '../core/sound.js';
import { MUSIC_STATIONS } from '../data/music.js';

// CodeMirror
import CodeMirror from 'codemirror';
import { getHints } from './autocomplete.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/javascript-hint.js';
import 'codemirror/addon/hint/sql-hint.js';
import 'codemirror/addon/hint/anyword-hint.js';

// Confetti
import confetti from 'canvas-confetti';
window.confetti = confetti;

// Observer removed as per user request for instant visibility.
export function observeAll() {
  // Empty as reveal logic is disabled.
}

// Initialize Level Up Listener
appState.onLevelUp = (lvl) => showLevelUpModal(lvl);

// Global Toast Listener (for decoupled messages)
window.addEventListener('app:toast', (e) => {
  const { icon, title, sub } = e.detail;
  showToast(icon, title, sub);
});

export function updateHUD() {
  const xp = totalXP();
  const done = totalDone();
  const lv = levelInfo(xp);
  const pct = Math.min(100, ((xp - lv.min) / (lv.max - lv.min)) * 100);

  const emojiEl = document.getElementById('avatar-emoji');
  if (emojiEl) {
    emojiEl.innerHTML = `<i data-lucide="${lv.icon}"></i>`;
    refreshIcons(emojiEl);
  }

  document.getElementById('level-label').textContent = lv.title;
  document.getElementById('rank-name').textContent = lv.name;
  document.getElementById('xp-fill').style.width = pct + '%';
  document.getElementById('xp-label').textContent =
    lv.max === 999999 ? '✨ Max Level Reached!' : `${Math.floor(xp)} / ${lv.max} XP to next level`;
  document.getElementById('stat-done').textContent = done;
  document.getElementById('stat-xp').textContent = Math.floor(xp);

  const streakEl = document.getElementById('stat-streak');
  if (streakEl) {
    streakEl.innerHTML = appState.state._meta.streak + ' <i data-lucide="flame" class="streak-icon"></i>';
    refreshIcons(streakEl);
  }

  document.getElementById('stat-combo').textContent = appState.state._meta.combo.toFixed(1) + 'x';

  TOPICS.forEach(t => {
    const topicDone = t.problems.filter(p => appState.state[p.id] && appState.state[p.id].done).length;
    const el = document.getElementById('tab-prog-' + t.id);
    if (el) el.textContent = topicDone + '/' + t.problems.length;
  });
}

export function renderTabs() {
  const container = document.getElementById('tabs-container');
  if (!container) return;

  const fragment = document.createDocumentFragment();
  const totalCompleted = totalDone();
  const bossThreshold = 0;
  const themeVars = ['var(--rp-love)', 'var(--rp-gold)', 'var(--rp-rose)', 'var(--rp-pine)', 'var(--rp-foam)', 'var(--rp-iris)'];

  TOPICS.forEach((t, i) => {
    const isBoss = t.id === 'boss';
    const isLocked = isBoss && totalCompleted < bossThreshold;

    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (appState.currentTab === t.id ? ' active' : '') + (isLocked ? ' locked' : '');
    btn.id = 'tab-' + t.id;

    if (isLocked) {
      btn.innerHTML = `<i data-lucide="lock"></i> Boss (Unlock at ${bossThreshold})`;
      btn.onclick = () => showToast('lock', 'Locked Section', 'Complete ' + (bossThreshold - totalCompleted) + ' more quests!');
    } else {
      btn.style.setProperty('--tab-color', themeVars[i % themeVars.length]);
      btn.innerHTML = `
        <i data-lucide="${t.icon}"></i> 
        <div class="tab-label-set">
          <span class="tab-label">${t.label}</span>
        </div>
      `;
      btn.onclick = () => {
        appState.currentTab = t.id;
        difficultyFilter = 'all';
        renderTabs();
        renderContent();
        const activeBtn = document.getElementById('tab-' + t.id);
        if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      };
    }
    fragment.appendChild(btn);
  });

  container.innerHTML = '';
  container.appendChild(fragment);
  refreshIcons(container);
}

let questSearchQuery = '';
let searchTimer = null;
let difficultyFilter = 'all'; // 'all' | 'easy' | 'medium' | 'hard'

export function setDifficultyFilter(level) {
  difficultyFilter = level;
  renderContent();
}

export function hideSearchDropdown() {
  const dd = document.getElementById('search-dropdown');
  if (dd) {
    dd.classList.remove('show');
    dd.innerHTML = '';
  }
}

function buildSearchDropdown(query) {
  const dd = document.getElementById('search-dropdown');
  if (!dd) return;
  dd.classList.add('dropdown-menu'); // Unified style

  if (!query) {
    dd.classList.remove('show');
    dd.innerHTML = '';
    return;
  }

  const matches = [];
  TOPICS.forEach(topic => {
    if (!topic.problems) return;
    topic.problems.forEach(p => {
      if (
        (p.title && p.title.toLowerCase().includes(query)) ||
        (p.id && p.id.toLowerCase().includes(query))
      ) {
        matches.push({ ...p, topicIcon: topic.icon || 'star', topicLabel: topic.label });
      }
    });
  });

  if (matches.length === 0) {
    dd.innerHTML = `<div class="search-dd-empty"><i data-lucide="search-x"></i> No results found</div>`;
    dd.classList.add('show');
    refreshIcons(dd);
    return;
  }

  const MAX = 8;
  const shown = matches.slice(0, MAX);
  dd.innerHTML = shown.map((p, i) => {
    const isDone = appState.state[p.id] && appState.state[p.id].done;
    const diff = p.difficulty || 'easy';
    const diffColors = { easy: 'var(--rp-foam)', medium: 'var(--rp-gold)', hard: 'var(--rp-love)' };
    const clr = diffColors[diff] || 'var(--rp-foam)';
    const title = p.title || 'Untitled';
    // Highlight matching text
    const reg = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const highlighted = title.replace(reg, '<mark>$1</mark>');
    return `
      <div class="search-dd-item dropdown-item" data-idx="${i}" role="option">
        <span class="search-dd-icon"><i data-lucide="${p.topicIcon}"></i></span>
        <span class="search-dd-text">${highlighted}</span>
        <span class="search-dd-badge" style="color:${clr};border-color:${clr}30;">${diff}</span>
        ${isDone ? '<span class="search-dd-done"><i data-lucide="check-circle-2"></i></span>' : ''}
      </div>`;
  }).join('');

  if (matches.length > MAX) {
    dd.innerHTML += `<div class="search-dd-more">+${matches.length - MAX} more — press Enter to see all</div>`;
  }

  // Attach click handlers
  dd.querySelectorAll('.search-dd-item').forEach((el, i) => {
    el.addEventListener('mousedown', (e) => {
      e.preventDefault(); // prevent blur on input
      openCodeModal(shown[i]);
      hideSearchDropdown();
      const input = document.getElementById('quest-search');
      if (input) input.value = '';
      questSearchQuery = '';
      renderContent();
    });
  });

  dd.classList.add('show');
  refreshIcons(dd);
}

export function filterQuests() {
  clearTimeout(searchTimer);
  const input = document.getElementById('quest-search');
  if (!input) return;
  const query = input.value.toLowerCase().trim();
  buildSearchDropdown(query);
  searchTimer = setTimeout(() => {
    questSearchQuery = query;
    renderContent();
  }, 200);
}


export function renderContent() {
  const area = document.getElementById('content-area');
  if (!area) return;

  const isSearching = questSearchQuery.trim().length > 0;
  let displayTitle = '';
  let displaySub = '';
  let displayIcon = '';
  let displayBg = '';
  let displayColor = '';
  let filteredQuests = [];

  if (isSearching) {
    displayTitle = `Search Results: "${questSearchQuery}"`;
    displaySub = 'Showing matches from all quest categories.';
    displayIcon = 'search';
    displayBg = 'var(--rp-bg2)';
    displayColor = 'var(--rp-iris)';

    TOPICS.forEach(topic => {
      if (!topic.problems) return;
      const matches = topic.problems.filter(p =>
        (p.title && p.title.toLowerCase().includes(questSearchQuery)) ||
        (p.desc && p.desc.toLowerCase().includes(questSearchQuery)) ||
        (p.id && p.id.toLowerCase().includes(questSearchQuery))
      );
      if (matches.length > 0) {
        filteredQuests.push(...matches.map(m => ({ ...m, topicIcon: topic.icon || 'star' })));
      }
    });
  } else {
    const topic = TOPICS.find(t => t.id === appState.currentTab);
    if (!topic) return;
    displayTitle = topic.label;
    displaySub = 'Complete all quests — write real Python and run it!';
    displayIcon = topic.icon;
    displayBg = topic.bg;
    displayColor = topic.color;
    filteredQuests = topic.problems;
  }

  // Apply difficulty filter (only when not searching)
  if (!isSearching && difficultyFilter !== 'all') {
    filteredQuests = filteredQuests.filter(p => p.difficulty === difficultyFilter);
  }

  const fragment = document.createDocumentFragment();

  const header = document.createElement('div');
  header.className = 'section-header';
  header.innerHTML =
    '<div class="section-icon" style="background:' + displayBg + '; border:1px solid ' + displayColor + '33"><i data-lucide="' + displayIcon + '"></i></div>' +
    '<div><div class="section-title">' + displayTitle + '</div>' +
    '<div class="section-sub">' + displaySub + '</div></div>';
  fragment.appendChild(header);

  // Difficulty filter bar (shown only when not searching)
  if (!isSearching) {
    const filterBar = document.createElement('div');
    filterBar.className = 'diff-filter-bar';
    const levels = [
      { id: 'all', icon: 'layers', label: 'All' },
      { id: 'easy', icon: 'circle', label: 'Easy' },
      { id: 'medium', icon: 'circle-dot', label: 'Medium' },
      { id: 'hard', icon: 'alert-circle', label: 'Hard' },
    ];
    levels.forEach(lvl => {
      const topic = TOPICS.find(t => t.id === appState.currentTab);
      const count = topic ? topic.problems.filter(p => lvl.id === 'all' || p.difficulty === lvl.id).length : 0;
      const btn = document.createElement('button');
      btn.className = 'diff-filter-btn' + (difficultyFilter === lvl.id ? ' active' : '');
      btn.innerHTML = `<i data-lucide="${lvl.icon}"></i> ${lvl.label} <span class="diff-count">${count}</span>`;
      btn.onclick = () => setDifficultyFilter(lvl.id);
      filterBar.appendChild(btn);
    });
    fragment.appendChild(filterBar);
  }

  const grid = document.createElement('div');
  grid.className = 'quest-grid';

  if (filteredQuests.length === 0) {
    const emptyDiv = document.createElement('div');
    emptyDiv.style.cssText = 'text-align:center;padding:100px 50px;opacity:0.6;';
    emptyDiv.innerHTML = '<i data-lucide="search-x" style="width:48px;height:48px;margin-bottom:16px;opacity:0.4;"></i><br>No quests found matching your search...';
    fragment.appendChild(emptyDiv);
  } else {
    filteredQuests.forEach((p, i) => {
      const isDone = appState.state[p.id] && appState.state[p.id].done;
      const card = document.createElement('div');
      card.className = 'quest-card' + (isDone ? ' completed' : '');
      card.setAttribute('data-id', p.id);
      card.onclick = () => openCodeModal(p);

      const topicIndicator = isSearching ? `<div class="card-topic-tag"><i data-lucide="${p.topicIcon}"></i></div>` : '';
      const title = p.title || 'Untitled Quest';
      const desc = p.desc || 'No description available.';
      const difficulty = p.difficulty || 'easy';
      const xp = p.xp || 0;

      card.innerHTML =
        '<div class="completion-check"><i data-lucide="check"></i></div>' +
        topicIndicator +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
        '<span class="card-num">' + (isSearching ? '#' + (i + 1) : 'Quest ' + (i + 1)) + '</span>' +
        '<div class="card-badges">' +
        '<span class="badge badge-' + difficulty + '"><i data-lucide="' + diffIcon(difficulty) + '"></i> ' + diffLabel(difficulty) + '</span>' +
        '<span class="badge badge-xp">+' + xp + ' XP</span>' +
        '</div></div>' +
        '<div class="card-title">' + title + '</div>' +
        '<div class="card-desc">' + desc.substring(0, 80) + '...</div>' +
        '<button class="btn btn-primary solve-btn" style="width:100%">' + (isDone ? 'Review Solution <i data-lucide="check"></i>' : 'Solve Challenge <i data-lucide="zap"></i>') + '</button>';
      grid.appendChild(card);
    });
    fragment.appendChild(grid);
  }

  area.innerHTML = '';
  area.appendChild(fragment);
  refreshIcons(area);
}

import { initPyodide } from '../core/engine.js';

export function openCodeModal(prob) {
  // Close any open modals first
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));

  if (!appState.pyodideReady && !prob.id.startsWith('js')) {
    initPyodide();
  }
  appState.currentQuestId = prob.id;
  document.getElementById('modal-title').textContent = prob.title;

  let descHtml = '<div style="margin-bottom:15px;">' + prob.desc + '</div>';
  if (prob.examples && prob.examples.length > 0) {
    descHtml += '<span class="section-label">Examples</span>';
    prob.examples.forEach(ex => {
      descHtml += `
        <div class="example-block">
          <div class="example-line"><span class="example-label">Input:</span> <span class="example-val">${ex.input}</span></div>
          <div class="example-line"><span class="example-label">Output:</span> <span class="example-val">${ex.output}</span></div>
          ${ex.explanation ? `<div class="example-exp"><strong>Explanation:</strong> ${ex.explanation}</div>` : ''}
        </div>`;
    });
  }
  if (prob.constraints && prob.constraints.length > 0) {
    descHtml += '<span class="section-label">Constraints</span><ul class="constraints-list">';
    prob.constraints.forEach(c => { descHtml += '<li>' + c + '</li>'; });
    descHtml += '</ul>';
  }

  document.getElementById('modal-desc').innerHTML = descHtml;
  document.getElementById('modal-hint-content').innerHTML = prob.hint || '';
  document.getElementById('modal-hint-box').classList.remove('open');
  document.getElementById('modal-hint-btn').innerHTML = '<i data-lucide="lightbulb"></i> Reveal Hint';

  // Reset solution view
  const solView = document.getElementById('solution-view');
  if (solView) solView.style.display = 'none';

  const outputEl = document.getElementById('terminal-output');
  outputEl.innerHTML = 'Ready. Click <i data-lucide="play-circle"></i> Run Tests to verify your code.';
  outputEl.className = 'terminal';

  // Refresh icons in left panel
  refreshIcons(document.querySelector('.modal-left'));

  // Staggered Entrance Animations
  const leftPanel = document.querySelector('.modal-left');
  const rightPanel = document.querySelector('.modal-right');

  if (leftPanel && rightPanel) {
    const animElements = [
      ...leftPanel.children,
      ...rightPanel.children
    ];

    // Reset opacity and transform before animating
    animElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(15px)';
      el.style.transition = 'none';
    });

    // Trigger staggered animation on next frame
    requestAnimationFrame(() => {
      animElements.forEach((el, index) => {
        setTimeout(() => {
          el.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, index * 40 + 100); // 100ms base delay + 40ms per element
      });
    });
  }

  appState.questStartTime = performance.now();
  const topic = TOPICS.find(t => t.problems.some(p => p.id === prob.id));
  const availableLangs = prob.languages || (topic && topic.lang ? [topic.lang] : ['python']);
  const defaultLang = availableLangs[0] || 'python';
  appState.currentLang = defaultLang;

  // Language toggle UI
  const right = document.querySelector('#code-modal .modal-right');
  if (right) {
    let bar = document.getElementById('lang-toggle-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'lang-toggle-bar';
      bar.className = 'lang-toggle';
      right.prepend(bar);
    }
    if (availableLangs.length > 1) {
      bar.style.display = 'inline-flex';
      bar.innerHTML =
        '<span>Language:</span>' +
        '<div class="lang-pill-group">' +
        '<button type="button" class="lang-pill ' + (appState.currentLang === 'python' ? 'active' : '') + '" data-lang="python">Python</button>' +
        '<button type="button" class="lang-pill ' + (appState.currentLang === 'js' ? 'active' : '') + '" data-lang="js">JavaScript</button>' +
        '</div>';
      bar.querySelectorAll('.lang-pill').forEach(btn => {
        btn.onclick = () => {
          const targetLang = btn.getAttribute('data-lang');
          if (!targetLang || targetLang === appState.currentLang) return;
          switchLanguage(prob, targetLang);
        };
      });
    } else {
      bar.style.display = 'none';
    }
  }

  // Solution Reveal Button
  const solBtn = document.getElementById('modal-solution-btn');
  const isSolved = appState.state[prob.id] && appState.state[prob.id].done;
  const hasSolution = (appState.currentLang === 'python' && prob.solutionPy) || (appState.currentLang === 'js' && prob.solutionJs);

  if (solBtn) {
    solBtn.disabled = false;
    solBtn.style.opacity = '1';
    solBtn.style.pointerEvents = 'auto';

    if (isSolved && hasSolution) {
      solBtn.style.display = 'flex';
      solBtn.onclick = () => {
        const sol = appState.currentLang === 'python' ? prob.solutionPy : prob.solutionJs;
        document.getElementById('solution-code-display').textContent = sol;
        toggleSolutionView(true);
        showToast('sparkles', 'Reference Solution', 'Review the standard implementation.');
        playUI('reward');
      };
    } else {
      solBtn.style.display = 'none';
    }
  }
  const saved = appState.state[prob.id] || {};
  const langKey = appState.currentLang === 'js' ? 'codeJs' : (appState.currentLang === 'sql' ? 'codeSql' : 'codePy');
  const initialKey = appState.currentLang === 'js' ? 'initialCodeJs' : (appState.currentLang === 'sql' ? 'initialCodeSql' : 'initialCodePy');
  const fallbackInitial = prob.initialCode || '';
  const savedCode = saved[langKey] || prob[initialKey] || fallbackInitial;

  if (appState.editor) {
    appState.editor.toTextArea();
    appState.editor = null;
  }

  appState.editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
    mode: appState.currentLang === 'js' ? 'javascript' : (appState.currentLang === 'sql' ? 'text/x-sql' : 'python'),
    theme: 'codequest',
    lineNumbers: true,
    indentUnit: 4,
    tabSize: 4,
    indentWithTabs: false,
    matchBrackets: true,
    autoCloseBrackets: true,
    lineWrapping: false,
    extraKeys: {
      'Ctrl-Enter': () => window.runCode(),
      'Cmd-Enter': () => window.runCode(),
      'Ctrl-Space': (cm) => cm.showHint({ hint: getHints, refreshIcons: refreshIcons })
    },
    hintOptions: {
      hint: getHints,
      refreshIcons: refreshIcons,
      completeSingle: false,
      alignWithWord: true
    }
  });
  appState.editor.setValue(savedCode);

  // Auto-trigger hints
  appState.editor.on('inputRead', (cm, change) => {
    if (change.origin !== '+input') return;
    const text = change.text[0];
    if (/[a-zA-Z0-9_.]/.test(text)) {
      cm.showHint({ hint: getHints, completeSingle: false, refreshIcons: refreshIcons });
    }
  });

  let draftTimer = null;
  appState.editor.on('change', () => {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
      if (appState.currentQuestId) {
        if (!appState.state[appState.currentQuestId]) appState.state[appState.currentQuestId] = {};
        appState.state[appState.currentQuestId].code = appState.editor.getValue();
        localStorage.setItem('pythonQuest', JSON.stringify(appState.state));
      }
    }, 800);
  });

  const isBoss = topic && topic.id === 'boss';
  const modalEl = document.getElementById('code-modal');
  if (isBoss) {
    modalEl.classList.add('boss-mode');
    playThemeStinger('boss-start');
  } else {
    modalEl.classList.remove('boss-mode');
  }

  document.getElementById('run-code-btn').disabled =
    appState.currentLang === 'js' ? false : !appState.pyodideReady;

  modalEl.classList.add('open');
  setTimeout(() => { appState.editor.refresh(); appState.editor.focus(); }, 120);
}

export function showLevelUpModal(newLevel) {
  const lv = levelInfo(totalXP());
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay level-up-overlay open';
  overlay.innerHTML = `
    <div class="modal-content level-up-content">
      <div class="level-up-banner">LEVEL UP!</div>
      <div class="level-up-emoji"><i data-lucide="${lv.icon}"></i></div>
      <div class="level-up-rank">${lv.title}</div>
      <div class="level-up-name">${lv.name}</div>
      <p>Your spiritual pressure is rising!</p>
      <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">CONTINUE JOURNEY</button>
    </div>
  `;
  document.body.appendChild(overlay);
  refreshIcons();
  playThemeStinger('level-up');
  fireConfetti();
}

import { fetchYouTubeTitle } from '../core/sound.js';

export function initMusicPicker() {
  const container = document.getElementById('music-player-info');
  if (!container) return;

  const player = container.closest('.music-player');

  // Clear any existing picker
  const oldMenu = document.getElementById('music-picker-menu');
  if (oldMenu) oldMenu.remove();

  const wrapper = document.createElement('div');
  wrapper.className = 'music-custom-select';
  wrapper.id = 'music-picker-trigger';

  const currentTrack = MUSIC_STATIONS.find(s => s.id === appState.musicVibe) || MUSIC_STATIONS[0];
  wrapper.textContent = currentTrack.name;
  if (currentTrack.ytId) {
    fetchYouTubeTitle(currentTrack.ytId).then(title => {
      if (title) wrapper.textContent = title;
    });
  }

  const menu = document.createElement('div');
  menu.className = 'music-menu dropdown-menu';
  menu.id = 'music-picker-menu';

  const categories = {};
  MUSIC_STATIONS.forEach(s => {
    const cat = s.category || 'Other';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(s);
  });

  Object.keys(categories).forEach(cat => {
    const group = document.createElement('div');
    group.className = 'music-menu-group dropdown-section-label';
    group.textContent = cat;
    menu.appendChild(group);

    categories[cat].forEach(s => {
      const item = document.createElement('div');
      item.className = 'music-menu-item dropdown-item';
      if (s.id === appState.musicVibe) item.classList.add('active');
      item.textContent = s.name;

      if (s.ytId) {
        fetchYouTubeTitle(s.ytId).then(title => {
          if (title) item.textContent = title;
        });
      }

      item.onclick = (e) => {
        e.stopPropagation();
        setVibe(s.id);
        playUI('click');
        menu.classList.remove('show');
      };
      menu.appendChild(item);
    });
  });

  wrapper.onclick = (e) => {
    e.stopPropagation();
    import('../core/sound.js').then(m => m.recordInteraction());
    const isShowing = menu.classList.contains('show');
    // Close other menus if any
    document.querySelectorAll('.music-menu.show').forEach(m => m.classList.remove('show'));

    if (!isShowing) {
      const rect = wrapper.getBoundingClientRect();
      menu.style.top = (rect.bottom + 8) + 'px';
      menu.style.left = (rect.left + rect.width / 2) + 'px';
      menu.style.transform = 'translateX(-50%)';
      menu.classList.add('show');
    }
    playUI('pop');
  };

  if (!window._musicMenuListenerAdded) {
    document.addEventListener('click', () => {
      document.querySelectorAll('.music-menu.show').forEach(m => m.classList.remove('show'));
    });
    window._musicMenuListenerAdded = true;
  }

  container.appendChild(wrapper);
  document.body.appendChild(menu);
}

function switchLanguage(prob, targetLang) {
  if (!appState.editor) return;
  const topic = TOPICS.find(t => t.problems.some(p => p.id === prob.id));
  const availableLangs = prob.languages || (topic && topic.lang ? [topic.lang] : ['python']);
  if (!availableLangs.includes(targetLang)) return;

  // Save current code under current language bucket
  if (!appState.state[prob.id]) appState.state[prob.id] = {};
  const currentKey = appState.currentLang === 'js' ? 'codeJs' : (appState.currentLang === 'sql' ? 'codeSql' : 'codePy');
  appState.state[prob.id][currentKey] = appState.editor.getValue();
  saveState();

  appState.currentLang = targetLang;

  const saved = appState.state[prob.id] || {};
  const langKey = appState.currentLang === 'js' ? 'codeJs' : (appState.currentLang === 'sql' ? 'codeSql' : 'codePy');
  const initialKey = appState.currentLang === 'js' ? 'initialCodeJs' : (appState.currentLang === 'sql' ? 'initialCodeSql' : 'initialCodePy');
  const fallbackInitial = prob.initialCode || '';
  const nextCode = saved[langKey] || prob[initialKey] || fallbackInitial;

  const editorMode = appState.currentLang === 'js' ? 'javascript' : (appState.currentLang === 'sql' ? 'text/x-sql' : 'python');
  appState.editor.setOption('mode', editorMode);
  appState.editor.setValue(nextCode);

  const runBtn = document.getElementById('run-code-btn');
  if (runBtn) {
    runBtn.disabled = appState.currentLang === 'js' ? false : !appState.pyodideReady;
  }

  // Update pills
  const bar = document.getElementById('lang-toggle-bar');
  if (bar) {
    bar.querySelectorAll('.lang-pill').forEach(btn => {
      const lang = btn.getAttribute('data-lang');
      if (lang === appState.currentLang) btn.classList.add('active');
      else btn.classList.remove('active');
    });
  }
}

export function closeModal() {
  document.getElementById('code-modal').classList.remove('open');
  if (appState.currentQuestId && appState.editor) {
    if (!appState.state[appState.currentQuestId]) appState.state[appState.currentQuestId] = {};
    const key = appState.currentLang === 'js' ? 'codeJs' : 'codePy';
    appState.state[appState.currentQuestId][key] = appState.editor.getValue();
    localStorage.setItem('pythonQuest', JSON.stringify(appState.state));
  }
}

export function toggleModalHint() {
  const box = document.getElementById('modal-hint-box');
  const btn = document.getElementById('modal-hint-btn');
  if (box.classList.contains('open')) {
    box.classList.remove('open');
    btn.innerHTML = '<i data-lucide="lightbulb-off"></i> Reveal Hint';
  } else {
    box.classList.add('open');
    btn.innerHTML = '<i data-lucide="lightbulb"></i> Hide Hint';
  }
  refreshIcons();
}

export function showToast(icon, title, sub) {
  document.getElementById('toast-icon').innerHTML = `<i data-lucide="${icon}"></i>`;
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-sub').textContent = sub;
  refreshIcons(document.getElementById('toast'));
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

export function fireConfetti() {
  confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 }, colors: ['#8b5cf6', '#22d3ee', '#fbbf24', '#34d399', '#fb923c'] });
}

export function spawnEmojis(icon) {
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'float-emoji';
      el.innerHTML = `<i data-lucide="${icon}"></i>`;
      el.style.left = (20 + Math.random() * 60) + 'vw';
      el.style.bottom = '80px';
      document.body.appendChild(el);
      refreshIcons(el);
      setTimeout(() => el.remove(), 1300);
    }, i * 120);
  }
}

export function triggerReiatsu() {
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const r = document.createElement('div');
      r.className = 'reiatsu';
      const size = 150 + Math.random() * 400;
      r.style.width = size + 'px';
      r.style.height = size + 'px';
      r.style.left = (Math.random() * 100) + 'vw';
      r.style.top = (Math.random() * 100) + 'vh';
      document.body.appendChild(r);
      setTimeout(() => r.remove(), 2000);
    }, i * 120);
  }
}

// ===================== MUSIC PLAYER UI SYNC =====================
window.addEventListener('app:music:change', (e) => {
  const { station } = e.detail;
  const trigger = document.getElementById('music-picker-trigger');
  if (trigger) trigger.textContent = station.name;

  // Update active state in menu
  const menu = document.getElementById('music-picker-menu');
  if (menu) {
    menu.querySelectorAll('.music-menu-item').forEach(item => {
      item.classList.toggle('active', item.textContent === station.name);
    });
  }
});

window.addEventListener('app:music:state', (e) => {
  const { isPaused } = e.detail;
  const btn = document.getElementById('play-pause-btn');
  if (btn) {
    btn.innerHTML = isPaused ? '<i data-lucide="play"></i>' : '<i data-lucide="pause"></i>';
    refreshIcons(btn);
  }
});

// Sync initial values
window.addEventListener('DOMContentLoaded', () => {
  const currentTrack = MUSIC_STATIONS.find(s => s.id === appState.musicVibe) || MUSIC_STATIONS[0];
  const trigger = document.getElementById('music-picker-trigger');
  if (trigger) trigger.textContent = currentTrack.name;

  const menu = document.getElementById('music-picker-menu');
  if (menu) {
    menu.querySelectorAll('.music-menu-item').forEach(item => {
      item.classList.toggle('active', item.textContent === currentTrack.name);
    });
  }
});

// ===================== STREAK HEATMAP =====================
export function renderHeatmap() {
  const container = document.getElementById('heatmap-container');
  if (!container) return;

  const today = new Date();
  const currentYear = today.getFullYear();
  const log = new Set(appState.state._meta.activityLog || []);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  let html = '<div class="heatmap-inner month-wise">';

  // Render months from Jan down to current month
  for (let m = 0; m <= today.getMonth(); m++) {
    const startOfMo = new Date(currentYear, m, 1);
    const endOfMo = new Date(currentYear, m + 1, 0);
    const lastDay = m === today.getMonth() ? today.getDate() : endOfMo.getDate();

    html += `<div class="month-block">
      <div class="month-name">${monthNames[m]}</div>
      <div class="heatmap-day-labels">
        ${dayNames.map(d => `<span>${d}</span>`).join('')}
      </div>
      <div class="heatmap-grid">`;

    // Initial offset for the first day of the month
    const startDow = startOfMo.getDay();
    for (let g = 0; g < startDow; g++) html += '<div class="heatmap-cell empty"></div>';

    for (let day = 1; day <= lastDay; day++) {
      const d = new Date(currentYear, m, day);
      const iso = getLocalDataString(d);
      const active = log.has(iso);
      const isToday = iso === getLocalDataString(today);
      const cls = ['heatmap-cell', active ? 'active' : '', isToday ? 'today' : ''].filter(Boolean).join(' ');
      html += `<div class="${cls}" title="${iso} : ${active ? 'Active' : 'No Activity'}"></div>`;
    }

    html += '</div></div>';
  }

  const streak = appState.state._meta.streak || 0;
  const totalActive = [...log].filter(iso => iso.startsWith(currentYear.toString())).length;

  html += `</div>
  <div class="heatmap-legend">
    <span><i data-lucide="flame"></i> ${streak} day streak</span>
    <span><i data-lucide="calendar-days"></i> ${totalActive} active days in ${currentYear}</span>
    <div class="heatmap-scale"><span>Less</span>
      <div class="heatmap-cell"></div><div class="heatmap-cell active" style="opacity:0.35"></div>
      <div class="heatmap-cell active" style="opacity:0.65"></div><div class="heatmap-cell active"></div>
    <span>More</span></div>
  </div>`;

  container.innerHTML = html;
  const subtextEl = document.getElementById('heatmap-subtext');
  if (subtextEl) subtextEl.textContent = `Activity in ${currentYear}`;
  refreshIcons();
}

// ===================== KEYBOARD TAB NAVIGATION =====================
document.addEventListener('keydown', (e) => {
  const tag = document.activeElement.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;
  if (document.querySelector('.modal-overlay.open')) return;

  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault();
    const idx = TOPICS.findIndex(t => t.id === appState.currentTab);
    let next = e.key === 'ArrowLeft' ? idx - 1 : idx + 1;
    if (next < 0) next = TOPICS.length - 1;
    if (next >= TOPICS.length) next = 0;
    appState.currentTab = TOPICS[next].id;
    difficultyFilter = 'all';
    renderTabs();
    renderContent();
    const activeBtn = document.getElementById('tab-' + TOPICS[next].id);
    if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
});

// ===================== SURPRISE ME =====================
export function openSurpriseQuest() {
  const unsolved = TOPICS.flatMap(t => t.problems).filter(p => !(appState.state[p.id] && appState.state[p.id].done));
  const pool = unsolved.length > 0 ? unsolved : TOPICS.flatMap(t => t.problems);
  const pick = pool[Math.floor(Math.random() * pool.length)];
  if (!pick) return;
  const topic = TOPICS.find(t => t.problems.some(p => p.id === pick.id));
  if (topic) {
    appState.currentTab = topic.id;
    difficultyFilter = 'all';
    renderTabs();
    renderContent();
  }
  setTimeout(() => openCodeModal(pick), 80);
}
window.openSurpriseQuest = openSurpriseQuest;

export function toggleSolutionView(show) {
  const solView = document.getElementById('solution-view');
  if (!solView) return;
  if (show) {
    solView.style.display = 'block';
    solView.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    solView.style.display = 'none';
  }
}
window.toggleSolutionView = toggleSolutionView;

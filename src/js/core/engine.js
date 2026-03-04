// ===================== PYODIDE & CODE RUNNER =====================
import { loadPyodide } from 'pyodide';

import { appState } from './state.js';
import { totalXP, levelInfo, saveState, addXP, getLocalDataString } from './state.js';
import { playSound } from './sound.js';
import { TOPICS } from '../data/data.js';
import { updateHUD } from '../ui/ui.js';
import { handleQuestComplete, checkAchievement } from '../features/rewards.js';
import { updateLeaderboard } from '../features/leaderboard.js';

export async function initPyodide() {
  const statusEl = document.getElementById('compiler-status');
  statusEl.textContent = '🐍 Loading Pyodide Engine...';
  try {
    // Switch to official CDN for reliable package fetching (sqlite3, etc)
    appState.pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/"
    });
    // sqlite3 is now reliably fetched from the CDN
    await appState.pyodide.loadPackage('sqlite3');
    appState.pyodideReady = true;
    statusEl.innerHTML = '<span style="color:var(--rp-foam)">🟢 Python Engine Ready</span>';
    const runBtn = document.getElementById('run-code-btn');
    if (runBtn) runBtn.disabled = false;
  } catch (err) {
    statusEl.innerHTML = '<span style="color:var(--rp-love)">🔴 Failed to load Python engine</span>';
    console.error(err);
  }
}

export async function runCode() {
  const prob = TOPICS.flatMap(t => t.problems).find(p => p.id === appState.currentQuestId);
  if (!prob) return;

  const topic = TOPICS.find(t => t.problems.some(p => p.id === appState.currentQuestId));
  const lang = appState.currentLang || (topic && topic.lang) || 'python';
  const userCode = appState.editor.getValue();
  const terminal = document.getElementById('terminal-output');
  const runBtn = document.getElementById('run-code-btn');

  terminal.className = 'terminal running';
  terminal.textContent = 'Running tests...\n\n';
  runBtn.disabled = true;
  runBtn.textContent = 'Running...';

  try {
    if (lang === 'js') {
      terminal.textContent = ''; // Explicitly clear before JS execution logs
      const logs = [];
      const origLog = console.log;
      console.log = (...args) => {
        const formattedArgs = args.map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        logs.push(formattedArgs);
        origLog(...args);
      };

      const origError = console.error;
      console.error = (...args) => {
        const formattedArgs = args.map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        logs.push('[Error] ' + formattedArgs);
        origError(...args);
      };

      try {
        const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
        const testCode = prob.testCodeJs || prob.testCode;
        const fullCode = userCode + '\n' + testCode;
        await new AsyncFunction(fullCode)();
        if (logs.length) {
          // Join logs with double newlines for clear separation
          terminal.textContent += logs.join('\n\n') + '\n\n';
        }
      } finally {
        console.log = origLog;
        console.error = origError;
      }
    } else if (lang === 'sql') {
      if (!appState.pyodideReady) return;
      terminal.textContent = '';

      const setupSql = prob.setupSql || '';
      const validationPy = prob.validationPy || '';

      // Hidden Python bridge to run the SQL and validate
      const sqlBridge = `
import sqlite3
import json

# Setup in-memory DB
conn = sqlite3.connect(':memory:')
cursor = conn.cursor()

# 1. Run Setup
try:
    cursor.executescript("""${setupSql}""")
except Exception as e:
    print(f"Setup Error: {e}")
    raise

# 2. Run User SQL
user_sql = """${userCode}"""
try:
    # We allow multiple statements but usually users write one SELECT
    # If it's a single SELECT, we might want to print results automatically
    if user_sql.strip().upper().startswith('SELECT'):
        res = cursor.execute(user_sql).fetchall()
        if res:
            print("Query Results:")
            for row in res:
                print(list(row))
    else:
        cursor.executescript(user_sql)
except Exception as e:
    print(f"SQL Error: {e}")
    raise

# 3. Run Validation Logic
${validationPy}
`;

      appState.pyodide.setStdout({ batched: str => { terminal.textContent += str + '\n'; } });
      appState.pyodide.setStderr({ batched: str => { terminal.textContent += str + '\n'; } });
      await appState.pyodide.runPythonAsync(sqlBridge);
    } else {
      if (!appState.pyodideReady) return;
      const testCode = prob.testCodePy || prob.testCode;
      const fullCode = userCode + '\n\n# --- TESTS ---\n' + testCode;
      appState.pyodide.setStdout({ batched: str => { terminal.textContent += str + '\n'; } });
      appState.pyodide.setStderr({ batched: str => { terminal.textContent += str + '\n'; } });
      terminal.textContent = '';
      await appState.pyodide.runPythonAsync(fullCode);
    }

    playSound('success');
    const endTime = performance.now();
    const timeTaken = ((endTime - appState.questStartTime) / 1000).toFixed(2);

    appState.state._meta.combo = Math.min(3.0, appState.state._meta.combo + 0.2);
    const currentMultiplier = appState.state._meta.combo;

    terminal.textContent += '\n✅ SUCCESS: All tests passed!';
    terminal.textContent += '\n⏱️ Time to solve: ' + timeTaken + 's';
    updateLeaderboard(appState.currentQuestId, timeTaken);

    if (currentMultiplier > 1.0) terminal.textContent += '\n🔥 Combo Multiplier: ' + currentMultiplier.toFixed(1) + 'x';
    terminal.className = 'terminal success';

    const xpBefore = totalXP();
    let isNewSolve = false;

    if (!(appState.state[appState.currentQuestId] && appState.state[appState.currentQuestId].done)) {
      isNewSolve = true;
      if (!appState.state[appState.currentQuestId]) appState.state[appState.currentQuestId] = {};
      appState.state[appState.currentQuestId].done = true;
      const xpToGain = Math.floor(prob.xp * currentMultiplier);
      appState.state[appState.currentQuestId].xp = xpToGain;

      const key = lang === 'js' ? 'codeJs' : 'codePy';
      appState.state[appState.currentQuestId][key] = userCode;
      appState.state._meta.streak++;

      // Trigger XP addition for level-up detection
      addXP(0); // Check boundary after state update

      const speedsterTxt = timeTaken < 30 ? ' (Speedster! ⚡)' : '';
      handleQuestComplete(prob, xpBefore, speedsterTxt, currentMultiplier);
    } else {
      const key = lang === 'js' ? 'codeJs' : 'codePy';
      appState.state[appState.currentQuestId][key] = userCode;
    }

    if (isNewSolve) checkAchievement('first_blood');
    if (timeTaken < 30) checkAchievement('speed_demon');
    if (appState.state._meta.combo >= 3.0) checkAchievement('unstoppable');
    if (appState.sessionErrorsCount[appState.currentQuestId] >= 3) checkAchievement('persistence');
    if (prob.id.startsWith('boss')) checkAchievement('boss_slayer');

    // New achievements
    if (isNewSolve) {
      // Night Owl: solved after midnight
      const hour = new Date().getHours();
      if (hour >= 0 && hour < 5) checkAchievement('night_owl');

      // Log activity for heatmap
      const today = getLocalDataString();
      if (!appState.state._meta.activityLog) appState.state._meta.activityLog = [];
      if (!appState.state._meta.activityLog.includes(today)) {
        appState.state._meta.activityLog.push(today);
        // Keep last 90 days only
        if (appState.state._meta.activityLog.length > 90) {
          appState.state._meta.activityLog = appState.state._meta.activityLog.slice(-90);
        }
      }

      // All-Rounder: at least one quest done from every category
      const allCategoriesDone = TOPICS.every(t =>
        t.problems.some(p => appState.state[p.id] && appState.state[p.id].done)
      );
      if (allCategoriesDone) checkAchievement('all_rounder');

      // Polyglot: same quest solved in both py and js
      const savedQ = appState.state[appState.currentQuestId] || {};
      const hasPy = savedQ.codePy && savedQ.codePy.trim().length > 0;
      const hasJs = savedQ.codeJs && savedQ.codeJs.trim().length > 0;
      const isMultiLang = (prob.languages || []).includes('python') && (prob.languages || []).includes('js');
      if (isMultiLang && hasPy && hasJs) checkAchievement('polyglot');

      // Combo King: 5 consecutive solves at 3.0x combo
      if (appState.state._meta.combo >= 3.0) {
        appState.state._meta.comboKingCount = (appState.state._meta.comboKingCount || 0) + 1;
        if (appState.state._meta.comboKingCount >= 5) checkAchievement('combo_king');
      } else {
        appState.state._meta.comboKingCount = 0;
      }
    }

    appState.sessionErrorsCount[appState.currentQuestId] = 0;
    saveState();
    updateHUD();
  } catch (err) {
    playSound('error');
    appState.state._meta.combo = 1.0;
    saveState();
    appState.sessionErrorsCount[appState.currentQuestId] = (appState.sessionErrorsCount[appState.currentQuestId] || 0) + 1;

    terminal.className = 'terminal error';
    const msg = err.toString().replace(/File "<exec>", /g, '');
    terminal.textContent += '\n' + msg;
  } finally {
    runBtn.disabled = false;
    runBtn.textContent = '▶ Run Tests';
  }
}

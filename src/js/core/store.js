// ===================== STORE =====================

/**
 * Base Store class for reactive state management.
 */
class BaseStore {
  constructor() {
    this.subscribers = new Set();
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify(data) {
    this.subscribers.forEach(callback => callback(data));
  }
}

/**
 * GameStore manages the application state, persistence, and reactivity.
 */
class GameStore extends BaseStore {
  constructor() {
    super();
    this.STORAGE_KEY = 'pythonQuest';
    this.state = this._loadInitialState();
    
    // Session-only state (not persisted)
    this.session = {
      currentTab: 'ds',
      currentQuestId: null,
      currentLang: null,
      pyodideReady: false,
      pyodide: null,
      editor: null,
      questStartTime: null,
      sessionErrorsCount: {},
      onLevelUp: null
    };

    // Proxy the state to automatically save on changes
    this.state = new Proxy(this.state, {
      set: (target, prop, value) => {
        target[prop] = value;
        this.save();
        this.notify({ type: 'state', prop, value });
        return true;
      }
    });
  }

  _loadInitialState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      const parsed = (saved && saved !== 'undefined') ? JSON.parse(saved) : {};
      
      // Ensure basic structure exists
      if (!parsed._meta) {
        parsed._meta = this._getDefaultMeta();
      } else {
        // Merge with defaults to ensure new fields are present
        parsed._meta = { ...this._getDefaultMeta(), ...parsed._meta };
      }
      
      return parsed;
    } catch (e) {
      console.error('Failed to parse state:', e);
      return { _meta: this._getDefaultMeta() };
    }
  }

  _getDefaultMeta() {
    return {
      achievements: [],
      combo: 1.0,
      streak: 0,
      streakDate: '',
      isSoundEnabled: true,
      isMusicPaused: false,
      musicVibe: 'none',
      daily: { date: '', id: '' },
      leaderboard: {},
      activityLog: [],
      dailyStreak: 0,
      lastDailyCompleted: '',
      comboKingCount: 0
    };
  }

  save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
  }

  // Helper getters for meta fields
  get meta() { return this.state._meta; }

  // Session state helpers
  setSession(key, value) {
    this.session[key] = value;
    this.notify({ type: 'session', key, value });
  }

  getSession(key) {
    return this.session[key];
  }
}

export const store = new GameStore();
window.store = store; // For debugging

// ===================== SOUND ENGINE =====================

import { appState } from './state.js';
import { MUSIC_STATIONS } from '../data/music.js';
import { getTrack, saveTrack } from './audioStore.js';
// Removed UI import to avoid circular dependency

const DEBUG_SOUND = false;

// ── Local Audio Server (using yt-dlp) ──
const LOCAL_SERVER_URL = 'http://localhost:3001';

/**
 * tryLocalServer(videoId)
 * -  Tries to download the track via the local backend (server/index.js).
 * -  On success: plays audio immediately via bgMusic and saves a blob to IndexedDB.
 */
async function tryLocalServer(videoId) {
  try {
    console.log(`🏠 [LocalServer] Requesting download for ${videoId}…`);
    const res = await fetch(`${LOCAL_SERVER_URL}/download/${videoId}`, {
      signal: AbortSignal.timeout(60000), // Downloads can take a while
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn('❌ [LocalServer] Error:', err);
      return false;
    }

    const data = await res.json();
    if (data.success && data.url) {
      console.log('✅ [LocalServer] Track ready:', data.url);

      // Play it immediately via bgMusic
      currentYtId = null;
      cleanupObjectURL();
      bgMusic.src = data.url;
      bgMusic.load();
      if (appState.isSoundEnabled && hasInteracted && !appState.isMusicPaused) {
        bgMusic.play().catch(() => { });
      }

      window.dispatchEvent(new CustomEvent('app:toast', {
        detail: { icon: 'download', title: 'Track Downloaded', sub: 'Saving to persistent cache…' }
      }));

      // Background cache
      fetch(data.url)
        .then(r => r.blob())
        .then(blob => saveTrack(videoId, blob))
        .then(() => console.log(`💾 [LocalServer] Cached ${videoId} in IndexedDB`))
        .catch(e => console.warn('[LocalServer] Cache failed:', e));

      return true;
    }
  } catch (e) {
    if (e.name === 'TypeError' && e.message === 'Failed to fetch') {
      console.warn('⚠️ [LocalServer] unreachable. Make sure "npm run server" is running.');
      window.dispatchEvent(new CustomEvent('app:toast', {
        detail: { icon: 'server-off', title: 'Server Offline', sub: 'Run "npm run server" to enable downloads.' }
      }));
    } else {
      console.warn(`⚠️ [LocalServer] failed:`, e.message);
    }
  }
  return false;
}

const AudioCtx = window.AudioContext || window.webkitAudioContext;
let _actx = null;
function getACtx() {
  if (!_actx) {
    _actx = new AudioCtx();
    if (DEBUG_SOUND) console.log('🔊 AudioContext initialized');
  }
  return _actx;
}

let hasInteracted = false;
let ytPlayer = null;
let ytReady = false;
let currentYtId = null;
let lastErrorVideoId = null;
let currentThemeId = null;
let currentObjectURL = null;

function cleanupObjectURL() {
  if (currentObjectURL) {
    URL.revokeObjectURL(currentObjectURL);
    currentObjectURL = null;
  }
}

import YouTubePlayer from 'youtube-player';
import { COLOR_SCHEMES } from '../data/themeData.js';

// YouTube initialization
const setupYTPlayer = () => {
  if (ytPlayer) return;

  let initialStationId = appState.musicVibe;
  if (initialStationId === 'none') {
    const activeThemeId = localStorage.getItem('cq-theme') || 'minimal-mist';
    const scheme = COLOR_SCHEMES.find(s => s.id === activeThemeId);
    if (scheme && scheme.musicStationId) {
      initialStationId = scheme.musicStationId;
    }
  }

  const initialStation = MUSIC_STATIONS.find(s => s.id === initialStationId);
  const initialVideoId = initialStation?.ytId || 'dQw4w9WgXcQ';
  const shouldAutoplay = 0; // Better to let interaction trigger playback to respect browser policies

  ytPlayer = YouTubePlayer('yt-player-container', {
    height: '0',
    width: '0',
    videoId: initialVideoId,
    playerVars: {
      'autoplay': shouldAutoplay,
      'controls': 0,
      'disablekb': 1,
      'fs': 0,
      'rel': 0,
      'showinfo': 0,
      'enablejsapi': 1,
      'origin': window.location.origin,
      'widget_referrer': window.location.origin,
      'mute': 0,
      'loop': 1,
      'playlist': initialVideoId // Required for looping single video
    }
  });

  let isRecovering = false;

  ytPlayer.on('ready', () => {
    if (DEBUG_SOUND) console.log('✅ YT Player Ready');
    ytReady = true;
    // Don't auto-play here, let initSound handle interaction or setVibe handle change
    if (appState.musicVibe !== 'none') {
      const station = MUSIC_STATIONS.find(s => s.id === appState.musicVibe);
      if (station && station.ytId) {
        currentYtId = station.ytId;
        fetchYouTubeTitle(station.ytId).then(title => {
          const finalStation = { ...station, name: title || station.name };
          window.dispatchEvent(new CustomEvent('app:music:change', { detail: { station: finalStation } }));
        });
      }
    } else {
      // if theme default
      fetchYouTubeTitle(initialVideoId).then(title => {
        window.dispatchEvent(new CustomEvent('app:music:change', { detail: { station: { name: title || 'Theme Default' } } }));
      });
    }
  });

  ytPlayer.on('stateChange', (event) => {
    const data = event.data;
    const states = { '-1': 'unstarted', '0': 'ended', '1': 'playing', '2': 'paused', '3': 'buffering', '5': 'video cued' };
    if (DEBUG_SOUND) console.log(`🎵 YT State Change: ${states[data] || data}`);

    if (isRecovering) return;

    // Manual loop fallback if playlist param fails
    if (data === 0 && appState.isSoundEnabled && !appState.isMusicPaused) {
      ytPlayer.playVideo();
    }

    if ((data === -1 || data === 5) && appState.isSoundEnabled && hasInteracted && appState.musicVibe !== 'none' && !appState.isMusicPaused) {
      if (currentYtId !== lastErrorVideoId) {
        ytPlayer.playVideo().catch(() => { });
      }
    }
  });

  ytPlayer.on('error', (e) => {
    const data = e.data;
    console.error(`❌ YT Player Error [${data}]`);

    if (isRecovering) return;
    isRecovering = true;

    // Capture the blocked ID before we clear state
    const blockedId = currentYtId;
    lastErrorVideoId = blockedId;

    if (data === 150 || data === 101 || data === 100 || data === 2) {
      if (!blockedId) {
        // No valid ID to retry — bail out immediately
        isRecovering = false;
        return;
      }
      console.warn(`⚠️ Video [${blockedId}] is blocked/restricted. Trying local server…`);
      window.dispatchEvent(new CustomEvent('app:toast', {
        detail: { icon: 'music-2', title: 'Track Blocked', sub: 'Starting local download…' }
      }));

      // Stop the broken YT player
      ytPlayer.stopVideo().catch(() => { });
      currentYtId = null;

      // Try local server → if that fails, fall back to lofi
      tryLocalServer(blockedId).then(success => {
        if (!success) {
          console.warn('[LocalServer] Download failed. Falling back to lofi.');
          window.dispatchEvent(new CustomEvent('app:toast', {
            detail: { icon: 'wifi-off', title: 'Download Failed', sub: 'Switching to lofi stream…' }
          }));
          setVibe('lofi');
        }
      });
    }

    setTimeout(() => { isRecovering = false; }, 2000);
  });
};

setupYTPlayer();

function playBeep(freq, type, duration, vol) {
  if (!appState.isSoundEnabled) return;
  try {
    const ctx = getACtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol || 0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) { }
}

export function playSound(type) {
  if (!appState.isSoundEnabled) return;
  if (type === 'success') {
    playBeep(880, 'sine', 0.15, 0.25);
    setTimeout(() => playBeep(1320, 'sine', 0.2, 0.2), 100);
    setTimeout(() => playBeep(1760, 'sine', 0.25, 0.15), 200);
  } else if (type === 'error') {
    playBeep(220, 'sawtooth', 0.3, 0.2);
    setTimeout(() => playBeep(180, 'sawtooth', 0.2, 0.15), 150);
  }
}

const DEFAULT_BG_SRC = '/assets/media/Noragami_Opening_2_128KBPS.mp4';
const initialVibeId = appState.musicVibe;
const initialStation = MUSIC_STATIONS.find(s => s.id === initialVibeId);
const initialSrc = (initialStation && initialStation.src) ? initialStation.src : DEFAULT_BG_SRC;

const bgMusic = new Audio(initialSrc);
bgMusic.loop = true;
bgMusic.volume = 0.25;

export function setVibe(vibeId, tid = null) {
  const station = MUSIC_STATIONS.find(s => s.id === vibeId);
  if (!station) return;
  appState.musicVibe = vibeId; // This triggers persistence via getter/setter in state.js
  currentThemeId = tid;

  // STOP ALL FIRST
  cleanupObjectURL();
  bgMusic.pause();
  if (ytReady && ytPlayer && ytPlayer.stopVideo) {
    ytPlayer.stopVideo();
    currentYtId = null;
  }

  if (vibeId === 'none') {
    const schemes = window.COLOR_SCHEMES || [];
    const theme = schemes.find(s => s.id === (tid || window.activeThemeId || 'minimal-mist'));
    setThemeMusic(theme ? (theme.musicStationId || theme.music || DEFAULT_BG_SRC) : DEFAULT_BG_SRC, tid);
    return;
  }

  if (station.ytId) {
    if (DEBUG_SOUND) console.log(`📡 Switching to YouTube: ${station.name} (${station.ytId})`);

    // ── Cache-first: check IndexedDB for a previously Cobalt-downloaded blob ──
    getTrack(station.ytId).then(cachedBlob => {
      if (cachedBlob) {
        console.log(`💾 [Cache] Playing ${station.ytId} from IndexedDB blob`);
        currentYtId = null; // bgMusic mode
        cleanupObjectURL();
        currentObjectURL = URL.createObjectURL(cachedBlob);
        bgMusic.src = currentObjectURL;
        bgMusic.load();
        if (appState.isSoundEnabled && hasInteracted && !appState.isMusicPaused) {
          bgMusic.play().catch(() => { });
        }
        return; // skip YouTube player entirely
      }

      // No cache → use YouTube player as normal
      currentYtId = station.ytId;
      if (ytReady && ytPlayer) {
        ytPlayer.loadVideoById({
          videoId: station.ytId,
          playlist: station.ytId
        });
        ytPlayer.setVolume(bgMusic.volume * 100);
        if (appState.isSoundEnabled && hasInteracted && !appState.isMusicPaused) {
          ytPlayer.playVideo();
        }
      }
    });

    fetchYouTubeTitle(station.ytId).then(title => {
      const finalStation = { ...station, name: title || station.name };
      window.dispatchEvent(new CustomEvent('app:music:change', { detail: { station: finalStation } }));
    });
  } else if (station.src) {
    // Explicitly reset YouTube if moving to MP3
    currentYtId = null;
    bgMusic.src = station.src;
    bgMusic.load();
    if (appState.isSoundEnabled && hasInteracted && !appState.isMusicPaused) {
      bgMusic.play().catch(() => {
        if (DEBUG_SOUND && tid) console.log(`🎵 Audio failure for theme: ${tid}`);
      });
    }
    window.dispatchEvent(new CustomEvent('app:music:change', { detail: { station } }));
  }
}

export function playUI(type) {
  if (!appState.isSoundEnabled) return;
  if (type === 'click') playBeep(600, 'sine', 0.05, 0.1);
  if (type === 'hover') playBeep(440, 'sine', 0.03, 0.05);
}

const ytTitleCache = {};

export async function fetchYouTubeTitle(ytId) {
  if (ytTitleCache[ytId]) return ytTitleCache[ytId];
  try {
    console.log(`🎵 Fetching real title for YouTube ID: ${ytId}...`);
    const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${ytId}`);
    const data = await res.json();
    if (data && data.title) {
      console.log(`✅ Loaded real title: "${data.title}"`);
      ytTitleCache[ytId] = data.title;
      return data.title;
    }
  } catch (e) {
    console.warn(`⚠️ Could not fetch YT title for ${ytId}`, e);
  }
  return null;
}

export function setThemeMusic(idOrSrc, tid = null) {
  const station = MUSIC_STATIONS.find(s => s.id === idOrSrc);

  // STOP ALL FIRST
  cleanupObjectURL();
  bgMusic.pause();
  if (ytReady && ytPlayer && ytPlayer.stopVideo) {
    ytPlayer.stopVideo();
    currentYtId = null;
  }

  if (station) {
    if (DEBUG_SOUND) console.log(`🎵 Applying Theme Music Station: ${station.name}`);
    appState.musicVibe = idOrSrc; // Persist the theme station ID
    currentThemeId = tid;

    if (station.ytId) {
      // ── Cache-first: check IndexedDB for themes too ──
      getTrack(station.ytId).then(cachedBlob => {
        if (cachedBlob) {
          console.log(`💾 [Cache] Playing theme track ${station.ytId} from IndexedDB blob`);
          currentYtId = null; // bgMusic mode
          cleanupObjectURL();
          currentObjectURL = URL.createObjectURL(cachedBlob);
          bgMusic.src = currentObjectURL;
          bgMusic.load();
          if (hasInteracted) {
            appState.isMusicPaused = false;
            bgMusic.play().catch(() => { });
          }
          return;
        }

        // No cache → use YouTube player
        currentYtId = station.ytId;
        if (ytReady && ytPlayer) {
          ytPlayer.loadVideoById({
            videoId: station.ytId,
            playlist: station.ytId
          });
          ytPlayer.setVolume(bgMusic.volume * 100);
          if (hasInteracted) {
            appState.isMusicPaused = false;
            ytPlayer.playVideo();
          }
        }
      });

      fetchYouTubeTitle(station.ytId).then(title => {
        const finalStation = { ...station, name: title || station.name };
        window.dispatchEvent(new CustomEvent('app:music:change', { detail: { station: finalStation } }));
      });
      return;
    } else if (station.src) {
      bgMusic.src = station.src;
      bgMusic.load();
      if (hasInteracted) {
        appState.isMusicPaused = false;
        bgMusic.play().catch(() => {
          if (DEBUG_SOUND && tid) console.log(`🎵 Audio failure for theme: ${tid}`);
        });
      }
    }
    window.dispatchEvent(new CustomEvent('app:music:change', { detail: { station } }));
    return;
  }

  const isYT = idOrSrc && !idOrSrc.includes('.') && idOrSrc.length > 5;
  const next = idOrSrc || DEFAULT_BG_SRC;

  if (isYT) {
    appState.musicVibe = next; // Persist raw YT ID if provided
    currentYtId = next;
    if (ytReady && ytPlayer) {
      ytPlayer.loadVideoById({
        videoId: next,
        playlist: next
      });
      ytPlayer.setVolume(bgMusic.volume * 100);
      if (hasInteracted) {
        appState.isMusicPaused = false;
        ytPlayer.playVideo();
      }
    }
    fetchYouTubeTitle(next).then(title => {
      window.dispatchEvent(new CustomEvent('app:music:change', { detail: { station: { name: title || 'Theme Default' } } }));
    });
  } else {
    appState.musicVibe = next; // Persist raw src if provided
    bgMusic.src = next;
    bgMusic.load();
    if (hasInteracted) {
      appState.isMusicPaused = false;
      bgMusic.play().catch(() => {
        if (DEBUG_SOUND && tid) console.log(`🎵 Audio failure for theme: ${tid}`);
      });
    }
    window.dispatchEvent(new CustomEvent('app:music:change', { detail: { station: { name: 'Theme Default' } } }));
  }
}

export function playThemeStinger(themeId) {
  if (!appState.isSoundEnabled) return;
  try { getACtx().resume(); } catch (e) { }

  const seq = (notes, type = 'sine', step = 0.09, vol = 0.12) => {
    notes.forEach((f, i) => {
      setTimeout(() => playBeep(f, type, 0.12, vol), Math.floor(i * step * 1000));
    });
  };

  switch (themeId) {
    case 'naruto': seq([523, 659, 784, 659, 523], 'square', 0.085, 0.11); break;
    case 'one-piece': seq([392, 440, 392, 330, 392], 'triangle', 0.095, 0.12); break;
    case 'demon-slayer': seq([440, 523, 622, 523, 440], 'sawtooth', 0.085, 0.10); break;
    case 'jjk': seq([659, 622, 587, 659], 'sine', 0.08, 0.11); break;
    case 'level-up': seq([523, 659, 784, 1046], 'sine', 0.12, 0.15); break;
    case 'boss-start': seq([110, 123, 110, 98], 'sawtooth', 0.15, 0.15); break;
    default: break;
  }
}

export function toggleSound() {
  appState.isSoundEnabled = !appState.isSoundEnabled;
  if (appState.isSoundEnabled) {
    getACtx().resume();
    if (hasInteracted && !appState.isMusicPaused) {
      if (appState.musicVibe === 'none' || !currentYtId) {
        bgMusic.play().catch(() => { });
      } else if (ytReady && ytPlayer) {
        ytPlayer.playVideo();
      }
    }
  } else {
    bgMusic.pause();
    if (ytReady && ytPlayer && ytPlayer.pauseVideo) ytPlayer.pauseVideo();
  }

  // Sync Icons & UI State
  const player = document.querySelector('.music-player');
  const muteBtn = document.querySelector('.player-mute-btn i');

  if (player) {
    player.classList.toggle('is-muted', !appState.isSoundEnabled);
  }

  if (muteBtn) {
    muteBtn.setAttribute('data-lucide', appState.isSoundEnabled ? 'volume-2' : 'volume-x');
    if (window.refreshIcons) window.refreshIcons();
  }

  window.dispatchEvent(new CustomEvent('app:sound:state', { detail: { enabled: appState.isSoundEnabled } }));
}

export function updateVolume(val) {
  const vol = val / 100;
  bgMusic.volume = vol * 0.4;
  if (ytReady && ytPlayer && ytPlayer.setVolume) {
    ytPlayer.setVolume(vol * 100);
  }
  if (vol > 0) getACtx().resume();
  window.dispatchEvent(new CustomEvent('app:volume:change', { detail: { volume: val } }));
}

export function toggleMusicPause() {
  recordInteraction(); // Ensure first click play works
  appState.isMusicPaused = !appState.isMusicPaused;
  if (appState.isMusicPaused) {
    bgMusic.pause();
    if (ytReady && ytPlayer && ytPlayer.pauseVideo) ytPlayer.pauseVideo();
  } else {
    if (appState.isSoundEnabled && hasInteracted) {
      if (appState.musicVibe === 'none' || !currentYtId) {
        bgMusic.play().catch(() => { });
      } else if (ytReady && ytPlayer && ytPlayer.playVideo) {
        ytPlayer.playVideo();
      }
    }
  }
  window.dispatchEvent(new CustomEvent('app:music:state', { detail: { isPaused: appState.isMusicPaused } }));
}

export function nextTrack() {
  const currentIndex = MUSIC_STATIONS.findIndex(s => s.id === appState.musicVibe);
  let nextIndex = (currentIndex + 1) % MUSIC_STATIONS.length;
  if (MUSIC_STATIONS[nextIndex].id === 'none') nextIndex = (nextIndex + 1) % MUSIC_STATIONS.length;
  setVibe(MUSIC_STATIONS[nextIndex].id);
}

export function prevTrack() {
  const currentIndex = MUSIC_STATIONS.findIndex(s => s.id === appState.musicVibe);
  let prevIndex = (currentIndex - 1 + MUSIC_STATIONS.length) % MUSIC_STATIONS.length;
  if (MUSIC_STATIONS[prevIndex].id === 'none') prevIndex = (prevIndex - 1 + MUSIC_STATIONS.length) % MUSIC_STATIONS.length;
  setVibe(MUSIC_STATIONS[prevIndex].id);
}

export async function seekTo(percent) {
  if (currentYtId && ytReady && ytPlayer) {
    try {
      const duration = await ytPlayer.getDuration();
      if (duration > 0) {
        ytPlayer.seekTo(duration * percent / 100, true);
      }
    } catch (e) {
      console.error('YT Seeking Error:', e);
    }
  } else if (bgMusic && bgMusic.duration) {
    bgMusic.currentTime = bgMusic.duration * percent / 100;
  }
}



export function recordInteraction() {
  if (hasInteracted) return;
  hasInteracted = true;
  try {
    getACtx().resume();
    if (appState.isSoundEnabled && !appState.isMusicPaused) {
      if (currentYtId && ytReady && ytPlayer && ytPlayer.playVideo) {
        bgMusic.pause();
        ytPlayer.playVideo();
      } else if (appState.musicVibe === 'none' || !currentYtId) {
        bgMusic.play().catch(() => { });
      }
    }
  } catch (e) { }
}

export function initSound() {
  // Pre-load YouTube if needed
  if (appState.musicVibe !== 'none') {
    const station = MUSIC_STATIONS.find(s => s.id === appState.musicVibe);
    if (station && station.ytId) {
      currentYtId = station.ytId;
    }
  }

  document.addEventListener('click', recordInteraction, { once: false });

  // Progress Loop
  let progressInFlight = false;
  const updateProgress = async () => {
    if (progressInFlight) return;
    progressInFlight = true;

    try {
      const progressFill = document.getElementById('music-progress');
      if (!progressFill) {
        progressInFlight = false;
        requestAnimationFrame(updateProgress);
        return;
      }

      let percent = 0;
      if (currentYtId && ytReady && ytPlayer) {
        try {
          // YouTube API methods are often asynchronous or return promises
          const duration = await ytPlayer.getDuration();
          const current = await ytPlayer.getCurrentTime();
          if (duration > 0) percent = (current / duration) * 100;
        } catch (ytErr) {
          // Fallback if player state is not ready for methods
          percent = 0;
        }
      } else if (bgMusic && bgMusic.duration) {
        percent = (bgMusic.currentTime / bgMusic.duration) * 100;
      }

      // Clamp percent
      percent = Math.min(100, Math.max(0, percent));
      progressFill.style.width = `${percent}%`;
    } catch (e) {
      console.error('Progress Loop Error:', e);
    }

    progressInFlight = false;
    requestAnimationFrame(updateProgress);
  };
  requestAnimationFrame(updateProgress);
}

# Abyssal Code – The Ultimate Challenge

A gamified polyglot coding challenge app. Write Python and JavaScript in the browser, conquer quests, and dominate the abyss.

## Folder Structure

```
python-brush-up/
├── index.html          # Entry point
├── css/
│   ├── tokens.css      # CSS variables (theme tokens)
│   ├── base.css        # Reset + global base styles
│   ├── codemirror.css  # CodeMirror theme styles
│   ├── layout.css      # Page layout sections
│   ├── components.css  # Cards, badges, toast, achievements
│   ├── modals.css      # Modal + editor + terminal styles
│   ├── effects.css     # Animations + reiatsu FX
│   └── responsive.css  # Media queries
├── js/
│   ├── main.js         # Entry point, wires modules, init
│   ├── state.js        # State, XP, leveling, achievements
│   ├── sound.js        # Audio, beeps, background music
│   ├── engine.js       # Pyodide, Python/JS code runner
│   ├── ui.js           # HUD, tabs, modal, toast
│   ├── rewards.js      # Quest complete, achievements UI
│   ├── leaderboard.js  # Daily quest, leaderboard
│   ├── themes.js       # Color scheme system
│   └── data.js         # Quest data (TOPICS)
└── assets/
    └── media/
        └── Noragami_Opening_2_128KBPS.mp4   # Background music (place file here)
    └── themes/
        └── <themeId>/
            ├── bg.svg                      # Theme background image (included)
            └── music.mp3                   # Optional: add your own theme music
```

## Setup

1. Place `Noragami_Opening_2_128KBPS.mp4` in `assets/media/` for background music (optional).
2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:8080` in your browser.

## Features

- Python & JavaScript quests with in-browser execution (Pyodide)
- XP, levels, streaks, and combo multiplier
- Multiple color themes (Rosé Pine, Dracula, Nord, etc.)
- Daily challenge with 2x XP bonus
- Leaderboard and achievements

/**
 * First-Visit Tutorial Tooltip System
 * Shows a step-by-step guided tour to new users.
 * Remembered in localStorage so it only shows once.
 */

const TUTORIAL_KEY = 'cq-tutorial-done';

const STEPS = [
    {
        target: '.hero-title',
        title: '👋 Welcome to Abyssal Code!',
        text: 'A gamified coding challenge platform where you master Python & JavaScript through quests.',
        placement: 'bottom',
    },
    {
        target: '#daily-quest-box',
        title: '🔥 Daily Challenge',
        text: 'A new challenge every day with a 2× XP bonus! Complete it to keep your streak alive.',
        placement: 'bottom',
    },
    {
        target: '.xp-bar-section',
        title: '⚡ Your Progress',
        text: 'Track your XP, level, streak, and combo multiplier here. Solve more quests to level up!',
        placement: 'bottom',
    },
    {
        target: '#tabs-container',
        title: '🗂️ Quest Categories',
        text: 'Browse different topics like Loops, Functions, Arrays, and more. Use ← → keys to navigate.',
        placement: 'bottom',
    },
    {
        target: '.quest-card',
        title: '🃏 Quest Cards',
        text: 'Click any card to open the code editor. Solve the challenge, run your code, and earn XP!',
        placement: 'top',
    },
    {
        target: '.surprise-btn',
        title: '🎲 Surprise Me!',
        text: 'Feeling lucky? Click this to jump to a random unsolved quest. Or press `S` anytime!',
        placement: 'bottom',
    },
    {
        target: 'button[onclick="openThemePicker()"]',
        title: '🎨 Themes',
        text: 'Customize the entire app with 50+ themes inspired by editors, anime, Bollywood, Hollywood, and more.',
        placement: 'bottom',
    },
];

let currentStep = 0;
let overlay, tooltip, spotlight;

function getTargetEl(selector) {
    return document.querySelector(selector);
}

function getPlacement(targetEl, placement) {
    const rect = targetEl.getBoundingClientRect();
    const tooltipW = 320;
    const tooltipH = 150;
    const gap = 14;

    let top, left;
    if (placement === 'bottom') {
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2 - tooltipW / 2;
    } else {
        top = rect.top - tooltipH - gap;
        left = rect.left + rect.width / 2 - tooltipW / 2;
    }

    // Keep within viewport
    left = Math.max(12, Math.min(left, window.innerWidth - tooltipW - 12));
    top = Math.max(12, top);

    return { top, left, rect, placement };
}

function renderStep(step) {
    const { target, title, text, placement } = STEPS[step];
    const el = getTargetEl(target);

    if (!el) {
        // skip step if element not found
        if (step < STEPS.length - 1) { currentStep++; renderStep(currentStep); }
        else closeTutorial();
        return;
    }

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    requestAnimationFrame(() => {
        const { top, left, rect } = getPlacement(el, placement);

        // Spotlight
        spotlight.style.cssText = `
      top: ${rect.top - 6}px;
      left: ${rect.left - 6}px;
      width: ${rect.width + 12}px;
      height: ${rect.height + 12}px;
    `;

        // Tooltip content
        const isLast = step === STEPS.length - 1;
        const isFirst = step === 0;
        tooltip.innerHTML = `
      <div class="tut-header">
        <strong>${title}</strong>
        <button class="tut-close" id="tut-close-btn" title="Skip tour" aria-label="Close tutorial">✕</button>
      </div>
      <p class="tut-text">${text}</p>
      <div class="tut-footer">
        <span class="tut-progress">${step + 1} / ${STEPS.length}</span>
        <div class="tut-actions">
          ${!isFirst ? '<button class="tut-btn tut-prev" id="tut-prev-btn">← Prev</button>' : ''}
          <button class="tut-btn tut-next" id="tut-next-btn">${isLast ? '🎉 Done!' : 'Next →'}</button>
        </div>
      </div>
    `;

        // Position
        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;

        // Wire buttons
        document.getElementById('tut-close-btn').addEventListener('click', closeTutorial);
        document.getElementById('tut-next-btn').addEventListener('click', () => {
            if (isLast) closeTutorial();
            else { currentStep++; renderStep(currentStep); }
        });
        const prevBtn = document.getElementById('tut-prev-btn');
        if (prevBtn) prevBtn.addEventListener('click', () => { currentStep--; renderStep(currentStep); });

        tutorialEl.classList.remove('tut-hidden');
    });
}

let tutorialEl;

function buildDOM() {
    tutorialEl = document.createElement('div');
    tutorialEl.id = 'tutorial-root';
    tutorialEl.innerHTML = `
    <div id="tut-overlay"></div>
    <div id="tut-spotlight"></div>
    <div id="tut-tooltip" role="dialog" aria-modal="true" aria-label="Tutorial"></div>
  `;
    document.body.appendChild(tutorialEl);

    overlay = document.getElementById('tut-overlay');
    spotlight = document.getElementById('tut-spotlight');
    tooltip = document.getElementById('tut-tooltip');

    // Click on overlay outside spotlight closes tutorial
    overlay.addEventListener('click', closeTutorial);
}

function closeTutorial() {
    localStorage.setItem(TUTORIAL_KEY, '1');
    if (tutorialEl) {
        tutorialEl.classList.add('tut-hiding');
        setTimeout(() => tutorialEl?.remove(), 400);
    }
}

export function initTutorial() {
    if (localStorage.getItem(TUTORIAL_KEY)) return; // Already seen
    currentStep = 0;
    buildDOM();
    // Tiny delay so the page element positions are stable
    setTimeout(() => renderStep(currentStep), 600);
}

// Expose for dev testing: window.resetTutorial()
window.resetTutorial = () => {
    localStorage.removeItem(TUTORIAL_KEY);
    window.location.reload();
};

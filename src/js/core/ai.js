/**
 * AI CORE - Gemini API Integration
 */
import { store } from './store.js';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent';
const FALLBACK_URLS = [
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent',
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent'
];

export async function generateThemeFromAi(ytLink, description = '', overrideModel = null) {
    const apiKey = store.meta.aiApiKey;
    if (!apiKey) throw new Error('Missing Gemini API Key. Please enter it in the Aura Weaver settings.');

    // Inject "Aesthetic Entropy" and Specific Mood Intelligence
    const entropy = Math.random().toString(36).substring(7);
    const prompt = `
[ROLE: ELITE THEME ARCHITECT]
You are a legendary UI architect specializing in "Abyssal Code". You convert music metadata into high-end coding sanctuaries.

[CONTEXT]
Music Vibe: ${ytLink}
Mood Details: ${description || 'Highly experimental and unique.'}
Entropy Seed: ${entropy}

[MISSION: RADICAL DIVERSITY]
Every theme MUST be a departure from the last. Do NOT use generic vibrant purple/blue defaults unless specifically requested.
Choose ONE distinct aesthetic from this list (or invent a new hyper-specific one):
- "Midnight Neon" (Dark, sharp contrasts, cyan/magenta)
- "Deep Forest" (Earthy, obsidian, emerald, gold)
- "Imperial Gold" (Black, rich gold, royal purple)
- "Nordic Fog" (Slate, ice blue, frost white)
- "Solar Flare" (Deep maroon, orange, ember yellow)
- "Cybernetic Ghost" (Translucent, white, pale blue, sharp silver)
- "Toxic Waste" (Dark gray, neon lime, acid yellow)

[OUTPUT FORMAT]
Return ONLY valid JSON:
{
  "name": "Distinct Theme Name",
  "icon": "lucide-icon-name",
  "category": "aura",
  "mascotReaction": "vibe-consistent-reaction",
  "colors": {
    "bg1": "#base-background",
    "bg2": "#step-lighter",
    "bg3": "#ui-border-shade",
    "fg": "#brightest-text",
    "fg2": "#medium-text",
    "fg3": "#faint-text",
    "iris": "#primary-vibe-accent",
    "love": "#secondary-vibe-accent",
    "gold": "#warm/highlight-accent",
    "rose": "#soft-accent",
    "pine": "#cool/forest-accent",
    "foam": "#cyan/water-accent"
  },
  "glass": {
    "opacity": 0.1,
    "blur": "12px"
  }
}

[RULES]
- Return ONLY the JSON. No markdown tags.
- Use full HEX colors.
- Mascot: happy, dance, smile, wave, laugh, celebrate, yay, think, sleep, mad, confused.
- Icon: sparkles, zap, moon, code, sword, star, music, crown, ghost, flame, heart.
`;

    async function tryFetch(url, useJsonMode = true) {
        try {
            const body = {
                contents: [{ parts: [{ text: prompt }] }]
            };
            if (useJsonMode) body.generationConfig = { response_mime_type: "application/json" };

            const response = await fetch(`${url}?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { ok: false, status: response.status, message: errorData.error?.message || 'AI Offline' };
            }

            const data = await response.json();
            return { ok: true, data };
        } catch (e) {
            return { ok: false, message: e.message };
        }
    }

    let lastError = null;
    let urlsToTry = [];

    // If user selected a specific model, prioritize it
    if (overrideModel) {
        urlsToTry.push(`https://generativelanguage.googleapis.com/v1beta/models/${overrideModel}:generateContent`);
        urlsToTry.push(`https://generativelanguage.googleapis.com/v1/models/${overrideModel}:generateContent`);
    }

    // Add default and fallbacks
    urlsToTry = [...new Set([...urlsToTry, GEMINI_API_URL, ...FALLBACK_URLS])];

    for (const url of urlsToTry) {
        const modelName = url.split('/models/')[1].split(':')[0];
        let res = await tryFetch(url, true);
        if (!res.ok && res.status === 400) res = await tryFetch(url, false);

        if (res.ok) {
            const data = res.data;
            let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) continue;

            try {
                const cleaned = text.replace(/```json|```/g, '').trim();
                const theme = JSON.parse(cleaned);

                theme.id = 'ai-' + Date.now();
                theme.category = 'aura';
                theme.musicStationId = extractYoutubeId(ytLink);
                theme.dots = [theme.colors.iris, theme.colors.love, theme.colors.gold, theme.colors.rose, theme.colors.pine, theme.colors.foam];

                theme.vars = {
                    '--rp-bg': theme.colors.bg1,
                    '--rp-bg1': theme.colors.bg1,
                    '--rp-bg2': theme.colors.bg2,
                    '--rp-bg3': theme.colors.bg3,
                    '--rp-bg4': theme.colors.bg3,
                    '--rp-fg': theme.colors.fg,
                    '--rp-fg1': theme.colors.fg,
                    '--rp-fg2': theme.colors.fg2,
                    '--rp-fg3': theme.colors.fg3,
                    '--rp-love': theme.colors.love,
                    '--rp-gold': theme.colors.gold,
                    '--rp-rose': theme.colors.rose,
                    '--rp-pine': theme.colors.pine,
                    '--rp-foam': theme.colors.foam,
                    '--rp-iris': theme.colors.iris,
                    '--btn-p-bg': theme.colors.iris,
                    '--btn-p-fg': theme.colors.bg1,
                    '--btn-s-bg': `rgba(${hexToRgb(theme.colors.iris)}, 0.1)`,
                    '--btn-s-fg': theme.colors.iris,
                    '--glass-opacity': theme.glass.opacity.toString(),
                    '--glass-blur': theme.glass.blur
                };

                const customThemes = store.meta.customThemes || [];
                store.meta.customThemes = [theme, ...customThemes.filter(t => t.name !== theme.name)].slice(0, 15);

                const tokens = data.usageMetadata?.totalTokenCount || 500;
                updateTokenUsage(tokens);
                store.save();

                return theme;
            } catch (err) {
                console.warn(`JSON Parse Fail from ${modelName}`);
                continue;
            }
        }
        lastError = res.message;
    }

    const available = await listAvailableModels();
    let msg = lastError || 'Check internet connection.';
    if (available.length > 0) msg = `Model unreachable. Your available models: ${available.slice(0, 3).join(', ')}. Use discovery!`;
    throw new Error(msg);
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ?
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '100, 100, 100';
}

export async function listAvailableModels() {
    const apiKey = store.meta.aiApiKey;
    if (!apiKey) return [];
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
        const data = await response.json();
        if (data.models) {
            return data.models.filter(m => m.supportedGenerationMethods.includes('generateContent'))
                .map(m => m.name.replace('models/', ''));
        }
        return [];
    } catch (e) { return []; }
}

function updateTokenUsage(count) {
    const current = store.meta.aiTokenUsage || { session: 0, total: 0 };
    store.meta.aiTokenUsage = {
        session: current.session + count,
        total: current.total + count
    };
    const sessionEl = document.getElementById('aura-session-tokens');
    const totalEl = document.getElementById('aura-total-tokens');
    if (sessionEl) sessionEl.textContent = store.meta.aiTokenUsage.session;
    if (totalEl) totalEl.textContent = store.meta.aiTokenUsage.total;
}

export function extractYoutubeId(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
}

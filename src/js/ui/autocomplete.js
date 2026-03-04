/**
 * Custom Autocomplete Provider for CodeMirror 5
 */

const COMPLETIONS = {
    python: [
        { text: 'print()', type: 'function', icon: 'zap' },
        { text: 'len()', type: 'function', icon: 'zap' },
        { text: 'range()', type: 'function', icon: 'zap' },
        { text: 'enumerate()', type: 'function', icon: 'zap' },
        { text: 'zip()', type: 'function', icon: 'zap' },
        { text: 'list()', type: 'function', icon: 'zap' },
        { text: 'dict()', type: 'function', icon: 'zap' },
        { text: 'set()', type: 'function', icon: 'zap' },
        { text: 'int()', type: 'function', icon: 'zap' },
        { text: 'str()', type: 'function', icon: 'zap' },
        { text: 'float()', type: 'function', icon: 'zap' },
        { text: 'bool()', type: 'function', icon: 'zap' },
        { text: 'sum()', type: 'function', icon: 'zap' },
        { text: 'min()', type: 'function', icon: 'zap' },
        { text: 'max()', type: 'function', icon: 'zap' },
        { text: 'abs()', type: 'function', icon: 'zap' },
        { text: 'sorted()', type: 'function', icon: 'zap' },
        { text: 'reversed()', type: 'function', icon: 'zap' },
        { text: 'any()', type: 'function', icon: 'zap' },
        { text: 'all()', type: 'function', icon: 'zap' },
        { text: 'map()', type: 'function', icon: 'zap' },
        { text: 'filter()', type: 'function', icon: 'zap' },
        { text: 'self', type: 'variable', icon: 'user' },
        { text: 'None', type: 'keyword', icon: 'key' },
        { text: 'True', type: 'keyword', icon: 'key' },
        { text: 'False', type: 'keyword', icon: 'key' },
        { text: 'def ', type: 'snippet', icon: 'code' },
        { text: 'class ', type: 'snippet', icon: 'layers' },
        { text: 'if ', type: 'snippet', icon: 'git-branch' },
        { text: 'for ', type: 'snippet', icon: 'repeat' },
        { text: 'while ', type: 'snippet', icon: 'repeat' },
        { text: 'try:', type: 'snippet', icon: 'shield-alert' },
        { text: 'except ', type: 'snippet', icon: 'shield-alert' },
        { text: 'import ', type: 'snippet', icon: 'package' },
        { text: 'from ', type: 'snippet', icon: 'package' },
        { text: 'return ', type: 'snippet', icon: 'corner-down-left' },
        { text: 'yield ', type: 'snippet', icon: 'corner-down-left' },
        { text: 'async ', type: 'snippet', icon: 'rocket' },
        { text: 'await ', type: 'snippet', icon: 'rocket' },
    ],
    js: [
        { text: 'console.log()', type: 'function', icon: 'zap' },
        { text: 'Math.max()', type: 'function', icon: 'zap' },
        { text: 'Math.min()', type: 'function', icon: 'zap' },
        { text: 'Math.floor()', type: 'function', icon: 'zap' },
        { text: 'Math.ceil()', type: 'function', icon: 'zap' },
        { text: 'Math.random()', type: 'function', icon: 'zap' },
        { text: 'JSON.stringify()', type: 'function', icon: 'zap' },
        { text: 'JSON.parse()', type: 'function', icon: 'zap' },
        { text: 'Object.keys()', type: 'function', icon: 'zap' },
        { text: 'Object.values()', type: 'function', icon: 'zap' },
        { text: 'Object.entries()', type: 'function', icon: 'zap' },
        { text: 'Array.isArray()', type: 'function', icon: 'zap' },
        { text: 'Promise.resolve()', type: 'function', icon: 'zap' },
        { text: 'Promise.reject()', type: 'function', icon: 'zap' },
        { text: 'Promise.all()', type: 'function', icon: 'zap' },
        { text: 'fetch()', type: 'function', icon: 'zap' },
        { text: 'setTimeout()', type: 'function', icon: 'zap' },
        { text: 'setInterval()', type: 'function', icon: 'zap' },
        { text: 'this', type: 'variable', icon: 'user' },
        { text: 'null', type: 'keyword', icon: 'key' },
        { text: 'true', type: 'keyword', icon: 'key' },
        { text: 'false', type: 'keyword', icon: 'key' },
        { text: 'function ', type: 'snippet', icon: 'code' },
        { text: 'const ', type: 'snippet', icon: 'key' },
        { text: 'let ', type: 'snippet', icon: 'key' },
        { text: 'if ', type: 'snippet', icon: 'git-branch' },
        { text: 'for ', type: 'snippet', icon: 'repeat' },
        { text: 'while ', type: 'snippet', icon: 'repeat' },
        { text: 'try { } catch ', type: 'snippet', icon: 'shield-alert' },
        { text: 'import ', type: 'snippet', icon: 'package' },
        { text: 'export ', type: 'snippet', icon: 'package' },
        { text: 'return ', type: 'snippet', icon: 'corner-down-left' },
        { text: 'async ', type: 'snippet', icon: 'rocket' },
        { text: 'await ', type: 'snippet', icon: 'rocket' },
    ]
};

/**
 * Custom renderer for CodeMirror hints
 */
function hintRenderer(el, data, cur, refreshIcons) {
    const icon = cur.icon || 'terminal';
    const type = cur.type || 'text';

    el.className = 'CodeMirror-hint';
    el.innerHTML = `
    <div class="CodeMirror-hint-icon hint-icon-${type}">
      <i data-lucide="${icon}"></i>
    </div>
    <div class="CodeMirror-hint-text">${cur.text}</div>
    <div class="CodeMirror-hint-type">${type}</div>
  `;

    // Refresh icons in the element if provided
    if (refreshIcons) {
        refreshIcons(el);
    }
}

/**
 * Custom hint provider
 */
export function getHints(cm, options) {
    const cur = cm.getCursor();
    const token = cm.getTokenAt(cur);
    const start = token.start;
    const end = cur.ch;
    const line = cur.line;
    const currentWord = token.string.slice(0, end - start);

    const mode = cm.getOption('mode');
    const lang = mode === 'javascript' ? 'js' : 'python';

    // Get refreshIcons from options passed from ui.js
    const refreshIcons = options.refreshIcons;

    const list = COMPLETIONS[lang]
        .filter(c => c.text.toLowerCase().startsWith(currentWord.toLowerCase()))
        .map(c => ({
            text: c.text,
            render: (el, data, cur) => hintRenderer(el, data, cur, refreshIcons),
            icon: c.icon,
            type: c.type,
            from: { line, ch: start },
            to: { line, ch: end }
        }));

    return {
        list: list,
        from: { line, ch: start },
        to: { line, ch: end }
    };
}

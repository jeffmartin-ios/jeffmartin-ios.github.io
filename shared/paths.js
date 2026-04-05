/**
 * GitHub Pages–aware URL helpers.
 * - Custom domain at / : base is empty (default).
 * - Project site at /your-repo/ : base is auto-detected from the first path segment
 *   unless that segment is a known top-level route (updates, privacy, spent-today, …).
 * Override anytime: <meta name="pb-site-base" content="/your-repo-name">
 */
(function (w) {
    var KNOWN_TOP = {
        updates: 1,
        privacy: 1,
        'spent-today': 1,
        camerapouch: 1,
        'habit-habit': 1,
        simulatedfilm: 1,
        camerashelf: 1,
        'pattern-projects': 1,
        'recipe-mini': 1,
        'vocab-bento': 1,
        inventory: 1,
        assets: 1,
        shared: 1,
        lang: 1,
    };

    function getPbSiteBase() {
        var meta = document.querySelector('meta[name="pb-site-base"]');
        if (meta && meta.content.trim() !== '') {
            var b = meta.content.trim();
            if (b.charAt(0) !== '/') b = '/' + b;
            if (b.length > 1 && b.charAt(b.length - 1) === '/') b = b.slice(0, -1);
            return b;
        }
        var pathname = w.location.pathname;
        var parts = pathname.split('/').filter(Boolean);
        if (parts.length && parts[parts.length - 1] === 'index.html') {
            parts.pop();
        }
        if (parts.length === 0) return '';
        if (KNOWN_TOP[parts[0]]) return '';
        return '/' + parts[0];
    }

    function pbUrl(path) {
        var base = getPbSiteBase();
        if (!path || path.charAt(0) !== '/') path = '/' + (path || '');
        return (base || '') + path;
    }

    function pbPatchInternalLinks(root) {
        if (!root || typeof root.querySelectorAll !== 'function') return;
        var base = getPbSiteBase();
        root.querySelectorAll('a[href^="/"]').forEach(function (a) {
            var h = a.getAttribute('href');
            if (!h || h.indexOf('//') === 0) return;
            var hashIdx = h.indexOf('#');
            var pathPart = hashIdx >= 0 ? h.slice(0, hashIdx) : h;
            var hash = hashIdx >= 0 ? h.slice(hashIdx) : '';
            if (base && pathPart.indexOf(base + '/') === 0) return;
            if (base && pathPart === base) return;
            var newHref = pbUrl(pathPart || '/') + hash;
            a.setAttribute('href', newHref);
        });
    }

    function pbApplyDataPbLinks() {
        document.querySelectorAll('a[data-pb]').forEach(function (a) {
            var p = a.getAttribute('data-pb');
            if (p) a.setAttribute('href', pbUrl(p));
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', pbApplyDataPbLinks);
    } else {
        pbApplyDataPbLinks();
    }

    w.getPbSiteBase = getPbSiteBase;
    w.pbUrl = pbUrl;
    w.pbPatchInternalLinks = pbPatchInternalLinks;
})(window);

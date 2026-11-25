/**
 * Pandesal Bytes — Centralized Product & Platform Registry
 *
 * Architectural foundation:
 * - Today: All products ship natively for the Apple ecosystem (`platforms.ios`).
 * - Future-ready: Setting `platforms.android` (e.g. `{ url: 'https://play.google.com/...' }`)
 *   or `platforms.webApp` (e.g. `{ url: 'https://app.example.com', loginUrl: 'https://app.example.com/login' }`)
 *   automatically renders additional platform badges and store / web-suite launch buttons across
 *   cards and product pages without restructuring HTML templates.
 */
(function (w) {
    var APPLE_ICON_SVG = '<svg class="platform-btn-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.9.04-1.97.6-2.6 1.34-.56.64-1.05 1.7-0.92 2.74 1.01.08 2.02-.5 2.6-1.21z"/></svg>';
    var PLAY_ICON_SVG = '<svg class="platform-btn-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3.61 1.814L13.793 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .61-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/></svg>';
    var WEB_ICON_SVG = '<svg class="platform-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>';

    var PB_PRODUCTS = [
        {
            id: 'spent-today',
            slug: '/spent-today/',
            name: 'Spent Today',
            titleKey: 'app.spent-today.title',
            descKey: 'app.spent-today.description',
            category: 'productivity',
            featured: true,
            icon: '/assets/yen/icon.png',
            preview: '/assets/yen/1-today-view.png',
            platforms: {
                ios: { url: 'https://apps.apple.com/us/app/spent-today/id6754225263', appId: '6754225263', badge: 'iOS' },
                android: null,
                webApp: null
            }
        },
        {
            id: 'inventory',
            slug: '/inventory/',
            name: 'My Inventory Stack',
            titleKey: 'app.inventory.title',
            descKey: 'app.inventory.description',
            category: 'productivity',
            featured: true,
            icon: '/assets/fukuro/icon.png',
            preview: '/assets/fukuro/new-1-dashboard.png',
            platforms: {
                ios: { url: 'https://apps.apple.com/us/app/my-inventory-stack/id6755137430', appId: '6755137430', badge: 'iOS' },
                android: null,
                webApp: null
            }
        },
        {
            id: 'archiveshelf',
            slug: '/archiveshelf/',
            name: 'ArchiveShelf',
            titleKey: 'app.archiveshelf.title',
            descKey: 'app.archiveshelf.description',
            category: 'productivity',
            featured: true,
            icon: '/assets/archiveshelf/icon.png',
            preview: '/assets/archiveshelf/1-home.png',
            platforms: {
                ios: { url: 'https://apps.apple.com/us/app/archiveshelf-home-inventory/id6756975449', appId: '6756975449', badge: 'iOS' },
                android: null,
                webApp: null
            }
        },
        {
            id: 'vocab-bento',
            slug: '/vocab-bento/',
            name: 'Vocab Bento',
            titleKey: 'app.vocab-bento.title',
            descKey: 'app.vocab-bento.description',
            category: 'productivity',
            featured: true,
            icon: '/assets/benkyo/icon.png',
            preview: '/assets/benkyo/1-home.png',
            platforms: {
                ios: { url: 'https://apps.apple.com/us/app/vocab-bento-learn-japanese/id6756253698', appId: '6756253698', badge: 'iOS' },
                android: null,
                webApp: null
            }
        },
        {
            id: 'campouch',
            legacyTags: ['camerapouch', 'cameraplan'],
            slug: '/campouch/',
            name: 'CamPouch',
            titleKey: 'app.camerapouch.title',
            descKey: 'app.camerapouch.description',
            category: 'photography',
            featured: true,
            icon: '/assets/campouch/icon.png',
            preview: '/assets/campouch/1-light.png',
            platforms: {
                ios: { url: 'https://apps.apple.com/us/app/campouch/id6754294154', appId: '6754294154', badge: 'iOS' },
                android: null,
                webApp: null
            }
        },
        {
            id: 'camerashelf',
            slug: '/camerashelf/',
            name: 'Camera Shelf',
            titleKey: 'app.camerashelf.title',
            descKey: 'app.camerashelf.description',
            category: 'photography',
            featured: true,
            icon: '/assets/camerashelf/icon.png',
            preview: '/assets/camerashelf/duo-1-home.png',
            platforms: {
                ios: { url: 'https://apps.apple.com/app/id6755641228', appId: '6755641228', badge: 'iOS' },
                android: null,
                webApp: null
            }
        },
        {
            id: 'recipe-mini',
            slug: '/recipe-mini/',
            name: 'Recipe Mini',
            titleKey: 'app.recipe-mini.title',
            descKey: 'app.recipe-mini.description',
            category: 'productivity',
            featured: false,
            icon: '/assets/pagkain/icon.png',
            preview: '/assets/pagkain/1-home.png',
            platforms: {
                ios: { url: 'https://apps.apple.com/us/app/recipe-mini-manager-planner/id6756092667', appId: '6756092667', badge: 'iOS' },
                android: null,
                webApp: null
            }
        },
        {
            id: 'habit-habit',
            slug: '/habit-habit/',
            name: 'Habit Habit',
            titleKey: 'app.habit-habit.title',
            descKey: 'app.habit-habit.description',
            category: 'productivity',
            featured: false,
            icon: '/assets/horizons/icon.png',
            preview: '/assets/horizons/1-home.png',
            platforms: {
                ios: { url: 'https://apps.apple.com/us/app/habit-habit-daily-tracker/id6755456223', appId: '6755456223', badge: 'iOS' },
                android: null,
                webApp: null
            }
        },
        {
            id: 'pattern-projects',
            slug: '/pattern-projects/',
            name: 'Pattern Projects',
            titleKey: 'app.pattern-projects.title',
            descKey: 'app.pattern-projects.description',
            category: 'productivity',
            featured: false,
            icon: '/assets/stitch/icon.png',
            preview: '/assets/stitch/1-home.png',
            platforms: {
                ios: { url: 'https://apps.apple.com/us/app/pattern-projects/id6754258425', appId: '6754258425', badge: 'iOS' },
                android: null,
                webApp: null
            }
        },
        {
            id: 'os39',
            slug: '/os39/',
            name: 'OS-39',
            titleKey: 'app.os39.title',
            descKey: 'app.os39.description',
            category: 'productivity',
            featured: false,
            icon: '/assets/os39/icon.png',
            preview: '/assets/os39/1-home-duo.png',
            platforms: {
                ios: { url: 'https://apps.apple.com/us/app/os-39-offline-music-player/id6757801521', appId: '6757801521', badge: 'iOS' },
                android: null,
                webApp: null
            }
        },
        {
            id: 'simulatedfilm',
            slug: '/simulatedfilm/',
            name: 'Simulated Film',
            titleKey: 'app.simulated-film.title',
            descKey: 'app.simulated-film.description',
            category: 'photography',
            featured: false,
            icon: '/assets/simulatedfilm/icon.png',
            preview: '/assets/simulatedfilm/1-home.png',
            platforms: {
                ios: { url: 'https://apps.apple.com/us/app/simulated-film-recipe-manager/id6755539247', appId: '6755539247', badge: 'iOS' },
                android: null,
                webApp: null
            }
        },
        {
            id: 'slideshow-frames',
            slug: '/slideshow-frames/',
            name: 'Slideshow Frames',
            titleKey: 'app.slideshow-frames.title',
            descKey: 'app.slideshow-frames.description',
            category: 'photography',
            featured: false,
            icon: '/assets/frames/icon.png',
            preview: null,
            platforms: {
                ios: { url: 'https://apps.apple.com/us/app/slideshow-frames/id6755850653', appId: '6755850653', badge: 'iOS' },
                android: null,
                webApp: null
            }
        }
    ];

    var PB_PRODUCT_NAMES = {};
    var PB_PRODUCTS_BY_ID = {};
    PB_PRODUCTS.forEach(function (p) {
        PB_PRODUCT_NAMES[p.id] = p.name;
        PB_PRODUCTS_BY_ID[p.id] = p;
        if (Array.isArray(p.legacyTags)) {
            p.legacyTags.forEach(function (lt) {
                PB_PRODUCT_NAMES[lt] = p.name;
                PB_PRODUCTS_BY_ID[lt] = p;
            });
        }
    });

    function getProductById(id) {
        return PB_PRODUCTS_BY_ID[id] || null;
    }

    function renderPlatformPills(product) {
        if (!product || !product.platforms) return '';
        var pills = [];
        if (product.platforms.ios && product.platforms.ios.url) {
            pills.push('<span class="platform-pill platform-pill--ios">' + (product.platforms.ios.badge || 'iOS') + '</span>');
        }
        if (product.platforms.android && product.platforms.android.url) {
            pills.push('<span class="platform-pill platform-pill--android">' + (product.platforms.android.badge || 'Android') + '</span>');
        }
        if (product.platforms.webApp && product.platforms.webApp.url) {
            pills.push('<span class="platform-pill platform-pill--web">' + (product.platforms.webApp.badge || 'Web') + '</span>');
        }
        return pills.join('');
    }

    function renderPlatformActions(productOrId, tr) {
        var product = typeof productOrId === 'string' ? getProductById(productOrId) : productOrId;
        if (!product || !product.platforms) return '';
        tr = tr || {};
        var iosLabel = tr['platform.ios.cta'] || 'Download on the App Store';
        var androidLabel = tr['platform.android.cta'] || 'Get it on Google Play';
        var webLabel = tr['platform.web.cta'] || 'Open Web Suite';
        var loginLabel = tr['platform.web.login'] || 'Sign In';

        var btns = [];
        if (product.platforms.ios && product.platforms.ios.url) {
            btns.push(
                '<a href="' + product.platforms.ios.url + '" target="_blank" rel="noopener" class="platform-btn platform-btn--ios">' +
                APPLE_ICON_SVG +
                '<span data-i18n-key="platform.ios.cta">' + iosLabel + '</span>' +
                '</a>'
            );
        }
        if (product.platforms.android && product.platforms.android.url) {
            btns.push(
                '<a href="' + product.platforms.android.url + '" target="_blank" rel="noopener" class="platform-btn platform-btn--android">' +
                PLAY_ICON_SVG +
                '<span data-i18n-key="platform.android.cta">' + androidLabel + '</span>' +
                '</a>'
            );
        }
        if (product.platforms.webApp && product.platforms.webApp.url) {
            btns.push(
                '<a href="' + product.platforms.webApp.url + '" target="_blank" rel="noopener" class="platform-btn platform-btn--web">' +
                WEB_ICON_SVG +
                '<span data-i18n-key="platform.web.cta">' + webLabel + '</span>' +
                '</a>'
            );
            if (product.platforms.webApp.loginUrl) {
                btns.push(
                    '<a href="' + product.platforms.webApp.loginUrl + '" target="_blank" rel="noopener" class="platform-btn platform-btn--ghost">' +
                    '<span data-i18n-key="platform.web.login">' + loginLabel + '</span>' +
                    '</a>'
                );
            }
        }
        return '<div class="platform-actions">' + btns.join('') + '</div>';
    }

    function hydratePlatformContainers(tr) {
        document.querySelectorAll('[data-pb-product-actions]').forEach(function (el) {
            var pid = el.getAttribute('data-pb-product-actions');
            var html = renderPlatformActions(pid, tr);
            if (html) el.innerHTML = html;
        });
        document.querySelectorAll('[data-pb-product-pills]').forEach(function (el) {
            var pid = el.getAttribute('data-pb-product-pills');
            var product = getProductById(pid);
            if (product) el.innerHTML = renderPlatformPills(product);
        });
    }

    w.PB_PRODUCTS = PB_PRODUCTS;
    w.PB_PRODUCT_NAMES = PB_PRODUCT_NAMES;
    w.getPbProductById = getProductById;
    w.pbRenderPlatformPills = renderPlatformPills;
    w.pbRenderPlatformActions = renderPlatformActions;
    w.pbHydratePlatformContainers = hydratePlatformContainers;
})(window);

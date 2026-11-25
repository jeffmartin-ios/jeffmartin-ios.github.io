document.addEventListener('DOMContentLoaded', () => {
    let translations = {};
    let currentLang = 'en';

    function normalizeLang(lang) {
        return lang === 'ja' ? 'ja' : 'en';
    }

    function getRelativeDepthPrefix() {
        let path = window.location.pathname;
        if (typeof window.getPbSiteBase === 'function') {
            const base = window.getPbSiteBase();
            if (base && path.startsWith(base)) {
                path = path.slice(base.length);
            }
        }
        const segments = path.split('/').filter(s => s && s !== 'index.html' && !s.endsWith('.html'));
        const depth = segments.length;
        if (depth === 0) return '';
        let prefix = '';
        for (let i = 0; i < depth; i++) {
            prefix += '../';
        }
        return prefix;
    }

    function langBasePath() {
        return getRelativeDepthPrefix();
    }

    function sharedBasePath() {
        return getRelativeDepthPrefix() + 'shared/';
    }

    function ensureProductsRegistry() {
        if (window.PB_PRODUCTS) return Promise.resolve();
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = `${sharedBasePath()}products.js`;
            script.onload = () => resolve();
            script.onerror = () => resolve();
            document.head.appendChild(script);
        });
    }

    async function loadTranslations(lang) {
        lang = normalizeLang(lang);
        const basePath = langBasePath();
        try {
            const response = await fetch(`${basePath}lang/${lang}.json`);
            if (!response.ok) {
                console.error(`Could not load translation file: ${lang}.json`);
                if (lang !== 'en') await loadTranslations('en');
                return;
            }
            translations = await response.json();
            currentLang = lang;
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    function updateAllText() {
        if (typeof window.pbHydratePlatformContainers === 'function') {
            window.pbHydratePlatformContainers(translations);
        }
        document.querySelectorAll('[data-i18n-key]').forEach(element => {
            const key = element.getAttribute('data-i18n-key');
            if (translations[key]) {
                element.innerHTML = translations[key];
            }
        });
        const titleKey = document.documentElement.getAttribute('data-i18n-title') || document.body.getAttribute('data-i18n-title');
        if (titleKey && translations[titleKey]) {
            document.title = translations[titleKey];
        }
    }

    function applyDocumentLang(lang) {
        lang = normalizeLang(lang);
        document.documentElement.lang = lang === 'ja' ? 'ja' : 'en';
        document.body.classList.remove('lang-en', 'lang-ja');
        document.body.classList.add(lang === 'ja' ? 'lang-ja' : 'lang-en');

        document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
            const btnLang = btn.getAttribute('data-set-lang');
            btn.classList.toggle('is-active', btnLang === lang);
            btn.setAttribute('aria-pressed', btnLang === lang ? 'true' : 'false');
        });
    }

    function notifyTranslationListeners() {
        window.__pbTranslations = translations;
        window.__pbLang = currentLang;
        if (typeof window.onPandesalTranslationsReady === 'function') {
            window.onPandesalTranslationsReady(translations, currentLang);
        }
    }

    function highlightCurrentNav() {
        const pathname = window.location.pathname;
        document.querySelectorAll('.nav-desktop-link').forEach(link => {
            const href = link.getAttribute('href') || '';
            if (href.includes('/company/') && pathname.includes('/company')) {
                link.classList.add('is-current');
            } else if (href.includes('/updates/') && pathname.includes('/updates')) {
                link.classList.add('is-current');
            }
        });
    }

    function setupScrollHeaderAndReveal() {
        const header = document.getElementById('site-header') || document.querySelector('.header');
        if (header) {
            const onScroll = () => {
                header.classList.toggle('is-scrolled', window.scrollY > 12);
            };
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }

        const revealTargets = document.querySelectorAll('.reveal-on-scroll');
        if (revealTargets.length && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
            revealTargets.forEach(el => observer.observe(el));
        } else {
            revealTargets.forEach(el => el.classList.add('is-visible'));
        }
    }

    const loadComponents = async () => {
        const savedRaw = localStorage.getItem('userLanguage');
        const browserLang = (navigator.language || 'en').split('-')[0];
        let initialLang = 'en';
        if (savedRaw) {
            initialLang = normalizeLang(savedRaw);
            if (normalizeLang(savedRaw) !== savedRaw) {
                localStorage.setItem('userLanguage', initialLang);
            }
        } else if (browserLang === 'ja') {
            initialLang = 'ja';
        }

        await Promise.all([
            ensureProductsRegistry(),
            loadTranslations(initialLang)
        ]);
        applyDocumentLang(currentLang);

        const headerPlaceholder = document.getElementById('header-placeholder');
        const footerPlaceholder = document.getElementById('footer-placeholder');
        const basePath = sharedBasePath();

        try {
            const [headerRes, footerRes] = await Promise.all([
                fetch(`${basePath}header.html`),
                fetch(`${basePath}footer.html`)
            ]);

            if (headerPlaceholder && headerRes.ok) {
                headerPlaceholder.innerHTML = await headerRes.text();
            }
            if (footerPlaceholder && footerRes.ok) {
                footerPlaceholder.innerHTML = await footerRes.text();
            }

            setTimeout(() => {
                if (typeof window.pbPatchInternalLinks === 'function') {
                    window.pbPatchInternalLinks(document.body);
                }
                initializeHeader();
                highlightCurrentNav();
                updateAllText();
                applyDocumentLang(currentLang);
                setupScrollHeaderAndReveal();
                notifyTranslationListeners();
            }, 0);
        } catch (error) {
            console.error('Error loading components:', error);
            updateAllText();
            setupScrollHeaderAndReveal();
            notifyTranslationListeners();
        }
    };

    const initializeHeader = () => {
        const hamburger = document.getElementById('hamburger');
        const menuOverlay = document.getElementById('menu-overlay');
        const closeMenuButton = document.getElementById('close-menu');
        const menuBackdrop = document.getElementById('menu-backdrop');

        const setMenuOpen = (open) => {
            if (!hamburger || !menuOverlay) return;
            hamburger.classList.toggle('active', open);
            hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
            menuOverlay.classList.toggle('active', open);
            menuOverlay.setAttribute('aria-hidden', open ? 'false' : 'true');
            document.body.style.overflow = open ? 'hidden' : '';
        };

        if (hamburger && menuOverlay) {
            hamburger.addEventListener('click', () => {
                setMenuOpen(!menuOverlay.classList.contains('active'));
            });
            if (closeMenuButton) {
                closeMenuButton.addEventListener('click', () => setMenuOpen(false));
            }
            if (menuBackdrop) {
                menuBackdrop.addEventListener('click', () => setMenuOpen(false));
            }
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
                    setMenuOpen(false);
                }
            });
            menuOverlay.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (menuOverlay.classList.contains('active')) {
                        setMenuOpen(false);
                    }
                });
            });
        }

        const langToggleButtons = document.querySelectorAll('.lang-toggle-btn');
        if (langToggleButtons.length) {
            langToggleButtons.forEach(btn => {
                btn.addEventListener('click', async () => {
                    const selectedLang = normalizeLang(btn.getAttribute('data-set-lang'));
                    await loadTranslations(selectedLang);
                    localStorage.setItem('userLanguage', selectedLang);
                    updateAllText();
                    applyDocumentLang(currentLang);
                    notifyTranslationListeners();
                });
            });
            applyDocumentLang(currentLang);
        }
    };

    loadComponents();
});

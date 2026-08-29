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
        const segments = path.split('/').filter(s => s && s !== 'index.html');
        const depth = segments.length;
        if (depth === 0) return '';
        let prefix = '';
        for (let i = 0; i < depth; i++) {
            prefix += '../';
        }
        return prefix;
    }

    function isNestedPath() {
        return getRelativeDepthPrefix().length > 0;
    }

    function langBasePath() {
        return getRelativeDepthPrefix();
    }

    function sharedBasePath() {
        return getRelativeDepthPrefix() + 'shared/';
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
        document.querySelectorAll('[data-i18n-key]').forEach(element => {
            const key = element.getAttribute('data-i18n-key');
            if (translations[key]) {
                element.innerHTML = translations[key];
            }
        });
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
        if (typeof window.onPandesalTranslationsReady === 'function') {
            window.onPandesalTranslationsReady(translations, currentLang);
        }
    }

    const loadComponents = async () => {
        const savedRaw = localStorage.getItem('userLanguage');
        const browserLang = navigator.language.split('-')[0];
        let initialLang = 'en';
        if (savedRaw) {
            initialLang = normalizeLang(savedRaw);
            if (normalizeLang(savedRaw) !== savedRaw) {
                localStorage.setItem('userLanguage', initialLang);
            }
        } else if (browserLang === 'ja') {
            initialLang = 'ja';
        }

        await loadTranslations(initialLang);
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
                updateAllText();
                applyDocumentLang(currentLang);
                notifyTranslationListeners();
            }, 0);
        } catch (error) {
            console.error('Error loading components:', error);
        }
    };

    const initializeHeader = () => {
        const hamburger = document.getElementById('hamburger');
        const menuOverlay = document.getElementById('menu-overlay');
        const closeMenuButton = document.getElementById('close-menu');

        const toggleMenu = () => {
            if (hamburger && menuOverlay) {
                hamburger.classList.toggle('active');
                menuOverlay.classList.toggle('active');
                document.body.style.overflow = menuOverlay.classList.contains('active') ? 'hidden' : '';
            }
        };

        if (hamburger && menuOverlay && closeMenuButton) {
            hamburger.addEventListener('click', toggleMenu);
            closeMenuButton.addEventListener('click', toggleMenu);
            menuOverlay.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (menuOverlay.classList.contains('active')) {
                        toggleMenu();
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

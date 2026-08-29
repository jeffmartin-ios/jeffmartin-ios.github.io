/**
 * Vocab Bento (勉強 · Benkyo) Interactive Logic
 * Handles flipcard demo, audio synthesis, device toggle, N5 search, and anime audio.
 */

(function () {
    'use strict';

    // 1. Interactive Demo Flashcards Data
    const DEMO_CARDS = [
        {
            kanji: '勉強',
            furigana: 'べんきょう',
            romaji: 'benkyou',
            meaning: 'Study / Diligence',
            jlpt: 'JLPT N5',
            example: '毎日日本語を勉強します。(I study Japanese every day.)',
            audioText: 'べんきょう'
        },
        {
            kanji: '桜',
            furigana: 'さくら',
            romaji: 'sakura',
            meaning: 'Cherry Blossom',
            jlpt: 'JLPT N4',
            example: '春に桜の花が咲きます。(Cherry blossoms bloom in spring.)',
            audioText: 'さくら'
        },
        {
            kanji: '仲間',
            furigana: 'なかま',
            romaji: 'nakama',
            meaning: 'Comrade / Trusted Friend',
            jlpt: 'JLPT N3',
            example: '私たちは永遠の仲間だ！(We are comrades forever!)',
            audioText: 'なかま'
        },
        {
            kanji: '約束',
            furigana: 'やくそく',
            romaji: 'yakusoku',
            meaning: 'Promise / Agreement',
            jlpt: 'JLPT N4',
            example: 'あの日の約束を覚えている。(I remember the promise from that day.)',
            audioText: 'やくそく'
        },
        {
            kanji: '猫',
            furigana: 'ねこ',
            romaji: 'neko',
            meaning: 'Cat',
            jlpt: 'JLPT N5',
            example: '日向で猫が寝ています。(A cat is sleeping in the sun.)',
            audioText: 'ねこ'
        },
        {
            kanji: '魔法',
            furigana: 'まほう',
            romaji: 'mahou',
            meaning: 'Magic / Sorcery',
            jlpt: 'Anime Deck',
            example: '古代の魔法を唱える。(Chanting ancient magic.)',
            audioText: 'まほう'
        }
    ];

    let currentCardIndex = 0;

    // 2. Audio Pronunciation Helper (Web Speech API)
    window.vbSpeakJapanese = function (text) {
        if (!('speechSynthesis' in window)) {
            console.warn('Speech synthesis not supported in this browser.');
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.88; // Clear, study pace
        window.speechSynthesis.speak(utterance);
    };

    // 3. Initialize Flashcard Interactive Demo
    function initFlashcardDemo() {
        const cardScene = document.getElementById('vb-demo-card-scene');
        const card = document.getElementById('vb-demo-card');
        if (!cardScene || !card) return;

        const frontKanji = document.getElementById('vb-card-front-kanji');
        const frontJlpt = document.getElementById('vb-card-front-jlpt');
        const backKanji = document.getElementById('vb-card-back-kanji');
        const backFurigana = document.getElementById('vb-card-back-furigana');
        const backRomaji = document.getElementById('vb-card-back-romaji');
        const backMeaning = document.getElementById('vb-card-back-meaning');
        const backExample = document.getElementById('vb-card-back-example');
        const counter = document.getElementById('vb-card-counter');
        const audioBtn = document.getElementById('vb-card-audio-btn');
        const prevBtn = document.getElementById('vb-card-prev');
        const nextBtn = document.getElementById('vb-card-next');

        function updateCardDisplay(index) {
            const data = DEMO_CARDS[index];
            if (!data) return;

            if (frontKanji) frontKanji.textContent = data.kanji;
            if (frontJlpt) frontJlpt.textContent = data.jlpt;
            if (backKanji) backKanji.textContent = data.kanji;
            if (backFurigana) backFurigana.textContent = data.furigana;
            if (backRomaji) backRomaji.textContent = data.romaji;
            if (backMeaning) backMeaning.textContent = data.meaning;
            if (backExample) backExample.textContent = data.example;
            if (counter) counter.textContent = `${index + 1} / ${DEMO_CARDS.length}`;
        }

        // Flip on click
        cardScene.addEventListener('click', (e) => {
            // Prevent flipping if clicked directly on audio button or rating buttons
            if (e.target.closest('.vb-demo-audio-btn') || e.target.closest('.vb-srs-btn')) {
                return;
            }
            card.classList.toggle('is-flipped');
        });

        // Audio button
        if (audioBtn) {
            audioBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const data = DEMO_CARDS[currentCardIndex];
                if (data) window.vbSpeakJapanese(data.audioText || data.kanji);
            });
        }

        // SRS Rating Buttons (advance to next card on rating)
        document.querySelectorAll('.vb-srs-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Visual feedback
                card.classList.remove('is-flipped');
                setTimeout(() => {
                    currentCardIndex = (currentCardIndex + 1) % DEMO_CARDS.length;
                    updateCardDisplay(currentCardIndex);
                }, 300);
            });
        });

        // Prev / Next Navigation
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                card.classList.remove('is-flipped');
                setTimeout(() => {
                    currentCardIndex = (currentCardIndex + 1) % DEMO_CARDS.length;
                    updateCardDisplay(currentCardIndex);
                }, 200);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                card.classList.remove('is-flipped');
                setTimeout(() => {
                    currentCardIndex = (currentCardIndex - 1 + DEMO_CARDS.length) % DEMO_CARDS.length;
                    updateCardDisplay(currentCardIndex);
                }, 200);
            });
        }

        updateCardDisplay(0);
    }

    // 4. Hero Device Toggle (Lock Screen Widget vs App Screenshots)
    function initDeviceMockup() {
        const tabLock = document.getElementById('vb-tab-lockscreen');
        const tabApp = document.getElementById('vb-tab-app');
        const viewLock = document.getElementById('vb-view-lockscreen');
        const viewApp = document.getElementById('vb-view-app');

        if (!tabLock || !tabApp || !viewLock || !viewApp) return;

        tabLock.addEventListener('click', () => {
            tabLock.classList.add('is-active');
            tabApp.classList.remove('is-active');
            viewLock.style.display = 'flex';
            viewApp.classList.remove('is-active');
        });

        tabApp.addEventListener('click', () => {
            tabApp.classList.add('is-active');
            tabLock.classList.remove('is-active');
            viewLock.style.display = 'none';
            viewApp.classList.add('is-active');
        });

        // Update live clock on simulated lock screen
        function updateLockClock() {
            const clockEl = document.getElementById('vb-sim-clock');
            const dateEl = document.getElementById('vb-sim-date');
            if (!clockEl) return;
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            clockEl.textContent = `${hours}:${minutes}`;

            if (dateEl) {
                const options = { weekday: 'short', month: 'short', day: 'numeric' };
                dateEl.textContent = now.toLocaleDateString('en-US', options);
            }
        }

        updateLockClock();
        setInterval(updateLockClock, 10000);
    }

    // 5. In-App Mini Screenshot Carousel inside Device
    function initInAppCarousel() {
        const track = document.getElementById('vb-phone-carousel-track');
        if (!track) return;
        const slides = Array.from(track.children);
        let activeIdx = 0;
        setInterval(() => {
            if (!track.offsetParent) return; // Only if visible
            activeIdx = (activeIdx + 1) % slides.length;
            track.style.transform = `translateX(-${activeIdx * 100}%)`;
        }, 3200);
    }

    // 6. JLPT N5 Kanji Search and Filter (for Subpage)
    window.initN5KanjiSearch = function () {
        const searchInput = document.getElementById('vb-kanji-search');
        const filterPills = document.querySelectorAll('.vb-filter-pill');
        const kanjiCards = document.querySelectorAll('.vb-kanji-card');

        if (!searchInput || !kanjiCards.length) return;

        let activeCategory = 'all';

        function applyFilter() {
            const query = searchInput.value.toLowerCase().trim();

            kanjiCards.forEach((card) => {
                const char = card.getAttribute('data-kanji') || '';
                const meaning = card.getAttribute('data-meaning') || '';
                const reading = card.getAttribute('data-reading') || '';
                const category = card.getAttribute('data-category') || '';

                const matchesQuery = !query ||
                    char.includes(query) ||
                    meaning.toLowerCase().includes(query) ||
                    reading.toLowerCase().includes(query);

                const matchesCategory = activeCategory === 'all' || category === activeCategory;

                if (matchesQuery && matchesCategory) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        searchInput.addEventListener('input', applyFilter);

        filterPills.forEach((pill) => {
            pill.addEventListener('click', () => {
                filterPills.forEach((p) => p.classList.remove('is-active'));
                pill.classList.add('is-active');
                activeCategory = pill.getAttribute('data-category') || 'all';
                applyFilter();
            });
        });
    };

    // 7. Initialize Everything on DOM Load
    document.addEventListener('DOMContentLoaded', () => {
        initFlashcardDemo();
        initDeviceMockup();
        initInAppCarousel();
        if (typeof window.initN5KanjiSearch === 'function') {
            window.initN5KanjiSearch();
        }
    });
})();

(function () {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');

    if (toggle && panel) {
        toggle.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;
        var timer = null;

        function showHero(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function restartHero() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                showHero(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showHero(Number(dot.getAttribute('data-hero-dot')) || 0);
                restartHero();
            });
        });

        if (slides.length > 1) {
            restartHero();
        }
    }

    var searchInput = document.querySelector('[data-page-search]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.searchable-list .video-card'));
    var chips = Array.prototype.slice.call(document.querySelectorAll('[data-chip]'));
    var activeChip = '';

    function normalize(value) {
        return String(value || '').toLowerCase().replace(/\s+/g, '');
    }

    function filterCards() {
        if (!searchInput || cards.length === 0) {
            return;
        }

        var keyword = normalize(searchInput.value);
        var chipValue = normalize(activeChip);

        cards.forEach(function (card) {
            var haystack = normalize([
                card.getAttribute('data-title'),
                card.getAttribute('data-meta'),
                card.textContent
            ].join(' '));
            var matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
            var matchedChip = !chipValue || haystack.indexOf(chipValue) !== -1;
            card.classList.toggle('is-filtered-out', !(matchedKeyword && matchedChip));
        });
    }

    if (searchInput) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');

        if (query) {
            searchInput.value = query;
        }

        searchInput.addEventListener('input', filterCards);
        filterCards();
    }

    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            chips.forEach(function (item) {
                item.classList.remove('is-active');
            });
            chip.classList.add('is-active');
            activeChip = chip.getAttribute('data-chip') || '';
            filterCards();
        });
    });
})();

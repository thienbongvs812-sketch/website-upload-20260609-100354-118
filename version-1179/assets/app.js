(function () {
    const navToggle = document.querySelector('[data-nav-toggle]');
    const mobileNav = document.querySelector('[data-mobile-nav]');

    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    const hero = document.querySelector('[data-hero]');

    if (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        let current = 0;

        function activate(index) {
            current = index % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                activate(index);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                activate(current + 1);
            }, 5200);
        }
    }

    function applyUrlQuery(input) {
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q');
        if (q && input) {
            input.value = q;
        }
    }

    const filterPanel = document.querySelector('[data-filter-panel]');

    if (filterPanel) {
        const input = filterPanel.querySelector('[data-filter-input]');
        const typeSelect = filterPanel.querySelector('[data-filter-type]');
        const yearSelect = filterPanel.querySelector('[data-filter-year]');
        const reset = filterPanel.querySelector('[data-filter-reset]');
        const count = document.querySelector('[data-filter-count]');
        const cards = Array.from(document.querySelectorAll('[data-movie-card]'));

        applyUrlQuery(input);

        function update() {
            const query = (input.value || '').trim().toLowerCase();
            const type = typeSelect.value;
            const year = yearSelect.value;
            let visible = 0;

            cards.forEach(function (card) {
                const haystack = [
                    card.dataset.title,
                    card.dataset.year,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.genre,
                    card.dataset.tags
                ].join(' ').toLowerCase();
                const matchQuery = !query || haystack.includes(query);
                const matchType = !type || card.dataset.type === type;
                const matchYear = !year || card.dataset.year === year;
                const show = matchQuery && matchType && matchYear;
                card.classList.toggle('is-hidden', !show);
                if (show) {
                    visible += 1;
                }
            });

            if (count) {
                count.textContent = '当前显示 ' + visible + ' 部影片';
            }
        }

        input.addEventListener('input', update);
        typeSelect.addEventListener('change', update);
        yearSelect.addEventListener('change', update);
        reset.addEventListener('click', function () {
            input.value = '';
            typeSelect.value = '';
            yearSelect.value = '';
            update();
        });
        update();
    }
}());

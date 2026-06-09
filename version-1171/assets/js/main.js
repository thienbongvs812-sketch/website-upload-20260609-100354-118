(function () {
    var toggle = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            var opened = mobileNav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dots button'));
    var active = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('active', i === active);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === active);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(active + 1);
        }, 5200);
    }

    var searchForms = Array.prototype.slice.call(document.querySelectorAll('[data-search-form]'));
    searchForms.forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = form.querySelector('input[name="q"]');
            var query = input ? input.value.trim() : '';
            var base = form.getAttribute('data-search-target') || 'search.html';
            window.location.href = query ? base + '?q=' + encodeURIComponent(query) : base;
        });
    });

    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    var filterInput = document.querySelector('[data-filter-title]');
    var filterRegion = document.querySelector('[data-filter-region]');
    var filterYear = document.querySelector('[data-filter-year]');
    var filterCategory = document.querySelector('[data-filter-category]');
    var emptyState = document.querySelector('.empty-state');

    var params = new URLSearchParams(window.location.search);
    if (filterInput && params.get('q')) {
        filterInput.value = params.get('q');
    }

    function normalize(value) {
        return (value || '').toString().toLowerCase();
    }

    function applyFilters() {
        if (!cards.length) {
            return;
        }
        var title = normalize(filterInput && filterInput.value);
        var region = filterRegion ? filterRegion.value : '';
        var year = filterYear ? filterYear.value : '';
        var category = filterCategory ? filterCategory.value : '';
        var visible = 0;

        cards.forEach(function (card) {
            var ok = true;
            var cardTitle = normalize(card.getAttribute('data-title'));
            var cardRegion = card.getAttribute('data-region') || '';
            var cardYear = card.getAttribute('data-year') || '';
            var cardCategory = card.getAttribute('data-category') || '';

            if (title && cardTitle.indexOf(title) === -1) {
                ok = false;
            }
            if (region && cardRegion !== region) {
                ok = false;
            }
            if (year && cardYear !== year) {
                ok = false;
            }
            if (category && cardCategory !== category) {
                ok = false;
            }

            card.style.display = ok ? '' : 'none';
            if (ok) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle('show', visible === 0);
        }
    }

    [filterInput, filterRegion, filterYear, filterCategory].forEach(function (control) {
        if (control) {
            control.addEventListener('input', applyFilters);
            control.addEventListener('change', applyFilters);
        }
    });

    applyFilters();
})();

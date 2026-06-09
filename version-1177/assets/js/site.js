(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    function initMenu() {
        var button = document.querySelector('[data-menu-toggle]');
        var nav = document.querySelector('[data-main-nav]');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            var open = nav.classList.toggle('is-open');
            button.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    function initHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        if (slides.length < 2) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
                start();
            });
        });
        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        start();
    }

    function initSearch() {
        var input = document.querySelector('[data-search-input]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
        var empty = document.querySelector('[data-empty-state]');
        var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter-category]'));
        var activeCategory = 'all';
        if (!input && chips.length === 0) {
            return;
        }

        function apply() {
            var keyword = input ? input.value.trim().toLowerCase() : '';
            var visible = 0;
            cards.forEach(function (card) {
                var text = (card.getAttribute('data-search') || '').toLowerCase();
                var category = card.getAttribute('data-category') || '';
                var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
                var matchedCategory = activeCategory === 'all' || category === activeCategory;
                var matched = matchedKeyword && matchedCategory;
                card.classList.toggle('is-hidden', !matched);
                if (matched) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        if (input) {
            input.addEventListener('input', apply);
        }
        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                activeCategory = chip.getAttribute('data-filter-category') || 'all';
                chips.forEach(function (item) {
                    item.classList.toggle('is-active', item === chip);
                });
                apply();
            });
        });
        apply();
    }

    function initPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
        players.forEach(function (video) {
            var frame = video.closest('[data-player-box]');
            var button = frame ? frame.querySelector('[data-play-button]') : null;
            var stream = video.getAttribute('data-stream');
            if (!frame || !stream) {
                return;
            }

            function markReady() {
                frame.classList.add('is-ready');
            }

            function markPlaying() {
                frame.classList.add('is-playing');
                frame.classList.add('is-ready');
            }

            function markPaused() {
                frame.classList.remove('is-playing');
                if (!video.currentTime) {
                    frame.classList.remove('is-ready');
                }
            }

            function attachStream(shouldPlay) {
                if (video.dataset.attached === 'true') {
                    if (shouldPlay) {
                        playVideo();
                    }
                    return;
                }
                video.dataset.attached = 'true';
                if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        markReady();
                        if (shouldPlay) {
                            playVideo();
                        }
                    });
                    video._hls = hls;
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = stream;
                    video.addEventListener('loadedmetadata', markReady, { once: true });
                    if (shouldPlay) {
                        video.load();
                        playVideo();
                    }
                }
            }

            function playVideo() {
                frame.classList.add('is-ready');
                var attempt = video.play();
                if (attempt && typeof attempt.catch === 'function') {
                    attempt.catch(function () {});
                }
            }

            if (button) {
                button.addEventListener('click', function () {
                    attachStream(true);
                });
            }
            video.addEventListener('play', markPlaying);
            video.addEventListener('pause', markPaused);
            video.addEventListener('ended', markPaused);
            video.addEventListener('click', function () {
                attachStream(false);
            });
            attachStream(false);
        });
    }

    ready(function () {
        initMenu();
        initHero();
        initSearch();
        initPlayers();
    });
})();

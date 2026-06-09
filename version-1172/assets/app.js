(function () {
    var hlsLoader = null;

    function loadHls() {
        if (window.Hls) {
            return Promise.resolve(window.Hls);
        }
        if (hlsLoader) {
            return hlsLoader;
        }
        hlsLoader = new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.18/dist/hls.min.js';
            script.onload = function () {
                resolve(window.Hls);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
        return hlsLoader;
    }

    function setupMenu() {
        var button = document.querySelector('[data-menu-toggle]');
        var menu = document.querySelector('[data-mobile-menu]');
        if (!button || !menu) {
            return;
        }
        button.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    function setupHero() {
        var root = document.querySelector('[data-hero-carousel]');
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
        if (!slides.length) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                start();
            });
        });
        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', start);
        start();
    }

    function setupRows() {
        var sections = Array.prototype.slice.call(document.querySelectorAll('.content-section'));
        sections.forEach(function (section) {
            var track = section.querySelector('[data-scroll-track]');
            var prev = section.querySelector('[data-scroll-button="prev"]');
            var next = section.querySelector('[data-scroll-button="next"]');
            if (!track || !prev || !next) {
                return;
            }
            prev.addEventListener('click', function () {
                track.scrollBy({ left: -Math.max(280, track.clientWidth * 0.72), behavior: 'smooth' });
            });
            next.addEventListener('click', function () {
                track.scrollBy({ left: Math.max(280, track.clientWidth * 0.72), behavior: 'smooth' });
            });
        });
    }

    function normalize(value) {
        return (value || '').toString().trim().toLowerCase();
    }

    function setupFilters() {
        var input = document.querySelector('[data-search-input]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
        var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-value]'));
        var empty = document.querySelector('[data-empty-state]');
        if (!cards.length) {
            return;
        }
        var activeCategory = 'all';
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q') || '';
        if (input && initialQuery) {
            input.value = initialQuery;
        }

        function applyFilters() {
            var query = normalize(input ? input.value : '');
            var visible = 0;
            cards.forEach(function (card) {
                var haystack = normalize(card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags'));
                var category = card.getAttribute('data-category') || '';
                var passQuery = !query || haystack.indexOf(query) !== -1;
                var passCategory = activeCategory === 'all' || category === activeCategory;
                var show = passQuery && passCategory;
                card.hidden = !show;
                if (show) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        if (input) {
            input.addEventListener('input', applyFilters);
        }
        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                activeCategory = button.getAttribute('data-filter-value') || 'all';
                buttons.forEach(function (item) {
                    item.classList.toggle('is-active', item === button);
                });
                applyFilters();
            });
        });
        applyFilters();
    }

    function setupPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
        players.forEach(function (shell) {
            var video = shell.querySelector('video');
            var button = shell.querySelector('[data-play-button]');
            var started = false;
            if (!video || !button) {
                return;
            }
            var streamUrl = video.getAttribute('data-video');

            function attachAndPlay() {
                if (!streamUrl) {
                    return;
                }
                shell.classList.add('is-playing');
                if (started) {
                    video.play().catch(function () {});
                    return;
                }
                started = true;
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = streamUrl;
                    video.play().catch(function () {});
                    return;
                }
                loadHls().then(function (Hls) {
                    if (Hls && Hls.isSupported()) {
                        var hls = new Hls({ enableWorker: true, lowLatencyMode: true });
                        hls.loadSource(streamUrl);
                        hls.attachMedia(video);
                        hls.on(Hls.Events.MANIFEST_PARSED, function () {
                            video.play().catch(function () {});
                        });
                    } else {
                        video.src = streamUrl;
                        video.play().catch(function () {});
                    }
                }).catch(function () {
                    video.src = streamUrl;
                    video.play().catch(function () {});
                });
            }

            button.addEventListener('click', attachAndPlay);
            video.addEventListener('click', function () {
                if (video.paused) {
                    attachAndPlay();
                }
            });
        });

        var playLinks = Array.prototype.slice.call(document.querySelectorAll('[data-scroll-play]'));
        playLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                var shell = document.querySelector('[data-player]');
                var button = shell ? shell.querySelector('[data-play-button]') : null;
                if (button) {
                    window.setTimeout(function () {
                        button.click();
                    }, 120);
                }
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMenu();
        setupHero();
        setupRows();
        setupFilters();
        setupPlayers();
    });
})();

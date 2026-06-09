(function () {
    const mobileToggle = document.querySelector("[data-menu-toggle]");
    const mobileMenu = document.querySelector("[data-mobile-menu]");

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener("click", function () {
            mobileMenu.classList.toggle("is-open");
        });
    }

    const hero = document.querySelector("[data-hero]");

    if (hero) {
        const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
        const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
        const previous = hero.querySelector("[data-hero-prev]");
        const next = hero.querySelector("[data-hero-next]");
        let index = 0;
        let timer = null;

        const activate = function (nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        };

        const start = function () {
            timer = window.setInterval(function () {
                activate(index + 1);
            }, 5200);
        };

        const reset = function () {
            if (timer) {
                window.clearInterval(timer);
            }
            start();
        };

        if (slides.length > 1) {
            if (previous) {
                previous.addEventListener("click", function () {
                    activate(index - 1);
                    reset();
                });
            }
            if (next) {
                next.addEventListener("click", function () {
                    activate(index + 1);
                    reset();
                });
            }
            dots.forEach(function (dot) {
                dot.addEventListener("click", function () {
                    activate(Number(dot.getAttribute("data-hero-dot")));
                    reset();
                });
            });
            start();
        }
    }

    document.querySelectorAll(".horizontal-section").forEach(function (section) {
        const row = section.querySelector("[data-scroll-row]");
        const left = section.querySelector("[data-scroll-left]");
        const right = section.querySelector("[data-scroll-right]");

        if (row && left) {
            left.addEventListener("click", function () {
                row.scrollBy({ left: -420, behavior: "smooth" });
            });
        }

        if (row && right) {
            right.addEventListener("click", function () {
                row.scrollBy({ left: 420, behavior: "smooth" });
            });
        }
    });

    document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
        const grid = panel.parentElement.querySelector("[data-filter-grid]");
        const keywordInput = panel.querySelector("[data-filter-keyword]");
        const yearSelect = panel.querySelector("[data-filter-year]");
        const regionSelect = panel.querySelector("[data-filter-region]");

        if (!grid) {
            return;
        }

        const filterCards = function () {
            const keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : "";
            const year = yearSelect ? yearSelect.value : "";
            const region = regionSelect ? regionSelect.value : "";
            const cards = Array.from(grid.querySelectorAll(".movie-card"));

            cards.forEach(function (card) {
                const haystack = [
                    card.getAttribute("data-title") || "",
                    card.getAttribute("data-tags") || "",
                    card.textContent || ""
                ].join(" ").toLowerCase();
                const sameYear = !year || card.getAttribute("data-year") === year;
                const sameRegion = !region || card.getAttribute("data-region") === region;
                const sameKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                card.classList.toggle("is-hidden-card", !(sameYear && sameRegion && sameKeyword));
            });
        };

        [keywordInput, yearSelect, regionSelect].forEach(function (control) {
            if (control) {
                control.addEventListener("input", filterCards);
                control.addEventListener("change", filterCards);
            }
        });
    });

    window.initMoviePlayer = function (playerId, streamUrl) {
        const player = document.getElementById(playerId);

        if (!player) {
            return;
        }

        const video = player.querySelector("video");
        const overlay = player.querySelector(".player-overlay");
        const button = player.querySelector(".player-start");
        const message = player.querySelector(".player-error");
        let attached = false;
        let hlsInstance = null;

        const showMessage = function (text) {
            if (message) {
                message.textContent = text;
                message.classList.add("is-visible");
            }
        };

        const attachStream = function () {
            if (attached || !video) {
                return;
            }

            attached = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
                return;
            }

            video.src = streamUrl;
        };

        const playVideo = function () {
            attachStream();
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            if (video) {
                video.setAttribute("controls", "controls");
                const playing = video.play();
                if (playing && typeof playing.catch === "function") {
                    playing.catch(function () {
                        if (overlay) {
                            overlay.classList.remove("is-hidden");
                        }
                    });
                }
            }
        };

        if (button) {
            button.addEventListener("click", playVideo);
        }

        if (overlay) {
            overlay.addEventListener("click", playVideo);
        }

        if (video) {
            video.addEventListener("play", function () {
                if (overlay) {
                    overlay.classList.add("is-hidden");
                }
            });

            video.addEventListener("error", function () {
                showMessage("暂时无法播放，请稍后再试");
            });
        }

        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };
})();

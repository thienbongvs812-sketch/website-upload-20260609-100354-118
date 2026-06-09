export function createPlayer(src) {
    var shell = document.querySelector('.player-shell');

    if (!shell) {
        return;
    }

    var video = shell.querySelector('video');
    var button = shell.querySelector('[data-play-button]');
    var hasLoaded = false;
    var hlsInstance = null;

    function attachSource() {
        if (hasLoaded || !video) {
            return;
        }

        hasLoaded = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(src);
            hlsInstance.attachMedia(video);
            return;
        }

        video.src = src;
    }

    function startVideo() {
        attachSource();

        if (button) {
            button.classList.add('is-hidden');
        }

        var playResult = video.play();

        if (playResult && typeof playResult.catch === 'function') {
            playResult.catch(function () {});
        }
    }

    if (button) {
        button.addEventListener('click', startVideo);
    }

    if (video) {
        video.addEventListener('click', function () {
            if (video.paused) {
                startVideo();
            }
        });
        video.addEventListener('play', function () {
            if (button) {
                button.classList.add('is-hidden');
            }
        });
        video.addEventListener('ended', function () {
            if (button) {
                button.classList.remove('is-hidden');
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }
}

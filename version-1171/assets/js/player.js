(function () {
    var video = document.getElementById('moviePlayer');
    var button = document.getElementById('playerStart');
    var shell = document.getElementById('playerShell');

    if (!video || typeof streamUrl === 'undefined') {
        return;
    }

    var hlsInstance = null;
    var attached = false;

    function attachStream() {
        if (attached) {
            return;
        }
        attached = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl;
        } else if (window.Hls && Hls.isSupported()) {
            hlsInstance = new Hls({
                maxBufferLength: 30,
                enableWorker: true
            });
            hlsInstance.loadSource(streamUrl);
            hlsInstance.attachMedia(video);
        } else {
            video.src = streamUrl;
        }
    }

    function startPlay() {
        attachStream();
        if (button) {
            button.classList.add('is-hidden');
        }
        video.controls = true;
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {});
        }
    }

    if (button) {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            startPlay();
        });
    }

    if (shell) {
        shell.addEventListener('click', function (event) {
            if (event.target === shell || event.target === video) {
                if (video.paused) {
                    startPlay();
                }
            }
        });
    }

    video.addEventListener('play', function () {
        if (button) {
            button.classList.add('is-hidden');
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
})();

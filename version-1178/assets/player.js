function initMoviePlayer(videoId, sourceUrl) {
  var video = document.getElementById(videoId);
  if (!video || !sourceUrl) {
    return;
  }

  var shell = video.closest(".player-shell") || video.parentElement;
  var cover = shell ? shell.querySelector(".play-cover") : null;
  var hlsInstance = null;
  var started = false;

  function showMessage(text) {
    if (!shell) {
      return;
    }
    var oldMessage = shell.querySelector(".player-message");
    if (oldMessage) {
      oldMessage.remove();
    }
    var message = document.createElement("div");
    message.className = "player-message";
    message.textContent = text;
    shell.appendChild(message);
  }

  function bindSource() {
    if (started) {
      return;
    }
    started = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = sourceUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(sourceUrl);
      hlsInstance.attachMedia(video);
      hlsInstance.on(window.Hls.Events.ERROR, function (_, data) {
        if (data && data.fatal) {
          showMessage("视频加载失败，请稍后重试");
        }
      });
    } else {
      video.src = sourceUrl;
    }
  }

  function startPlayback() {
    bindSource();
    video.controls = true;
    if (cover) {
      cover.classList.add("is-hidden");
    }
    var playResult = video.play();
    if (playResult && typeof playResult.catch === "function") {
      playResult.catch(function () {
        if (cover) {
          cover.classList.remove("is-hidden");
        }
      });
    }
  }

  if (cover) {
    cover.addEventListener("click", startPlayback);
  }

  video.addEventListener("click", function () {
    if (!started || video.paused) {
      startPlayback();
    }
  });

  video.addEventListener("error", function () {
    showMessage("视频加载失败，请稍后重试");
  });

  window.addEventListener("beforeunload", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}

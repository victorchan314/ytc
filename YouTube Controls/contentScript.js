(() => {
    if (window.youtubeControlsLoaded) {
        return;
    }
    window.youtubeControlsLoaded = true;

    let wasAdShowing = false;

    function getVideo() {
        return document.querySelector("#movie_player video");
    }

    function retrieveValue(name) {
        return getVideo()[name];
    }

    function isAdShowing() {
        return document.querySelector("#movie_player")?.classList.contains("ad-showing");
    }

    async function skipSingleAd() {
        if (isAdShowing()) {
            console.log(`Ad source: ${getVideo().src}`);
            let skipAdButton;
            if (skipAdButton = document.querySelector("div.ytp-ad-skip-button-slot > span.ytp-ad-skip-button-container")) {
                console.log("Clicking skip ad button");
                skipAdButton.click();
                console.log("Clicked skip ad button");
            } else {
                console.log("Skipping video ad");
                var video = getVideo();
                video.currentTime = video.duration;
                console.log("Skipped video ad");
            }
        }
    }

    async function skipAllAds() {
        const start = Date.now();
        while (isAdShowing() && Date.now() - start < 10000) {
            await new Promise((r) => setTimeout(r, 100));
            await skipSingleAd();
        }
    }

    function skipVideo(coefficient) {
        const video = getVideo();
        video.currentTime = video.currentTime + video.playbackRate * (video.skip || 5) * coefficient;
    }

    function togglePlay() {
        const video = getVideo();
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }

    function isMainPlayer(video) {
        return video.closest("#movie_player") !== null;
    }

    function videoEventListener(event) {
        const video = event.target;
        if (!isMainPlayer(video)) {
            return;
        }
        if (isAdShowing()) {
            wasAdShowing = true;
        } else if (wasAdShowing) {
            wasAdShowing = false;
            if (video.desiredSpeed && video.playbackRate !== video.desiredSpeed) {
                console.log(`Reapplying speed ${video.desiredSpeed}`);
                video.playbackRate = video.desiredSpeed;
            }
        }
    }

    function onRateChange(event) {
        const video = event.target;
        // After an ad, YouTube restores its menu speed before playing the video again, so wasAdShowing is still true
        if (isMainPlayer(video) && !isAdShowing() && !wasAdShowing) {
            video.desiredSpeed = video.playbackRate;
        }
    }

    document.addEventListener("loadedmetadata", videoEventListener, true);
    document.addEventListener("playing", videoEventListener, true);
    document.addEventListener("ratechange", onRateChange, true);

    Object.assign(window, {
        getVideo,
        retrieveValue,
        skipSingleAd,
        skipVideo,
        togglePlay,
    });
})();

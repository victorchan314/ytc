(() => {
    if (window.youtubeControlsLoaded) {
        return;
    }
    window.youtubeControlsLoaded = true;

    const AUTO_SKIP_ADS = false;
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
        if (!isAdShowing()) {
            return;
        }
        const skipAdButton = document.querySelector(".ytp-skip-ad-button");
        if (skipAdButton) {
            console.log("Clicking skip ad button");
            const timeBeforeClick = getVideo()?.currentTime;
            skipAdButton.click();
            await new Promise((r) => setTimeout(r, 100));
            if (!isAdShowing() || getVideo()?.currentTime < timeBeforeClick) {
                console.log("Clicked skip ad button");
                return;
            }
            console.log("Skip ad button had no effect");
        }
        const video = getVideo();
        if (video && !Number.isNaN(video.duration)) {
            console.log("Skipping video ad");
            video.currentTime = video.duration;
            console.log("Skipped video ad");
        }
    }

    async function skipAllAds() {
        for (let _ = 0; _ < 50 && isAdShowing(); _++) {
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

    async function videoEventListener(event) {
        const video = event.target;
        if (!isMainPlayer(video)) {
            return;
        }
        if (isAdShowing()) {
            wasAdShowing = true;
            if (AUTO_SKIP_ADS) {
                await skipAllAds();
            }
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

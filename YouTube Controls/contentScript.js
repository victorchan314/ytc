function getVideo() {
    return document.getElementsByTagName("video")[0];
}

function retrieveValue(name) {
    return getVideo()[name];
}

function isAdShowing() {
    return document.querySelector("div.html5-video-player").classList.contains("ad-showing");
}

function areCaptionsShowing() {
    return document.querySelector("button.ytp-subtitles-button").getAttribute("aria-pressed") === "true";
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
    var video = getVideo();
    video.currentTime = video.currentTime + video.playbackRate * (video.skip || 5) * coefficient;
}

function togglePlay() {
    var video = getVideo();
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}


async function videoEventListener(event) {
    if (event.target.src !== currentUrl) {
        console.log(`Current: ${currentUrl}`);
        console.log(`New: ${event.target.src}`);
        console.log("Skipping all ads...");
        currentUrl = event.target.src;
        await skipAllAds();
        console.log("Skipped all ads...");

        if (document.getElementsByTagName("body")[0].videoSpeed !== undefined) {
            getVideo().playbackRate = document.getElementsByTagName("body")[0].videoSpeed;
        }
    }
    listenForVideoSrcChanges(event.target);
}

function listenForVideoSrcChanges(video) {
    currentVideo.removeEventListener("loadedmetadata", videoEventListener);
    currentVideo = video;
    video.addEventListener("loadedmetadata", videoEventListener);
}

var currentVideo = getVideo();
var currentUrl = currentVideo.src;
//listenForVideoSrcChanges(currentVideo);

//currentVideo.addEventListener("loadstart", () => console.log("Inside loadstart"));
var captionsShowing = areCaptionsShowing();


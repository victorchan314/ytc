function retrieveValue(name) {
    return document.getElementsByTagName("video")[0][name];
}

function skipAd() {
    if (document.querySelector("div.html5-video-player").classList.contains("ad-showing")) {
        var video = document.getElementsByTagName("video")[0];
        video.currentTime = video.duration;
    }
}

function skipVideo(coefficient) {
    var video = document.getElementsByTagName("video")[0];
    video.currentTime = video.currentTime + video.playbackRate*(video.skip || 5)*coefficient;
}

function togglePlay() {
    var video = document.getElementsByTagName("video")[0];
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

//var video = document.getElementsByTagName("video")[0];
//var currentUrl = video.src;
//video.onloadedmetadata = () => {
//    if (this.src !== currentUrl) {
//        currentUrl = this.src;
//    }
//}

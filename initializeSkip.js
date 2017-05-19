var video = document.getElementsByTagName("video")[0];
if (!video.initializedSkip) {
    video.skip = 5;
    video.initializedSkip = true;
}

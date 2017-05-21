var video = document.getElementsByTagName("video")[0];
video.currentTime = video.currentTime + video.playbackRate*video.skip*coefficient;

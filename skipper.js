var video = document.getElementsByTagName("video")[0];
video.currentTime = video.getCurrentTime() + video.playbackRate*video.skip*coefficient;

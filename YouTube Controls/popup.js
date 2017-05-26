var background;
chrome.runtime.getBackgroundPage(function(backgroundPage) {
    background = backgroundPage;
});

function setPlayPause(callback) {
    chrome.tabs.executeScript({
        code: 'var name = "paused"'
    }, function() {
        chrome.tabs.executeScript({file: "retrieveValues.js"}, function(ret) {
            if (ret[0]) {
                document.getElementById("togglePlay").innerText = "Play";
                document.getElementById("playpause").innerText = "Play";
            } else {
                document.getElementById("togglePlay").innerText = "Pause";
                document.getElementById("playpause").innerText = "Pause";
            }
            if (callback) {
                callback();
            }
        });
    });
}

function showSpeed() {
    chrome.tabs.executeScript(null, {
        code: 'var name = "playbackRate"'
    }, function() {
        chrome.tabs.executeScript({file: "retrieveValues.js"}, function(ret) {
            document.getElementById("speed").value = ret[0];
        });
    });
}

function showSkip() {
    chrome.tabs.executeScript({file: "retrieveSkipValue.js"}, function(ret) {
        document.getElementById("skip").value = ret[0];
    });
}

document.addEventListener("DOMContentLoaded", function() {
    setPlayPause(showSpeed);
    document.getElementById("togglePlay").addEventListener("click", function() {
        background.togglePlay(setPlayPause);
    });
    document.getElementById("submitSpeed").addEventListener("click", function() {
        background.setSpeed(document.getElementById("speed").value);
    });
    document.getElementById("submitSkip").addEventListener("click", function() {
        background.setSkip(document.getElementById("skip").value);
    });
    document.getElementById("leftSkip").addEventListener("click", function() {
        background.skip(-1);
    });
    document.getElementById("rightSkip").addEventListener("click", function() {
        background.skip(1);
    });
    showSkip();
//    chrome.tabs.executeScript({code: 'var video = document.getElementsByTagName("video")[0]; if (!video.skip) {video.skip = 0;}'}, showSkip);
});

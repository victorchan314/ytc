var background = chrome.extension.getBackgroundPage();

function togglePlay() {
    chrome.tabs.executeScript({file: "togglePlay.js"}, setPlayPause);
}

function setSpeed(speed) {
    chrome.tabs.executeScript({
        code: 'document.getElementsByTagName("video")[0].playbackRate = ' + speed
    }, showSpeed);
}

function setSkip(skip) {
    chrome.tabs.executeScript({
        code: 'document.getElementsByTagName("video")[0].skip = ' + skip
    }, showSkip);
}

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
    document.getElementById("togglePlay").addEventListener("click", togglePlay);
    document.getElementById("submitSpeed").addEventListener("click", function() {
        setSpeed(document.getElementById("speed").value);
    });
    document.getElementById("submitSkip").addEventListener("click", function() {
        setSkip(document.getElementById("skip").value);
    });
    document.getElementById("leftSkip").addEventListener("click", function() {
        background.skip(-1);
    });
    document.getElementById("rightSkip").addEventListener("click", function() {
        background.skip(1);
    });
    chrome.tabs.executeScript({code: 'var video = document.getElementsByTagName("video")[0]; if (!video.skip) {video.skip = 5;}'}, showSkip);
});

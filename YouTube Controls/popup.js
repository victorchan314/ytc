var background;
chrome.runtime.getBackgroundPage((backgroundPage) => {
    background = backgroundPage;
});

function setPlayPause(callback) {
    chrome.tabs.executeScript({
        code: "var name = \"paused\";",
    }, () => {
        chrome.tabs.executeScript({file: "retrieveValues.js"}, (ret) => {
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

function showSpeed(callback) {
    chrome.tabs.executeScript({
        code: "var name = \"playbackRate\";",
    }, () => {
        chrome.tabs.executeScript({file: "retrieveValues.js"}, (ret) => {
            document.getElementById("speed").value = ret[0];
            if (callback) {
                callback();
            }
        });
    });
}

function showSkip(callback) {
    chrome.tabs.executeScript({
        code: "var name = \"skip\";",
    }, () => {
        chrome.tabs.executeScript({file: "retrieveValues.js"}, (ret) => {
            document.getElementById("skip").value = ret[0] || 5;
            if (callback) {
                callback();
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setPlayPause(() => showSpeed(showSkip));
    document.getElementById("togglePlay").addEventListener("click", () =>
        background.togglePlay(setPlayPause));
    document.getElementById("submitSpeed").addEventListener("click", () =>
        background.setSpeed(document.getElementById("speed").value));
    document.getElementById("submitSkip").addEventListener("click", () =>
        background.setSkip(document.getElementById("skip").value));
    document.getElementById("leftSkip").addEventListener("click", () =>
        background.skip(-1));
    document.getElementById("rightSkip").addEventListener("click", () =>
        background.skip(1));
    document.getElementById("toggleSkipAd").addEventListener("click", () =>
        background.skipAd());
});

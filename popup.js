function togglePlay() {
    chrome.tabs.executeScript(null, {file: "togglePlay.js"}, setPlayPause);
}

function setSpeed(speed) {
    chrome.tabs.executeScript(null, {
        code: 'document.getElementsByTagName("video")[0].playbackRate = ' + speed
    }, showSpeed);
}

function setPlayPause(callback) {
    chrome.tabs.executeScript(null, {
        code: 'var name = "paused"'
    }, function() {
        chrome.tabs.executeScript(null, {file: "retrieveValues.js"}, function(ret) {
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
        chrome.tabs.executeScript(null, {file: "retrieveValues.js"}, function(ret) {
            document.getElementById("speed").value = ret[0];
        });
    });
}

document.addEventListener("DOMContentLoaded", function() {
    setPlayPause(showSpeed);
    document.getElementById("togglePlay").addEventListener("click", togglePlay);
    document.getElementById("submitSpeed").addEventListener("click", function() {
        setSpeed(document.getElementById("speed").value);
    });
});

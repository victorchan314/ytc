function togglePlay() {
    chrome.tabs.executeScript(null, {file: "controls.js"});
}

function setSpeed(speed) {
    alert(speed);
    chrome.tabs.executeScript(null, {
        code: 'document.getElementById("video")[0].playbackRate = ' + speed;
    });
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("togglePlay").addEventListener("click", togglePlay);
    document.getElementById("submitSpeed").addEventListener("click", function() {
        setSpeed(document.getElementById("speed").value);
    });
});

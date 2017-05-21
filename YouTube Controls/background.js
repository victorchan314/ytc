function togglePlay(callback) {
    chrome.tabs.executeScript({file: "togglePlay.js"});
    callback();
}

function setSpeed(speed) {
    chrome.tabs.executeScript({
        code: 'document.getElementsByTagName("video")[0].playbackRate = ' + speed
    });
}

function setSkip(skip) {
    chrome.tabs.executeScript({
        code: 'document.getElementsByTagName("video")[0].skip = ' + skip
    });
}

function skip(coefficient) {
    chrome.tabs.executeScript(null, {
        code: 'var coefficient = ' + coefficient
    }, function() {
        chrome.tabs.executeScript(null, {file: "skipper.js"});
    });
}

chrome.commands.onCommand.addListener(function(command) {
    if (command == "leftSkip") {
        skip(-1);
    } else if (command == "rightSkip") {
        skip(1);
    }
});

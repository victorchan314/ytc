function skip(coefficient) {
    chrome.tabs.executeScript(null, {
        code: 'var coefficient = ' + coefficient
    }, function() {
        chrome.tabs.executeScript(null, {file: "skipper.js"});
    });
}

chrome.tabs.executeScript({code: 'var video = document.getElementsByTagName("video")[0]; if (!video.skip) {video.skip = 5;}'});
chrome.tabs.executeScript({code: 'alert("hi")'});
chrome.commands.onCommand.addListener(function(command) {
    if (command == "leftSkip") {
        skip(-1);
    } else if (command == "rightSkip") {
        skip(1);
    }
});

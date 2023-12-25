function togglePlay(callback) {
    chrome.tabs.executeScript({file: "togglePlay.js"});
    callback();
}

function setSpeed(speed) {
    chrome.tabs.executeScript({
        code: "document.getElementsByTagName(\"video\")[0].playbackRate = " + speed,
    });
}

function setSkip(skip) {
    chrome.tabs.executeScript({
        code: "document.getElementsByTagName(\"video\")[0].skip = " + skip,
    });
}

function skip(coefficient) {
    chrome.tabs.executeScript({
        code: "var coefficient = " + coefficient,
    }, function() {
        chrome.tabs.executeScript({file: "skipper.js"});
    });
}

function skipAd() {
    chrome.tabs.executeScript({file: "skipAd.js"});
}

chrome.commands.onCommand.addListener(function(command) {
    if (command === "leftSkip") {
        skip(-1);
    } else if (command === "rightSkip") {
        skip(1);
    } else if (command === "skipAds") {
        skipAd();
    }
});

chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {urlPrefix: "https://www.youtube.com/watch?v"},
                }),
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        urlPrefix: "https://www.youtube.com/c/",
                        urlSuffix: "/live"
                    },
                })
            ],
            actions: [new chrome.declarativeContent.ShowAction()]
        }]);
    });
});

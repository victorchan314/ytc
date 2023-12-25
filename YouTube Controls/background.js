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

function skipAd() {
    chrome.tabs.executeScript({file: "skipAd.js"});
}

function urlIsVideo(url) {
    return url.startsWith("https://www.youtube.com/watch") || (url.startsWith("https://www.youtube.com/c/") && url.endsWith("/live"));
}

chrome.commands.onCommand.addListener(function(command) {
    if (command == "leftSkip") {
        skip(-1);
    } else if (command == "rightSkip") {
        skip(1);
    } else if (command === "skipAds") {
        skipAd();
    }
});
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && urlIsVideo(tab.url)) {
        chrome.tabs.executeScript({
            code: 'var video = document.getElementsByTagName("video")[0]; if (!video.skip) {video.skip = 5;}'
        });
    }
});
chrome.runtime.onInstalled.addListener(function(details) {
    chrome.tabs.query({}, function(tabs) {
        for (var i = 0; i < tabs.length; i++) {
            if (urlIsVideo(tabs[i].url)) {
                chrome.tabs.executeScript(tabs[i].id, {
                    code: 'var video = document.getElementsByTagName("video")[0]; if (!video.skip) {video.skip = 5;}'
                });
            }
        }
    });
});
chrome.management.onEnabled.addListener(function(info) {
    if (info.id == 'hkmnecmckipaggdeagodpjammbnfijan') {
        chrome.tabs.query({}, function(tabs) {
            for (var i = 0; i < tabs.length; i++) {
                if (urlIsVideo(tabs[i].url)) {
                    chrome.tabs.executeScript(tabs[i].id, {
                        code: 'var video = document.getElementsByTagName("video")[0]; if (!video.skip) {video.skip = 5;}'
                    });
                }
            }
        });
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
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

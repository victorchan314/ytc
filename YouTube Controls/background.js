async function executeScript(func) {
    return await chrome.scripting.executeScript({
        target: {
            tabId: (await chrome.tabs.query({
                active: true,
                lastFocusedWindow: true,
            }))[0].id,
        },
        func,
    });
}

chrome.commands.onCommand.addListener(async (command) => {
    if (command === "leftSkip") {
        await executeScript(() => skipVideo(-1));
    } else if (command === "rightSkip") {
        await executeScript(() => skipVideo(1));
    } else if (command === "skipAds") {
        await executeScript(() => skipSingleAd());
    }
});


function urlIsVideo(url) {
    return url.startsWith("https://www.youtube.com/watch") || (url.startsWith("https://www.youtube.com/c/") && url.endsWith("/live"));
}

async function injectIntoAllTabs() {
    const tabs = await chrome.tabs.query({});
    tabs.forEach(async (tab) => {
        if (urlIsVideo(tab.url)) {
            await chrome.scripting.executeScript({
                target: {
                    tabId: tab.id,
                },
                files: ["contentScript.js"],
            });
        }
    });
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && urlIsVideo(tab.url)) {
        await chrome.scripting.executeScript({
            target: {
                tabId,
            },
            files: ["contentScript.js"],
        });
    }
});

chrome.runtime.onInstalled.addListener(async (details) =>
    await injectIntoAllTabs());

chrome.management.onEnabled.addListener(async (info) => {
    if (info.id == 'hkmnecmckipaggdeagodpjammbnfijan') {
        await injectIntoAllTabs();
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


async function executeScript(func) {
    const tab = (await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
    }))[0];
    return tab && urlIsVideo(tab.url) && await chrome.scripting.executeScript({
        target: {
            tabId: tab.id,
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

async function updateTab(tabId, url) {
    if (urlIsVideo(url)) {
        await chrome.action.enable(tabId);
        await chrome.scripting.executeScript({
            target: {
                tabId,
            },
            files: ["contentScript.js"],
        });
    } else {
        await chrome.action.disable(tabId);
    }
}

async function updateAllTabs() {
    await Promise.allSettled((await chrome.tabs.query({}))
        .map((tab) => updateTab(tab.id, tab.url)));
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
    if (changeInfo.url) {
        await updateTab(tabId, changeInfo.url);
    }
});

chrome.runtime.onInstalled.addListener(async () => {
    await chrome.action.disable();
    await updateAllTabs();
});


async function executeScript(func, args) {
    return await chrome.scripting.executeScript({
        target: {
            tabId: (await chrome.tabs.query({
                active: true,
                lastFocusedWindow: true,
            }))[0].id,
        },
        func,
        ...(args && { args, }),
    });
}

async function setPlayPause() {
    const r = await executeScript(() => retrieveValue("paused"));
    if (r[0].result) {
        document.getElementById("togglePlay").innerText = "Play";
        document.getElementById("playpause").innerText = "Play";
    } else {
        document.getElementById("togglePlay").innerText = "Pause";
        document.getElementById("playpause").innerText = "Pause";
    }
}

async function showSpeed() {
    const r = await executeScript(() => retrieveValue("playbackRate"));
    document.getElementById("speed").value = r[0].result;
}

async function showSkip() {
    const r = await executeScript(() => retrieveValue("skip"));
    document.getElementById("skip").value = r[0].result || 5;
}

document.addEventListener("DOMContentLoaded", async () => {
    await setPlayPause();
    await showSpeed();
    await showSkip();
    document.getElementById("togglePlay").addEventListener("click", async () => {
        await executeScript(() => togglePlay());
        await setPlayPause();
    });
    document.getElementById("submitSpeed").addEventListener("click", async () => {
        await executeScript((speed) => {
            const video = getVideo();
            video.playbackRate = speed;
            video.desiredSpeed = speed;
        }, [Number(document.getElementById("speed").value)]);
        await showSpeed();
    });
    document.getElementById("submitSkip").addEventListener("click", async () => {
        await executeScript((skip) => getVideo().skip = skip, [Number(document.getElementById("skip").value)]);
        await showSkip();
    });
    document.getElementById("leftSkip").addEventListener("click",
        async () => await executeScript(() => skipVideo(-1)));
    document.getElementById("rightSkip").addEventListener("click",
        async () => await executeScript(() => skipVideo(1)));
    document.getElementById("toggleSkipAd").addEventListener("click",
        async () => await executeScript(() => skipSingleAd()));
});


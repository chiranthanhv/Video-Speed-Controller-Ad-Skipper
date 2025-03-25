chrome.runtime.onInstalled.addListener(() => {
    console.log("Video Speed Controller & Ad Skipper Installed!");
    chrome.storage.sync.set({ videoSpeed: 1.0 }); // Set default speed in storage
});

// Listen for keyboard shortcuts from commands
chrome.commands.onCommand.addListener((command) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) return;
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: (cmd) => {
                let video = document.querySelector("video");
                if (!video) return;

                let newSpeed = video.playbackRate;
                switch (cmd) {
                    case "increase_speed":
                        newSpeed = Math.min(16, video.playbackRate + 0.25);
                        break;
                    case "decrease_speed":
                        newSpeed = Math.max(0.25, video.playbackRate - 0.25);
                        break;
                    case "reset_speed":
                        newSpeed = 1.0;
                        break;
                }
                video.playbackRate = newSpeed;
                chrome.storage.sync.set({ videoSpeed: newSpeed }); // Save speed globally
                console.log(`Speed updated: ${newSpeed}`);
            },
            args: [command]
        });
    });
});

// Sync speed across tabs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        chrome.storage.sync.get("videoSpeed", (data) => {
            let savedSpeed = data.videoSpeed || 1.0;
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                function: (speed) => {
                    let video = document.querySelector("video");
                    if (video) {
                        video.playbackRate = speed;
                        console.log(`Applied saved speed: ${speed}`);
                    }
                },
                args: [savedSpeed]
            });
        });
    }
});
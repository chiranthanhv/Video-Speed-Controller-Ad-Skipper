chrome.runtime.onInstalled.addListener(() => {
    console.log("Video Speed Controller & Ad Skipper Installed!");
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

                switch (cmd) {
                    case "increase_speed":
                        video.playbackRate = Math.max(0.25, video.playbackRate + 0.25);
                        break;
                    case "decrease_speed":
                        video.playbackRate = Math.max(0.25, video.playbackRate - 0.25);
                        break;
                    case "reset_speed":
                        video.playbackRate = 1.0;
                        break;
                }

                localStorage.setItem("videoSpeed", video.playbackRate);
                console.log(`Speed updated: ${video.playbackRate}`);
            },
            args: [command]
        });
    });
});

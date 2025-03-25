document.addEventListener("DOMContentLoaded", () => {
    const speedDisplay = document.getElementById("speedDisplay");
    const speedSlider = document.getElementById("speedSlider");
    const increaseSpeedBtn = document.getElementById("increaseSpeed");
    const decreaseSpeedBtn = document.getElementById("decreaseSpeed");
    const resetSpeedBtn = document.getElementById("resetSpeed");

    function updateSpeedDisplay(speed) {
        speedDisplay.textContent = `Speed: ${speed.toFixed(2)}x`;
        speedSlider.value = speed;
    }

    function adjustSpeed(change) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: (speedChange) => {
                    let video = document.querySelector("video");
                    if (video) {
                        video.playbackRate = Math.max(0.25, Math.min(16, video.playbackRate + speedChange));
                        let speed = video.playbackRate;
                        chrome.storage.sync.set({ videoSpeed: speed });

                        let overlay = document.getElementById("speedOverlay");
                        if (!overlay) {
                            overlay = document.createElement("div");
                            overlay.id = "speedOverlay";
                            overlay.style.position = "fixed";
                            overlay.style.bottom = "10%";
                            overlay.style.right = "10%";
                            overlay.style.background = "rgba(0, 0, 0, 0.7)";
                            overlay.style.color = "#fff";
                            overlay.style.padding = "10px";
                            overlay.style.borderRadius = "5px";
                            overlay.style.fontSize = "18px";
                            overlay.style.zIndex = "9999";
                            document.body.appendChild(overlay);
                        }
                        overlay.textContent = `Speed: ${speed.toFixed(2)}x`;
                        setTimeout(() => overlay.remove(), 1000);

                        return speed;
                    }
                    return null;
                },
                args: [change]
            });
        });
    }

    function resetSpeed() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: () => {
                    let video = document.querySelector("video");
                    if (video) {
                        video.playbackRate = 1.0;
                        chrome.storage.sync.set({ videoSpeed: 1.0 });

                        let overlay = document.createElement("div");
                        overlay.id = "speedOverlay";
                        overlay.style.position = "fixed";
                        overlay.style.bottom = "10%";
                        overlay.style.right = "10%";
                        overlay.style.background = "rgba(0, 0, 0, 0.7)";
                        overlay.style.color = "#fff";
                        overlay.style.padding = "10px";
                        overlay.style.borderRadius = "5px";
                        overlay.style.fontSize = "18px";
                        overlay.style.zIndex = "9999";
                        overlay.textContent = "Speed: 1.00x";
                        document.body.appendChild(overlay);
                        setTimeout(() => overlay.remove(), 1000);

                        return 1.0;
                    }
                    return null;
                }
            });
        });
    }

    // Button event listeners
    increaseSpeedBtn.addEventListener("click", () => adjustSpeed(0.25));
    decreaseSpeedBtn.addEventListener("click", () => adjustSpeed(-0.25));
    resetSpeedBtn.addEventListener("click", resetSpeed);

    // Slider event listener
    speedSlider.addEventListener("input", (event) => {
        let newSpeed = parseFloat(event.target.value);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: (speed) => {
                    let video = document.querySelector("video");
                    if (video) {
                        video.playbackRate = speed;
                        chrome.storage.sync.set({ videoSpeed: speed });
                    }
                },
                args: [newSpeed]
            });
        });
        updateSpeedDisplay(newSpeed);
    });

    // Load saved speed
    chrome.storage.sync.get("videoSpeed", (data) => {
        let savedSpeed = data.videoSpeed || 1.0;
        updateSpeedDisplay(savedSpeed);
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (event) => {
        if (event.altKey) {
            if (event.key === "=") adjustSpeed(0.25); // Alt + = to increase speed
            if (event.key === "-") adjustSpeed(-0.25); // Alt + - to decrease speed
            if (event.key === "0") resetSpeed(); // Alt + 0 to reset speed
        }
    });
});

document.getElementById("openSettings").addEventListener("click", function () {
    chrome.runtime.openOptionsPage();
});

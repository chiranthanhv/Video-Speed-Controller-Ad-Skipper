document.addEventListener("DOMContentLoaded", () => {
    const speedDisplay = document.getElementById("speedDisplay");
    const speedSlider = document.getElementById("speedSlider");
    const increaseSpeedBtn = document.getElementById("increaseSpeed");
    const decreaseSpeedBtn = document.getElementById("decreaseSpeed");
    const resetSpeedBtn = document.getElementById("resetSpeed");
    const openSettingsBtn = document.getElementById("openSettings");
    const backToMainBtn = document.getElementById("backToMain");
    const autoSkipCheckbox = document.getElementById("autoSkip");

    function updateSpeedDisplay(speed) {
        speedDisplay.textContent = `Speed: ${speed.toFixed(2)}x`;
        speedSlider.value = speed;
    }

    function executeScriptOnActiveTab(func, args = []) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0) return;
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: func,
                args: args
            });
        });
    }

    function adjustSpeed(change) {
        executeScriptOnActiveTab((speedChange) => {
            let video = document.querySelector("video");
            if (video) {
                video.playbackRate = Math.max(0.25, Math.min(16, video.playbackRate + speedChange));
                let speed = video.playbackRate;
                chrome.storage.sync.set({ videoSpeed: speed });
                showSpeedOverlay(speed);
                return speed;
            }
            return null;
        }, [change]);
    }

    function resetSpeed() {
        executeScriptOnActiveTab(() => {
            let video = document.querySelector("video");
            if (video) {
                video.playbackRate = 1.0;
                chrome.storage.sync.set({ videoSpeed: 1.0 });
                showSpeedOverlay(1.0);
                return 1.0;
            }
            return null;
        });
    }

    function showSpeedOverlay(speed) {
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
    }

    // Button event listeners
    increaseSpeedBtn.addEventListener("click", () => adjustSpeed(0.25));
    decreaseSpeedBtn.addEventListener("click", () => adjustSpeed(-0.25));
    resetSpeedBtn.addEventListener("click", resetSpeed);

    // Slider event listener
    speedSlider.addEventListener("input", (event) => {
        let newSpeed = parseFloat(event.target.value);
        executeScriptOnActiveTab((speed) => {
            let video = document.querySelector("video");
            if (video) {
                video.playbackRate = speed;
                chrome.storage.sync.set({ videoSpeed: speed });
            }
        }, [newSpeed]);
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

    // Handle settings UI
    openSettingsBtn.addEventListener("click", function () {
        document.getElementById("mainPopup").style.display = "none";
        document.getElementById("settingsPopup").style.display = "block";
    });

    backToMainBtn.addEventListener("click", function () {
        document.getElementById("settingsPopup").style.display = "none";
        document.getElementById("mainPopup").style.display = "block";
    });

    // Load saved settings
    chrome.storage.sync.get(["autoSkip"], (result) => {
        autoSkipCheckbox.checked = result.autoSkip || false;
    });

    autoSkipCheckbox.addEventListener("change", function () {
        chrome.storage.sync.set({ autoSkip: this.checked });
    });
});
document.addEventListener("DOMContentLoaded", () => {
    // Load saved settings
    chrome.storage.sync.get(["autoSkip", "defaultSpeed", "showOverlay"], (data) => {
        document.getElementById("autoSkip").checked = data.autoSkip || false;
        document.getElementById("defaultSpeed").value = data.defaultSpeed || 1.0;
        document.getElementById("showOverlay").checked = data.showOverlay !== false; // Default is true
    });

    // Save settings when user interacts
    document.getElementById("autoSkip").addEventListener("change", function () {
        chrome.storage.sync.set({ autoSkip: this.checked });
    });

    document.getElementById("saveOptions").addEventListener("click", () => {
        let defaultSpeed = parseFloat(document.getElementById("defaultSpeed").value);
        let showOverlay = document.getElementById("showOverlay").checked;

        if (defaultSpeed < 0.1 || defaultSpeed > 4.0) {
            document.getElementById("status").textContent = "Speed must be between 0.1x and 4.0x";
            return;
        }

        chrome.storage.sync.set({ defaultSpeed, showOverlay }, () => {
            document.getElementById("status").textContent = "Settings saved!";
            setTimeout(() => document.getElementById("status").textContent = "", 2000);
        });
    });
});

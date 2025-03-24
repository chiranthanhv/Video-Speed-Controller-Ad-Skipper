// Save settings
document.getElementById("autoSkip").addEventListener("change", function () {
    chrome.storage.sync.set({ autoSkip: this.checked });
});

// Load settings
chrome.storage.sync.get(["autoSkip"], (result) => {
    document.getElementById("autoSkip").checked = result.autoSkip || false;
});

// Function to track user actions
function trackEvent(action, label = "") {
    chrome.storage.sync.get(["usageData"], (result) => {
        let usageData = result.usageData || {};
        usageData[action] = (usageData[action] || 0) + 1;
        chrome.storage.sync.set({ usageData });
    });
}

// Example usage tracking
document.addEventListener("DOMContentLoaded", () => {
    trackEvent("extension_opened");
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "speed_increased") {
        trackEvent("speed_increased");
    } else if (message.action === "speed_decreased") {
        trackEvent("speed_decreased");
    } else if (message.action === "ad_skipped") {
        trackEvent("ad_skipped");
    }
});

// Function to retrieve analytics data
function getAnalytics(callback) {
    chrome.storage.sync.get(["usageData"], (result) => {
        callback(result.usageData || {});
    });
}

// Example: Retrieve and log usage data
getAnalytics((data) => console.log("Analytics Data:", data));

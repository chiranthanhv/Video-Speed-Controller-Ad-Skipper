// Function to track user actions
function trackEvent(action, label = "") {
    chrome.storage.sync.get(["usageData"], (result) => {
        let usageData = result.usageData || {};
        usageData[action] = (usageData[action] || 0) + 1;

        chrome.storage.sync.set({ usageData }, () => {
            if (chrome.runtime.lastError) {
                console.error("Storage Error:", chrome.runtime.lastError);
            }
        });
    });
}

// Track extension opening
document.addEventListener("DOMContentLoaded", () => {
    trackEvent("extension_opened");
});

// Define trackable actions
const trackableActions = ["speed_increased", "speed_decreased", "ad_skipped"];

// Listener for messages from other parts of the extension
chrome.runtime.onMessage.addListener((message) => {
    if (trackableActions.includes(message.action)) {
        trackEvent(message.action);
    }
});

// Function to retrieve analytics data
function getAnalytics(callback) {
    chrome.storage.sync.get(["usageData"], (result) => {
        if (chrome.runtime.lastError) {
            console.error("Analytics Fetch Error:", chrome.runtime.lastError);
            callback({});
            return;
        }
        callback(result.usageData || {});
    });
}

// Example: Retrieve and log usage data
getAnalytics((data) => console.log("Analytics Data:", data));

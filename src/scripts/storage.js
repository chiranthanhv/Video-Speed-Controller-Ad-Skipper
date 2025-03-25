const Storage = {
    set: (key, value, callback = () => {}) => {
        chrome.storage.sync.set({ [key]: value }, () => {
            if (chrome.runtime.lastError) {
                console.error("Storage Error:", chrome.runtime.lastError);
            }
            callback();
        });
    },
    get: (key, callback) => {
        chrome.storage.sync.get([key], (result) => {
            if (chrome.runtime.lastError) {
                console.error("Storage Read Error:", chrome.runtime.lastError);
                return;
            }
            callback(result[key]);
        });
    }
};


// Example Usage:
Storage.set("autoSkip", true);
Storage.get("autoSkip", (value) => console.log("AutoSkip:", value));

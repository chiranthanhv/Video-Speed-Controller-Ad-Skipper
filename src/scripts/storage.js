const Storage = {
    set: (key, value) => {
        chrome.storage.sync.set({ [key]: value });
    },
    get: (key, callback) => {
        chrome.storage.sync.get([key], (result) => callback(result[key]));
    }
};

// Example Usage:
Storage.set("autoSkip", true);
Storage.get("autoSkip", (value) => console.log("AutoSkip:", value));

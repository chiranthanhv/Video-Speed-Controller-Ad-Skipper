function adjustSpeed(change) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: (speedChange) => {
                let video = document.querySelector("video");
                if (video) {
                    video.playbackRate = Math.max(0.1, video.playbackRate + speedChange);
                    let speed = video.playbackRate;
                    localStorage.setItem("videoSpeed", speed);

                    // Display speed overlay
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
                    localStorage.setItem("videoSpeed", "1.0");

                    // Display speed overlay
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

document.getElementById("increaseSpeed").addEventListener("click", () => adjustSpeed(0.25));
document.getElementById("decreaseSpeed").addEventListener("click", () => adjustSpeed(-0.25));
document.getElementById("resetSpeed").addEventListener("click", resetSpeed);

// Load saved speed on popup open
document.addEventListener("DOMContentLoaded", () => {
    let savedSpeed = localStorage.getItem("videoSpeed") || "1.0";
    document.getElementById("speedDisplay").textContent = `Speed: ${parseFloat(savedSpeed).toFixed(2)}x`;
});

// Keyboard shortcuts
document.addEventListener("keydown", (event) => {
    if (event.altKey) {
        if (event.key === "=") adjustSpeed(0.25); // Alt + = to increase speed
        if (event.key === "-") adjustSpeed(-0.25); // Alt + - to decrease speed
        if (event.key === "0") resetSpeed(); // Alt + 0 to reset speed
    }
});

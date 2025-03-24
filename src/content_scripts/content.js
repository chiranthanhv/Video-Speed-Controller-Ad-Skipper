// Function to control video speed and show UI feedback
function adjustSpeed(speedChange) {
    let video = document.querySelector("video");
    if (video) {
        let newSpeed = Math.min(16, Math.max(0.25, video.playbackRate + speedChange)); // Restrict range
        video.playbackRate = newSpeed;
        showVideoOverlay(`Speed: ${newSpeed.toFixed(2)}x`);
    }
}

// Function to reset speed
function resetSpeed() {
    let video = document.querySelector("video");
    if (video) {
        video.playbackRate = 1.0;
        showVideoOverlay("Speed Reset");
    }
}

// Function to create and show YouTube-like overlay message
function showVideoOverlay(text) {
    let video = document.querySelector("video");
    if (!video) return;

    // Find the closest positioned parent (video container)
    let container = video.closest("div") || video.parentElement;
    if (!container) return;

    // Ensure container is positioned properly
    if (getComputedStyle(container).position === "static") {
        container.style.position = "relative";
    }

    // Check if overlay exists, else create it
    let overlay = document.getElementById("video-overlay-message");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "video-overlay-message";
        overlay.style.position = "absolute";
        overlay.style.top = "50%";
        overlay.style.left = "50%";
        overlay.style.transform = "translate(-50%, -50%)";
        overlay.style.background = "rgba(0, 0, 0, 0.7)";
        overlay.style.color = "#fff";
        overlay.style.fontSize = "24px";
        overlay.style.fontWeight = "bold";
        overlay.style.padding = "15px 30px";
        overlay.style.borderRadius = "10px";
        overlay.style.opacity = "0";
        overlay.style.transition = "opacity 0.3s ease-in-out";
        overlay.style.pointerEvents = "none";
        overlay.style.zIndex = "9999"; // Ensure it's above other elements

        // Append to video container
        container.appendChild(overlay);
    }

    // Update text and fade in
    overlay.textContent = text;
    overlay.style.opacity = "1";

    // Hide after 1 second
    clearTimeout(window.overlayTimeout);
    window.overlayTimeout = setTimeout(() => {
        overlay.style.opacity = "0";
    }, 1000);
}

// Keyboard shortcuts
document.addEventListener("keydown", (event) => {
    if (event.target.tagName.toLowerCase() !== "input" && event.target.tagName.toLowerCase() !== "textarea") {
        switch (event.key.toLowerCase()) {
            case "d":
                event.preventDefault();
                adjustSpeed(0.25); // Increase speed
                break;
            case "s":
                event.preventDefault();
                adjustSpeed(-0.25); // Decrease speed
                break;
            case "r":
                event.preventDefault();
                resetSpeed(); // Reset speed
                break;
        }
    }
}, { passive: false });

// Skip ads on YouTube
setInterval(() => {
    let skipBtn = document.querySelector(".ytp-ad-skip-button, .ytp-ad-overlay-close-button");
    if (skipBtn) {
        skipBtn.click();
        console.log("Ad skipped!");
    }
}, 1000);

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

// Function to create and show YouTube-like overlay message in the center of the video
function showVideoOverlay(text) {
    let video = document.querySelector("video");
    if (!video) return;

    // Get video position and size
    let rect = video.getBoundingClientRect();

    let overlay = document.getElementById("video-overlay-message");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "video-overlay-message";
        document.body.appendChild(overlay);

        overlay.style.position = "fixed"; // Fixed to viewport
        overlay.style.background = "rgba(0, 0, 0, 0.7)";
        overlay.style.color = "#fff";
        overlay.style.fontSize = "24px";
        overlay.style.fontWeight = "bold";
        overlay.style.padding = "15px 30px";
        overlay.style.borderRadius = "10px";
        overlay.style.opacity = "0";
        overlay.style.transition = "opacity 0.3s ease-in-out";
        overlay.style.pointerEvents = "none";
        overlay.style.zIndex = "9999"; // Ensure it's above all elements
    }

    // Position overlay at the center of the video
    overlay.style.left = `${rect.left + rect.width / 2}px`;
    overlay.style.top = `${rect.top + rect.height / 2}px`;
    overlay.style.transform = "translate(-50%, -50%)";

    // Set text and fade in
    overlay.textContent = text;
    overlay.style.opacity = "1";

    // Hide after 1 second
    clearTimeout(window.overlayTimeout);
    window.overlayTimeout = setTimeout(() => {
        overlay.style.opacity = "0";
    }, 1000);
}

// Function to skip YouTube ads
function skipAds() {
    // Find and click "Skip Ad" button
    let skipButton = document.querySelector(".ytp-ad-skip-button, .ytp-ad-skip-button-modern");
    if (skipButton) {
        skipButton.click();
        console.log("Ad skipped!");
        showVideoOverlay("Ad Skipped");
        return;
    }

    // Close ad overlays
    let closeOverlay = document.querySelector(".ytp-ad-overlay-close-button");
    if (closeOverlay) {
        closeOverlay.click();
        console.log("Overlay ad closed!");
        showVideoOverlay("Overlay Ad Closed");
        return;
    }

    // Mute video if unskippable ad
    let adPlaying = document.querySelector(".ad-showing");
    let video = document.querySelector("video");
    if (adPlaying && video) {
        video.muted = true;
        console.log("Unskippable ad detected, muted.");
        showVideoOverlay("Unskippable Ad Muted");
    }
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
            case "a":
                event.preventDefault();
                skipAds(); // Manually skip ads
                break;
        }
    }
}, { passive: false });

// Auto-skip ads every second
setInterval(skipAds, 1000);
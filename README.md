# YouTube Ad Skipper & Speed Controller 🚀

This script enhances your YouTube experience by:
- ✅ Skipping ads automatically
- ✅ Muting unskippable ads & unmuting after they end
- ✅ Controlling video playback speed with keyboard shortcuts
- ✅ Displaying an overlay UI for feedback

## Features
- 🔹 **Auto Skip Ads**: Skips skippable YouTube ads and closes overlay ads.
- 🔹 **Mute Unskippable Ads**: Automatically mutes unskippable ads and unmutes when the ad ends.
- 🔹 **Playback Speed Control**: Adjusts video speed easily with keyboard shortcuts.
- 🔹 **Overlay UI**: Displays real-time updates on speed changes and ad actions.

## Installation

### Method 1: Bookmarklet (Recommended)
1. Copy the script from `script.js`.
2. Open your browser’s bookmarks.
3. Add a new bookmark and paste the script as the URL, prefixed with `javascript:`.
4. Click the bookmark when on YouTube to activate the script.

### Method 2: Browser Extensions (Tampermonkey)
1. Install Tampermonkey (for Chrome, Firefox, or Edge).
2. Click "Create a new script" in Tampermonkey.
3. Paste the script and save it.
4. The script will now run automatically on YouTube.

## Usage

### Keyboard Shortcuts
| Key | Action                          |
|-----|---------------------------------|
| D   | Increase playback speed (+0.25x) |
| S   | Decrease playback speed (-0.25x) |
| R   | Reset speed to 1.0x             |
| A   | Skip ads & mute unskippable ads |

### Customization
- Modify `setInterval(skipAds, 1000);` to adjust how frequently it checks for ads.
- Change `Math.min(16, Math.max(0.25, video.playbackRate + speedChange));` to modify speed limits.

## License
This project is open-source. Use and modify freely!
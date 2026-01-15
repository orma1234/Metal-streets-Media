# Safari Setup for iPhone Testing

## Step 1: Enable Develop Menu in Safari

1. **Go to Safari → Settings** (or Preferences)
2. **Click the "Advanced" tab** (not "Developer")
3. **Check the box**: ✅ "Show Develop menu in menu bar"
4. Close the settings window

## Step 2: Enable Web Inspector on iPhone

1. On your **iPhone**, go to **Settings → Safari → Advanced**
2. **Turn ON**: "Web Inspector"

## Step 3: Connect iPhone to Mac

1. **Connect your iPhone to your Mac** using a USB cable
2. **Unlock your iPhone** and trust the computer if prompted
3. On your iPhone, open **Safari** and navigate to your website

## Step 4: Use Safari Web Inspector

1. On your **Mac**, open **Safari**
2. Go to **Develop** menu (now visible in menu bar)
3. You'll see your iPhone listed
4. Click: **Develop → [Your iPhone Name] → [Your Website URL]**
5. Safari Web Inspector will open, showing the iPhone's Safari console
6. You can now:
   - See console errors
   - Inspect elements
   - Debug the slider issue
   - See what's happening in real-time

## Alternative: Quick Test Without USB

If you just want to **test visually** (not debug), you can:

1. Start local server (see TESTING_GUIDE.md)
2. Open on iPhone Safari directly
3. No USB connection needed - just view the site

---

## Troubleshooting

**"Develop menu not showing":**
- Make sure you checked "Show Develop menu" in **Advanced** tab (not Developer tab)
- Restart Safari

**"iPhone not showing in Develop menu":**
- Make sure iPhone is unlocked
- Make sure "Web Inspector" is ON in iPhone Settings → Safari → Advanced
- Try disconnecting and reconnecting USB cable
- Make sure you trust the computer on iPhone

**"Can't see website in Develop menu":**
- Make sure Safari is open on iPhone with your website loaded
- Refresh the page on iPhone

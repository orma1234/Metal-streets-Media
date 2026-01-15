# Testing on Mobile Devices - Quick Guide

## Method 1: Browser DevTools (Fastest - No Phone Needed)

### Chrome/Edge:
1. Open your website in Chrome/Edge
2. Press `F12` (Windows) or `Cmd+Option+I` (Mac) to open DevTools
3. Click the device toggle button (or press `Cmd+Shift+M` / `Ctrl+Shift+M`)
4. Select "iPhone 12 Pro" or "iPhone 13 Pro" from the device dropdown
5. Refresh the page
6. Test the "Recent High-impact launches" slider section

### Safari (Mac only):
1. Open Safari
2. Go to Safari → Settings → Advanced
3. Check "Show Develop menu in menu bar"
4. Open your website in Safari
5. Go to Develop → Enter Responsive Design Mode (or press `Cmd+Ctrl+R`)
6. Select iPhone from the device dropdown
7. Test the slider

**Note:** DevTools simulation is good but not perfect. For Safari-specific issues, you need a real iPhone.

---

## Method 2: Test on Real iPhone (Best for Safari Testing)

### Step 1: Start a Local Server

**Option A: Using Python (Built into Mac)**
```bash
cd "/Users/kanavmadan/Desktop/Metal Streets/PROJECT Metal Streets Media"
python3 -m http.server 8000
```

**Option B: Using Node.js (if you have it)**
```bash
cd "/Users/kanavmadan/Desktop/Metal Streets/PROJECT Metal Streets Media"
npx serve -p 8000
```

**Option C: Using PHP (if you have it)**
```bash
cd "/Users/kanavmadan/Desktop/Metal Streets/PROJECT Metal Streets Media"
php -S localhost:8000
```

### Step 2: Find Your Mac's IP Address

1. Open **System Settings** (or System Preferences on older Macs)
2. Go to **Network**
3. Select your active connection (Wi-Fi or Ethernet)
4. Note your **IP Address** (looks like `192.168.1.xxx` or `10.0.0.xxx`)

**OR use Terminal:**
```bash
# For Wi-Fi
ipconfig getifaddr en0

# For Ethernet
ipconfig getifaddr en1
```

### Step 3: Connect iPhone to Same Wi-Fi

Make sure your iPhone is connected to the **same Wi-Fi network** as your Mac.

### Step 4: Open on iPhone

1. On your iPhone, open **Safari**
2. Type in the address bar: `http://YOUR_MAC_IP:8000`
   - Example: `http://192.168.1.100:8000`
3. The website should load!
4. Scroll to the "Recent High-impact launches" section
5. Test the slider - swipe left/right or use the navigation buttons

---

## Method 3: Quick Test Script

I've created a simple script you can run. Just double-click `start-server.sh` or run it in Terminal.

---

## Method 4: Deploy Online (Best for Sharing)

### GitHub Pages (Free):
1. Create a GitHub repository
2. Upload your files
3. Go to Settings → Pages
4. Select your branch and save
5. Your site will be at: `https://username.github.io/repo-name`
6. Open this URL on your iPhone

### Netlify Drop (Easiest):
1. Go to https://app.netlify.com/drop
2. Drag and drop your project folder
3. Get instant URL
4. Open on iPhone

### Vercel:
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project folder
3. Get instant URL

---

## Troubleshooting

### "Can't connect" on iPhone:
- ✅ Make sure Mac and iPhone are on same Wi-Fi
- ✅ Check Mac's firewall isn't blocking (System Settings → Network → Firewall)
- ✅ Try using `0.0.0.0` instead of `localhost` in server command
- ✅ Make sure server is still running in Terminal

### Slider still not showing:
- ✅ Hard refresh on iPhone: Hold refresh button → "Reload Without Content Blockers"
- ✅ Check Safari console (if you have Mac connected via USB, use Safari Web Inspector)
- ✅ Clear Safari cache: Settings → Safari → Clear History and Website Data

### Server won't start:
- ✅ Make sure you're in the correct directory
- ✅ Try a different port: `8001`, `3000`, or `8080`
- ✅ Check if port is already in use

---

## Quick Commands Reference

```bash
# Start Python server
python3 -m http.server 8000

# Start Node server (if you have Node.js)
npx serve -p 8000

# Find your IP address
ipconfig getifaddr en0

# Stop server
Press Ctrl+C in Terminal
```

---

## Testing Checklist

- [ ] Slider section is visible
- [ ] First project card displays correctly
- [ ] Can swipe left/right on cards
- [ ] Navigation buttons work
- [ ] Dots indicator shows current slide
- [ ] Images in project cards load
- [ ] Slider works in both portrait and landscape
- [ ] No blank/empty space where slider should be

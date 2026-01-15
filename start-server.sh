#!/bin/bash

# Quick server starter for mobile testing
# Double-click this file or run: bash start-server.sh

echo "🚀 Starting local server for mobile testing..."
echo ""
echo "📱 To test on your iPhone:"
echo "   1. Make sure iPhone is on the same Wi-Fi as this Mac"
echo "   2. Find your Mac's IP address (shown below)"
echo "   3. Open Safari on iPhone and go to: http://YOUR_IP:8000"
echo ""

# Get IP address
IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "localhost")
echo "📍 Your Mac's IP address: $IP"
echo ""
echo "🌐 Open this URL on your iPhone: http://$IP:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=================================="
echo ""

# Start server
cd "$(dirname "$0")"
python3 -m http.server 8000

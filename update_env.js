const fs = require('fs');
try {
    // PowerShell > redirection creates UTF-16LE files with BOM
    let log = fs.readFileSync('quick_tunnel.txt', 'utf16le');

    // Regex for Cloudflare Quick Tunnel URL
    const match = log.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);

    if (match) {
        const url = match[0];
        console.log('FOUND_URL:', url);
        fs.writeFileSync('frontend/.env.production', `VITE_API_URL=${url}\n`);
        console.log('UPDATED_ENV');
    } else {
        console.log('NO_URL_FOUND');
        // Debug: print a bit of content to see what we read
        console.log('LOG_PREVIEW:', log.substring(0, 200).replace(/\0/g, ''));
    }
} catch (e) {
    console.error(e);
}

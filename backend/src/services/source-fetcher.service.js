// Node 18+ has native fetch, but if we must use node-fetch v3 in CJS:
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

class SourceFetcherService {
    /**
     * Fetches data from a given URL with timeout and size limit protection.
     * Special handling for Google Drive links.
     * @param {string} url - Source URL
     * @returns {Promise<{buffer: Buffer, contentType: string}>}
     */
    static async fetch(url) {
        const TIMEOUT_MS = 10000; // 10s
        const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

        const downloadUrl = this._normalizeUrl(url);
        console.log(`[SourceFetcher] Fetching: ${downloadUrl}`);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

        try {
            const response = await fetch(downloadUrl, {
                signal: controller.signal,
                headers: { 'User-Agent': 'UGDES-Platform/1.0' }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch source: ${response.status} ${response.statusText}`);
            }

            // Check Content Length (if available)
            const contentLength = response.headers.get('content-length');
            if (contentLength && parseInt(contentLength) > MAX_SIZE_BYTES) {
                throw new Error(`File too large. Limit is 50MB.`);
            }

            const buffer = await response.buffer();
            if (buffer.length > MAX_SIZE_BYTES) {
                throw new Error(`Downloaded file exceeded 50MB limit.`);
            }

            return {
                buffer,
                contentType: response.headers.get('content-content-type') || 'application/octet-stream' // fallback
            };

        } finally {
            clearTimeout(timeout);
        }
    }

    static _normalizeUrl(url) {
        // Handle Google Drive Links
        // Pattern: https://docs.google.com/spreadsheets/d/[ID]/edit...
        if (url.includes('docs.google.com/spreadsheets/d/')) {
            const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
            if (match && match[1]) {
                return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=xlsx`;
            }
        }
        return url;
    }
}

module.exports = SourceFetcherService;

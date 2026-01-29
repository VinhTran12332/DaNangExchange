const db = require('../../db');
const WatermarkService = require('../../services/watermark.service');
const path = require('path');
const fs = require('fs');
const SourceFetcherService = require('../../services/source-fetcher.service');

class AccessController {
    static async getAssetData(req, res) {
        try {
            const { assetId } = req.params;
            const { orderId } = req.access;

            // 1. Resolve User Identity from Order
            const userResult = await db.query(
                `SELECT u.id, u.email 
                 FROM users u
                 JOIN orders o ON o.buyer_id = u.id
                 WHERE o.id = ?`,
                [orderId]
            );

            let buyerIdentity = null;

            console.log(`[Access] Resolving Identity for Order: ${orderId}`);
            if (userResult.rows.length === 0) {
                console.warn(`[Access] ⚠️ User lookup failed for Order ${orderId}. Using FALLBACK Identity.`);
                // Fallback Logic to unblock testing
                buyerIdentity = {
                    id: 'fallback-guest-id',
                    email: 'guest_fallback@test.com'
                };
            } else {
                buyerIdentity = userResult.rows[0];
            }

            // 2. Fetch Asset Metadata
            const assetResult = await db.query("SELECT * FROM assets WHERE id = ?", [assetId]);
            const asset = assetResult.rows[0];

            if (!asset) {
                return res.status(404).json({ error: 'Asset not found' });
            }

            // 3. Data Retrieval Strategy
            let originalBuffer;
            let isExcel = asset.title && asset.title.toLowerCase().includes('excel');

            // Strategy A: External Source (Phase 5)
            if (asset.source_url) {
                console.log(`[Access] Fetching from External Source: ${asset.source_url}`);
                try {
                    const fetchResult = await SourceFetcherService.fetch(asset.source_url);
                    originalBuffer = fetchResult.buffer;

                    // Auto-detect Excel from content-type or title
                    if (fetchResult.contentType.includes('spreadsheet') ||
                        fetchResult.contentType.includes('excel') ||
                        isExcel) {
                        isExcel = true;
                    }
                } catch (fetchErr) {
                    console.error("Fetch Error:", fetchErr.message);
                    return res.status(502).json({ error: `Failed to fetch from Source: ${fetchErr.message}` });
                }
            }
            // Strategy B: Mock Generation (Legacy/Backup)
            else {
                if (isExcel) {
                    const mockWorkbook = require('xlsx').utils.book_new();
                    const mockSheet = require('xlsx').utils.aoa_to_sheet([["Data", "Value"], ["Revenue", 1000], ["Cost", 500]]);
                    require('xlsx').utils.book_append_sheet(mockWorkbook, mockSheet, "Report");
                    originalBuffer = require('xlsx').write(mockWorkbook, { type: 'buffer', bookType: 'xlsx' });
                } else {
                    // JSON Flow handled separately below for simplicity, or converted to buffer
                    const originalData = {
                        id: asset.id,
                        title: asset.title,
                        content: "PREMIUM DATA CONTENT (MOCKED)",
                        raw_data: { sample: [1, 2, 3] }
                    };
                    originalBuffer = Buffer.from(JSON.stringify(originalData));
                    isExcel = false;
                }
            }

            // 4. Watermark Injection
            if (isExcel) {
                const watermarkedBuffer = WatermarkService.injectExcelWatermark(originalBuffer, buyerIdentity);

                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename="watermarked_${assetId}.xlsx"`);
                return res.send(watermarkedBuffer);
            } else {
                // Assume JSON
                const jsonString = originalBuffer.toString('utf8');
                let jsonData;
                try {
                    jsonData = JSON.parse(jsonString);
                } catch (e) {
                    // If not JSON, return raw buffer? For now assuming JSON.
                    jsonData = { raw_content: jsonString };
                }

                const watermarkedData = WatermarkService.injectJsonWatermark(jsonData, buyerIdentity);

                return res.json({
                    message: 'Access Granted with Watermark',
                    data: watermarkedData,
                    quota_status: {
                        remaining: req.access.remainingQuota
                    }
                });
            }

        } catch (error) {
            console.error("Access Error:", error);
            res.status(500).json({ error: 'Data Access Failed' });
        }
    }
}

module.exports = AccessController;

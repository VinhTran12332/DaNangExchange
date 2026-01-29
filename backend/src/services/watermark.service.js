const XLSX = require('xlsx');

class WatermarkService {
    /**
     * Injects watermark into JSON data
     * @param {Object} data - Original JSON data
     * @param {Object} identity - User identity (e.g., { id, email })
     * @returns {Object} - Watermarked JSON
     */
    static injectJsonWatermark(data, identity) {
        // Deep clone to avoid mutating original
        const watermarkedData = JSON.parse(JSON.stringify(data));

        // Add hidden metadata field
        watermarkedData._watermark = {
            buyer_id: identity.id,
            buyer_email: identity.email,
            timestamp: new Date().toISOString(),
            trace_id: this._generateTraceId(identity.id)
        };

        return watermarkedData;
    }

    /**
     * Injects watermark into Excel buffer
     * @param {Buffer} fileBuffer - Original Excel file buffer
     * @param {Object} identity - User identity
     * @returns {Buffer} - Watermarked Excel buffer
     */
    static injectExcelWatermark(fileBuffer, identity) {
        try {
            const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

            // Create a hidden "Metadata" sheet
            const metadata = [
                ["Property", "Value"],
                ["Buyer ID", identity.id],
                ["Buyer Email", identity.email],
                ["Transaction Time", new Date().toISOString()],
                ["Trace ID", this._generateTraceId(identity.id)],
                ["Notice", "This document is watermarked. Unauthorized distribution is traceable."]
            ];

            const ws = XLSX.utils.aoa_to_sheet(metadata);

            // Add or overwrite Metadata sheet
            // We prepend it or append it. Appending is safer.
            if (workbook.Sheets['WatermarkMetadata']) {
                workbook.Sheets['WatermarkMetadata'] = ws;
            } else {
                XLSX.utils.book_append_sheet(workbook, ws, "WatermarkMetadata");
            }

            // Optional: Hide the sheet (not supported by all parsers but good standard)
            if (!workbook.Workbook) workbook.Workbook = {};
            if (!workbook.Workbook.Sheets) workbook.Workbook.Sheets = [];
            // Finds the index of the new sheet to hide it (logic depends on lib version, simple append suffices for MVP)

            const outBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
            return outBuffer;
        } catch (error) {
            console.error("Excel Watermark Error:", error);
            // Fallback: return original if failed (or throw)
            return fileBuffer;
        }
    }

    static _generateTraceId(userId) {
        return `TR-${userId}-${Date.now().toString(36).toUpperCase()}`;
    }
}

module.exports = WatermarkService;

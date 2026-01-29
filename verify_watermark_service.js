const WatermarkService = require('./backend/src/services/watermark.service');
const assert = require('assert');
const XLSX = require('xlsx');

// Mock Data
const mockIdentity = { id: 101, email: "buyer@example.com" };
const mockData = { title: "Secret Asset", value: 1000 };

console.log("🔍 Verifying Watermark Service...");

try {
    // 1. Test JSON Watermark
    console.log("   [1/2] Testing JSON Injection...");
    const watermarkedJson = WatermarkService.injectJsonWatermark(mockData, mockIdentity);

    assert(watermarkedJson._watermark, "Missing _watermark field");
    assert.strictEqual(watermarkedJson._watermark.buyer_id, 101);
    assert.ok(watermarkedJson._watermark.timestamp, "Missing timestamp");
    assert.ok(watermarkedJson._watermark.trace_id.startsWith("TR-101-"), "Invalid Trace ID format");
    console.log("   ✅ JSON Watermark PASSED");

    // 2. Test Excel Watermark
    console.log("   [2/2] Testing Excel Injection...");
    // Create dummy excel buffer
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([["A", "B"], [1, 2]]);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Inject
    const watermarkedBuffer = WatermarkService.injectExcelWatermark(buffer, mockIdentity);

    // Validate
    const wbOut = XLSX.read(watermarkedBuffer, { type: 'buffer' });
    const metaSheet = wbOut.Sheets['WatermarkMetadata'];
    assert.ok(metaSheet, "Missing WatermarkMetadata sheet");

    const metaJson = XLSX.utils.sheet_to_json(metaSheet, { header: 1 });
    // Find row with "Buyer ID"
    const buyerRow = metaJson.find(row => row[0] === 'Buyer ID');
    assert.ok(buyerRow, "Missing Buyer ID in metadata");
    assert.strictEqual(buyerRow[1], 101);

    console.log("   ✅ Excel Watermark PASSED");

    console.log("🎉 All Verification Steps PASSED!");

} catch (error) {
    console.error("❌ Verification FAILED:", error);
    process.exit(1);
}

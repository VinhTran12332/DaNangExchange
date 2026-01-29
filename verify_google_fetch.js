const SourceFetcherService = require('./backend/src/services/source-fetcher.service');
const XLSX = require('xlsx');

const TEST_URL = "https://docs.google.com/spreadsheets/d/14JL_6rKIy97mDcBMPG2bgsO6X-YYZ8Xenn3yfZUEC-g/edit?usp=sharing";

async function verify() {
    console.log("🔍 Verifying Source Fetcher with Google Drive...");
    console.log(`   URL: ${TEST_URL}`);

    try {
        const { buffer } = await SourceFetcherService.fetch(TEST_URL);
        console.log(`   ✅ Fetched ${buffer.length} bytes successfully.`);

        // Parse to check if it's valid Excel
        console.log("   Parsing Excel content...");
        const wb = XLSX.read(buffer, { type: 'buffer' });
        console.log(`   ✅ Valid Excel File! Sheets: ${wb.SheetNames.join(', ')}`);

        // Print first cell of first sheet
        const firstSheet = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        console.log(`   📝 Content Preview (Row 1):`, data[0]);

    } catch (error) {
        console.error("❌ Fetch Failed:", error.message);
    }
}

verify();

const db = require('./backend/src/db');

async function updateSource() {
    const assetId = '5655a414-baaa-4397-bfc2-66afc021a864';
    const sourceUrl = 'https://docs.google.com/spreadsheets/d/14JL_6rKIy97mDcBMPG2bgsO6X-YYZ8Xenn3yfZUEC-g/edit?usp=sharing';

    console.log(`🔌 Wiring Asset ${assetId} to Real Data Source...`);
    try {
        await db.query(`
            UPDATE assets 
            SET source_url = ?, source_type = 'GOOGLE_DRIVE'
            WHERE id = ?
        `, [sourceUrl, assetId]);
        console.log("✅ Asset Source Updated Successfully.");
    } catch (e) {
        console.error("❌ Update Failed:", e);
    }
}

updateSource();

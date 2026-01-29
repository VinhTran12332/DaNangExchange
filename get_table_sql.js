const db = require('./backend/src/db');

async function getSql() {
    console.log("🔍 Getting CREATE TABLE SQL...");
    try {
        const result = await db.query("SELECT sql FROM sqlite_master WHERE type='table' AND name='users'");
        if (result.rows.length > 0) {
            console.log("SQL:", result.rows[0].sql);
        } else {
            console.log("❌ Table 'users' not found in sqlite_master.");
        }
    } catch (e) {
        console.error(e);
    }
}

getSql();

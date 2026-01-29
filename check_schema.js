const db = require('./backend/src/db');

async function checkSchema() {
    console.log("🔍 Checking Users Table Schema...");
    try {
        const info = await db.query("PRAGMA table_info(users)");
        console.log("Columns:", info.rows);
    } catch (e) {
        console.error(e);
    }
}

checkSchema();

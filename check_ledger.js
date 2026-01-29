const db = require('./backend/src/db');

async function checkLedger() {
    try {
        const result = await db.query("SELECT * FROM ledger_transactions ORDER BY timestamp DESC LIMIT 5");
        console.table(result.rows);
    } catch (e) {
        console.error(e);
    }
}

checkLedger();

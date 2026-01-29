const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'backend/ugdes.db');
const db = new sqlite3.Database(dbPath);

const sql = `
CREATE TABLE IF NOT EXISTS ledger_transactions (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    buyer_id TEXT,
    action_type TEXT NOT NULL,
    payload TEXT,
    block_number INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(order_id) REFERENCES orders(id)
);
`;

console.log("Running Migration: Create Ledger Table...");
db.run(sql, (err) => {
    if (err) {
        console.error("Migration Failed:", err);
    } else {
        console.log("Migration Success: ledger_transactions created.");
    }
    db.close();
});

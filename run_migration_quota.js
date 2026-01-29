const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'backend/ugdes.db');
const db = new sqlite3.Database(dbPath);

const sql = `ALTER TABLE orders ADD COLUMN purchased_quota INTEGER DEFAULT 1;`;

console.log("Running Migration: Add purchased_quota to orders...");
db.run(sql, (err) => {
    if (err) {
        // Ignore "duplicate column name" error if run multiple times
        if (err.message.includes("duplicate column name")) {
            console.log("Migration Skipped: Column already exists.");
        } else {
            console.error("Migration Failed:", err);
        }
    } else {
        console.log("Migration Success: purchased_quota column added.");
    }
    db.close();
});

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'backend/ugdes.db');
const db = new sqlite3.Database(dbPath);
const sqlPath = path.resolve(__dirname, 'backend/src/db/migrations/06_add_source_to_assets.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

console.log("Running Migration: Add Source Columns to Assets...");
db.exec(sql, (err) => {
    if (err) {
        console.error("Migration Failed:", err);
    } else {
        console.log("Migration Success: Columns source_url/source_type added.");
    }
    db.close();
});

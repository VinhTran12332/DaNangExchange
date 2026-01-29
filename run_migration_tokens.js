const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'backend/ugdes.db');
const db = new sqlite3.Database(dbPath);

const sql = `
CREATE TABLE IF NOT EXISTS access_tokens (
    token TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    remaining_quota INTEGER DEFAULT 5,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(order_id) REFERENCES orders(id)
);
`;

console.log("Running Migration: Create Access Tokens Table...");
db.run(sql, (err) => {
    if (err) {
        console.error("Migration Failed:", err);
    } else {
        console.log("Migration Success: access_tokens created.");
    }
    db.close();
});

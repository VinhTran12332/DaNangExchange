const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'backend/ugdes.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    console.log(`Checking DB at: ${dbPath}`);
    db.all("SELECT id, title FROM assets", (err, rows) => {
        if (err) console.error("Error reading assets:", err);
        else {
            console.log(`Found ${rows.length} assets:`);
            console.table(rows);
        }
    });
});

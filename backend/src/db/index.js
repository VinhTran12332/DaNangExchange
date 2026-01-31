const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Vercel /tmp or Local
const isVercel = process.env.VERCEL || false;
const dbName = 'ugdes.db';
let dbPath;

if (isVercel) {
    dbPath = path.join('/tmp', dbName);
    console.log('[DB] Running on VERCEL. Using ephemeral path:', dbPath);
    // On Vercel, we might need to copy a pre-seeded DB if we wanted persistence simulation
    // But for now, we just let it create a fresh one.
} else {
    // Local development
    dbPath = path.resolve(__dirname, '../../ugdes.db');
    console.log('[DB] Running Locally. Using persistent path:', dbPath);
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('[DB] Connection Error:', err.message);
    } else {
        console.log('[DB] Connected to SQLite database.');
    }
});

module.exports = {
    query: (text, params = []) => {
        return new Promise((resolve, reject) => {
            const method = text.trim().toUpperCase().startsWith('SELECT') ? 'all' : 'run';
            db[method](text, params, function (err, rows) {
                if (err) {
                    console.error('[DB] Query Error:', err.message);
                    return reject(err);
                }
                if (method === 'run') {
                    resolve({ rows: [], rowCount: this.changes, lastID: this.lastID });
                } else {
                    resolve({ rows: rows, rowCount: rows ? rows.length : 0 });
                }
            });
        });
    },
    db
};

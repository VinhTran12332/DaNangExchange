const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite file (creates it if not exists)
const dbPath = path.resolve(__dirname, '../../ugdes.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Helper to wrap sqlite run/all in Promises to mimic PG style slightly
module.exports = {
    // Safe wrapper for query based operations
    query: (text, params = []) => {
        return new Promise((resolve, reject) => {
            // Very basic normalization: SQLite uses ? for params, PG uses $1, $2
            // We need to assume the caller sends valid SQLite queries or we handle conversion
            // For this POC, let's assume we write queries compatible with the driver we use.
            // If we used a query builder like Knex this would be easier, but for now we stick to raw.

            // Simple logic: if query starts with SELECT, use 'all', else use 'run'
            const method = text.trim().toUpperCase().startsWith('SELECT') ? 'all' : 'run';

            db[method](text, params, function (err, rows) {
                if (err) {
                    console.error("Query Error:", err);
                    return reject(err);
                }
                // Mimic PG 'rows' structure
                if (method === 'run') {
                    // 'this' contains changes, lastID etc.
                    resolve({ rows: [], rowCount: this.changes, lastID: this.lastID });
                } else {
                    resolve({ rows: rows, rowCount: rows.length });
                }
            });
        });
    },
    db
};

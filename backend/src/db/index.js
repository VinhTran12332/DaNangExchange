const path = require('path');
const fs = require('fs');

// VERCEL DEBUG MODE: FORCE MEMORY ADAPTER
// We are removing sqlite3 logic entirely to prevent build/runtime crashes.
const MemoryAdapter = require('./memory_adapter');
const dbInstance = MemoryAdapter;
const isMock = true;

// Original SQLite logic commented out for debugging
/*
let dbInstance;
let isMock = false;

// 1. Try to load native SQLite3
// On Vercel, this often fails due to missing binaries or serverless constraints.
// We fallback to In-Memory Adapter if that happens.

const loadDatabase = () => {
    try {
        if (process.env.VERCEL) {
            console.log('[DB] Detected Vercel Environment. Switching to MemoryAdapter for stability.');
            throw new Error("Vercel Mode: Skip Native SQLite");
        }

        const sqlite3 = require('sqlite3').verbose();
        const dbPath = path.resolve(__dirname, '../../ugdes.db');
        console.log('[DB] Running Locally. Using persistent path:', dbPath);

        dbInstance = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('[DB] Connection Error:', err.message);
                throw err;
            } else {
                console.log('[DB] Connected to SQLite database.');
            }
        });

    } catch (error) {
        console.warn('[DB] SQLite Initialization Failed or Skipped:', error.message);
        console.warn('[DB] Falling back to In-Memory DB Adapter.');
        const MemoryAdapter = require('./memory_adapter');
        dbInstance = MemoryAdapter;
        isMock = true;
    }
};

loadDatabase();
*/

console.log('[DB] FORCE-MODE: Using In-Memory Adapter.');

module.exports = {
    query: (text, params = []) => {

        return new Promise((resolve, reject) => {
            const method = text.trim().toUpperCase().startsWith('SELECT') ? 'all' : 'run';
            dbInstance[method](text, params, function (err, rows) {
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
    db: dbInstance
};

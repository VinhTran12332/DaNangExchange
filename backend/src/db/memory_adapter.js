/**
 * In-Memory Database Adapter for Vercel/Mocking
 * Simulates SQLite behavior using JS Objects.
 */
class MemoryAdapter {
    constructor() {
        console.log('[MemoryDB] Initializing In-Memory Database...');
        this.tables = {
            users: [],
            assets: [],
            orders: [],
            ledger_transactions: []
        };
    }

    // Mimic sqlite3.Database.exec
    exec(sql, callback) {
        console.log('[MemoryDB] Executing SQL Schema (Mocked):', sql.substring(0, 50) + '...');
        // We don't ACTUALLY parse SQL strings here because it's too complex.
        // We assume the tables are already "created" in the constructor.
        if (callback) callback(null);
    }

    // Mimic db.query wrapper
    async query(text, params = []) {
        const sql = text.trim();
        const upperSql = sql.toUpperCase();

        // 1. SELECT
        if (upperSql.startsWith('SELECT')) {
            // Very naive parser for POC
            // Supported: "SELECT * FROM tableName"
            // Supported: "SELECT * FROM tableName WHERE id = ?"

            let tableName = null;
            for (const t of Object.keys(this.tables)) {
                if (upperSql.includes(t.toUpperCase())) { // overly simple
                    tableName = t;
                    break;
                }
            }

            if (!tableName) return { rows: [], rowCount: 0 };

            let rows = this.tables[tableName];

            // Filter logic (Naive)
            if (upperSql.includes('WHERE')) {
                // Assume logic like "WHERE id = ?" (Single param)
                // or "WHERE order_id = ?" 
                // We just rely on the params matching the query order roughly
                // This is risky for complex queries but fine for this specific app's simple Lookups

                // Hack: If searching by ID
                if (upperSql.includes('WHERE ID =')) {
                    rows = rows.filter(r => r.id === params[0]);
                } else if (upperSql.includes('WHERE ORDER_ID =')) {
                    rows = rows.filter(r => r.order_id === params[0]);
                }
            }

            // ORDER BY logic (Naive)
            if (upperSql.includes('ORDER BY TIMESTAMP')) {
                rows.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            }

            return { rows: rows, rowCount: rows.length };
        }

        // 2. INSERT
        if (upperSql.startsWith('INSERT')) {
            // Regex to find table name: INSERT INTO tableName
            const match = sql.match(/INSERT\s+INTO\s+(\w+)/i);
            if (match && match[1]) {
                const tableName = match[1].toLowerCase(); // e.g. 'ledger_transactions'

                if (this.tables[tableName]) {
                    // MAPPING PARAMS TO OBJECT
                    // This is hard because we don't know column names from just values.
                    // BUT, we know our app's specific queries.

                    let newRow = {};

                    if (tableName === 'ledger_transactions') {
                        // (id, order_id, buyer_id, action_type, payload, block_number)
                        newRow = {
                            id: params[0],
                            order_id: params[1],
                            buyer_id: params[2],
                            action_type: params[3],
                            payload: params[4],
                            block_number: params[5],
                            timestamp: new Date().toISOString()
                        };
                    } else if (tableName === 'orders') {
                        newRow = {
                            // Assuming order of params matches schema_sqlite.sql
                            // But wait, the app might use named inserts? 
                            // No, code uses standard SQL.
                            // Let's just create a generic object if we can't map perfectly.
                            id: params[0],
                            data: params // Debug fallback
                        };
                    }

                    // Fallback: If we can't map perfectly, just store the params array as 'raw'
                    // This is enough for a "Mock" that just needs to succeed without crashing.
                    if (Object.keys(newRow).length === 0) {
                        newRow = { _raw: params, timestamp: new Date().toISOString() };
                    }

                    this.tables[tableName].push(newRow);
                    return { rows: [], rowCount: 1, lastID: 0 };
                }
            }
        }

        console.warn('[MemoryDB] Unsupported Query Type or Table:', text);
        return { rows: [], rowCount: 0 };
    }
}

module.exports = new MemoryAdapter();

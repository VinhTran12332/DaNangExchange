const fs = require('fs');
const path = require('path');
const db = require('./index').db; // Import the raw sqlite object

const initDatabase = async () => {
    return new Promise((resolve, reject) => {
        const schemaPath = path.join(__dirname, 'schema_sqlite.sql');

        try {
            const schemaSql = fs.readFileSync(schemaPath, 'utf8');
            console.log('[DB] Reading schema from:', schemaPath);

            // Execute the schema
            db.exec(schemaSql, (err) => {
                if (err) {
                    console.error('[DB] Schema Initialization Failed:', err.message);
                    reject(err);
                } else {
                    console.log('[DB] Schema initialized successfully.');
                    resolve();
                }
            });

        } catch (error) {
            console.error('[DB] Could not read schema file:', error.message);
            reject(error);
        }
    });
};

module.exports = initDatabase;

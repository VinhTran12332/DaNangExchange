const db = require('../src/db');

const initSchema = async () => {
  console.log("🛠️ Initializing SQLite Schema...");

  const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        wallet_address TEXT,
        kyc_status TEXT DEFAULT 'NONE' CHECK( kyc_status IN ('NONE', 'PENDING', 'VERIFIED_VNEID') ),
        full_name TEXT,
        role TEXT DEFAULT 'BUYER',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

  const createAssetsTable = `
      CREATE TABLE IF NOT EXISTS assets (
        id TEXT PRIMARY KEY,
        seller_id TEXT REFERENCES users(id),
        title TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL CHECK (price >= 0),
        currency TEXT DEFAULT 'VND',
        license_type TEXT DEFAULT 'STANDARD',
        metadata TEXT DEFAULT '{}', -- JSON String
        preview_url TEXT,
        resource_url TEXT, -- PROTECTED
        status TEXT DEFAULT 'DRAFT',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

  try {
    await db.query(createUsersTable);
    console.log("✅ Table 'users' created.");

    await db.query(createAssetsTable);
    console.log("✅ Table 'assets' created.");

  } catch (err) {
    console.error("❌ Failed to create table:", err);
  }
};

initSchema();

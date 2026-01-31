-- SQLite Compatible Schema
-- Consolidated for Vercel / MVP Deployment

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- UUID stored as TEXT
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    wallet_address TEXT,
    kyc_status TEXT DEFAULT 'NONE', -- ENUM handled in app logic: NONE, PENDING, VERIFIED_VNEID
    full_name TEXT,
    role TEXT DEFAULT 'BUYER', -- BUYER, SELLER
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 2. ASSETS TABLE (Data Products)
CREATE TABLE IF NOT EXISTS assets (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price_vnd REAL NOT NULL,
    file_url TEXT, -- In real app, this is signed URL. Here just a mock.
    file_type TEXT, -- JSON, EXCEL, CSV
    preview_data TEXT, -- JSON snippet
    is_active INTEGER DEFAULT 1, -- Boolean 0/1
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(owner_id) REFERENCES users(id)
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    buyer_id TEXT NOT NULL,
    asset_id TEXT NOT NULL,
    amount_paid REAL,
    status TEXT DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED
    tx_hash TEXT, -- Mock Payment Transaction ID
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(buyer_id) REFERENCES users(id),
    FOREIGN KEY(asset_id) REFERENCES assets(id)
);

-- 4. LEDGER TRANSACTIONS (Hyperledger Mock)
CREATE TABLE IF NOT EXISTS ledger_transactions (
    id TEXT PRIMARY KEY, -- txId
    order_id TEXT NOT NULL,
    buyer_id TEXT,
    action_type TEXT NOT NULL,
    payload TEXT, -- JSON string
    block_number INTEGER,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP
);

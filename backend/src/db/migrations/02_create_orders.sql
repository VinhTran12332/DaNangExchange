-- Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    buyer_id TEXT NOT NULL,
    asset_id TEXT NOT NULL,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'CREATED' CHECK(status IN ('CREATED', 'LOCKED', 'RELEASED', 'REFUNDED', 'CANCELLED')),
    tx_hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (asset_id) REFERENCES assets(id)
);

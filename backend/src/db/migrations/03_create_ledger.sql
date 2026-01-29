CREATE TABLE IF NOT EXISTS ledger_transactions (
    id TEXT PRIMARY KEY, -- Hyperledger TxID (Mocked)
    order_id TEXT NOT NULL,
    buyer_id TEXT,
    action_type TEXT NOT NULL, -- e.g., 'LOCK_ASSET', 'TRANSFER_ASSET'
    payload TEXT, -- JSON payload of the transaction
    block_number INTEGER, -- Mock Block Number
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(order_id) REFERENCES orders(id)
);

-- Index for fast lookup by valid order
CREATE INDEX idx_ledger_order ON ledger_transactions(order_id);

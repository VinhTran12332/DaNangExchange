CREATE TABLE IF NOT EXISTS access_tokens (
    token TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    remaining_quota INTEGER DEFAULT 5, -- Default 5 downloads
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(order_id) REFERENCES orders(id)
);

CREATE INDEX idx_token ON access_tokens(token);

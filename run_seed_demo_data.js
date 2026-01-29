const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const crypto = require('crypto');

const dbPath = path.resolve(__dirname, 'backend/ugdes.db');
const db = new sqlite3.Database(dbPath);

const SELLER_ID = 'demo-seller-001';

const MOCK_ASSETS = [
    {
        title: "Vietnam Real Estate Transaction 2024",
        description: "Comprehensive dataset of residential and commercial real estate transactions in Hanoi and HCMC. Includes price, location (lat/long), and verify status.",
        price: 5000000,
        metadata: { format: "xlsx", rows: 15000, coverage: "Vietnam" },
        // Using a public sample sheet
        source_url: "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?gid=0",
        preview_url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "E-commerce Consumer Behavior Q4",
        description: "Anonymized shopping habits from top 3 platforms. Analysis of cart abandonment, payment preferences, and category trends.",
        price: 3500000,
        metadata: { format: "json", size: "45MB", sector: "Retail" },
        source_url: "https://jsonplaceholder.typicode.com/posts", // Mock JSON source
        preview_url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Crypto Market Sentiment Analysis (Live Feed)",
        description: "AI-driven sentiment scores for top 50 cryptocurrencies derived from social media and news outlets. Updated hourly.",
        price: 1200000,
        metadata: { format: "api_stream", update_frequency: "1h" },
        source_url: "https://api.coindesk.com/v1/bpi/currentprice.json",
        preview_url: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Global Supply Chain Logistics Report",
        description: "Shipping routes, container costs, and delay statistics for major trade lanes in 2024.",
        price: 8900000,
        metadata: { format: "pdf/report", pages: 120 },
        source_url: "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?gid=0",
        preview_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Healthcare Patient Demographics Sample",
        description: "Synthesized patient data for medical research testing. HIPAA compliant (fully synthetic).",
        price: 2000000,
        metadata: { format: "csv", rows: 5000 },
        source_url: "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?gid=0",
        preview_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Solar Energy Production Data (Vietnam)",
        description: "Daily output logs from 5 major solar farms in Central Vietnam. Great for energy forecasting models.",
        price: 4500000,
        metadata: { format: "time-series", interval: "15min" },
        source_url: "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?gid=0",
        preview_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
];

db.serialize(() => {
    // 1. Ensure Demo Seller Exists
    db.run(`INSERT OR IGNORE INTO users (id, email, password_hash, role, full_name)
            VALUES (?, ?, ?, ?, ?)`,
        [SELLER_ID, 'seller@ugdes.com', 'hash_placeholder', 'SELLER', 'Demo Data Provider'],
        (err) => {
            if (err) console.error("Error creating seller:", err);
            else console.log("✅ Demo Seller ensured.");
        }
    );

    // 2. Clear old demo assets (Optional: keeping for now, or maybe delete based on criteria?)
    // Let's just insert new ones.

    // 3. Insert Assets
    const stmt = db.prepare(`INSERT INTO assets (id, seller_id, title, description, price, metadata, resource_url, source_url, source_type, preview_url, status, created_at)
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PUBLISHED', CURRENT_TIMESTAMP)`);

    MOCK_ASSETS.forEach(asset => {
        const assetId = crypto.randomUUID();
        const metadataStr = JSON.stringify(asset.metadata);
        const sourceType = asset.source_url.includes('google') ? 'GOOGLE_DRIVE' : 'DIRECT_LINK';

        stmt.run(
            assetId,
            SELLER_ID,
            asset.title,
            asset.description,
            asset.price,
            metadataStr,
            asset.source_url, // resource_url (legacy)
            asset.source_url, // source_url
            sourceType,
            asset.preview_url,
            (err) => {
                if (err) console.error(`Failed to insert ${asset.title}:`, err.message);
                else console.log(`+ Added: ${asset.title}`);
            }
        );
    });

    stmt.finalize(() => {
        console.log("✅ Seeding Complete. Closing DB.");
        db.close();
    });
});

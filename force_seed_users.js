const db = require('./backend/src/db');

async function forceSeed() {
    console.log("🔨 Force Seeding Users...");
    try {
        // 1. Clear conflicting emails (to satisfy UNIQUE constraint)
        await db.query("DELETE FROM users WHERE email = ?", ['buyer@test.com']);
        await db.query("DELETE FROM users WHERE email = ?", ['seller@ugdes.com']);

        // 2. Clear by ID just in case
        await db.query("DELETE FROM users WHERE id = ?", ['test-buyer-id']);
        await db.query("DELETE FROM users WHERE id = ?", ['seller-001']);

        // 3. Insert fresh with OR REPLACE (Extra safety)
        await db.query(`
            INSERT INTO users (id, email, password_hash, role, kyc_status)
            VALUES (?, ?, ?, ?, ?)
        `, ['test-buyer-id', 'buyer@test.com', 'hashed_pass', 'BUYER', 'VERIFIED']);

        await db.query(`
            INSERT INTO users (id, email, password_hash, role, kyc_status)
            VALUES (?, ?, ?, ?, ?)
        `, ['seller-001', 'seller@ugdes.com', 'hashed_pass', 'SELLER', 'VERIFIED']);

        console.log("✅ Users Force Seeded.");
    } catch (error) {
        console.error("❌ Force Seed Failed. Message:", error.message);
        console.error("   Full Error:", error);
    }
}

forceSeed();

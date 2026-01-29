const db = require('./backend/src/db');

async function seedUsers() {
    console.log("🌱 Seeding Users...");
    try {
        // Seed Buyer
        await db.query(`
            INSERT OR IGNORE INTO users (id, email, password, role, kyc_status)
            VALUES (?, ?, ?, ?, ?)
        `, ['test-buyer-id', 'buyer@test.com', 'hashed_pass', 'BUYER', 'VERIFIED']);

        // Seed Seller
        await db.query(`
            INSERT OR IGNORE INTO users (id, email, password, role, kyc_status)
            VALUES (?, ?, ?, ?, ?)
        `, ['seller-001', 'seller@ugdes.com', 'hashed_pass', 'SELLER', 'VERIFIED']);

        console.log("✅ Users seeded successfully.");
    } catch (error) {
        console.error("❌ Seed Failed:", error);
    }
}

seedUsers();

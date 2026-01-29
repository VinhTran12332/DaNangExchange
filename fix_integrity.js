const db = require('./backend/src/db');

async function fixIntegrity() {
    console.log("🔧 Fixing Data Integrity...");
    try {
        // 1. Get all distinct buyer_ids from Orders
        const buyers = await db.query("SELECT DISTINCT buyer_id FROM orders");
        console.log(`Found ${buyers.rows.length} unique buyers in orders:`, buyers.rows.map(b => b.buyer_id));

        for (const b of buyers.rows) {
            const buyerId = b.buyer_id;

            // 2. Check if this user exists
            const userCheck = await db.query("SELECT id FROM users WHERE id = ?", [buyerId]);
            if (userCheck.rows.length === 0) {
                console.log(`⚠️ User '${buyerId}' missing. Auto-creating...`);
                // Insert mock user for this ID
                await db.query(`
                    INSERT INTO users (id, email, password_hash, role, kyc_status)
                    VALUES (?, ?, ?, 'BUYER', 'VERIFIED')
                `, [buyerId, `auto_${buyerId}@test.com`, 'hash']);
                console.log(`   ✅ Created user '${buyerId}'`);
            } else {
                console.log(`   ✅ User '${buyerId}' already exists.`);
            }
        }

        console.log("🎉 Data Integrity Verified. All Orders have valid Buyers.");
    } catch (e) {
        console.error("❌ Fix Failed:", e);
    }
}

fixIntegrity();

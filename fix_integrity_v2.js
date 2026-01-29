const db = require('./backend/src/db');

async function fixIntegrityV2() {
    console.log("🔧 Fixing Data Integrity (V2)...");
    try {
        const buyers = await db.query("SELECT DISTINCT buyer_id FROM orders");
        console.log(`Checking ${buyers.rows.length} unique buyers...`);

        for (const b of buyers.rows) {
            const buyerId = b.buyer_id;
            if (!buyerId) {
                console.log("   ⏩ Skipping NULL buyer_id");
                continue;
            }

            try {
                // Check exist
                const userCheck = await db.query("SELECT id FROM users WHERE id = ?", [buyerId]);
                if (userCheck.rows.length === 0) {
                    // Create with unique email
                    const uniqueEmail = `fix_${buyerId}_${Date.now()}@test.com`;
                    await db.query(`
                        INSERT INTO users (id, email, password_hash, role, kyc_status)
                        VALUES (?, ?, ?, 'BUYER', 'VERIFIED')
                    `, [buyerId, uniqueEmail, 'hash_fix']);
                    console.log(`   ✅ Created User: ${buyerId} (${uniqueEmail})`);
                } else {
                    console.log(`   ✅ User exits: ${buyerId}`);
                }
            } catch (err) {
                console.error(`   ❌ Failed to process ${buyerId}: ${err.message}`);
            }
        }

        console.log("DONE.");
    } catch (e) {
        console.error("Global Error:", e);
    }
}

fixIntegrityV2();

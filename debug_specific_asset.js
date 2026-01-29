const db = require('./backend/src/db');

async function diagnose() {
    const assetId = '5655a414-baaa-4397-bfc2-66afc021a864';
    console.log(`🔍 DIAGNOSING ASSET: ${assetId}`);

    try {
        // 1. Find Order
        const orderResult = await db.query("SELECT * FROM orders WHERE asset_id = ?", [assetId]);
        if (orderResult.rows.length === 0) {
            console.log("❌ CRITICAL: No Order found for this Asset ID!");
            return;
        }

        // Take the latest order if multiple
        const order = orderResult.rows[orderResult.rows.length - 1];
        console.log(`✅ Found Order: ${order.id}`);
        console.log(`   - Status: ${order.status}`);
        console.log(`   - Buyer ID: '${order.buyer_id}'`);

        // 2. Check User
        const userResult = await db.query("SELECT * FROM users WHERE id = ?", [order.buyer_id]);
        if (userResult.rows.length === 0) {
            console.log(`❌ CRITICAL: Buyer '${order.buyer_id}' does NOT exist in users table.`);

            // Attempt auto-fix right here
            console.log("🛠️ Attempting Emergency Fix...");
            await db.query(`
                INSERT INTO users (id, email, password_hash, role, kyc_status)
                VALUES (?, ?, 'hash', 'BUYER', 'VERIFIED')
            `, [order.buyer_id, `emergency_${Date.now()}@fix.com`]);
            console.log("   ✅ Emergency Fix Applied. User Created.");
        } else {
            console.log(`✅ User Exists: ${userResult.rows[0].email} (ID: ${userResult.rows[0].id})`);

            // 3. Test Join
            const joinResult = await db.query(`
                SELECT u.id 
                FROM users u
                JOIN orders o ON o.buyer_id = u.id
                WHERE o.id = ?
            `, [order.id]);

            if (joinResult.rows.length > 0) {
                console.log(`✅ JOIN Query matches.`);
            } else {
                console.log(`❌ JOIN Query FAILS even though user exists! (Possible whitespace/type issue)`);
                console.log(`   User ID length: ${userResult.rows[0].id.length}`);
                console.log(`   Order BuyerID length: ${order.buyer_id.length}`);
            }
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

diagnose();

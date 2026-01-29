const db = require('./backend/src/db');

async function reproduce() {
    console.log("🐞 PROBING ACCESS CONTROLLER LOGIC...");

    // 1. Get recent orders to test with
    const orders = await db.query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 5");
    if (orders.rows.length === 0) {
        console.log("❌ No orders found to test.");
        return;
    }

    for (const order of orders.rows) {
        console.log(`\n📦 Testing Order: ${order.id}`);
        console.log(`   - BuyerID in Order: '${order.buyer_id}'`);

        // 2. Run the EXACT query from AccessController
        const query = `
            SELECT u.id, u.email 
            FROM users u
            JOIN orders o ON o.buyer_id = u.id
            WHERE o.id = ?
        `;
        const result = await db.query(query, [order.id]);

        if (result.rows.length > 0) {
            console.log(`   ✅ JOIN SUCCESS. Found User: ${result.rows[0].email}`);
        } else {
            console.log(`   ❌ JOIN FAILED.`);

            // 3. Dig deeper if failed
            const userDirect = await db.query("SELECT * FROM users WHERE id = ?", [order.buyer_id]);
            if (userDirect.rows.length === 0) {
                console.log(`      🚫 CAUSE: User '${order.buyer_id}' does NOT exist in users table.`);
            } else {
                console.log(`      ❓ CAUSE: User exists but JOIN failed. Type mismatch?`);
                console.log(`      User ID Type: ${typeof userDirect.rows[0].id} Value: '${userDirect.rows[0].id}'`);
                console.log(`      Order BuyerID Type: ${typeof order.buyer_id} Value: '${order.buyer_id}'`);
            }
        }
    }
}

reproduce();

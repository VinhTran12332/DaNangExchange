const db = require('./backend/src/db');

async function debugState() {
    console.log("🔍 INSPECTING DB STATE...");

    try {
        // 1. Check all users
        const users = await db.query("SELECT id, email FROM users");
        console.log("👥 CURRENT USERS:");
        if (users.rows.length === 0) console.log("   (Table Empty)");
        users.rows.forEach(u => console.log(`   - ID: ${u.id} | Email: ${u.email}`));

        // 2. Check recent orders
        const orders = await db.query("SELECT id, buyer_id, status FROM orders ORDER BY created_at DESC LIMIT 3");
        console.log("\n📦 RECENT ORDERS:");
        if (orders.rows.length === 0) console.log("   (Table Empty)");
        orders.rows.forEach(o => console.log(`   - OrderID: ${o.id} | BuyerID: ${o.buyer_id} | Status: ${o.status}`));

    } catch (e) {
        console.error("❌ Error reading DB:", e);
    }
}

debugState();

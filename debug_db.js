const db = require('./backend/src/db');

async function debug() {
    console.log("🔍 Inspecting Orders and Users...");
    try {
        const orders = await db.query("SELECT id, buyer_id FROM orders LIMIT 5");
        console.log("Orders:", orders.rows);

        const users = await db.query("SELECT id, email FROM users");
        console.log("Users:", users.rows);

        // Check for mismatch
        orders.rows.forEach(o => {
            const userExists = users.rows.find(u => u.id === o.buyer_id);
            if (!userExists) {
                console.warn(`⚠️ Mismatch! Order ${o.id} has buyer_id '${o.buyer_id}' which does NOT exist in users table.`);
            } else {
                console.log(`✅ Order ${o.id} matches user ${userExists.email}`);
            }
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

debug();

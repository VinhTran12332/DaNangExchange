// Run: node scripts/test_catalog_flow.js
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function testCatalog() {
    console.log('🔄 Testing Catalog Module...');

    // 1. LOGIN to get token
    console.log('--- Step 1: Login ---');
    let token;
    try {
        const loginRes = await fetch('http://localhost:3000/api/auth/login-mock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'seller_1@vn.vn', role: 'SELLER' })
        });
        const loginData = await loginRes.json();
        token = loginData.token;
        console.log('✅ Logged in as:', loginData.user.email);
    } catch (e) {
        console.error('❌ Login failed:', e.message);
        return;
    }

    // 2. CREATE ASSET
    console.log('\n--- Step 2: List Asset ---');
    let assetId;
    try {
        const assetRes = await fetch('http://localhost:3000/api/assets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: "Ha Noi Traffic Data 2024",
                description: "Real-time traffic density in 5 districts.",
                price: 500000,
                metadata: { format: "CSV", rows: 10000, source: "Camera AI" },
                resource_url: "s3://hidden-bucket/traffic_hanoi.csv"
            })
        });
        const assetData = await assetRes.json();
        if (assetRes.ok) {
            console.log('✅ Asset Created:', assetData.asset_id);
            assetId = assetData.asset_id;
        } else {
            console.error('❌ Create Asset Failed:', assetData);
        }
    } catch (e) { console.error(e); }

    // 3. LIST ASSETS (Public)
    console.log('\n--- Step 3: List Public Assets ---');
    try {
        const listRes = await fetch('http://localhost:3000/api/assets');
        const items = await listRes.json();
        console.log(`✅ Found ${items.length} assets.`);
        if (items.length > 0) {
            console.log('   Example:', items[0].title, '-', items[0].price, 'VND');
        }
    } catch (e) { console.error(e); }

    // 4. GET DETAIL (Check security)
    console.log('\n--- Step 4: Get Detail Security Check ---');
    if (assetId) {
        try {
            const detailRes = await fetch(`http://localhost:3000/api/assets/${assetId}`);
            const detail = await detailRes.json();
            console.log('✅ Title:', detail.title);

            if (!detail.resource_url) {
                console.log('✅ Security Check Passed: resource_url is HIDDEN');
            } else {
                console.log('❌ CRITICAL: resource_url LEAKED!');
            }
        } catch (e) { console.error(e); }
    }
}

testCatalog();

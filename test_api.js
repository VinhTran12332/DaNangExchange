// Native fetch in Node 18+
async function test() {
    console.log("Testing Backend Connection...");
    try {
        // 1. Test Root
        const rootRes = await fetch('http://localhost:3000/');
        console.log(`Root Status: ${rootRes.status}`);
        const rootText = await rootRes.text();
        console.log(`Root Body: ${rootText}`);

        // 2. Test Create Order
        console.log("\nTesting Create Order...");
        const response = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ asset_id: 'test-asset' })
        });

        console.log(`Order Status: ${response.status}`);
        const contentType = response.headers.get('content-type');
        console.log(`Content-Type: ${contentType}`);

        const text = await response.text();
        console.log(`Body: ${text.substring(0, 500)}`); // Show first 500 chars

    } catch (e) {
        console.error("Test Failed:", e);
    }
}

test();

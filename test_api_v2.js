const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000/api/assets';

async function testApi() {
    try {
        console.log(`Fetching from ${API_URL}...`);
        const res = await fetch(API_URL);
        if (!res.ok) {
            console.error(`Status: ${res.status} ${res.statusText}`);
            const text = await res.text();
            console.error('Body:', text);
        } else {
            const data = await res.json();
            console.log('✅ Success! Assets found:', data.length);
            data.forEach(a => console.log(`- [${a.id}] ${a.title}`));
        }
    } catch (err) {
        console.error('❌ Network Error:', err.message);
    }
}

testApi();

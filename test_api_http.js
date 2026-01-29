const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/assets',
    method: 'GET'
};

const req = http.request(options, res => {
    console.log(`STATUS: ${res.statusCode}`);

    let data = '';
    res.on('data', chunk => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('DATA LENGTH:', json.length);
            if (json.length > 0) {
                console.log('FIRST ITEM:', json[0]);
            }
        } catch (e) {
            console.error('FAILED TO PARSE JSON:', data.substring(0, 100));
        }
    });
});

req.on('error', error => {
    console.error('ERROR:', error);
});

req.end();

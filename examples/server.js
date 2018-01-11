const http = require('http');
const argv = require('minimist')(process.argv.slice(2));
const ParticeepClient = require('../lib/api-sdk');

let server = http.createServer(function (req, res) {
    const client = new ParticeepClient(
        'https://api.particeep.com/v1',
        'd6a53e1a-fc8e-4251-9dda-fabbce5f2a2c',
        '9bb3c122-0272-4bed-a632-19d5d52c7b5e'
    );

    client.get('info').then(result => {
        const data = result.data;
        send200(res, `
            <ul>
                <li>Version: ${data.version}</li>
                <li>DebugEnable: ${data.debugEnable}</li>
                <li>MetaEnable: ${data.metaEnable}</li>
            </ul>
        `);
    }).catch(error => {
        send500(res);
    });

    function sendResponse(res, statusCode, body) {
        res.writeHead(statusCode, {'Content-Type': 'text/html'});
        res.write(body);
        res.end();
    }

    function send200(res, body) {
        sendResponse(res, 200, body || '<h1>OK</h1>');
    }

    function send500(res, body) {
        sendResponse(res, 404, body || '<h1>Error occured</h1>');
    }
});

server.listen(argv.p || 3000);

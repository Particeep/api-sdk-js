const http = require('http');
const argv = require('minimist')(process.argv.slice(2));
const routes = require('./routes');
const controller = require('./controller');

let server = http.createServer(function (req, res) {
    if (req.method === 'POST' || req.method === 'PUT') {
        handleRequestWithBody();
    } else {
        const url = req.url.split('?');
        forwardToController(req, res, url[0], url[1]);
    }

    function handleRequestWithBody() {
        let body = '';
        req.on('data', data => body += data);
        req.on('end', () => {
            forwardToController(req, res, req.url, body);
        });
    }

    function forwardToController(req, res, url, params) {
        const method = controller[routes[req.method + url]];
        if (method) method(req, res)(parseQueryString(params));
        else controller[routes['GET/404']](req, res)();
    }

    function parseQueryString(qs) {
        if (!qs) return null;
        return JSON.parse('{"' + decodeURI(qs).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
    }
});

server.listen(argv.p || 3000);
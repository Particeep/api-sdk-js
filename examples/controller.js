const ParticeepClient = require('../lib/api-sdk');

const client = new ParticeepClient({
    baseURL: 'https://api.particeep.com/v1',
    apiKey: 'd6a53e1a-fc8e-4251-9dda-fabbce5f2a2c',
    apiSecret: '9bb3c122-0272-4bed-a632-19d5d52c7b5e'
});

function redirect(res, url) {
    res.statusCode = 302;
    res.setHeader('Location', url);
    res.end();
}
function sendResponse(res, statusCode, body) {
    res.writeHead(statusCode, {'Content-Type': 'text/html'});
    res.write(body);
    res.end();
}

function send200(res, body) {
    sendResponse(res, 200, body || '<h1>OK</h1>');
}

function send500(res, error) {
    console.error(error);
    sendResponse(res, 500, '<h1>Error occured</h1>');
}

const controller = {
    index: (req, res) => () => {
        client.get('fundraises/search', {fundraise_type: 'FUNDRAISE_LOAN'}).then(result => {
            let html = '';
            result.data.data.map(fundraise => {
                html += `
                    <li title="${fundraise.fundraise_id}">
                        <strong>${fundraise.fundraise_id}</strong>
                        - target: ${fundraise.amount_target} EUR
                        <div>
                            <form action="edit" method="POST" style="display:inline-block">
                                <input type="hidden" name="id" value="${fundraise.fundraise_id}"/>
                                <input type="hidden" name="amount_target" value="${fundraise.amount_target + 100}"/>
                                <button>+100</button>
                            </form>
                            <form action="remove" method="POST" style="display:inline-block">
                                <input type="hidden" name="id" value="${fundraise.fundraise_id}"/>
                                <button>Delete</button>
                            </form>
                        </div>
                    </li>
                `;
            });
            send200(res, `
                <form action="add" method="POST">
                    <label>Amount target</label>
                    <input name="amount_target" value="0"/>
                    <button>Add</button>
                </form>
                <ul>${html}</ul>
            `);
        }).catch(error => {
            send500(res, error);
        });

    },

    add: (req, res) => (params) => {
        client.put(`loan/fundraise`, {
            "name": "Nouvelle fundraise",
            "amount_target": parseInt(params.amount_target),
            "offer": {
                "term": 1,
                "rate": 0,
                "tax_rate": 0,
                "amount_min": 100,
                "bond_price": 100,
                "method": "Constant",
                "repayment_frequency": 0,
                "repayment_start_date": "2018-01-11T17:22:03Z"
            }
        }).then(result => {
            redirect(res, '/');
        }).catch(error => {
            send500(res, error);
        });
    },

    remove: (req, res) => (params) => {
        client.delete(`loan/fundraise/${params.id}`).then(result => {
            redirect(res, '/');
        }).catch(error => {
            send500(res, error);
        });
    },


    edit: (req, res) => (params) => {
        const {id, amount_target} = params;
        client.post(`loan/fundraise/${id}`, {amount_target: parseInt(amount_target)}).then(result => {
            redirect(res, '/');
        }).catch(error => {
            send500(res, error);
        });
    },

    info: (req, res) => () => {
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
            send500(res, error);
        });
    },

    404: (req, res) => () => {
        send200(res, `<h1>404</h1>`);
    },
};

module.exports = controller;
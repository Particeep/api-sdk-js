const crypto = require('crypto');
const axios = require('axios');

class ParticeepRequest {

    constructor(params) {
        const {baseURL, apiKey, apiSecret} = params;

        const dateHeader = this._buildDateHeader();
        this._http = axios.create({
            baseURL: baseURL,
            headers: {
                Accept: 'application/json',
                api_key: apiKey,
                Authorization: this._buildAuthorizationHeader(apiKey, apiSecret, dateHeader),
                DateTime: dateHeader
            }
        });
    }

    _buildDateHeader() {
        // slice because toISOString is too precise
        return new Date().toISOString().slice(0, 19) + 'Z';
    }

    _buildAuthorizationHeader(apiKey, apiSecret, dateHeader) {
        // Concat your keys and DateTime in the following order: APISecret + APIKey + DateTime
        const toSign = apiSecret + apiKey + dateHeader;

        // utf8-encoding
        const messageBytes = new Buffer(toSign);
        const secretBytes = new Buffer(apiSecret);

        // Create hmac with sha1, using native crypto library
        const result = crypto.createHmac('sha1', secretBytes);

        // Add messageBytes to hmac, get hex and encode it in base64
        const signature = new Buffer(result.update(messageBytes).digest('hex')).toString('base64');

        return `PTP:${apiKey}:${signature}`;
    }

    _toQueryString(obj) {
        let qs = [];
        for (let p in obj)
            if (obj[p]) qs.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        return '?' + qs.join('&');
    }

    get(url, params) {
        return this._http.get(url + this._toQueryString(params));
    }

    post(url, params) {
        return this._http.post(url, params);
    }

    put(url, params) {
        return this._http.put(url, params);
    }

    delete(url, params) {
        return this._http.delete(url, params);
    }
}

module.exports = ParticeepRequest;
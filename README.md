# Particeep API Client for JavaScript

### Installation

Using npm
`$ npm install `

Importing directly compiled sources
`<script src="..../dist/api-sdk.min.js"/>`


### Examples

Initialize the sdk
```
const ParticeepClient = require('../lib/api-sdk');

const client = new ParticeepClient({
    baseURL: 'https://api.particeep.com/v1',
    apiKey: 'd6a53e1a-fc8e-4251-9dda-fabbce5f2a2c',
    apiSecret: '9bb3c122-0272-4bed-a632-19d5d52c7b5e'
});
```

Performing a `GET` request
```
client.get('fundraises/search', {fundraise_type: 'FUNDRAISE_LOAN'}).then(result => {
    console.log(result.data);
}).catch(error => {
    console.log(error);
});
```


Performing a `PUT` request
```
client.put(`loan/fundraise`, {
    "name": "Nouvelle fundraise",
    "amount_target": 1000,
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
    console.log(result.data);
}).catch(error => {
    console.log(error);
});
```

Performing a `POST` request
```
const someFundraiseId = 'efcf18cd-3372-4sda-a54c-b8727d9bccc6';
client.post(`loan/fundraise/${someFundraiseId}`, {amount_target: 1100}).then(result => {
    console.log(result.data);
}).catch(error => {
    console.log(error);
});
```
        
Performing a `DELETE` request
```
client.delete(`loan/fundraise/${someFundraiseId}`).then(result => {
    console.log(result.data);
}).catch(error => {
    console.log(error);
});
```
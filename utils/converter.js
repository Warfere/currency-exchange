'use strict';
const http = require('https')

class Converter {
    constructor() {
        this.exchangeUrl = "api.exchangeratesapi.io"
        this.path = "/latest?base="
        this.options = {
            hostname: this.exchangeUrl,
            path: this.path,
            method: 'GET'
        }
    }

    get_rate(props) {
        let options = {
            hostname: this.exchangeUrl,
            path: this.path + props['base_currency'],
            method: 'GET'
        }
        return new Promise(function (resolve, reject) {
            var req = http.request(options, function (res) {
                // reject on bad status
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    
                    return reject(new Error('statusCode=' + res.statusCode));
                }
                // cumulate data
                var body = [];
                res.on('data', function (chunk) {
                    body.push(chunk);
                });
                // resolve on end
                res.on('end', function () {
                    try {
                        body = JSON.parse(Buffer.concat(body).toString());
                    } catch (e) {
                        reject(e);
                    }
                    resolve(body);
                });
            });
            // reject on request error
            req.on('error', function (err) {
                // This is not a "Second reject", just a different sort of failure
                reject(err);
            });

            // IMPORTANT
            req.end();
        });
    }
}


module.exports = Converter
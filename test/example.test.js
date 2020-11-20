const assert = require('assert');
const parser = require('../utils/parser');

describe('URL test', () => {
    it('running full url', () => {
        let url = '/?base_currency=EUR&quote_currency=CAD&base_amount=503'
        let url_resp = parser(url)
        console.log(url_resp);
        assert.strictEqual(url_resp[0]['baseCurrency'], 'EUR');
        assert.strictEqual(url_resp[0]['quoteCurrency'], 'CAD');
        assert.strictEqual(url_resp[0]['baseAmount'], 503);
        assert.strictEqual(url_resp[1], 200);
    });

    it('running incorrect url', () => {
        let url = '/?base_currency=EURR&quote_currency=CAD&base_amount=503'
        let url_resp = parser(url)
        console.log(typeof url_resp[0]);
        assert.notStrictEqual(url_resp[0], []);
        assert.strictEqual(url_resp[1], 400);
    });

    it('running incorrect number', () => {
        let url = '/?base_currency=EUR&quote_currency=CAD&base_amount="503"'
        let url_resp = parser(url)
        console.log(typeof url_resp[0]);
        assert.notStrictEqual(url_resp[0], []);
        assert.strictEqual(url_resp[1], 400);
    });


    it('running missing parameter', () => {
        let url = '/?quote_currency=CAD&base_amount="503"'
        let url_resp = parser(url)
        console.log(typeof url_resp[0]);
        assert.notStrictEqual(url_resp[0], []);
        assert.strictEqual(url_resp[1], 400);
    });

});
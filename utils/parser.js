
const url_parser = require('url');

const possibleQuoteCurrency = ['CAD', 'HKD', 'ISK', 'PHP', 'DKK', 'HUF', 'CZK',
    'GBP', 'RON', 'SEK', 'IDR', 'INR', 'BRL', 'RUB', 'HRK', 'JPY', 'THB',
    'CHF', 'EUR', 'MYR', 'BGN', 'TRY', 'CNY', 'NOK', 'NZD', 'ZAR', 'USD',
    'MXN', 'SGD', 'AUD', 'ILS', 'KRW', 'PLN']

const allowedBaseCurrency = ['USD', 'EUR', 'ILS']

const parser = (url) => {
    const queryObject = url_parser.parse(url, true).query

    let incorrectData = false
    let baseCurrency = queryObject['base_currency']
    let quoteCurrency = queryObject['quote_currency']
    let baseAmount = parseFloat(queryObject['base_amount'])
    let newBaseAmmount = baseAmount
    if (isNaN(parseFloat(baseAmount))) {
        incorrectData = true
        if (newBaseAmmount == baseAmount) {
            incorrectData = false
            baseAmount = newBaseAmmount
        }
    }

    if (baseCurrency === quoteCurrency) {
        incorrectData = true
    }

    if (allowedBaseCurrency.indexOf(baseCurrency) < 0) {
        incorrectData = true
    }

    if (possibleQuoteCurrency.indexOf(quoteCurrency) < 0) {
        incorrectData = true
    }

    if (incorrectData) {
        return [[], 400]
    }
    return [{ baseCurrency: baseCurrency, quoteCurrency: quoteCurrency, baseAmount: baseAmount }, 200]
}

module.exports = parser
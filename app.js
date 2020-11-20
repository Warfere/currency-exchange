const { TIMEOUT } = require('dns');
const http = require('http');
const url = require('url');
const Converter = require('./utils/converter');
const parser = require('./utils/parser');
const calculate = require('./utils/calculateAmount');
const LRU = require("lru-cache")

const options = {
    max: 2,
    length: function (n, key, a) { return 1 },
    dispose: function (key, n) { !isNaN(n) ? n.close() : null },
    maxAge: 1000 * 60 * 60
}

let cache = LRU(options)

const converter = new Converter()


const srv = http.createServer((request, response) => {
    const queryObject = url.parse(request.url, true);

    if (queryObject.pathname === '/') {
        console.log(request.url);

        let [item, code] = parser(request.url)
        if (code != 200) {
            console.log(code, item)
            response.statusCode = code
            response.write(JSON.stringify({ message: "Incorrect Data" }))
            response.end()
            return
        }

        let baseCurrency = item['baseCurrency']
        let quoteCurrency = item['quoteCurrency']
        let baseAmount = item['baseAmount']
        let rates = cache.get(baseCurrency)

        if (!rates) {
            let res = converter.get_rate({ base_currency: baseCurrency })
            Promise.resolve(res).then(item => {
                let newValue = calculate({ rate: item.rates[quoteCurrency].toFixed(3), base: baseAmount.toFixed(3) })
                response.write(JSON.stringify({ exchange_rate: item.rates[quoteCurrency], quote_amount: newValue }))
                response.statusCode = code
                response.end()
                cache.set(baseCurrency, item.rates)

            }).catch(e => {
                console.log(e)
                response.end()
            })
        }
        else {
            console.log('cache working');

            let newValue = calculate({ rate: rates[quoteCurrency], base: baseAmount })
            response.write(JSON.stringify({ exchange_rate: rates[quoteCurrency], quote_amount: newValue }))
            response.end()
        }

    }
    else {
        console.log(request.url)
        response.write('asd')
        response.end()
    }

})

srv.listen(3001)


console.log('started');

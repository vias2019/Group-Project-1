const RATES_API = 'https://api.exchangeratesapi.io/latest?base=USD';

async function getCurrencyConversions() {
    let response = await fetch(RATES_API);
    let data = await response.json();

    window.rates = data.rates;

    return window.rates;
}

// Converts the specified currency and value to USD
function convertToUSD(value, currency) {
    // Index into currency conversion table for specified currency
    if (window.rates[currency]) {
        return parseFloat(value / window.rates[currency]).toFixed(2);
    }

    // By default, just return the provided value
    return value;
}

document.addEventListener('DOMContentLoaded', () => {
    getCurrencyConversions().then(data => {
        console.log('Currency conversion table fetched: ');
        console.log(data);
    });
});

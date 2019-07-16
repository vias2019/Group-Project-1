const API_URL = "https://api.exchangeratesapi.io/latest?base=USD";

// Converts the specified currency and value to USD
async function convertToUSD(value, currency) {
    // Lazily init a global rates object
    if (!window.rates) {
        let response = await fetch(API_URL);
        let data = await response.json();

        console.log("Currency conversion table fetched: ");
        console.log(data);

        window.rates = data.rates;
    }

    // Index into currency conversion table for specified currency
    if (window.rates[currency]) {
        return parseFloat(value / window.rates[currency]).toFixed(2);
    }

    // By default, just return the provided value
    return value;
}

// test api call
// todo - remove
console.log("Convert 65.24 CAD to USD:");
convertToUSD(65.24, "CAD").then(val => console.log(val));

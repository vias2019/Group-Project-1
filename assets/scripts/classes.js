// Class for containing relevant listing data
class Listing {
    constructor(data) {
        this.id = data.listing_id;
        this.item = data.title;
        this.description = data.description;
        this.price = data.price;
        this.currency = data.currency_code;
        this.url = data.url;
        this.images = [];
       //this.priceUSD = this.setPriceUSD();
       //this.priceUSD = data.price;
    }

    isUSD() {
        return this.currency === 'USD';
    }

    setPriceUSD() {
        if (this.currency === 'USD') {
            return this.price;
        }

        return convertToUSD(parseFloat(this.price), this.currency);
    }
}

// Class for containing order info
class Order {
    constructor(id, item, price, images, payees) {
        this.id = id;
        this.item = item;
        this.price = price;
        this.images = images;
        this.payees = payees;
        let expiration = moment().add(1, 'hours');
        this.expiration = expiration.unix();
        this.expireTime = expiration.format('HH:mm:ss');
    }
}

// Class for container payee info
class Payee {
    constructor(name, payment, paid = false) {
        this.name = name;
        this.payment = payment;
        this.paid = paid;
    }
}
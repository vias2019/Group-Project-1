const KEY = 'xqmai7gsvwpnhdg8q6ito5w4';
const API_URL = 'https://openapi.etsy.com/v2';
const LIMIT = 3;

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
    }
}

// Class that provides functions for retrieving and formatting data from the Etsy API
class EtsyAPI {
    // Search for active Etsy listings related to the specified search term
    getListings(searchTerm, parentElement) {
        $(parentElement).empty();

        let resource = 'listings/active.js';
        let getListingsUrl = `${API_URL}/${resource}?limit=${LIMIT}&keywords=${searchTerm}&api_key=${KEY}&min_price=100`;

        $.ajax({
            url: getListingsUrl,
            dataType: 'jsonp'
        }).then(data => {
            if (!data.ok) {
                console.log('Error getting listings', data.error);
                return;
            }

            // Once we have our listings, look up images for them
            let listings = data.results.map(obj => new Listing(obj));

            listings.forEach(listing =>
                this.getListingImages(
                    listing.id,
                    images => (listing.images = [...images])
                ).then(data => {
                    if (data.ok) {
                        let images = data.results.map(
                            result => result.url_170x135
                        );

                        listing.images = [...images];
                        console.log(listing);
                        this.appendListing(listing, parentElement);
                    }
                })
            );
        });
    }

    // Look up images for specific listing
    getListingImages(listingId) {
        let resource = `listings/${listingId}/images.js`;
        let listingImagesUrl = `${API_URL}/${resource}?api_key=${KEY}`;

        return $.ajax({
            url: listingImagesUrl,
            dataType: 'jsonp'
        });
    }

    // Appends the provided listing to the specified element/container
    appendListing(listing, parentElement) {
        let listingCard = this.createListingCard(listing);
        parentElement.append(listingCard);
    }

    // Creates and returns a bootstrap card from the provided listing object
    createListingCard(listing) {
        let $card = $('<div>')
            .addClass('card my-2')
            .css({ width: '20rem', position: 'relative' });
        let $img = $('<img>')
            .attr('src', listing.images[0])
            .addClass('card-img-top');
        let $body = $('<div>').addClass('card-body');
        let $title = $('<h5>')
            .text(listing.item)
            .addClass('card-title');
        let $price = $('<h6>')
            .text(`$${listing.price} ${listing.currency}`)
            .addClass('card-subtitle mb-2');
        let $modal = $('<div>')
            .addClass('modal')
            .attr('id', `modal-${listing.id}`)
            .css('padding', '20px');
        let $desc = $('<p>').html(`${listing.description}`);
        $modal.append($desc);
        let $btn = $('<a>')
            .attr('href', '#')
            .addClass('btn btn-primary')
            .css({ position: 'absolute', right: 0, bottom: 0, margin: '5px' })
            .text('Buy')
            .on('click', function() {
                // Store product info in localstorage
                localStorage.setItem('id', listing.id);
                localStorage.setItem('name', listing.item);
                localStorage.setItem('description', listing.description);
                localStorage.setItem('price', listing.price);
                localStorage.setItem('images', JSON.stringify(listing.images));
                // Navigate to next page
                window.location.href = '../../page2.html';
            });

        let $open = $('<a>')
            .attr({
                href: `#modal-${listing.id}`,
                rel: 'modal:open'
            })
            .text('Details')
            .on('click', function() {});

        $body.append($title, $price, $btn, $modal, $open);
        $card.append($img, $body);

        return $card;
    }
}

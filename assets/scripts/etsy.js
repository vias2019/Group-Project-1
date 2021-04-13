const KEY = 'xqmai7gsvwpnhdg8q6ito5w4';
const API_URL = 'https://openapi.etsy.com/v2';
const LIMIT = 6;

// Class that provides functions for retrieving and formatting data from the Etsy API
class EtsyAPI {
    // Search for active Etsy listings related to the specified search term
    getListings(searchTerm, parentElement) {
        $(parentElement).empty();

        let resource = 'listings/active.js';
        let getListingsUrl = `${API_URL}/${resource}?limit=${LIMIT}&keywords=${searchTerm}&api_key=${KEY}&min_price=1`;

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
                            result => result.url_570xN
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
            .addClass('card shadow my-3 rounded')
            .css({'width':'20rem'});
        let $img = $('<img>')
            .attr('src', listing.images[0])
            .addClass('card-img-top');
        let $body = $('<div>').addClass('card-body');
        let $title = $('<h6>')
            .html(listing.item)
            .addClass('card-subtitle pb-5');

        let priceString = `$${listing.price} ${listing.currency}`;
        if (!listing.isUSD()) {
            priceString = `${listing.price} ${listing.currency} ($${listing.priceUSD} USD)`;
        }

        let $price = $('<h5>')
            .text(priceString)
            .addClass('card-title mb-2 text-center');
        let $modal = $('<div>')
            .addClass('modal')
            .attr('id', `modal-${listing.id}`)
            .css({ padding: '20px', overflow: 'initial', height: 'auto' });
        let $modalHead = $('<h5>').html(listing.item);
        let $modalPrice = $('<h6>').text(`Price: $${listing.priceUSD}`).css('font-weight','bold');
        let $desc = $('<p>')
            .addClass('mb-5')
            .html(`${listing.description.trim()}`);
        let $modalClose = $('<a>')
            .attr({'href':'#', 'rel':'modal:close'})
            .addClass('btn btn-danger')
            .css({ position: 'absolute', bottom: '10px' })
            .text('Close');
        let $rule = $('<hr>');
        $modal.append($modalHead, $rule, $modalPrice, $desc, $modalClose);
        let $btn = $('<a>')
            .attr('href', '#')
            .addClass('btn btn-primary m-3 px-4')
            .css({ position: 'absolute', right: 0, bottom: 0 })
            .text('Buy')
            .on('click', function() {
                // Store product info in localstorage
                localStorage.setItem('id', listing.id);
                localStorage.setItem('name', listing.item);
                localStorage.setItem('description', listing.description);
                localStorage.setItem('price', listing.priceUSD);
                localStorage.setItem('images', JSON.stringify(listing.images));
                // Navigate to next page
                window.location.href = 'page2.html';
            });

        let $details = $('<a>')
            .attr({
                href: `#modal-${listing.id}`,
                rel: 'modal:open'
            })
            .addClass('btn btn-outline-primary m-3 px-4')
            .css({'position':'absolute', 'bottom':'0', 'left':'0'})
            .text('Details');

        $body.append($price, $rule, $title, $btn, $modal, $details);
        $card.append($img, $body);

        return $card;
    }
}

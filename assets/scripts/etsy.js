const KEY = "xqmai7gsvwpnhdg8q6ito5w4";
const API_URL = "https://openapi.etsy.com/v2";
const LIMIT = 10;

// Search for active Etsy listings related to the specified search term
function getListings(searchTerm, callback) {
    let resource = "listings/active.js";
    let getListingsUrl = `${API_URL}/${resource}?limit=${LIMIT}&keywords=${searchTerm}&api_key=${KEY}`;

    $.ajax({
        url: getListingsUrl,
        dataType: "jsonp",
        success: function(data) {
            if (data.ok) {
                console.log(`Successful search for: ${searchTerm}`);
                callback(data.results);
                // TODO - return or do something with data
            } else {
                console.log(data.error);
            }
        }
    });
}

// Looks up a specific Etsy listing by listing ID
function getListing(listingId, callback) {
    let resource = `listings/${listingId}.js`;
    let getListingUrl = `${API_URL}/${resource}?limit=${LIMIT}&api_key=${KEY}`;

    $.ajax({
        url: getListingUrl,
        dataType: "jsonp",
        success: function(data) {
            if (data.ok && data.results && data.results.length > 0) {
                console.log(`Successful listing retrieval:`);
                callback(data.results[0]);
                // TODO - return or do something with data
            } else {
                console.log(data.error);
            }
        }
    });
}

function createListingElements(data) {
    // TODO - use the given collection of Etsy listing data to
    // construct and return a collection of html elements with
    // the relevant listing data
}

function appendListings(data, parentElement) {
    let listingElements = createListingElements(data);
    // TODO - take the collection of listings and append to the specified
    // target parent html element (e.g. <div>)
}

// test api calls
// TODO - remove
getListings("shoes", console.log);
getListing("721668981", console.log);

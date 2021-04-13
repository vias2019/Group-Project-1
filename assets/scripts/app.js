// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: 'AIzaSyAGQQkCjZtQ1ICyrEoGqO5YW4x5NnP4GdU',
    authDomain: 'buytogether-ba185.firebaseapp.com',
    databaseURL: 'https://buytogether-ba185.firebaseio.com',
    projectId: 'buytogether-ba185',
    //storageBucket: '',
    storageBucket: "buytogether-ba185.appspot.com",
    messagingSenderId: '869661137897',
    appId: '1:869661137897:web:e1006f299e6d65cd'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create global reference to our Firebase DB
const DB = firebase.database();

function createImageCarousel(images) {
    // If only 1 image, then return in an img element
    if (images.length === 1) {
        return $('<img>').attr({
            id: 'picture',
            src: itemImages[0],
            alt: 'product image'
        });
    }

    // Create bootstrap carousel
    let $carouselDiv = $('<div>')
        .addClass('carousel slide')
        .attr({ 'id': 'productCarousel', 'data-ride': 'carousel' });
    let $inner = $('<div>').addClass('carousel-inner');

    images.forEach((image, index) => {
        let $newItem = $('<div>')
            .addClass('carousel-item')
            .attr('data-interval', '4000');
        if (index === 0) {
            $newItem.addClass('active');
        }

        $newItem.append(
            $('<img>')
                .addClass('d-block w-100 card-img-top')
                .attr({ src: image, alt: `Product image ${index + 1}` })
        );
        $inner.append($newItem);
    });

    let $prev = $('<a>')
        .addClass('carousel-control-prev')
        .attr({
            'href': '#productCarousel',
            'role': 'button',
            'data-slide': 'prev'
        });
    $prev.append(
        $('<span>')
            .addClass('carousel-control-prev-icon')
            .attr('aria-hidden', 'true'),
        $('<span>')
            .addClass('sr-only')
            .text('Previous')
    );
    let $next = $('<a>')
        .addClass('carousel-control-next')
        .attr({
            'href': '#productCarousel',
            'role': 'button',
            'data-slide': 'next'
        });
    $next.append(
        $('<span>')
            .addClass('carousel-control-next-icon')
            .attr('aria-hidden', 'true'),
        $('<span>')
            .addClass('sr-only')
            .text('Next')
    );

    $carouselDiv.append($inner, $prev, $next);

    return $carouselDiv;
}

function createProductCard(name, price, images) {
    let $card = $('<div>').addClass('card shadow mb-3');
    let $header = $('<div>').addClass('card-header').html('<h5>Product Details</h5>');
    let $body = $('<div>').addClass('card-body');

    let $images = createImageCarousel(images);
    let $name = $('<p>')
        .addClass('card-text')
        .attr('id', 'product-name')
        .html(name);
    let $price = $('<h5>')
        .addClass('card-title my-3')
        .attr('id', 'product-price')
        .text(`$${price.toFixed(2)}`);

    $body.append($images, $price, $name);
    $card.append($header, $body);

    return $card;
}

function displayError(errorMessage) {
    let $error = $('<div>')
        .addClass('alert alert-danger alert-dismissible fade show text-center')
        .attr('role', 'alert')
        .text(errorMessage);
    let $closeBtn = $('<button>')
        .addClass('close')
        .attr({
            'type': 'button',
            'data-dismiss': 'alert',
            'aria-label': 'Close'
        });
    let $span = $('<span>')
        .attr('aria-hidden', 'true')
        .html('&times;');
    $closeBtn.append($span);
    $error.append($closeBtn);

    $('#error-message').append($error);
}

function clearError() {
    $('#error-message').empty();
}

function displayStatus(message) {

    let $status = $('<div>')
        .addClass('alert alert-success alert-dismissible fade show text-center')
        .attr('role', 'alert')
        .html(message);
    let $closeBtn = $('<button>')
        .addClass('close')
        .attr({
            'type': 'button',
            'data-dismiss': 'alert',
            'aria-label': 'Close'
        });
    let $span = $('<span>')
        .attr('aria-hidden', 'true')
        .html('&times;');
    $closeBtn.append($span);
    $status.append($closeBtn);

    clearStatus();
    $('#status-message').append($status);
}

function clearStatus() {
    $('#status-message').empty();
}

// When DOM content is loaded
document.addEventListener('DOMContentLoaded', evt => {

    // Create interval to update displayed current time
    setInterval(function() {
        $('#current-time').html(moment().format('hh:mm:ss A'));
    }, 1000);

    // Add click event listener to search button
    $('#button-search').on('click', evt => {
        // Prevent form submission
        evt.preventDefault();

        // Get search term and perform search for Etsy listings
        let $resultsContainer = $('#results-container');
        let searchTerm = $('#search-term')
            .val()
            .trim()
            .toLowerCase();
        if (searchTerm === '') {
            // Nothing to search...
            return;
        }

        const ETSY = new EtsyAPI();
        ETSY.getListings(searchTerm, $resultsContainer);
    });
});

function validatePayments(itemPrice) {
    // No item price... something is wrong.
    if (!itemPrice) {
        // TODO - use modal
        alert('No item price found! Try again.');
        return false;
    }

    // Verify sum of payments matches total product cost
    let sum = 0.0;
    let valid = false;
    $('#payees .payment').each(function() {
        let $input = $(this)
            .val()
            .trim();

        // Verify all payees have a valid payment amount
        if ($input === '') {
            // TODO - use modal
            alert(
                'All payees must have a payment amount specified in order to create the order.'
            );
            $(this).focus();
            valid = false;
            return false;
        }

        let paymentValue = parseFloat($input);
        if (Number.isNaN(paymentValue) || paymentValue === 0.0) {
            // TODO - use modal
            alert(`${$input} is not a valid payment amount. Try again.`);
            $(this).focus();
            valid = false;
            return false;
        } else {
            // We should have a valid payment amount if we reached this point....
            sum += paymentValue;
            valid = true;
        }
    });

    // Verify sum of payments matches item price
    if (valid && sum !== itemPrice) {
        // TODO - use modal
        alert(
            `The total sum of payments must equal the product cost. A sum of $${sum.toFixed(
                2
            )} was entered, but the item price is $${itemPrice.toFixed(2)}.`
        );
        return false;
    }

    // If we hit no errors, then the entered payment values are valid.
    return valid;
}

// Verify all payee names are specified
function validatePayeeNames() {
    let valid = true;

    let payees = $('#payees .payee');
    payees.each(function() {
        let name = $(this).val().trim();
        if (name === '') {
            // TODO - show error modal
            valid = false;
            alert('Payee name is missing!');
            $(this).focus();
            return false;
        }
    });

    return valid;
}

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

function loadProductInfo() {
    // Get product info from localstorage and add to screen
    var itemName = localStorage.getItem('name');
    var itemImages = JSON.parse(localStorage.getItem('images'));
    var itemPrice = parseFloat(localStorage.getItem('price'));

    if (!itemName || !itemImages || !itemPrice) {
        console.log('ERROR: Product info missing in local storage.');
        return false;
    }

    let $info = $('#product-info');
    let $images = createImageCarousel(itemImages);
    let $name = $('<p>')
        .addClass('card-text')
        .attr('id', 'product-name')
        .html(itemName);
    let $price = $('<h5>')
        .addClass('card-title my-3')
        .attr('id', 'product-price')
        .text(`$${itemPrice.toFixed(2)}`);

    $info.empty();
    $info.append($images, $price, $name);

    console.log('Product info successfully loaded from local storage.');
    return true;
}

// Function to create a random order id string
function makeid() {
    var result = '';
    var characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 9; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}

// Sets up and returns a reference to our Firebase DB
function initFirebaseDB() {
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: 'AIzaSyAGQQkCjZtQ1ICyrEoGqO5YW4x5NnP4GdU',
        authDomain: 'buytogether-ba185.firebaseapp.com',
        databaseURL: 'https://buytogether-ba185.firebaseio.com',
        projectId: 'buytogether-ba185',
        storageBucket: '',
        messagingSenderId: '869661137897',
        appId: '1:869661137897:web:e1006f299e6d65cd'
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();

    return database.ref();
}

$(document).ready(function() {
    // Set up DB connection
    var buyTogetherFirebase = initFirebaseDB();

    // Load product info
    let loaded = loadProductInfo();
    if (!loaded) {
        // No product info found in local storage
        // Revert back to search page.
        window.location = 'page1.html';
    }

    window.orderId = makeid();
    $('#order-number').text(orderId);
    console.log('New order ID:', orderId);

    $('#number-of-payees').change(function() {
        var numberOfPayees = $('#number-of-payees').val();
        console.log('Selected number of payees:', numberOfPayees);

        $('#payees').empty();

        // Create form group for each payee
        let $form = $('<form>');
        for (var i = 1; i <= numberOfPayees; i++) {
            let $formGroup = $('<div>').addClass('form-group');

            let $inputGroup = $('<div>').addClass('input-group mb-3');
            let $priceGroup = $('<div>').addClass('input-group-prepend');
            let $symbolSpan = $('<span>')
                .addClass('input-group-text dollar')
                .html('<i class="fas fa-dollar-sign"></i>');
            let $inputPrice = $('<input>')
                .attr({
                    type: 'text',
                    id: `price${i}`,
                    placeholder: '0.00'
                })
                .addClass('form-control payment');
            $priceGroup.append($symbolSpan);
            $inputGroup.append($priceGroup, $inputPrice);

            let $labelPrice = $('<label>')
                .attr('for', $inputPrice.attr('id'))
                .addClass('my-1')
                .text('Payment Amount:');

            let $inputPayee = $('<input>')
                .attr({
                    type: 'text',
                    id: `payee${i}-name`,
                    placeholder: 'First Name Last Name'
                })
                .addClass('form-control mb-1 payee')
                .css('text-transform', 'capitalize');

            let $labelPayee = $('<label>')
                .attr('for', $inputPayee.attr('id'))
                .addClass('name my-1')
                .text(`Payee ${i} Name:`);

            let $checkbox = $('<input>').attr({
                type: 'checkbox',
                id: `checkbox${i}`,
                name: 'payment-confirmation'
            });

            let $confirmLabel = $('<label>')
                .addClass('checkbox-inline my-1')
                .append($checkbox, ' Confirm Payment');

            $formGroup.append(
                $labelPrice,
                $inputGroup,
                $labelPayee,
                $inputPayee,
                $confirmLabel
            );

            $form.append($formGroup);
        }

        $('#payees').append($form);
    });

    $('#payees').on('change', '.payment', function() {
        // Get input value, parse to float value
        let $input = $(this)
            .val()
            .trim();

        if ($input === '') {
            // If blank, return early
            return;
        }

        // Remove dollar symbol if necessary
        let symbolIdx = $input.indexOf('$');
        if (symbolIdx >= 0) {
            $input = $input.bslice(symbolIdx + 1);
        }

        let parsed = parseFloat($input);

        // Regex test pattern
        let pattern = /^[0-9]+(\.{1}[0-9]{1,2})?$/;

        // If NaN or not valid format -> clear and show error
        if (Number.isNaN(parsed) || parsed <= 0.0 || !pattern.test($input)) {
            // TODO - use modal for error.
            alert(
                `${$input} is not a valid price. Please enter a positive dollar amount.`
            );
            $(this)
                .val('')
                .focus();
            return;
        }

        $(this).val(parsed.toFixed(2));
    });

    $('#payees').on('keypress', '.payment', function(event) {
        // only allow valid keys
        let keyCode = event.keyCode;
        if (keyCode === 46 || (keyCode >= 48 && keyCode <= 57)) {
            return true;
        }
        // Cancel keypress for invalid keys (non-numeric)
        console.log('invalid key!', event.keyCode);
        event.preventDefault();
        return false;
    });

    $('#page2button').on('click', function(event) {
        event.preventDefault();

        // Do not proceed with the order submission if any payment values
        // are invalid.
        var itemPrice = parseFloat(localStorage.getItem('price'));
        let validPayments = validatePayments(itemPrice);
        if (!validPayments) {
            return false;
        }
        // Verify all payee names are specified
        let validNames = validatePayeeNames();
        if (!validNames) {
            return false;
        }

        //add API reference to the three lines below
        var productPicture = '';
        var productName = '';
        var productPrice = '';
        var payee1Name = '';
        var payee2Name = '';
        var payee3Name = '';
        var payee1Pay = '';
        var payee2Pay = '';
        var payee3Pay = '';

        //if id exists.....
        if ($('#payee1-name').length) {
            payee1Name = $('#payee1-name').val();
        }
        if ($('#payee2-name').length) {
            payee2Name = $('#payee2-name').val();
        }
        if ($('#payee3-name').length) {
            payee3Name = $('#payee3-name').val();
        }
        if ($('#price1').length) {
            payee1Pay = $('#price1').val();
        }
        if ($('#price2').length) {
            payee2Pay = $('#price2').val();
        }
        if ($('#price3').length) {
            payee3Pay = $('#price3').val();
        }

        var payee1PaidUnpaid = '';
        var payee2PaidUnpaid = '';
        var payee3PaidUnpaid = '';

        if ($('#checkbox1').is(':checked')) {
            payee1PaidUnpaid = 'paid';
        }
        if ($('#checkbox2').is(':checked')) {
            payee2PaidUnpaid = 'paid';
        }
        if ($('#checkbox3').is(':checked')) {
            payee3PaidUnpaid = 'paid';
        }
        console.log(payee1PaidUnpaid);
        console.log('timer:', expiration);
        var expiration = moment()
            .add(1, 'hours')
            .unix();

        var newObjectRecord = {
            orderId: window.orderId,
            productPicture: productPicture,
            productName: productName,
            price: productPrice,
            payee1Name: payee1Name,
            payee1Pay: payee1Pay,
            paid1: payee1PaidUnpaid,
            payee2Name: payee2Name,
            payee2Pay: payee2Pay,
            paid2: payee2PaidUnpaid,
            payee3Name: payee3Name,
            payee3Pay: payee3Pay,
            paid3: payee3PaidUnpaid,
            time: expiration
        };
        buyTogetherFirebase.push(newObjectRecord);
    });

    $('#new-order-close').on('click', () => (window.location = 'page1.html'));
});

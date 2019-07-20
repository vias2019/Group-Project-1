// Global variable to hold number of payees involved with order
let payeeCount = 0;

function createNewOrder() {
    // Create payees associated with order
    let payees = {};
    for (let i = 1; i <= payeeCount; i++) {
        let name = $(`#payee${i}-name`).val();
        let payment = parseFloat($(`#price${i}`).val());
        let payed = $(`#checkbox${i}`).is(':checked');

        let newPayee = new Payee(name, payment, payed);
        payees[i] = newPayee;
    }

    // Create new order object
    var newOrder = new Order(orderId, itemName, itemPrice, itemImages, payees);

    // Log new order info
    console.log('New order created:');
    console.log(newOrder);

    // Push new order to Firebase DB
    DB.ref('orders').push(newOrder);
}

function validatePayments(itemPrice) {
    // No item price... something is wrong.
    if (!itemPrice) {
        displayError('No item price found! Try again.');
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
            displayError(
                'All payees must have a payment amount specified in order to create the order.'
            );
            $(this).focus();
            valid = false;
            return false;
        }

        let paymentValue = parseFloat($input);
        if (Number.isNaN(paymentValue) || paymentValue === 0.0) {
            displayError(`${$input} is not a valid payment amount. Try again.`);
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
        displayError(
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
        let name = $(this)
            .val()
            .trim();
        if (name === '') {
            valid = false;
            displayError('Payee name is missing!');
            $(this).focus();
            return false;
        }
    });

    return valid;
}

function loadProductInfo() {
    // Get product info from localstorage and add to screen
    window.itemName = localStorage.getItem('name');
    window.itemImages = JSON.parse(localStorage.getItem('images'));
    window.itemPrice = parseFloat(localStorage.getItem('price'));

    if (!itemName || !itemImages || !itemPrice) {
        console.log('ERROR: Product info missing in local storage.');
        return false;
    }

    let productCard = createProductCard(itemName, itemPrice, itemImages);

    $('#product-info').empty();
    $('#product-info').append(productCard);

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

$(document).ready(function() {
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
        payeeCount = parseInt($('#number-of-payees').val());
        console.log('Selected number of payees:', payeeCount);

        $('#payees').empty();

        // Create form group for each payee
        let $form = $('<form>');
        for (var i = 1; i <= payeeCount; i++) {
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
                $labelPayee,
                $inputPayee,
                $labelPrice,
                $inputGroup,
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
            displayError(
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
        clearError();

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

        // Create order
        createNewOrder();
    });

    $('#new-order-close').on('click', () => (window.location = 'page1.html'));
});

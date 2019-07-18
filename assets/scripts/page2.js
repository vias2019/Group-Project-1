$(document).ready(function() {
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
    var buyTogetherFirebase = database.ref();

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
        console.log(typeof result);
        return result;
    }

    $('#order-number').text(makeid());
    console.log(makeid());

    $('#number-of-payees').change(function() {
        var numberOfPayees = $('#number-of-payees').val();
        console.log(numberOfPayees);

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
                    placeholder: '$0.00'
                })
                .addClass('form-control price');
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
                .addClass('form-control mb-1');

            let $labelPayee = $('<label>')
                .attr('for', $inputPayee.attr('id'))
                .addClass('my-1')
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

    $('#payees').on('change', '.price', function(event) {
        // Get input value, parse to float value
        let $input = $(this)
            .val()
            .trim();

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

    $('#payees').on('keypress', '.price', function(event) {
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
        console.log('clicked');
        var orderId = makeid();
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
            orderId: orderId,
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

    // Get product info from localstorage and add to screen
    let itemName = localStorage.getItem('name');
    let itemImages = JSON.parse(localStorage.getItem('images'));
    let itemPrice = parseFloat(localStorage.getItem('price'));

    let $info = $('#product-info');
    let $image = $('<img>')
        .attr({ id: 'picture', src: itemImages[0], alt: 'product image' })
        .text(itemName);
    let $name = $('<p>')
        .attr('id', 'product-name')
        .html(itemName);
    let $price = $('<p>')
        .attr('id', 'product-price')
        .text(`$${itemPrice.toFixed(2)}`);

    $info.empty();
    $info.append($image, $name, $price);
});

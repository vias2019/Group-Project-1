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
        for (var i = 0; i < numberOfPayees; i++) {
            $('#payees').append(
                "<span id='payee" +
                    (i + 1) +
                    "'>" +
                    "<input type='number' class='form-control' id='price" +
                    (i + 1) +
                    "'>" +
                    "<input type='text' class='form-control' id='payee" +
                    (i + 1) +
                    "-name' placeholder='First Last Name'>" +
                    "<input type='checkbox' name='payment-confirmation' id='checkbox" +
                    (i + 1) +
                    "'> Confirm Your Payment</input>" +
                    '</span>'
            );
        }
    });



  $("#page2button").on("click", function (event) {
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
            paid3: payee3PaidUnpaid
        };
        buyTogetherFirebase.push(newObjectRecord);
        //location.reload(true);
        //add notice
        window.location.href = 'page1.html';
    });

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
      paid3: payee3PaidUnpaid
    };
    buyTogetherFirebase.push(newObjectRecord);
   //location.reload(true);
   //add notice

    setTimeout(function () {
            window.location.href = "page1.html";
    },30000);
    
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
        .text(itemName);
    let $price = $('<p>')
        .attr('id', 'product-price')
        .text(`$${itemPrice.toFixed(2)}`);


    $info.empty();
    $info.append($image, $name, $price);

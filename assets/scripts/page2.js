$(document).ready(function () {
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAGQQkCjZtQ1ICyrEoGqO5YW4x5NnP4GdU",
    authDomain: "buytogether-ba185.firebaseapp.com",
    databaseURL: "https://buytogether-ba185.firebaseio.com",
    projectId: "buytogether-ba185",
    storageBucket: "",
    messagingSenderId: "869661137897",
    appId: "1:869661137897:web:e1006f299e6d65cd"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();
  var buyTogetherFirebase = database.ref();

  function makeid() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 5; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  makeid();
 var x= $('#order-number').val('vika');
  $('#order-number').text(x);
  console.log(makeid());
 // document.getElementById("order-number").value=makeid();

  $('#number-of-payees').change(function () {
    var numberOfPayees = $('#number-of-payees').val();
    console.log(numberOfPayees);
    $('#payees').empty();
    for (var i = 0; i < numberOfPayees; i++) {

      $('#payees').append(
        "<span id='payee" + (i + 1) + "'>" +
        "<input type='number' class='form-control' id='price" + (i + 1) + "'>" +
        "<input type='text' class='form-control' id='payee" + (i + 1) + "-name' placeholder='First Last Name'>" +
        "<input type='checkbox' name='payment-confirmation' id='checkbox" + (i + 1) + "'> Confirm Your Payment</input>" +
        "</span>"
      );
    }
  });


  var payee1Pay = '';
  var payee2Pay = '';
  var payee3Pay = '';

  $('#checkbox1').change(
    function () {
      if ($(this).is(':checked')) {
        payee1Pay = $('#price1').val();
      }
    });
  $('#checkbox2').change(
    function () {
      if ($(this).is(':checked')) {
        payee2Pay = $('#price2').val();
      }
    });
  $('#checkbox3').change(
    function () {
      if ($(this).is(':checked')) {
        payee3Pay = $('#price3').val();
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
    console.log(payee1Name);
    var payee2Name = '';
    var payee3Name = '';

    if ($("#payee1-name").length) {
      payee1Name = $('#payee1-name').val();
    }
    if ($("#payee2-name").length) {
      payee2Name = $('#payee2-name').val();
    }
    if ($("#payee3-name").length) {
      payee3Name = $('#payee3-name').val();
    }


    var newObjectRecord = {
      orderId: orderId,
      productPicture: productPicture,
      productName: productName,
      price: productPrice,
      payee1Name: payee1Name,
      payee1Pay: payee1Pay,
      payee2Name: payee2Name,
      payee2Pay: payee2Pay,
      payee3Name: payee3Name,
      payee3Pay: payee3Pay
    };
    buyTogetherFirebase.push(newObjectRecord);
  });


});
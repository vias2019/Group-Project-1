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



    var productName = localStorage.getItem('productName');
    var productPicture = localStorage.getItem('productPicture');
    var productPrice = localStorage.getItem('productPrice');

    var orderNumberRetrieved = '';

    $('#retrieve-order').on('click', function (e) {
        //e.preventDefault();
        console.log('are we here?');
        var searchOrder = $('#sale-id').val();
        orderNumberRetrieved = buyTogetherFirebase.orderByValue().on('value', function (snapshot) {
            //console.log('snapshot: ', snapshot);
            var payee1, payee2, payee3, pay1, pay2, pay3, productprice, paid1, paid2, paid3;



            snapshot.forEach(function (data) {
                //console.log('key: ', data.key);
                //console.log('value: ', data.val());


                console.log('orderId: ', data.val().orderId);
                console.log('searchOrder: ', searchOrder);

                if (searchOrder === data.val().orderId) {
                    payee1 = data.val().payee1Name;
                    payee2 = data.val().payee2Name;
                    payee3 = data.val().payee3Name;
                    pay1 = data.val().payee1Pay;
                    pay2 = data.val().payee2Pay;
                    pay3 = data.val().payee3Pay;
                    price = data.val().price;
                    paid1 = data.val().paid1;
                    paid2 = data.val().paid2;
                    paid3 = data.val().paid3;
                }

                console.log('payees: ', payee1, payee2, payee3, productprice, paid1, paid2, paid3);
            });
        });
        console.log('payees2: ', payee1, payee2, payee3, productprice, paid1, paid2, paid3);
        // buyTogetherFirebase.orderByChild('orderId').equalTo($('#sale-id').val()).on("value", function(snapshot) {
        //     console.log(snapshot.val());


        $('#payee-name').append(
            "<option id='option1' value=''>" + payee1 + "</option>" +
            "<option id='option1' value=''>" + payee2 + "</option>" +
            "<option id='option1' value=''>" + payee3 + "</option>"
        );

    });
    console.log("orderNumberRetrieved:", orderNumberRetrieved);






});

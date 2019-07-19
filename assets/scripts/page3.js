var selectedPayee = '';
var selectedPayeePay = '';
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


    var payee1, payee2, payee3, productprice, paid1, paid2, paid3, orderID, time, productName;
    var pay1 = 0;
    var pay2 = 0;
    var pay3 = 0;
    var objectName;

    $('#retrieve-order').on('click', function (e) {
        e.preventDefault();
        orderID = $('#sale-id').val();
        console.log('are we here?');
        $('#payee-name').empty();
        buyTogetherFirebase.orderByChild('orderId').equalTo($('#sale-id').val()).limitToFirst(1).on("value", function (snapshot) {
            if (snapshot.exists()) {
                objectName = Object.keys(snapshot.val())[0];
                console.log("objectName:", objectName);


                console.log(snapshot.val());
                console.log('Key name is: ', Object.keys(snapshot.val())[0]);
                snapshot.forEach(function (data) {
                    console.log(data.val());
                    console.log(data.child(orderID).val());
                    payee1 = data.val().payee1Name;
                    payee2 = data.val().payee2Name;
                    payee3 = data.val().payee3Name;
                    pay1 = parseFloat(data.val().payee1Pay) || 0;
                    pay2 = parseFloat(data.val().payee2Pay) || 0;
                    pay3 = parseFloat(data.val().payee3Pay) || 0;
                    productprice = parseFloat(data.val().price) || 0;
                    paid1 = data.val().paid1;
                    paid2 = data.val().paid2;
                    paid3 = data.val().paid3;
                    time = data.val().time;
                    productName=data.val().productName;

                });
            } else {
                //add message here
                alert("Invalid Order ID #");
            }

            $('#product-info').append(
                "<snap>" + "<b>Product Name: </b>" + productName + " " + "<b>Price: </b>" + productprice + "</snap>"
            );

            //var nameSnapshot = snapshot.child("name");
            // var name = nameSnapshot.val();
            $('#payee-name').append(
                "<option id='option0' value=''> None</option>" +
                "<option id='option1' value=" + pay1 + ">" + payee1 + "</option>" +
                "<option id='option2' value=" + pay2 + ">" + payee2 + "</option>" +
                "<option id='option3' value=" + pay3 + ">" + payee3 + "</option>"
                // text="+ payee1 +"

            );
            console.log('payees2: ', orderID, payee1, payee2, payee3, pay1, pay2, pay3, productprice, paid1, paid2, paid3, time, productName);
            var option = $('option:selected').val();
            console.log(option);
        });
        // cobT9wtLp

    });


    $('#payee-name').change(function () {

        selectedPayee = $('#payee-name option:selected').text();
        console.log("selectedPayee:", selectedPayee);

        selectedPayeePay = $('#payee-name').val();
        console.log("selectedPayeePay:", selectedPayeePay);

        $('#nextpayee1').empty();
        $('#payee-step2').empty();
        $('#nextpayee1').append(
            "<span><h2>Order ID#:</h2>" + orderID + "</span>" +
            "<table class='table'>" +
            "<thead class='paid-shares'>" +
            "<tr>" +
            "<th scope='col'>Payee name</th>" +
            "<th scope='col'>Amount</th>" +
            "<th scope='col'>Paid/Unpaid</th>" +
            "</tr>" +
            "</thead>" +
            "<tbody id='show-table'>"
        );

        $('#orderID').val(orderID);

        $('#show-table').append(
            '<tr>' +
            '<td>' + payee1 + '</td>' +
            '<td>' + pay1 + '</td>' +
            '<td>' + paid1 + '</td>' +
            '</tr>'

        );
        if (payee2 != "") {
            $('#show-table').append(
                '<tr>' +
                '<td>' + payee2 + '</td>' +
                '<td>' + pay2 + '</td>' +
                '<td>' + paid2 + '</td>' +
                '<tr>'
            );
        }
        if (payee3 != "") {
            $('#show-table').append(
                '<tr>' +
                '<td>' + payee3 + '</td>' +
                '<td>' + pay3 + '</td>' +
                '<td>' + paid3 + '</td>' +
                '<tr>'
            );
        }
        $('#payee-step2').append(
            //"<span>Amount to Pay: </span>"+"<span id='amount-to-pay'>"+ selectedPayeePay +"</span>"+"<br>"+
            // "<span>Name of Payee: </span>"+"<span id='next-payee'>"+ selectedPayee +"</span>"+"<br>"+
            // "<input type='checkbox' name='payment-confirmation' id='nextcheckbox'> Confirm Your Payment</input>" +
            //  "<br>"+"<br>"+
            // "<button id='nextcomplete-order' type='submit' class='btn btn-primary btn-sm'>Submit</button>"
        );
        ifPaid();
    });
    function append() {
        $('#payee-step2').append("<span>Amount to Pay: </span>" + "<span id='amount-to-pay'>" + selectedPayeePay + "</span>" + "<br>" +
            "<span>Name of Payee: </span>" + "<span id='next-payee'>" + selectedPayee + "</span>" + "<br>" + "<input type='checkbox' name='payment-confirmation' id='nextcheckbox'> Confirm Your Payment</input>" +
            "<br>" + "<br>" + "<button id='nextcomplete-order' type='submit' class='btn btn-primary btn-sm'>Submit</button>");
    }

    function ifPaid() {
        if (selectedPayee == payee1 && paid1 == "") {
            append();
        } else if (selectedPayee == payee2 && paid2 == "") {
            append();
        } else if (selectedPayee == payee3 && paid3 == "") {
            append();
        }
    }
    console.log('initializing click event');

    function paidStatus() {
        if ($('#nextcheckbox').is(':checked')) {
            if (selectedPayee == payee1) {
                // push paid1=paid 
                buyTogetherFirebase.child(objectName).update
                    ({
                        "paid1": "paid"
                    });
            }
            else if (selectedPayee == payee2) {
                // push paid2=paid
                buyTogetherFirebase.child(objectName).update
                    ({
                        "paid2": "paid"
                    });
            }
            else if (selectedPayee == payee3) {
                // push paid3=paid
                buyTogetherFirebase.child(objectName).update
                    ({
                        "paid3": "paid"
                    });
            }
            else { return; }
        }

    }

    function checkIfTimeIsUp() {
        console.log('are we here?');
        var currentTime = moment().unix();
        if (currentTime >= time) {
            //add message "You run out of time, your order will be deleted"
            //delete record from firebase
            console.log(objectName);
            database.ref().child(objectName).remove();
        } else {
            paidStatus();
            if ((pay1 + pay2 + pay3) === productprice && paid1 == 'paid' && paid2 == 'paid' && paid3 == 'paid') {
                //add message "The order # is complete. Thank you for shopping with us!"

            } else if ((pay1 + pay2) === productprice && paid1 == 'paid' && paid2 == 'paid') {
                //add message "The order # is complete. Thank you for shopping with us!"
            } else if (pay1 === productprice && paid1 == 'paid') {
                //add message "The order # is complete. Thank you for shopping with us!"
            }
            else {
                //add message "The order # will be complete when all payees pay"
                //update firebase
                paidStatus();
            }

        }
    }

    //$('#nextcomplete-order').on('click', function (e){
    $(document).on('click', '#nextcomplete-order', function (e) {
        e.preventDefault();
        console.log('Hi');

        checkIfTimeIsUp();



        setTimeout(function () {
            window.location.href = "page1.html";
        }, 2000);


    });

});
//test:
//ZE4DFTUZX
//Lk7IeirGSCJIfaRd328
//rEcOP4TRE              deleted 
//Lk7MsW4AW8a7GGhVHEY    deleted
//92E7Fqe0C             updated
//Lk7MCqjKMjH_mgNpeuO   updated
//VilWbyfxo
//Lk8JUDTlwUcD_bw2uHQ

//console.log(moment().add(1, 'hours').unix());
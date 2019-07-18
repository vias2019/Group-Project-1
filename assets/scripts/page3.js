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

    var payee1, payee2, payee3, pay1, pay2, pay3, productprice, paid1, paid2, paid3, orderID;
    var option;
    $('#retrieve-order').on('click', function (e) {
        e.preventDefault();
        orderID=$('#sale-id').val();
        console.log('are we here?');

        buyTogetherFirebase.orderByChild('orderId').equalTo($('#sale-id').val()).limitToFirst(1).on("value", function (snapshot) {
            snapshot.forEach(function (data) {
            console.log(data.val()) ;  
            console.log(data.val());
            console.log(data.child(orderID).val());
            payee1 = data.val().payee1Name;
            payee2 = data.val().payee2Name;
            payee3 = data.val().payee3Name;
            pay1 = data.val().payee1Pay;
            pay2 = data.val().payee2Pay;
            pay3 = data.val().payee3Pay;
            productprice = data.val().price;
            paid1 = data.val().paid1;
            paid2 = data.val().paid2;
            paid3 = data.val().paid3;
            });
            
            //var nameSnapshot = snapshot.child("name");
           // var name = nameSnapshot.val();
            $('#payee-name').append(
                "<option id='option0' value=''> None</option>" +
                "<option id='option1' value="+pay1+">" + payee1 + "</option>" +
                "<option id='option2' value="+pay2+">" + payee2 + "</option>" +
                "<option id='option3' value="+pay3+">" + payee3 + "</option>"
               // text="+ payee1 +"

            );
            console.log('payees2: ', orderID, payee1, payee2, payee3, pay1, pay2, pay3, productprice, paid1, paid2, paid3);
            var option = $('option:selected').val();
            console.log(option);
        });
        // bCNE65uFl

    });


    $('#payee-name').change(function() {
        
        var selectedPayee= $('#payee-name option:selected').text();
        console.log("selectedPayee:", selectedPayee);

        var selectedPayeePay=$('#payee-name').val();
        console.log("selectedPayeePay:", selectedPayeePay);

       $('#nextpayee1').empty();
       $('#payee-step2').empty();
       $('#nextpayee1').append(
        "<span><h2>Order ID#:</h2>"+orderID+"</span>"+
        "<table class='table'>"+
        "<thead class='paid-shares'>"+
          "<tr>"+
            "<th scope='col'>Payee name</th>"+
            "<th scope='col'>Amount</th>"+
            "<th scope='col'>Paid/Unpaid</th>"+
          "</tr>"+
        "</thead>"+
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
                '<tr>'+
        '<td>' + payee2 + '</td>' +
        '<td>' + pay2 + '</td>' +
        '<td>' + paid2 + '</td>' +
        '<tr>'
             );
             }
        if (payee3 != "") {
            $('#show-table').append(
                '<tr>'+
        '<td>' + payee3 + '</td>' +
        '<td>' + pay3 + '</td>' +
        '<td>' + paid3 + '</td>' +
        '<tr>'
             );
             }
        $('#payee-step2').append(
            "<span>Amount to Pay: </span>"+"<span id='amount-to-pay'>"+ selectedPayeePay +"</span>"+"<br>"+
                "<span>Name of Payee: </span>"+"<span id='next-payee'>"+ selectedPayee +"</span>"+"<br>"+
                "<input type='checkbox' name='payment-confirmation' id='nextcheckbox'> Confirm Your Payment</input>" +
                 "<br>"+"<br>"+
                "<button id='nextcomplete-order' type='submit' class='btn btn-primary btn-sm'>Submit</button>"
        );
       
    });
    $('#next-complete-order').on('click', function (e) {
        e.preventDefault();

        //update firebase

        //check if total paid amount ==price,
        //if not, message "You paid your share for order# XXX, HH:MM left for all payees to pay"
        //if order paid in full "Congrats! Order#XXX is complete!"
        //add message
        setTimeout(function () {
            window.location.href = "page1.html";
    },30000);


    });

});


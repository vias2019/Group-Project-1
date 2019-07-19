var selectedPayee = '';

$(document).ready(function () {
   
    var buyTogetherFirebase = DB.ref();
    
    var orderDB = DB.ref('orders');

    var payee1, payee2, payee3,productprice, paid1, paid2, paid3, orderID, time;
    var pay1=0;
    var pay2=0;
    var pay3=0;
    var objectName;

    $('#retrieve-order').on('click', function (e) {
        e.preventDefault();
        orderID=$('#sale-id').val();
        console.log('are we here?');
        $('#payee-name').empty();
        buyTogetherFirebase.orderByChild('orderId').equalTo($('#sale-id').val()).limitToFirst(1).on("value", function (snapshot) {
            objectName=Object.keys(snapshot.val())[0];
            console.log("objectName:", objectName);


            console.log(snapshot.val());
            console.log('Key name is: ', Object.keys(snapshot.val())[0]);
            snapshot.forEach(function (data) {
                console.log(data.val());  
                console.log(data.child(orderID).val());
                payee1 = data.val().payee1Name;
                payee2 = data.val().payee2Name;
                payee3 = data.val().payee3Name;
                pay1 = parseFloat(data.val().payee1Pay);
                pay2 = parseFloat(data.val().payee2Pay);
                pay3 = parseFloat(data.val().payee3Pay);
                productprice = parseFloat(data.val().price);
                paid1 = data.val().paid1;
                paid2 = data.val().paid2;
                paid3 = data.val().paid3;
                time=data.val().time;
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
            console.log('payees2: ', orderID, payee1, payee2, payee3, pay1, pay2, pay3, productprice, paid1, paid2, paid3, time);
            var option = $('option:selected').val();
            console.log(option);
        });
        // cobT9wtLp

    });
    

    $('#payee-name').change(function() {
        
        selectedPayee= $('#payee-name option:selected').text();
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

    console.log('initializing click event');


    function checkIfTimeIsUp() {
        console.log('are we here?');
        var currentTime = moment().unix();
        if (currentTime >= time) {
            //add message "You run out of time, your order will be deleted"
            //delete record from firebase
            console.log(objectName);
            database.ref().child(objectName).remove();
        } else {
            if ((pay1 + pay2 + pay3) === productprice) {
                //add message "The order # is complete. Thank you for shopping with us!"
            } else {
                //add message "The order # will be complete when all payees pay"
                //update firebase
                if ($('#nextcheckbox').is(':checked')) {
                    if (selectedPayee == payee1) {
                        // push paid2=paid 
                        buyTogetherFirebase.child(objectName).update
                            ({
                                "paid1": "paid"
                            });
                    }
                    else if (selectedPayee == payee2) {
                        // push paid3=paid
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

        }
    }

    $(document).on('click', '#nextcomplete-order', function (e) {
        e.preventDefault();
        console.log('Hi');
       
        checkIfTimeIsUp();

    });
});

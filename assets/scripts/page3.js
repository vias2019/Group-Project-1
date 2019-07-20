// Global order & payee vars
var selectedPayee = null;
var selectedPayeeIndex = -1;
var currentOrder = null;
var orderPayees = {};
var orderKey = '';
var expirationInterval = null;

function isOrderExpired(order) {

    let now = moment().unix();

    return now > order.expiration;
}

function orderExpired() {
    if (expirationInterval) {
        clearInterval(expirationInterval);
    }

    $('#warning').remove();
    $('#status-message').remove();
    $('#order-details').remove();
    $('#product-info').remove();
    displayError('This order has expired. Please create a new order.');

    DB.ref(`orders/${orderKey}`).remove();

    // Redirect to first page after 10 seconds
    setTimeout(function () {
        window.location = 'page1.html';
    }, 10000);
}

function updateOrderStatus(setExpiration = false) {
    // First check if order has expired
    if (isOrderExpired(currentOrder)) {
        orderExpired();
        return;
    }

    // Next check if order is complete
    let orderComplete = orderPayees.every(p => p.paid);
    if (orderComplete) {
        clearInterval(expirationInterval);
        $('#warning').remove();
        $('#payment-card').remove();
        displayStatus("The order is complete.");
    } else if (setExpiration) {
        updateExpiration();
        expirationInterval = setInterval(updateExpiration, 1000);
    }
}

// Returns the sum of the paid amounts
function getPaidTotal() {
    return orderPayees
        .filter(p => p.paid)
        .reduce((sum, p) => sum + p.payment, 0.0);
}

// Updates the funding progress bar
function updateProgress(order) {
    let paidTotal = getPaidTotal();
    $('#paid-total').text(`$${paidTotal.toFixed(2)}`);
    let percent = Math.floor(100 * paidTotal / order.price);
    $('#order-progress').attr('aria-valuenow', percent).css('width', `${percent}%`);
}

function updateOrderDetails(order) {
    // Update global vars
    currentOrder = order;
    orderPayees = order.payees;

    $('#order-id').text(order.id);

    updateProgress(order);

    // Add product card
    let productCard = createProductCard(order.item, order.price, order.images);
    $('#product-info').empty();
    $('#product-info').append(productCard);

    // Build payee select
    let $selectGroup = $('<div>').addClass('input-group input-group-lg');
    let $prependGroup = $('<div>').addClass('input-group-prepend');
    let $label = $('<label>')
        .addClass('input-group-text')
        .attr('for', 'payeeSelect')
        .text('Payee');
    let $select = $('<select>')
        .addClass('custom-select name')
        .attr('id', 'payeeSelect');
    let $button = $('<button>')
        .addClass('btn btn-primary btn-lg ml-3')
        .attr({
            'id': 'pay-button',
            'disabled': 'true',
            'aria-disabled': 'true'
        })
        .text('Confirm Payment');

    let $optionNone = $('<option>')
        .attr({
            id: 'option0',
            selected: ''
        })
        .text('None');
    $select.append($optionNone);

    // Add option for each payee on order
    order.payees.forEach((payee, i) => {
        let $option = $('<option>')
            .addClass('name')
            .attr({
                id: `option${i}`,
                value: `payee${i}`,
                idx: i
            })
            .text(payee.name);

        $select.append($option);
    });

    $prependGroup.append($label);
    $selectGroup.append($prependGroup, $select, $button);

    $('#name-select').empty();
    $('#name-select').append($selectGroup);

    // Output order information in table
    let columns = ['#', 'Name', 'Amount', 'Paid'];
    let $table = $('<table>').addClass('table');
    let $head = $('<thead>');

    // Build header
    let $headRow = $('<tr>');
    columns.forEach(col => {
        let $col = $('<th>')
            .attr('scope', 'col')
            .text(col);
        $headRow.append($col);
    });
    $head.append($headRow);

    // Build body
    let $body = $('<tbody>').attr('id', 'table-body');
    order.payees.forEach((payee, i) => {
        // Create payee row
        let $row = $('<tr>').attr('id', `payee${i}`);
        let $th = $('<th>')
            .attr('scope', 'row')
            .text(i);
        let $tdName = $('<td>')
            .addClass('name')
            .text(payee.name);
        let $tdAmount = $('<td>').text(`$${payee.payment.toFixed(2)}`);
        let $icon = $('<i>').addClass('fas fa-lg');
        if (payee.paid) {
            $icon.addClass('fa-check-circle').css('color', 'green');
        } else {
            $icon.addClass('fa-exclamation-circle').css('color', 'orange');
        }
        let $tdPaid = $('<td>').html($icon);

        // Append columns to row, then row to table body
        $row.append($th, $tdName, $tdAmount, $tdPaid);
        $body.append($row);
    });

    $table.append($head, $body);
    $('#payee-table').empty();
    $('#payee-table').append($table);

    // Display order expiration
    updateOrderStatus(true);

    $('#warning')
        .removeClass('d-none')
        .addClass('d-block');
    $('#order-details')
        .removeClass('d-none')
        .addClass('d-inline');
}

// Updates the displayed expiration countdown
function updateExpiration() {
    let now = moment().unix();

    // Check expiration
    if (now > currentOrder.expiration) {
        orderExpired();
        return;
    }

    let expiration = moment.unix(currentOrder.expiration - now);
    let formatted = expiration.format('mm:ss');
    $('#expiration-timer').text(formatted);
}

function confirmPayment(payee) {
    console.log(`Confirming payment of $${payee.payment} for ${payee.name}.`);

    // Get index of current payee in payee array on order object
    if (selectedPayeeIndex < 0) {
        console.log(`ERROR: Payee ${payee.name} not found in order. Aborting.`);
        return;
    }

    // Update paid flag for payee in DB
    DB.ref(`orders/${orderKey}/payees/${selectedPayeeIndex}`).update({
        paid: 'true'
    });

    let status = `Successfully confirmed payment for <span class='name'>${payee.name}</span>.`;
    displayStatus(status);
}

$(document).ready(function () {
    // Event listener for confirm payment button click
    $('#name-select').on('click', '#pay-button', function (e) {
        e.preventDefault();
        if (!currentOrder) {
            console.log('ERROR: No order. Aborting.');
            return;
        }
        if (!selectedPayee) {
            console.log('ERROR: No payee selected. Aborting.');
            return;
        }

        confirmPayment(selectedPayee);

        updateOrderStatus();
    });

    // Event listener for order id submit button click
    $('#retrieve-order').on('click', function (e) {
        e.preventDefault();

        // Get order id input value
        let orderId = $('#sale-id')
            .val()
            .trim();
        if (orderId === '') {
            // Blank id -> return
            return;
        }

        // Search for associated order by provided id
        DB.ref('orders')
            .orderByChild('id')
            .equalTo(orderId)
            .limitToFirst(1)
            .on('value', function (snapshot) {
                let order = snapshot.val();
                if (order) {
                    console.log('Order found:');
                    console.log(order);
                    orderKey = Object.keys(order)[0];
                    updateOrderDetails(order[orderKey]);
                } else {
                    console.log(`Order ${orderId} not found.`);
                }
            });
    });

    // When selected payee is changed
    $('#name-select').on('change', '#payeeSelect', function () {
        let selected = $(this).children('option:selected');

        console.log('Payee selected:', selected.text());

        // Highlight selected payee
        let payeeId = `${$(this).val()}`;
        $('#table-body tr').each(function () {
            $(this).removeClass('table-primary');

            let rowId = $(this).attr('id');
            if (rowId && rowId === payeeId) {
                $(this).addClass('table-primary');
            }
        });

        let $payButton = $('#pay-button');

        let index = parseInt(selected.attr('idx'));

        // Exit early if invalid index - or 'None' selected
        if (Number.isNaN(index)) {
            $payButton.attr({
                'disabled': 'true',
                'aria-disabled': 'true'
            });
            return;
        }

        // Get associated payee object
        let payee = orderPayees[index];
        if (!payee) {
            console.log('Could not locate payee object for', selected);
            return;
        }
        selectedPayee = payee;
        selectedPayeeIndex = index;

        // Enable/disable payment button based on payment status
        if (payee.paid) {
            $payButton.attr({
                'disabled': 'true',
                'aria-disabled': 'true'
            });
        } else {
            $payButton.removeAttr('disabled');
            $payButton.removeAttr('aria-disabled');
        }
    });

});
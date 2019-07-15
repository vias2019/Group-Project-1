





function displayRealTime() {
    setInterval(function () {
        $('#current-time').html(moment().format('hh:mm A'))
    }, 1000);
}
displayRealTime();


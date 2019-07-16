document.addEventListener("DOMContentLoaded", evt => {
    // Create interval to update displayed current time
    setInterval(function() {
        $("#current-time").html(moment().format("hh:mm:ss A"));
    }, 1000);
});

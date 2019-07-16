document.addEventListener('DOMContentLoaded', function() {
    // Create interval to update displayed current time
    setInterval(function() {
        $('#current-time').html(moment().format('hh:mm:ss A'));
    }, 1000);

    // Add click event listener to search button
    $('#button-search').on('click', evt => {
        // Prevent form submission
        evt.preventDefault();

        // Get search term and perform search for Etsy listings
        let $resultsContainer = $('#results-container');
        let searchTerm = $('#search-term')
            .val()
            .trim()
            .toLowerCase();
        if (searchTerm === '') {
            // Nothing to search...
            return;
        }

        const ETSY = new EtsyAPI();
        ETSY.getListings(searchTerm, $resultsContainer);
    });
});

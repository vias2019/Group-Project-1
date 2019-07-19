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

// Create global reference to our Firebase DB
const DB = firebase.database();

// When DOM content is loaded
document.addEventListener('DOMContentLoaded', evt => {

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

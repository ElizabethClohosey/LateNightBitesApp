//Inititializing JS on document ready
$(document).ready(function () {
    //setting global variables for latitude and longitude to pass through yelp Ajax Request
    var latitude;
    var longitude;

    //On Click event to get map and current latitude and longitude
    $('#btnMap').on('click', initMap);
    function initMap() {
        var map, infoWindow;
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 15
        });
        infoWindow = new google.maps.InfoWindow;
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                //setting global gps variables w/ values of current position
                latitude = position.coords.latitude;
                longitude = position.coords.longitude
                infoWindow.setPosition(pos);
                infoWindow.setContent('Location found.');
                infoWindow.open(map);
                map.setCenter(pos);
            }, function () {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }

    //On click event to pass the gps coordinates through the yelp AJAX request and get the yelp object
    $('#btnYelpRequest').on('click', function() {
        // This is a workaround since the Yelp API does not accept CORS
        $.ajaxPrefilter(function (options) {
            if (options.crossDomain && jQuery.support.cors) {
                options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
            }
        });
        
        // AJAX Yelp API request

        $.ajax({
            async: true,
            crossDomain: true,
            url: "https://api.yelp.com/v3/businesses/search? term=restaurants&latitude=" + latitude + "&longitude=" + longitude + "&radius=1000&categories=restaurants&open_now=true&%20term=restaurants",
            method: "GET",
            headers: {
                "Authorization": "Bearer jCMmOYHc25KdfrfqfSx4_sejgdnb8eeYAprm_L8JTHaCtYPYVV9JFiG8xDZyCuwWq24y4vOZYOP8oCLUXgkO8XCGb2oh4-z54urrZYbKFxp5CPUeNxe42vi7DR2JXXYx",
            }
        //promise that returns yelp object
        }).then(function (response) {
            // console log to see the object returned
            console.log(response);
        });
    });

});
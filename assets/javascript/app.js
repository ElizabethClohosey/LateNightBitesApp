//Inititializing JS on document ready
$(document).ready(function () {
    //setting global variables for latitude and longitude to pass through yelp Ajax Request
    var latitude;
    var longitude;
    var businessesArr = [];
    var categoryArr = [];

  //On Click event to get map and current latitude and longitude
  $("#btnMap").on("click", initMap);
  function initMap() {
    var map, infoWindow;
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 15
    });
    infoWindow = new google.maps.InfoWindow();
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          //setting global gps variables w/ values of current position
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        function() {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }

  //On click event to pass the gps coordinates through the yelp AJAX request and get the yelp object
  $("#btnYelpRequest").on("click", function() {
    // This is a workaround since the Yelp API does not accept CORS (cross-origin-resourse-shopping)
    $.ajaxPrefilter(function(options) {
      if (options.crossDomain && jQuery.support.cors) {
        options.url = "https://cors-anywhere.herokuapp.com/" + options.url;
      }
    });

    // AJAX Yelp API request
    // lat and long aren't working
    $.ajax({
      async: true,
      crossDomain: true,
      url:
        "https://api.yelp.com/v3/businesses/search? term=restaurants&latitude=" +
        // latitude
        35.779591 +
        "&longitude=" +
        // longitude
        -78.638176 +
        "&radius=1000&categories=restaurants&open_at=1569538800&%20term=restaurants",
      //    add unix api to convert time ^
      method: "GET",
      headers: {
        Authorization:
          "Bearer jCMmOYHc25KdfrfqfSx4_sejgdnb8eeYAprm_L8JTHaCtYPYVV9JFiG8xDZyCuwWq24y4vOZYOP8oCLUXgkO8XCGb2oh4-z54urrZYbKFxp5CPUeNxe42vi7DR2JXXYx"
      }
      //promise that returns yelp object
    }).then(function(response) {
      // console log to see the object returned
      console.log(response);
      console.log(response.businesses);
      //   for (let index = 0; index < response.businesses.length; index++) {
      //     businessesArr.push(response.businesses[index]);
      //     console.log(businessesArr);
      //   }
      //   for (let index = 0; index < businessesArr.length; index++) {
      //     console.log(index);
      //     console.log(businessesArr[index]);
      //     //name of restaurant
      //     console.log("name of restaurant " + businessesArr[index].name);
      //     //category of food
      //     console.log("category " + businessesArr[index].categories[0].title);
      //     categoryArr.push(businessesArr[index].categories[0].title);
      //     //street address
      //     console.log("street address " + businessesArr[index].location.address1);
      //     //phone number
      //     console.log("phone number " + businessesArr[index].phone);
      //     //star rating
      //     console.log("rating " + businessesArr[index].rating);
      //     // of reviews
      //     console.log("reviews " + businessesArr[index].review_count);
      //     //price
      //     console.log("price " + businessesArr[index].price);
      //     //image url
      //     console.log("image url" + businessesArr[index].image_url);
      //   }
      //   console.log("categoryArr" + categoryArr);
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
            console.log(response.businesses);
            for (let index = 0; index < response.businesses.length; index++) {
                businessesArr.push(response.businesses[index]);
                console.log(businessesArr);
            }
            for (let index = 0; index < businessesArr.length; index++) {
                console.log(index);
                console.log(businessesArr[index]); 
                //name of restaurant
                console.log("name of restaurant " +businessesArr[index].name);
                //category of food 
                console.log("category " + businessesArr[index].categories[0].title); 
                categoryArr.push(businessesArr[index].categories[0].title); 
                //street address
                console.log("street address " + businessesArr[index].location.address1);
                //phone number
                console.log("phone number " +businessesArr[index].phone);
                //star rating
                console.log("rating " + businessesArr[index].rating);
                // of reviews
                console.log("reviews " + businessesArr[index].review_count);
                //price
                console.log("price " + businessesArr[index].price);
                //image url
                console.log("image url" + businessesArr[index].image_url);

            }
            console.log("categoryArr" + categoryArr);
            
        });
    });

      // run through response and only take restaurants open last 10PM
      // append restaurant name, location, stars, and image to new container div

      for (var i = 0; i < response.businesses.length; i++) {
        console.log(response.businesses[i].name);
        var container = $("<div>");
        // restaurant hours search
        var restaurantName = response.businesses[i].name;
        container.text(restaurantName);
        $(".searchResults").append(container);
      }
    });
  });
});

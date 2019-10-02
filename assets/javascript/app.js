//Inititializing JS on document ready
$(document).ready(function() {
  // Hide stage 1 category storage
  $("#category-storage").hide();

  //Hide stage 2 div when page loads
  $("#stage2-results").hide();

  // Hide Yelp search button when page loads
  $("#btnYelpRequest").hide();

  //setting global variables for latitude and longitude to pass through yelp Ajax Request
  var latitude;
  var longitude;
  var businessesArr = [];
  var categoryArr = [];
  var unFilter = true;
  var dummyFilter;

  //adding second button w/ same locate function to be used in stage two
  $("#btnLocate2").on("click", initMap);

  //On Click event to get map and current latitude and longitude
  $("#btnLocate").on("click", initMap);

  function initMap() {
    var map, infoWindow;
    unFilter = true;
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

    function hide() {
      $("#stage1-disclaimer").hide();
    }

    hide();

    function show() {
      $("#stage2-results").show();
      $("#category-storage").show();
      $("#btnYelpRequest").show();
      // $("#btnLocate").show();
    }

    show();
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
    $("#yelp-info-storage").empty();

    // This is a workaround since the Yelp API does not accept CORS
    $.ajaxPrefilter(function(options) {
      if (options.crossDomain && jQuery.support.cors) {
        options.url = "https://cors-anywhere.herokuapp.com/" + options.url;
      }
    });

    // AJAX Yelp API request

    $.ajax({
      async: true,
      crossDomain: true,
      url:
        "https://api.yelp.com/v3/businesses/search? term=restaurants&latitude=" +
        latitude +
        "&longitude=" +
        longitude +
        "&radius=2500&categories=restaurants&open_now=true&%20term=restaurants",
      method: "GET",
      headers: {
        Authorization:
          "Bearer jCMmOYHc25KdfrfqfSx4_sejgdnb8eeYAprm_L8JTHaCtYPYVV9JFiG8xDZyCuwWq24y4vOZYOP8oCLUXgkO8XCGb2oh4-z54urrZYbKFxp5CPUeNxe42vi7DR2JXXYx"
      }
      //promise that returns yelp object
    }).then(function(response) {
      $("#category-storage").empty();
      businessesArr = [];
      // categoryArr = [];
      for (let index = 0; index < response.businesses.length; index++) {
        businessesArr.push(response.businesses[index]);
      }
      for (let index = 0; index < businessesArr.length; index++) {
        var restaurantCategoryArr = [];
        var categoryFilter = false;
        //creating unordered list to dynamically add to HTML
        var unorderedList = $("<ul class = 'collection'>");
        //creating list item for each restaurant's data to dynamically add to HTML
        var listItem = $("<li class = 'collection-item-avatar'>");
        //creating restaurant image to dynamically add to HTML
        var restaurantImg = $(
          '<img src ="' + businessesArr[index].image_url + '">'
        );
        //creating several <p>'s for restaurant info to dynamically add to HTML
        //name of restaurant
        var restaurantName = $("<p class = 'name'>").text(
          businessesArr[index].name
        );
        //category of food
        for (let i = 0; i < businessesArr[index].categories.length; i++) {
          restaurantCategoryArr.push(businessesArr[index].categories[i].title);
          if (
            categoryArr.indexOf(businessesArr[index].categories[i].title) == -1
          ) {
            categoryArr.push(businessesArr[index].categories[i].title);
            //creating buttons for the category
          }
          if (businessesArr[index].categories[i].title === dummyFilter) {
            categoryFilter = true;
          }
        }

        var restaurantCategory = $("<p class = 'name'>").text(
          restaurantCategoryArr
        );
        //street address
        var restaurantAddress = $("<p class = 'address'>").text(
          businessesArr[index].location.address1
        );
        //phone number
        var restaurantPhoneNumber = $("<p class = 'number'>").text(
          businessesArr[index].phone
        );
        //star rating
        var restaurantRating = $("<p class = 'rating'>").text(
          "Rating out of 5: " + businessesArr[index].rating
        );
        // # of reviews
        var restaurantReviews = $("<p class = 'reviews'>").text(
          "# of Reviews: " + businessesArr[index].review_count
        );
        //price
        var restaurantPrice = $("<p class = 'price'>").text(
          "Price: " + businessesArr[index].price
        );
        //image url
        if (categoryFilter || unFilter) {
          //appending what we just created to add to div in HTML next
          unorderedList.append(listItem);
          listItem.append(restaurantImg);
          listItem.append(restaurantName);
          listItem.append(restaurantCategory);
          listItem.append(restaurantAddress);
          listItem.append(restaurantPhoneNumber);
          listItem.append(restaurantRating);
          listItem.append(restaurantReviews);
          listItem.append(restaurantPrice);

          //prepending to div in HTML
          $("#yelp-info-storage").prepend(unorderedList);
        }
      }
      categoryArr.sort();
      for (let index = 0; index < categoryArr.length; index++) {
        const element = categoryArr[index];
        var a = $('<button class = "btn-category">');
        //Providing the inital button text
        a.text(element);
        //Adding the button to the buttons-appear-here div
        $("#category-storage").append(a);
      }
    });
  });

  $(document.body).on("click", ".btn-category", function() {
    dummyFilter = $(this).text();
    unFilter = false;
    $("#btnYelpRequest").click();
  });
});

// $.ajax({
//     url: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBch57574bZrBIaozRgthW7XGglbY305y4&callback=initMap",
//     type: "GET",
// data: {
//   origins: $("#origin").val(),
//   destination: $("#destinations").val(),
//   mode: "driving",
// },
//     success: function(data) {
//       console.log(data);
//     }
//   });

//   queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
//         emotion + "&api_key=BkaUZZWcFij6J7AoQj3WtPb1R2p9O6V9&limit=8";

$(document).ready(function() {
  //This is a workaround since the Yelp API does not accept CORS
  $.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
      options.url = "https://cors-anywhere.herokuapp.com/" + options.url;
    }
  });
  //AJAX Yelp API request
  $.ajax({
    async: true,
    crossDomain: true,
    url:
      "https://api.yelp.com/v3/businesses/search? term=restaurants&latitude=35.7770171&longitude=-78.6381584&radius=1609&categories=restaurants&open_now=true&%20term=restaurants",
    method: "GET",
    headers: {
      Authorization:
        "Bearer jCMmOYHc25KdfrfqfSx4_sejgdnb8eeYAprm_L8JTHaCtYPYVV9JFiG8xDZyCuwWq24y4vOZYOP8oCLUXgkO8XCGb2oh4-z54urrZYbKFxp5CPUeNxe42vi7DR2JXXYx"
    }
  })
    //Assyncronous promise to return the results of the request into the object of a function we will work out of
    .then(function(response) {
      //console log to see the object returned
      console.log(response);
      var results = response.data;
      var input = $(".location-search")
        .val()
        .text()
        .addClass("container-fluid")
        .attr({ id: "searchResults" });
      console.log(input);
      var container = $("<div>");
      $("#searchResults").append(container);

      // run through response and only take restaurants open last 10PM
      // append restaurant name, location, stars, and image to new container div
      for (var i = 0; i < results.length; i++) {
        if (results[i].restaurantHours === "open-past-10PM") {
          var container = $("<div>");
          // restaurant hours search
          var restaurantHours = results[i].restaurantHours;
          var restaurantImage = $("<img>");
          container.append("<div>");
          container.append(restaurantImage);
          restaurantImage.attr("src", results[i].restaurantImage);
          $(".searchResults").append(container);
        }
      }
    });
});

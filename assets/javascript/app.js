
$(document).ready(function() {

    // search button on click function
        $("#searchButton").on("click", function() {
            var queryURL = api.yelp.com/v3/businesses/search;
            var apiKey = jCMmOYHc25KdfrfqfSx4_sejgdnb8eeYAprm_L8JTHaCtYPYVV9JFiG8xDZyCuwWq24y4vOZYOP8oCLUXgkO8XCGb2oh4-z54urrZYbKFxp5CPUeNxe42vi7DR2JXXYx;
    // How do you set up the query string? Is this it?
            var queryString = 
            {
                search(argument_1: "value_1",
                        argument_2: "value_2") 
                        {
                    field_1
                    field_2 {
                        nested_field_1
                        
                    }
                }
            };
    // AJAX GET
            $.ajax({
                url: queryURL,
                method: "GET"
              })
    // open page instructions show until either search button clicked
    // restaurant, if open past 10, allow to populate, if not skip over
    // retun area shows: restaurant, cuisine type, star rating, proximity, map
        }
    )});

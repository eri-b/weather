
var address;
var url;



var ipCity = "New York";
var ipReg = "New York"
var lat = "40.7128";
var lon = "-74.0060";
var newaddress;



$.getJSON('http://api.ipstack.com/check?access_key=b0173b76f3a64ad0ca9a80b984ce0ea9&format=1', function(data) {
  ipCity = data.city;
  ipReg = data.region_name;
  
  lat = data.latitude;
  lon = data.longitude;
  if (ipCity == " " || ipCity == ""){
    ipCity = "New York";
    ipReg = "New York";
    lat = "40.7128";
    lon = "-74.0060";
  }
  
}).done(function() { 
    
    // Lat/Lng should have appeared from IP address
    findWeather();
    $('#location').html(ipCity + ", "+ ipReg); // City
    document.title = ipCity + " - Simple Weather";

    // $(" #current input[type='text']").attr('value', ipCity);

}).fail(function(){
  
    // Lat/Lng should have appeared from IP address
    findWeather();
    $('#location').html(ipCity + ", "+ ipReg); // City
    document.title = ipCity + " - Simple Weather";  

    // $(" #current input[type='text']").attr('value', ipCity);
});





var temp;
var hi;
var lo;
var min;
var hitime;
var mintime;
var later;
var condition;
var curtime = Math.round((new Date()).getTime() / 1000); //unix timestamp

//Finds Weather for any given Lat/lon Darksky
function findWeather() {
  url_old = "https://api.darksky.net/forecast/d5d98e87f7b5cfc3cacc4f0539238087/"+lat+","+lon+"?exclude=minutely,hourly,alerts,flags";
  url = "https://api.pirateweather.net/forecast/rcmjZwdspRKfOFmX/"+lat+","+lon
  // Dark Sky
  $.ajax({
    url: url,
    dataType: "jsonp",
    success: function (pdata) {
        temp = pdata.currently.temperature;
        temp = Math.round(temp);
        
        min = pdata.daily.data[0].temperatureMin; // total low
        min = Math.round(min);
        mintime = pdata.daily.data[0].temperatureMinTime;

        hi = pdata.daily.data[0].temperatureHigh;
        hi = Math.round(hi);

        lo = pdata.daily.data[0].temperatureLow; // low for night
        lo = Math.round(lo);

        //OLD
        // lo = pdata.daily.data[1].temperatureLow; // low for next day..
        // lo = Math.round(lo);

        hitime = pdata.daily.data[0].temperatureHighTime;
        
        var buffer = 3600; // 1 hr in secs
        buffer = 4 * buffer; // 4 hour buffer before hi time
        hitime = hitime - buffer;
        console.log(hitime);
        if (curtime < hitime){lo = min;} // show lowest of two
        

        condition = pdata.currently.summary;//Condition
        
        console.log(pdata)
        
        var temp2 = temp + "&deg;";
        var hi2 = hi + "&deg;";
        var lo2 = lo + "&deg;";
        $('#temp span').html(temp2); // temp
        $('#hi span').html(hi2); // temp
        $('#lo span').html(lo2); // temp
        $('#content strong#a1').html("&#x2192;"); // a1
        $('#content strong#a2').html("&#x2193;"); // a2
        $('#condition').html(condition); // condition   
        
        // $('#temp').css('font-size', temp); // temp
        
    }
  });	
  
}


// Finds Lat/Lon for any given search query
geocoder = new google.maps.Geocoder();

function codeAddress() {
    geocoder.geocode( { 'address' : address }, function( results, status ) {
        if( status == google.maps.GeocoderStatus.OK ) {
          lat = results[0].geometry.location.lat();
          lon = results[0].geometry.location.lng();
          
          newAddress = results[0].formatted_address;
          $('#location').html(newAddress); // City
          document.title = newAddress;

          // CALL WEATHER API after updating getting Lat/Lon Coords
          findWeather();

        } else {
            // alert( 'Geocode was not successful for the following reason: ' + status );
            alert( 'Please enter some text');
        }
    } );
}



// For new addresses
$("button").on('click', function(){
  
  address = $( "#newCity" ).val();
  codeAddress();

})

$("a#credits").on('click', function(){
  $('#info').toggle();
});

$("#info").on('click', function(){
  $('#info').toggle();
});

$("#newCity").on('click', function(){
  
  $( "#newCity" ).val('');
  $("button").css('display','inline-block');

});

// Allows for submit when enter is pressed
$("input").keypress(function(event) {
    if (event.which == 13) {
        event.preventDefault();
        $("button").click();
    }
});


//Date Stuff

var now = new Date();

// You can use one of several named masks
var nowD = now.format("mediumDate");
var nowT = now.format("shortTime");

$('#date').append(nowT);
$('#date').append(" "+nowD);


// Once ajax is complete, create some HTML
$(document).ajaxStop(function() {
  $("#content").addClass('in');
});


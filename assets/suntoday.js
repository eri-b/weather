


// WEATHER STUFF HERE

var address;
var url;



var ipCity = "New York";
var lat = "40.7128";
var lon = "-74.0060";
var newaddress;



$.getJSON('http://api.ipstack.com/check?access_key=b0173b76f3a64ad0ca9a80b984ce0ea9&format=1', function(data) {
  ipCity = data.city;
  ipRegion = data.region_name;

  lat = data.latitude;
  lon = data.longitude;
  if (ipCity == " " || ipCity == ""){
    ipCity = "New York";
    lat = "40.7128";
    lon = "-74.0060";
  }

}).done(function() {

    // Lat/Lng should have appeared from IP address
    findWeather();
    $('#location').html(ipCity+", "+ipRegion); // City
    document.title = 'Sun Today - '+ ipCity;

    // $(" #current input[type='text']").attr('value', ipCity);

}).fail(function(){

    // Lat/Lng should have appeared from IP address
    findWeather();
    $('#location').html(ipCity); // City
    document.title = 'Sun Today - '+ ipCity;

    // $(" #current input[type='text']").attr('value', ipCity);
});


var temp;
var condition;
var hourtemp;



function findIcon(icon){

var iconHtml = "<img src='assets/icons/"+icon+".png' />";
return iconHtml;
}


function summary(sum){

	var conden = "<span title='"+sum+"'>"+sum.substring(0,15) + " ...</span>";

	return conden;
}


function findTime(unix){
	var date = new Date(unix*1000);
	// Hours part from the timestamp
	var hours = date.getHours();

	var offsethrs = offset - woffset;
	hours = hours + offsethrs;

	var aorp = "<span class='ampm'>AM</span>";
	if (hours > 12){ aorp = "<span class='ampm'>PM</span>"; hours = hours - 12}
	else if(hours == 12) {aorp = "<span class='ampm'>PM</span>";}
	// Minutes part from the timestamp
	var minutes = "0" + date.getMinutes();
	var formattedTime = hours + ':' + minutes.substr(-2) + aorp;

	return formattedTime;
}

$(window).on('resize', function(){
      var win = $(this); //this = window
      if (win.width() < 1000) {


      }
      findWeather();

});


function getTime(time){
    var tempTime = new Date(time*1000);
    var hours = tempTime.getHours();
    var mins = tempTime.getMinutes();
    return [hours, mins];
}

function hourToAmpm(j){
    if (j>12){ j = j - 12; j = j+"<span class='ampm'>PM</span>"}
    else if(j==12){j=j+"<span class='ampm'>PM</span>"}
    else{j=j+"<span class='ampm'>AM</span>"}
    return j;
}

function buildDay(time, rise, set){
    $('#content').html("");

    var start = getTime(time)[0]; // hour of time
    var end = getTime(set)[0]; // hour of set

    /* This is for the current time */

    var minNow = getTime(time)[1];
    var minRatio = (minNow / 60);

    var timeNow = start + minRatio;


    /* This is for the rise and set */

    var minSet = getTime(set)[1]; // mins

    minSet = end + (minSet / 60); //


    var ratioSet = (Math.max(((minSet - start) / ((end) - start)) , 0))*100;


    var line3 = "<div class='line' id='setL'><span class='span'>Sunset: "+findTime(set)+"</span></div>"


    ratioSet = ratioSet + "%";





    var html = "";


    // this takes into account timezones..
    var offsethrs2 = offset - woffset;
    start = start + offsethrs2;
    end = end + offsethrs2;

    for (var i = start; i < (end + 1); i++) {
      var j = i;
        if (j>12){ j = j - 12; j = j+"<span class='ampm'>PM</span>"}
        else if(j==12){j=j+"<span class='ampm'>PM</span>"}
        else{j=j+"<span class='ampm'>AM</span>"}

        // This is an important line
        html += "<div class='time'><span class='label'>"+ j +"</span></div>";
    }

    $('#content').append(html);

    $('#content').append(line3);
    $('#setL').css("top", ratioSet);

    // This divides the section into equal portions
    var numSections = $('.time').length;

    var height = $(window).height();
    var header = $('header').outerHeight(true);
    var leftover = height - header;

    var sectionHeight = leftover / numSections;
    sectionHeight = sectionHeight + "px";

    $('.time').outerHeight(sectionHeight);


}

function setHeights(clouds, times){
  var numSections = $('.time').length;

  var hourselapsed = times[1] - times[0];
  for (var i = 0; i < numSections; i++) {

  }
}
$(window).on("load", function(){
  $("#overlay").addClass('in');
  $('#close').on('click', function(){
    // $("#overlay").removeClass('in');
  })
})


var newdate = new Date();
var offset = newdate.getTimezoneOffset() / 60;

var woffset;
var sunrise;
var sunset;
var time;
//Finds Weather for any given Lat/lon Darksky
function findWeather() {
  url = "https://api.darksky.net/forecast/d5d98e87f7b5cfc3cacc4f0539238087/"+lat+","+lon+"?exclude=minutely,alerts,flags";
  // Dark Sky
  $.ajax({
    url: url,
    dataType: "jsonp",
    success: function (pdata) {
    	// console.log(pdata);

      // this is important for setting time!
      woffset = pdata.offset * -1;
      time = (pdata.currently.time);
      sunrise = (pdata.daily.data["0"].sunriseTime);
      sunset = (pdata.daily.data["0"].sunsetTime);

      $('#content').html("");

      buildDay(time, sunrise, sunset);

  		$('#time .t').html(findTime(pdata.currently.time));
      $('#rise .t').html(findTime(sunrise));
      $('#set .t').html(findTime(sunset));


      //load cloud cover array
      var hourlyClouds = [];
      var start = getTime(time)[0]; //hour Now
      var end = getTime(sunset)[0]; //hour Set
      $('#overlay ul').html("");


      // Nighttime
      if((end - start + 1) < 1){
          $('#overlay').html("<div>It's night time. See you tomorrow</div>");
      }

      for (var i = 0; i < (end - start + 1); i++) {

        var cloudLevel = pdata.hourly.data[i].cloudCover;

        hourlyClouds.push(cloudLevel);

        var offsethrs3 = offset - woffset;


        // this is the tolerance!
        if(cloudLevel < .7){
          $('.time:nth-of-type('+ (i + 1) +')').addClass("sunny");
          var tempTime = start + i + offsethrs3;
          tempTime = hourToAmpm(tempTime);
          $('#overlay ul').append("<li>"+tempTime+"</li>");
        }
        else{
          // $('.time:nth-of-type('+ (i + 1) +')').css("background", "darkgray");
        }

        $('.time:nth-of-type('+ (i + 1) +')').append("<span class='lev'>"+cloudLevel+"</span>");
      }
      var prestart = getTime(sunrise)[0];
      var relTimes = [prestart, start, end];
      setHeights(hourlyClouds, relTimes);
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
          document.title = 'Sun Today - '+ newAddress;

          // CALL WEATHER API after updating getting Lat/Lon Coords
          findWeather();

        } else {
            alert( 'Geocode was not successful for the following reason: ' + status );
        }
    } );
}



// For new addresses
$("button").on('click', function(){
  $('#content').html("");

  address = $( "#newCity" ).val();
  codeAddress();

})

// For new addresses
$("#info").on('click', function(){
  $('#infobox').show();

})

$('#infoclose').on('click', function(){
  $('#infobox').hide();
})

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
var nowD2 = now.format("mmm d");




var today = now.getDay();
var week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var days = [];
var numDays = 7;
// days[0] = "Today ("+ week[today].substring(0,3) +")";
for (var i = 0; i < numDays; i++) {
  days[i]= week[today + i ];

};

var dates = [];

dates[0] = new Date();
dates[0] = dates[0].format("mmm d");
for (var i = 1; i < numDays; i++) {
  	dates[i] = new Date();
	dates[i].setDate(dates[i].getDate() + i);
	dates[i] = dates[i].format("mmm d");
};

$('#date .t').append(nowD);
// time is set from weather api
$('#day .t').append(days[0]);



// Once ajax is complete, create some HTML
$(document).ajaxStop(function() {
  $("#content").addClass('in');
});

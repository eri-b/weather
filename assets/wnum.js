
var address;
var url;

var maxPoints=[]; // define maxPoints as global var

var ipCity = "New York";
var lat = "40.7128";
var lon = "-74.0060";

var time24;

var isDark;
var current;



$.getJSON('http://api.ipstack.com/check?access_key=b0173b76f3a64ad0ca9a80b984ce0ea9&format=1', function(data) {
  ipCity = data.city + ", " + data.region_name;
  console.log(data);
  console.log(ipCity)
  lat = data.latitude;
  lon = data.longitude;
  if (ipCity == " " || ipCity == ""){
    ipCity = "New York";
    lat = "40.7128";
    lon = "-74.0060";
  }

}).done(function() {
  $(" #current input[type='text']").attr('value', ipCity);
    // Lat/Lng should have appeared from IP address
    findWeather();
    $('#loc span').html(ipCity); // City
    document.title = 'Weather Numerology - '+ ipCity;

}).fail(function(){
  $(" #current input[type='text']").attr('value', ipCity);
    // Lat/Lng should have appeared from IP address
    findWeather();
    $('#loc span').html(ipCity); // City
    document.title = 'Weather Numerology - '+ ipCity;
});





var temp;
var condition;

//Finds Weather for any given Lat/lon Darksky
function findWeather() {
  url = "https://api.darksky.net/forecast/d5d98e87f7b5cfc3cacc4f0539238087/"+lat+","+lon+"?exclude=minutely,hourly,alerts,flags";
  // Dark Sky
  $.ajax({
    url: url,
    dataType: "jsonp",
    success: function (pdata) {
        temp = pdata.currently.temperature;
        temp = Math.round(temp);
        condition = pdata.currently.summary;//Condition

        console.log(pdata)

        var temp2 = temp + "&deg;";
        $('#temp span').html(temp2); // temp
        $('#cond span').html(condition); // condition


    }
  });

}



$('header a.btn').on('click', function(){
  $('header').removeClass('initial');
  $('header a.btn').hide();
  setTimeout(function(){
    $('#weather').addClass('in');
  }, 1000);
  setTimeout(function(){
    $('#sysCtn').addClass('in');
  }, 3000);
});


$('#numWeather a.btn#match').on('click', function(){
  $('#numWeather a.btn').hide();
  $('#calcs').show();
  evalSystem(ipCity, temp, condition);
});

$('#numWeather a.btn#calcbtn').on('click', function(){

   calc();
  $('#numWeather a.btn#calcbtn').hide();
});

function calc(){
  var totalSum = 0;
  var sums = [];

  var temLoc = $('#numLoc div.rdata').html();
  var temTem = $('#numTemp div.rdata').html();
  var temCon = $('#numCond div.rdata').html();

  //LOC
  var newLoc="";
  var sum = 0;
  for (var i = 0; i < temLoc.length; i++) {
    if(i == (temLoc.length-1)){
      newLoc += temLoc[i]
    }
    else{
      newLoc += temLoc[i] + " <span class='b'>+</span> ";
    }
    sum += parseInt(temLoc[i]);
  }

  var temLoc = $('#numLoc div.rdata').append("<div><span class='b3'>&#x2192;</span>"+newLoc+"<span class='b b2'>=</span>"+ sum+"</div>");


  //Save sums for later

  sums[0] = sum;
  totalSum += sum;



  // TEMP
  var newTem="";
  var sum = 0;
  for (var i = 0; i < temTem.length; i++) {
    if(i == (temTem.length-1)){
      newTem += temTem[i];
    }
    else{
      newTem += temTem[i] + " <span class='b'>+</span> ";
    }
    sum += parseInt(temTem[i]);
  }

  var temTem = $('#numTemp div.rdata').append("<div><span class='b3'>&#x2192;</span>"+newTem+"<span class='b b2'>=</span>"+ sum+"</div>");

  //Save sums for later
  sums[1] = sum;
  totalSum += sum;


  // COND
  var newCon="";
  var sum = 0;
  for (var i = 0; i < temCon.length; i++) {
    if(i == (temCon.length-1)){
      newCon += temCon[i]
    }
    else{
      newCon += temCon[i] + " <span class='b'>+</span> ";
    }
    sum += parseInt(temCon[i]);
  }

  var temCon = $('#numCond div.rdata').append("<div><span class='b3'>&#x2192;</span>"+newCon+"<span class='b b2'>=</span>"+ sum+ "</div>");

  //Save sums for later
  sums[2] = sum;
  totalSum += sum;




  setTimeout(function(){
    $('#numWeather #ag').show();
    $('#numWeather #ag div').html(sums[0]+" <span class='b'>+</span> " + sums[1] + " <span class='b'>+</span> " +sums[2]+"<span class='b b2'>=</span><span id='tot'>"+ totalSum+"</span>");
    //see if more calcs are needed
    moreCalcs(totalSum);
  },1500);




}

function moreCalcs(totalSum){

  var newSum = 0;

  if((totalSum > 9) && (totalSum != 11) && (totalSum != 22)){



    //add them up
    totalSum = totalSum.toString();

    var expr = " <span class='b3'>&#x2192;</span> " + totalSum.charAt(0);

    for (var i = 0; i < totalSum.length; i++) {

      var num = totalSum.charAt(i);
      num = parseInt(num);
      newSum += num;

      // tell story
      if(i != 0){expr += " <span class='b'>+</span> " + totalSum.charAt(i);}


    }


    $('#numWeather #ag span#tot').append(expr + "<span class='b b2'> = </span>"+newSum);

    totalSum = newSum;

    if((newSum > 9) && (newSum != 11) && (newSum != 22)){
      //recursive call
    moreCalcs(newSum);
    }


  }

  // FINAL ACTIONS

  $('#final div.rdata').html(totalSum);
  // scrollt(numWeather);

  setTimeout(function(){
    $('#numer p').html(reports[totalSum - 1]);
    $('#contactbtn').show();
    // $('.calcsteps').slideUp();


  }, 1000);

}

$('#contactbtn').on('click', function(){
    $('#numer').show();
    $('#numer').addClass('in');
    $('header').addClass('fade');
    $('#cont').addClass('noheight');

})


var reports = [];

var numerReps =[
"Take extra care on this 5-Day to balance the time you spend socializing with the time you spend alone or with that special person in your life. Everyone may want a piece of you today, but there's only so much to go around. Trying to give everything you've got to just one person or group may leave the rest of them (or yourself) wanting. Be frank, One. Explain to those involved that you can't be with them every minute of every day, and that you must have contact with others. Defend your time alone just as strongly.",
"This 5-Day can enhance your need to take a break and get away from it all. This is important for you, even if you are in a close loving relationship. Time alone rejuvenates you and helps you to stay connected to your individuality. While this doesn't have to happen every day or even every week, every now and then time just to yourself can do you a world of good. Make some plans for this, Two. You may be surprised at how good you feel afterward.",
"This is the perfect day to take a break away from the stresses and worries you have in your life. Even if you have things that are really pressuring you, time off for yourself may be just what you need to regain your momentum and perspective. The 5-vibration that surrounds you today endeavors to bring fun and recreation into your life. Take advantage of this by making some plans. Get some friends involved if this suits you, Three.",
"Leave the work behind for a day. If you've been working hard and there have been a number of stresses on your shoulder, all the more reason to take advantage of this 5-Day's vibration. Try going out with some friends or taking part in your favorite sport. Doing this can help you feel better about your work while rejuvenating your spirit. Time away is often the ticket to regaining focus, Four. See what you can find that will bring some laughter into you day.",
"Try not to get carried away today. Any tendency you may have toward pleasure seeking will be greatly magnified by the presence of your own 5-vibration. Overindulgence can become a real risk. That relaxing drink after work could turn into a fifty-dollar happy hour bill, and that short mid-afternoon nap might last until dinnertime. Don't be afraid to treat yourself; just be aware of the possibility that it can get out of hand if you don't consciously work to stay in control, Five.",
"You'll find that this 5-Day gives you the ability to look on the bright side of life much more easily. This can really bring a lot to you if things have seemed overly harsh or bleak lately. It can do you a world of good to laugh at your situation sometimes. While this doesn't solve anything, it does give you the extra zest to handle things as they come. See about getting out for a while, too. Enjoy yourself a little.",
"You're not apt to face any heavy problems on this 5-Day. You can expect the atmosphere to be light and social, making it a perfect time to get together with others. Even if this only means sharing some anecdotes with colleagues over lunch, you'll definitely enjoy yourself. Consider making some plans with friends or perhaps a romantic date. There's no time like the present to have some fun, Seven. You're apt to find that others feel the same way.",
"This 5-Day will bring a great lighthearted atmosphere to the air. If you have children, ask yourself when the last time was that you played with them. Chances are, it's been a while. Children grow so fast, and before you know it, you'll be dipping into the college funds for them to get started. Take time out to enjoy what you have now and to play a little. Once you get going, Eight, you're sure to have as much fun as they do.",
"Make plans to enjoy yourself today. Don't be surprised if several people hit you up to go out and do something together. This is what a 5-vibration encourages most - fun! Take advantage of as many opportunities and invitations as you can. Even if you have to work first, there's plenty of time after hours to get together with your favorite friends. Go see a movie or head out for dinner. Go with whatever strikes your fancy, Nine. Spontaneity is a wonderful thing.",
"If pressures have been getting to you, this 5-Day should bring some relief. This vibration will lighten the energy that's in the air, giving you a little room to breathe. Be sure to make the most of this by stepping back from things for a while. Take a walk, or the afternoon off. You'd be amazed at how even an hour can help you deal with pressures. You may just need a break to get you back on track, Eleven.",
"On this 5-Day, put problems and issues aside for a while. Try not to get caught up in the idea that you are indispensable, or unable to step away for a while. Rest assured that the problems will still be there for you in the morning. However, by taking a break you can gain a fresh perspective that will allow you to solve things more easily. Some time away may be all you need to find the solutions you seek, so give it a try, Twenty-two."
];

var intro = "Hello,<br><br>Considering your location, weather, and time, your numerological sign is "
for (var i = 0; i < 11; i++) {
	if(i==9){reports[i]= intro + "<span>11</span>.<br><br>"+ numerReps[i];}

	else if(i==10){
		reports[i]= intro + "<span>22</span>.<br><br>"+ numerReps[i];
	}
	else{
		reports[i]= intro + "<span>"+ (i+1) +"</span>.<br><br>"+ numerReps[i];
	}

}


var system = [
  [1,2,3,4,5,6,7,8,9],
  ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
  ["J", "K", "L", "M", "N", "O", "P", "Q", "R"],
  ["S", "T", "U", "V", "W", "X", "Y", "Z"]
];

createSystem(system);

function createSystem(system){

  for (var i = 0; i < system.length; i++) {
    var row = "";
    for (var j = 0; j < system[i].length; j++) {
      var item = system[i][j];
      item = "<td>"+item+"</td>";
      row += item;
    }

    row = "<tr>"+ row +"</tr>";
    $('#system tbody').append(row);
  }


  // if(str.includes("BROKEN")){points+= 3;}

}

function evalSystem(region, temp, cond ){

  dance();

  var row1 = system[1];
  var row2 = system[2];
  var row3 = system[3];
  var numLoc = "";

  //LOCATION
  for (var i = 0; i < region.length; i++) {
    var char = region.charAt(i);
    var str = char.toUpperCase();

    // See if character is in row (will return -1 if not)
    var a = row1.indexOf(str);
    var b = row2.indexOf(str);
    var c = row3.indexOf(str);

    // will return the index of the only positive entry
    var ind = Math.max(a,b,c);
    ind = system[0][ind];

    // this creates a string of the winning entries
    if( ind > -1 ){
      ind = ind.toString();
      numLoc += ind;
    }

  }
   $('#numLoc div').html(numLoc);




  //Temperature

  setTimeout(function(){$('#numTemp div').html(temp);}, 1000);

  //condition
  var numCond = "";
  for (var i = 0; i < cond.length; i++) {
    var char = cond.charAt(i);
    var str = char.toUpperCase();

    var a = row1.indexOf(str);
    var b = row2.indexOf(str);
    var c = row3.indexOf(str);

    var ind = Math.max(a,b,c);
    ind = system[0][ind];

    if( ind > -1 ){
      ind = ind.toString();
      numCond += ind;
    }

  }

  setTimeout(function(){ dance(); }, 2000);
  setTimeout(function(){ $('#numCond div').html(numCond); }, 3000);


   setTimeout(function(){ $('#calcbtn').show(); }, 4000);  // show calc btn

}

function dance(){


  var rowTd = [1,3,4,2,3,4,2,3,2];

  var colTd = [5,3,2,4,6,7,4,3,1];


  setTimeout(function(){ $('#system table tr:nth-child('+rowTd[0]+') td:nth-child('+colTd[0]+')').addClass('d1');}, 0);
  setTimeout(function(){ $('#system table tr:nth-child('+rowTd[1]+') td:nth-child('+colTd[1]+')').addClass('d1');}, 100);
  setTimeout(function(){ $('#system table tr:nth-child('+rowTd[2]+') td:nth-child('+colTd[2]+')').addClass('d1');}, 200);
  setTimeout(function(){ $('#system table tr:nth-child('+rowTd[3]+') td:nth-child('+colTd[3]+')').addClass('d1');}, 300);
  setTimeout(function(){ $('#system table tr:nth-child('+rowTd[4]+') td:nth-child('+colTd[4]+')').addClass('d1');}, 400);
  setTimeout(function(){ $('#system table tr:nth-child('+rowTd[5]+') td:nth-child('+colTd[5]+')').addClass('d1');}, 500);
  setTimeout(function(){ $('#system table tr:nth-child('+rowTd[6]+') td:nth-child('+colTd[6]+')').addClass('d1');}, 600);
  setTimeout(function(){ $('#system table tr:nth-child('+rowTd[7]+') td:nth-child('+colTd[7]+')').addClass('d1');}, 700);
  setTimeout(function(){ $('#system table tr:nth-child('+rowTd[8]+') td:nth-child('+colTd[8]+')').addClass('d1');}, 800);

  setTimeout(function(){ $('#system table tr:nth-child('+rowTd[0]+') td:nth-child('+colTd[0]+')').removeClass('d1');}, 900);
  setTimeout(function(){ $('#system table tr:nth-child('+rowTd[1]+') td:nth-child('+colTd[1]+')').removeClass('d1');}, 1000);
  setTimeout(function(){ $('#system table tr:nth-child('+rowTd[2]+') td:nth-child('+colTd[2]+')').removeClass('d1');}, 1100);
  setTimeout(function(){ $('#system table tr:nth-child('+rowTd[3]+') td:nth-child('+colTd[3]+')').removeClass('d1');}, 1200);
  setTimeout(function(){ $('#system table tr:nth-child('+rowTd[4]+') td:nth-child('+colTd[4]+')').removeClass('d1');}, 1300);
  setTimeout(function(){ $('#system table tr:nth-child('+rowTd[5]+') td:nth-child('+colTd[5]+')').removeClass('d1');}, 1400);
  setTimeout(function(){ $('#system table tr:nth-child('+rowTd[6]+') td:nth-child('+colTd[6]+')').removeClass('d1');}, 1500);
  setTimeout(function(){ $('#system table tr:nth-child('+rowTd[7]+') td:nth-child('+colTd[7]+')').removeClass('d1');}, 1600);
  setTimeout(function(){ $('#system table tr:nth-child('+rowTd[8]+') td:nth-child('+colTd[8]+')').removeClass('d1');}, 1700);


}

var now = new Date();

// You can use one of several named masks
var nowD = now.format("mediumDate");
var nowT = now.format("shortTime");

$('#date').html("["+nowT+ " " +nowD+"]");

// Function scrolltop
function scrollt(div){
  var tdiv = "#"+div;
 $('body').animate({scrollTop: $(tdiv).prop("scrollHeight")}, 500);
}


// Hover
$('table td').hover(

function () {
$('table td:nth-child(' + ($(this).index() + 1) + ')').addClass('hover');
},

function () {
$('table td:nth-child(' + ($(this).index() + 1) + ')').removeClass('hover');
});

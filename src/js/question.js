var $ = require("jquery");
var dot = require("./lib/dot");
var card = dot.compile(require("./_card.html"));

$(document.body).on("click", ".option", function() {
  $(this).siblings(".answer").slideDown();
});

$(document.body).on("click", ".toggle", function(e) {
  var toggle = e.target.getAttribute("data-filter");
  $(this).siblings(".grid").attr("data-filter", toggle);
  $(this).siblings(".toggle.selected").removeClass("selected");
  $(this).addClass("selected");
});

var buffer = document.createElement("div");

deadlyForceData.forEach(function(row) {

  [row.last, row.first] = row.name.split(", ");
  if (row.race == "Multiple") row.race = "Multiracial";

  var classes = ["square"];

  var age = row.age < 20 ? "age-0"  :
            row.age < 30 ? "age-20" :
            row.age < 40 ? "age-30" :
            row.age < 50 ? "age-40" :
            row.age < 60 ? "age-50" :
            row.age < 70 ? "age-60" :
                           "age-70" ;

  // var gender = row.gender == "Male" ? "male" : "female";

  var race = row.race == "Asian/Pacific Islander" ? "asian"    :
             row.race == "Black"                  ? "black"    :
             row.race == "Hispanic"               ? "hispanic" :
             row.race == "Multiracial"               ? "multiple" :
             row.race == "Native American"        ? "native"   :
                                                    "white"    ;

  var weapon = row.weapon == "Knife/blade" ? "knife"     :
               row.weapon == "Firearm"     ? "firearm"   :
               row.weapon == "No weapon"   ? "no-weapon" :
               row.weapon == "Vehicle"     ? "vehicle"   :
               row.weapon == "Fake gun"    ? "fake"      :
                                             "other"     ;
                                                    
  var parsedTime = row.time.match(/^(\d+):.*?([AP]M)$/);
  if (parsedTime) {
    var [, hour, amPm] = parsedTime;
    hour = Number(hour);
  }
  if (amPm == "AM" && hour == 12) hour = 0;
  if (amPm == "PM" && hour < 12) hour += 12;

  var time = hour < 6 ? "time-0"   :
             hour < 12 ? "time-6"  :
             hour < 18 ? "time-12" :
             hour < 24 ? "time-18" :
             "" ;

  classes.push(age);
  // classes.push(gender);
  classes.push(race);
  classes.push(time);
  classes.push(weapon);

  var square = document.createElement("div");
  square.className = classes.join(" ");
  $(square).attr("id", row.id);
  buffer.appendChild(square);
});

$(".grid").each(function() {
  this.innerHTML = buffer.innerHTML;
});

$(document.body).on("click", ".square", function(e) {
  var id = e.target.getAttribute('id');
  var individual = deadlyForceData.filter(function(row) {
    return row.id == id
  })[0];
  console.log(individual)
  $(this).closest(".grid").next(".individual").html(card(individual));
  $(this).siblings(".square.selected").removeClass("selected");
  $(this).addClass("selected");
});

//NPM
var $ = require("jquery");
var track = require("./lib/tracking");

//utility
var qsa = s => Array.prototype.slice.call(document.querySelectorAll(s));
var reflow = () => document.body.offsetWidth;
var wait = (d, f) => setTimeout(f, d);

//CSS
var delay = (d) => (Math.random() * d).toFixed(2) + "s";

var iOS = !!window.navigator.userAgent.match(/i(phone|pad)/i);

var header = document.querySelector("header.splash");
var squares = qsa("header.splash .dot:not(.conviction)");

header.classList.add("animation-ready");

squares.forEach(function(square) {
  var $square = $(square);
  $square.css({
    transitionDelay: delay(3)
  });
});

reflow();

header.classList.add("animation-start");

header.classList.add(iOS ? "no-video" : "video-capable");


var step = (d, n, f) => setTimeout(function() {
  header.classList.add(`animation-step-${n}`);
  if (f) f();
}, d);

$(function() {
  //hide share button, it interferes on mobile
  $(".share:first").css({ display: "none" });

  //fade in first sentence
  step(50, 1);
  //fade in circles
  step(1000, 2);
  //second sentence
  step(5500, 3);
  //prosecution comes in
  step(7000, 4);
  //bring in title, circles fade back out
  step(9000, 5, function() {

    //only devices with video playback get the fun zoom
    if (true || iOS) return;

    var spacer = header.querySelector(".spacer.movable");
    var first = spacer.getBoundingClientRect();
    spacer.classList.add("relocated");
    var last = spacer.getBoundingClientRect();
    $(spacer).css({
      transform: `translateX(${first.left - last.left}px) translateY(${first.top - last.top}px)`
    });
    reflow();
    spacer.classList.add("animated");
    $(spacer).css({
      transform: `translateX(0) translateY(0)`
    });
  });
  //trigger play button
  step(9500, 6, function() {
    //show share button again
    $(".share:first").css({ display: "block" })
  });
});

$(".play-video").one("click", function() {
  var vTag = `<video controls class="trailer">
    <source src="./assets/trailer.mp4"></source>
  </video>`;
  header.querySelector(".aspect-inner").innerHTML += vTag;
  var video = header.querySelector("video.trailer");

  video.addEventListener("ended", function() {
    video.classList.remove("enter");
    setTimeout(() => video.classList.remove("show"), 500);
  });

  var playVideo = function() {
    video.classList.add("show");
    reflow();
    video.classList.add("enter");
    reflow();
    if (video.readyState > 0) {
      video.currentTime = 0;
    }
    video.play();


    track("investigation-police", "played-header-video");
  };

  $(".play-video").on("click", playVideo);

  playVideo();
});
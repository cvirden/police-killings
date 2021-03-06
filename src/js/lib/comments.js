/*global fyre, callback, authDelegate*/
//note that these libraries require jQuery or a jQuery shim, or they will throw errors
//a no-op shim is included below, but may be disabled with the following variable:

var $ = require("jquery");

var css = ["http://discussions.seattletimes.com/comments/css/st-commenting.css"];
var async = [
  "http://zor.livefyre.com/wjs/v3.0/javascripts/livefyre.js",
  "http://cdn.livefyre.com/Livefyre.js"
];

var head = document.querySelector("head");

css.forEach(function(url) {
  var link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  head.appendChild(link);
});

var scriptIndex = -1;

var configure = function() {
  Livefyre.require(['fyre.conv#3'], function(Conv) {

    var authDelegate = new fyre.conv.RemoteAuthDelegate();
    authDelegate.login = function() {
      document.cookie  = `st-return=${location.href};domain=.seattletimes.com;path=/`;
      window.location.href = "https://secure.seattletimes.com/accountcenter/";
    };
    authDelegate.editProfile = function() {
      window.location.href = "https://secure.seattletimes.com/accountcenter/editprofile";
    };

    new Conv({
        network: 'seattletimes.fyre.co',
        authDelegate: authDelegate
      }, [{
        app: 'main',
        siteId: '316317',
        articleId: 'custom-1442856951313',
        el: 'livefyre-app-custom-1442856951313'
      }], function (widget) {
        var cval = false;

        var decodedCookie = decodeURIComponent(document.cookie);
        var cachedCookies = decodedCookie.split(';');

        for (var i=0;i<cachedCookies.length;i++){

          var splitCookie = cachedCookies[i].split('=');
          var cookieName = splitCookie[0].replace(/^\s+|\s+jQuery/g,"");
          var cookieData = splitCookie[1];

          if (cookieName=='lftoken'){
            cval = cookieData;
          }

        }

        $(".load-comments").remove();

        if (cval) {
          try {
            fyre.conv.login(cval);
          } catch (e) {
            window.console && console.log("Error attempting to login with lftoken cookie value: ", cval, " ", e);
          }
        }
      });
  });
}

var asyncScripts = function(callback) {
  //console.log(this, scriptIndex);
  scriptIndex++;
  var url = async[scriptIndex];
  if (!url) {
    return configure();
  }
  var script = document.createElement("script");
  script.src = url;
  script.onload = asyncScripts;
  head.appendChild(script);
};

//load comments when clicked
$(".load-comments").one("click", function() {
  asyncScripts();
});
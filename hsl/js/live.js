'use strict';
radius = 1500;
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition)
  .then(loadPage())
  .catch(error => console.log(error));
}


function showPosition (position){
  lat = position.coords.latitude;
  lon = position.coords.longitude;
}
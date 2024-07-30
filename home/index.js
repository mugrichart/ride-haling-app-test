
const endpoint = 'http://localhost:3000'

import { buses } from '../staged-db/staged-buses.js';

import { fetchRoutes } from '../utils/fetchRoutes.js';

import {mapOptions, myPositionMarker, displayPotentialBuses } from '../utils/util_index.js';

let map;
let route;
let chosenBus;
let directionsService;
let directionsRenderer;

function initMap() {
  map = new google.maps.Map(document.getElementById("background-map"), mapOptions);

  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();

  directionsRenderer.setMap(map);

  function addMarker(map, markerIcon, position) {
    var marker = new google.maps.Marker({
      position: position,
      map: map,
      draggable: true,
      icon: markerIcon,
    });
    map.setCenter(position);
    return marker
  }

  fetchRoutes(endpoint)
    .then(routes => displayPotentialBuses(endpoint, routes, directionsService, directionsRenderer, map, addMarker))
    .catch(error => {
      console.error('Failed to fetch routes:', error);
    });
  //displayPotentialBuses(buses, directionsService, directionsRenderer, map, addMarker);
  // addMarker(map);

}

window.initMap = initMap;


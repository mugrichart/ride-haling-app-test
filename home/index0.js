
import { routes } from '../staged-db/staged-routes.js';
import { buses } from '../staged-db/staged-buses.js';

let map;
let route;
let chosenBus;

function initMap() {
  map = new google.maps.Map(document.getElementById("background-map"), mapOptions);

  displayPotentialBuses(buses);
  addMarker(map);
}



function displayPotentialBuses(buses) {
  document.getElementsByClassName("search-bar")[0].addEventListener('submit', function(event){
    event.preventDefault();
    var inputValue = document.getElementsByClassName("search-bar--input")[0].value;
    
    let potentialbuses = []
    
    buses.forEach(bus => { 
        if (bus.endStation.includes(inputValue.toLowerCase())) potentialbuses.push(bus)
    })

    // displaying the table head of the search results
    document.getElementsByClassName('search-results--head')[0].classList.remove('search-results--head-hide');
    document.getElementsByClassName('search-results--body')[0].classList.remove('search-results--body-hide');

    document.getElementsByClassName('search-results--body')[0].textContent = ''

    potentialbuses.forEach(bus => {
      //console.log(bus.busId, bus.timeAway);

      var busDiv = document.createElement('div')
      busDiv.classList.add("search-results--item");

      // Assign each property from the bus object to data attributes
      // Serialize the location object as a JSON string before setting it
      Object.keys(bus).forEach(key => {
        if (key === 'location') {
          busDiv.dataset[key] = JSON.stringify(bus[key]);
        } else {
          busDiv.dataset[key] = bus[key];
        }
      });

      busDiv.addEventListener('click', function() {
        chosenBus = {}; 
        Object.keys(this.dataset).forEach(key => {
          // Deserialize the location JSON string back into an object
          if (key === 'location') {
            chosenBus[key] = JSON.parse(this.dataset[key]);
          } else {
            chosenBus[key] = this.dataset[key];
          }
        });
        displayBusRoute(chosenBus)
      });

      var busRoute = document.createElement('div')
      busRoute.textContent = `${bus.startStation} -  ${bus.endStation}`
      var busTimeAway = document.createElement('div')
      busTimeAway.textContent = `${bus.timeAway}`
      //var bookingButton = document.createElement('button')
      //bookingButton.textContent = 'Book'

      busDiv.appendChild(busRoute);
      busDiv.appendChild(busTimeAway);
      //busDiv.appendChild(bookingButton)

      document.getElementsByClassName('search-results--body')[0].appendChild(busDiv)
    })

  })
}

function clearSearchResult() {
  document.getElementsByClassName('search-results--body')[0].textContent = ''
  document.getElementsByClassName('search-results--head')[0].classList.add('search-results--head-hide');
  document.getElementsByClassName('search-results--body')[0].classList.add('search-results--body-hide');
}
function displayBusRoute(bus) {
  console.log(bus)
  clearSearchResult();
  route = routes.find(route => 
    route.startStation === bus.startStation && route.endStation === bus.endStation
  );
  
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();

  directionsRenderer.setMap(map);

  console.log(bus, bus.location)

  var busMarkerIcon = {
    url: 'https://res.cloudinary.com/dtkxmg1yk/image/upload/v1714695083/troski/znzka76n58ticzoelcwv.png', // Replace with your actual URL
    scaledSize: new google.maps.Size(30, 60) // Size of the marker icon
  };

  var busLocationMarker = new google.maps.Marker({
    position: bus.location,
    map: map,
    title: 'Bus!',
    icon: busMarkerIcon,
    draggable: true // Make the marker draggable
  });


  directionsService
    .route({
      origin: route.startStationLocation,
      destination: route.endStationLocation,
      waypoints: route.waypoints,
      // optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
    })
    .catch((e) => window.alert("Directions request failed due to " + e));

}

const mapOptions = {
  zoom: 15,
  center: { lat: 5.689280, lng: -0.208920 },
  styles: [
    // Hide all default POIs
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    // Subdued color for landscape
    { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
    // Subdued color for roads
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    // Hide road labels
    { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
    // Highlight transit routes
    { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#b4b4b4" }] },
    // Style for water
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#d4e4eb" }] },
  ],
  disableDefaultUI: true, // Depending on the desired controls
  // Other options...
};

function addMarker(map) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      var markerIcon = {
        url: 'https://res.cloudinary.com/dtkxmg1yk/image/upload/v1714693164/troski/p7m8iqdm2zwliv89rjyp.png', // Replace with your actual URL
        scaledSize: new google.maps.Size(0, 120) // Size of the marker icon
      };
      
      var marker = new google.maps.Marker({
        position: pos,
        map: map,
        draggable: true,
        icon: markerIcon,
        title: 'Bus stop!'
      });

      map.setCenter(pos);

      // Add an event listener for the end of dragging
      google.maps.event.addListener(marker, 'dragend', function() {
        var newPos = marker.getPosition(); // The marker's new position
        alert('Marker dropped at latitude: ' + newPos.lat() + ', longitude: ' + newPos.lng());

        // You can also perform other actions here, like updating a form field with the new position
        // document.getElementById('latitude').value = newPos.lat();
        // document.getElementById('longitude').value = newPos.lng();
      });

    }, function() {
      handleLocationError(true, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, pos) {
  // Handle the error for geolocation here.
  console.log(browserHasGeolocation ?
              'Error: The Geolocation service failed.' :
              'Error: Your browser doesn\'t support geolocation.');
}


window.initMap = initMap;


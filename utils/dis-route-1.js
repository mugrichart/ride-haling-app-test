
import { routes } from "./util_index.js";
import { closestFoot  } from "./closestFoot.js";

let route;

function displayBusRoute(bus, directionsService, directionsRenderer, map, addMarker) {

    const toBusStopRenderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,  // This will suppress the default markers at the ends of the route
        polylineOptions: {
            strokeColor: '#FF0000'  // Red color
        }
    })
    
    const busPathRenderer = new google.maps.DirectionsRenderer({
        map: map,
    });
    
    let busLocationMarker = new google.maps.Marker({
        position: bus.location,
        map: map,
        title: 'Bus!',
        icon: busMarkerIcon,
        draggable: true // Make the marker draggable
    });

    clearSearchResult();
    route = routes.find(route => 
      route.startStation === bus.startStation && route.endStation === bus.endStation
    );
    
    // const directionsService = new google.maps.DirectionsService();
    // const directionsRenderer = new google.maps.DirectionsRenderer();
  
    // directionsRenderer.setMap(map);
  
    console.log(bus, bus.location)
  
    var busMarkerIcon = {
      url: 'https://res.cloudinary.com/dtkxmg1yk/image/upload/v1714695083/troski/znzka76n58ticzoelcwv.png', // Replace with your actual URL
      scaledSize: new google.maps.Size(30, 60) // Size of the marker icon
    };

    const geocodeLocation = function(location) {
        return new Promise((resolve, reject) => {
          // Initialize the geocoder
          var geocoder = new google.maps.Geocoder();
      
          // Geocode the location
          geocoder.geocode({ address: location }, function(results, status) {
            if (status == 'OK' && results[0]) {
              var locationObj = {
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
              };
              resolve(locationObj);
            } else {
              reject(status);
            }
          });
        });
      }
  
    Promise.all([
        geocodeLocation(route.startStationLocation),
        geocodeLocation(route.endStationLocation)
      ]).then(([startLocation, endLocation]) => {
        console.log('Start Location:', startLocation);
        console.log('End Location:', endLocation);

        // Use the geocoded locations as origin and destination for Directions Service
        directionsService.route({
          origin: startLocation,
          destination: endLocation,
          travelMode: google.maps.TravelMode.DRIVING,
        }).then((response) => {
          const directionsData = response.routes[0];
          const waypoints = directionsData.legs.flatMap(leg => leg.steps.slice(1, -1).map(step => ({
            lat: step.end_location.lat(),
            lng: step.end_location.lng()
          }))); // Extract waypoints from the directions data
          console.log(waypoints);

          // Now calculate distance to closest station using Distance Matrix Service
          const busRoute = [startLocation, ...waypoints, endLocation]; // Include all points (current location, waypoints, start & end stations)

          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            
            const meetingPoint = closestFoot(waypoints, pos)
            console.log(pos, meetingPoint.foot)
            

            var markerIcon = {
                url: 'https://res.cloudinary.com/dtkxmg1yk/image/upload/v1714693164/troski/p7m8iqdm2zwliv89rjyp.png', // Replace with your actual URL
                scaledSize: new google.maps.Size(50, 120) // Size of the marker icon
            };

            //new google.maps.Geocoder(meetingPoint.foot).then((location) => addMarker(map, markerIcon, location))
            // geocodeLocation(meetingPoint.foot).then(location => addMarker(map, markerIcon, location))
            addMarker(map, markerIcon, meetingPoint.foot)

            directionsService.route({
                origin: new google.maps.LatLng(pos.lat, pos.lng),
                destination: new google.maps.LatLng(meetingPoint.foot.lat, meetingPoint.foot.lng),
                travelMode: google.maps.TravelMode.WALKING,
            }).then(res => {
                toBusStopRenderer.setDirections(res)
                
            })
            }
        )

        // busRoute.forEach((waypoint) => {
        //     const markerIcon = {
        //         url: 'https://maps.google.com/mapfiles/kml/paddle/blu-circle.png',
        //         scaledSize: new google.maps.Size(30, 30)
        //     }

        //     addMarker(map, markerIcon, waypoint)

        // })
        
        
        busPathRenderer.setDirections(response);
        
        })})
        .catch((e) => window.alert("Directions request failed due to " + e));
  
}

function clearSearchResult() {
    document.getElementsByClassName('search-results--body')[0].textContent = ''
    document.getElementsByClassName('search-results--head')[0].classList.add('search-results--head-hide');
    document.getElementsByClassName('search-results--body')[0].classList.add('search-results--body-hide');
}

export { displayBusRoute }
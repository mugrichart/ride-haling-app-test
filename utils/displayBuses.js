

import { displayBusRoute } from "./util_index.js";
import { routes } from "./util_index.js";
import { fetchBuses } from "./fetchBuses.js";


function displayPotentialBuses(endpoint, routes, directionsService, directionsRenderer, map, addMarker) {
  console.log(potentialRoutes)
    document.getElementsByClassName("search-bar")[0].addEventListener('submit', function(event){
      event.preventDefault();
      var inputValue = document.getElementsByClassName("search-bar--input")[0].value;
      
      // let potentialbuses = []
      
      // buses.forEach(bus => { 
      //     if (bus.endStation.includes(inputValue.toLowerCase())) potentialbuses.push(bus)
      //       console.log(potentialbuses, inputValue.toLowerCase())
      // })

      let potentialRoutes = []
      
      routes.forEach(route => { 
          if (route.startStation.includes(inputValue.toLowerCase()) || route.endStation.includes(inputValue.toLowerCase())) potentialRoutes.push(route)
            console.log(potentialRoutes, inputValue.toLowerCase())
      })

      
  
      // displaying the table head of the search results
      document.getElementsByClassName('search-results--head')[0].classList.remove('search-results--head-hide');
      document.getElementsByClassName('search-results--body')[0].classList.remove('search-results--body-hide');
  
      document.getElementsByClassName('search-results--body')[0].textContent = ''
  
      potentialRoutes.forEach(route => {
        //console.log(bus.busId, bus.timeAway);
  
        // var busDiv = document.createElement('div')
        // busDiv.classList.add("search-results--item");
        // busDiv.dataset[id] = route.id;

        console.log(potentialRoutes)
        console.log(route, route['id'], route.id)
        var routeDiv = document.createElement('div')
        routeDiv.classList.add("search-results--item");

        routeDiv.dataset['id'] = route.id;

        // Object.keys(route).forEach(key => {
        //   if (key === 'location') {
        //     busDiv.dataset[key] = JSON.stringify(bus[key]);
        //   } else {
        //     busDiv.dataset[key] = bus[key];
        //   }
        // });
        
        routeDiv.addEventListener('click', function() {
          const chosenRouteId = this.dataset['id'];
          fetchBuses(chosenRouteId, endpoint)
            .then( data => {
                const potentialBuses = data;
                
                // Your current location (example values, replace with actual values)
                navigator.geolocation.getCurrentPosition(function(position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    const myLocation = new google.maps.LatLng(pos.lat, pos.lng);
                    const busLocations = potentialBuses.map(bus => new google.maps.LatLng(bus.busPosition.lat, bus.busPosition.lng));
                    const distanceService = new google.maps.DistanceMatrixService();

                    console.log(potentialBuses)

                    distanceService.getDistanceMatrix({
                      origins: [myLocation],
                      destinations: busLocations,
                      travelMode: 'DRIVING'
                    }, (response, status) => {
                      if (status === 'OK') {
                        console.log(response.rows[0])
                        const durations = response.rows[0].elements.map(element => element.duration.text);
                        displayBusesWithDurations(endpoint, potentialBuses, route, durations, directionsService, directionsRenderer, map, addMarker);
                      } else {
                        console.error('Error calculating distances:', status);
                      }
                    });
                })
                
            }).catch(error => console.log(error));

                // document.getElementsByClassName('search-results--body')[0].textContent = ''
            
                // document.getElementsByClassName('search-results--bus-id')[0].textContent = 'Bus Plate'
                // document.getElementsByClassName('search-results--bus-arrival-time')[0].textContent = 'Away'
                // potentialBuses.forEach( bus => {
                //     console.log(bus)
                //     var busDiv = document.createElement('div')
                //     busDiv.classList.add("search-results--item");
                //     var plateDiv = document.createElement('div')
                //     var timeDiv = document.createElement('div')
                //     plateDiv.textContent = `${bus.busId}`
                //     timeDiv.textContent = `${0}`

                //     busDiv.appendChild(plateDiv);
                //     busDiv.appendChild(timeDiv);

                //     document.getElementsByClassName('search-results--body')[0].appendChild(busDiv)
          
          //   })
          // }).catch(error => console.log(error))

          // let potentialBuses = []
          // buses.forEach( bus => {
          //   if (bus.startStation == route.startStation && bus.endStation == route.endStation) potentialBuses.push(bus)
          // })
          
          // I am using the same route div to display buses that match the route
          
        })
  
        
        // busDiv.addEventListener('click', function() {
        //   let chosenBus = {}; 
        //   Object.keys(this.dataset).forEach(key => {
        //     // Deserialize the location JSON string back into an object
        //     if (key === 'location') {
        //       chosenBus[key] = JSON.parse(this.dataset[key]);
        //     } else {
        //       chosenBus[key] = this.dataset[key];
        //     }
        //   });
        //   displayBusRoute(chosenBus, directionsService, directionsRenderer, map, addMarker);
          
        // })
  
        var routeOrigin = document.createElement('div')
        routeOrigin.textContent = `${route.startStation}`
        var routeDest = document.createElement('div')
        routeDest.textContent = `${route.endStation}`
        //var bookingButton = document.createElement('button')
        //bookingButton.textContent = 'Book'
  
        routeDiv.appendChild(routeOrigin);
        routeDiv.appendChild(routeDest);
        //busDiv.appendChild(bookingButton)
  
        document.getElementsByClassName('search-results--body')[0].appendChild(routeDiv)

      })
  
    })
}

function displayBusesWithDurations(endpoint, potentialBuses, route, durations, directionsService, directionsRenderer, map, addMarker) {
  document.getElementsByClassName('search-results--body')[0].textContent = ''
  document.getElementsByClassName('search-results--bus-id')[0].textContent = 'Bus Plate'
  document.getElementsByClassName('search-results--bus-arrival-time')[0].textContent = 'Bus Location'

  potentialBuses.forEach((bus, index) => {
    var busDiv = document.createElement('div')
    busDiv.classList.add("search-results--item");
    var plateDiv = document.createElement('div')
    var timeDiv = document.createElement('div')
    plateDiv.textContent = `${bus.busId}`
    timeDiv.textContent = `${durations[index]} away`
    busDiv.dataset['id'] = bus.busId

    busDiv.addEventListener('click', function() {
        var busId = this.dataset['id']
        var chosenBus = potentialBuses.find( bus => bus.busId == busId)
        displayBusRoute(endpoint, chosenBus, route, directionsService, directionsRenderer, map, addMarker)
    })

    busDiv.appendChild(plateDiv);
    busDiv.appendChild(timeDiv);
    document.getElementsByClassName('search-results--body')[0].appendChild(busDiv)
  })
}

export { displayPotentialBuses }
import { routes } from "./util_index.js";
import { closestFoot  } from "./closestFoot.js";
import { updatePassengerStats } from "./updatePassengerStats.js";
import { fetchBuses } from "./fetchBuses.js";
import { trackingBus } from "./bus-tracking.js";

let route;

let meToBusStop = {}
let busToBusStop = {}
let toDestination = {}
let meetingPoint;

var endLocation;

const handler = {
    set: function(target, property, value) {
      target[property] = value;
      // Run your function here when a property is set
      console.log(`Property ${property} of ${target} set to ${value}`);
      if (
        meToBusStop.distanceText && meToBusStop.durationValue &&
        busToBusStop.distanceText && busToBusStop.durationValue &&
        toDestination.distanceText && toDestination.durationValue
      ){
        updatePassengerStats(meToBusStop, busToBusStop, toDestination)
      }
      return true;
    }
  };
  
// const proxy = new Proxy({}, handler);
  
meToBusStop = new Proxy(meToBusStop, handler);
busToBusStop = new Proxy(busToBusStop, handler);
toDestination = new Proxy(toDestination, handler);

let myMarker;
let userPosition;

async function displayBusRoute(endpoint, bus, route, directionsService, directionsRenderer, map, addMarker) {
    if (!google && google.maps) {
        console.log('G maps api not ready yet')
        return
    }
    
    const { toBusStopRenderer, busPathRenderer, busLocationMarker, geocodeLocation } = tools(google.maps, map, bus)
    
    document.getElementById('bus-plate').textContent = `Bus Plate: ${bus.busId}`

    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        myMarker = addMarker(map, undefined, new google.maps.LatLng(pos.lat, pos.lng))
    })
    //addMarker(map, busLocationMarker, new google.maps.LatLng(bus.busPosition.lat, bus.busPosition.lng))
    clearSearchResult();
    // route = routes.find(route_ => 
    //     route_.startStation === bus.startStation && route_.endStation === bus.endStation
    // );
    console.log(route)

    try {
        const startLocation = await geocodeLocation(route.startStationLocation);
        endLocation = await geocodeLocation(route.endStationLocation);

        console.log('Start Location:', startLocation);
        console.log('End Location:', endLocation);

        // Use the geocoded locations as origin and destination for Directions Service
        const response = await directionsService.route({
            origin: startLocation,
            destination: endLocation,
            waypoints: route.waypoints,
            travelMode: google.maps.TravelMode.DRIVING,
        });

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
            
            meetingPoint = closestFoot(waypoints, pos)
            
            var markerIcon = {
                url: 'https://res.cloudinary.com/dtkxmg1yk/image/upload/v1714693164/troski/p7m8iqdm2zwliv89rjyp.png', // Replace with your actual URL
                scaledSize: new google.maps.Size(50, 120) // Size of the marker icon
            };

            addMarker(map, markerIcon, new google.maps.LatLng(meetingPoint.foot.lat, meetingPoint.foot.lng));

            meetingPoint = new google.maps.LatLng(meetingPoint.foot.lat, meetingPoint.foot.lng)
            // computing the distance and time between the bus and meeting spot
            directionsService.route({
                origin: meetingPoint,
                destination: new google.maps.LatLng(bus.busPosition.lat, bus.busPosition.lng),
                travelMode: google.maps.TravelMode.DRIVING,
                //we are taking the google maps route which might not be the right one.
            }).then(res => {
                const route = res.routes[0];
                const leg = route.legs[0];
                busToBusStop.distanceText = leg.distance.text,
                busToBusStop.durationValue = leg.duration.value
                
            })

            directionsService.route({
                origin: new google.maps.LatLng(pos.lat, pos.lng),
                destination: meetingPoint,
                travelMode: google.maps.TravelMode.WALKING,
            }).then(res => {
                toBusStopRenderer.setDirections(res);
                const route = res.routes[0];
                const leg = route.legs[0];
                meToBusStop.distanceText = leg.distance.text;
                meToBusStop.durationValue = leg.duration.value;

            })
        }
        )

        await busPathRenderer.setDirections(response);
        
        // computing the distance and time from the bus to the destination
        await directionsService.route({
            origin: new google.maps.LatLng(bus.busPosition.lat, bus.busPosition.lng),
            destination: endLocation,
            travelMode: google.maps.TravelMode.DRIVING,
        }).then(response => {
            const path = response.routes[0];
            const leg = path.legs[0];
            toDestination.distanceText = leg.distance.text;
            toDestination.durationValue = leg.duration.value;
        })
        
        
        // addMarker(map, undefined, {lat: 5.6674945, lng: -0.1772401})

        setInterval(()=> {
            const tracking = () => {
                console.log(route)
                trackingBus(bus.busId, userPosition, route.id, endpoint).then(
                    bus => {
                        busLocationMarker.setPosition({ lat: bus.busPosition.lat, lng: bus.busPosition.lng });
                        busLocationMarker.setLabel(bus.passengerNumber || '')
                        getCurrentLocation().then( LatLng => {
                            
                            userPosition = LatLng;
                            
                            myMarker.setPosition(LatLng)
                            const service = new google.maps.DistanceMatrixService();

                            function calculateDist(origin, destinations) 
                            {
                                return new Promise((resolve, reject) => {
                                    service.getDistanceMatrix({
                                        origins: [origin],
                                        destinations: destinations,
                                        travelMode: 'DRIVING'
                                    }, (response, status) => {
                                        if (status === 'OK') {
                                            resolve({
                                                meToBusStop: {
                                                    distanceText: response.rows[0].elements[0].distance.text,
                                                    durationValue: response.rows[0].elements[0].duration.value
                                                },
                                                busToBusStop: {
                                                    distanceValue: response.rows[0].elements[1].distance.value,
                                                    durationValue: response.rows[0].elements[1].duration.value
                                                },
                                                busStopToEnd: {
                                                    distanceValue: response.rows[0].elements[2].distance.value,
                                                    durationValue: response.rows[0].elements[2].duration.value
                                                }
                                            });
                                        } else {
                                            reject(status);
                                        }
                                    });
                                })
                            }

                            calculateDist(
                                meetingPoint,
                                [
                                    LatLng,//new google.maps.LatLng(myLat, myLng),
                                    {lat: bus.busPosition.lat, lng: bus.busPosition.lng},
                                    endLocation
                                ]
                            ).then( respI => {
                                    meToBusStop.distanceText = respI.meToBusStop.distanceText;
                                    meToBusStop.durationValue = respI.meToBusStop.durationValue;

                                    busToBusStop.distanceText = `${respI.busToBusStop.distanceValue / 1000} km`;
                                    busToBusStop.durationValue = respI.busToBusStop.durationValue;

                                    toDestination.distanceText = `${(respI.busToBusStop.distanceValue + respI.busStopToEnd.distanceValue)/1000} km`;
                                    toDestination.durationValue = respI.busToBusStop.durationValue + respI.busStopToEnd.durationValue
                            }).catch(error => console.log(error))

                        })
                    
                    }

                ).catch(error => console.log(error))
            }

            tracking()
        }, 2000)

    } catch (e) {
        window.alert("Directions request failed due to " + e);
    }
}

function clearSearchResult() {
    document.getElementsByClassName('search-results--body')[0].textContent = ''
    document.getElementsByClassName('search-results--head')[0].classList.add('search-results--head-hide');
    document.getElementsByClassName('search-results--body')[0].classList.add('search-results--body-hide');
}

function tools(gMap, map, bus) {
    if (!(google && google.maps)) {
        console.log('google maps api not ready yet')
        return
    }

    const toBusStopRenderer = new gMap.DirectionsRenderer({
        map: map,
        suppressMarkers: true,  // This will suppress the default markers at the ends of the route
        polylineOptions: {
            strokeColor: '#FF0000'  // Red color
        }
    })
    
    const busPathRenderer = new gMap.DirectionsRenderer({
        map: map,
    });
    
    var busMarkerIcon = {
        url: 'https://res.cloudinary.com/dtkxmg1yk/image/upload/v1714695083/troski/znzka76n58ticzoelcwv.png', // Replace with your actual URL
        scaledSize: new google.maps.Size(30, 60) // Size of the marker icon
    };

    let busLocationMarker = new gMap.Marker({
        position: bus.busPosition,
        map: map,
        title: 'Bus!',
        icon: busMarkerIcon,
        draggable: true // Make the marker draggable
    });

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

     // Get current location
    // function getCurrentLocation() {
    //     return new Promise((resolve, reject) => {
    //         navigator.geolocation.getCurrentPosition(position => {
    //             resolve({
    //                 lat: position.coords.latitude,
    //                 lng: position.coords.longitude
    //             });
    //         }, error => {
    //             reject(error);
    //         });
    //     });
    // }

    // // Calculate distances
    // function calculateDistances(meetingPoint, myLocation, busPosition, endStationPlusCode) {
    //     const origin = new google.maps.LatLng(meetingPoint.lat, meetingPoint.lng);
    //     const destinations = [
    //         new google.maps.LatLng(myLocation.lat, myLocation.lng),
    //         new google.maps.LatLng(busPosition.lat, busPosition.lng),
    //         geocodeLocation(endStationPlusCode) //new google.maps.LatLng(endStationLocation.lat, endStationLocation.lng)
    //     ];
    //     const service = new google.maps.DistanceMatrixService();

    //     return new Promise((resolve, reject) => {
    //         service.getDistanceMatrix({
    //             origins: [origin],
    //             destinations: destinations,
    //             travelMode: 'DRIVING'
    //         }, (response, status) => {
    //             if (status === 'OK') {
    //                 resolve({
    //                     meToMyLocation: {
    //                         distanceText: response.rows[0].elements[0].distance.text,
    //                         durationValue: response.rows[0].elements[0].duration.value
    //                     },
    //                     meToBusStop: {
    //                         distanceText: response.rows[0].elements[1].distance.text,
    //                         durationValue: response.rows[0].elements[1].duration.value
    //                     },
    //                     meToEndStation: {
    //                         distanceText: response.rows[0].elements[2].distance.text,
    //                         durationValue: response.rows[0].elements[2].duration.value
    //                     }
    //                 });
    //             } else {
    //                 reject(status);
    //             }
    //         });
    //     });
    // }

    // // Usage
    // getCurrentLocation().then(currentLocation => {
    //     calculateDistances(bus.meetingPoint, currentLocation, bus.busPosition, endStationLocation).then(distances => {
    //         console.log('done')
    //         // Use distances.meToMyLocation, distances.meToBusStop, distances.meToEndStation
    //         // to update your UI or perform other actions
    //     }).catch(error => {
    //         console.error('Failed to calculate distances:', error);
    //     });
    // }).catch(error => {
    //     console.error('Failed to get current location:', error);
    // });

    
    return { toBusStopRenderer, busPathRenderer, busLocationMarker, busLocationMarker, geocodeLocation }
}

function getCurrentLocation() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(position => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            }, error => {
                reject(error);
            });
        });

    }

export { displayBusRoute }

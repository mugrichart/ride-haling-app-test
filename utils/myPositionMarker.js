

function myPositionMarker(map, addMarker) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        var marker = addMarker(map, undefined, pos)

        
        google.maps.event.addListener(marker, 'dragend', function() {
          var newPos = marker.getPosition(); // The marker's new position
          alert('Marker dropped at latitude: ' + newPos.lat() + ', longitude: ' + newPos.lng());
          
        });

        return marker
  
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

export { myPositionMarker }
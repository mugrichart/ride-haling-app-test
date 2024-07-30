import { routes } from '../staged-db/staged-routes.js';
import { myPositionMarker } from './myPositionMarker.js';

import { displayBusRoute } from './displayBusRoute.js';
import { displayPotentialBuses } from './displayBuses.js';

const mapOptions = {
    zoom: 15,
    center: { lat: 5.689280, lng: -0.208920 },
    // styles: [
    //   // Hide all default POIs
    //   { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    //   // Subdued color for landscape
    //   { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
    //   // Subdued color for roads
    //   { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    //   // Hide road labels
    //   { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
    //   // Highlight transit routes
    //   { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#b4b4b4" }] },
    //   // Style for water
    //   { featureType: "water", elementType: "geometry", stylers: [{ color: "#d4e4eb" }] },
    // ],
    // disableDefaultUI: true, // Depending on the desired controls
    // // Other options...
  };


export { mapOptions, displayPotentialBuses, myPositionMarker, displayBusRoute, routes }
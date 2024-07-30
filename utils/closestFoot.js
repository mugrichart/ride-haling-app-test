function closestFoot(waypoints, myLocation) {
    let shortestDistance = Infinity;
    let closestFootLocation = null;

    for (let i = 0; i < waypoints.length - 1; i++) {
        let p1 = waypoints[i];
        let p2 = waypoints[i + 1];
        let A = myLocation.lat - p1.lat;
        let B = myLocation.lng - p1.lng;
        let C = p2.lat - p1.lat;
        let D = p2.lng - p1.lng;

        let dot = A * C + B * D;
        let len_sq = C * C + D * D;
        let param = dot / len_sq;

        let xx, yy;
        if (param < 0 || (p1.lat === p2.lat && p1.lng === p2.lng)) {
            xx = p1.lat;
            yy = p1.lng;
        } else if (param > 1) {
            xx = p2.lat;
            yy = p2.lng;
        } else {
            xx = p1.lat + param * C;
            yy = p1.lng + param * D;
        }

        let d = Math.sqrt(Math.pow(myLocation.lat - xx, 2) + Math.pow(myLocation.lng - yy, 2));
        if (d < shortestDistance) {
            shortestDistance = d;
            closestFootLocation = { lat: xx, lng: yy };
        }
    }

    if (closestFootLocation === null) {
        return null;
    }

    return { foot: closestFootLocation, distance: shortestDistance };
}

export { closestFoot };

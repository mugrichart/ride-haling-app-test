function updatePassengerStats(meToBusStop, busToBusStop, toDestination) {
    const distanceSpans = document.querySelectorAll('.distance span');
    const arrivalSpans = document.querySelectorAll('.arrival span');

    // Get the current time in milliseconds
    const currentTime = Date.now();

    // Convert the duration to milliseconds and add it to the current time
    const busArrivalTime = currentTime + (busToBusStop.durationValue * 1000);
    const meArrivalTime = currentTime + (meToBusStop.durationValue * 1000);
    const destArrivalTime = currentTime + (toDestination.durationValue * 1000);

    // Format the arrival times
    const formatTime = (timeInMillis) => {
        const date = new Date(timeInMillis);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    };

    // Fill the first row (distance and arrival) with values from busToBusStop
    distanceSpans[0].textContent = busToBusStop.distanceText;
    arrivalSpans[0].textContent = formatTime(busArrivalTime);

    // Fill the second row with values from meToBusStop
    distanceSpans[1].textContent = meToBusStop.distanceText;
    arrivalSpans[1].textContent = formatTime(meArrivalTime);

    // Fill the last row with values from toDestination
    distanceSpans[2].textContent = toDestination.distanceText;
    arrivalSpans[2].textContent = formatTime(destArrivalTime);

    // Calculate the time difference between meArrivalTime and busArrivalTime in minutes
    const timeDiff = (meArrivalTime - busArrivalTime) / 1000 / 60;

    // Determine the color based on the time difference
    let color = '';
    if (timeDiff < 0) {
        color = '#5fec06'; // Me will arrive earlier than the bus
    } else if (timeDiff < 2) {
        color = 'yellow'; // Me will arrive within 2 minutes of the bus
        // Start beeping to alert the user
        beep();
        // Continuously pop out and in to alert
        setInterval(() => {
            arrivalSpans[1].classList.toggle('pop');
        }, 10000);
    } else {
        color = 'red'; // Me will arrive 2 minutes or more after the bus
    }

    // Apply the color to the arrival span for meToBusStop
    arrivalSpans[1].style.color = color;

    // Apply the 'pop' class to trigger the animation
    distanceSpans.forEach(span => {
        span.classList.add('pop');
    });
    arrivalSpans.forEach(span => {
        span.classList.add('pop');
    });

    // Remove the 'pop' class after the animation ends
    setTimeout(() => {
        distanceSpans.forEach(span => {
            span.classList.remove('pop');
        });
        arrivalSpans.forEach(span => {
            span.classList.remove('pop');
        });
    }, 1000); // Remove the class after 1 second
}

// Function to play the a sound
function beep() {
    const beepSound = document.getElementById('beepSound');
    if (beepSound) {
        beepSound.play();
    }
}


export { updatePassengerStats };

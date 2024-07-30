
let eventTime = new Date('2024-04-10T00:00:00Z'); // Example event time
let currentTime = new Date();
let timeDifference = currentTime - eventTime; // Time difference in milliseconds

async function trackingBus(busId, userPosition, routeId, endpoint) {
  const url = `${endpoint}/bus`;
  console.log(routeId)
  try {
      console.log(userPosition)
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ busId, userPosition, routeId, userId: timeDifference })
      });

      if (!response.ok) {
          throw new Error('Failed to fetch buses');
      }

      const buses = await response.json();
      return buses;
  } catch (error) {
      console.error('Error fetching buses:', error);
      throw error;
  }
}


export { trackingBus }
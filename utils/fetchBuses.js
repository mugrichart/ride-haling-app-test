
async function fetchBuses(routeId, endpoint) {
    const url = `${endpoint}/buses/${routeId}`;
    
    try {
      const response = await fetch(url);
      const buses = await response.json();
      return buses;
    } catch (error) {
      console.error('Error fetching buses:', error);
      throw error;
    }
}

export { fetchBuses }
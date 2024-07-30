async function fetchRoutes(endpoint) {
    const url = `${endpoint}/routes`; // Assumes the Express server is running on the same host and port as the frontend

    try {
      const response = await fetch(url);
      const routes = await response.json();
      return routes
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
}


export {fetchRoutes}
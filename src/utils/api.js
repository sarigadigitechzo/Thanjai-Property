// api.js - Centralized fetch wrapper for Node.js backend

// api.js - Centralized fetch wrapper for Node.js backend

// Since cPanel Node.js is broken, we run the backend locally but it points to the LIVE MySQL DB.
// This allows full local development with live data!
const API_BASE_URL = '/api.php/';

export async function fetchFromAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
}

// api.js - Centralized fetch wrapper for Node.js backend

// api.js - Centralized fetch wrapper for Node.js backend

// Automatically use the live server database when running locally for testing.
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'https://thanjaiproperty.com/api.php'
  : '/api.php';

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

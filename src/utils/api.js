// api.js - Centralized fetch wrapper for Node.js backend

// api.js - Centralized fetch wrapper for Node.js backend

// Automatically use the live server database when running locally for testing.
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'https://thanjaiproperty.com/api.php'
  : '/api.php';

export async function fetchFromAPI(endpoint, options = {}) {
  try {
    const isGet = !options.method || options.method === 'GET';
    const cacheBuster = isGet ? (endpoint.includes('?') ? `&t=${Date.now()}` : `?t=${Date.now()}`) : '';
    
    const response = await fetch(`${API_BASE_URL}${endpoint}${cacheBuster}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    
    if (!response.ok) {
      let errorMsg = `API error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.error) errorMsg = errorData.error;
      } catch (e) {}
      throw new Error(errorMsg);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
}

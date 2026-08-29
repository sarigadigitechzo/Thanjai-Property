// api.js - Centralized fetch wrapper for PHP backend

// Automatically use the live server database when running locally for testing.
const API_BASE_URL = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  ? 'https://thanjaiproperty.com/api.php'
  : (typeof window !== 'undefined' ? '/api.php' : 'https://thanjaiproperty.com/api.php');

export async function fetchFromAPI(endpoint, options = {}) {
  try {
    const method = options.method || 'GET';
    const isGet = method === 'GET';

    // Convert path-style endpoint to query parameters for reliable server routing.
    // e.g. /leads/L-123  →  ?resource=leads&id=L-123
    // This avoids .htaccess SPA-redirect intercepting path-info requests.
    let url = API_BASE_URL;
    const parts = endpoint.replace(/^\//, '').split('/').filter(Boolean);
    if (parts.length > 0) {
      const params = new URLSearchParams();
      params.set('resource', parts[0]);
      if (parts[1]) params.set('id', parts[1]);
      if (isGet) params.set('t', Date.now()); // cache buster for GETs
      url += '?' + params.toString();
    } else if (isGet) {
      url += `?t=${Date.now()}`;
    }

    const response = await fetch(url, {
      method,
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

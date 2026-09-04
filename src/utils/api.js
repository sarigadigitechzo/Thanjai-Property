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
    // e.g. /leads?stats=1 →  ?resource=leads&stats=1
    // This avoids .htaccess SPA-redirect intercepting path-info requests.
    let url = API_BASE_URL;
    const [pathPart, queryPart] = endpoint.replace(/^\//, '').split('?');
    const parts = pathPart ? pathPart.split('/').filter(Boolean) : [];
    const params = new URLSearchParams(queryPart || '');

    if (parts.length > 0) {
      if (!params.has('resource')) params.set('resource', parts[0]);
      if (parts[1] && !params.has('id')) params.set('id', parts[1]);
    }
    if (isGet && !params.has('t')) {
      params.set('t', Date.now().toString()); // cache buster for GETs
    }
    const queryString = params.toString();
    if (queryString) {
      url += '?' + queryString;
    }
    let body = options.body;
    if (!isGet && !body) {
      const { method: _m, headers: _h, ...payload } = options;
      if (Object.keys(payload).length > 0) {
        body = JSON.stringify(payload);
      }
    } else if (typeof body === 'object' && body !== null) {
      body = JSON.stringify(body);
    }

    const response = await fetch(url, {
      method,
      ...options,
      body,
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

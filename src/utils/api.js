// api.js - Centralized fetch wrapper for PHP backend with resilient master relay fallback

const MASTER_API_URL = 'https://thanjaiproperty.com/backend/api.php';

const PRIMARY_API_BASE_URL = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  ? MASTER_API_URL
  : (typeof window !== 'undefined' ? '/backend/api.php' : MASTER_API_URL);

function buildApiUrl(baseUrl, endpoint, isGet) {
  let url = baseUrl;
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
  return url;
}

export async function fetchFromAPI(endpoint, options = {}) {
  const method = options.method || 'GET';
  const isGet = method === 'GET';

  let body = options.body;
  if (!isGet && !body) {
    const { method: _m, headers: _h, ...payload } = options;
    if (Object.keys(payload).length > 0) {
      body = JSON.stringify(payload);
    }
  } else if (typeof body === 'object' && body !== null) {
    body = JSON.stringify(body);
  }

  const fetchOptions = {
    method,
    ...options,
    body,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  };

  const primaryUrl = buildApiUrl(PRIMARY_API_BASE_URL, endpoint, isGet);

  try {
    const response = await fetch(primaryUrl, fetchOptions);

    if (!response.ok) {
      let errorMsg = `API error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.error) errorMsg = errorData.error;
      } catch (e) {}

      // If primary relative endpoint fails on production host (e.g. 404 or 500), try master fallback
      if (PRIMARY_API_BASE_URL !== MASTER_API_URL) {
        console.warn(`Primary API call failed (${errorMsg}), attempting master relay fallback...`);
        const fallbackUrl = buildApiUrl(MASTER_API_URL, endpoint, isGet);
        const fallbackRes = await fetch(fallbackUrl, fetchOptions);
        if (fallbackRes.ok) {
          return await fallbackRes.json();
        }
      }
      throw new Error(errorMsg);
    }

    return await response.json();
  } catch (error) {
    // If network error occurred on primary URL and it wasn't the master URL, attempt fallback
    if (PRIMARY_API_BASE_URL !== MASTER_API_URL) {
      try {
        console.warn('Network error on primary API, attempting master relay fallback...', error);
        const fallbackUrl = buildApiUrl(MASTER_API_URL, endpoint, isGet);
        const fallbackRes = await fetch(fallbackUrl, fetchOptions);
        if (fallbackRes.ok) {
          return await fallbackRes.json();
        }
      } catch (fallbackErr) {
        console.error('Master relay fallback also failed:', fallbackErr);
      }
    }
    console.error('API Fetch Error:', error);
    throw error;
  }
}

// Small helper around fetch(). It adds the JWT token and returns JSON.
const BASE = '/api';

async function request(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = {};
  try {
    data = await res.json();
  } catch (e) {
    /* empty response */
  }
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  del: (path) => request(path, { method: 'DELETE' }),
};

// Shows 4500000 as "₹ 45,00,000"
export const formatPrice = (value, listingType) =>
  `₹ ${Number(value).toLocaleString('en-IN')}${listingType === 'rent' ? ' / month' : ''}`;

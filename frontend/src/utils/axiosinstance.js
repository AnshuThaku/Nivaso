import axios from 'axios';

// Initialize Guest ID
const getOrCreateGuestId = () => {
  let guestId = localStorage.getItem('guestId');
  if (!guestId) {
    guestId = crypto.randomUUID(); // Native browser UUID generation
    localStorage.setItem('guestId', guestId);
  }
  return guestId;
};

// Create Global Axios Instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // For JWT cookies
});

// Request Interceptor: Automatically attach Guest ID
api.interceptors.request.use((config) => {
  config.headers['guest-id'] = getOrCreateGuestId();
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
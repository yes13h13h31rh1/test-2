import axios from 'axios';

// For production on Render.com, use relative URLs if API_URL is not set
// When frontend is served from backend, use relative paths
const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.PROD ? '/api' : 'http://localhost:3001'
);

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;

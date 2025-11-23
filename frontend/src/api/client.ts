import axios from 'axios';

// For production on Render.com, use relative URLs if API_URL is not set
// This allows the frontend to work with Render's static site + backend routing
const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.PROD ? '' : 'http://localhost:3001'
);

const client = axios.create({
  baseURL: API_URL || '/api', // Use relative path in production if not specified
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;

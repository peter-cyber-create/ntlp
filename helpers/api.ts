import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_API_URL_PROD || 'https://conference.health.go.ug/api'
    : process.env.NEXT_PUBLIC_API_URL_DEV || 'http://localhost:5000/api'
});

export default API;

import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 
  'http://localhost:3000' : import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

export {instance};
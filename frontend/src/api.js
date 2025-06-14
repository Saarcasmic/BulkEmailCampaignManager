// src/api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + '/api';

const api = axios.create({
  baseURL: API_URL,
  // withCredentials: true, // if you use cookies/auth
});

// Add this interceptor:
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log("Hai token", token);
  if (token) {
    console.log("Hai token idhar bhi");
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
// src/utils/AxiosSetup.ts
import axios from "axios";

// Single place that decides which backend every axios call talks to.
// - On Vercel: set VITE_API_URL to your Render URL (no trailing slash).
// - Locally: falls back to http://localhost:1086.
export const API_URL: string =
  import.meta.env.VITE_API_URL ?? "http://localhost:1086";

export const AxiosSetup = () => {
  axios.defaults.baseURL = API_URL;

  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // use the key your login page stores it under
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

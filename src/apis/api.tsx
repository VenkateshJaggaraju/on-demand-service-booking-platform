import axios from "axios";
import { API_URL } from "../utils/AxiosSetup";

export const api = axios.create({
  baseURL: API_URL,
});

// Attach the JWT (stored by ServiceProviderLogin, CustomerLogin, etc.)
// to every outgoing request, if one exists.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

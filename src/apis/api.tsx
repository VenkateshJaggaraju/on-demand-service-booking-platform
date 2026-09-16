import axios from "axios";
 
export const api = axios.create({
  baseURL: "http://localhost:1086",
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
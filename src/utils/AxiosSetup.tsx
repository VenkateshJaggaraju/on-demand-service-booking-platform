// src/utils/axiosSetup.ts
import axios from "axios";


export const AxiosSetup = () => {
    axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // use the key your login page stores it under
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
}
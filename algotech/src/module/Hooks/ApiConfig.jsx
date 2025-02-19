import axios from "axios";

const URL_API = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: URL_API,
  headers: {
    Accept: "application/json",
  },
});

export default api;

import axios from "axios";

// intance of axios:
export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: true, //because we are using cookies , if we dont use this then it will not store the cookies
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

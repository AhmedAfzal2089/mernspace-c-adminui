import axios from "axios";
import { useAuthStore } from "../store";
import { AUTH_SERVICE } from "./api";

// intance of axios:
export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: true, //because we are using cookies , if we dont use this then it will not store the cookies
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// this interceptors have 2 functions , one is for response and second one gives us the error

const refreshToken = async () => {
  await axios.post(
    `${import.meta.env.VITE_BACKEND_API_URL}${AUTH_SERVICE}/auth/refresh`,
    {}, //sending nothing in the body
    {
      withCredentials: true,
    }
  );
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // axios store error on the config object of the orignal request
    const orignalRequest = error.config;
    if (error.response.status === 401 && !orignalRequest._isRetry) {
      try {
        // it will go in an infinite loop if we dont true isRetry
        orignalRequest._isRetry = true;
        const headers = { ...orignalRequest.headers };
        await refreshToken();
        return api.request({ ...orignalRequest, headers });
      } catch (err) {
        console.error("Token Refresh Error ", err);
        useAuthStore.getState().logout();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

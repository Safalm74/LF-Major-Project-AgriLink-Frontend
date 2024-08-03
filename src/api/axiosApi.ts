import axios from "axios";
import { backendServerURL } from "../constants";
import { refreshAccessToken } from "./auth";
import { errorHandler } from "../utils/errorHandler";
import { logOut } from "../utils/logOut";
import toast from "../components/toast";

const api = axios.create({
  baseURL: backendServerURL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { accessToken } = await refreshAccessToken();

        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (error) {
        logOut();

        toast("Please login again", "error");
      }
    } else {
      errorHandler(error.response);
    }

    return Promise.reject(error);
  }
);

export default api;

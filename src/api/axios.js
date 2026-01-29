import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:7010/api",
  timeout: 10000,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token6163");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Let axios handle content-type automatically
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized – token invalid or expired");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor — unwrap { success, data, message } envelope
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Normalize error message
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    // Attach normalized message to error
    error.message = message;
    return Promise.reject(error);
  },
);

export default api;

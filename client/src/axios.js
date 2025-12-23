// client/src/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  // timeout: 10000,
});

// Request interceptor — localStorage se token leke headers set karega
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token && token !== "false") {
        // backend tumhara pehle 'token' header expect karta tha, isliye dono set kar dete hain
        config.headers["token"] = token;
        // common practice — Authorization Bearer bhi set kar do (backend ignore karega agar use na kare)
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        // agar token missing ya string "false" ho to header delete kar do
        delete config.headers["token"];
        delete config.headers["Authorization"];
      }
    } catch (e) {
      console.warn("axios interceptor read token error:", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: response interceptor for global errors (not required, but useful)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // you can handle 401 globally here if you want
    return Promise.reject(err);
  }
);

export default api;

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000", // 🔥 SHUNI O‘ZGARTIRDIK
});

// 🔐 TOKEN avtomatik qo‘shiladi
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
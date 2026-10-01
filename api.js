import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/sleep"
});

// helper to fetch with optional filters
export const fetchWithFilter = (params) => API.get("/", { params });

export const deleteRecord = (id) => API.delete(`/${id}`);

export const updateRecord = (id, data) => API.put(`/${id}`, data);

export const clearAll = () => API.delete("/");

export default API;
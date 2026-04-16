import axios from "axios";

 export const baseURL = "https://localhost:7245";
//export const baseURL = 'http://rtca-e-monitoring-web-api.runasp.net';
const axiosInstance = axios.create({
  baseURL: baseURL + "/api/",
  timeout: 30000,
  withCredentials: true,
  headers: { "X-Custom-Header": "foobar" },
});

export default axiosInstance;

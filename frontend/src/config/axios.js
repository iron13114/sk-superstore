import axios from 'axios'

const BASE_URL = process.env.REACT_APP_BASE_URL || "https://your-backend-service.onrender.com";

console.log("BASE URL:", BASE_URL);
export const axiosi=axios.create({withCredentials:true,baseURL:process.env.REACT_APP_BASE_URL})

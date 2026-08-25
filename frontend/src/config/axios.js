import axios from 'axios'

export const axiosi=axios.create({withCredentials:true,baseURL:import.meta.env.VITE_BASE_URL})

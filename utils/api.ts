import axios from "axios"

const API_URL = "http://localhost:3000"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Set token globally
export const setAuthHeaders = (token: string) => {
  localStorage.setItem("token", token)
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

export const clearAuthHeaders = () => {
  localStorage.removeItem("token")
  delete api.defaults.headers.common["Authorization"]
}

export default api

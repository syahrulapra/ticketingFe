import axios from "axios"
import { useAuth } from "../auth/auth"

export const BASE_URL = "https://ticketing.api.syahrulap.my.id/"

export default axios.create({
  baseURL: BASE_URL
})

export function useApi() {
  const { authUser } = useAuth()
  const token = authUser?.token || localStorage.getItem("access_token")

  if (token) {
    localStorage.setItem("access_token", token)
  }

  const getUrl = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return getUrl
}
import { useQuery } from "@tanstack/react-query"
import { useApi } from "./axios"

export function useUser() {
  const api = useApi()
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await api.get("/auth/user")
      return data
    },
  })
}
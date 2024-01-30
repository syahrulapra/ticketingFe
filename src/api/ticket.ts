import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { BASE_URL, useApi } from "./axios"
import { Params, ITicket, TicketInput } from "./types"


export function useDetailTicket(id: Params['id']) {
  const api = useApi()
  return useQuery({
    queryKey: ["detailTickets", id],
    queryFn: async () => {
      // await new Promise(resolve => setTimeout(resolve, 1000))
      const { data } = await api.get(`/auth/ticket/${id}`)
      return data.tickets
    },
  })
}

export function useDetailAnsweredTicket(id: Params['id']) {
  const api = useApi()
  return useQuery({
    queryKey: ["DetailTicketAnswered", id],
    queryFn: async () => {
      const { data } = await api.get(`/auth/ticket/answered/${id}`)
      return data.tickets
    },
  })
}

export function useTicket(page: number, size: number = 10) {
  const api = useApi()
  return useQuery({
    queryKey: ["tickets", page, size],
    queryFn: async () => {
      const { data } = await api.get(`/auth/ticket?page=` + page + `&size=` + size)
      return data.tickets
    },
    placeholderData: keepPreviousData,
  })
}

export function useTicketAnswered(page: number, size: number = 10) {
  const api = useApi()
  return useQuery({
    queryKey: ["ticketanswered", page, size],
    queryFn: async () => {
      const { data } = await api.get(`/auth/ticket/answered/?page=` + page + `&size=` + size)
      return data.tickets
    },
    placeholderData: keepPreviousData,
  })
}

export function useCreateTicket() {
  const api = useApi()
  return async function createTicket(ticket: TicketInput): Promise<ITicket> {
    return api.post(`${BASE_URL}auth/ticket`, ticket)
  }
}

export function useCreateTicketAnswered(number: Params['number']) {
  const api = useApi()
  return async function createTicketAnswered(ticket: Omit<TicketInput, 'subject' | 'priority'>): Promise<ITicket> {
    return api.post(`${BASE_URL}auth/ticket/answer/${number}`, ticket)
  }
}


export function useCloseTicket() {
  const api = useApi()
  return async function closeTicket(number: Params['number']) {
    return api.put(`${BASE_URL}auth/ticket/close/${number}`)
  }
}

export function useDeleteTicket() {
  const api = useApi()
  return async function deleteTicket(id: Params['id']) {
    return api.delete(`${BASE_URL}auth/ticket/delete/${id}`)
  }
}
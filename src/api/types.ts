export type User = {
  _id: string
  name: string
  email: string
  role: string
  __v: number
  token: string
}

export type Role = {
  Admin: "Admin",
  User: "User"
}

export type LoginInput = {
  email: string
  password: string
}

export type RegisterInput = {
  username: string
  email: string
  password: string
}

export type ITicket = {
  _id: string
  ticketNumber: string
  subject: string
  message: string
  priority: string
  status: string
  __v: number
}

export type TicketInput = {
  subject: string
  message: string
  priority: string
}

export type TicketAnswered = {
  _id: string
  message: string
  tickets: ITicket
  __v: number
}

export type Priority = "Low" | "Medium" | "High"

export type Response = {
  data: User
}

export type Params = {
  id: string
  number: string
  index: number
  ticket: string
}
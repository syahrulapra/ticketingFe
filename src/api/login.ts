import { BASE_URL, useApi } from "./axios"
import { LoginInput, RegisterInput, Response } from "./types"


export function useLogin() {
	const api = useApi()

	return async function login(user: LoginInput): Promise<Response> {
		return api.post(`${BASE_URL}login`, user)
	}
}

export function useRegister() {
	const api = useApi()

	return async function register(user: RegisterInput): Promise<Response> {
		return api.post(`${BASE_URL}register`, user)
	}
}
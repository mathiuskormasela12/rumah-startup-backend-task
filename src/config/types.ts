// ========== Types
export type ResponseType = {
	message: string,
	success: boolean,
	status: number,
	results?: any
	pageInfo?: {
		totalPages: number,
		currentPages: number,
		nextPage?: string,
		previousPage?: string
	}
}

export type ResultsType = {
	length: number
}

export type RegisterBody = {
	email: string,
	fullName: string,
	password: string
}

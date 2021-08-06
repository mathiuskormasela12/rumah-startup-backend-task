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

export type RegisterBody = {
	email: string,
	fullName: string,
	password: string
}

export type UploadPhoto = {
	message: string,
	success: boolean,
	status: number,
	photo?: string
}

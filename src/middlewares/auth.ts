// =========== Auth Middleware
// import all modules
import { Request, Response, NextFunction } from 'express'
import response from '../helpers/response'

export const checkRegisterBody = (req: Request, res: Response, next: NextFunction) => {
	const body = ['email', 'password', 'full_name']
	let isFilled = ''

	body.forEach(item => {
		if (!req.body[item]) {
			isFilled += String(false)
		} else {
			isFilled += String(true)
		}
	})

	if (isFilled.includes('false')) {
		return response(req, res, "Form can't be empty", 400, false)
	}

	return next()
}

export const isPasswordCorrect = (req: Request, res: Response, next: NextFunction) => {
	if (!req.body.password.match(/\d/g) || !req.body.password.match(/[A-Z]/g) || !req.body.password.match(/[a-z]/g) || !req.body.password.match(/[^a-z]/g) || !req.body.password.match(/[^abcdefghijklmnopqrstucwxyz0123456789]/gi)) {
		return response(req, res, 'Password must be include uppercase, lowercase, number', 400, false)
	}

	return next()
}

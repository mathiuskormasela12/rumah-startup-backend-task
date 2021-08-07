// =========== Auth Middleware
// import all modules
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import response from '../helpers/response'
import isFormFill from '../helpers/isFormFill'
import config from '../config'

export const checkRegisterBody = (req: Request, res: Response, next: NextFunction) => {
	const body = ['email', 'password', 'full_name']

	if (!isFormFill(body, req.body)) {
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

export const checkLoginBody = (req: Request, res: Response, next: NextFunction) => {
	const body = ['email', 'password']

	if (!isFormFill(body, req.body)) {
		return response(req, res, "Form can't be empty", 400, false)
	}

	return next()
}

export const isLogin = (req: Request, res: Response, next: NextFunction) => {
	const token: string | undefined = req.headers.authorization

	if (token) {
		jwt.verify(token, String(config.secret_key), (err: any) => {
			if (err) {
				return response(req, res, err.message, 400, false)
			} else {
				return next()
			}
		})
	} else {
		return response(req, res, 'Forbidden', 400, false)
	}
}

export const checkEditUserBody = (req: Request, res: Response, next: NextFunction) => {
	const body = ['email', 'full_name']

	if (!isFormFill(body, req.body)) {
		return response(req, res, "Form can't be empty", 400, false)
	}

	return next()
}

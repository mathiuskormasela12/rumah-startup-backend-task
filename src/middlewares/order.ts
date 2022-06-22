
// =========== Order Middleware
// import all modules
import { Request, Response, NextFunction } from 'express'
import response from '../helpers/response'
import isFormFill from '../helpers/isFormFill'

export const checkAddOrderBody = (req: Request, res: Response, next: NextFunction) => {
	const body = ['order_name']

	if (!isFormFill(body, req.body)) {
		return response(req, res, "Form can't be empty", 400, false)
	}

	return next()
}

// =========== Major Middleware
// import all modules
import { Request, Response, NextFunction } from 'express'
import response from '../helpers/response'
import isFormFill from '../helpers/isFormFill'

export const checkAddMajorBody = (req: Request, res: Response, next: NextFunction) => {
	const body = ['major_name', 'major_description']

	if (!isFormFill(body, req.body)) {
		return response(req, res, "Form can't be empty", 400, false)
	}

	return next()
}

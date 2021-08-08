// =========== Auth Middleware
// import all modules
import { Request, Response, NextFunction } from 'express'
import response from '../helpers/response'
import isFormFill from '../helpers/isFormFill'

export const checkAddStudentBody = (req: Request, res: Response, next: NextFunction) => {
	const body = ['student_name', 'nisn', 'class', 'major', 'birth_place', 'birthday', 'email']

	if (!isFormFill(body, req.body)) {
		return response(req, res, "Form can't be empty", 400, false)
	}

	return next()
}

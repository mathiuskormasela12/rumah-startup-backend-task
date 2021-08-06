// ========== Auth Controller
// import all modules
import { Request, Response } from 'express'
import { ResultsType, RegisterBody } from '../config/types'
import bcrypt from 'bcryptjs'

// import all helpers
import response from '../helpers/response'

// import models
import users from '../models/User'

namespace AuthControllerModule {
	export class Auth {
		public static async register (req: Request, res: Response): Promise<Response> {
			try {
				const results: ResultsType = await users.findAll(req.body.email)

				if (results.length > 0) {
					return response(req, res, 'Email already in used', 400, false)
				} else {
					try {
						try {
							const hashed = await bcrypt.hash(req.body.password, 8)
							const data: RegisterBody = {
								email: req.body.email,
								fullName: req.body.full_name,
								password: hashed
							}
							await users.create(data)
							return response(req, res, 'Register successfully', 200, true, { ...req.body, password: hashed })
						} catch (err) {
							console.log(err)
							return response(req, res, err.message, 500, false)
						}
					} catch (err) {
						console.log(err)
						return response(req, res, err.message, 500, false)
					}
				}
			} catch (err) {
				console.log(err)
				return response(req, res, err.message, 500, false)
			}
		}
	}
}
export default AuthControllerModule

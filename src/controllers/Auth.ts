// ========== Auth Controller
// import all modules
import { Request, Response } from 'express'
import { RegisterBody } from '../config/types'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../config'

// import all helpers
import response from '../helpers/response'

// import models
import users from '../models/User'

namespace AuthControllerModule {
	export class Auth {
		public static async register (req: Request, res: Response): Promise<Response> {
			try {
				const results: any = await users.findAll({
					email: req.body.email
				})

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

		public static async login (req: Request, res: Response): Promise<Response> {
			try {
				const results: any = await users.findAll({
					email: req.body.email
				})
				try {
					if (results.length < 1 || !(await bcrypt.compare(req.body.password, results[0].password))) {
						return response(req, res, 'Wrong email or password', 400, false)
					} else {
						const token = jwt.sign({ id: results[0].id || '' }, config.secret_key || '', {
							expiresIn: '1h'
						})

						return response(req, res, 'Login successfully', 200, true, {
							token
						})
					}
				} catch (err) {
					console.log(err)
					return response(req, res, err.message, 500, false)
				}
			} catch (err) {
				console.log(err)
				return response(req, res, err.message, 500, false)
			}
		}
	}
}
export default AuthControllerModule

// ========== Major Controller
// import all modules
import { Request, Response } from 'express'

// import all helpers
import response from '../helpers/response'

// import models
import majorModel from '../models/Major'

namespace MajorControllerModule {
	export class Major {
		public static async addMajor (req: Request, res: Response): Promise<Response> {
			try {
				const isExist: any = await majorModel.findAll({
					major_name: req.body.major_name,
					major_description: req.body.major_descripton
				}, 'OR')

				if (isExist.length > 0) {
					return response(req, res, 'The major is available', 400, false)
				} else {
					try {
						const results: any = await majorModel.create({
							major_name: req.body.major_name,
							major_description: req.body.major_description
						})
						return response(req, res, 'Successfully to add new major', 200, true, {
							id: results.insertId,
							...req.body
						})
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

		public static async getAllMajors (req: Request, res: Response): Promise<Response> {
			try {
				const isExist: any = await majorModel.findAll()

				if (isExist.length < 1) {
					return response(req, res, 'The major are unavailable', 400, false)
				} else {
					return response(req, res, 'Successfully to get all majors', 200, true, isExist)
				}
			} catch (err) {
				console.log(err)
				return response(req, res, err.message, 500, false)
			}
		}
	}
}
export default MajorControllerModule

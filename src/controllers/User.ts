// ========== User Controller
// import all modules
import { Request, Response } from 'express'

// import all helpers
import response from '../helpers/response'
import uploads from '../helpers/upload'

// import models
import userModel from '../models/User'

namespace UserControllerModule {
	export class User {
		public static async upload (req: Request, res: Response): Promise<Response> {
			try {
				const results: any = await userModel.findAll({
					id: req.params.id
				})

				if (results.length < 1) {
					return response(req, res, 'Unknown user id', 400, false)
				} else {
					const photo = uploads(req, `/photos/admins/${results[0].full_name.toLowerCase().split(' ').join('_')}/`)
					try {
						await userModel.update({
							photo: photo.photo
						})
						return response(req, res, photo.message, photo.status, photo.success, {
							photo: photo.photo
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
	}
}
export default UserControllerModule

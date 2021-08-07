// ========== User Controller
// import all modules
import { Request, Response } from 'express'
import deleteFile from '../helpers/deleteFile'

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
					return response(req, res, 'Unknown user', 400, false)
				} else {
					const photo = uploads(req, '/photos/admins/')
					try {
						await userModel.update({
							photo: photo.photo
						}, {
							id: req.params.id
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

		public static async deleteUser (req: Request, res: Response): Promise<Response> {
			const {
				id
			} = req.params

			try {
				const isExist: any = await userModel.findAll({ id })

				if (isExist.length > 0) {
					try {
						await userModel.delete({ id })
						if (isExist[0].photo !== 'nophoto.png') {
							try {
								await deleteFile(`/photos/admins/${isExist[0].photo}`)
								return response(req, res, 'User has been deleted', 200, true, {
									full_name: isExist[0].full_name,
									email: isExist[0].email
								})
							} catch (err) {
								console.log(err)
								return response(req, res, err.message, 500, false)
							}
						} else {
							return response(req, res, 'User has been deleted', 200, true, {
								full_name: isExist[0].full_name,
								email: isExist[0].email
							})
						}
					} catch (err) {
						console.log(err)
						return response(req, res, err.message, 500, false)
					}
				} else {
					return response(req, res, 'Unknown user', 400, false)
				}
			} catch (err) {
				console.log(err)
				return response(req, res, err.message, 500, false)
			}
		}
	}
}
export default UserControllerModule

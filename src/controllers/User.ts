// ========== User Controller
// import all modules
import { Request, Response } from 'express'
import config from '../config'
import deleteFile from '../helpers/deleteFile'
import bcrypt from 'bcryptjs'

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

		public static async getUserById (req: Request, res: Response): Promise<Response> {
			try {
				const results: any = await userModel.findAll({
					id: req.params.id
				})

				if (results.length < 1) {
					return response(req, res, 'Empty user', 400, false)
				} else {
					const data: any = {
						id: Number(results[0].id),
						full_name: results[0].full_name,
						email: results[0].email,
						photo: `${config.public_url}/photos/admins/${results[0].photo}`
					}
					return response(req, res, `Successfully to get user by id ${req.params.id}`, 200, true, data)
				}
			} catch (err) {
				console.log(err)
				return response(req, res, err.message, 500, false)
			}
		}

		public static async editUserById (req: Request, res: Response): Promise<Response> {
			try {
				const results: any = await userModel.findAll({
					id: req.params.id
				})

				if (results.length < 1) {
					return response(req, res, 'Unkown user', 400, false)
				} else {
					if (req.files) {
						const upload = uploads(req, '/photos/admins/')
						if (upload.success) {
							req.body.photo = upload.photo
						} else {
							return response(req, res, upload.message, upload.status, upload.success)
						}
					} else {
						req.body.photo = results[0].photo
					}

					if (req.body.new_password && req.body.repeat_password && req.body.old_password) {
						try {
							if (!(await bcrypt.compare(req.body.old_password, results[0].password))) {
								if (req.files) {
									try {
										await deleteFile(`/photos/admins/${req.body.photo}`)
										return response(req, res, 'Wrong password', 400, false)
									} catch (err) {
										return response(req, res, err.message, 500, false)
									}
								} else {
									return response(req, res, 'Wrong password', 400, false)
								}
							} else {
								if (!req.body.new_password.match(/\d/g) || !req.body.new_password.match(/[A-Z]/g) || !req.body.new_password.match(/[a-z]/g) || !req.body.new_password.match(/[^a-z]/g) || !req.body.new_password.match(/[^abcdefghijklmnopqrstucwxyz0123456789]/gi)) {
									if (req.files) {
										try {
											await deleteFile(`/photos/admins/${req.body.photo}`)
											return response(req, res, 'New password must be include uppercase, lowercase, number', 400, false)
										} catch (err) {
											return response(req, res, err.message, 500, false)
										}
									} else {
										return response(req, res, 'New password must be include uppercase, lowercase, number', 400, false)
									}
								} else if (!req.body.repeat_password.match(/\d/g) || !req.body.repeat_password.match(/[A-Z]/g) || !req.body.repeat_password.match(/[a-z]/g) || !req.body.repeat_password.match(/[^a-z]/g) || !req.body.repeat_password.match(/[^abcdefghijklmnopqrstucwxyz0123456789]/gi)) {
									if (req.files) {
										try {
											await deleteFile(`/photos/admins/${req.body.photo}`)
											return response(req, res, 'Repeat password must be include uppercase, lowercase, number', 400, false)
										} catch (err) {
											return response(req, res, err.message, 500, false)
										}
									} else {
										return response(req, res, 'Repeat password must be include uppercase, lowercase, number', 400, false)
									}
								} else if (req.body.new_password !== req.body.repeat_password) {
									if (req.files) {
										try {
											await deleteFile(`/photos/admins/${req.body.photo}`)
											return response(req, res, "Password doesn't match", 400, false)
										} catch (err) {
											return response(req, res, err.message, 500, false)
										}
									} else {
										return response(req, res, "Password doesn't match", 400, false)
									}
								} else {
									try {
										const hash = await bcrypt.hash(req.body.new_password, 8)
										try {
											await userModel.update({
												full_name: req.body.full_name,
												email: req.body.email,
												password: hash,
												photo: req.body.photo
											}, { id: req.params.id })
											if (results[0].photo !== 'nophoto.png' && req.files) {
												try {
													await deleteFile(`/photos/admins/${results[0].photo}`)
													return response(req, res, 'User has been edited', 200, true, {
														full_name: req.body.full_name,
														email: req.body.email,
														photo: `${config.public_url}/photos/admins/${req.body.photo}`
													})
												} catch (err) {
													return response(req, res, err.message, 500, false)
												}
											} else {
												return response(req, res, 'User has been edited', 200, true, {
													full_name: req.body.full_name,
													email: req.body.email,
													photo: `${config.public_url}/photos/admins/${req.body.photo}`
												})
											}
										} catch (err) {
											return response(req, res, err.message, 500, false)
										}
									} catch (err) {
										return response(req, res, err.message, 500, false)
									}
								}
							}
						} catch (err) {
							return response(req, res, err.message, 500, false)
						}
					} else {
						try {
							await userModel.update({
								full_name: req.body.full_name,
								email: req.body.email,
								photo: req.body.photo
							}, { id: req.params.id })
							if (results[0].photo !== 'nophoto.png' && req.files) {
								try {
									await deleteFile(`/photos/admins/${results[0].photo}`)
									return response(req, res, 'User has been edited', 200, true, {
										full_name: req.body.full_name,
										email: req.body.email,
										photo: `${config.public_url}/photos/admins/${req.body.photo}`
									})
								} catch (err) {
									return response(req, res, err.message, 500, false)
								}
							} else {
								return response(req, res, 'User has been edited', 200, true, {
									full_name: req.body.full_name,
									email: req.body.email,
									photo: `${config.public_url}/photos/admins/${req.body.photo}`
								})
							}
						} catch (err) {
							return response(req, res, err.message, 500, false)
						}
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

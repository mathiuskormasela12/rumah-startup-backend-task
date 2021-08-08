// ========== User Controller
// import all modules
import { Request, Response } from 'express'
import config from '../config'
import deleteFile from '../helpers/deleteFile'

// import all helpers
import response from '../helpers/response'
import uploads from '../helpers/upload'

// import models
import studentModel from '../models/Student'

namespace StudentControllerModule {
	export class Student {
		public static async addStudent (req: Request, res: Response): Promise<Response> {
			try {
				const isExist: any = await studentModel.findAll({
					nisn: req.body.nisn
				})

				if (isExist.length > 0) {
					return response(req, res, 'The student already there', 400, false)
				} else {
					const photo: any = uploads(req, '/photos/students/')

					if (!photo.success) {
						return response(req, res, photo.message, photo.status, photo.success)
					}

					req.body.photo = photo.photo

					try {
						const { insertId }: any = await studentModel.create({
							student_name: req.body.student_name,
							nisn: req.body.nisn,
							photo: req.body.photo,
							class: req.body.class,
							major: req.body.major,
							birthday: req.body.birthday,
							birth_place: req.body.birth_place,
							email: req.body.email
						})

						return response(req, res, 'Successfully to add new student', 200, true, {
							id: insertId,
							...req.body,
							photo: `${config.public_url}/photos/students/${req.body.photo}`
						})
					} catch (err) {
						try {
							await deleteFile(`/photos/students/${req.body.photo}`)
							return response(req, res, err.message, 500, false)
						} catch (errDelete) {
							console.log(errDelete.message)
							console.log(err.message)
							return response(req, res, errDelete.message, 500, false)
						}
					}
				}
			} catch (err) {
				console.log(err)
				return response(req, res, err.message, 500, false)
			}
		}

		public static async deleteStudent (req: Request, res: Response): Promise<Response> {
			try {
				const isExist: any = await studentModel.findAll({
					id: req.params.id
				})
				console.log(isExist)

				if (isExist.length < 1) {
					return response(req, res, 'Unknown student', 400, false)
				} else {
					try {
						await studentModel.delete({
							id: req.params.id
						})

						if (isExist[0].photo !== 'nophoto.png') {
							try {
								await deleteFile(`/photos/students/${isExist[0].photo}`)
							} catch (err) {
								console.log(err)
								return response(req, res, err.message, 500, false)
							}
						}

						return response(req, res, 'Successfully to delete the student', 200, true)
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

		public static async getStudentById (req: Request, res: Response): Promise<Response> {
			try {
				const isExist: any = await studentModel.findAll({
					id: req.params.id
				})

				if (isExist.length < 1) {
					return response(req, res, 'The student data not avaliable', 400, false)
				} else {
					const data = {
						id: isExist[0].id,
						student_name: isExist[0].student_name,
						nisn: isExist[0].nisn,
						class: isExist[0].class,
						major: isExist[0].major,
						birthday: isExist[0].birthday,
						birth_place: isExist[0].birth_place,
						email: isExist[0].email,
						photo: `${config.public_url}/photos/students/${isExist[0].photo}`
					}

					return response(req, res, 'Successfully to get data student', 200, true, data)
				}
			} catch (err) {
				console.log(err)
				return response(req, res, err.message, 500, false)
			}
		}
	}
}
export default StudentControllerModule

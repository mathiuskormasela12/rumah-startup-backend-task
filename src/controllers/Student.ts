// ========== User Controller
// import all modules
import { Request, Response } from 'express'
import moment from 'moment'
import config from '../config'
import deleteFile from '../helpers/deleteFile'

// import all helpers
import response from '../helpers/response'
import uploads from '../helpers/upload'
import readFile from '../helpers/readFile'
import renderTemplate from '../helpers/renderTemplate'
import generatePdf from '../helpers/generatePdf'

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

		public static async editStudent (req: Request, res: Response): Promise<Response> {
			try {
				const results: any = await studentModel.findAll({
					id: req.params.id
				})

				if (results.length < 1) {
					return response(req, res, 'Uknown user', 400, false)
				}

				if (req.files) {
					const photo: any = uploads(req, '/photos/students/')

					if (!photo.success) {
						return response(req, res, photo.message, photo.status, photo.success)
					}

					req.body.photo = photo.photo
				}

				try {
					await studentModel.update({
						student_name: req.body.student_name || results[0].student_name,
						nisn: req.body.nisn || results[0].nisn,
						photo: req.body.photo || results[0].photo,
						class: req.body.class || results[0].class,
						major: req.body.major || results[0].major,
						birthday: req.body.birthday || results[0].birthday,
						birth_place: req.body.birth_place || results[0].birth_place,
						email: req.body.email || results[0].email
					}, { id: req.params.id })

					if (req.files) {
						try {
							await deleteFile(`/photos/students/${results[0].photo}`)
							return response(req, res, 'Successfully to edit student', 200, true, {
								...req.body,
								photo: `${config.public_url}/photos/students/${req.body.photo}`
							})
						} catch (errDelete) {
							console.log(errDelete.message)
							return response(req, res, errDelete.message, 500, false)
						}
					} else {
						return response(req, res, 'Successfully to edit student', 200, true, {
							...req.body,
							photo: `${config.public_url}/photos/students/${req.body.photo}`
						})
					}
				} catch (err) {
					if (req.files) {
						try {
							await deleteFile(`/photos/students/${req.body.photo}`)
							return response(req, res, err.message, 500, false)
						} catch (errDelete) {
							console.log(errDelete.message)
							console.log(err.message)
							return response(req, res, errDelete.message, 500, false)
						}
					} else {
						console.log(err.message)
						return response(req, res, err.message, 500, false)
					}
				}
			} catch (err) {
				console.log(err.message)
				return response(req, res, err.message, 500, false)
			}
		}

		public static async getAllStudents (req: Request, res: Response): Promise<Response> {
			const {
				search = '',
				limit = 4,
				page = 1
			}: any = req.query
			try {
				const count: number = await studentModel.countAll({
					keyword: search
				})
				const startData: number = (Number(limit) * Number(page)) - Number(limit)
				const totalPages: number = Math.ceil(Number(count) / Number(limit))

				try {
					const results: any = await studentModel.findAll(null, {
						keyword: search,
						limit,
						offset: startData
					})

					if (results.length < 1) {
						return response(req, res, 'The student data not avaliable', 400, false)
					} else {
						const data = results.map((item: any) => ({
							id: item.id,
							student_name: item.student_name,
							nisn: item.nisn,
							class: `${item.class} - ${item.major}`,
							birthday: `${item.birth_place}, ${moment(item.birthday).format('DD MMMM YYYY')}`,
							email: item.email,
							photo: `${config.public_url}/photos/students/${item.photo}`
						}))

						return response(req, res, 'Successfully to get data student', 200, true, data, Number(count), Number(totalPages), Number(page))
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

		public static async getStudentReport (req: Request, res: Response): Promise<Response> {
			try {
				const file = await readFile('../templates/student_report.hbs')
				try {
					const reportData: any = await studentModel.findAll({ id: req.params.id })

					if (reportData.length < 1) {
						return response(req, res, 'Report is unavailable', 400, false)
					}

					try {
						const results = await renderTemplate(file, {
							student_name: reportData[0].student_name ? reportData[0].student_name : '-',
							photo: reportData[0].photo ? String(process.env.PUBLIC_URL).concat('/photos', '/students/', reportData[0].photo) : '-'
						})

						try {
							const pdf = await generatePdf(results)
							res.set('Content-Type', 'application/pdf')
							return res.send(pdf)
						} catch (err) {
							console.log(err)
							return response(req, res, err.message, 500, false)
						}
					} catch (err) {
						console.log(err)
						return response(req, res, err.message, 500, false)
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
export default StudentControllerModule

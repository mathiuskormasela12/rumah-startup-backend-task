// ========== User Model
// import all modules
import DatabaseModule from '../core/Database'
import { RegisterBody } from '../config/types'

namespace UserModule {
	export class User extends DatabaseModule.Database {
		public findAll<T> (body: T): Promise<T> {
			return new Promise((resolve: any, reject: any) => {
				const sql = `SELECT * FROM users WHERE ${Object.keys(body).map((items, index) => `${items}='${Object.values(body)[index]}'`)}`

				this.connection.query(sql, (err: Error, results: any[]) => {
					if (err) {
						return reject(err)
					} else {
						return resolve(results)
					}
				})
			})
		}

		public create<T> (body: RegisterBody): Promise<T> {
			return new Promise((resolve: any, reject: any) => {
				const sql = 'INSERT INTO users SET ?'
				const data = {
					full_name: body.fullName,
					password: body.password,
					email: body.email
				}
				this.connection.query(sql, data, (err: Error) => {
					if (err) {
						return reject(err)
					} else {
						return resolve(true)
					}
				})
			})
		}

		public update<T> (body: T): Promise<T> {
			return new Promise((resolve: any, reject: any) => {
				const sql = 'UPDATE users SET ?'

				this.connection.query(sql, body, (err: Error) => {
					if (err) {
						return reject(err)
					} else {
						return resolve(true)
					}
				})
			})
		}
	}
}

export default new UserModule.User()

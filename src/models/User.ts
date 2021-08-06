// ========== User Model
// import all modules
import DatabaseModule from '../core/Database'
import { RegisterBody } from '../config/types'

namespace UserModule {
	export class User extends DatabaseModule.Database {
		public findAll<T> (email: string): Promise<T> {
			return new Promise((resolve: any, reject: any) => {
				const sql = 'SELECT * FROM users WHERE email = ?'

				this.connection.query(sql, email, (err: Error, results: any[]) => {
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
	}
}

export default new UserModule.User()

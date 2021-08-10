// ========== User Model
// import all modules
import DatabaseModule from '../core/Database'

namespace MajorModule {
	export class Major extends DatabaseModule.Database {
		public findAll<T> (condition?: T, operator?: string): Promise<T> {
			return new Promise((resolve: any, reject: any) => {
				const sql = condition ? `SELECT * FROM majors WHERE ${Object.keys(condition).map((items, index) => `${items}='${Object.values(condition)[index]}'`).join(` ${operator || ''} `)}` : 'SELECT * FROM majors;'

				this.connection.query(sql, (err: Error, results: any[]) => {
					if (err) {
						return reject(err)
					} else {
						return resolve(results)
					}
				})
			})
		}

		public create<T> (data: any): Promise<T> {
			return new Promise((resolve: any, reject: any) => {
				const sql = 'INSERT INTO majors SET ?'
				this.connection.query(sql, data, (err: Error, results: any) => {
					if (err) {
						return reject(err)
					} else {
						return resolve(results)
					}
				})
			})
		}

		public update<T> (body: T, condition: any): Promise<T> {
			return new Promise((resolve: any, reject: any) => {
				const sql = `UPDATE majors SET ? WHERE ${Object.keys(condition).map((items, index) => `${items}='${Object.values(condition)[index]}'`)}`

				this.connection.query(sql, body, (err: Error) => {
					if (err) {
						return reject(err)
					} else {
						return resolve(true)
					}
				})
			})
		}

		public delete<T> (condition:T): Promise<T> {
			return new Promise((resolve: any, reject: any) => {
				const sql = `DELETE FROM majors WHERE ${Object.keys(condition).map((items, index) => `${items}='${Object.values(condition)[index]}'`)}`

				this.connection.query(sql, condition, (err: Error) => {
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

export default new MajorModule.Major()

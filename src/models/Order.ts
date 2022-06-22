// ========== Order Model
// import all modules
import DatabaseModule from '../core/Database'

namespace OrderModule {
	export class Order extends DatabaseModule.Database {
		public findAll<T> (condition: T, complexCondition?: any): Promise<T> {
			return new Promise((resolve: any, reject: any) => {
				let sql = ''

				if (complexCondition) {
					sql = `SELECT
								 s.id,
								 s.order_name
								 FROM orders s
								 WHERE s.order_name LIKE '%${complexCondition.keyword}%'
								 ORDER BY s.id ASC
								 LIMIT ${complexCondition.offset}, ${complexCondition.limit};
					`
				} else {
					sql = `
								 SELECT * FROM orders 
								 WHERE ${Object.keys(condition).map((items, index) => `orders.${items}='${Object.values(condition)[index]}'`)}
							  `
				}

				this.connection.query(sql, (err: Error, results: any[]) => {
					if (err) {
						return reject(err)
					} else {
						return resolve(results)
					}
				})
			})
		}

		public countAll<T> (complexCondition: any): Promise<T> {
			return new Promise((resolve: any, reject: any) => {
				const sql = `SELECT
										 COUNT(*) AS count
										 FROM orders s
										 WHERE s.order_name LIKE '%${complexCondition.keyword}%';
 										`

				this.connection.query(sql, (err: Error, results: any[]) => {
					if (err) {
						return reject(err)
					} else {
						return resolve(results[0].count)
					}
				})
			})
		}

		public create<T> (data: T): Promise<T> {
			return new Promise((resolve: any, reject: any) => {
				const sql = 'INSERT INTO orders SET ?'
				this.connection.query(sql, data, (err: Error, results: any) => {
					if (err) {
						return reject(err)
					} else {
						return resolve(results)
					}
				})
			})
		}

		public delete<T> (condition:T): Promise<T> {
			return new Promise((resolve: any, reject: any) => {
				const sql = `DELETE FROM orders WHERE ${Object.keys(condition).map((items, index) => `${items}='${Object.values(condition)[index]}'`)}`

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

export default new OrderModule.Order()

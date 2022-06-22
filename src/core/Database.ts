// ========== Database
// import all modules
import mysql from 'mysql2'

// import serve configurations
import config from '../config'

namespace DatabaseModule {
	export class Database {
		private database: any;

		constructor () {
			this.database = mysql.createConnection({
				host: config.database.host,
				user: config.database.user,
				password: config.database.password
			})
		}

		public async sync (): Promise<void> {
			try {
				const message = await this.createDatabase()
				this.database = mysql.createConnection({
					host: config.database.host,
					user: config.database.user,
					password: config.database.password,
					database: config.database.database_name,
					multipleStatements: true
				})
				console.log(message)
				try {
					await this.createTables()
				} catch (err) {
					console.log(err)
				}
			} catch (err) {
				console.log(err)
			}
		}

		protected createDatabase<T> (): Promise<T> {
			const sql = `CREATE DATABASE IF NOT EXISTS ${config.database.database_name} CHARACTER SET utf8 COLLATE utf8_general_ci;`
			return new Promise((resolve: any, reject: any) => {
				this.database.query(sql, (err: any) => {
					if (err) {
						return reject(err)
					} else {
						return resolve('Database has been created')
					}
				})
			})
		}

		protected createTables (): Promise<boolean> {
			const sql = `
				CREATE TABLE IF NOT EXISTS orders (
					id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
					order_name varchar(255),
					created_at timestamp DEFAULT CURRENT_TIMESTAMP,
					updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
				);`

			return new Promise((resolve, reject) => {
				this.database.query(sql, (err: any) => {
					if (err) {
						return reject(err)
					} else {
						return resolve(true)
					}
				})
			})
		}

		protected get connection (): any {
			return mysql.createConnection({
				host: config.database.host,
				user: config.database.user,
				password: config.database.password,
				database: config.database.database_name,
				multipleStatements: true
			})
		}

		protected connect (): void {
			this.database.connect((err: any) => {
				if (err) {
					throw new Error(err.message)
				} else {
					console.log('Database has been connected')
				}
			})
		}
	}
}

export default DatabaseModule

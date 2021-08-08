// ========== Database
// import all modules
import mysql from 'mysql2'

// import all helpers
import bulkCreateTables from '../helpers/bulkCreateTables'

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
					database: config.database.database_name
				})
				console.log(message)
				try {
					const sqlArr: string[] = [
						`CREATE TABLE IF NOT EXISTS users (
							id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
							full_name varchar(255),
							email varchar(255) UNIQUE NOT NULL,
							password varchar(255) NOT NULL,
							photo varchar(255) NOT NULL DEFAULT 'nophoto.png',
							created_at timestamp DEFAULT CURRENT_TIMESTAMP,
							updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
						);`,
						`CREATE TABLE IF NOT EXISTS students (
							id int AUTO_INCREMENT PRIMARY KEY NOT NULL,
							student_name varchar(255),
							nisn char(5) NOT NULL UNIQUE,
							class varchar(50) NOT NULL,
							major varchar(255) NOT NULL,
							birthday date NOT NULL,
							birth_place varchar(255) NOT NULL,
							email varchar(255) UNIQUE NOT NULL,
							photo varchar(255) NOT NULL DEFAULT 'nophoto.png',
							created_at timestamp DEFAULT CURRENT_TIMESTAMP,
							updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
						);`
					]
					const message = await bulkCreateTables(this.database, sqlArr)
					console.log(message)
				} catch (err) {
					console.log(err)
				}
			} catch (err) {
				console.log(err)
			}
		}

		protected createDatabase<T> (): Promise<T> {
			const sql = `CREATE DATABASE IF NOT EXISTS ${config.database.database_name} CHARACTER SET utf8 COLLATE utf8_general_ci`
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

		protected get connection (): any {
			return mysql.createConnection({
				host: config.database.host,
				user: config.database.user,
				password: config.database.password,
				database: config.database.database_name
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

// ========== User Model
// import all modules
import DatabaseModule from '../core/Database'

namespace StudentModule {
	export class Student extends DatabaseModule.Database {
		public findAll<T> (condition: T, complexCondition?: any): Promise<T> {
			return new Promise((resolve: any, reject: any) => {
				let sql = ''

				if (complexCondition) {
					sql = `SELECT
								 s.id,
								 s.student_name,
								 s.nisn,
								 s.class,
								 m.major_name AS major,
								 s.birthday,
								 s.birth_place,
								 s.photo
								 FROM students s
								 INNER JOIN majors m ON m.id = s.major
								 WHERE s.student_name LIKE '%${complexCondition.keyword}%' OR 
								 s.nisn LIKE '%${complexCondition.keyword}%' OR
								 s.class LIKE '%${complexCondition.keyword}%' OR 
								 m.major_name LIKE '%${complexCondition.keyword}%'
								 ORDER BY s.id ASC
								 LIMIT ${complexCondition.offset}, ${complexCondition.limit};
					`
				} else {
					sql = `
								 SELECT * FROM students 
								 INNER JOIN majors ON students.major = majors.id
								 WHERE ${Object.keys(condition).map((items, index) => `students.${items}='${Object.values(condition)[index]}'`)}
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
										 FROM students s
										 INNER JOIN majors m ON m.id = s.major
										 WHERE s.student_name LIKE '%${complexCondition.keyword}%' OR 
										 s.nisn LIKE '%${complexCondition.keyword}%' OR
										 s.class LIKE '%${complexCondition.keyword}%' OR 
										 m.major_name LIKE '%${complexCondition.keyword}%';
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
				const sql = 'INSERT INTO students SET ?'
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
				const sql = `UPDATE students SET ? WHERE ${Object.keys(condition).map((items, index) => `${items}='${Object.values(condition)[index]}'`)}`

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
				const sql = `DELETE FROM students WHERE ${Object.keys(condition).map((items, index) => `${items}='${Object.values(condition)[index]}'`)}`

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

export default new StudentModule.Student()

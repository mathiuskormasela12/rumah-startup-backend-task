// ========== Bulk Create Tables

export default (db: any, sql: string[]) => {
	return new Promise((resolve, reject) => {
		const response: any[] = []
		sql.forEach(item => {
			db.query(item, (err: any) => {
				if (err) {
					return response.push(false)
				}
				return response.push(true)
			})
		})

		if (response.every(item => item === true)) {
			return resolve('Successfully to create all tables')
		} else if (response.some(item => item === true)) {
			return resolve("Can't create several table")
		} else {
			return reject(new Error("Can't create table"))
		}
	})
}

// ========== Read File
// import all modules
import { readFile } from 'fs'
import { join } from 'path'

export default (file: string): Promise<string> => {
	return new Promise((resolve: any, reject: any) => {
		readFile(join(__dirname, file), (err, results): void => {
			if (err) {
				reject(err)
			} else {
				resolve(results.toString('utf-8'))
			}
		})
	})
}

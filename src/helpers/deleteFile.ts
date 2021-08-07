// ========== Delete File
import { unlink } from 'fs'
import path from 'path'

export default (filePath: string): Promise<any> => {
	return new Promise((resolve: any, reject: any) => {
		unlink(path.join(__dirname, `../../public${filePath}`), err => {
			if (err) {
				return reject(err)
			} else {
				return resolve(true)
			}
		})
	})
}

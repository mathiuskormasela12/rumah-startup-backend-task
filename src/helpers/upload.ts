// ========== Upload
// import all modules
import { Request } from 'express'
import { UploadPhoto } from '../config/types'
import path from 'path'

export default (req: Request, filePath: string): UploadPhoto => {
	if (!req.files) {
		return {
			message: 'You must upload your photo',
			status: 400,
			success: false
		}
	}

	const photo: any = req.files.photo

	// check file type
	const extValid = /jpg|jpeg|png/gi
	const checkMimeType = extValid.test(String(photo.mimetype))
	const checkExt = extValid.test(String(photo.name))

	if (!checkMimeType && !checkExt) {
		return {
			message: 'it is not a photo',
			status: 400,
			success: false
		}
	}

	if (photo.size > 3000000) {
		return {
			message: 'Your photo too large',
			status: 400,
			success: false
		}
	}

	let file = photo.name.split('.')[0]
	const ext = photo.name.split('.')[1].toLowerCase()
	file += '-'
	file += Date.now()
	file += '.'
	file += ext

	photo.mv(path.join(__dirname, `../../public${filePath}` + file))

	return {
		message: 'Your photo has been uploaded',
		status: 200,
		success: true,
		photo: file
	}
}

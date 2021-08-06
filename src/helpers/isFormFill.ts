// ========== isFormFill

export default (bodyArray: string[], body: any): boolean => {
	let isFilled = ''

	bodyArray.forEach(item => {
		if (!body[item]) {
			isFilled += String(false)
		} else {
			isFilled += String(true)
		}
	})

	if (isFilled.includes('false')) {
		return false
	} else {
		return true
	}
}

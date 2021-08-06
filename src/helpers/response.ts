// ========== Response
// import all modules
import { Request, Response } from 'express'

// import server configurations
import config from '../config'

export default (req: Request, res: Response, message: string, status: number, success: boolean, results?: any, totalPages?: number, currentPage?: number): Response => {
	if (!results) {
		return res.status(status).json({
			message,
			status,
			success
		})
	} else if (results && totalPages && currentPage && results.length > 0) {
		return res.status(status).json({
			message,
			status,
			success,
			results,
			pageInfo: {
				totalPages,
				currentPage,
				previousPage: (currentPage >= 1 && currentPage === totalPages) ? `${config.app_url}${req.path}${req.query ? `?${Object.keys(req.query).map((item, index) => `${item}=${Object.values(req.query)[index]}`).join('&')}` : ''}` : null,
				nextPage: (currentPage < totalPages) ? `${config.app_url}${req.path}${req.query ? `?${Object.keys(req.query).map((item, index) => `${item}=${Object.values(req.query)[index]}`).join('&')}` : ''}` : null
			}
		})
	} else {
		return res.status(status).json({
			message,
			status,
			success,
			results
		})
	}
}

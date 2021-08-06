// ========== Auth Controller
// import all modules
import { Request, Response } from 'express'

// import all helpers
import response from '../helpers/response'

namespace AuthControllerModule {
	export class Auth {
		public static register (req: Request, res: Response): Response {
			return response(req, res, 'Hello', 200, true, [1, 2, 3])
		}
	}
}

export default AuthControllerModule

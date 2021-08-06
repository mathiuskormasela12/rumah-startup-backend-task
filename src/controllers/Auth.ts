// ========== Auth Controller
// import all modules
import { Request, Response } from 'express'

namespace AuthControllerModule {
	export class Auth {
		public static register (req: Request, res: Response): Response {
			return res.json({
				message: 'hello'
			})
		}
	}
}

export default AuthControllerModule

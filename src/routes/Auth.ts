// ========== Auth Route
// import all modules
import { Router } from 'express'
import RouteModule from './Router'

// import all controllers
import authController from '../controllers/Auth'

// import all middlewares
import { checkRegisterBody, isPasswordCorrect, checkLoginBody } from '../middlewares/auth'

namespace AuthModule {
	export class Auth extends RouteModule.Route {
		constructor () {
			super()
			this.route()
		}

		protected route (): void {
			this.getRouter.post('/auth/register', checkRegisterBody, isPasswordCorrect, authController.Auth.register)
			this.getRouter.post('/auth/login', checkLoginBody, isPasswordCorrect, authController.Auth.login)
		}

		public get auth (): Router {
			return this.getRouter
		}
	}
}

export default new AuthModule.Auth()

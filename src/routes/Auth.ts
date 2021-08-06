// ========== Auth Route
// import all modules
import { Router } from 'express'
import RouteModule from './Router'

// import all controllers
import authController from '../controllers/Auth'

namespace AuthModule {
	export class Auth extends RouteModule.Route {
		constructor () {
			super()
			this.route()
		}

		protected route (): void {
			this.getRouter.post('/auth/register', authController.Auth.register)
		}

		public get auth (): Router {
			return this.getRouter
		}
	}
}

export default new AuthModule.Auth()

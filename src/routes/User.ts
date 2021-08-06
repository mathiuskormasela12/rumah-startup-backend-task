// ========== Auth Route
// import all modules
import { Router } from 'express'
import RouteModule from './Router'
import upload from 'express-fileupload'

// import all controllers
import userController from '../controllers/User'

// import all middlewares
import { isLogin } from '../middlewares/auth'

namespace UserModule {
	export class User extends RouteModule.Route {
		constructor () {
			super()
			this.route()
		}

		public route (): void {
			this.getRouter.use(upload({
				createParentPath: true
			}))
			this.getRouter.put('/user/photo/:id', isLogin, userController.User.upload)
		}

		public get user (): Router {
			return this.getRouter
		}
	}
}

export default new UserModule.User()

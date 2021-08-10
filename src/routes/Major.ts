// ========== Auth Route
// import all modules
import { Router } from 'express'
import RouteModule from './Router'

// import all controllers
import majorController from '../controllers/Major'

// import all middlewares
import { isLogin } from '../middlewares/auth'
import { checkAddMajorBody } from '../middlewares/major'

namespace MajorModule {
	export class Major extends RouteModule.Route {
		constructor () {
			super()
			this.route()
		}

		public route (): void {
			this.getRouter.post('/major', isLogin, checkAddMajorBody, majorController.Major.addMajor)
			this.getRouter.get('/major', isLogin, majorController.Major.getAllMajors)
		}

		public get major (): Router {
			return this.getRouter
		}
	}
}

export default new MajorModule.Major()

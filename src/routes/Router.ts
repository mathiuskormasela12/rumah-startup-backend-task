// ========== Router
// import all modules
import { Router } from 'express'
import upload from 'express-fileupload'

// import all interfaces
import IRoute from '../config/IRoute'

namespace RouteModule {
	export abstract class Route implements IRoute {
		private router: Router;

		protected abstract route(): void

		constructor () {
			this.router = Router()
			this.setup()
		}

		public setup (): void {
			this.router.use(upload({
				createParentPath: true
			}))
		}

		protected get getRouter (): Router {
			return this.router
		}
	}
}

export default RouteModule

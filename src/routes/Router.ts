// ========== Router
// import all modules
import { Router } from 'express'

// import all interfaces
import IRoute from '../config/IRoute'

namespace RouteModule {
	export abstract class Route implements IRoute {
		private router: Router;

		public abstract route(): void

		constructor () {
			this.router = Router()
		}

		protected get getRouter (): Router {
			return this.router
		}
	}
}

export default RouteModule

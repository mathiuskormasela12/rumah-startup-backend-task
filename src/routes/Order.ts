// ========== Order Route
// import all modules
import { Router } from 'express'
import RouteModule from './Router'

// import all middlewares
import { checkAddOrderBody } from '../middlewares/order'

// import all controllers
import orderController from '../controllers/Order'

namespace OrderModule {
	export class Order extends RouteModule.Route {
		constructor () {
			super()
			this.route()
		}

		public route (): void {
			this.getRouter.post('/order', checkAddOrderBody, orderController.Order.addOrder)
			this.getRouter.delete('/order/:id', orderController.Order.deleteOrder)
			this.getRouter.get('/order/:id', orderController.Order.getOrderById)
			this.getRouter.get('/orders', orderController.Order.getAllOrders)
		}

		public get order (): Router {
			return this.getRouter
		}
	}
}

export default new OrderModule.Order()

// ========== Order Controller
// import all modules
import { Request, Response } from 'express'

// import all helpers
import response from '../helpers/response'

// import models
import orderModel from '../models/Order'

namespace OrderControllerModule {
	export class Order {
		public static async addOrder (req: Request, res: Response): Promise<Response> {
			try {
				const { insertId }: any = await orderModel.create({
					order_name: req.body.order_name
				})

				return response(req, res, 'Successfully to add new order', 200, true, {
					id: insertId,
					...req.body
				})
			} catch (err: any) {
				console.log(err.message)
				return response(req, res, err.message, 500, false)
			}
		}

		public static async deleteOrder (req: Request, res: Response): Promise<Response> {
			try {
				const isExist: any = await orderModel.findAll({
					id: req.params.id
				})

				if (isExist.length < 1) {
					return response(req, res, 'Unknown order', 400, false)
				} else {
					try {
						await orderModel.delete({
							id: req.params.id
						})

						return response(req, res, 'Successfully to delete an order', 200, true)
					} catch (err: any) {
						console.log(err)
						return response(req, res, err.message, 500, false)
					}
				}
			} catch (err: any) {
				console.log(err)
				return response(req, res, err.message, 500, false)
			}
		}

		public static async getOrderById (req: Request, res: Response): Promise<Response> {
			try {
				const isExist: any = await orderModel.findAll({
					id: req.params.id
				})

				if (isExist.length < 1) {
					return response(req, res, 'The order data not avaliable', 400, false)
				} else {
					const data = {
						id: isExist[0].id,
						order_name: isExist[0].order_name,
						user_id: isExist[0].user_id,
						full_name: isExist[0].full_name
					}

					return response(req, res, 'Successfully to get an order', 200, true, data)
				}
			} catch (err: any) {
				console.log(err)
				return response(req, res, err.message, 500, false)
			}
		}

		public static async getAllOrders (req: Request, res: Response): Promise<Response> {
			const {
				search = '',
				limit = 4,
				page = 1
			}: any = req.query
			try {
				const count: number = await orderModel.countAll({
					keyword: search
				})
				const startData: number = (Number(limit) * Number(page)) - Number(limit)
				const totalPages: number = Math.ceil(Number(count) / Number(limit))

				try {
					const results: any = await orderModel.findAll(null, {
						keyword: search,
						limit,
						offset: startData
					})

					if (results.length < 1) {
						return response(req, res, 'The order data not avaliable', 400, false)
					} else {
						const data = results.map((item: any) => ({
							id: item.id,
							order_name: item.order_name,
							user_id: item.user_id,
							full_name: item.full_name
						}))

						return response(req, res, 'Successfully to get all orders', 200, true, data, Number(count), Number(totalPages), Number(page))
					}
				} catch (err: any) {
					console.log(err)
					return response(req, res, err.message, 500, false)
				}
			} catch (err: any) {
				console.log(err)
				return response(req, res, err.message, 500, false)
			}
		}
	}
}
export default OrderControllerModule

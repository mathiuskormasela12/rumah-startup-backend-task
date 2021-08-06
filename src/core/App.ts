// ========== App
// import all modules
import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import path from 'path'

// import database
import Database from './Database'

// import server configurations
import config from '../config'

// import all interfaces
import IApp from '../config/IApp'

// import all routes
import authRoute from '../routes/Auth'
import userRoute from '../routes/User'

const database = new Database.Database()

namespace AppModule {
	export class App implements IApp {
		private app: Application;
		private port: number;

		constructor () {
			this.port = config.port
			this.app = express()
			this.index()
		}

		public index (): void {
			// setup several middlewares
			this.app.use(morgan('dev'))
			this.app.use(helmet())
			this.app.use(compression())

			// setup urlencoded & json
			this.app.use(express.urlencoded({ extended: false }))
			this.app.use(express.json())

			// setup static files
			this.app.use(express.static(path.join(__dirname, '../../public')))

			// setup cors
			const corsOption = {
				origin: function (origin: any, callback: any): void {
					if (config.clients.indexOf(origin) !== -1 || !origin) {
						callback(null, true)
					} else {
						callback(new Error('Blocked by cors'))
					}
				}
			}

			this.app.use(cors(corsOption))

			this.app.use('/api/v2', authRoute.auth)
			this.app.use('/api/v2', userRoute.user)

			database.sync()
		}

		public listen (): void {
			this.app.listen(this.port, () => {
				console.log(`Backend service running at ${config.app_url}`)
			})
		}
	}
}

export default AppModule

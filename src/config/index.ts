// ========== Server Configuratoins
// import dotenv
import dotenv from 'dotenv'
dotenv.config()

export default {
	clients: [
		'http://localhost:3000'
	],
	port: Number(process.env.PORT || 3000),
	secret_key: process.env.SECRET_KEY,
	app_url: process.env.APP_URL,
	public_url: process.env.PUBLIC_URL,
	database: {
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database_name: process.env.DB_NAME
	},
	expires_in: '1h'
}

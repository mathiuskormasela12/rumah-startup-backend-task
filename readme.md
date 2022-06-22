# Backend Task Teman Startup

This is backend service for technical test at Teman Startup

## Installation 

- Make sure you had clone this repo
- Copy environment from `.env.example` to `.env`
- Configure your `.env` file according to your MySQL credentials
- Open your terminal in this project and run 

	```bash
	npm install
	```

## How To Run This Web Service

- Run On Development

	```bash
	npm run dev
	```

- Run On Production

	```bash
	npm run build
	```

	And then run

	```bash
	npm start
	```

## API SPECS

- POST `/api/v1/order` Route for adding a new order

	Request Body

	```
	{
		"order_name": "your order name"
	}
	```

- GET `/api/v1/order/:id` Route for get order by id

- DELETE `/api/v1/order/:id` Route for delete order by id

- GET `/api/v1/orders?limit=yourLimitData&page=yourCurrentPage` Route for get all orders

## License
[MIT](https://choosealicense.com/licenses/mit/)
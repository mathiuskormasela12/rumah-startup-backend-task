// ========== Student Route
// import all modules
import { Router } from 'express'
import RouteModule from './Router'

// import all middlewares
import { isLogin } from '../middlewares/auth'
import { checkAddStudentBody } from '../middlewares/student'

// import all controllers
import studentController from '../controllers/Student'

namespace StudentModule {
	export class Student extends RouteModule.Route {
		constructor () {
			super()
			this.route()
		}

		public route (): void {
			this.getRouter.post('/student', isLogin, checkAddStudentBody, studentController.Student.addStudent)
			this.getRouter.delete('/student/:id', isLogin, studentController.Student.deleteStudent)
			this.getRouter.get('/student/:id', isLogin, studentController.Student.getStudentById)
			this.getRouter.patch('/student/:id', isLogin, studentController.Student.editStudent)
			this.getRouter.get('/student', isLogin, studentController.Student.getAllStudents)
		}

		public get student (): Router {
			return this.getRouter
		}
	}
}

export default new StudentModule.Student()

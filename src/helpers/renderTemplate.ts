// ========== Render Template
// import all modules
import { handlebars } from 'hbs'

export default async (template: string, data: any) => {
	return handlebars.compile(template)(data)
}

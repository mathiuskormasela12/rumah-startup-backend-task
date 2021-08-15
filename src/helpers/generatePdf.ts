// ========== Generate Pdf
// import all modules
import puppeteer from 'puppeteer'

export default async (template: string): Promise<any> => {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()

	await page.setContent(template)

	const pdfBuffer = await page.pdf({
		format: 'a4',
		margin: {
			top: 30,
			bottom: 50
		}
	})

	await page.close()
	await browser.close()

	return pdfBuffer
}

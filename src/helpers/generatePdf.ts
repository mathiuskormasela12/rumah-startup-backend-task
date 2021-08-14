// ========== Generate Pdf
// import all modules
import puppeteer from 'puppeteer'

export default async (template: string): Promise<any> => {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()

	await page.setContent(template)

	const pdfBuffer = await page.pdf()

	await page.close()
	await browser.close()

	return pdfBuffer
}

const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: true
        })
        const page = await browser.newPage()
        await page.goto('https://alfrink.nl/agenda', {
            waitUntil: 'networkidle0'
        })

        await browser.close()
    } catch(err) {
        console.log("error in try/catch: " + err)
        process.exit()
    }
})
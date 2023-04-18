const puppeteer = require("puppeteer");

class Converter {
    async convertHtmlInImage(_html) {
        try {
            const browser = await puppeteer.launch({
                executablePath: '/usr/bin/google-chrome',
                dumpio: true,
                ignoreHTTPSErrors: true,
                args: ['--no-sandbox', '--disable-web-security', "--disable-setuid-sandbox"]});
            const page = await browser.newPage();

            await page.goto('http://moie.lucymodas.com/');

            // Configuración de la página
            const width = 788; // Ancho de la imagen en px
            const height = 1200; // Alto de la imagen en px
            const deviceScaleFactor = 2; // Escala de la imagen
            const format = 'png'; // Formato de la imagen
            await page.setViewport({width, height, deviceScaleFactor});

            // Cargar el HTML
            await page.setContent(_html, { waitUntil: 'networkidle2' });
            const screenshotBuffer = await page.screenshot({type: format});


            await browser.close();
            // Devolver la imagen como buffer
            return screenshotBuffer;
        } catch (e) {
            console.log('error conviertiendo la imagen...', e.message);
            return false;
        }
    }
}

module.exports = Converter;

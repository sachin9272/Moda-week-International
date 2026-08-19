import puppeteer from 'puppeteer-core';
import fs from 'fs';

export const generatePdfFromHtml = async (htmlString) => {
    let browser;
    try {
        const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
        const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
        const linuxChromePath = '/usr/bin/google-chrome';
        const linuxChromiumPath = '/usr/bin/chromium-browser';
        const linuxChromiumPathAlt = '/usr/bin/chromium';
        
        let executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_BIN || '';
        
        if (!executablePath) {
            if (fs.existsSync(edgePath)) executablePath = edgePath;
            else if (fs.existsSync(chromePath)) executablePath = chromePath;
            else if (fs.existsSync(linuxChromePath)) executablePath = linuxChromePath;
            else if (fs.existsSync(linuxChromiumPath)) executablePath = linuxChromiumPath;
            else if (fs.existsSync(linuxChromiumPathAlt)) executablePath = linuxChromiumPathAlt;
        }
        
        browser = await puppeteer.launch({
            executablePath,
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        // Set content and wait for resources to finish loading
        await page.setContent(htmlString, {
            waitUntil: ['networkidle0', 'load', 'domcontentloaded']
        });

        // Generate the PDF buffer
        const pdfBuffer = await page.pdf({
            width: '1220px',
            height: '765px',
            printBackground: true,
            margin: {
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px'
            }
        });

        return pdfBuffer;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

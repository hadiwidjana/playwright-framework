import { Locator, Page, TestInfo, expect } from "@playwright/test";

export class basetest {

    readonly reporter : TestInfo;
    screenshot: number = 0;

    constructor(reporter: TestInfo) {
        this.reporter = reporter
      }

    async click(locator: Locator) {
        await this.highlightElement(locator);
        await this.screenshotElement(locator);
        await locator.click(); //click
    }

    async fill(locator: Locator, text: string) {
        await this.highlightElement(locator);
        await locator.fill(text);
        await this.screenshotElement(locator);
    }

    async check(locator: Locator) {
        await this.highlightElement(locator);
        await this.screenshotElement(locator);
        await locator.check();
    }

    async expectVisible(locator: Locator){
        await this.highlightElement(locator);
        await this.screenshotElement(locator);
        await expect(locator).toBeVisible();
    }

    async expectTextEqual(locator: Locator,expectation: string){
        expect(await locator.textContent()).toEqual(expectation);
        await this.screenshotElement(locator);
        await this.highlightElement(locator);
    }

    async screenshotElement(locator:Locator){
        const screenshot = await locator.screenshot({ path: 'test-results/screenshot/screenshot-'+this.screenshot+'.png' });
        await this.reporter.attach('screenshot', { body: screenshot, contentType: 'image/png' });
        this.screenshot++;
        // doesn't support attach on step level yet https://github.com/microsoft/playwright/issues/14364
    }

    async highlightElement(locator: Locator){
        await locator.evaluate((ele) => (ele.style.border = '3px solid red')) //Highlight element with red border
    }



}
import { Page, test } from '@playwright/test';
import { homepage } from '../page/homepage';
import { gmail } from '../page/gmail';
import { allure } from "allure-playwright";


test('[L001] Login Test', async ({ page, context }, testInfo) => {
    allure.story("As a User, I should be able to login using valid username and password");
    test.setTimeout(200000)

    //open tokopedia.com and login
    const home = new homepage(page, testInfo);
    await home.inputCredentialAndVerify('satria.hadiwidjana@gmail.com','02011993');

    //open new page and go to gmail
    const pageTwo = await context.newPage();
    const email = new gmail(pageTwo, testInfo);
    await email.readVerificationAndDelete('satria.hadiwidjana@gmail.com','@Albertus1993');
    await pageTwo.close();

    //enter credential
    await home.enterVerificationCode(email.verificationCode,'Albertus');
})
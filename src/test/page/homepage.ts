import { expect, Locator, Page, test, TestInfo } from '@playwright/test';
import { basetest } from '../../main/basetest';
export class homepage {
  base: basetest;
  readonly page: Page;
  readonly testInfo;
  readonly btnHeaderLogin: Locator;
  readonly emailPhoneInput: Locator;
  readonly emailPhoneSubmit: Locator;
  readonly password: Locator;
  readonly submitLogin: Locator;
  readonly sendEmailCard: Locator;
  readonly otpInput: Locator;

  constructor(page: Page, testInfo: TestInfo) {
    this.page = page;
    this.testInfo = testInfo;
    this.base = new basetest(testInfo)
    this.btnHeaderLogin = page.getByTestId('btnHeaderLogin');
    this.emailPhoneInput = page.getByTestId('email-phone-input');
    this.emailPhoneSubmit = page.getByTestId('email-phone-submit');
    this.password = page.locator('//input[@type="password"]');
    this.submitLogin = page.getByLabel('login-button');
    this.sendEmailCard = page.locator("//div[@data-unify='Card']")
    this.otpInput = page.locator("//input[@autocomplete='one-time-code']");
  }

  async goToTokped() {
    await test.step(`Navigate to tokopedia.com`, async () => {
      await this.page.goto('https://tokopedia.com');
    });
  }

  async clickLogin() {
    await test.step(`Click Masuk`, async () => {
      await this.base.click(this.btnHeaderLogin);
      await expect(this.emailPhoneInput).toBeVisible();
    });
  }

  async inputEmail(email: string) {
    await test.step(`Enter Email`, async () => {
      await this.base.fill(this.emailPhoneInput, email);
      await this.base.click(this.emailPhoneSubmit);
      await this.base.expectVisible(this.password);
    });
  }

  async inputPassword(password: string) {
    await test.step(`Enter Password`, async () => {
      await this.base.fill(this.password, password);
      await this.base.click(this.submitLogin);
      await this.base.expectVisible(this.sendEmailCard);
    });
  }

  async sendEmailVerification() {
    await test.step(`Send Email Verification`, async () => {
      await this.base.click(this.sendEmailCard);
    })
  }

  async enterVerificationCode(code: string, userFirstName: string) {
    await test.step(`Insert OTP and verify user has logged in`, async () => {
      await this.base.fill(this.otpInput, code);
      await this.page.waitForLoadState();
      await this.base.expectTextEqual(this.page.locator('//div[@data-testid="btnHeaderMyProfile"]/div/div'), userFirstName);
    });
  }

  async inputCredentialAndVerify(email: string, password: string) {
    await this.goToTokped();
    await this.clickLogin();
    await this.inputEmail(email);
    await this.inputPassword(password);
    await this.sendEmailVerification();
  }
}
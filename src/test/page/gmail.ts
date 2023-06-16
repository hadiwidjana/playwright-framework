import { Locator, Page, test, TestInfo } from '@playwright/test';
import { basetest } from '../../main/basetest';
import { World } from '@cucumber/cucumber';

export class gmail {
  base: basetest;
  verificationCode: string;
  code: string | null;
  readonly page: Page;
  readonly testInfo: TestInfo;
  readonly btnHeaderLogin: Locator;
  readonly emailPhoneInput: Locator;
  readonly emailNext: Locator;
  readonly password: Locator;
  readonly passwordNext: Locator;
  readonly firstEmail: Locator;
  readonly verificaitonCodeLoc: Locator;
  readonly selectAllEmail: Locator;
  readonly deleteEmail: Locator;
  readonly inbox: Locator;
  emptyMessage: Locator;

  constructor(page: Page, testInfo: TestInfo) {
    this.page = page;
    this.testInfo = testInfo;
    this.base = new basetest(testInfo)
    this.btnHeaderLogin = page.locator("//header//a[@data-action='sign in']");
    this.emailPhoneInput = page.locator("//input[@id='identifierId']");
    this.emailNext = page.locator("//div[@id='identifierNext']//button");
    this.password = page.locator("//div[@id='password']//input[@type='password']");
    this.passwordNext = page.locator("//div[@id='passwordNext']//button");
    this.firstEmail = page.locator("//span[contains(text(),'Halo Toppers')]");
    this.verificaitonCodeLoc = page.locator("//tr/td/div[3]/div");
    // this.verificaitonCodeLoc = page.locator("//tr/td/span/following-sibling::div/div")
    this.selectAllEmail = page.locator("//div[@data-tooltip='Select']//span");
    this.deleteEmail = page.locator("//div[@data-tooltip='Delete']")
    this.inbox = page.locator("//div[@data-tooltip='Inbox']")
  }

  async goToGmail() {
    await test.step(`Navigate to gmail.com`, async () => {
    await this.page.goto("https://gmail.com")
    })
  }


  async clickLogin() {
    await test.step(`Click login link on the header`, async () => {
    await this.base.click(this.btnHeaderLogin);
    await this.base.expectVisible(this.emailPhoneInput);
    })
  }

  async inputEmail(email: string) {
    await test.step(`Enter email`, async () => {
    await this.base.fill(this.emailPhoneInput,email);
    await this.base.click(this.emailNext);
    await this.base.expectVisible(this.password);
    })
  }

  async inputPassword(password: string) {
    await test.step(`Enter password`, async () => {
    await this.base.fill(this.password,password);
    await this.base.click(this.passwordNext);
    await this.base.expectVisible(this.inbox);
    })
  }

  async getVerificationCode() {
    await test.step(`Open email, get verification code, and return to inbox`, async () => {
    await this.base.click(this.firstEmail);
    this.code = await this.verificaitonCodeLoc.textContent();
    if(this.code != null){
      this.verificationCode = this.code;
    } else {
      throw 'Verification Code not found!';
    }
    await this.base.click(this.inbox);
    await this.page.waitForTimeout(5000);
    await this.base.click(this.inbox);
    await this.base.expectVisible(this.firstEmail);
  })
  }

  async deleteAllMail() {
    await test.step(`Delete all mails`, async () => {
    await this.base.check(this.selectAllEmail);
    // await expect(await this.selectAllEmail.isChecked());
    await this.base.click(this.deleteEmail);
    await this.page.waitForTimeout(5000);
    await this.base.expectVisible(await this.page.locator("//div[text()='Your Primary tab is empty.']"));
    })
  }

  
  async readVerificationAndDelete(email:string,password:string) {
      await this.goToGmail();
      await this.inputEmail(email);
      await this.inputPassword(password);
      await this.getVerificationCode();
      await this.deleteAllMail();
  }
}
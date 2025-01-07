const { expect } = require('@playwright/test')

exports.LoginPopup = class LoginPopup {
    constructor(page) {
        this.page = page;
        this.popup = this.page.locator("div[data-testid='auth-modal']");

        this.loginTab = this.page.locator("button[data-testid='login-tab-button']");

        this.bankLogin = this.page.locator("button[data-testid='pnp-option-button']");
        this.facebookLogin = this.page.locator("//*[@id='facebook-icon-gradient']//ancestor::button");
        // gmailLogin with no unique attribute, need to improvise
        this.gmailLogin = this.page.locator("(//button[@class='_1cvpzsp0'])[2]")
        this.SubmitBtn = this.page.locator("button[type='submit']")
        this.backToLogin = this.page.locator("//div[@data-testid='auth-modal']//button[@type='button']")

        this.emailLogin = this.page.locator("button[data-testid='email-option-button']");
        this.emailField = this.page.locator("input[data-testid='email-input']");
        this.passwordField = this.page.locator("input[data-testid='password-input']");
        this.submitButton = this.page.locator("button[data-testid='auth-login-button']");

        this.registerTab = this.page.locator("button[data-testid='register-tab-button']");
        this.countryField = this.page.locator("div[class='n6bhj32 _1htob5c _1htob5a _1htob56 no-select']")
        this.amountField = this.page.locator("input[class='_1htob5i _1urnl350']")
        this.closeIcon = this.page.getByTestId("close-modal")
    }

    async assertLoginMethodsVisibility() {
        await expect(this.emailLogin).toBeVisible()
        await expect(this.bankLogin).toBeVisible()
        await expect(this.gmailLogin).toBeVisible()
        await expect(this.facebookLogin).toBeVisible()
    }

    async assertEmailLoginFields() {
        await expect(this.emailLogin).toBeVisible()
        await this.emailLogin.click()
        await expect(this.emailField).toBeVisible()
        await expect(this.passwordField).toBeVisible()
        await expect(this.submitButton).toBeVisible()
    }

    async assertGmailLoginFields() {
        await expect(this.gmailLogin).toBeVisible()
        await this.gmailLogin.click()
        await expect(this.SubmitBtn).toBeVisible()
        await expect(this.SubmitBtn).toHaveText("Complete with Google")
        await expect(this.backToLogin).toBeVisible()
        await this.backToLogin.click()
    }

    async assertFacebookLoginFields() {
        await expect(this.facebookLogin).toBeVisible()
        await this.facebookLogin.click()
        await expect(this.SubmitBtn).toBeVisible()
        await expect(this.SubmitBtn).toHaveText("Complete with Facebook")
        await expect(this.backToLogin).toBeVisible()
        await this.backToLogin.click()
    }


};
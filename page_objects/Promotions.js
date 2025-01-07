const { expect } = require('@playwright/test')


exports.Promotions = class Promotions {
    constructor(page) {
        this.page = page
        this.depositPromo = new DepositPromo(this.page)
        this.cashbackPromo = new InstantComboCashback(this.page)
    }
}


class DepositPromo {
    constructor(page) {
        this.page = page
        this.banner = this.page.locator("div[class='vyq6i40']")
        this.country = this.page.locator("div[class='_4dzf8q5']")
        this.amountInput = this.page.locator("input[class='_1htob5i _1q90kfo0']")
        this.amountHints = this.page.locator("div[class='_4dzf8qb']")
        this.depositBtn = this.page.locator("button[class='_304csjn _304csj3 _304csj7']")
    }
    async assertDepositPromoElementsVisibility(){
        await expect(this.banner).toBeVisible()
        await expect(this.country).toBeVisible()
        await expect(this.amountInput).toBeVisible()
        await expect(this.amountHints).toBeVisible()
        await expect(this.depositBtn).toBeVisible()
    }
}


class InstantComboCashback {
    constructor(page) {
        this.page = page
        this.banner = this.page.locator("a[href='/en/instant-combo-cashback']")
        this.promoTitle = this.page.locator("//a[@href='/en/instant-combo-cashback']//h3[@class='x1quqz6']")
        this.promoImage = this.page.locator("//a[@href='/en/instant-combo-cashback']//img")
        this.readMoreBtn = this.page.locator("button[class='hq972r0']")
    }

    async assertInstantComboCashbackElements() {
        await expect(this.banner).toBeVisible()
        await expect(this.promoTitle).toBeVisible()
        await expect(this.promoImage).toBeVisible()
        await expect(this.readMoreBtn).toBeVisible()
    }
}

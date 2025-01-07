const { test, expect } = require('@playwright/test');
const { LoginPopup } = require('../page_objects/LoginPopup')
const { MainPage } = require("../page_objects/MainPage");
const { Promotions } = require("../page_objects/Promotions");
const {machine} = require("node:os");
const {log} = require("node:util");
const {stringify} = require("node:querystring");
const assert = require("node:assert");


test.describe("Unauthorized Player", () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize(
            {width: 1600, height: 1020}
        )
        const mainPage = new MainPage(page)
        await mainPage.navigate()

        if (mainPage.cookiesBanner.banner.isVisible()) {
            await mainPage.cookiesBanner.assertCookiesBannerElements()
            await mainPage.cookiesBanner.acceptCookies()
        }

        // for better navigation we are choosing English language
        if (!mainPage.header.language.innerText() !== "EN") {
            await mainPage.header.language.click()
            await page.locator("div[data-testkey='en']").click()
        }
        await expect(mainPage.header.language).toHaveText("EN")

        await mainPage.assertMainPage()
    })

    test("Promotions view for Unauthorized Player from Sportsbook page", async ({ page}) => {
        const promoBanner = new MainPage(page).promotionsBanner
        await promoBanner.assertPromotionBannerElements()

        const promotions = new Promotions(page)
        await promotions.depositPromo.assertDepositPromoElementsVisibility()
        await page.waitForTimeout(10000)  // is needed because of no pnp available error popup
        await promotions.depositPromo.depositBtn.click()

        await expect(page).toHaveURL(/.*\/deposit/)
        await expect(page.locator("section[data-test='ChooseBankList']")).toBeVisible({timeout: 5000})

        await page.goBack()

        await promotions.cashbackPromo.assertInstantComboCashbackElements()
        await promotions.cashbackPromo.readMoreBtn.click()

        await expect(page).toHaveURL(/.*\/instant-combo-cashback/)
        let placeBetBtn = "a[class='button lime']"

        await expect(page.locator(placeBetBtn)).toBeVisible()
        await expect(page.locator(placeBetBtn)).toHaveText("Place your bet")
        await page.locator(placeBetBtn).click()

        // placeBetBtn should redirect to back to sportsbook page
        await expect(page).toHaveURL(/.*\/sports/)
   })

    test("Login & Sign up Dialog Elements Visibility", async ({ page }) => {
        const mainPage = new MainPage(page)
        await expect(mainPage.header.loginButton).toBeVisible()
        await mainPage.header.loginButton.click()

        let loginDialog = new LoginPopup(page)
        await expect(loginDialog.popup).toBeVisible()
        await expect(loginDialog.loginTab).toBeVisible()
        await expect(loginDialog.loginTab).toHaveText("Login")
        await loginDialog.assertLoginMethodsVisibility()
        await loginDialog.assertEmailLoginFields()
        await loginDialog.assertGmailLoginFields()
        await loginDialog.assertFacebookLoginFields()

        await expect(loginDialog.registerTab).toBeVisible()
        await expect(loginDialog.registerTab).toHaveText("Register")
        await loginDialog.registerTab.click()


        for (let amount of ['50 €', '150 €', '250 €']) {
            await page.waitForTimeout(5000)  // is needed because of no pnp available error popup
            await expect(loginDialog.countryField).toBeVisible()
            await expect(loginDialog.countryField).toHaveText(/Estonia/)
            await expect(loginDialog.amountField).toBeVisible()
            await page.getByRole('button', { name: amount, exact: true }).click()

            await expect(page.locator("section[data-test='ChooseBankList']")).toBeVisible({timeout: 5000})

            // Received string:  "https://checkout-cdn.zimpler.net/v4/ee/deposit?s=a0b1627d89b0e37e007c"
            // might be a bug, url is not built correctly
            await expect(page).toHaveURL(/.*\/deposits/)
            await page.goBack()

            await loginDialog.registerTab.click()
        }
    })

    test("Pages Access for Unauthorized player from Menu", async ({ page }) => {
        let mainPage = new MainPage(page)
        await expect(mainPage.header.playerMenu).toBeVisible()
        await mainPage.header.playerMenu.click()

        let playerMenu = mainPage.playerMenu
        await playerMenu.assertPlayerMenuElements()

        // check specific pages are not accessible for unauthorized player
        for (let pageItem of [
            playerMenu.myAccount,
            playerMenu.myRewards,
            playerMenu.verification,
            playerMenu.sustainableGaming,
            playerMenu.settings,
            playerMenu.transactions,
            playerMenu.depositBtn,
            playerMenu.withdrawalBtn
        ]) {
            await pageItem.click()
            // should be same as in LoginPopup.popup, but it's not for some reason
            let loginLocator = "//div[@class='_1gzupd07 _1gzupd0c _1gzupd0e']"
            await expect(page.locator(loginLocator)).toBeVisible()
            await page.locator(`${loginLocator}//button[@data-testid='close-modal']`).click()
        }
    })

    test("Bet placing as Unzuthorized player", async ({ page }) => {
      test.setTimeout(300000);
        const mainPage = new MainPage(page)
        const categories = mainPage.sportsMenu
        await categories.assertSportsCategoryList()
        await expect(categories.categoryList).toBeVisible()

        await expect(categories.allCategories).toBeVisible()
        await categories.allCategories.click()
        await expect(categories.allCategoriesDialog.allSportsDialog).toBeVisible()
        await categories.allCategoriesDialog.assertAllSportsDialogElements()
        await categories.allCategoriesDialog.closeIcon.click()

        let loginDialog = new LoginPopup(page)

        // make a bet for every category and check it's added to betslip
        for (let pageItem of [
            categories.lobby,
            // categories.live, // live category is too flaky, 9/10 it fails, because button gets disabled
            categories.football,
            categories.basketball,
            categories.iceHockey,
            categories.winterSports,
            categories.americanFootball,
            categories.eSports,
            // categories.boxing,
            categories.handball,
            categories.mma,
            categories.volleyball,
        ]) {
            await page.waitForTimeout(1000)
            await pageItem.click()
            if (!pageItem in [categories.lobby, categories.live, categories.eSports, categories.winterSports]) {
                await expect(page.getByTestId("league-container")).toBeVisible()
            }
            let eventsContainer = mainPage.eventsContainer
            let allEvents = await eventsContainer.events
            let singleEvent = await allEvents.nth(2)
            await expect(singleEvent).toBeVisible()
            let allOdds = await eventsContainer.odds
            let singleOdd = await allOdds.nth(2)
            await expect(singleOdd).toBeVisible()

            const eventLocator = "(//div[@data-testid='match-container'])[2]"
            await page.locator(`(${eventLocator}//*[@data-testid='outcome-button'])[1]`).click()
            const oddAmount = await page.locator(`(${eventLocator}//*[@class='_1s5zkhed'])[1]`).textContent()
            const title = await page.locator(`${eventLocator}//div[@class='qrs0x60']`).textContent()

            await expect(eventsContainer.quickBet).toBeVisible()

            let floatingBetslip = mainPage.floatingBetslip
            await expect(floatingBetslip.floatingWindow).toBeVisible()
            await expect(floatingBetslip.totalBets).toBeVisible()
            await expect(floatingBetslip.totalBets).toContainText(oddAmount)

            await expect(floatingBetslip.closeIcon).toBeVisible()
            await floatingBetslip.floatingWindow.click()

            const betslip = mainPage.betlsip
            await betslip.assertBetslipElementsVisibility()

            await expect(page.locator(
                "//div[@data-testid='betslip-single-tab']//*[@class='_11bv2h86 _11bv2h84']")).toHaveText(oddAmount)
            let betslipEventTitle = await page.locator(
                "//div[@data-testid='betslip-selection']//div[@class='_1yfzc7ic _1yfzc7i2']").textContent()
            var assert = require("assert")
            assert.equal(title, betslipEventTitle.replace(" - ", ""))

            await expect(betslip.stakeInput).toBeVisible()
            await betslip.stakeInput.fill("1.1")
            await expect(betslip.stakeInput).toHaveValue("1.1")

            if (pageItem !== categories.live) {
                for (let amount of ['10', '20', '50', '100']) {
                    await expect(betslip.stakeInput).toBeVisible()
                    let amountLocator = await page.getByRole('button', {name: amount, exact: true})
                    await expect(amountLocator).toBeVisible()
                    await amountLocator.click()
                    await expect(betslip.stakeInput).toHaveValue(amount)
                    // let totalBetAmount = String(amount * oddAmount)
                    // let calculatedTotal = await page.locator("div[class='uw7j814']").textContent()
                    // assert(totalBetAmount.includes(String(calculatedTotal)))
                }
            }

            await betslip.placeBetBtn.click()
            await expect(loginDialog.popup).toBeVisible()
            await loginDialog.assertLoginMethodsVisibility()
            // close the popup
            await page.locator("//*[@data-testid='auth-modal']/parent::div//button[@data-testid='close-modal']").click()

            await expect(betslip.clearAll).toBeVisible()
            await betslip.clearAll.click()

        }
    })
});

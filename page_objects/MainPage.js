const { expect } = require('@playwright/test')


const LandingPage = 'https://epicbet.com/'
const BRAND = /Epicbet/
const SPORTSBOOK = /.*\/sport/


exports.MainPage = class MainPage {
    /**
     * * @param {import('@playwright/test').Page} page
     * */

    constructor(page) {
        this.page = page
        this.header = new MainHeader(this.page)
        this.promotionsBanner = new PromotionsBanner(this.page)
        this.sportsMenu = new SportsMenu(this.page)
        this.cookiesBanner = new CookiesBanner(this.page)
        this.playerMenu = new PlayerMenu(this.page)
        this.eventsContainer = new EventContainer(this.page)
        this.floatingBetslip = new FloatingBetSlip(this.page)
        this.betlsip = new BetSlip(this.page)
    }

    async navigate() {
        await this.page.goto(LandingPage)
    }

    async assertMainPage() {
        await expect(this.page).toHaveTitle(BRAND)
        await expect(this.page).toHaveURL(SPORTSBOOK)  // by default sportsbook should open
        await this.header.assertHeaderElements()
    }

    async openLoginPopup() {
        await expect(this.header.loginButton).toBeVisible()
        await this.header.loginButton.click()
    }

    async openRegisterPopup() {
        await expect(this.header.registerButton).toBeVisible()
        await this.header.registerButton.click()
    }
}


class MainHeader {
    constructor(page) {
        this.page = page
        this.header = this.page.locator("div[data-testid='header']")
        this.sportsbook = this.page.locator("a[data-testid='sport-button']")
        this.casino = this.page.locator("a[data-testid='casino-button']")
        this.liveCasino = this.page.locator("a[data-testid='live-casino-button']")
        this.roadMap = this.page.locator("a[data-testid='roadmap-button']")
        this.promotions = this.page.locator("a[data-testkey='user.account.promotions']")
        this.language = this.page.locator("button[data-testid='language-button']")
        this.loginButton = this.page.locator("button[data-testid='login-button']");
        this.registerButton = this.page.locator("button[data-testid='signup-button']");
        this.playerMenu = this.page.locator("button[data-testid='menu-button']")
    }

    async assertHeaderElements() {
        await expect(this.header).toBeVisible()
        await expect(this.sportsbook).toBeVisible()
        await expect(this.casino).toBeVisible()
        await expect(this.liveCasino).toBeVisible()
        await expect(this.roadMap).toBeVisible()
        await expect(this.promotions).toBeVisible()
        await expect(this.language).toBeVisible()
        await expect(this.loginButton).toBeVisible()
        await expect(this.registerButton).toBeVisible()
        await expect(this.playerMenu).toBeVisible()
    }
}


class PromotionsBanner {
    constructor(page) {
        this.page = page
        this.promotions_banner = this.page.locator("div[class='cwxo9b1']")
        this.arrows = this.page.locator("div[class='cwxo9b2']")
        // since arrows are same object and becomes clickable once the opposite is clicked one locator is enough
        this.sideArrow = this.page.locator("div[class='cwxo9b3']")
    }

    async assertPromotionBannerElements(){
        await expect(this.promotions_banner).toBeVisible()
        await expect(this.arrows).toBeVisible()
        await expect(this.sideArrow).toBeVisible()
    }
}


class SportsMenu {
    constructor(page) {
        this.page = page
        this.categoryList = this.page.locator("div[data-testid='category-list']")
        this.lobby = this.page.locator("a[data-testid='category-lobby-tab-button']")
        this.live = this.page.locator("a[tab-id='live']")
        this.football = this.page.getByTestId('category-list').getByRole('link', { name: 'Football', exact: true })
        this.basketball = this.page.getByTestId('category-list').getByRole('link', { name: 'Basketball', exact: true })
        this.winterSports = this.page.getByTestId('category-list').getByRole('link', { name: 'Winter Sports', exact: true})
        this.iceHockey = this.page.getByTestId('category-list').getByRole('link', { name: 'Ice Hockey', exact: true})
        this.americanFootball = this.page.getByTestId('category-list').getByRole('link', { name: 'American Football', exact: true})
        this.eSports = this.page.getByTestId('category-list').getByRole('link', { name: 'Esports', exact: true})
        // this.boxing = this.page.locator("a[href='/en/sports/boxing']")
        this.handball = this.page.getByTestId('category-list').getByRole('link', { name: 'Handball', exact: true})
        this.mma = this.page.getByTestId('category-list').getByRole('link', { name: 'MMA', exact: true})
        this.volleyball = this.page.getByTestId('category-list').getByRole('link', { name: 'Volleyball', exact: true})
        this.allCategories = this.page.locator("button[data-testid='category-all-sports-tab-button']")
        this.allCategoriesDialog = new AllSportsCategories(page)
    }

    async assertSportsCategoryList() {
        await expect(this.categoryList).toBeVisible()
        await expect(this.lobby).toBeVisible()
        await expect(this.live).toBeVisible()
        await expect(this.football).toBeVisible()
        await expect(this.basketball).toBeVisible()
        await expect(this.iceHockey).toBeVisible()
        await expect(this.winterSports).toBeVisible()
        await expect(this.americanFootball).toBeVisible()
        await expect(this.eSports).toBeVisible()
        // await expect(this.boxing).toBeVisible()
        await expect(this.handball).toBeVisible()
        await expect(this.mma).toBeVisible()
        await expect(this.volleyball).toBeVisible()
        await expect(this.allCategories).toBeVisible()
    }
}


class BetSlip {
    constructor(page) {
        this.page = page
        this.container = this.page.getByTestId("betslip-container")

        // tabs
        this.singleTab = this.page.getByTestId("betslip-single-tab-button")
        this.combo = this.page.getByTestId("betslip-combo-tab-button")
        this.system = this.page.getByTestId("betslip-system-tab-button")
        this.betBuilder = this.page.locator("button[tab-id='BET_BUILDER']")

        // elements
        this.clearAll = this.page.getByTestId("betslip-clear-all-button")
        this.selectedEvent = this.page.getByTestId("betslip-selection")
        this.oddsCalculation = this.page.locator("div[class='_1bkws1r3']")
        this.stakeInput = this.page.getByTestId('betslip-single-tab').getByTestId('stake-input')
        this.placeBetBtn = this.page.getByTestId('betslip-single-tab').getByTestId('place-bet-button')
        this.keepSelected = this.page.locator("//*[text()='Keep selections in betslip']//parent::label")

        this.closeIcon = this.page.getByTestId("close-modal")

    }

    async assertBetslipElementsVisibility() {
        await expect(this.container).toBeVisible()
        await expect(this.singleTab).toBeVisible()
        await expect(this.combo).toBeVisible()
        await expect(this.system).toBeVisible()
        await expect(this.betBuilder).toBeVisible()
        await expect(this.clearAll).toBeVisible()
        await expect(this.selectedEvent).toBeVisible()
        await expect(this.oddsCalculation).toBeVisible()
        await expect(this.stakeInput).toBeVisible()
        await expect(this.placeBetBtn).toBeVisible()
        await expect(this.keepSelected).toBeVisible()
        await expect(this.closeIcon).toBeVisible()
    }
}


class FloatingBetSlip {
    constructor(page) {
        this.page = page
        this.floatingWindow = this.page.getByTestId("betslip-floater")
        this.totalBets = this.page.locator("//div[@data-testid='betslip-floater']//div[@class='soazps4 soazps5']")
        this.closeIcon = this.page.locator("//*[@data-testid='betslip-floater']//button")
    }
}

class EventContainer {
    constructor(page) {
        this.page = page
        this.events = this.page.getByTestId("match-container")
        this.odds = this.page.getByTestId("outcome-button")
        this.quickBet = this.page.getByTestId("quickbet-container")
    }
}



class AllSportsCategories {
    constructor(page) {
        this.page = page
        this.allSportsDialog = this.page.locator("div[data-testid='all-sports-container']")
        this.closeIcon = this.page.locator("button[data-testid='close-modal']")
        this.sporstsList = this.page.locator("//*[@data-testid='all-sports-container']//div[@class='z4xga81']")
        this.sporstsSlider = this.page.locator("div[class='soazps0 z4xga8e']")
    }
    async assertAllSportsDialogElements() {
        await expect(this.allSportsDialog).toBeVisible()
        await expect(this.closeIcon).toBeVisible()
        await expect(this.sporstsList).toBeVisible()
        await expect(this.sporstsSlider).toBeVisible()
    }
}


class CookiesBanner {
    constructor(page) {
        this.page = page
        this.banner = this.page.locator("div[id='CybotCookiebotDialog']")
        this.allowBtn = this.page.locator("button[id='CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll']")
        this.denyBtn = this.page.locator("button[id='CybotCookiebotDialogBodyButtonDecline']")
        this.customizeBtn = this.page.locator("button[id='CybotCookiebotDialogBodyLevelButtonCustomize']")
    }

    async assertCookiesBannerElements() {
        await expect(this.banner).toBeVisible()
        await expect(this.allowBtn).toBeVisible()
        await expect(this.denyBtn).toBeVisible()
        await expect(this.customizeBtn).toBeVisible()
    }

    async acceptCookies() {
        if (this.banner.isVisible()) {
            await this.allowBtn.click()
        }
    }
}


class PlayerMenu {
    constructor(page) {
        this.page = page
        this.logo = this.page.locator("div[class='_1hf55o0 pibir73']")
        this.closeIcon = this.page.locator("button[data-testid='close-modal']")
        this.language = this.page.getByTestId("sidebar").getByTestId("language-button")
        this.shareBet = this.page.getByTestId('sidebar').getByRole('link', { name: 'Share your bet Coming Soon!' })

        this.myAccount = this.page.locator("div[data-testid='my-account-button']")
        this.myRewards = this.page.locator("div[data-testid='inventory-button']")
        this.promotions = this.page.locator("div[data-testid='promotions-button']")
        this.myBets = this.page.locator("div[data-testid='my-bets-button']")
        this.verification = this.page.locator("//*[contains(text(), 'Verification')]/ancestor::div[@class='pointer _1sjaub80']")
        this.sustainableGaming = this.page.locator("div[data-testid='sustainable-gaming-button']")
        this.settings = this.page.locator("//*[contains(text(), 'Settings')]/ancestor::div[@class='pointer _1sjaub80']")
        this.transactions = this.page.locator("//*[contains(text(), 'Transactions')]/ancestor::div[@class='pointer _1sjaub80']")
        this.faq = this.page.locator("div[data-testid='faq-button']")
        this.supportChat = this.page.locator("//*[contains(text(), 'Support Chat')]/ancestor::div[@class='pointer _1sjaub80']")
        this.depositBtn = this.page.locator("//div[@data-testid='sidebar']//button[@class='_304csjn _304csj4 _304csj7']")
        this.withdrawalBtn = this.page.locator("//div[@data-testid='sidebar']//button[@class='_304csjn _304csj4 _304csjf']")
    }

    async assertPlayerMenuElements() {
        await expect(this.logo).toBeVisible()
        await expect(this.closeIcon).toBeVisible()
        await expect(this.language).toBeVisible()
        await expect(this.shareBet).toBeVisible()
        await expect(this.myAccount).toBeVisible()
        await expect(this.myRewards).toBeVisible()
        await expect(this.promotions).toBeVisible()
        await expect(this.myBets).toBeVisible()
        await expect(this.verification).toBeVisible()
        await expect(this.sustainableGaming).toBeVisible()
        await expect(this.settings).toBeVisible()
        await expect(this.transactions).toBeVisible()
        await expect(this.faq).toBeVisible()
        await expect(this.supportChat).toBeVisible()
        await expect(this.depositBtn).toBeVisible()
        await expect(this.withdrawalBtn).toBeVisible()
    }
}

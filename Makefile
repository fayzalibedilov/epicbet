run-chromium:
	npx playwright test --project chromium --headed


run-headless:
	npx playwright test --project chromium


allure-reports:
	allure serve allur-results
const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/home-page');
const { CookieConsentDialog } = require('../pages/cookie-consent-dialog');

test.describe('geoIP tests (not sportland.com)', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name === 'sportland-com', 'Skipped on sportland.com');
  });

  test('geoIP popup appears on homepage', async ({ page }) => {
    const homePage = new HomePage(page);

    await test.step('Navigate to the homepage', async () => {
      await homePage.openPage();
    });

    await test.step('Verify geoIP banner is visible', async () => {
      await homePage.verifyWelcomeBannerVisible();
    });
  });

  test('user can stay on current site', async ({ page }) => {
    const homePage = new HomePage(page);

    await test.step('Navigate to the homepage', async () => {
      await homePage.openPage();
    });

    await test.step('Verify geoIP banner is visible', async () => {
      await homePage.verifyWelcomeBannerVisible();
    });

    await test.step('Verify and click stay on current store', async () => {
      await homePage.verifyUserCanStayOnCurrentStore();
    });
    
    await test.step('Verify geoIP popup is closed and URL remains the same', async () => {
      await homePage.verifyGeoIPPopupNotVisible();
      await expect(page).toHaveURL(homePage.getCurrentURL());
    });
  });

  test('user is redirected to sportland.com when clicking continue to international', async ({ page }) => {
    const homePage = new HomePage(page);

    await test.step('Navigate to the homepage', async () => {
      await homePage.openPage();
    });

    // Verify geoIP popup is visible
    await test.step('Verify geoIP banner is visible', async () => {
      await homePage.verifyWelcomeBannerVisible();
    });

    // Click on continue to international button and verify redirect
    await test.step('Click continue to international button', async () => {
      await homePage.clickContinueToInternational();
    });

    await test.step('Verify geoIP popup is closed', async () => {
      await homePage.verifyGeoIPPopupNotVisible();
      await expect(page).toHaveURL(/sportland\.com/);
    });

    // Verify with screenshot that we are on sportland.com
    await expect(page).toHaveScreenshot('sportland-homepage.png');
  });
});
// TODO from here
test.describe('sportland.com only', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'sportland-com', 'This test only runs on sportland-com');
  });

  test('geoIP popup does not appear on sportland.com', async ({ page }) => {
    const homePage = new HomePage(page);

    // Navigate to the homepage using baseURL from config
    await homePage.openPage();

    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');

    // Verify geoIP popup is NOT visible
    await homePage.verifyWelcomeBannerNotVisible();
  });
});


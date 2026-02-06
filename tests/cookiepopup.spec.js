const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/home-page');
const { CookieConsentDialog } = require('../pages/cookie-consent-dialog');

test.describe('Cookie popup tests', () => {
  // Tests for sites with geoIP popup (EE and LV)
  test.describe('sites with geoIP popup', () => {
    test.beforeEach(async ({}, testInfo) => {
      // Skip on sportland.com - no geoIP popup there
      test.skip(testInfo.project.name === 'sportland-com', 'Skipped on sportland.com - no geoIP popup');
    });

    test('cookie popup appears after geoIP selection', async ({ page }) => {
      const homePage = new HomePage(page);
      const cookieConsentDialog = new CookieConsentDialog(page);

      // Use smart navigation that handles geoIP flow automatically
      await homePage.navigateWithGeoIPFlow();

      // Verify cookie popup is visible
      await cookieConsentDialog.verifyDialogVisible();

      // Verify cookie consent text is displayed (locale-aware)
      await cookieConsentDialog.verifyCookieConsentTextByLocale();
    });

    test('cookie popup blocks page interaction', async ({ page }) => {
      const homePage = new HomePage(page);
      const cookieConsentDialog = new CookieConsentDialog(page);

      // Use smart navigation that handles geoIP flow automatically
      await homePage.navigateWithGeoIPFlow();

      // Verify cookie popup is visible
      await cookieConsentDialog.verifyDialogVisible();

      // Verify that cookie popup blocks interaction with the rest of the site
      await cookieConsentDialog.verifyPopupBlocksInteraction();

      // Accept cookies to dismiss popup
      await cookieConsentDialog.acceptAllCookies();

      // Verify page becomes interactive after accepting cookies
      await cookieConsentDialog.verifyPageIsInteractive();
    });
  });

  // Test for sportland.com - no geoIP popup, cookie popup appears directly
  test.describe('sportland.com only', () => {
    test.beforeEach(async ({}, testInfo) => {
      test.skip(testInfo.project.name !== 'sportland-com', 'This test only runs on sportland.com');
    });

    test('cookie popup appears directly on homepage', async ({ page }) => {
      const homePage = new HomePage(page);
      const cookieConsentDialog = new CookieConsentDialog(page);

      // Navigate to homepage
      await homePage.openPage();

      // Wait for page to fully load
      await page.waitForLoadState('networkidle');

      // Verify geoIP popup is NOT visible (this is expected for sportland.com)
      await homePage.verifyGeoIPPopupNotVisible();

      // Verify cookie popup is visible
      await cookieConsentDialog.verifyDialogVisible();

      // Verify cookie consent text (locale-aware)
      await cookieConsentDialog.verifyCookieConsentTextByLocale();
    });

    test('cookie popup blocks page interaction', async ({ page }) => {
      const homePage = new HomePage(page);
      const cookieConsentDialog = new CookieConsentDialog(page);

      // Navigate to homepage (no geoIP flow for sportland.com)
      await homePage.openPage();

      // Wait for page to fully load
      await page.waitForLoadState('networkidle');

      // Verify geoIP popup is NOT visible (this is expected for sportland.com)
      await homePage.verifyGeoIPPopupNotVisible();

      // Verify cookie popup is visible
      await cookieConsentDialog.verifyDialogVisible();

      // Verify that cookie popup blocks interaction with the rest of the site
      await cookieConsentDialog.verifyPopupBlocksInteraction();

      // Accept cookies to dismiss popup
      await cookieConsentDialog.acceptAllCookies();

      // Verify page becomes interactive after accepting cookies
      await cookieConsentDialog.verifyPageIsInteractive();
    });
  });
});

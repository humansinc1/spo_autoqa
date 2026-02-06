const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/home-page');
const { CookieConsentDialog } = require('../pages/cookie-consent-dialog');
const { test: geoIPTest } = require('./fixtures/geoip.fixture');

test.describe('Cookie popup tests', () => {
  geoIPTest('cookie popup appears after page load', async ({ pageWithGeoIPHandled }) => {
    const cookieConsentDialog = new CookieConsentDialog(pageWithGeoIPHandled);

    // Verify cookie popup is visible
    await cookieConsentDialog.verifyDialogVisible();

    // Verify cookie consent text is displayed (locale-aware)
    await cookieConsentDialog.verifyCookieConsentTextByLocale();
  });

  geoIPTest('cookie popup blocks page interaction', async ({ pageWithGeoIPHandled }) => {
    const cookieConsentDialog = new CookieConsentDialog(pageWithGeoIPHandled);

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

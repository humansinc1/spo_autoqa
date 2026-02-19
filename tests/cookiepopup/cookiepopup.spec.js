const { test } = require('@playwright/test');
const { CookieConsentDialog } = require('../../pages/cookie-consent-dialog');
const { test: geoIPTest } = require('../../fixtures/geoip.fixture');

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

    // Accept cookies to dismiss popup so page can be interacted with
    await cookieConsentDialog.acceptAllCookies();

    // Verify page becomes interactive after accepting cookies
    await cookieConsentDialog.verifyPageIsInteractive();
  });

  geoIPTest('cookie popup stores allow-all cookie after accepting all', async ({ pageWithGeoIPHandled }) => {
    const cookieConsentDialog = new CookieConsentDialog(pageWithGeoIPHandled);

    // Verify cookie popup is visible
    await cookieConsentDialog.verifyDialogVisible();

    // Accept all cookies
    await cookieConsentDialog.acceptAllCookies();

    // Verify consent cookie is stored for allow-all consent
    await cookieConsentDialog.verifyAcceptAllCookie();
  });

  geoIPTest('cookie popup stores necessary-only cookie after accepting necessary', async ({ pageWithGeoIPHandled }) => {
    const cookieConsentDialog = new CookieConsentDialog(pageWithGeoIPHandled);

    // Verify cookie popup is visible
    await cookieConsentDialog.verifyDialogVisible();

    // Accept only necessary cookies
    await cookieConsentDialog.acceptNecessaryCookies();

    // Verify consent cookie is stored for necessary-only consent
    await cookieConsentDialog.verifyAcceptNecessaryCookie();
  });
});

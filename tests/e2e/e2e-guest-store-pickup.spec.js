import { test } from '@playwright/test';
import { HomePage } from '../../pages/home-page.js';
import { CookieConsentDialog } from '../../pages/cookie-consent-dialog.js';
import { MenuOverlay } from '../../pages/menu-overlay.js';
import { ProductListingPage } from '../../pages/plp.js';
import { Pdp } from '../../pages/pdp.js';
import { Checkout } from '../../pages/checkout.js';

test('E2E: Guest one product/store pickup/swedbank checkout', async ({ page }, testInfo) => {
  const homePage = new HomePage(page);
  const cookieConsent = new CookieConsentDialog(page);
  const menuOverlay = new MenuOverlay(page);
  const productListingPage = new ProductListingPage(page);
  const pdp = new Pdp(page);
  const checkout = new Checkout(page);

  await test.step('Navigate to product', async () => {
    await homePage.navigateWithGeoIPFlow();
    await cookieConsent.acceptAllCookiesIfVisible();
    await menuOverlay.navigateToCategory(2, 1);
    await productListingPage.clickFirstProduct();
  });

  await test.step('Add product to cart and proceed to checkout', async () => {
    await pdp.addToCartFirstAvailableSize();
    await pdp.miniCartClickCheckoutButton();
    await checkout.clickContinueAsGuest();
  });

  await test.step('Complete checkout with store pickup', async () => {
    await checkout.completeGuestCheckoutStorePickup(testInfo);
  });
});

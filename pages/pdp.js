const { expect } = require('@playwright/test');
const { BasePage } = require('./base-page');
const { CookieConsentDialog } = require('./cookie-consent-dialog');

/**
 * Page object for Product Detail Page (PDP).
 */
class Pdp extends BasePage {
  constructor(page) {
    super(page);
    this.baseURL = '/';
    this.cookieConsentDialog = new CookieConsentDialog(page);
  }

  /**
   * Locator for the first available size button.
   */
  get firstAvailableSizeButton() {
    return this.page.locator('.ProductConfigurableAttributes-SwatchList_isSuperPdp > a:not(.ProductAttributeValue_isNotAvailable)').nth(0);
  }

  /**
   * Locator for the add to cart button.
   */
  get addToCartButton() {
    return this.page.locator('.ProductActions-AddToCart');
  }

  /**
   * Locator for mini cart checkout button.
   */
  get miniCartCheckoutButton() {
    return this.page.locator('.CartOverlay-CheckoutButton:not(.Button_disabled)');
  }

  /**
   * Open a specific product page.
   * @param {string} baseUrl - The base URL
   * @param {string} pageUrl - The product page URL
   */
  async openPage(baseUrl, pageUrl) {
    await super.navigate(baseUrl + pageUrl);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Accept all cookies on the PDP.
   */
  async acceptAllCookies() {
    try {
      const acceptButton = this.cookieConsentDialog.acceptAllButton;
      if (await acceptButton.isVisible({ timeout: 2000 })) {
        await acceptButton.click();
        await this.page.waitForLoadState('networkidle');
      }
    } catch {
      // Cookie popup may be absent or already closed
    }
  }

  /**
   * Add the first available size product to cart.
   */
  async addToCartFirstAvailableSize() {
    const sizeButton = this.firstAvailableSizeButton;
    await expect(sizeButton).toBeVisible();
    await sizeButton.click();
    await expect(this.addToCartButton).toBeEnabled();
    await this.addToCartButton.click();
  }

  /**
   * Click checkout button in mini cart.
   */
  async miniCartClickCheckoutButton() {
    await expect(this.miniCartCheckoutButton).toBeEnabled();
    await this.miniCartCheckoutButton.click();
  }
}

module.exports = { Pdp };

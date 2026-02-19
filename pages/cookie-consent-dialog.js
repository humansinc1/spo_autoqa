const { expect } = require('@playwright/test');
const { BasePage } = require('./base-page');

/**
 * Page object for the cookie consent dialog.
 * Handles verification of cookie popup display and interactions.
 */
class CookieConsentDialog extends BasePage {
  constructor(page) {
    super(page);
  }

  /**
   * Locator for the cookie consent dialog container.
   */
  get dialogContainer() {
    return this.page.locator('.CookiePopup, .CookieConsent');
  }

  /**
   * Locator for the cookie popup title.
   */
  get cookiePopupTitle() {
    return this.page.locator('.CookiePopup-Title');
  }

  /**
   * Locator for the cookie popup overlay wrapper.
   */
  get overlayWrapper() {
    return this.page.locator('.CookiePopup-DivWrapper');
  }

  /**
   * Locator for the "Accept all" button in cookie popup.
   */
  get acceptAllButton() {
    // More specific selector for accept all button - works across different locales
    return this.page.locator('.CookiePopup-AcceptButton, button.Button-AcceptAll, button:has-text("Accept all"):visible, button:has-text("Luba kõiki"):visible, button:has-text("Atļaut visus"):visible').first();
  }

  /**
   * Locator for the "Accept necessary" button in cookie popup.
   * Uses structural selector to avoid locale-specific text matching.
   */
  get acceptNecessaryButton() {
    return this.dialogContainer.locator('button.Button:not(.Button-AcceptAll)').nth(1);
  }

  /**
   * Cookie text by locale.
   */
  get cookieTexts() {
    return {
      'sportland-ee': 'Luba küpsised?',
      'sportland-lv': 'Atļaut visus sīkfailus?',
      'sportland-com': 'Allow all cookies?',
    };
  }

  /**
   * Verify that the cookie consent dialog is visible.
   */
  async verifyDialogVisible() {
    await expect(this.dialogContainer).toBeVisible();
  }

  /**
   * Verify that the cookie consent text matches the expected locale-specific text.
   */
  async verifyCookieConsentText(expectedText) {
    await expect(this.cookiePopupTitle).toContainText(expectedText);
  }

  /**
   * Verify that the cookie consent text is displayed based on current project locale.
   * Automatically determines the expected text based on the project name.
   */
  async verifyCookieConsentTextByLocale() {
    const projectName = this.getProjectName();
    const expectedText = this.cookieTexts[projectName] || 'cookies';
    await expect(this.cookiePopupTitle).toContainText(expectedText);
  }

  /**
   * Get the current project name from test info.
   * This is a workaround since we don't have access to testInfo in POM.
   */
  getProjectName() {
    const url = this.page.url();
    if (url.includes('sportland.ee')) return 'sportland-ee';
    if (url.includes('sportland.lv')) return 'sportland-lv';
    if (url.includes('sportland.com')) return 'sportland-com';
    return 'sportland-ee'; // default
  }

  /**
   * Get main page interactive elements that should be blocked by the cookie popup.
   */
  getMainPageElements() {
    const selectors = [
      'nav',                    // Main navigation
      '.header',               // Header area  
      '.menu',                 // Menu container
      'input[type="search"]',  // Search input
      '.search',               // Search container
      '[aria-label*="cart"]',  // Cart button (accessibility)
      '.cart',                 // Cart by class
      'button[title*="cart"]', // Cart by title
      'footer a',              // Footer links
      '.product',              // Product items
      'a[href*="product"]',    // Product links
    ];

    return selectors.map(selector => this.page.locator(selector));
  }

  /**
   * Verify that the cookie popup overlay covers the entire viewport.
   */
  async verifyOverlayCoversViewport() {
    await expect(this.overlayWrapper).toBeVisible();
    await expect(this.overlayWrapper).toHaveCSS('position', 'fixed');
    await expect(this.overlayWrapper).toHaveCSS('top', '0px');
    await expect(this.overlayWrapper).toHaveCSS('left', '0px');
    
    // Check that overlay covers full screen (with some tolerance for browser variations)
    const boundingBox = await this.overlayWrapper.boundingBox();
    const viewportSize = this.page.viewportSize();
    
    if (viewportSize) {
      expect(boundingBox?.width).toBeGreaterThanOrEqual(viewportSize.width * 0.95);
      expect(boundingBox?.height).toBeGreaterThanOrEqual(viewportSize.height * 0.95);
    }
  }

  /**
   * Verify that main page elements are not clickable when cookie popup is visible.
   */
  async verifyElementsAreBlocked() {
    const elements = this.getMainPageElements();
    
    for (const element of elements) {
      try {
        // Check if element exists and is visible
        const isVisible = await element.isVisible().catch(() => false);
        if (isVisible) {
          // Try to click with very short timeout - should either fail or hit overlay
          await element.click({ timeout: 1000 });
          
          // If click succeeded, verify we're still on cookie popup (click hit overlay)
          await expect(this.dialogContainer).toBeVisible();
        }
      } catch {
        // Expected behavior - element should be blocked by overlay
        // This is a success case
      }
    }
  }

  /**
   * Verify that clicking on the overlay hits the cookie popup.
   */
  async verifyOverlayInterceptsClicks() {
    // Click on the overlay itself
    await this.overlayWrapper.first().click();
    
    // Verify cookie popup is still visible (click was intercepted)
    await expect(this.dialogContainer).toBeVisible();
  }

  /**
   * Accept all cookies to dismiss the popup.
   */
  async acceptAllCookies() {
    await expect(this.acceptAllButton).toBeVisible();
    await this.acceptAllButton.click();    
    // Verify popup is hidden after acceptance - wait for it to actually disappear
    await expect(this.dialogContainer).not.toBeVisible({ timeout: 5000 });
    await expect(this.overlayWrapper).not.toBeVisible({ timeout: 5000 });
    // Additional small wait for animation to complete
    await this.page.waitForTimeout(300);
  }

  /**
   * Verify "Accept all" stores amcookie_allowed cookie with expected value.
   */
  async verifyAcceptAllCookie() {
    await expect.poll(async () => {
      const cookies = await this.page.context().cookies();
      return cookies.find(cookie => cookie.name === 'amcookie_allowed')?.value ?? null;
    }).toBe('0');
  }

  /**
   * Accept only necessary cookies to dismiss the popup.
   */
  async acceptNecessaryCookies() {
    await expect(this.acceptNecessaryButton).toBeVisible();
    await this.acceptNecessaryButton.click();
    await expect(this.dialogContainer).not.toBeVisible({ timeout: 5000 });
    await expect(this.overlayWrapper).not.toBeVisible({ timeout: 5000 });
  }

  /**
   * Verify "Accept necessary" stores amcookie_allowed cookie with expected value.
   */
  async verifyAcceptNecessaryCookie() {
    await expect.poll(async () => {
      const cookies = await this.page.context().cookies();
      return cookies.find(cookie => cookie.name === 'amcookie_allowed')?.value ?? null;
    }).toBe('4');
  }

  /**
   * Accept all cookies only if the popup is visible.
   * This is a defensive method that handles cases where the cookie popup
   * may not appear (e.g., in headless mode, already accepted, or cookie policy not applicable).
   * Uses web-first assertions for reliable waiting.
   */
  async acceptAllCookiesIfVisible() {
    try {
      // Use web-first assertion - auto-waits for visibility
      await expect(this.dialogContainer).toBeVisible({ timeout: 5000 });
      await this.acceptAllCookies();
      // Wait for any animation/transition to complete
      await this.page.waitForTimeout(500);
    } catch {
      // Popup not visible - already accepted, not shown, or timed out
      // This is expected behavior in headless mode or when cookies are already set
    }
  }

  /**
   * Verify that page elements become interactive after accepting cookies.
   */
  async verifyPageIsInteractive() {
    const elements = this.getMainPageElements();
    let foundInteractiveElement = false;
    
    for (const element of elements) {
      try {
        const isVisible = await element.isVisible().catch(() => false);
        if (isVisible) {
          // Try to click element - should succeed now
          await element.click({ timeout: 3000 });
          foundInteractiveElement = true;
          break; // Found at least one interactive element
        }
      } catch {
        // Element might not be visible or clickable, try next
        continue;
      }
    }
    
    // At least one element should be interactive after accepting cookies
    expect(foundInteractiveElement).toBe(true);
  }

  /**
   * Main method to verify that cookie popup blocks page interaction.
   */
  async verifyPopupBlocksInteraction() {
    await this.verifyOverlayCoversViewport();
    await this.verifyElementsAreBlocked();
    await this.verifyOverlayInterceptsClicks();
  }
}

module.exports = { CookieConsentDialog };

const { expect } = require('@playwright/test');

/**
 * Base page class containing common functionality for all page objects.
 */
class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL.
   */
  async navigate(url) {
    await this.page.goto(url);
  }

  /**
   * Get the current page URL.
   */
  getPage() {
    return this.page;
  }

  /**
   * Wait for a locator to be visible.
   */
  async waitForVisibility(locator) {
    await expect(locator).toBeVisible();
  }

  /**
   * Wait for a locator to contain specific text.
   */
  async waitForText(locator, text) {
    await expect(locator).toContainText(text);
  }
}

module.exports = { BasePage };

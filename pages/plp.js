const { BasePage } = require('./base-page');

/**
 * Page object for Product Listing Page (PLP).
 * Handles interactions with product cards and listings.
 */
class ProductListingPage extends BasePage {
  constructor(page) {
    super(page);
  }

  /**
   * Locator for product card links.
   */
  get productCardLinks() {
    return this.page.locator('.ProductCard a');
  }

  /**
   * Click on the first product card link.
   */
  async clickFirstProduct() {
    await this.productCardLinks.first().click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click on the nth product card link (0-based index).
   * @param {number} index - Index of the product card to click (0-based)
   */
  async clickNthProduct(index) {
    await this.productCardLinks.nth(index).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get the total number of products on the page.
   * @returns {Promise<number>} Number of product cards
   */
  async getProductCount() {
    return await this.productCardLinks.count();
  }
}

module.exports = { ProductListingPage };

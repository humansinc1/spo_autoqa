const { BasePage } = require('./base-page');

/**
 * Page object for the main menu overlay navigation.
 * Handles navigation through category menu items and submenus.
 */
class MenuOverlay extends BasePage {
  constructor(page) {
    super(page);
  }

  /**
   * Locator for main menu items (direct children of the item list).
   */
  get menuItems() {
    return this.page.locator('.MenuOverlay-ItemList > .MenuOverlay-Item');
  }

  /**
   * Locator for submenu links (direct children of container submenu).
   */
  get subMenuLinks() {
    return this.page.locator('.MenuOverlay-ContainerSubMenu > .MenuOverlay-Link');
  }

  /**
   * Hover over a menu item by index (0-based).
   * @param {number} index - Index of the menu item to hover over
   */
  async hoverMenuItem(index) {
    await this.menuItems.nth(index).hover();
  }

  /**
   * Click on a submenu link by index (0-based).
   * @param {number} index - Index of the submenu link to click
   */
  async clickSubMenuLink(index) {
    await this.subMenuLinks.nth(index).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to a category by hovering over menu item and clicking submenu.
   * @param {number} menuIndex - Index of the menu item to hover (0-based)
   * @param {number} subMenuIndex - Index of the submenu link to click (0-based)
   */
  async navigateToCategory(menuIndex, subMenuIndex) {
    // Hover over the main menu item
    await this.menuItems.nth(menuIndex).hover();
    await this.page.waitForTimeout(300); // Wait for submenu to appear
    
    // Click on the submenu link
    await this.subMenuLinks.nth(subMenuIndex).click({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = { MenuOverlay };

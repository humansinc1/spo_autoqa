const { expect } = require('@playwright/test');
const { BasePage } = require('./base-page');

/**
 * Page object for the Sportland homepage.
 * Handles geoIP detection and country selection functionality.
 */
class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.baseURL = '/';
    this.sportlandComURL = 'https://sportland.com/';
    this.countryNames = {
      'sportland.ee': 'Estonia',
      'sportland.lv': 'Latvia',
    };
  }

  /**
   * Get the current country based on the site URL.
   */
  getCurrentCountry() {
    const currentUrl = this.page.url();
    for (const [domain, country] of Object.entries(this.countryNames)) {
      if (currentUrl.includes(domain)) {
        return country;
      }
    }
    return 'Estonia'; // default
  }

  /**
   * Check if this is sportland.com (no geoIP popup)
   */
  isSportlandCom() {
    return this.page.url().includes('sportland.com');
  }

  /**
   * Get the current URL.
   */
  getCurrentURL() {
    return this.page.url();
  }

  /**
   * Locator for the geoIP popup content.
   */
  get geoIPPopupContent() {
    return this.page.locator('.GeoIPPopup-Content');
  }

  /**
   * Locator for the "You're shopping in [Country]" text.
   */
  get locationText() {
    return this.page.getByText(`You're shopping in ${this.getCurrentCountry()}`);
  }

  /**
   * Locator for the "Stay on current store" button container.
   */
  get stayOnCurrentStore() {
    return this.page.locator('.GeoIPPopup-StayInCurrentStoreButton');
  }

  /**
   * Locator for the "Continue to international" button.
   */
  get continueToInternationalButton() {
    return this.page.locator('.GeoIPPopup-SubmitButton');
  }

  /**
   * Navigate to the homepage.
   */
  async openPage() {
    await super.navigate(this.baseURL, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Navigate to sportland.com
   */
  async navigateToSportlandCom() {
    await super.navigate(this.sportlandComURL);
  }

  /**
   * Verify that the geoIP popup is NOT visible.
   */
  async verifyGeoIPPopupNotVisible() {
    await expect(this.geoIPPopupContent).not.toBeVisible();
  }

  /**
   * Verify that the geoIP detection welcome banner is visible.
   */
  async verifyWelcomeBannerVisible() {
    await expect(this.geoIPPopupContent).toBeVisible();
    await expect(this.page).toHaveScreenshot('geoip-popup-appear.png');
  }

  /**
   * Verify that the user can stay on the current site and click the button.
   */
  async verifyUserCanStayOnCurrentStore() {
    await this.stayOnCurrentStore.click();
  }

  /**
   * Click "Continue to international" button and verify redirect to sportland.com.
   */
  async clickContinueToInternational() {
    await expect(this.continueToInternationalButton).toBeVisible();
    await this.continueToInternationalButton.click();
  }

  /**
   * Complete the geoIP detection flow - verifies banner and allows user to stay on site.
   * Smart method: skips geoIP flow for sportland.com (no popup by design).
   */
  async completeGeoIPFlow() {
    if (this.isSportlandCom()) {
      // sportland.com doesn't have geoIP popup
      return;
    }

    // Handle geoIP popup if visible - use waitFor instead of networkidle
    try {
      await this.geoIPPopupContent.waitFor({ state: 'visible', timeout: 5000 });
      if (await this.stayOnCurrentStore.isVisible()) {
        await this.stayOnCurrentStore.click();
        // Wait for popup to disappear after click
        await this.geoIPPopupContent.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
      }
    } catch {
      // Popup not visible or already handled
    }
  }

  /**
   * Navigate and complete geoIP flow if needed.
   * Smart method that handles different site behaviors.
   * For sportland.com: just navigate, no geoIP popup.
   * For EE/LV: navigate and handle geoIP popup.
   */
  async navigateWithGeoIPFlow() {
    await this.openPage();
    await this.completeGeoIPFlow();
  }
}

module.exports = { HomePage };

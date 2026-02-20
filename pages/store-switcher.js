const { expect } = require('@playwright/test');
const { BasePage } = require('./base-page');
const { HomePage } = require('./home-page');
const { CookieConsentDialog } = require('./cookie-consent-dialog');
const { storeSwitcherData } = require('../test-data/store-switcher');

class StoreSwitcherPage extends BasePage {
  constructor(page) {
    super(page);
    this.homePage = new HomePage(page);
    this.cookieConsentDialog = new CookieConsentDialog(page);
    this.sel = storeSwitcherData.selectors;
  }

  get desktopSwitcher() {
    return this.page.locator(this.sel.switcher).first();
  }

  get mobileMenuContainer() {
    return this.page.locator(this.sel.mobileMenuContainer).first();
  }

  get mobileMenuSwitcher() {
    return this.page.locator(this.sel.mobileMenuSwitcher).first();
  }

  get mobileMenuButton() {
    return this.page.locator(this.sel.mobileMenuButton).first();
  }

  get fallbackSwitcher() {
    return this.page.locator(this.sel.switcher).first();
  }

  async openHomeAndDismissBlockingPopups() {
    await this.homePage.navigateWithGeoIPFlow();
    await this.cookieConsentDialog.acceptAllCookiesIfVisible();
  }

  async openMobileMenu() {
    if (await this.mobileMenuSwitcher.isVisible().catch(() => false)) {
      return;
    }
    if (await this.mobileMenuButton.isVisible().catch(() => false)) {
      await this.mobileMenuButton.click({ force: true });
      if (await this.mobileMenuContainer.count()) {
        await expect(this.mobileMenuContainer).toBeVisible();
      }
      if (await this.mobileMenuSwitcher.isVisible().catch(() => false)) {
        return;
      }
    }
  }

  async getActiveSwitcher(isMobile) {
    if (isMobile) {
      await this.openMobileMenu();
      if (await this.mobileMenuSwitcher.isVisible().catch(() => false)) {
        return this.mobileMenuSwitcher;
      }
      await expect(this.fallbackSwitcher).toBeVisible();
      return this.fallbackSwitcher;
    }

    await expect(this.desktopSwitcher).toBeVisible();
    const box = await this.desktopSwitcher.boundingBox();
    expect(box).not.toBeNull();
    expect(box.y).toBeLessThan(300);
    return this.desktopSwitcher;
  }

  async openSwitcherDropdown(isMobile) {
    const switcher = await this.getActiveSwitcher(isMobile);
    const wrapper = switcher.locator(this.sel.selectWrapper).first();
    await expect(wrapper).toBeVisible();
    await wrapper.click();
    await expect(switcher.locator(this.sel.optionsMenu)).toBeVisible();
    return switcher;
  }

  async assertSwitcherStyled(isMobile) {
    const switcher = await this.getActiveSwitcher(isMobile);
    await expect(switcher).toBeVisible();
    const wrapper = switcher.locator(this.sel.selectWrapper).first();
    const select = switcher.locator(this.sel.select).first();
    await expect(wrapper).toBeVisible();
    await expect(wrapper).toHaveClass(/Field-SelectWrapper/);
    await expect(select).toBeVisible();
  }

  async getSelectedCode(isMobile) {
    const switcher = await this.getActiveSwitcher(isMobile);
    const select = switcher.locator(this.sel.select).first();
    return (await select.inputValue()).trim();
  }

  async getStoreLinks(isMobile) {
    const switcher = await this.getActiveSwitcher(isMobile);
    return await switcher.locator(this.sel.linksForGoogle).evaluateAll((anchors) =>
      anchors.map((a) => ({
        code: (a.textContent || '').trim().toLowerCase(),
        href: a.href,
      }))
    );
  }

  pickTargetCode(links, selectedCode, preferredCode) {
    const normalizedSelected = (selectedCode || '').toLowerCase();
    const validLinks = links.filter((item) => item.code && item.href);

    if (
      preferredCode &&
      validLinks.some((item) => item.code === preferredCode) &&
      preferredCode !== normalizedSelected
    ) {
      return preferredCode;
    }

    const firstDifferent = validLinks.find((item) => item.code !== normalizedSelected);
    return firstDifferent ? firstDifferent.code : null;
  }

  async assertEveryLinkHasDropdownOption(isMobile, links) {
    const switcher = await this.getActiveSwitcher(isMobile);
    for (const link of links) {
      const option = switcher.locator(this.sel.optionByCode(link.code));
      await expect(option, `Missing option for code: ${link.code}`).toHaveCount(1);
    }
  }

  async selectCountryAndWaitForNavigation(isMobile, targetCode, targetHref) {
    const switcher = await this.openSwitcherDropdown(isMobile);
    const item = switcher.locator(this.sel.optionItemByCode(targetCode)).first();
    const select = switcher.locator(this.sel.select).first();

    const clickAction = async () => {
      if (await item.isVisible().catch(() => false)) {
        await item.click();
        return;
      }
      await select.selectOption(targetCode);
    };

    await Promise.all([
      this.page.waitForURL((url) => new URL(url).host === new URL(targetHref).host, {
        timeout: 20000,
      }),
      clickAction(),
    ]);
  }

  async assertSelectedFlagCode(isMobile, expectedCode) {
    const switcher = await this.getActiveSwitcher(isMobile);
    const select = switcher.locator(this.sel.select).first();
    await expect(select).toHaveValue(expectedCode);
    await expect(select).toHaveAttribute('id', new RegExp(`_${expectedCode}$`));
  }
}

module.exports = { StoreSwitcherPage };

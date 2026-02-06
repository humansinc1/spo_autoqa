// @ts-nocheck
const { test, expect } = require('@playwright/test');
const { HomePage } = require('../../pages/home-page');

/**
 * Фикстура для обработки geoIP popup.
 * Автоматически обрабатывает:
 * - geoIP popup (выбор локального магазина) для EE и LV сайтов
 * - На sportland.com geoIP popup отсутствует
 *
 * Использование:
 * const { test } = require('../fixtures/geoip.fixture');
 *
 * Или использовать напрямую через require в файле conftest.js
 */
exports.test = test.extend({
  /**
   * Страница с обработанным geoIP popup.
   * На sportland.com geoIP popup отсутствует, поэтому просто открывает страницу.
   */
  pageWithGeoIPHandled: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.openPage();

    // Шаг 1: Обработка geoIP popup (только для EE и LV)
    try {
      const stayOnCurrentStore = homePage.stayOnCurrentStore;
      if (await stayOnCurrentStore.isVisible({ timeout: 2000 })) {
        await stayOnCurrentStore.click();
        await page.waitForLoadState('networkidle');
      }
    } catch {
      // geoIP popup может отсутствовать (например, на sportland.com)
    }

    await use(page);
  },

  /**
   * Альтернативный вариант: просто добавляет page в контекст без автоматической обработки.
   * Используйте pageWithGeoIPHandled для автоматической обработки.
   */
  page: async ({ page }, use) => {
    await use(page);
  },
});

exports.expect = expect;

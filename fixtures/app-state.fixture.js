// @ts-nocheck
const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/home-page');
const { CookieConsentDialog } = require('../pages/cookie-consent-dialog');

/**
 * Глобальная фикстура для подготовки состояния приложения перед тестами.
 * Автоматически обрабатывает:
 * - geoIP popup (выбор локального магазина)
 * - cookie consent dialog (принятие всех cookies)
 *
 * Использование:
 * В тестовом файле:
 *   const { test } = require('../fixtures/app-state.fixture');
 *
 * Или использовать напрямую через require в файле conftest.js
 */
exports.test = test.extend({
  /**
   * Подготовленная страница с обработанными popup-окнами.
   */
  preparedPage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    const cookieConsentDialog = new CookieConsentDialog(page);

    await homePage.openPage();

    // Шаг 1: Обработка geoIP popup
    try {
      const stayOnCurrentStore = homePage.stayOnCurrentStore;
      if (await stayOnCurrentStore.isVisible({ timeout: 2000 })) {
        await stayOnCurrentStore.click();
        await page.waitForLoadState('networkidle');
      }
    } catch {
      // geoIP popup может отсутствовать (например, на sportland.com)
    }

    // Шаг 2: Обработка cookie consent popup
    try {
      const acceptButton = cookieConsentDialog.acceptAllButton;
      if (await acceptButton.isVisible({ timeout: 2000 })) {
        await acceptButton.click();
        await page.waitForLoadState('networkidle');
      }
    } catch {
      // cookie popup может отсутствовать или уже быть закрытым
    }

    await use(page);
  },

  /**
   * Альтернативный вариант: просто добавляет page в контекст без автоматической обработки.
   * Используйте preparedPage для автоматической обработки.
   */
  page: async ({ page }, use) => {
    await use(page);
  },
});

exports.expect = expect;

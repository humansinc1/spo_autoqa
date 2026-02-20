const { test, expect } = require('@playwright/test');
const { StoreSwitcherPage } = require('../../pages/store-switcher');
const { storeSwitcherData } = require('../../test-data/store-switcher');

test.describe('Store switcher', () => {
  test('user can switch country and selected flag/code is updated', async ({ page }, testInfo) => {
    test.skip(
      !storeSwitcherData.scopeProjects.includes(testInfo.project.name),
      'This spec runs only on baltic/.com desktop+mobile scope.'
    );

    const storeSwitcherPage = new StoreSwitcherPage(page);
    const isMobileProject = testInfo.project.name.endsWith('-mobile');

    await test.step('Open homepage and clear blockers', async () => {
      await storeSwitcherPage.openHomeAndDismissBlockingPopups();
    });

    await test.step('Store switcher is visible and styled', async () => {
      await storeSwitcherPage.assertSwitcherStyled(isMobileProject);
    });

    const links = await test.step('Store switcher has valid links and options', async () => {
      const localLinks = await storeSwitcherPage.getStoreLinks(isMobileProject);
      expect(localLinks.length).toBeGreaterThan(1);
      for (const link of localLinks) {
        expect(link.href).toMatch(/^https?:\/\//);
      }
      await storeSwitcherPage.assertEveryLinkHasDropdownOption(isMobileProject, localLinks);
      return localLinks;
    });

    let targetCode;
    let targetHref;

    await test.step('Pick target store', async () => {
      const selectedCode = await storeSwitcherPage.getSelectedCode(isMobileProject);
      const preferred = storeSwitcherData.preferredTargetByProject[testInfo.project.name];
      targetCode = storeSwitcherPage.pickTargetCode(links, selectedCode, preferred);
      expect(targetCode).toBeTruthy();
      const target = links.find((item) => item.code === targetCode);
      expect(target).toBeTruthy();
      targetHref = target.href;
    });

    await test.step('Switch to target store and verify url host', async () => {
      await storeSwitcherPage.selectCountryAndWaitForNavigation(
        isMobileProject,
        targetCode,
        targetHref
      );
      await expect.poll(() => new URL(page.url()).host).toBe(new URL(targetHref).host);
    });

    await test.step('Verify selected flag/code in switcher icon control', async () => {
      await storeSwitcherPage.assertSelectedFlagCode(isMobileProject, targetCode);
    });
  });
});

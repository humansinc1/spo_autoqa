const storeSwitcherData = {
  scopeProjects: [
    'sportland-ee',
    'sportland-lv',
    'sportland-lt',
    'sportland-com',
    'sportland-ee-mobile',
    'sportland-lv-mobile',
    'sportland-lt-mobile',
    'sportland-com-mobile',
  ],
  preferredTargetByProject: {
    'sportland-ee': 'lat',
    'sportland-lv': 'est',
    'sportland-lt': 'est',
    'sportland-com': 'est',
    'sportland-ee-mobile': 'lat',
    'sportland-lv-mobile': 'est',
    'sportland-lt-mobile': 'est',
    'sportland-com-mobile': 'est',
  },
  selectors: {
    switcher: '.StoreSwitcher',
    selectWrapper: '.Field-SelectWrapper[aria-label="Select drop-down"]',
    select: 'select[name="StoreSwitcher"], .Field-Select',
    optionsMenu: 'ul[role="menu"]',
    optionItemByCode: (code) => `#ostore_${code}`,
    optionByCode: (code) => `#store_${code}`,
    linksForGoogle: '.StoreSwitcher-LinksForGoogle a[href]',
    mobileMenuButton:
      '.Header-Menu.Header-Menu_device_mobile[aria-label="Go to menu and search"]',
    mobileMenuContainer: 'main',
    mobileMenuSwitcher: 'main .StoreSwitcher',
  },
};

module.exports = { storeSwitcherData };

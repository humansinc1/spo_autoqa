/**
 * URLs configuration for different environments.
 *
 * Usage:
 * - dev: Development environment (sportland-dev-nkx-lv)
 * - demo: Demo environments (demo-sportland-lv, dev-pfr-pl)
 * - live: Production environments (sportland.ee, sportland.com, sportland.lv)
 */

const urls = {
  dev: {
    sportlandEe: 'https://sportland-dev-nkx-ee.readymage.com',
    sportlandLv: 'https://sportland-dev-nkx-lv.readymage.com',
    sportlandCom: 'https://sportland-dev-nkx.readymage.com',
  },
  demo: {
    sportlandEe: 'https://demo-sportland-ee.readymage.com',
    sportlandLv: 'https://demo-sportland-lv.readymage.com',
    sportlandLt: 'https://demo-sportland-lt.readymage.com/',
    sportlandCom: 'https://demo-sportland.readymage.com',
    sportlandOutletLv: 'https://demo-sportland-outlet-lv.readymage.com',
    sportlandOutletEe: 'https://demo-sportland-outlet-ee.readymage.com/',
    sportlandOutletLt: 'https://demo-sportland-outlet-lt.readymage.com/',
    sportlandPl: 'https://sportland-dev-pfr-pl.readymage.com',
  },
  live: {
    sportlandEe: 'https://sportland.ee',
    sportlandCom: 'https://sportland.com',
    sportlandLv: 'https://sportland.lv',
  },
};

// Product paths (same across environments)
const productPaths = {
  productPfr1: '/product/havaianas_m_top_logomania_4147063_2197?footwear_size=7778',
  productPfr2: '/product/dc_mens_trase_tx_shoes_adys300126_bg?footwear_size=6377',
};

module.exports = { urls, productPaths };

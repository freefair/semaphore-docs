const assert = require('node:assert/strict');
const path = require('node:path');
const {test} = require('node:test');
const {loadSiteConfig} = require('@docusaurus/core/lib/server/config');

test('all locales use navigation for the single full-featured product', async () => {
  const {siteConfig} = await loadSiteConfig({siteDir: path.resolve(__dirname, '..')});
  const navigation = JSON.stringify([siteConfig.themeConfig.navbar, siteConfig.themeConfig.footer]);
  assert.doesNotMatch(navigation, /portal\.semaphoreui|\/pricing|\/pro["/]|\/enterprise|subscription-agreement|refund-policy/);
  assert.equal(siteConfig.i18n.locales.length, 11);
  assert.ok(siteConfig.themeConfig.navbar.items.some(item => item.type === 'localeDropdown'));
});

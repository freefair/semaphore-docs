const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {test} = require('node:test');

const docsRoot = path.resolve(__dirname, '..');
const contentRoot = path.join(docsRoot, 'docs');
const translationsRoot = path.join(docsRoot, 'i18n');
const buildDirectory = process.env.DOCS_BUILD_DIR;

const runnerLocales = ['de', 'es', 'fr', 'it', 'ja', 'ko', 'ru'];
const securityLocales = [...runnerLocales, 'pt'];
const pages = [
  {
    route: 'admin-guide/cli/users',
    locales: runnerLocales,
    heading: 'Users',
    marker: 'CLI never prints TOTP secrets or recovery hashes.',
  },
  {
    route: 'admin-guide/cli/runners',
    locales: runnerLocales,
    heading: 'Runners',
    marker: 'the required remediation without including the registration token, runner token,',
  },
  {
    route: 'admin-guide/runners',
    locales: runnerLocales,
    heading: 'Runners',
    marker: 'Secure mode never falls back to plaintext or',
  },
  {
    route: 'admin-guide/configuration',
    locales: securityLocales,
    heading: 'Configuration',
    marker: 'TOTP enrollment and legacy migration fail closed',
  },
  {
    route: 'admin-guide/security',
    locales: securityLocales,
    heading: '🔐 Security',
    marker: 'password-confirmed enrollment, encrypted secrets',
  },
  {
    route: 'user-guide/team',
    locales: securityLocales,
    heading: 'Teams',
    marker: 'Extended RBAC is included without subscription or entitlement checks.',
  },
];

const commercialEntitlementAssertion = /\b(?:requires|available only in|only available in|exclusive to|included with)\s+(?:the\s+)?(?:pro|enterprise|commercial)\b/i;

function localizedSourcePath(locale, route) {
  return path.join(
    translationsRoot,
    locale,
    'docusaurus-plugin-content-docs',
    'current',
    `${route}.md`,
  );
}

test('security-sensitive localized overrides remain absent for canonical-English fallback', () => {
  const fallbacks = pages.flatMap(({route, locales}) => locales.map((locale) => ({locale, route})));
  assert.equal(fallbacks.length, 45, 'the approved security fallback set must stay complete');

  for (const {locale, route} of fallbacks) {
    const override = localizedSourcePath(locale, route);
    assert.equal(
      fs.existsSync(override),
      false,
      `${path.relative(docsRoot, override)} must remain absent; reintroducing a translation requires security-content review`,
    );
  }
});

test('canonical security documents retain the markers used for localized fallback verification', () => {
  for (const {route, heading, marker} of pages) {
    const source = fs.readFileSync(path.join(contentRoot, `${route}.md`), 'utf8');
    assert.match(source, new RegExp(`^# ${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'm'));
    assert.ok(source.replace(/\s+/g, ' ').includes(marker), `${route} must retain its security fallback marker`);
  }
});

test('built localized security pages use the canonical content when DOCS_BUILD_DIR is supplied', () => {
  if (!buildDirectory) return;

  assert.ok(fs.existsSync(buildDirectory), `DOCS_BUILD_DIR does not exist: ${buildDirectory}`);
  assert.ok(fs.statSync(buildDirectory).isDirectory(), `DOCS_BUILD_DIR is not a directory: ${buildDirectory}`);

  for (const {route, locales, heading, marker} of pages) {
    for (const locale of locales) {
      const htmlPath = path.join(buildDirectory, locale, route, 'index.html');
      assert.ok(fs.existsSync(htmlPath), `missing localized route ${locale}/${route}`);
      const html = fs.readFileSync(htmlPath, 'utf8');
      assert.match(html, new RegExp(`<html[^>]*\\blang="${locale}"`));
      assert.ok(html.includes(`docs-doc-id-${route}`), `${locale}/${route} has the wrong document route`);
      assert.ok(html.includes(`/docs/${locale}/${route}`), `${locale}/${route} has the wrong localized canonical route`);
      assert.match(html, new RegExp(`<h1[^>]*>${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
      assert.ok(html.replace(/\s+/g, ' ').includes(marker), `${locale}/${route} does not contain canonical security content`);
      assert.doesNotMatch(html, commercialEntitlementAssertion, `${locale}/${route} must not assert commercial entitlement gating`);
    }
  }
});

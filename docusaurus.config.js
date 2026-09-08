/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Semaphore UI',
  tagline: 'Modern UI and powerful API for Ansible, Terraform, OpenTofu, PowerShell and other DevOps tools',
  favicon: 'img/favicon.png',

  // Set the production url of your site here
  url: 'https://semaphoreui.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/docs/',
  //trailingSlash: true,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'semaphoreui', // Usually your GitHub org/user name.
  projectName: 'semaphore-docs', // Usually your repo name.

  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'pt', 'zh', 'sr'],
    localeConfigs: {
      en: { label: 'English', htmlLang: 'en' },
      ru: { label: 'Русский', htmlLang: 'ru' },
      es: { label: 'Español', htmlLang: 'es' },
      fr: { label: 'Français', htmlLang: 'fr' },
      de: { label: 'Deutsch', htmlLang: 'de' },
      it: { label: 'Italiano', htmlLang: 'it' },
      ja: { label: '日本語', htmlLang: 'ja' },
      ko: { label: '한국어', htmlLang: 'ko' },
      pt: { label: 'Português', htmlLang: 'pt' },
      zh: { label: '中文', htmlLang: 'zh-Hans' },
      sr: { label: 'Srpski', htmlLang: 'sr' },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/semaphoreui/semaphore-docs/edit/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Semaphore UI',
        logo: {
          alt: 'Semaphore UI Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'dropdown',
            label: 'Product',
            position: 'left',
            items: [
              {
                label: 'Pro · For teams',
                href: 'https://semaphoreui.com/pro',
                target: '_self',
              },
              {
                label: 'Enterprise · For large-scale operations',
                href: 'https://semaphoreui.com/enterprise',
                target: '_self',
              },
              {
                label: 'Community · For homelab',
                href: 'https://github.com/semaphoreui/semaphore',
                target: '_self',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Explore',
            position: 'left',
            items: [
              {
                label: 'Features',
                href: 'https://semaphoreui.com/features',
                target: '_self',
              },
              {
                label: 'Use cases',
                href: 'https://semaphoreui.com/use-cases',
                target: '_self',
              },
              {
                label: 'Case studies',
                href: 'https://semaphoreui.com/case-studies',
                target: '_self',
              },
              {
                label: 'Blog',
                href: 'https://semaphoreui.com/blog/',
                target: '_self',
              },
              {
                type: 'html',
                value: '<div class="dropdown__category">Comparison</div>',
              },
              {
                label: 'Semaphore UI vs AWX',
                href: 'https://semaphoreui.com/vs/awx',
                target: '_self',
              },
              {
                label: 'Semaphore UI vs Rundeck',
                href: 'https://semaphoreui.com/vs/rundeck',
                target: '_self',
              },
              {
                label: 'Semaphore UI vs GitLab',
                href: 'https://semaphoreui.com/vs/gitlab',
                target: '_self',
              },
              {
                label: 'Semaphore UI vs Jenkins',
                href: 'https://semaphoreui.com/vs/jenkins',
                target: '_self',
              },
              {
                label: 'Semaphore UI vs Spacelift',
                href: 'https://semaphoreui.com/vs/spacelift',
                target: '_self',
              },
              {
                label: 'Semaphore UI vs Gaia',
                href: 'https://semaphoreui.com/vs/gaia',
                target: '_self',
              },
              {
                label: 'Semaphore UI vs Tower (AAP)',
                href: 'https://semaphoreui.com/vs/tower',
                target: '_self',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Help',
            position: 'left',
            items: [
              {
                label: 'Installation',
                href: 'https://semaphoreui.com/install',
                target: '_self',
              },
              {
                label: 'Docs',
                to: '/',
              },
              {
                label: 'API References',
                href: 'https://semaphoreui.com/api-docs/',
                target: '_self',
              },
            ],
          },
          {
            label: 'Pricing',
            href: 'https://semaphoreui.com/pricing/',
            target: '_self',
            position: 'left',
          },
          {
            href: 'https://github.com/semaphoreui/semaphore',
            target: '_self',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://portal.semaphoreui.com',
            target: '_self',
            label: 'Sign in',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: ' ',
            items: [
              {
                html: `
                  <a class="footer__brand" href="https://semaphoreui.com/" aria-label="Semaphore UI">
                    <img class="footer__logo footer__logo--light" src="/docs/img/semaphore-light.png" alt="Semaphore UI" />
                    <img class="footer__logo footer__logo--dark" src="/docs/img/semaphore-dark.png" alt="Semaphore UI" />
                  </a>
                  <p class="footer__desc">A self-hosted automation control plane for Ansible, Terraform, OpenTofu, Terragrunt, Bash, PowerShell, and Python workflows.</p>
                  <div class="footer__contact">
                    <div class="footer__contactTitle">Contact us</div>
                    <div class="footer__contactRow"><span class="footer__contactLabel">Sales</span><a href="mailto:sales@semaphoreui.com">sales@semaphoreui.com</a></div>
                    <div class="footer__contactRow"><span class="footer__contactLabel">Support</span><a href="mailto:support@semaphoreui.com">support@semaphoreui.com</a></div>
                    <div class="footer__contactRow"><span class="footer__contactLabel">Security</span><a href="mailto:security@semaphoreui.com">security@semaphoreui.com</a></div>
                    <div class="footer__contactRow"><span class="footer__contactLabel">Legal</span><a href="mailto:legal@semaphoreui.com">legal@semaphoreui.com</a></div>
                  </div>
                `,
              },
            ],
          },
          {
            title: 'Product',
            items: [
              { label: 'Community', href: 'https://github.com/semaphoreui/semaphore', target: '_self' },
              { label: 'Pro', href: 'https://semaphoreui.com/pro', target: '_self' },
              { label: 'Enterprise', href: 'https://semaphoreui.com/enterprise', target: '_self' },
              { label: 'Pricing', href: 'https://semaphoreui.com/pricing/', target: '_self' },
            ],
          },
          {
            title: 'Explore',
            items: [
              { label: 'Features', href: 'https://semaphoreui.com/features', target: '_self' },
              { label: 'Use cases', href: 'https://semaphoreui.com/use-cases', target: '_self' },
              { label: 'Case studies', href: 'https://semaphoreui.com/case-studies', target: '_self' },
              { label: 'Roadmap', href: 'https://semaphoreui.com/roadmap', target: '_self' },
              { label: "What's New", href: 'https://semaphoreui.com/releases/', target: '_self' },
            ],
          },
          {
            title: 'Help',
            items: [
              { label: 'Installation', href: 'https://semaphoreui.com/install', target: '_self' },
              { label: 'Documentation', to: '/' },
              { label: 'API References', href: 'https://semaphoreui.com/api-docs/', target: '_self' },
            ],
          },
          {
            title: 'Links',
            items: [
              { label: 'GitHub', href: 'https://github.com/semaphoreui/semaphore', target: '_self' },
              { label: 'X (ex. Twitter)', href: 'https://twitter.com/semaphoreui', target: '_self' },
              { label: 'Discord', href: 'https://discord.gg/5R6k7hNGcH', target: '_self' },
              { label: 'YouTube', href: 'https://www.youtube.com/@semaphoreui', target: '_self' },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/company/semaphoreui', target: '_self' },
              { label: 'Facebook', href: 'https://facebook.com/semaphoreui', target: '_self' },
              { label: 'Snapcraft', href: 'https://snapcraft.io/semaphore', target: '_self' },
            ],
          },
          {
            title: 'Legal',
            items: [
              { label: 'Terms of Service', href: 'https://semaphoreui.com/legal/terms-of-service', target: '_self' },
              { label: 'Subscription Agreement', href: 'https://semaphoreui.com/legal/subscription-agreement', target: '_self' },
              { label: 'Refund Policy', href: 'https://semaphoreui.com/legal/refund-policy', target: '_self' },
              { label: 'Privacy Policy', href: 'https://semaphoreui.com/privacy/policy', target: '_self' },
              { label: 'Cookie Policy', href: 'https://semaphoreui.com/privacy/cookies', target: '_self' },
              { label: 'Security Whitepaper', href: 'https://semaphoreui.com/security/whitepaper', target: '_self' },
              { label: 'Support Offering', href: 'https://semaphoreui.com/legal/support-offering', target: '_self' },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Semaphore UI. All rights reserved.`,
      },
      prism: {
        additionalLanguages: ['powershell', 'bash', 'hcl'],
        theme: require('prism-react-renderer').themes.github,
        darkTheme: require('prism-react-renderer').themes.dracula,
      },
      algolia: {
        // The application ID provided by Algolia
        appId: 'B71NA6DNHD',

        // Public API key: it is safe to commit it
        apiKey: 'bb1dabaeb79b08523ab98c9723afad04',

        indexName: 'docs',

        // Optional: see doc section below
        contextualSearch: false,

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: 'external\\.com|domain\\.com',

        // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl.
        // Uncomment and adjust if your Algolia index was crawled with different URLs
        // replaceSearchResultPathname: {
        //   from: '/docs/', // or as RegExp: /\/docs\//
        //   to: '/',
        // },

        // Optional: Algolia search parameters
        searchParameters: {
          facetFilters: [],
        },
        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',

        // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
        insights: false,

        //... other Algolia params
      },
    }),

  plugins: [],


  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
};

export default config;

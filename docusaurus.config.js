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
    locales: ['en'],
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
                label: 'API References (Swagger)',
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
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Home',
                to: '/README',
              },
              {
                label: 'Admin Guide',
                to: '/admin-guide/installation',
              },
              {
                label: 'User Guide',
                to: '/user-guide/projects',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/semaphoreui/semaphore',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/5R6k7hNGcH',
              },
              {
                label: 'Issues',
                href: 'https://github.com/semaphoreui/semaphore/issues',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Docker Hub',
                href: 'https://hub.docker.com/r/semaphoreui/semaphore',
              },
              // {
              //   label: 'Snap',
              //   href: 'https://snapcraft.io/semaphore',
              // },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Semaphore UI.`,
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

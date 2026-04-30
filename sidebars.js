/* eslint-disable no-undef */
// @ts-check

// Import the TypeDoc-generated sidebar (exists after first build)
const guidesOnly = process.env.AGENTOS_DOCS_GUIDES_ONLY === '1';
let typedocSidebar = [];
try {
  typedocSidebar = require('./docs/api/typedoc-sidebar.cjs');
} catch {
  // First build — TypeDoc hasn't run yet, API sidebar will be empty
}

const { buildGuideSidebar } = require('../../packages/agentos/docs/publication-manifest.cjs');

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  guideSidebar: ['index']
    .concat(buildGuideSidebar())
    .concat(
      !guidesOnly
        ? [
            {
              type: 'category',
              label: 'API Reference',
              link: {
                type: 'doc',
                id: 'api/index',
              },
              items: typedocSidebar,
            },
          ]
        : [],
    ),
};

module.exports = sidebars;

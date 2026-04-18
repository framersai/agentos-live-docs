/* eslint-disable no-undef */
// @ts-check

// Import the TypeDoc-generated sidebar (exists after first build)
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
    .concat([
      {
        type: 'category',
        label: 'API Reference',
        link: {
          type: 'doc',
          id: 'api/index',
        },
        items: typedocSidebar,
      },
    ]),
};

module.exports = sidebars;

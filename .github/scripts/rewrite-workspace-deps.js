#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Get paths from arguments or use defaults
const pkgPath = path.resolve(process.argv[2] || 'deployment/backend/package.json');
const packsDir = path.resolve(process.argv[3] || 'deployment/backend/packs');

console.log(`Rewriting workspace dependencies in ${pkgPath}`);
console.log(`Looking for packed tarballs in ${packsDir}`);

try {
  // Read package.json
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  console.log('Current dependencies:', pkg.dependencies);

  // List files in packs directory
  const files = fs.readdirSync(packsDir);
  console.log('Found pack files:', files);

  // Find tarball files (be lenient: allow prereleases or custom tags)
  const agentosTgz = files.find(f => f.includes('framers-agentos') && f.endsWith('.tgz'));
  const adapterTgz = files.find(f => f.includes('framers-sql-storage-adapter') && f.endsWith('.tgz'));

  console.log('AgentOS tarball:', agentosTgz);
  console.log('SQL Storage Adapter tarball:', adapterTgz);

  // Initialize dependencies if needed
  if (!pkg.dependencies) {
    pkg.dependencies = {};
  }

  // Rewrite workspace dependencies
  let rewritten = false;
  if (agentosTgz && pkg.dependencies['@framers/agentos']) {
    pkg.dependencies['@framers/agentos'] = `file:./packs/${agentosTgz}`;
    console.log('Rewrote @framers/agentos dependency');
    rewritten = true;
  }

  if (adapterTgz && pkg.dependencies['@framers/sql-storage-adapter']) {
    pkg.dependencies['@framers/sql-storage-adapter'] = `file:./packs/${adapterTgz}`;
    console.log('Rewrote @framers/sql-storage-adapter dependency');
    rewritten = true;
  }

  if (rewritten) {
    // Write updated package.json
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log('Successfully updated package.json');
    console.log('New dependencies:', pkg.dependencies);
  } else {
    console.log('No workspace dependencies found to rewrite');
  }
} catch (error) {
  console.error('Error rewriting dependencies:', error);
  process.exit(1);
}

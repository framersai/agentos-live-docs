/**
 * Native Module Rebuild Script
 *
 * Rebuilds native modules (like better-sqlite3) for the Electron version.
 */

const { rebuild } = require('@electron/rebuild');
const path = require('path');

async function main() {
  const electronVersion = require('electron/package.json').version;

  console.log(`Rebuilding native modules for Electron ${electronVersion}...`);

  try {
    await rebuild({
      buildPath: path.join(__dirname, '..'),
      electronVersion,
      force: true,
      onlyModules: ['better-sqlite3'],
    });

    console.log('Native modules rebuilt successfully!');
  } catch (error) {
    console.error('Rebuild failed:', error);
    process.exit(1);
  }
}

main();

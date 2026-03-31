import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const __dirname = path.resolve();
const packageJsonPath = path.join(__dirname, 'package.json');
const versionTsPath = path.join(__dirname, 'src', 'config', 'version.ts');

const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
const currentVersion = pkg.version;

const [,, type] = process.argv;
if (!['major', 'minor', 'patch'].includes(type)) {
  console.error('Usage: node scripts/bump-version.mjs [major|minor|patch]');
  process.exit(1);
}

const parts = currentVersion.split('.').map(Number);
if (type === 'major') {
  parts[0]++;
  parts[1] = 0;
  parts[2] = 0;
} else if (type === 'minor') {
  parts[1]++;
  parts[2] = 0;
} else if (type === 'patch') {
  parts[2]++;
}

const nextVersion = parts.join('.');
pkg.version = nextVersion;

// Update package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');

// Update src/config/version.ts
const releaseDate = new Date().toISOString().split('T')[0];
const versionTsContent = `export const APP_VERSION = '${nextVersion}';
export const RELEASE_DATE = '${releaseDate}';
`;
fs.writeFileSync(versionTsPath, versionTsContent);

console.log(`Successfully bumped to v${nextVersion}`);

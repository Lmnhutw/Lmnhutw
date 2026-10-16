const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const test = require('node:test');
const { image } = require('./svg');

test('embedded SVG icons normalize line endings across Windows and Linux', () => {
  const icon = fs.readFileSync(path.join(__dirname, '..', 'assets', 'icons', 'csharp.svg'), 'utf8').replace(/\r\n/g, '\n');
  const embedded = image('icons/csharp.svg', 0, 0, 24, 24).match(/base64,([^"]+)/)[1];
  assert.equal(Buffer.from(embedded, 'base64').toString('utf8'), icon);
});

test('all desktop and mobile README images use their current content version', () => {
  const root = path.join(__dirname, '..');
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  const images = [...readme.matchAll(/(?:src|srcset)="([^"]+)"/g)];
  assert.equal(images.length, 14);
  for (const [, source] of images) {
    const url = new URL(source);
    assert.equal(url.origin, 'https://raw.githubusercontent.com');
    assert.match(url.pathname, /^\/Lmnhutw\/Lmnhutw\/main\/assets\/[a-z-]+\.svg$/);
    const content = fs.readFileSync(path.join(root, 'assets', path.basename(url.pathname)), 'utf8').replace(/\r\n/g, '\n');
    const version = createHash('sha256').update(content).digest('hex').slice(0, 16);
    assert.equal(url.searchParams.get('v'), version, source);
  }
});

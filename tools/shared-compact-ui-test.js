const fs = require('fs');
const path = require('path');
const assert = require('assert');
const read = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');
const css = read('styles-upload.css');
const html = read('index.html');
const app = read('app-upload.js');
const sw = read('sw.js');
const version = JSON.parse(read('version.json'));
assert(css.includes('.journey-header { min-height: 72px;'));
assert(css.includes('.section-task-path { min-height: 26px;'));
assert(css.includes('.focused-actions button { width: auto; font-size: 12px; min-height: 32px;'));
assert(css.includes('.focused-actions button { min-height: 44px; font-size: 13px; }'));
assert(css.includes('.task-meta-row { position: relative; display: flex;'));
assert(css.includes('.focus-support { display: none; }'));
assert(css.includes('.compact-draft-reminder summary:focus-visible'));
assert(html.includes('<details class="compact-draft-reminder">'));
assert(html.includes('It is okay if this changes later.'));
assert(html.includes('<details class="app-feedback-panel" hidden>'));
assert(app.includes('const STORAGE_KEY = "proposalBuilderA4DraftUploadVersion";'));
assert(app.includes('const SCHEMA_VERSION = "4.7.0";'));
assert(app.includes('const RELEASE_VERSION = "4.9.2";'));
assert.strictEqual(version.version, '4.9.2');
for (const source of [...html.matchAll(/(?:href|src)="((?:styles-upload\.css|app-upload\.js)\?v=[^"]+)"/g)]) {
  assert(sw.includes(`./${source[1]}`), `Offline shell must match ${source[1]}`);
}
console.log('Passed: shared header/footer/reminder rules, mobile button sizing, focus styling, version/cache consistency, and unchanged storage/schema keys.');

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');
const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app-upload.js'), 'utf8');
async function main() {
  const state = { draft: 'Keep student work' };
  const context = vm.createContext({
    state, URL, Date, RELEASE_VERSION: '4.8.8',
    window: { location: { href: 'https://example.test/builder/index.html' } },
    els: { updateNotice: { hidden: true } },
    escapeHtml: value => String(value).replaceAll('&', '&amp;'),
    fetch: async () => ({ ok: true, json: async () => ({ version: '4.8.9', url: './', notes: [] }) })
  });
  const start = app.indexOf('function semverParts(');
  const end = app.indexOf('\nfunction stageFeedbackEntry(', start);
  vm.runInContext(app.slice(start, end), context);
  await context.checkForUpdates();
  const href = context.els.updateNotice.innerHTML.match(/href="([^"]+)"/)[1].replaceAll('&amp;', '&');
  const url = new URL(href);
  assert.strictEqual(url.pathname, '/builder/');
  assert.strictEqual(url.searchParams.get('appUpdate'), '4.8.9');
  assert(url.searchParams.has('checked'));
  assert.strictEqual(state.draft, 'Keep student work');

  let fetchHandler;
  let offline = false;
  let mode;
  const cached = { offline: true };
  const worker = vm.createContext({
    URL,
    self: { location: { origin: 'https://example.test' }, addEventListener: (name, handler) => { if (name === 'fetch') fetchHandler = handler; } },
    caches: { match: async () => cached, open: async () => ({ put: async () => {} }) },
    fetch: async (request, options) => { mode = options?.cache; if (offline) throw new Error('Offline'); return { ok: true, clone: () => ({}) }; }
  });
  vm.runInContext(fs.readFileSync(path.join(root, 'sw.js'), 'utf8'), worker);
  function navigate() {
    let result;
    fetchHandler({ request: { method: 'GET', mode: 'navigate', url: href }, respondWith: promise => { result = promise; } });
    return result;
  }
  assert((await navigate()).ok);
  assert.strictEqual(mode, 'no-store');
  offline = true;
  assert.strictEqual(await navigate(), cached);
  console.log('Passed: fresh release link, draft preservation, fresh online navigation, and offline fallback.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });

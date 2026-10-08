const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');
const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app-upload.js'), 'utf8');
const storeCode = fs.readFileSync(path.join(root, 'adviser-workspace.js'), 'utf8');
class Storage {
  constructor() { this.items = new Map(); }
  get length() { return this.items.size; }
  key(i) { return [...this.items.keys()][i] ?? null; }
  getItem(key) { return this.items.get(key) ?? null; }
  setItem(key, value) { this.items.set(key, String(value)); }
  removeItem(key) { this.items.delete(key); }
}
function context(storage, search = '') {
  const ctx = vm.createContext({ localStorage: storage, sessionStorage: new Storage(), URL, URLSearchParams, window: { location: { search, href: `https://example.test/builder/index.html${search}` } }, alert: message => { throw new Error(message); }, state: {}, uiState: {}, document: { hidden: false }, lastActiveTickAt: 0 });
  vm.runInContext(storeCode, ctx);
  vm.runInContext(app.slice(0, app.indexOf('let state = normalizeState(loadState());')), ctx);
  const boot = app.search(/\r?\nattachEvents\(\);\r?\nrender\(\);/);
  assert(boot > 0);
  vm.runInContext(app.slice(app.indexOf('function clone('), boot), ctx);
  return ctx;
}
async function main() {
  const storage = new Storage();
  const researcherKey = 'proposalBuilderA4DraftUploadVersion';
  const original = JSON.stringify({ currentStage: 'a1', a1: { initialTopic: 'My researcher draft' }, submission: { studentName: 'Researcher' } });
  storage.setItem(researcherKey, original);
  storage.setItem(`${researcherKey}:ui:v4.8`, '{"tasks":{"a1":2}}');
  storage.setItem(`${researcherKey}:checkpoints`, '[{"id":"keep"}]');
  const researcherKeys = [...storage.items].filter(([key]) => key.startsWith(researcherKey));
  const home = context(storage, '?role=adviser');
  let id = 0;
  const files = ['adviser-one', 'adviser-invalid', 'adviser-two', 'adviser-three'].map(name => ({ name: `${name}.json`, text: async () => fs.readFileSync(path.join(__dirname, 'fixtures', `${name}.json`), 'utf8') }));
  const results = await home.ADVISER_STORE.importFiles(storage, files, () => `copy-${++id}`, home.validateAdviserState);
  assert.deepStrictEqual(Array.from(results, item => item.ok), [true, false, true, true]);
  const firstRecord = home.ADVISER_STORE.read(storage, results[0].id);
  const source = JSON.parse(await files[0].text());
  assert.strictEqual(JSON.stringify(firstRecord.payload), JSON.stringify(source), 'Import altered original responses');
  assert(firstRecord.payload.state.teamContributions.a1.assessments['demo-peer'].evidence);
  const beforeRecord = storage.getItem(home.ADVISER_STORE.prefix + firstRecord.id);
  const tabs = results.filter(item => item.ok).map(item => context(storage, `?role=adviser&proposal=${item.id}`));
  for (const [index, tab] of tabs.entries()) {
    tab.state = tab.normalizeState(tab.loadState());
    tab.state.currentStage = ['a2', 'terms', 'methodology'][index];
    tab.saveState(false);
    tab.setValue('a1', 'initialTopic', 'Attempted edit');
    tab.markContentEdit(); tab.tickActiveTime();
    tab.uiState = { tasks: { a1: index }, showAll: {} }; tab.saveUiState();
    assert(!tab.state.a1.initialTopic.includes('Attempted edit'));
    assert.strictEqual(tab.createCheckpoint(), false);
    const reload = context(storage, `?role=adviser&proposal=${results.filter(item => item.ok)[index].id}`);
    reload.sessionStorage = tab.sessionStorage;
    assert.strictEqual(reload.loadState().currentStage, tab.state.currentStage);
  }
  home.state = home.normalizeState(home.loadState()); home.saveState();
  assert.strictEqual(storage.getItem(home.ADVISER_STORE.prefix + firstRecord.id), beforeRecord, 'Review modified the saved import');
  assert.deepStrictEqual([...storage.items].filter(([key]) => key.startsWith(researcherKey)), researcherKeys, 'Adviser activity overwrote researcher data');
  await home.ADVISER_STORE.importFiles(storage, [files[0]], () => `copy-${++id}`, home.validateAdviserState);
  assert.strictEqual(home.ADVISER_STORE.list(storage).length, 4, 'Repeated import replaced a prior copy');
  const fullStorage = { getItem: storage.getItem.bind(storage), setItem: () => { const error = new Error('full'); error.name = 'QuotaExceededError'; throw error; } };
  const failed = await home.ADVISER_STORE.importFiles(fullStorage, [files[0]], () => `copy-${++id}`, home.validateAdviserState);
  assert(!failed[0].ok && failed[0].error.includes('storage is full'));
  assert.strictEqual(home.ADVISER_STORE.list(storage).length, 4);
  const researcher = context(storage);
  researcher.state = researcher.normalizeState(researcher.loadState());
  assert.strictEqual(researcher.state.a1.initialTopic, 'My researcher draft');
  researcher.state.a1.initialTopic = 'Edited researcher draft'; researcher.saveState(false);
  assert.strictEqual(JSON.parse(storage.getItem(researcherKey)).a1.initialTopic, 'Edited researcher draft');
  assert.strictEqual(storage.getItem(home.ADVISER_STORE.prefix + firstRecord.id), beforeRecord);
  assert.throws(() => home.validateAdviserState({ a4: { centralFocus: 42 } }));
  assert.throws(() => home.validateAdviserState({ a1: { coreConstruct: 42 } }));
  const newTabUrl = new URL(home.ADVISER_STORE.url('https://example.test/builder/index.html?role=adviser&proposal=old', 'adviser', firstRecord.id));
  assert.strictEqual(newTabUrl.searchParams.get('proposal'), firstRecord.id);
  assert(!new URL(home.ADVISER_STORE.url(newTabUrl.href, 'researcher')).searchParams.has('proposal'));
  console.log('Passed: multiple valid/invalid imports, legacy backups, immutable personal records, repeated imports, storage failure, independent review navigation, and researcher/adviser isolation.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });

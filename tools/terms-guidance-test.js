const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const path = require('path');
const app = fs.readFileSync(path.join(__dirname, '..', 'app-upload.js'), 'utf8');
function source(name) {
  const start = app.indexOf(`function ${name}(`);
  assert(start >= 0, `Missing function ${name}`);
  const end = app.indexOf('\nfunction ', start + 1);
  return app.slice(start, end < 0 ? app.length : end);
}
const context = vm.createContext({
  state: { methodology: { approach: 'qualitative' }, terms: { rows: [] } },
  els: { exampleDialogTitle: {}, exampleDialogBody: {} },
  flag: (ok, yes, no) => ({ level: ok ? 'green' : 'yellow', text: ok ? yes : no }),
  escapeHtml: text => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
});
for (const name of ['normalizeTermRow', 'termDefinitionText', 'termDefinitionPreview', 'termEntryHtml', 'termsOutputHtml', 'conceptualDefinitionHasSource', 'checkTerms', 'renderTermsExample']) {
  vm.runInContext(source(name), context);
}
// Existing stored fields remain lossless, including legacy field aliases.
const old = { term: 'Preservice teachers', conceptualDefinitions: 'Author (2020). Original meaning.', operationalDefinitions: 'Students in the identified practicum course.', measurementObservation: 'Enrollment records.' };
const normalized = context.normalizeTermRow(old);
assert.strictEqual(normalized.conceptual, old.conceptualDefinitions);
assert.strictEqual(normalized.operational, old.operationalDefinitions);
assert.strictEqual(normalized.measured, old.measurementObservation);
const participant = { term: 'Preservice teachers', operational: 'Students enrolled in the identified practicum course.', conceptual: '', measured: '' };
context.state.terms.rows = [participant];
assert(context.checkTerms().every(item => item.level === 'green'), 'Optional fields generated missing-field warnings');
assert.strictEqual(context.termDefinitionPreview(participant), 'Preservice teachers. Students enrolled in the identified practicum course.');
const html = context.termsOutputHtml([participant, normalized]);
assert(html.startsWith('<ul'));
assert.strictEqual((html.match(/<li>/g) || []).length, 2);
assert(!html.includes('Conceptual Definition:'));
assert(html.includes('Original meaning.') && html.includes('Enrollment records.'));
assert(!context.termEntryHtml({ term: '<script>', operational: '<b>test</b>' }).includes('<script>'));
context.state.terms.rows = [{ ...participant, conceptual: 'An uncited literature definition' }];
assert(context.checkTerms().some(item => item.text.includes('author')));
context.state.terms.rows = [{ ...participant, operational: '' }];
assert(context.checkTerms().some(item => item.text.includes('meaning in this study')));
const before = JSON.stringify(context.state);
for (const route of ['quantitative', 'qualitative', 'mixed']) {
  context.renderTermsExample(route);
  const popup = context.els.exampleDialogBody.innerHTML;
  assert(popup.includes('Origin: Illustrative example') && popup.includes('Do not copy'));
  assert(popup.includes('Writing template') && popup.includes(`data-terms-example-route="${route}" aria-pressed="true"`));
}
assert.strictEqual(JSON.stringify(context.state), before, 'Examples changed saved responses');
console.log('Passed: legacy text preservation, optional-field checks, term-list exports, escaping, and three examples without response changes.');

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const app = read('app-upload.js');
const state = {
  methodology: { participants: 'Existing group <preserved>', evidenceSources: 'Existing overall sources', inclusionCriteria: 'Enrolled practicum students', exclusionCriteria: 'No additional exclusions are proposed' },
  a4: { questionIds: ['q1'], questionPurposes: ['describe'] },
  instrumentation: { rows: [{questionId: 'q1', rq: 'Existing question', evidenceSource: 'Existing question-specific source', claimNeeded: 'Existing shared claim'}] }
};
const before = JSON.stringify(state);
const ctx = vm.createContext({ state, els: { exampleDialogTitle: {}, exampleDialogBody: {} }, rqPurposeOptions: {describe: {label:'Describe',starters:'What?'}}, escapeHtml: text => String(text || '').replaceAll('<','&lt;').replaceAll('>','&gt;'), helpControl: () => '', contextTaskLink: () => '<button data-context-stage="methodology">Review sources</button>' });
vm.runInContext(read('study-design-examples.js'),ctx);
vm.runInContext(app.slice(app.indexOf('function renderSourceEligibilityExample('),app.indexOf('function renderStudyDesignExample(')),ctx);
for (const type of ['participants','inclusion','exclusion','source']) {
  ctx.renderSourceEligibilityExample(type);
  const html = ctx.els.exampleDialogBody.innerHTML;
  for (const label of ['Human participants','Documents','Writing template','Illustrative example','not as text to copy or cite as a research finding']) assert(html.includes(label));
}
vm.runInContext(app.slice(app.indexOf('function instrumentationRow(index)'),app.indexOf('function renderOutline()')),ctx);
const html = ctx.instrumentationRow(0);
assert(html.includes('Existing group &lt;preserved&gt;'));
assert(html.includes('Enrolled practicum students'));
assert(html.includes('No additional exclusions are proposed'));
assert(html.includes('Existing question-specific source'));
assert(html.includes('Review identified sources and eligibility'));
assert(html.includes('data-context-stage="methodology"'));
assert(html.includes('class="field instrumentation-source-field"'));
assert.strictEqual(JSON.stringify(state),before);
const tasks = app.slice(app.indexOf('if (stageId === "methodology")'), app.indexOf('if (stageId === "ethics")'));
assert(tasks.indexOf('label: "Inclusion criteria"') < tasks.indexOf('label: "Exclusion criteria"'));
assert(tasks.indexOf('label: "Exclusion criteria"') < tasks.indexOf('label: "Evidence sources"'));
assert(app.includes('normalized.methodology = { ...clone(defaultData.methodology), ...(nextState.methodology || {}) }'));
assert(app.includes('Do not simply reverse your inclusion criteria'));
console.log('Passed: four human/document example sets, safe source reference, unchanged saved answers, ordered eligibility tasks, and additive legacy-data normalization.');

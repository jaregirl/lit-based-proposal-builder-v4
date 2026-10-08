const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');
const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'app-upload.js'), 'utf8');
const context = vm.createContext({
  state: { methodology: { approach: 'mixed' }, a4: { questions: ['Keep my question'] } },
  els: { exampleDialogTitle: {}, exampleDialogBody: {} },
  escapeHtml: value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
});
vm.runInContext(fs.readFileSync(path.join(root, 'study-design-examples.js'), 'utf8'), context);
const start = app.indexOf('function renderStudyDesignExample(');
const end = app.indexOf('\nfunction draftHelp(', start);
assert(start >= 0 && end > start);
vm.runInContext(app.slice(start, end), context);
const before = JSON.stringify(context.state);
let count = 0;
const examples = context.STUDY_DESIGN_EXAMPLES;
for (const [stage, tasks] of Object.entries(examples.tasks)) {
  for (const [task, [key, frame]] of Object.entries(tasks)) {
    assert(frame.length > 20);
    for (const route of Object.keys(examples.routes)) {
      assert(examples.models[route][key], `${stage}/${task}/${route} has no model`);
      context.renderStudyDesignExample(stage, task, route);
      const html = context.els.exampleDialogBody.innerHTML;
      assert(html.includes('Writing template'));
      assert(html.includes(`data-study-example-route="${route}"`));
      assert(html.includes('aria-pressed="true"'));
      assert(html.includes('Do not copy'));
      assert(html.includes('https://doi.org/10.1016/j.tate.2016.05.010'));
      count++;
    }
  }
}
assert.strictEqual(JSON.stringify(context.state), before, 'Rendering changed student responses');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert(index.indexOf('study-design-examples.js?') < index.indexOf('src="app-upload.js?'));
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const exampleScript = index.match(/src="(study-design-examples\.js\?v=[^"]+)"/);
assert(exampleScript, 'Study Design example script is missing');
assert(sw.includes(`./${exampleScript[1]}`), 'Offline cache must match the current example script');
console.log(`Passed: ${count} task/approach renderings; response preservation; script order; offline cache inclusion.`);

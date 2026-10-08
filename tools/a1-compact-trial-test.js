const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const path = require('path');
const app = fs.readFileSync(path.join(__dirname, '..', 'app-upload.js'), 'utf8');
const saved = 'Assessment literacy <saved response>';
const ctx = vm.createContext({
  value: () => saved,
  escapeHtml: text => String(text).replace(/</g, '&lt;').replace(/>/g, '&gt;'),
  draftHelp: (section, text) => `${text} This is a working draft, and you can refine it later.`,
  helpControl: () => '<span class="help-icon">?</span>'
});
vm.runInContext(app.slice(app.indexOf('function renderFields('), app.indexOf('function degreeLevelInfo(')), ctx);
const html = vm.runInContext('renderFields("a1", [["coreConstruct", "Final declaration: This study is about _____.", "Original guidance"]])', ctx);
assert(html.includes('Assessment literacy &lt;saved response&gt;'));
assert(html.includes('id="a1-coreConstruct" data-section="a1" data-key="coreConstruct"'));
assert(html.includes('<label for="a1-coreConstruct">This study is about…</label>'));
assert(html.includes('<details class="construct-prompt-guidance">'));
assert(html.includes('Final declaration: This study is about _____.'));
assert(html.includes('Original guidance'));
const unchanged = vm.runInContext('renderFields("a1", [["initialTopic", "Original topic label", "Topic guidance"]])', ctx);
assert(unchanged.includes('Original topic label'));
assert(unchanged.includes('class="help-icon"'));
assert(!unchanged.includes('construct-prompt-guidance'));
console.log('Passed: saved construct response, original storage attributes, full guidance, and other A1 fields preserved.');

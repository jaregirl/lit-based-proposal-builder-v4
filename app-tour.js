/* First-use guide uses the existing app and does not alter proposal data. */
(() => {
  'use strict';
  const seenKey = 'proposalBuilder:tour:v1:seen';
  const toolsDialog = document.getElementById('toolsDialog');
  const welcome = document.getElementById('welcomeDialog');
  for (const section of toolsDialog.querySelectorAll('.tool-groups > section')) {
    const heading = section.querySelector(':scope > h3');
    if (!heading) continue;
    const group = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = heading.textContent;
    heading.remove();
    while (section.firstChild) group.append(section.firstChild);
    group.prepend(summary);
    section.append(group);
  }
  const hintChoice = document.getElementById('phaseHintsChoice');
  const hintKey = 'proposalBuilder:phaseHints:v1';
  try { hintChoice.checked = localStorage.getItem(hintKey) === 'on'; } catch {}
  document.body.classList.toggle('phase-hints-on', hintChoice.checked);
  hintChoice.addEventListener('change', () => { document.body.classList.toggle('phase-hints-on', hintChoice.checked); try { localStorage.setItem(hintKey, hintChoice.checked ? 'on' : 'off'); } catch {} });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && event.target.closest?.('.phase-step')) event.target.closest('.phase-step').classList.add('hint-dismissed'); });
  document.addEventListener('focusout', event => { event.target.closest?.('.phase-step')?.classList.remove('hint-dismissed'); });
  document.addEventListener('mouseout', event => { const phase = event.target.closest?.('.phase-step'); if (phase && !phase.contains(event.relatedTarget)) phase.classList.remove('hint-dismissed'); });
  const steps = [
    { selector: '#phaseJourney', title: 'Where would you like to work?', text: 'These are the four parts of the app. Select a part to see the sections under it.' },
    { selector: '.stage-intro', title: 'What are you working on?', text: 'The question is here. Read it first, then use the workspace for your answer.' },
    { selector: '.task-resources', title: 'Need help with this part?', text: 'Use Help for guidance, Example to see how an answer may look, and Related work to return to a connected decision.' },
    { selector: '#sectionTaskPath', title: 'Moving between tasks', text: 'These are the tasks in the section. Select one when you want to go back or check another answer.' },
    { selector: '#statusBtn', title: 'How is your work coming along?', text: 'Open Status. Check Current Step reviews this part; All Outstanding Issues lists items to revisit; Proposal at a Glance brings your decisions together.', action: 'status' },
    { selector: '#toolsBtn', title: 'Where are the other tools?', text: 'Open Tools. We will look at what you can do there.', action: 'tools' },
    { selector: '#autosaveStatus', title: 'Where is your work saved?', text: 'Your draft is saved in this browser on this device. Download a backup from Tools before changing devices or clearing browser data.' }
  ];
  const card = document.createElement('section');
  card.className = 'app-tour-card';
  card.hidden = true;
  card.setAttribute('aria-label', 'App guide');
  card.setAttribute('role', 'region');
  card.innerHTML = '<p class="app-tour-progress"></p><h2></h2><p class="app-tour-text"></p><div class="app-tour-actions"><button type="button" class="ghost" data-tour="skip">Skip guide</button><button type="button" class="ghost" data-tour="back">Back</button><button type="button" class="ghost" data-tour="open" hidden>Open Tools</button><button type="button" class="primary" data-tour="next">Next</button></div>';
  document.body.append(card);
  const style = document.createElement('style');
  style.textContent = '.app-tour-highlight{outline:3px solid #bd821f!important;outline-offset:4px}.task-resources.app-tour-highlight{outline:3px solid #bd821f!important;outline-offset:5px;border-radius:6px;box-shadow:0 0 0 5px #fff5e5}.app-tour-card,.app-tour-inside{background:#fff1db;color:#33251a;border:1px solid #bc7620;border-radius:8px}.app-tour-card{position:fixed;z-index:100;bottom:calc(var(--task-dock-height,100px) + 16px);right:24px;width:min(380px,calc(100vw - 32px));max-height:calc(100dvh - 32px);overflow:auto;padding:16px;box-shadow:0 8px 28px #0003}.app-tour-inside{padding:14px;margin:12px 20px;font-size:14px;line-height:1.45}.app-tour-inside h3{margin:0 0 8px}.app-tour-inside p{margin:6px 0}.app-tour-card h2{font-size:18px;margin:2px 0 8px}.app-tour-card p{font-size:14px;margin:0 0 12px}.app-tour-card .app-tour-progress{font-size:12px;color:#586c67}.app-tour-actions{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}.app-tour-actions button{min-height:40px;padding:7px 12px;font-size:13px}@media(max-width:760px){.app-tour-card{right:16px;bottom:calc(var(--task-dock-height,100px) + 8px)}}';
  style.textContent += '.task-resources.app-tour-highlight{outline:3px solid #a96710!important;outline-offset:-3px;box-shadow:none;padding:8px;box-sizing:border-box;border-radius:6px}';
  style.textContent += ' #toolsDialog .tool-groups>section{padding:0;margin:0} #toolsDialog .tool-groups>section details>summary{cursor:pointer;min-height:44px;padding:10px 4px;font-size:14px;font-weight:600;color:#214f48} #toolsDialog .tool-groups>section details[open]>:not(summary){margin-bottom:10px} #toolsDialog .tool-groups>section details>summary:focus-visible{outline:2px solid #ac721b;outline-offset:2px}';
  document.head.append(style);
  const toolsGuide = document.createElement('section');
  toolsGuide.className = 'app-tour-inside'; toolsGuide.hidden = true;
  toolsGuide.innerHTML = '<h3>What can you do in Tools?</h3><p>Select a heading to see its options.</p><p><strong>App guide:</strong> Show this guide again or turn phase pop-ups on or off.</p><p><strong>Working mode and Layout:</strong> Choose how to work and how the app looks.</p><p><strong>Workspace role:</strong> Choose researcher or adviser tools.</p><p><strong>Draft and Backup:</strong> Save a checkpoint, review history, download a backup, or restore one.</p><p><strong>Ethics and ERB:</strong> Download the protocol packet.</p><p><strong>Review and output:</strong> Preview or prepare your proposal. Reset removes the current draft.</p><p>Close Tools to continue the guide.</p>';
  toolsDialog.querySelector('.dialog-header').after(toolsGuide);
  let index = 0, marked = null, opener = null, running = false;
  const clear = () => { if (marked) marked.classList.remove('app-tour-highlight'); marked = null; };
  function show() {
    clear();
    document.body.classList.toggle('tour-phase-hints', index === 0);
    const step = steps[index];
    const candidate = document.querySelector(step.selector);
    if (candidate && candidate.getClientRects().length) { marked = candidate; marked.classList.add('app-tour-highlight'); }
    card.querySelector('.app-tour-progress').textContent = `App guide · ${index + 1} of ${steps.length}`;
    card.querySelector('h2').textContent = step.title;
    card.querySelector('.app-tour-text').textContent = step.text;
    card.querySelector('[data-tour="back"]').hidden = index === 0;
    card.querySelector('[data-tour="open"]').hidden = !step.action;
    card.querySelector('[data-tour="open"]').textContent = step.action === 'status' ? 'Open Status' : 'Open Tools';
    card.querySelector('[data-tour="next"]').textContent = index === steps.length - 1 ? 'Done' : 'Next';
  }
  function finish() { running = false; clear(); document.body.classList.remove('tour-phase-hints'); card.hidden = true; toolsGuide.hidden = true; try { localStorage.setItem(seenKey,'yes'); } catch {} if (opener?.isConnected && opener.getClientRects().length) opener.focus(); else document.getElementById('toolsBtn')?.focus(); }
  function start(trigger) { if (toolsDialog.open) toolsDialog.close(); opener = trigger; index = 0; running = true; card.hidden = false; show(); card.querySelector('[data-tour="next"]').focus(); }
  document.getElementById('startAppTour').addEventListener('click', event => start(event.currentTarget));
  card.addEventListener('click', event => {
    const action = event.target.closest('button')?.dataset.tour;
    if (action === 'skip') finish();
    if (action === 'back') { index = Math.max(0,index - 1); show(); }
    if (action === 'next') { if (index === steps.length - 1) finish(); else { index++; show(); } }
    if (action === 'open' && steps[index].action === 'tools') { card.hidden = true; clear(); toolsGuide.hidden = false; document.getElementById('toolsBtn').click(); }
    if (action === 'open' && steps[index].action === 'status') { event.stopPropagation(); const menu = document.getElementById('statusMenu'); if (menu.hidden) document.getElementById('statusBtn').click(); }
  });
  toolsDialog.addEventListener('close', () => { toolsGuide.hidden = true; if (running && card.hidden) { card.hidden = false; index = Math.min(index + 1,steps.length - 1); show(); card.querySelector('[data-tour="next"]').focus(); } });
  document.addEventListener('keydown', event => { if (running && event.key === 'Escape' && !toolsDialog.open) { event.preventDefault(); finish(); } });
  function firstVisit() { if (new URLSearchParams(location.search).get('role') === 'adviser') return; try { if (!localStorage.getItem(seenKey)) start(null); } catch { start(null); } }
  if (welcome?.open) welcome.addEventListener('close', firstVisit, { once:true }); else firstVisit();
})();

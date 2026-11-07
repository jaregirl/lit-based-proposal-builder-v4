/* Presentation only. Proposal storage, task membership and all form handlers stay in app-upload.js. */
(() => {
  'use strict';
  const preferenceKey = 'proposalBuilder:layoutPreference:v1';
  const intro = document.querySelector('.stage-intro');
  const work = document.querySelector('.focus-layout');
  const form = document.getElementById('stageForm');
  const header = document.querySelector('.journey-header');
  const dock = document.querySelector('.focused-navigation');
  const chooser = document.getElementById('layoutChoice');
  const status = document.getElementById('layoutChoiceStatus');
  const grid = document.createElement('div');
  grid.className = 'task-workspace';
  work.before(grid);
  grid.append(intro, work);
  const resources = document.createElement('nav');
  resources.className = 'task-resources';
  resources.setAttribute('aria-label', 'Task resources');
  const icons = [ ['help', 'Help', 'help-circle'], ['example', 'Example', 'file-pencil'], ['related', 'Related work', 'file-arrow-left'] ];
  for (const [kind, label, file] of icons) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `task-resource resource-${kind}`;
    button.dataset.resource = kind;
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-label', `${label} for this task`);
    const img = document.createElement('img');
    img.src = `layout-icons/${file}.svg`;
    img.alt = '';
    img.width = img.height = 26;
    const text = document.createElement('span');
    text.textContent = label;
    button.append(img, text);
    resources.append(button);
  }
  intro.prepend(resources);
  const taskToggle = document.createElement('button');
  taskToggle.type = 'button';
  taskToggle.className = 'mobile-task-toggle';
  taskToggle.setAttribute('aria-controls', 'stageTitle taskSupport');
  taskToggle.innerHTML = '<span class="mobile-task-label"></span><small>Show question</small>';
  resources.after(taskToggle);
  function collapseTask(collapsed) {
    intro.classList.toggle('is-task-collapsed', collapsed);
    taskToggle.setAttribute('aria-expanded', String(!collapsed));
    taskToggle.querySelector('small').textContent = collapsed ? 'Show question' : 'Hide question';
  }
  taskToggle.addEventListener('click', () => collapseTask(!intro.classList.contains('is-task-collapsed')));
  const reminder = document.createElement('details');
  reminder.className = 'workspace-draft-reminder';
  reminder.innerHTML = '<summary aria-label="Working draft reminder" title="Working draft reminder">!</summary><p>This is a working draft. Research ideas become clearer through refinement. It is okay if this changes later.</p>';
  work.append(reminder);
  const dialog = document.createElement('dialog');
  dialog.className = 'task-resource-dialog';
  dialog.setAttribute('aria-labelledby', 'taskResourceTitle');
  dialog.innerHTML = '<div class="dialog-header"><h2 id="taskResourceTitle"></h2><button type="button" class="ghost" data-close-resource>Close</button></div><div class="task-resource-body"></div>';
  document.body.append(dialog);
  const title = dialog.querySelector('h2');
  const body = dialog.querySelector('.task-resource-body');
  let context = null;
  let opener = null;
  let authorsWidth = 180;
  let mode = 'new';
  try { mode = localStorage.getItem(preferenceKey) === 'classic' ? 'classic' : 'new'; } catch { /* New layout remains available without preference storage. */ }
  const visible = node => Boolean(node && !node.closest('[hidden]') && (node.classList.contains('layout-example-source') || getComputedStyle(node).display !== 'none') && !node.closest('.focus-secondary-context'));
  function measure() {
    document.documentElement.style.setProperty('--task-header-height', `${header.getBoundingClientRect().height}px`);
    document.documentElement.style.setProperty('--task-dock-height', `${dock.getBoundingClientRect().height}px`);
    document.documentElement.style.setProperty('--task-bar-height', `${intro.getBoundingClientRect().height}px`);
  }
  if (typeof ResizeObserver === 'function') {
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    observer.observe(dock);
    observer.observe(intro);
  }
  window.addEventListener('resize', measure);
  function setMode(next, persist = true) {
    mode = next === 'new' ? 'new' : 'classic';
    document.body.classList.toggle('layout-new', mode === 'new');
    chooser.value = mode;
    if (persist) {
      try { localStorage.setItem(preferenceKey, mode); status.textContent = 'Layout preference saved in this browser. Proposal responses are unchanged.'; }
      catch { status.textContent = 'Layout changed for this tab. Your browser could not save this preference.'; }
    }
    // Existing values and controls stay mounted when the layout is changed.
    reminder.open = false;
    requestAnimationFrame(measure);
  }
  chooser.addEventListener('change', () => setMode(chooser.value));
  dialog.querySelector('[data-close-resource]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { if (opener?.isConnected) opener.focus({ preventScroll: true }); });
  function paragraph(text, parent = body) {
    const p = document.createElement('p');
    p.textContent = text;
    parent.append(p);
  }
  function openDialog(label, trigger) {
    title.textContent = label;
    body.replaceChildren();
    opener = trigger;
  }
  function guidance() {
    const texts = [context.task.support];
    const roots = [...(context.task.items || []), ...(context.task.context || []), ...(context.task.roots || [])];
    for (const root of roots) {
      for (const node of root.querySelectorAll('.help-tooltip, .hint, .source-reference p, .a4-prompt-guidance p, .construct-prompt-guidance p')) {
        if (!node.closest('[hidden]')) texts.push(node.textContent.trim());
      }
    }
    const common = form.querySelector(':scope > .table-wrap > .hint');
    if (common) texts.push(common.textContent.trim());
    return [...new Set(texts.filter(Boolean))];
  }
  function examples() {
    return [...document.querySelectorAll('#studyExampleAction .example-control, #stageForm .example-control')].filter(visible);
  }
  function related() {
    const p = context.proposal;
    const entries = [];
    const add = (label, stage, section, key, content = p[section]?.[key], selector = `[data-section="${section}"][data-key="${key}"]`) => entries.push({label, stage, content: String(content || ''), selector});
    const questions = () => p.a4.questions.forEach((q, i) => add(`Research question ${i + 1}`, 'a4', 'a4', 'questions', q, `[data-array="a4.questions"][data-index="${i}"]`));
    switch (context.stageId) {
      case 'a1': add('Initial topic', 'a1', 'a1', 'initialTopic'); break;
      case 'a2': add('Core construct', 'a1', 'a1', 'coreConstruct'); break;
      case 'a3': add('Literature synthesis', 'a2', 'a2', 'synthesis'); break;
      case 'a4': add('Your final gap', 'a3', 'a3', 'finalGap'); break;
      case 'framework': add('Literature synthesis', 'a2', 'a2', 'synthesis'); add('Your final gap', 'a3', 'a3', 'finalGap'); add('Problem statement', 'a4', 'a4', 'literatureProblem'); break;
      case 'methodology': add('Problem statement', 'a4', 'a4', 'literatureProblem'); questions(); break;
      case 'ethics': add('Participants / Sources of Data', 'methodology', 'methodology', 'participants'); add('Inclusion criteria', 'methodology', 'methodology', 'inclusionCriteria'); add('Exclusion criteria', 'methodology', 'methodology', 'exclusionCriteria'); break;
      case 'instrumentation': questions(); add('Evidence sources', 'methodology', 'methodology', 'evidenceSources'); add('Inclusion criteria', 'methodology', 'methodology', 'inclusionCriteria'); add('Exclusion criteria', 'methodology', 'methodology', 'exclusionCriteria'); break;
      case 'terms': add('Core construct', 'a1', 'a1', 'coreConstruct'); questions(); break;
      case 'outline': case 'readiness': case 'researchLevel': case 'submission': add('Problem statement', 'a4', 'a4', 'literatureProblem'); questions(); add('Design justification', 'methodology', 'methodology', 'designJustification'); break;
    }
    return entries;
  }
  resources.addEventListener('click', event => {
    const trigger = event.target.closest('[data-resource]');
    if (!trigger || !context) return;
    const kind = trigger.dataset.resource;
    if (kind === 'example') {
      const sources = examples();
      if (sources.length === 1) { context.openExample(sources[0].dataset.exampleStage, sources[0].dataset.exampleType, trigger); return; }
      openDialog('Examples and templates', trigger);
      if (!sources.length) paragraph('No worked example is attached to this task yet. Use Help for the existing instructions and decision criteria.');
      for (const source of sources) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'ghost';
        button.textContent = source.textContent;
        button.addEventListener('click', () => {
          dialog.close();
          context.openExample(source.dataset.exampleStage, source.dataset.exampleType, trigger);
        });
        body.append(button);
      }
    } else if (kind === 'help') {
      openDialog(context.task.title || 'Task guidance', trigger);
      guidance().forEach(text => paragraph(text));
    } else {
      openDialog('Related work in your proposal', trigger);
      const entries = related();
      if (!entries.length) paragraph('This task identifies your research work. Related proposal responses will be available in later sections.');
      for (const entry of entries) {
        const section = document.createElement('section');
        const heading = document.createElement('h3');
        heading.textContent = entry.label;
        section.append(heading);
        paragraph(entry.content || 'No response entered here yet.', section);
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'ghost';
        button.textContent = 'Review source task';
        button.addEventListener('click', () => { dialog.close(); context.openSource(entry.stage, entry.selector); });
        section.append(button);
        body.append(section);
      }
    }
    dialog.showModal();
  });
  function addColumnDividers() {
    form.querySelectorAll('.a2Patterns-row').forEach(row => {
      const authors = row.querySelector('[data-key="authors"]')?.closest('label');
      if (!authors || authors.querySelector('.authors-divider')) return;
      const divider = document.createElement('span');
      divider.className = 'authors-divider';
      divider.tabIndex = 0;
      divider.setAttribute('role', 'separator');
      divider.setAttribute('aria-orientation', 'vertical');
      divider.setAttribute('aria-label', 'Resize Supporting authors column');
      divider.setAttribute('aria-valuemin', '120');
      divider.setAttribute('aria-valuemax', '360');
      const resize = width => {
        authorsWidth = Math.max(120, Math.min(360, width));
        form.style.setProperty('--authors-width', `${authorsWidth}px`);
        form.querySelectorAll('.authors-divider').forEach(d => d.setAttribute('aria-valuenow', String(authorsWidth)));
      };
      let drag = null;
      const freezeObservation = () => {
        const observation = row.querySelector('[data-key="notice"]')?.closest('label');
        const width = observation?.getBoundingClientRect().width;
        if (width) form.style.setProperty('--pattern-observation-width', `${width}px`);
      };
      divider.addEventListener('pointerdown', e => { if (e.button !== 0) return; e.preventDefault(); freezeObservation(); drag = {x:e.clientX, width:authorsWidth}; divider.setPointerCapture(e.pointerId); });
      divider.addEventListener('pointermove', e => { if (drag) resize(drag.width + e.clientX - drag.x); });
      for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) divider.addEventListener(name, () => { drag = null; });
      divider.addEventListener('keydown', e => {
        if (!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
        e.preventDefault();
        freezeObservation();
        resize(e.key === 'Home' ? 120 : e.key === 'End' ? 360 : authorsWidth + (e.key === 'ArrowRight' ? 10 : -10));
      });
      authors.append(divider);
      resize(authorsWidth);
    });
  }
  globalThis.PROPOSAL_LAYOUT = {
    refresh(next) {
      context = next;
      const shortLabel = next.shortLabel || next.task.label || next.task.title;
      taskToggle.querySelector('.mobile-task-label').textContent = shortLabel;
      taskToggle.setAttribute('aria-label', `Show or hide the full question: ${shortLabel}`);
      collapseTask(true);
      grid.classList.toggle('wide-task-workspace', ['a2','a3'].includes(next.stageId));
      reminder.open = false;
      // Keep original example buttons for Classic; the new row opens their real dialogs.
      document.querySelectorAll('.layout-example-source').forEach(n => n.classList.remove('layout-example-source'));
      examples().forEach(n => n.classList.add('layout-example-source'));
      resources.querySelector('[data-resource="example"]').title = examples().length ? 'Open the existing worked example and template' : 'No worked example is attached to this task yet';
      addColumnDividers();
      requestAnimationFrame(measure);
    }
  };
  setMode(mode, false);
})();

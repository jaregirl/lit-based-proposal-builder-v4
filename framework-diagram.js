/* Structured, student-authored framework diagrams. No external services or dependencies. */
(function (root, factory) {
  const api = factory();
  root.FRAMEWORK_DIAGRAM = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(globalThis, function () {
  'use strict';
  const W = 1000, H = 600, BW = 180, BH = 76;
  let svgSequence = 0;
  const basisLabels = { literature: 'Supported by literature or theory', proposed: 'Proposed for investigation', unspecified: 'Basis not yet specified' };
  const text = value => typeof value === 'string' ? value : '';
  const esc = value => text(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clone = value => JSON.parse(JSON.stringify(value));
  const clamp = (value, max) => Math.max(0, Math.min(max, typeof value === 'number' && Number.isFinite(value) ? value : 0));
  function empty() { return { version: 1, nodes: [], links: [], explanation: '' }; }
  function normalize(raw) {
    const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    const result = empty(), ids = new Set(), linkIds = new Set();
    for (const [i, node] of (Array.isArray(source.nodes) ? source.nodes : []).entries()) {
      if (!node || typeof node !== 'object') continue;
      const id = text(node.id) || `concept-${i + 1}`;
      if (ids.has(id)) continue;
      ids.add(id);
      result.nodes.push({ id, text: text(node.text), x: clamp(node.x, W - BW), y: clamp(node.y, H - BH) });
    }
    for (const [i, link] of (Array.isArray(source.links) ? source.links : []).entries()) {
      if (!link || typeof link !== 'object') continue;
      const id = text(link.id) || `link-${i + 1}`, from = text(link.from), to = text(link.to);
      if (linkIds.has(id) || !ids.has(from) || !ids.has(to) || from === to) continue;
      linkIds.add(id);
      result.links.push({ id, from, to, label: text(link.label), basis: Object.hasOwn(basisLabels, link.basis) ? link.basis : 'unspecified' });
    }
    result.explanation = text(source.explanation);
    return result;
  }
  function wrap(value, length, count) {
    const chunks = text(value).trim().match(new RegExp(`.{1,${length}}(?:\\s|$)|.{1,${length}}`, 'g')) || [''];
    const lines = chunks.slice(0, count).map(s => s.trim());
    if (chunks.length > count) lines[count - 1] = lines[count - 1].slice(0, Math.max(1, length - 1)) + '…';
    return lines;
  }
  function ends(a, b) {
    const ax = a.x + BW / 2, ay = a.y + BH / 2, bx = b.x + BW / 2, by = b.y + BH / 2;
    const dx = bx - ax, dy = by - ay;
    if (!dx && !dy) return [ax + BW / 2, ay, bx + BW / 2 + 1, by];
    const k = Math.min(BW / 2 / (Math.abs(dx) || .0001), BH / 2 / (Math.abs(dy) || .0001));
    return [ax + dx * k, ay + dy * k, bx - dx * k, by - dy * k];
  }
  function svg(raw, options = {}) {
    const d = normalize(raw), editable = Boolean(options.editable), selected = options.selected || '';
    const markerId = `frameworkArrow${++svgSequence}`;
    const nodes = new Map(d.nodes.map(n => [n.id, n]));
    const links = d.links.map((link, index) => {
      const [x1,y1,x2,y2] = ends(nodes.get(link.from), nodes.get(link.to));
      const a = nodes.get(link.from), b = nodes.get(link.to);
      let mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - 12 - (index % 2) * 12;
      const label = link.label || 'Label this relationship';
      const lines = wrap(label, 28, 2), width = Math.min(225, Math.max(70, Math.max(...lines.map(s => s.length)) * 7));
      if (Math.abs(a.y-b.y) < BH) my = Math.min(a.y,b.y) - 18 - (lines.length-1)*16;
      else if (Math.abs(a.x-b.x) < BW) mx = Math.max(a.x,b.x) + BW + width/2 + 12;
      mx = Math.max(width/2+8,Math.min(W-width/2-8,mx));
      my = Math.max(18,Math.min(H-lines.length*16,my));
      return `<g><title>${esc(label)} — ${esc(basisLabels[link.basis])}</title><path d="M ${x1} ${y1} L ${x2} ${y2}" stroke="#42635d" stroke-width="2" fill="none" marker-end="url(#${markerId})" ${link.basis === 'proposed' ? 'stroke-dasharray="7 4"' : ''}/><rect x="${mx-width/2}" y="${my-15}" width="${width}" height="${lines.length*16+4}" rx="3" fill="#fff"/><text x="${mx}" y="${my}" text-anchor="middle" font-size="12" fill="#263b37">${lines.map((line,i)=>`<tspan x="${mx}" dy="${i?16:0}">${esc(line)}</tspan>`).join('')}</text></g>`;
    }).join('');
    const boxes = d.nodes.map((n, index) => {
      const label = n.text || `Concept ${index + 1}`, lines = wrap(label, 21, 3);
      return `<g ${editable ? `data-diagram-node="${index}" role="button" tabindex="0" aria-label="Concept ${index+1}: ${esc(label)}. Select to edit; arrow keys move the box."` : ''}><title>${esc(label)}</title><rect x="${n.x}" y="${n.y}" width="${BW}" height="${BH}" rx="7" fill="${selected===n.id?'#dceee7':'#eef4f1'}" stroke="${selected===n.id?'#214f48':'#7e9c92'}" stroke-width="${selected===n.id?3:1.5}"/><text x="${n.x+BW/2}" y="${n.y+BH/2-(lines.length-1)*9+5}" text-anchor="middle" font-size="15" fill="#183b34" pointer-events="none">${lines.map((line,i)=>`<tspan x="${n.x+BW/2}" dy="${i?18:0}">${esc(line)}</tspan>`).join('')}</text></g>`;
    }).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="1000" height="600" role="img" aria-label="Student-authored framework diagram" style="max-width:100%;height:auto;background:white;font-family:Arial,Helvetica,sans-serif"><title>Student-authored framework diagram</title><desc>Concepts and labelled connections. Arrows do not establish causation. A text description follows the diagram.</desc><defs><marker id="${markerId}" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M 0 0 L 10 4 L 0 8 Z" fill="#42635d"/></marker></defs>${links}${boxes}</svg>`;
  }
  function description(raw) {
    const d = normalize(raw), names = new Map(d.nodes.map((n,i)=>[n.id,n.text || `Concept ${i+1}`]));
    return [d.nodes.length ? `Concepts: ${d.nodes.map((n,i)=>n.text || `Concept ${i+1}`).join('; ')}` : '', ...d.links.map(l=>`${names.get(l.from)} → ${names.get(l.to)}: ${l.label || 'Relationship not labelled'} (${basisLabels[l.basis]}).`), d.explanation].filter(Boolean).join('\n');
  }
  function exportHtml(raw) {
    const d = normalize(raw);
    if (!d.nodes.length && !d.explanation.trim()) return '';
    return `<section class="framework-diagram-export"><h3>Framework diagram</h3>${d.nodes.length ? `<figure style="margin:12px 0;break-inside:avoid">${svg(d)}<figcaption style="font-size:10pt">Student-authored representation. Arrows do not by themselves establish causation. Dashed arrows indicate relationships proposed for investigation.</figcaption></figure>` : ''}<h4>Concepts, relationships and explanation</h4><p style="white-space:pre-wrap;overflow-wrap:anywhere">${esc(description(d))}</p></section>`;
  }
  function taskHtml(raw, readOnly = false) {
    const d = normalize(raw);
    return `<section class="framework-diagram-task output-box" data-framework-diagram-task><h3>Framework diagram <small>Optional</small></h3><p class="hint">Represent the concepts and connections that you can explain. A diagram does not replace your written framework, and an arrow is not proof of causation.</p><button type="button" data-open-framework-diagram aria-haspopup="dialog">${readOnly?'View diagram':'Edit diagram'}</button><div class="framework-diagram-preview">${d.nodes.length ? svg(d) : '<p class="hint">No diagram drawn yet. Add your own concepts and label the relationships.</p>'}</div><details class="framework-diagram-text"><summary>Concepts, relationships and explanation</summary><p style="white-space:pre-wrap"></p></details></section>`;
  }
  function mount(root, raw, {readOnly = false, onChange} = {}) {
    let current = normalize(raw);
    const opener = root.querySelector('[data-open-framework-diagram]');
    const update = next => {
      current = normalize(next);
      root.querySelector('.framework-diagram-preview').innerHTML = current.nodes.length ? svg(current) : '<p class="hint">No diagram drawn yet.</p>';
      root.querySelector('.framework-diagram-text p').textContent = description(current) || 'No diagram entries yet.';
      if (!readOnly && onChange) onChange(clone(current));
    };
    root.querySelector('.framework-diagram-text p').textContent = description(current) || 'No diagram entries yet.';
    opener.addEventListener('click', () => openEditor(current, {readOnly, onChange:update, opener}));
  }
  function openEditor(raw, {readOnly = false, onChange, opener} = {}) {
    let d = normalize(raw), selected = d.nodes[0]?.id || '', selectedLink = '', history = [], drag = null;
    const dialog = document.createElement('dialog');
    dialog.className = 'framework-diagram-editor';
    dialog.setAttribute('aria-labelledby','frameworkDiagramEditorTitle');
    dialog.innerHTML = `<div class="diagram-editor-header"><div><h2 id="frameworkDiagramEditorTitle">Framework diagram</h2><p>${readOnly?'Read-only adviser view.':'Your concepts and relationships; saved with this proposal.'}</p></div><button type="button" class="ghost" data-fd="close">Done</button></div><p class="diagram-editor-notice">Arrows show the relationships you specify, not established causation. Explain their basis below.</p><div class="diagram-editor-layout"><aside class="diagram-controls" aria-label="Diagram editing controls"><div class="diagram-action-row"><button type="button" data-fd="add-node">Add concept</button><button type="button" class="ghost" data-fd="undo">Undo</button></div><label>Concept<select data-fd="node"></select></label><label>Concept label<input data-fd="node-text" maxlength="2000" /></label><button type="button" class="ghost" data-fd="delete-node">Delete selected concept</button><hr/><label>Relationship<select data-fd="link"></select></label><div class="diagram-link-ends"><label>From<select data-fd="from"></select></label><label>To<select data-fd="to"></select></label></div><label>Relationship label<input data-fd="label" maxlength="2000" placeholder="e.g., is associated with, informs" /></label><label>Basis<select data-fd="basis"><option value="unspecified">Choose a basis</option><option value="literature">Supported by literature or theory</option><option value="proposed">Proposed for investigation</option></select></label><div class="diagram-action-row"><button type="button" data-fd="add-link">Add arrow</button><button type="button" class="ghost" data-fd="delete-link">Delete arrow</button></div><p class="diagram-live-status" role="status" aria-live="polite"></p></aside><section class="diagram-canvas-panel" aria-label="Diagram canvas and explanation"><p class="diagram-move-help">${readOnly?'Use the concept and relationship lists to read the saved entries.':'Drag boxes to move them. Keyboard: select a box and use arrow keys; Shift moves in larger steps. On a phone, scroll sideways to see the whole canvas.'}</p><div class="diagram-canvas-scroll" tabindex="0" aria-label="Scrollable framework canvas"><div class="diagram-surface"></div></div><label class="diagram-explanation-label">Explain the connections<textarea data-fd="explanation" placeholder="Which connections are supported by literature or theory? Which are proposed for investigation? Include relevant citations and explain what the arrows mean."></textarea></label><details class="diagram-readable"><summary>Read the diagram as text</summary><p></p></details><button type="button" class="ghost" data-fd="download">Download diagram SVG</button></section></div>`;
    document.body.append(dialog);
    const mobileViews = document.createElement('nav');
    mobileViews.className = 'diagram-mobile-views';
    mobileViews.setAttribute('aria-label','Diagram workspace view');
    mobileViews.innerHTML = '<button type="button" class="ghost" data-fd="view-canvas" aria-pressed="true">Diagram</button><button type="button" class="ghost" data-fd="view-controls" aria-pressed="false">Concepts &amp; arrows</button>';
    dialog.querySelector('.diagram-editor-notice').after(mobileViews);
    const q = name => dialog.querySelector(`[data-fd="${name}"]`), surface = dialog.querySelector('.diagram-surface'), status = dialog.querySelector('[role=status]');
    function showControls(show) {
      dialog.classList.toggle('diagram-show-controls',show);
      q('view-canvas').setAttribute('aria-pressed',String(!show));
      q('view-controls').setAttribute('aria-pressed',String(show));
    }
    const newId = prefix => `${prefix}-${globalThis.crypto?.randomUUID?.() || Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)}`;
    const remember = () => { history.push(clone(d)); if (history.length > 50) history.shift(); };
    const tell = message => { status.textContent = message; };
    const save = () => { if (!readOnly && onChange) onChange(clone(d)); };
    const node = () => d.nodes.find(n=>n.id===selected), link = () => d.links.find(l=>l.id===selectedLink);
    const options = () => d.nodes.map((n,i)=>`<option value="${esc(n.id)}">${esc(n.text || `Concept ${i+1}`)}</option>`).join('');
    function paint() {
      surface.innerHTML = svg(d,{editable:true,selected});
      const from = q('from').value, to = q('to').value;
      q('node').innerHTML = options() || '<option value="">No concepts yet</option>';
      q('node').value = selected;
      q('from').innerHTML = q('to').innerHTML = options();
      q('from').value = d.nodes.some(n=>n.id===from) ? from : d.nodes[0]?.id || '';
      q('to').value = d.nodes.some(n=>n.id===to) ? to : d.nodes[1]?.id || d.nodes[0]?.id || '';
      q('link').innerHTML = '<option value="">New relationship</option>' + d.links.map((l,i)=>`<option value="${esc(l.id)}">${i+1}. ${esc(l.label || 'Unlabelled relationship')}</option>`).join('');
      q('link').value = selectedLink;
      q('node-text').disabled = !node();
      q('delete-node').disabled = !node();
      q('delete-link').disabled = !link();
      q('undo').disabled = !history.length;
      dialog.querySelector('.diagram-readable p').textContent = description(d) || 'No diagram entries yet.';
    }
    function fill() {
      q('node-text').value = node()?.text || '';
      const l = link();
      q('label').value = l?.label || '';
      q('basis').value = l?.basis || 'unspecified';
      if (l) { q('from').value=l.from; q('to').value=l.to; }
      q('explanation').value = d.explanation;
    }
    function commit(message) { paint(); save(); if (message) tell(message); }
    q('node').addEventListener('change',()=>{selected=q('node').value;paint();fill();});
    q('link').addEventListener('change',()=>{selectedLink=q('link').value;fill();q('delete-link').disabled=!link();});
    q('node-text').addEventListener('input',()=>{if(readOnly||!node())return;remember();node().text=q('node-text').value;commit();});
    q('explanation').addEventListener('input',()=>{if(readOnly)return;remember();d.explanation=q('explanation').value;commit();});
    function editLink() {
      if(readOnly||!link())return;
      if(q('from').value===q('to').value){tell('Choose two different concepts.');fill();return;}
      remember();Object.assign(link(),{from:q('from').value,to:q('to').value,label:q('label').value,basis:q('basis').value});commit();
    }
    for (const name of ['label','basis','from','to']) q(name).addEventListener(name==='label'?'input':'change',editLink);
    dialog.addEventListener('click', event=>{
      const action=event.target.closest('button[data-fd]')?.dataset.fd;
      if(action==='close'){dialog.close();return;}
      if(action==='view-canvas'||action==='view-controls'){showControls(action==='view-controls');return;}
      if(action==='download'){
        const blob=new Blob([svg(d)],{type:'image/svg+xml;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
        a.href=url;a.download='framework-diagram.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return;
      }
      if(readOnly)return;
      if(action==='add-node'){
        remember();const n=d.nodes.length;const fresh={id:newId('concept'),text:`Concept ${n+1}`,x:40+(n%4)*230,y:40+(Math.floor(n/4)%5)*105};
        d.nodes.push(fresh);selected=fresh.id;commit('Concept added. Edit its label.');fill();q('node-text').focus();q('node-text').select();
      } else if(action==='delete-node'&&node()){
        remember();d.nodes=d.nodes.filter(n=>n.id!==selected);d.links=d.links.filter(l=>l.from!==selected&&l.to!==selected);selected=d.nodes[0]?.id||'';selectedLink='';commit('Concept and its connected arrows removed. Undo is available.');fill();
      } else if(action==='add-link'){
        if(d.nodes.length<2){tell('Add at least two concepts before drawing an arrow.');return;}
        if(q('from').value===q('to').value){tell('Choose two different concepts.');return;}
        if(!q('label').value.trim()){tell('Give the relationship a label before adding its arrow.');q('label').focus();return;}
        remember();const fresh={id:newId('link'),from:q('from').value,to:q('to').value,label:q('label').value,basis:q('basis').value};d.links.push(fresh);selectedLink=fresh.id;commit('Labelled arrow added.');fill();
      } else if(action==='delete-link'&&link()){
        remember();d.links=d.links.filter(l=>l.id!==selectedLink);selectedLink='';commit('Arrow removed. Undo is available.');fill();
      } else if(action==='undo'&&history.length){d=history.pop();selected=d.nodes.some(n=>n.id===selected)?selected:d.nodes[0]?.id||'';selectedLink=d.links.some(l=>l.id===selectedLink)?selectedLink:'';commit('Last change undone.');fill();}
    });
    surface.addEventListener('pointerdown',event=>{
      const g=event.target.closest('[data-diagram-node]');if(!g||event.button!==0)return;
      selected=d.nodes[Number(g.dataset.diagramNode)].id;
      if(!readOnly){const rect=surface.getBoundingClientRect();drag={x:event.clientX,y:event.clientY,startX:node().x,startY:node().y,sx:W/rect.width,sy:H/rect.height,before:clone(d),moved:false};surface.setPointerCapture(event.pointerId);event.preventDefault();}
      paint();fill();
    });
    surface.addEventListener('pointermove',event=>{if(!drag||readOnly)return;node().x=clamp(drag.startX+(event.clientX-drag.x)*drag.sx,W-BW);node().y=clamp(drag.startY+(event.clientY-drag.y)*drag.sy,H-BH);drag.moved=node().x!==drag.startX||node().y!==drag.startY;paint();});
    const finishDrag=()=>{if(drag){const end=drag;drag=null;if(end.moved){history.push(end.before);if(history.length>50)history.shift();paint();save();tell('Concept position saved.');}}};
    for(const event of ['pointerup','pointercancel','lostpointercapture'])surface.addEventListener(event,finishDrag);
    surface.addEventListener('keydown',event=>{
      const g=event.target.closest('[data-diagram-node]');if(!g)return;
      selected=d.nodes[Number(g.dataset.diagramNode)].id;
      if(['Enter',' '].includes(event.key)){event.preventDefault();paint();fill();showControls(true);q('node-text').focus();return;}
      if(readOnly||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
      event.preventDefault();remember();const amount=event.shiftKey?20:5;
      node().x=clamp(node().x+({'ArrowLeft':-amount,'ArrowRight':amount}[event.key]||0),W-BW);
      node().y=clamp(node().y+({'ArrowUp':-amount,'ArrowDown':amount}[event.key]||0),H-BH);
      commit('Concept position saved.');fill();surface.querySelector(`[data-diagram-node="${d.nodes.findIndex(n=>n.id===selected)}"]`)?.focus();
    });
    if(readOnly){
      for(const name of ['add-node','delete-node','add-link','delete-link','undo'])q(name).hidden=true;
      for(const name of ['node-text','label','explanation'])q(name).readOnly=true;
      for(const name of ['from','to','basis'])q(name).disabled=true;
    }
    dialog.addEventListener('close',()=>{finishDrag();dialog.remove();if(opener?.isConnected)opener.focus({preventScroll:true});});
    paint();fill();dialog.showModal();
    return dialog;
  }
  return { empty, normalize, svg, description, exportHtml, taskHtml, mount, openEditor };
});

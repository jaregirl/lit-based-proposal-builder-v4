// Independent review copies. No adviser operation writes to researcher draft keys.
globalThis.ADVISER_STORE = (() => {
  const prefix = "proposalBuilderAdviser:v1:proposal:";
  const sections = ["a1", "a2", "a3", "a4", "framework", "frameworkFinder", "methodology", "ethics", "instrumentation", "terms", "submission", "researchLevel", "mixedMethods", "outline", "engagement", "meta", "teamContributions", "readiness"];
  const object = value => Boolean(value && typeof value === "object" && !Array.isArray(value));
  function proposalState(payload) {
    if (!object(payload)) throw new Error("The file must contain a proposal object.");
    if (payload.backupFormat && payload.backupFormat !== "lit-based-proposal-builder") throw new Error("This is not a Proposal Builder backup.");
    const state = payload.backupFormat ? payload.state : payload;
    if (!object(state) || !["a1", "a2", "a3", "a4", "methodology", "submission"].some(key => object(state[key]))) throw new Error("No recognizable proposal sections were found.");
    for (const key of sections) if (state[key] !== undefined && !object(state[key])) throw new Error(`The ${key} section is not a valid object.`);
    const arrays = [["a2", "patterns"], ["a3", "gaps"], ["a4", "questions"], ["a4", "questionIds"], ["a4", "questionPurposes"], ["a4", "questionFocuses"], ["a4", "questionClaims"], ["instrumentation", "rows"], ["terms", "rows"], ["submission", "groupMembers"]];
    for (const [section, key] of arrays) {
      const value = state[section]?.[key];
      if (value !== undefined && !Array.isArray(value)) throw new Error(`${section}.${key} must be a list.`);
      if (Array.isArray(value) && value.some(item => key === "questions" || key.startsWith("question") ? typeof item !== "string" : !object(item))) throw new Error(`${section}.${key} contains an invalid entry.`);
    }
    return state;
  }
  function read(storage, id) {
    if (!id) return null;
    try {
      const record = JSON.parse(storage.getItem(prefix + id) || "null");
      if (!object(record) || record.id !== id || !record.payload) return null;
      proposalState(record.payload);
      return record;
    } catch { return null; }
  }
  function list(storage) {
    const entries = [];
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key?.startsWith(prefix)) { const record = read(storage, key.slice(prefix.length)); if (record) entries.push(record); }
    }
    return entries.sort((a, b) => b.importedAt.localeCompare(a.importedAt));
  }
  function add(storage, payload, fileName, makeId) {
    proposalState(payload);
    let id = makeId();
    while (storage.getItem(prefix + id) !== null) id = makeId();
    const record = { id, importedAt: new Date().toISOString(), fileName, payload };
    storage.setItem(prefix + id, JSON.stringify(record));
    return record;
  }
  async function importFiles(storage, files, makeId, normalize) {
    const results = [];
    for (const file of files) {
      try {
        const payload = JSON.parse(await file.text());
        // Check that the existing app can render this copy before persisting it.
        normalize(proposalState(payload));
        const record = add(storage, payload, file.name, makeId);
        results.push({ name: file.name, id: record.id, ok: true });
      } catch (error) {
        results.push({ name: file.name, ok: false, error: error.name === "QuotaExceededError" ? "Browser storage is full. This file was not imported; existing copies remain intact." : error.message || "This file could not be imported." });
      }
    }
    return results;
  }
  function url(base, role, id = "") {
    const target = new URL(base);
    target.searchParams.delete("role"); target.searchParams.delete("proposal"); target.searchParams.delete("sourcePart");
    if (role === "adviser") { target.searchParams.set("role", "adviser"); if (id) target.searchParams.set("proposal", id); }
    return target.href;
  }
  const parts = [
    ["construct", "Core construct", "a1", "coreConstruct"],
    ["patterns", "Literature patterns", "a2", "synthesis"],
    ["gap", "Synthesized gap", "a3", "finalGap"],
    ["problem", "Literature-based problem", "a4", "literatureProblem"],
    ["focus", "Central study focus", "a4", "centralFocus"],
    ["centralQuestion", "Central question", "a4", "centralQuestion"],
    ["questions", "Research questions", "a4", "questions"],
    ["claims", "Intended claims", "a4", "questionClaims"],
    ["framework", "Theory / model / framework", "framework", "theoryModel"],
    ["approach", "Research approach", "methodology", "approach"],
    ["design", "Research design", "methodology", "selectedDesign"],
    ["participants", "Participants", "methodology", "participants"],
    ["sampling", "Sampling", "methodology", "sampling"],
    ["setting", "Study setting", "methodology", "locale"],
    ["scope", "Scope and delimitations", "methodology", "operationalDelimitations"],
    ["collection", "Data collection", "methodology", "collection"],
    ["analysis", "Data analysis", "methodology", "analysis"],
    ["instruments", "Instrumentation", "instrumentation", "rows"],
    ["ethics", "Ethics plan", "ethics", "draft"],
    ["terms", "Definition of terms", "terms", "rows"]
  ].map(([id, label, stage, key]) => ({ id, label, stage, key }));
  const text = value => typeof value === "string" ? value : "";
  function entry(source, part) {
    const value = source[part.stage]?.[part.key];
    if (part.id === "questions" || part.id === "claims") return (value || []).map((item, i) => text(item).trim() ? `${i + 1}. ${item}` : "").filter(Boolean).join("\n\n");
    if (part.id === "instruments") return (value || []).map((row, i) => {
      const fields = [["Research question", "rq"], ["Intended claim", "claimNeeded"], ["Evidence needed", "evidenceNeeded"], ["Evidence source", "evidenceSource"], ["Instrument", "instrument"], ["Description", "description"], ["Purpose", "purpose"], ["Analysis", "analysis"], ["Quality checks", "validation"], ["Implementation", "implementation"]];
      const entries = fields.filter(([, key]) => text(row[key]).trim()).map(([label, key]) => `${label}: ${row[key]}`);
      return entries.length ? `Question ${i + 1}\n${entries.join("\n\n")}` : "";
    }).filter(Boolean).join("\n\n");
    if (part.id === "terms") return (value || []).map(row => [text(row.term), text(row.operational), text(row.conceptual), text(row.measured)].filter(item => item.trim()).join("\n")).filter(Boolean).join("\n\n");
    if (part.id === "design") return text(value) || text(source.methodology?.design);
    return text(value);
  }
  function sourceSelector(part, source) {
    if (part.id === "questions") return '[data-array="a4.questions"][data-index="0"]';
    if (part.id === "claims") return '[data-question-claim="0"]';
    if (part.id === "instruments") return '[data-table="instrumentation"][data-index="0"][data-key="evidenceNeeded"]';
    if (part.id === "terms") return '[data-table="terms"][data-index="0"][data-key="term"]';
    if (part.id === "approach" || part.id === "design") return `[data-methodology-selection="${part.id === "approach" || !source.methodology?.approach ? "approach" : "design"}"]`;
    return `[data-section="${part.stage}"][data-key="${part.key}"]`;
  }
  function sourceUrl(base, record, part) {
    const target = new URL(url(base, "adviser", record.id));
    target.searchParams.set("sourcePart", part.id);
    return target.href;
  }
  return { prefix, proposalState, read, list, add, importFiles, url, parts, entry, sourceSelector, sourceUrl };
})();

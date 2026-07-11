const STORAGE_KEY = "proposalBuilderA4DraftUploadVersion";
const APP_VERSION = "v4.5.4 - Framework Finder";
const APP_CREDIT = "Developed by J. Arawiran with assistance from OpenAI Codex, GPT-5-based coding assistant, June 2026.";
const WELCOME_KEY = `${STORAGE_KEY}:welcome:v4.0`;
const SRQ_LIMITS = {
  minimum: 2,
  preferredMaximum: 5,
  maximum: 7
};
const PQF_REFERENCE = "PQF-NCC Resolution 2026-02";
const PQF_NOTE = "This is a formative guide, not official PQF certification. Verify current PQF issuances through official institutional or government sources.";
const degreeLevels = {
  shs: { label: "SHS / Basic Education Research", pqf: "PQF Level 3", short: "Level 3" },
  bachelor: { label: "Bachelor's degree", pqf: "PQF Level 6", short: "Level 6" },
  master: { label: "Master's degree", pqf: "PQF Level 7", short: "Level 7" },
  doctoral: { label: "Doctoral degree", pqf: "PQF Level 8", short: "Level 8" }
};
const rqPurposeOptions = {
  describe: {
    label: "Describe a level, condition, perception, practice, or experience",
    starters: "What is the level of...? What are the perceptions of...? To what extent...?"
  },
  compare: {
    label: "Compare groups, conditions, or situations",
    starters: "Is there a significant difference in...? How do groups differ in...?"
  },
  relationship: {
    label: "Determine a relationship between variables",
    starters: "Is there a significant relationship between...? What is the association between...?"
  },
  predict: {
    label: "Predict an outcome from one or more factors",
    starters: "Which factors predict...? To what extent do... predict...?"
  },
  exploreExperience: {
    label: "Explore experiences, meanings, perceptions, or processes",
    starters: "How do participants describe...? What are the experiences of...? What themes emerge regarding...?"
  },
  explain: {
    label: "Explain how or why something happens",
    starters: "How and why does...? What factors influence...? How does... occur?"
  },
  evaluate: {
    label: "Evaluate a program, strategy, intervention, or practice",
    starters: "How effective is...? How do participants evaluate...? What is the impact of...?"
  },
  develop: {
    label: "Develop a model, framework, or theory",
    starters: "What framework can be developed...? What model explains...? What theory may be generated from...?"
  }
};
const uploadStageIds = ["a1", "a2", "a3"];
let uploadTargetStage = "a1";
let pendingUploadByStage = { a1: null, a2: null, a3: null };
let pdfjsModule = null;
let activePreviewMode = "final";
let activeProgressPrint = null;

const stages = [
  { id: "details", code: "Info", title: "Student Details" },
  { id: "a1", code: "A1", title: "Core Construct Identification" },
  { id: "a2", code: "A2", title: "Deepened Review and Pattern Mapping" },
  { id: "a3", code: "A3", title: "From Patterns to Gaps" },
  { id: "a4", code: "A4", title: "Literature-Based Problem and Questions" },
  { id: "framework", code: "F", title: "Framework and Scope Alignment" },
  { id: "methodology", code: "M", title: "Methodology Builder" },
  { id: "ethics", code: "E", title: "Ethical Considerations" },
  { id: "instrumentation", code: "I", title: "Instrumentation Builder" },
  { id: "terms", code: "D", title: "Definition of Terms" },
  { id: "outline", code: "O", title: "Proposal Outline Generator" },
  { id: "researchLevel", code: "L", title: "Research Level Justification" },
  { id: "readiness", code: "R", title: "Proposal Readiness Check" },
  { id: "submission", code: "PDF", title: "PDF Submission Generation" }
];

const fieldSets = {
  a1: [
    ["initialTopic", "Write your initial topic or area of interest.", "Begin with the topic as you currently understand it. It can come from classroom experience, curiosity, or concern."],
    ["majorNouns", "Extract the major nouns from your topic.", "List the important nouns only. These may be concepts, populations, settings, methods, or outcomes."],
    ["fifteenPageTest", "Which nouns pass the 15-page test?", "Ask: If I had to write 15 pages defining only this noun, could I? Nouns that pass may be possible core constructs."],
    ["rrlMajorityTest", "Which ONE noun would most of your 10-15 articles primarily define?", "Use the RRL majority test. The noun most likely to be defined across the literature is your core construct."],
    ["coreConstruct", "Final declaration: This study is about _____.", "State the core construct plainly. A clear construct prevents scattered literature review, artificial gap statements, and vague problem formulation."]
  ],
  a4: [
    ["literatureProblem", "Literature-Based Problem: What problem becomes visible from your literature gap?", "Use the movement from A3: what studies show, what remains less visible, and what this prevents us from understanding."],
    ["centralQuestion", "Central Research Question: What broad question will your study answer?", "Write one broad question that directly responds to the literature-based problem. This is the anchor question; the specific questions below should break it into smaller answerable parts."],
    ["questionType", "Question Focus: What kind of answers will the study need?", "Name whether the study needs numerical description, comparison, relationship, prediction, explanation of experiences or perceptions, evaluation, model/framework development, or mixed/combined answers."],
    ["studiedGroup", "Study Focus: Who or what is the study about?", "Identify the participant group, context, phenomenon, or object of study made visible by the gap. Keep it feasible."],
    ["rqConstructs", "Required Ideas: What key construct and gap ideas must appear in the questions?", "Carry forward the A1 core construct and A3 final gap. These ideas should appear in the central question and be unpacked by the specific questions."]
  ],
  methodology: [
    ["rqTypes", "What type of questions are being asked?", "Look at your research questions first. Their verbs usually guide the design: describe, compare, relate, evaluate, or explore."],
    ["dataNeeded", "What data are needed?", "Name the evidence needed to answer the questions: scores, survey responses, interview answers, observations, documents, or classroom outputs."],
    ["participants", "Who will participate?", "Identify the participant group, approximate number if known, grade level/program, and why they fit the study."],
    ["purpose", "What is the purpose of the study?", "State whether the study aims to describe a condition, understand an experience, test an intervention, compare groups, or improve classroom practice."]
  ],
  framework: [
    ["theoryModel", "What theory, model, concept, or framework helps explain the problem?", "Name the framework that makes the problem understandable. If there is no formal theory yet, identify the concept or model that organizes the study."],
    ["problemConnection", "How does the framework explain the literature-based problem?", "Explain how the framework helps make sense of the gap, problem, or phenomenon."],
    ["questionConnection", "How does the framework connect to the central and specific questions?", "Show how the framework guides what the study asks, not just what the background section mentions."],
    ["instrumentConnection", "How will the framework guide variables, indicators, instruments, or analysis?", "Connect the framework to what will be measured, observed, coded, compared, or interpreted."],
    ["scopeBoundaries", "What boundaries keep this study feasible?", "Name what is included and excluded: participants, locale, variables, constructs, time, instruments, data sources, or claims."]
  ],
  frameworkFinder: [
    ["literatureSignals", "Find: Which theories, models, concepts, or explanations appeared in your A2 literature?", "Look back at the Theory Pattern and supporting studies in A2. List what the authors used to explain the construct, problem, behavior, experience, relationship, system, or practice."],
    ["candidateFrameworks", "Choose: Which one to three candidate frameworks could help explain this study?", "List only candidates supported by the literature. For each one, briefly state what part of the study it may explain."],
    ["frameworkSource", "Source Check: What scholarly source supports the framework you are considering?", "Give the author, year, and publication or complete reference. Use a source you actually consulted; do not rely only on a website summary or an uncited name."],
    ["selectionReason", "Test: Why is this candidate more useful than the alternatives?", "Compare the candidates. Explain why the selected framework best fits the gap, problem, constructs, and questions."],
    ["withoutFramework", "Test: What would be harder to explain or interpret without this framework?", "Name the reasoning work the framework performs. If removing it changes nothing, it may be decorative."],
    ["methodFit", "Test: How does the framework fit the planned research design?", "Explain the pairing. A framework and method do not need a one-to-one match, but they should work coherently in the questions, evidence, analysis, or interpretation."]
  ],
  researchLevel: [
    ["guidedApplication", "How do your literature gap, research questions, methodology, instruments, and analysis work together as one research plan?", "Explain the chain from literature gap to questions to method to evidence. Show that the parts are not separate answers to a template."],
    ["independentDecisions", "What important research decisions did you make because of the literature, context, or problem, not simply because the template asked for them?", "Name decisions you made and the evidence or context that led you to them."],
    ["designJustification", "Why is your chosen research design appropriate for answering your literature-based problem and research questions?", "Defend the design using the kind of data, participants, gap, and questions in your study."],
    ["alternativesTradeoffs", "What other design, participant group, instrument, data source, or analysis option did you consider? Why did you choose your current option instead?", "Show that you considered alternatives and understood what each choice would allow or limit."],
    ["contextualContribution", "What local, institutional, classroom, professional, or policy context does your study help explain or improve?", "Describe the practical context where the study may matter."],
    ["scholarlyContribution", "What has usually been studied separately, incompletely, or from only one perspective? What new relationship, model, explanation, or framework might your study clarify or develop?", "This helps you articulate novelty or contribution, especially for graduate and doctoral work."],
    ["levelIndependence", "What part of this proposal best shows your own scholarly judgment, reasoning, or decision-making?", "Point to a decision where you weighed evidence and made a defensible research choice."]
  ],
  mixedMethods: [
    ["quantStrand", "If mixed methods: what quantitative data will be collected?", "Name the scores, survey responses, ratings, counts, or measurable variables."],
    ["qualStrand", "If mixed methods: what qualitative data will be collected?", "Name the interviews, open-ended responses, observations, documents, journals, or narratives."],
    ["integrationPoint", "Where will quantitative and qualitative findings be integrated?", "State whether integration happens during analysis, interpretation, discussion, or through a joint display."],
    ["integrationPurpose", "Why is integration needed?", "Explain what can be understood only by connecting the two kinds of findings."]
  ],
  ethics: [
    ["participantAge", "Will participants include minors or vulnerable groups?", "If learners are below 18, plan for parent/guardian consent and child assent. Also note any group needing extra protection."],
    ["powerIssue", "Could there be teacher-student or researcher-participant power issues?", "Consider whether students might feel forced to join because of grades, authority, or classroom relationships."],
    ["dataPrivacy", "What private or sensitive information might be collected?", "List data that must be protected: names, grades, recordings, school records, responses, photos, or interview details."],
    ["permissions", "What institutional permissions will be needed?", "Think of letters or approvals from the school head, cooperating teacher, adviser, ethics committee, parents, or participants."],
    ["consentPlan", "How will informed consent and right to withdraw be explained?", "State how participants will know the purpose, procedures, voluntary nature, risks, benefits, and withdrawal option."],
    ["storagePlan", "How will data be stored, accessed, retained, and disposed of?", "Describe password protection, who can access data, retention period, and disposal plan."],
    ["recordingAiUse", "Will audio/video recording or AI tools be used?", "State whether recording, transcription, translation, coding, or analysis tools will be used and how privacy will be protected."],
    ["cultureLanguage", "How will language and cultural context be respected?", "Consider local language, translation, pilot testing for clarity, cultural appropriateness, and participant dignity."]
  ],
  terms: [
    ["keyTerms", "What key terms must be defined?", "List the core construct, variables, participant labels, intervention names, and important context-specific terms."],
    ["conceptualDefinitions", "What do these terms mean conceptually?", "Briefly state how the literature generally defines the terms."],
    ["operationalDefinitions", "What do these terms mean in this study?", "Define how each term is used in this specific study, not in every possible context."],
    ["measurementObservation", "How will each term be measured, observed, or identified?", "Connect terms to instruments, indicators, sample items, interview prompts, observations, documents, or coding categories."]
  ],
  submission: [
    ["studentName", "Student Name", "Use the name required by your instructor or institution."],
    ["course", "Course", "Enter the course or subject where this app output will be submitted."],
    ["section", "Section", "Add your section, block, program, or class schedule if required."],
    ["submissionDate", "Date", "Use the date of submission or the date your instructor requires."],
    ["initialReadiness", "Initial Readiness Reflection", "Before starting A1, briefly state how ready you think your proposal idea is. Example: 2/5 because I have a topic but not yet a clear literature gap."]
  ],
  finalSubmission: [
    ["confidence", "Final Readiness Reflection", "After completing the workflow, briefly state how ready you think the proposal is and what still needs refinement. Example: 4/5 because the gap and questions are clear but the instruments need revision."],
    ["readinessChange", "What Changed and Why?", "Compare your initial and final readiness. Explain what became clearer, what changed, and what still needs work."]
  ]
};

const tableScaffolds = {
  a2Patterns: {
    type: "Use a pattern category: Context, Method, Theory, Evidence, Practice, Population, or Definition.",
    notice: "Write what repeats across studies. Do not summarize one article; look across several studies.",
    authors: "List the authors that support this pattern. Example: DeLuca et al.; Xu and Brown.",
    years: "Add publication years so the pattern is traceable."
  },
  a3Gaps: {
    type: "Carry the pattern type from A2.",
    show: "State what studies repeatedly show.",
    emphasized: "Name the focus created by those studies.",
    lessVisible: "Because studies focus on that emphasis, what becomes less visible?",
    limits: "Explain what this prevents us from understanding.",
    gap: "Write the refined gap statement. Avoid only saying 'few studies exist.'"
  },
  instrumentation: {
    rq: "Copy or summarize one research question. Each question should have a data source.",
    instrument: "Choose a tool: survey, test, interview guide, focus group guide, observation checklist, rubric, journal, or document guide.",
    description: "Describe what the instrument is and what parts, scales, prompts, indicators, or sections it contains.",
    purpose: "Explain what the instrument is meant to measure, observe, describe, compare, or explore.",
    validation: "Explain expert validation, pilot testing, reliability, inter-rater checking, or trustworthiness strategy.",
    implementation: "Explain how, when, where, and by whom the instrument will be administered or used."
  },
  terms: {
    term: "Write one term only. Use a construct, variable, participant label, intervention name, or context-specific term.",
    conceptual: "State the general meaning of the term based on literature or accepted academic use.",
    operational: "Define exactly what the term means in this study.",
    measured: "Explain how this term will be measured, observed, identified, coded, or represented in an instrument."
  }
};

const defaultData = {
  currentStage: "details",
  startedAt: "",
  a1: {},
  a2: {
    constructs: [
      { construct: "", definition: "", context: "", notes: "" }
    ],
    patterns: [
      { type: "Context", notice: "", authors: "", years: "" },
      { type: "Method", notice: "", authors: "", years: "" },
      { type: "Theory", notice: "", authors: "", years: "" },
      { type: "Evidence", notice: "", authors: "", years: "" },
      { type: "Practice", notice: "", authors: "", years: "" },
      { type: "Population", notice: "", authors: "", years: "" },
      { type: "Definition", notice: "", authors: "", years: "" }
    ]
  },
  a3: {
    gaps: [
      { type: "Context", show: "", emphasized: "", lessVisible: "", limits: "", gap: "" },
      { type: "Method", show: "", emphasized: "", lessVisible: "", limits: "", gap: "" },
      { type: "Theory", show: "", emphasized: "", lessVisible: "", limits: "", gap: "" },
      { type: "Evidence", show: "", emphasized: "", lessVisible: "", limits: "", gap: "" },
      { type: "Practice", show: "", emphasized: "", lessVisible: "", limits: "", gap: "" },
      { type: "Population", show: "", emphasized: "", lessVisible: "", limits: "", gap: "" },
      { type: "Definition", show: "", emphasized: "", lessVisible: "", limits: "", gap: "" }
    ],
    strongestGap: "",
    weakestGap: "",
    selectionReason: "",
    finalGap: ""
  },
  a4: {
    questions: ["", "", ""],
    questionPurposes: ["", "", ""]
  },
  methodology: {
    selectedDesign: "",
    sampling: "",
    locale: "",
    collection: "",
    analysis: ""
  },
  framework: {},
  frameworkFinder: {
    pathway: "problem-led"
  },
  researchLevel: {},
  mixedMethods: {},
  ethics: {
    checks: {},
    draft: ""
  },
  instrumentation: {
    rows: [
      { rq: "", instrument: "", description: "", purpose: "", validation: "", implementation: "" }
    ]
  },
  outline: {
    notes: ""
  },
  terms: {
    rows: [
      { term: "", conceptual: "", operational: "", measured: "" }
    ]
  },
  readiness: {},
  submission: {
    degreeLevel: "master"
  }
};

const ethicsChecks = [
  "Voluntary participation",
  "Informed consent",
  "Right to withdraw",
  "Confidentiality",
  "Anonymity when appropriate",
  "Data privacy",
  "Secure data storage",
  "Institutional permission",
  "Parental consent when minors are involved",
  "Child assent when minors participate",
  "Avoidance of harm",
  "No coercion",
  "Researcher-participant power issues",
  "Ethics review requirements"
];

let state = normalizeState(loadState());

const els = {
  stageNav: document.getElementById("stageNav"),
  stageTitle: document.getElementById("stageTitle"),
  stageForm: document.getElementById("stageForm"),
  feedback: document.getElementById("feedback"),
  issueList: document.getElementById("issueList"),
  completionText: document.getElementById("completionText"),
  completionBar: document.getElementById("completionBar"),
  alignmentScore: document.getElementById("alignmentScore"),
  currentStage: document.getElementById("currentStage"),
  previewDialog: document.getElementById("previewDialog"),
  submissionPreview: document.getElementById("submissionPreview"),
  importFile: document.getElementById("importFile"),
  appVersion: document.getElementById("appVersion"),
  appCredit: document.getElementById("appCredit"),
  aboutDialog: document.getElementById("aboutDialog"),
  welcomeDialog: document.getElementById("welcomeDialog")
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return clone(defaultData);
  try {
    return { ...clone(defaultData), ...JSON.parse(saved) };
  } catch {
    return clone(defaultData);
  }
}

function normalizeState(nextState) {
  const normalized = { ...clone(defaultData), ...nextState };
  if (!normalized.startedAt) normalized.startedAt = new Date().toISOString();
  normalized.a1 = { ...clone(defaultData.a1), ...(nextState.a1 || {}) };
  normalized.a2 = { ...clone(defaultData.a2), ...(nextState.a2 || {}) };
  normalized.a3 = { ...clone(defaultData.a3), ...(nextState.a3 || {}) };
  normalized.a4 = { ...clone(defaultData.a4), ...(nextState.a4 || {}) };
  normalized.framework = { ...clone(defaultData.framework), ...(nextState.framework || {}) };
  normalized.frameworkFinder = { ...clone(defaultData.frameworkFinder), ...(nextState.frameworkFinder || {}) };
  normalized.researchLevel = { ...clone(defaultData.researchLevel), ...(nextState.researchLevel || {}) };
  normalized.methodology = { ...clone(defaultData.methodology), ...(nextState.methodology || {}) };
  normalized.mixedMethods = { ...clone(defaultData.mixedMethods), ...(nextState.mixedMethods || {}) };
  normalized.ethics = { ...clone(defaultData.ethics), ...(nextState.ethics || {}) };
  normalized.instrumentation = { ...clone(defaultData.instrumentation), ...(nextState.instrumentation || {}) };
  normalized.terms = { ...clone(defaultData.terms), ...(nextState.terms || {}) };
  normalized.outline = { ...clone(defaultData.outline), ...(nextState.outline || {}) };
  normalized.submission = { ...clone(defaultData.submission), ...(nextState.submission || {}) };
  if (!normalized.submission.degreeLevel) normalized.submission.degreeLevel = "master";
  if (!Array.isArray(normalized.a2.patterns)) normalized.a2.patterns = clone(defaultData.a2.patterns);
  if (!Array.isArray(normalized.a3.gaps)) normalized.a3.gaps = clone(defaultData.a3.gaps);
  if (!Array.isArray(normalized.a4.questions)) normalized.a4.questions = ["", "", ""];
  if (!Array.isArray(normalized.a4.questionPurposes)) normalized.a4.questionPurposes = [];
  normalized.a4.questionPurposes = normalized.a4.questions.map((_, index) => normalized.a4.questionPurposes[index] || "");
  if (!Array.isArray(normalized.instrumentation.rows)) normalized.instrumentation.rows = clone(defaultData.instrumentation.rows);
  normalized.instrumentation.rows = normalized.instrumentation.rows.map(normalizeInstrumentRow);
  if (!Array.isArray(normalized.terms.rows)) {
    const oldTerms = nextState.terms || {};
    normalized.terms.rows = [
      {
        term: oldTerms.keyTerms || "",
        conceptual: oldTerms.conceptualDefinitions || "",
        operational: oldTerms.operationalDefinitions || "",
        measured: oldTerms.measurementObservation || ""
      }
    ];
  }
  normalized.terms.rows = normalized.terms.rows.map(normalizeTermRow);
  return normalized;
}

function normalizeInstrumentRow(row = {}) {
  return {
    rq: row.rq || "",
    instrument: row.instrument || "",
    description: row.description || row.data || "",
    purpose: row.purpose || row.sample || "",
    validation: row.validation || "",
    implementation: row.implementation || row.source || ""
  };
}

function normalizeTermRow(row = {}) {
  return {
    term: row.term || row.keyTerms || "",
    conceptual: row.conceptual || row.conceptualDefinitions || "",
    operational: row.operational || row.operationalDefinitions || "",
    measured: row.measured || row.measurementObservation || ""
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateDashboard();
}

function currentIndex() {
  return stages.findIndex((stage) => stage.id === state.currentStage);
}

function value(path, fallback = "") {
  const [section, key] = path.split(".");
  return state[section]?.[key] ?? fallback;
}

function setValue(section, key, nextValue) {
  state[section][key] = nextValue;
  saveState();
}

function escapeHtml(text = "") {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatTimestamp(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";
  return date.toLocaleString([], {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function formatDuration(startValue, endDate = new Date()) {
  const startDate = new Date(startValue);
  if (Number.isNaN(startDate.getTime())) return "Not recorded";
  const totalMinutes = Math.max(0, Math.round((endDate - startDate) / 60000));
  if (totalMinutes < 1) return "Less than 1 minute";
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  const parts = [];
  if (days) parts.push(`${days} day${days === 1 ? "" : "s"}`);
  if (hours) parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
  if (minutes) parts.push(`${minutes} minute${minutes === 1 ? "" : "s"}`);
  return parts.join(", ");
}

function sentence(parts) {
  return parts.filter((part) => String(part || "").trim()).join(" ");
}

function helpControl(id, label, text) {
  return `
    <span class="help-icon" role="button" tabindex="0" aria-label="Guidance for ${escapeHtml(label)}" aria-describedby="${id}">?</span>
    <span class="help-tooltip" id="${id}" role="tooltip">${escapeHtml(text)}</span>
  `;
}

function draftHelp(section, scaffold) {
  return section === "submission" ? scaffold : `${scaffold} This is a working draft, and you can refine it later.`;
}

function renderNav() {
  els.stageNav.innerHTML = stages.map((stage) => {
    const done = stageCompletion(stage.id) > 0.55 ? "done" : "";
    const active = state.currentStage === stage.id ? "active" : "";
    const index = stages.findIndex((item) => item.id === stage.id);
    return `
      <button class="stage-tab ${active}" type="button" data-stage="${stage.id}" title="Step ${index + 1}: ${stage.title}">
        <span class="stage-code">${stage.code}</span>
        <span class="stage-label"><small>Step ${index + 1}</small>${stage.title}</span>
        <span class="status-dot ${done}" aria-hidden="true"></span>
      </button>
    `;
  }).join("");
}

function render() {
  const stage = stages[currentIndex()];
  if (els.appVersion) els.appVersion.textContent = APP_VERSION;
  if (els.appCredit) els.appCredit.textContent = APP_CREDIT;
  els.stageTitle.textContent = `${stage.code} - ${stage.title}`;
  els.currentStage.textContent = stage.code;
  renderNav();
  renderStage();
  syncStudentDetailsFields();
  updateStudentDetailsButtonVisibility();
  updateUploadButtonLabel();
  updateDashboard();
}

function updateStudentDetailsButtonVisibility() {
  const button = document.getElementById("studentDetailsBtn");
  if (!button) return;
  button.hidden = state.currentStage !== "details";
}

function updateUploadButtonLabel() {
  const button = document.getElementById("uploadFormsBtn");
  if (!button) return;
  if (state.currentStage === "a1") {
    button.textContent = "Upload A1 Form";
    button.disabled = false;
  } else if (state.currentStage === "a2") {
    button.textContent = "Upload A2 Form";
    button.disabled = false;
  } else if (state.currentStage === "a3") {
    button.textContent = "Upload A3 Form";
  } else {
    button.hidden = true;
    return;
  }
  button.hidden = false;
  button.disabled = false;
}

function renderStage() {
  const id = state.currentStage;
  if (id === "a1") return renderA1();
  if (id === "details") return renderStudentDetailsStage();
  if (id === "a2") return renderA2();
  if (id === "a3") return renderA3();
  if (id === "a4") return renderA4();
  if (id === "framework") return renderFramework();
  if (id === "researchLevel") return renderResearchLevel();
  if (id === "methodology") return renderMethodology();
  if (id === "ethics") return renderEthics();
  if (id === "instrumentation") return renderInstrumentation();
  if (id === "terms") return renderTerms();
  if (id === "outline") return renderOutline();
  if (id === "readiness") return renderReadiness();
  return renderSubmission();
}

function renderFields(section, fields) {
  return `
    <div class="field-grid">
      ${fields.map(([key, label, scaffold], index) => `
        <div class="field ${index === fields.length - 1 ? "full" : ""}">
          <div class="field-label">
            <label for="${section}-${key}">${label}</label>
            ${helpControl(`${section}-${key}-help`, label, draftHelp(section, scaffold))}
          </div>
          <textarea id="${section}-${key}" data-section="${section}" data-key="${key}" aria-describedby="${section}-${key}-help">${escapeHtml(value(`${section}.${key}`))}</textarea>
        </div>
      `).join("")}
    </div>
  `;
}

function degreeLevelInfo() {
  return degreeLevels[state.submission.degreeLevel] || degreeLevels.master;
}

function renderDegreeLevelSelect(prefix = "") {
  const id = `${prefix}degreeLevel`;
  return `
    <div class="field full">
      <div class="field-label">
        <label for="${id}">Research Level / Use Context</label>
        ${helpControl(`${id}-help`, "Research Level / Use Context", "Choose where this proposal will be used. SHS/basic education receives feasibility guidance. Bachelor's, Master's, and Doctoral work receive PQF-informed formative readiness checks.")}
      </div>
      <select id="${id}" data-section="submission" data-key="degreeLevel" aria-describedby="${id}-help">
        ${Object.entries(degreeLevels).map(([key, item]) => `<option value="${key}" ${state.submission.degreeLevel === key ? "selected" : ""}>${escapeHtml(item.label)} (${escapeHtml(item.pqf)})</option>`).join("")}
      </select>
      <p class="hint">This is a formative guide only. It does not certify PQF compliance or institutional approval.</p>
    </div>
  `;
}

function renderStudentDetailsStage() {
  els.stageForm.innerHTML = `
    <section class="output-box">
      <h3>Before You Begin: Privacy and Local Saving</h3>
      <div class="generated-text">Your work is saved locally in your own browser. The app does not send your answers to the developer, instructor, or a cloud server. Use Download Backup before changing devices, clearing browser data, or updating the app.</div>
    </section>
    <section class="output-box">
      <h3>Student Details</h3>
      <p class="hint">These details will appear in the proposal summary and PDF submission. You can update them later from the Student Details button.</p>
    </section>
    <div class="field-grid">
      ${renderDegreeLevelSelect()}
    </div>
    ${renderFields("submission", fieldSets.submission)}
  `;
}

function renderA1() {
  const topic = buildTopic();
  els.stageForm.innerHTML = `
    ${renderFields("a1", fieldSets.a1)}
    <section class="output-box">
      <h3>A1 Output</h3>
      <div class="generated-text">${escapeHtml(topic || "Your core construct declaration will appear here.")}</div>
    </section>
  `;
}

function renderA2() {
  els.stageForm.innerHTML = `
    <section class="table-wrap">
      <h3>Pattern Mapping Matrix</h3>
      <p class="hint">Read at least 10-15 peer-reviewed journal articles directly related to your A1 core construct. Do not summarize each article separately. Look for repetition across studies.</p>
      <div class="table-scroll">
        <div class="editable-list">
          ${state.a2.patterns.map((row, index) => tableRow("a2Patterns", index, ["type", "notice", "authors", "years"], ["Pattern Type", "What do you notice across studies?", "Supporting Authors", "Year"])).join("")}
        </div>
      </div>
      <button type="button" data-add-row="a2Patterns">Add Pattern</button>
    </section>
    <section class="field">
      <div class="field-label">
        <label for="a2-synthesis">Short synthesis</label>
        ${helpControl("a2-synthesis-help", "Short synthesis", "Write 5-7 sentences: What seems heavily studied? What approaches dominate? What keeps recurring? What feels less developed?")}
      </div>
      <textarea id="a2-synthesis" data-section="a2" data-key="synthesis" aria-describedby="a2-synthesis-help">${escapeHtml(value("a2.synthesis"))}</textarea>
    </section>
  `;
}

function renderA3() {
  els.stageForm.innerHTML = `
    <section class="table-wrap">
      <h3>A3 Matrix: From Patterns to Gaps</h3>
      <p class="hint">A gap is not simply what is missing. It is what cannot yet be understood because studies emphasize certain approaches, groups, methods, or explanations.</p>
      <div class="table-scroll">
        <div class="editable-list">
          ${state.a3.gaps.map((row, index) => tableRow("a3Gaps", index, ["type", "show", "emphasized", "lessVisible", "limits", "gap"], ["Pattern Type", "Studies repeatedly show...", "What is emphasized", "What is not captured / less visible", "What this limits us from understanding", "Refined Gap Statement"])).join("")}
        </div>
      </div>
      <button type="button" data-add-row="a3Gaps">Add Gap Row</button>
    </section>
    <div class="field-grid">
      <div class="field">
        <div class="field-label">
          <label for="a3-strongestGap">Strongest gap</label>
          ${helpControl("a3-strongestGap-help", "Strongest gap", "Choose a gap that is specific, connected to the pattern, shows what cannot yet be understood, and can be examined in a real context.")}
        </div>
        <textarea id="a3-strongestGap" data-section="a3" data-key="strongestGap" aria-describedby="a3-strongestGap-help">${escapeHtml(value("a3.strongestGap"))}</textarea>
      </div>
      <div class="field">
        <div class="field-label">
          <label for="a3-weakestGap">Weakest gap</label>
          ${helpControl("a3-weakestGap-help", "Weakest gap", "A weak gap often repeats the pattern, only says something is missing, is too broad, or cannot realistically be investigated.")}
        </div>
        <textarea id="a3-weakestGap" data-section="a3" data-key="weakestGap" aria-describedby="a3-weakestGap-help">${escapeHtml(value("a3.weakestGap"))}</textarea>
      </div>
      <div class="field">
        <div class="field-label">
          <label for="a3-selectionReason">Reason for selection</label>
          ${helpControl("a3-selectionReason-help", "Reason for selection", "Explain why the strongest gap is more useful for your study than the weaker gap.")}
        </div>
        <textarea id="a3-selectionReason" data-section="a3" data-key="selectionReason" aria-describedby="a3-selectionReason-help">${escapeHtml(value("a3.selectionReason"))}</textarea>
      </div>
      <div class="field">
        <div class="field-label">
          <label for="a3-finalGap">Final gap to carry forward</label>
          ${helpControl("a3-finalGap-help", "Final gap to carry forward", "State what remains insufficiently understood and why that limitation exists.")}
        </div>
        <textarea id="a3-finalGap" data-section="a3" data-key="finalGap" aria-describedby="a3-finalGap-help">${escapeHtml(value("a3.finalGap"))}</textarea>
      </div>
    </div>
    <section class="output-box">
      <h3>A3 Output</h3>
      <div class="generated-text">${escapeHtml(value("a3.finalGap") || "Your final literature gap will appear here.")}</div>
    </section>
  `;
}

function renderA4() {
  els.stageForm.innerHTML = `
    ${renderFields("a4", fieldSets.a4)}
    <section class="output-box">
      <h3>From Central Question to Specific Questions</h3>
      <div class="generated-text">Use the central research question as the anchor. Each specific research question should answer one clear part of that central question. Start with purpose before wording: ask what specific information the question should produce, then choose the purpose and use the suggested starters.</div>
    </section>
    <section class="table-wrap">
      <h3>Break the Central Question into Specific Research Questions</h3>
      <p class="hint">Each SRQ should be traceable to the central question, the A3 final gap, and the A1 core construct. Add ${SRQ_LIMITS.minimum}-${SRQ_LIMITS.maximum} questions as needed.</p>
      <section class="output-box rq-anchor-box">
        <h3>Central Research Question to Break Down</h3>
        <div class="generated-text">${escapeHtml(state.a4.centralQuestion || "Write the central research question above first. Then use it as the anchor for the SRQs.")}</div>
      </section>
      <div class="editable-list">
        ${state.a4.questions.map((question, index) => `
          <div class="question-row">
            <label>
              <span class="field-label">
                <span>Question ${index + 1} purpose</span>
                ${helpControl(`a4-question-${index}-purpose-help`, `Question ${index + 1} purpose`, questionStarterHint(index))}
              </span>
              <select data-question-purpose="${index}">
                <option value="">Choose the purpose of this question</option>
                ${Object.entries(rqPurposeOptions).map(([key, option]) => `<option value="${key}" ${state.a4.questionPurposes[index] === key ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}
              </select>
            </label>
            <textarea data-array="a4.questions" data-index="${index}" aria-label="Research question ${index + 1}">${escapeHtml(question)}</textarea>
            <button class="row-remove" type="button" data-remove-question="${index}">X</button>
          </div>
        `).join("")}
      </div>
      <button type="button" data-add-question>Add Question</button>
    </section>
  `;
}

function questionStarterHint(index) {
  const purpose = state.a4.questionPurposes[index];
  if (!purpose || !rqPurposeOptions[purpose]) {
    return "Choose a purpose first. The app will suggest question starters based on what the question is trying to find out.";
  }
  return `Suggested starters: ${rqPurposeOptions[purpose].starters}`;
}

function renderMethodology() {
  const mixedNeeded = isMixedMethodsLikely();
  els.stageForm.innerHTML = `
    ${renderFields("methodology", fieldSets.methodology)}
    <section class="field">
      <div class="field-label">
        <label for="selectedDesign">Recommended or selected research design</label>
        ${helpControl("selectedDesign-help", "Recommended or selected research design", recommendMethodology())}
      </div>
      <select id="selectedDesign" data-section="methodology" data-key="selectedDesign">
        ${["", "Descriptive Quantitative", "Correlational Quantitative", "Comparative Quantitative", "Quasi-experimental", "Phenomenology", "Case Study", "Narrative Inquiry", "Basic Qualitative Study", "Mixed Methods", "Action Research"].map((option) => `
          <option value="${option}" ${value("methodology.selectedDesign") === option ? "selected" : ""}>${option || "Select after reviewing recommendation"}</option>
        `).join("")}
      </select>
    </section>
    <section class="output-box">
      <h3>Ethics Comes Before Instruments</h3>
      <div class="generated-text">After identifying participants and design, review ethics before finalizing instruments. Participant age, power relationships, consent, privacy, recording, and institutional permission should shape data collection.</div>
    </section>
    ${mixedNeeded ? `
      <section class="table-wrap">
        <h3>Mixed Methods Integration</h3>
        <p class="hint">Complete this only if the study uses both quantitative and qualitative data. Mixed methods requires integration, not just two separate data sets.</p>
        ${renderFields("mixedMethods", fieldSets.mixedMethods)}
      </section>
    ` : ""}
    ${methodologyOutputFields()}
  `;
}

function renderFramework() {
  const pathway = value("frameworkFinder.pathway") || "problem-led";
  els.stageForm.innerHTML = `
    <section class="output-box">
      <h3>Framework Finder: Find &rarr; Choose &rarr; Test &rarr; Write</h3>
      <div class="generated-text">For most beginning researchers, formally select a framework after the literature gap, problem, and questions have become clear enough to test its fit. Theories noticed during A2 are candidates, not automatic choices. Research is iterative, so the selected framework may lead you back to refine A2-A4.</div>
    </section>
    <section class="field full framework-pathway">
      <div class="field-label">
        <label for="frameworkFinder-pathway">Which pathway describes this study?</label>
        ${helpControl("frameworkFinder-pathway-help", "Research pathway", "Choose problem-led for a study that begins from a literature gap or problem. Choose theory-led only when the study explicitly tests, extends, refines, or challenges a theory.")}
      </div>
      <select id="frameworkFinder-pathway" data-section="frameworkFinder" data-key="pathway" aria-describedby="frameworkFinder-pathway-help">
        <option value="problem-led" ${pathway === "problem-led" ? "selected" : ""}>Problem-led: the framework is selected after A2-A4 become clear</option>
        <option value="theory-led" ${pathway === "theory-led" ? "selected" : ""}>Theory-led: the study explicitly tests, extends, refines, or challenges a theory</option>
      </select>
      <p class="hint">${pathway === "theory-led" ? "Name what the study will test, extend, refine, or challenge. The theory must still fit the literature gap, questions, method, and interpretation." : "Look back at A2 for possible explanations, then test their fit against the A3 gap and A4 problem and questions."}</p>
    </section>
    ${renderFields("frameworkFinder", fieldSets.frameworkFinder)}
    <section class="output-box framework-write-intro">
      <h3>Write the Framework and Scope</h3>
      <div class="generated-text">Now state the selected framework and show the work it will do in this proposal. The framework may guide constructs, questions, interpretation, or relevant instrument dimensions; it does not have to control every part of the study.</div>
    </section>
    ${renderFields("framework", fieldSets.framework)}
    <section class="checker-panel">
      <h3>Framework and Scope Readiness</h3>
      <div class="feedback">${checkFramework().map(feedbackHtml).join("")}</div>
    </section>
  `;
}

function renderResearchLevel() {
  const degree = degreeLevelInfo();
  const readiness = degreeLevelReadiness();
  const isShs = state.submission.degreeLevel === "shs";
  els.stageForm.innerHTML = `
    <section class="output-box">
      <h3>Research Level Justification</h3>
      <div class="generated-text">Research level / use context: ${escapeHtml(degree.label)}
${isShs ? `Mapped reference: ${escapeHtml(degree.pqf)} based on ${escapeHtml(PQF_REFERENCE)}. For SHS/basic education, the app looks for structured research tasks, emerging independence, clear responsibility for outputs, and feasible use of foundational research knowledge.` : `Mapped reference: ${escapeHtml(degree.pqf)} based on ${escapeHtml(PQF_REFERENCE)}`}

Use this section to show evidence that the proposal is appropriate for the level or context where it will be completed. ${escapeHtml(isShs ? "Advanced ideas are welcome. The app will help students scope the study so the method, data, time, and ethics remain manageable." : PQF_NOTE)}</div>
    </section>
    ${renderFields("researchLevel", fieldSets.researchLevel)}
    <section class="checker-panel">
      <h3>${isShs ? "School-Level Feasibility Readiness" : "Degree-Level Readiness"}</h3>
      <div class="feedback">${readiness.items.map(feedbackHtml).join("")}</div>
    </section>
  `;
}

function renderTerms() {
  if (!state.terms.rows.length) state.terms.rows.push(emptyRowFor("terms"));
  els.stageForm.innerHTML = `
    <section class="output-box">
      <h3>Definition of Terms</h3>
      <div class="generated-text">Define one term at a time. Strong operational definitions connect each term to instruments, indicators, observations, documents, or analysis.</div>
    </section>
    <section class="output-box">
      <h3>What Terms Need Operational Definition?</h3>
      <div class="generated-text">Define terms that control how the study will be understood or measured:
- the core construct from A1
- variables, indicators, or major concepts in the research questions
- participant labels, groups, or roles used in a specific way
- programs, interventions, strategies, practices, tools, or materials being studied
- outcome terms such as performance, engagement, awareness, competence, perception, readiness, or integration
- context-specific terms that may mean something different in this study than in ordinary use

Usually, do not define ordinary words unless the study uses them in a special technical way.</div>
    </section>
    <section class="output-box">
      <h3>Example</h3>
      <div class="generated-text">Term: Science teaching confidence
Conceptual definition: A teacher's belief in their ability to teach science effectively.
Operational definition: In this study, science teaching confidence refers to the participant's self-rated confidence in planning, explaining, and assessing science lessons.
Measured, observed, or identified through: Survey items on confidence in lesson planning, explaining concepts, facilitating activities, and assessing learning.</div>
    </section>
    <section class="table-wrap instrumentation-layout">
      <div class="table-card-list">
        ${state.terms.rows.map((row, index) => termRow(index)).join("")}
      </div>
      <button type="button" data-add-row="terms">Add Term</button>
    </section>
  `;
}

function termRow(index) {
  const row = normalizeTermRow(state.terms.rows[index]);
  const fields = [
    ["term", "Term"],
    ["conceptual", "Conceptual Definition"],
    ["operational", "Operational Definition"],
    ["measured", "Measured, Observed, or Identified Through"]
  ];
  return `
    <div class="table-row instrumentation-row" style="--cols:4">
      <section class="output-box">
        <h3>Term ${index + 1}</h3>
        <div class="generated-text" data-term-title="${index}">${escapeHtml(row.term || "Add one key term for this study.")}</div>
      </section>
      ${fields.map(([key, label]) => `
        <label>
          <span class="field-label">
            <span>${escapeHtml(label)}</span>
            ${helpControl(`terms-${index}-${key}-help`, label, tableScaffolds.terms[key])}
          </span>
          <textarea data-table="terms" data-index="${index}" data-key="${key}" aria-describedby="terms-${index}-${key}-help">${escapeHtml(row[key] || "")}</textarea>
        </label>
      `).join("")}
      <section class="output-box">
        <h3>Draft Definition Preview</h3>
        <div class="generated-text" data-term-preview="${index}">${escapeHtml(termDefinitionPreview(row))}</div>
      </section>
      <button class="row-remove" type="button" data-remove-row="terms:${index}">X</button>
    </div>
  `;
}

function termDefinitionPreview(row) {
  row = normalizeTermRow(row);
  if (!row.term && !row.conceptual && !row.operational && !row.measured) {
    return "The draft definition will appear here after you add the term details.";
  }
  const term = row.term || "[term]";
  const conceptual = row.conceptual || "[add the general or literature-based meaning]";
  const operational = row.operational || "[add how the term is used in this study]";
  const measured = row.measured || "[add how it will be measured, observed, identified, coded, or represented]";
  return `${term} refers generally to ${conceptual}. In this study, ${term} refers to ${operational}. It will be measured, observed, or identified through ${measured}.`;
}

function updateTermPreview(index) {
  const row = normalizeTermRow(state.terms.rows[index]);
  const preview = document.querySelector(`[data-term-preview="${index}"]`);
  const title = document.querySelector(`[data-term-title="${index}"]`);
  if (preview) preview.textContent = termDefinitionPreview(row);
  if (title) title.textContent = row.term || "Add one key term for this study.";
}

function methodologyOutputFields() {
  const fields = [
    ["sampling", "Sampling", "Explain how participants will be chosen. Examples: purposive, convenience, total enumeration, random sampling, or intact class selection."],
    ["locale", "Locale", "Describe the school, classroom, community, or online setting without exposing private details unnecessarily."],
    ["collection", "Data Collection", "Sequence the steps: permission, consent, instrument administration, interview/observation, retrieval, and safekeeping."],
    ["analysis", "Data Analysis", "Match analysis to data: frequency/mean, t-test, correlation, thematic analysis, content analysis, or reflection cycle."]
  ];
  return `<div class="field-grid">${fields.map(([key, label]) => `
    <div class="field">
      <div class="field-label">
        <label for="methodology-${key}">${label}</label>
        ${helpControl(`methodology-${key}-help`, label, `${fields.find((field) => field[0] === key)[2]} This can change after your adviser checks the design.`)}
      </div>
      <textarea id="methodology-${key}" data-section="methodology" data-key="${key}" aria-describedby="methodology-${key}-help">${escapeHtml(value(`methodology.${key}`))}</textarea>
    </div>
  `).join("")}</div>`;
}

function renderEthics() {
  els.stageForm.innerHTML = `
    ${renderFields("ethics", fieldSets.ethics)}
    <section class="field">
      <h3>Ethics Checklist</h3>
      <p class="hint">Select only safeguards that apply, then explain them in your own context. If learners are minors, consent and assent usually need special attention.</p>
      ${ethicsChecks.map((item) => `
        <label class="hint"><input class="small-input" type="checkbox" data-ethics-check="${escapeHtml(item)}" ${state.ethics.checks[item] ? "checked" : ""}> ${item}</label>
      `).join("")}
    </section>
    <section class="output-box">
      <h3>Draft Ethical Considerations Section</h3>
      <textarea data-section="ethics" data-key="draft">${escapeHtml(value("ethics.draft") || buildEthicsDraft())}</textarea>
      <p class="hint">Risk level: ${escapeHtml(ethicsRisk().label)}. ${escapeHtml(ethicsRisk().reason)}</p>
    </section>
  `;
}

function renderInstrumentation() {
  syncInstrumentationRows();
  const rows = state.instrumentation.rows;
  els.stageForm.innerHTML = `
    <section class="table-wrap">
      <h3>Instrumentation Alignment Table</h3>
      <p class="hint">Each non-empty research question from A4 gets one instrumentation row. The question purpose from A4 is shown so the instrument plan matches what the question is trying to find out.</p>
      <div class="table-scroll">
        <div class="editable-list">
          ${rows.map((row, index) => instrumentationRow(index)).join("")}
        </div>
      </div>
      <button type="button" data-add-row="instrumentation">Add Instrument Row</button>
    </section>
  `;
}

function syncInstrumentationRows() {
  const existingRows = state.instrumentation.rows.map(normalizeInstrumentRow);
  const questions = state.a4.questions.filter((question) => question.trim());
  const nextRows = questions.map((question, index) => {
    const existing = existingRows[index] || emptyRowFor("instrumentation");
    return { ...existing, rq: question };
  });
  const extraRows = existingRows.slice(questions.length).filter((row) =>
    row.instrument || row.description || row.purpose || row.validation || row.implementation
  );
  state.instrumentation.rows = nextRows.concat(extraRows);
}

function instrumentationRow(index) {
  const row = state.instrumentation.rows[index];
  const purposeKey = state.a4.questionPurposes[index] || "";
  const purpose = rqPurposeOptions[purposeKey];
  const purposeHint = purpose
    ? `Question purpose from A4: ${purpose.label}. Suggested question starters: ${purpose.starters}`
    : "No A4 question purpose selected yet. Return to A4 and choose the purpose of this question.";
  return `
    <div class="table-row instrumentation-row" style="--cols:6">
      <section class="output-box">
        <h3>Research Question ${index + 1}</h3>
        <div class="generated-text">${escapeHtml(row.rq || "No research question has been entered yet.")}</div>
        <p class="hint">${escapeHtml(purposeHint)}</p>
      </section>
      ${["instrument", "description", "purpose", "validation", "implementation"].map((key) => `
        <label>
          <span class="field-label">
            <span>${escapeHtml(key[0].toUpperCase() + key.slice(1))}</span>
            ${helpControl(`instrumentation-${index}-${key}-help`, key, instrumentationScaffold(key, purposeKey))}
          </span>
          <textarea data-table="instrumentation" data-index="${index}" data-key="${key}" aria-describedby="instrumentation-${index}-${key}-help">${escapeHtml(row[key] || "")}</textarea>
        </label>
      `).join("")}
      <button class="row-remove" type="button" data-remove-row="instrumentation:${index}">X</button>
    </div>
  `;
}

function instrumentationScaffold(key, purposeKey) {
  const purposeSpecific = {
    describe: "Name the level, condition, perception, practice, or experience this instrument will describe.",
    compare: "Name the comparable data the instrument will gather from each group, condition, or situation.",
    relationship: "Name the variables or constructs the instrument will measure so their relationship can be examined.",
    predict: "Name the predictor and outcome data the instrument will gather.",
    exploreExperience: "Name the experiences, meanings, perceptions, or processes the instrument will explore.",
    explain: "Name the evidence the instrument will gather to explain how or why the phenomenon occurs.",
    evaluate: "Name the evidence the instrument will gather about effectiveness, implementation, or impact.",
    develop: "Name the evidence the instrument will gather to support model, framework, or theory development."
  };
  const base = {
    instrument: "Choose a tool: survey, test, interview guide, focus group guide, observation checklist, rubric, journal, or document guide.",
    description: "Describe the instrument parts, scales, prompts, indicators, sections, and sample item or example indicator.",
    purpose: purposeSpecific[purposeKey] || "Explain what data this instrument needs to collect for the research question.",
    validation: "Explain expert validation, pilot testing, reliability, inter-rater checking, or trustworthiness strategy.",
    implementation: "Explain the source of data and how, when, where, and by whom the instrument will be administered or used."
  };
  return base[key] || "Add a clear, study-specific detail.";
}

function renderOutline() {
  els.stageForm.innerHTML = `
    <section class="output-box">
      <h3>Proposal Outline</h3>
      <div class="generated-text">${escapeHtml(buildOutline())}</div>
    </section>
    <section class="field">
      <div class="field-label">
        <label for="outline-notes">Instructor notes or local format reminders</label>
        ${helpControl("outline-notes-help", "Instructor notes or local format reminders", "Add school-specific headings, adviser instructions, citation style, or chapter labels here. This helps you adapt the outline without asking the app to write the manuscript.")}
      </div>
      <textarea id="outline-notes" data-section="outline" data-key="notes" aria-describedby="outline-notes-help">${escapeHtml(value("outline.notes"))}</textarea>
    </section>
  `;
}

function renderReadiness() {
  const report = readinessReport();
  els.stageForm.innerHTML = `
    <section class="output-box">
      <h3>Proposal Readiness Score</h3>
      <div class="generated-text">${report.score}/100 - ${report.label}</div>
    </section>
    <section class="checker-panel">
      <h3>Alignment Report</h3>
      <div class="feedback">${report.items.map(feedbackHtml).join("")}</div>
    </section>
  `;
}

function renderSubmission() {
  const missing = finalSubmissionMissingItems();
  const progressStages = stages.filter((stage) => !["submission"].includes(stage.id));
  els.stageForm.innerHTML = `
    <section class="output-box">
      <h3>Submission Tools</h3>
      <div class="generated-text">Complete the readiness reflection after reviewing the proposal readiness report. Preview is available anytime. Generate PDF or Print will unlock after the required parts are complete. Instructor notes/local format reminders are optional.</div>
    </section>
    <section class="output-box">
      <h3>Progress PDF</h3>
      <div class="generated-text">Use this for partial submissions. You may print one completed part only, or print a cumulative progress copy up to a selected part.</div>
      <div class="inline-actions">
        <label>
          <span class="field-label"><span>Part to print</span></span>
          <select id="progressPdfStage">
            ${progressStages.map((stage) => `<option value="${stage.id}">${escapeHtml(stage.code)} - ${escapeHtml(stage.title)}</option>`).join("")}
          </select>
        </label>
        <label>
          <span class="field-label"><span>Print scope</span></span>
          <select id="progressPdfScope">
            <option value="cumulative">Cumulative up to this part</option>
            <option value="single">This part only</option>
          </select>
        </label>
      </div>
      <div class="dialog-actions inline-actions">
        <button class="ghost" type="button" data-progress-preview>Preview Progress PDF</button>
        <button class="primary" type="button" data-progress-print>Print Progress PDF</button>
      </div>
    </section>
    <section class="output-box">
      <h3>PDF Readiness</h3>
      <div class="generated-text">${missing.length ? `Locked. Missing required items:\n${missing.slice(0, 10).map((item) => `- ${item}`).join("\n")}${missing.length > 10 ? `\n...and ${missing.length - 10} more.` : ""}` : "Ready. Required parts are complete, and PDF/Print can be generated."}</div>
    </section>
    <section class="output-box">
      <h3>Initial Readiness Reflection</h3>
      <div class="generated-text">${escapeHtml(value("submission.initialReadiness") || "No initial readiness reflection has been entered yet. Return to Info - Student Details to add it.")}</div>
      <p class="hint">This is read-only here. Edit it in Info - Student Details if correction is needed.</p>
    </section>
    ${renderFields("submission", fieldSets.finalSubmission)}
  `;
}

function tableRow(section, index, keys, labels) {
  const row = getTableRows(section)[index];
  return `
    <div class="table-row ${section}-row" style="--cols:${keys.length}">
      ${keys.map((key, keyIndex) => `
        <label>
          <span class="field-label">
            <span>${labels[keyIndex]}</span>
            ${helpControl(`${section}-${index}-${key}-help`, labels[keyIndex], tableScaffolds[section]?.[key] || "Add a clear, study-specific detail.")}
          </span>
          <textarea data-table="${section}" data-index="${index}" data-key="${key}" aria-describedby="${section}-${index}-${key}-help">${escapeHtml(row[key] || "")}</textarea>
        </label>
      `).join("")}
      <button class="row-remove" type="button" data-remove-row="${section}:${index}">X</button>
    </div>
  `;
}

function getTableRows(section) {
  if (section === "a2Patterns") return state.a2.patterns;
  if (section === "a3Gaps") return state.a3.gaps;
  if (section === "terms") return state.terms.rows;
  return state.instrumentation.rows;
}

function emptyRowFor(section) {
  if (section === "a2Patterns") return { type: "", notice: "", authors: "", years: "" };
  if (section === "a3Gaps") return { type: "", show: "", emphasized: "", lessVisible: "", limits: "", gap: "" };
  if (section === "terms") return { term: "", conceptual: "", operational: "", measured: "" };
  return { rq: "", instrument: "", description: "", purpose: "", validation: "", implementation: "" };
}

function buildTopic() {
  const a1 = state.a1;
  if (a1.coreConstruct) return `This study is about ${a1.coreConstruct}.`;
  if (a1.rrlMajorityTest) return `This study is about ${a1.rrlMajorityTest}.`;
  if (a1.initialTopic) return `Initial topic: ${a1.initialTopic}`;
  return "";
}

function buildProblem() {
  if (state.a4.literatureProblem) return state.a4.literatureProblem;
  if (state.a3.finalGap) return `Based on the reviewed literature, ${state.a3.finalGap}`;
  return "Use A3 to identify what studies show, what becomes less visible, and what this prevents us from understanding. Then state the literature-based problem here.";
}

function isMixedMethodsLikely() {
  const text = `${state.a4.questionType || ""} ${state.methodology.selectedDesign || ""} ${state.methodology.rqTypes || ""} ${state.methodology.dataNeeded || ""} ${state.methodology.purpose || ""} ${state.a4.questions.join(" ")}`.toLowerCase();
  return /mixed|both|quantitative and qualitative|qualitative and quantitative|survey.*interview|interview.*survey|numeric.*experience|level.*experience/.test(text);
}

function scopeControlItems() {
  const rows = questionPurposeRows();
  const purposeCount = new Set(rows.map((row) => row.purposeKey).filter(Boolean)).size;
  const text = `${state.a4.rqConstructs || ""} ${state.framework.scopeBoundaries || ""} ${state.methodology.dataNeeded || ""}`.toLowerCase();
  const variableMarkers = (text.match(/,| and |;|\bvariable\b|\bconstruct\b/g) || []).length;
  const instrumentCount = state.instrumentation.rows.filter((row) => row.instrument).length;
  const items = [];
  items.push(flag(rows.length <= SRQ_LIMITS.preferredMaximum, "SRQ count is within the preferred scope.", `There are ${rows.length} SRQs. Check whether some can be combined or moved to sub-questions.`));
  items.push(flag(purposeCount <= 3, "Question purposes are focused.", "The study uses many question purposes. Check whether it is trying to describe, compare, relate, predict, evaluate, explore, and develop too much at once."));
  items.push(flag(variableMarkers <= 8, "Construct/variable load appears manageable.", "The construct or variable load may be heavy. Narrow the study before adding instruments."));
  items.push(flag(instrumentCount <= Math.max(rows.length, 1), "Instrument count appears tied to the research questions.", "There may be more instruments than research questions. Check feasibility and respondent burden."));
  items.push(flag(Boolean(state.framework.scopeBoundaries), "Scope boundaries are stated.", "State what is included and excluded so the study remains feasible."));
  return items;
}

function recommendMethodology() {
  const purposes = state.a4.questionPurposes
    .filter((purpose) => purpose && rqPurposeOptions[purpose])
    .map((purpose) => rqPurposeOptions[purpose].label)
    .join(" ");
  const text = `${state.a4.questionType || ""} ${state.methodology.rqTypes || ""} ${state.methodology.purpose || ""} ${purposes}`.toLowerCase();
  if (text.includes("develop") || text.includes("model") || text.includes("framework") || text.includes("theory")) return "Recommendation: Model/framework development may fit if the design includes qualitative analysis, mixed methods integration, expert validation, Delphi review, grounded theory, or design/development research.";
  if (text.includes("relat") || text.includes("correl")) return "Recommendation: Correlational quantitative design, because the questions examine relationships between constructs.";
  if (text.includes("compar") || text.includes("difference")) return "Recommendation: Comparative quantitative design, because the questions compare groups or categories.";
  if (text.includes("predict")) return "Recommendation: Predictive quantitative design or regression-based analysis may fit because the questions examine predictors and outcomes.";
  if (text.includes("evaluat")) return "Recommendation: Evaluation research, action research, quasi-experimental design, or mixed methods may fit because the questions examine effectiveness, implementation, or impact.";
  if (text.includes("explain")) return "Recommendation: Explanatory qualitative, explanatory sequential mixed methods, or causal/comparative design may fit depending on the evidence needed.";
  if (text.includes("effect") || text.includes("improv") || text.includes("experiment")) return "Recommendation: Quasi-experimental design may fit if an intervention is tested with measurable outcomes.";
  if (text.includes("experience") || text.includes("explor") || text.includes("describe their")) return "Recommendation: Qualitative design such as phenomenology, case study, or basic qualitative study may fit.";
  if (text.includes("describe") || text.includes("level") || text.includes("extent")) return "Recommendation: Descriptive quantitative or qualitative descriptive design may fit, depending on whether the question needs numeric levels or descriptive meanings.";
  if (text.includes("action") || text.includes("classroom intervention")) return "Recommendation: Action research may fit if the goal is to improve practice in a specific classroom.";
  if (text.includes("mixed")) return "Recommendation: Mixed methods may fit if both numeric trends and participant explanations are needed.";
  return "Recommendation: Add question type and data needs to receive a methodology suggestion. Do not force the method; let the research questions guide it.";
}

function buildEthicsDraft() {
  const selected = ethicsChecks.filter((item) => state.ethics.checks[item]);
  return `The study will observe ethical standards including ${selected.length ? selected.join(", ") : "voluntary participation, informed consent, confidentiality, data privacy, and institutional permission"}. Participants will be informed about the purpose of the study, their right to withdraw, and how their data will be protected. This section can be refined based on school ethics review requirements.`;
}

function ethicsRisk() {
  const text = `${state.ethics.participantAge || ""} ${state.ethics.powerIssue || ""} ${state.ethics.dataPrivacy || ""}`.toLowerCase();
  if (text.includes("minor") || text.includes("child") || text.includes("sensitive") || text.includes("trauma")) {
    return { label: "Higher Risk", reason: "Minors, vulnerable groups, or sensitive data require stronger safeguards and review." };
  }
  if (text.includes("student") || text.includes("teacher") || text.includes("grade") || text.includes("private")) {
    return { label: "Moderate Risk", reason: "School-based data and power relationships need careful consent and confidentiality planning." };
  }
  return { label: "Minimal Risk", reason: "No major risk markers are currently described, but ethics review may still be required." };
}

function buildOutline() {
  const core = state.a1.coreConstruct || state.a1.rrlMajorityTest || "[A1 core construct]";
  const gap = state.a3.finalGap || "[A3 final gap]";
  const problem = state.a4.literatureProblem || "[A4 literature-based problem]";
  const crq = state.a4.centralQuestion || "[A4 central research question]";
  const srqs = state.a4.questions.filter(Boolean).map((question, index) => `  ${index + 1}. ${question}`).join("\n") || "  [Add specific research questions from A4]";
  const patterns = state.a2.patterns.filter((row) => row.notice).map((row) => `  - ${row.type}: ${row.notice}`).join("\n") || "  [Add A2 literature patterns]";
  const termsOutline = state.terms.rows.map(normalizeTermRow).filter((row) => row.term).map((row) => `  - ${row.term}
    Conceptual definition: ${row.conceptual || "[Add conceptual definition]"}
    Operational definition: ${row.operational || "[Add operational definition]"}
    Measured/observed/identified through: ${row.measured || "[Connect to instrument, indicator, observation, document, or analysis]"}`).join("\n") || `  - ${core}
    Conceptual definition: [Define term based on literature]
    Operational definition: [Define term as used in this study]
    Measured/observed/identified through: [Connect to instrument, indicator, observation, document, or analysis]`;
  const mixedIntegration = isMixedMethodsLikely()
    ? `
- Mixed Methods Integration
  Quantitative strand: ${state.mixedMethods.quantStrand || "[Describe quantitative data]"}
  Qualitative strand: ${state.mixedMethods.qualStrand || "[Describe qualitative data]"}
  Integration point: ${state.mixedMethods.integrationPoint || "[Describe integration point]"}
  Integration purpose: ${state.mixedMethods.integrationPurpose || "[Explain why integration is needed]"}`
    : "";

  return `Chapter 1: The Problem and Its Scope
Introduction
- Rationale
  Explain why the study is worth doing by connecting the concern to the literature gap: ${gap}
- Background of the Study
  Anchor this section on the core construct: ${core}
  Use these literature patterns as the basis:
${patterns}
- Theoretical/Conceptual Framework
  Framework or explanatory concept: ${state.framework.theoryModel || "[Name framework, theory, model, or concept]"}
  Connection to the problem: ${state.framework.problemConnection || "[Explain how the framework explains the problem]"}
  Connection to the questions: ${state.framework.questionConnection || "[Explain how the framework guides the questions]"}
  Connection to instruments or analysis: ${state.framework.instrumentConnection || "[Explain how the framework guides indicators, instruments, or analysis]"}

Statement of the Problem
- General Statement
  Carry forward this literature-based problem: ${problem}
- Specific Statements in Question Form
  Central research question: ${crq}
${srqs}
- Hypothesis/Assumptions
  Add hypotheses for quantitative testing or assumptions for qualitative/descriptive work when required.
- Significance
  Explain who benefits from understanding the gap: ${gap}

Methodology
- Design
  Current selected design: ${state.methodology.selectedDesign || "[Select methodology]"}
- Scope and Limitations/Delimitations
  ${state.framework.scopeBoundaries || "Identify participant boundaries, locale boundaries, construct boundaries, and what the study will not cover."}
- Participants
  ${state.methodology.participants || "[Describe participants]"}
  Sampling: ${state.methodology.sampling || "[Describe sampling]"}
- Locale
  ${state.methodology.locale || "[Describe locale]"}
- Instrumentation
  Describe each instrument, its purpose, validation, and how it will be implemented.
- Data Procedure
  Data gathering: ${state.methodology.collection || "[Describe data gathering procedure]"}
  Data analysis: ${state.methodology.analysis || "[Describe data analysis]"}
${mixedIntegration}
  Ethical considerations: Carry forward the ethics safeguards selected in the app.

Definition of Terms
- Operational Definition of Key Terms
${termsOutline}

Appendices
- Permission Letter
- Consent Forms
- Instruments
- Validation Forms`;
}

function runChecks(stageId = state.currentStage) {
  const checks = {
    a1: checkA1,
    details: checkStudentDetails,
    a2: checkA2,
    a3: checkA3,
    a4: checkA4,
    framework: checkFramework,
    researchLevel: checkResearchLevel,
    methodology: checkMethodology,
    ethics: checkEthics,
    instrumentation: checkInstrumentation,
    terms: checkTerms,
    outline: () => [{ level: "green", text: "The outline is ready to guide drafting. Add institution-specific notes if your instructor requires a format." }],
    readiness: () => readinessReport().items,
    submission: checkFinalSubmission
  };
  return checks[stageId]();
}

function checkA1() {
  const results = [];
  results.push(flag(Boolean(state.a1.initialTopic), "Initial topic is stated.", "Write the initial topic or area of interest."));
  results.push(flag(Boolean(state.a1.majorNouns), "Major nouns have been extracted.", "List the major nouns from the topic."));
  results.push(flag(Boolean(state.a1.fifteenPageTest), "Possible core constructs passed the 15-page test.", "Identify which nouns are rich enough to define deeply."));
  results.push(flag(Boolean(state.a1.rrlMajorityTest), "RRL majority test is answered.", "Choose the one noun most of your 10-15 articles would primarily define."));
  results.push(flag(Boolean(state.a1.coreConstruct), "Core construct declaration is clear.", "Complete the declaration: This study is about _____."));
  return results;
}

function checkA2() {
  const rows = state.a2.patterns.filter((row) => row.notice || row.authors || row.years);
  const results = [
    flag(Boolean(state.a1.coreConstruct || state.a1.rrlMajorityTest), "A1 core construct is available to guide the review.", "Complete A1 before mapping literature patterns."),
    flag(rows.length >= 3, "Several literature patterns are identified.", "Add patterns across at least three categories such as context, method, theory, evidence, practice, population, or definition."),
    flag(Boolean(state.a2.synthesis), "Short synthesis is written.", "Write a 5-7 sentence synthesis of what is heavily studied, dominant, recurring, and less developed.")
  ];
  rows.forEach((row) => {
    if (!row.authors) results.push({ level: "yellow", text: `${row.type || "A pattern"} needs supporting authors.` });
    if (!row.years) results.push({ level: "yellow", text: `${row.type || "A pattern"} needs publication years.` });
  });
  return results;
}

function checkA3() {
  const rows = state.a3.gaps.filter((row) => row.show || row.lessVisible || row.limits || row.gap);
  const results = [
    flag(rows.length >= 1, "At least one gap row is developed.", "Use A2 patterns to identify what becomes less visible and what this limits us from understanding."),
    flag(Boolean(state.a3.strongestGap), "Strongest gap is selected.", "Select the strongest gap."),
    flag(Boolean(state.a3.weakestGap), "Weakest gap is identified.", "Identify a weaker gap so the selection is deliberate."),
    flag(Boolean(state.a3.selectionReason), "Selection reason is explained.", "Explain why the strongest gap is stronger."),
    flag(Boolean(state.a3.finalGap), "Final gap is ready to carry forward.", "Write the final gap clearly.")
  ];
  rows.forEach((row) => {
    if (row.gap && /lack|lacks|few studies|missing/i.test(row.gap) && !row.limits) {
      results.push({ level: "yellow", text: `${row.type || "A gap"} may only state absence. Explain what this limits us from understanding.` });
    }
    if (row.lessVisible && !row.limits) results.push({ level: "yellow", text: `${row.type || "A gap"} needs the limitation in understanding.` });
  });
  return results;
}

function checkA4() {
  const questions = state.a4.questions.filter((q) => q.trim());
  const text = questions.join(" ").toLowerCase();
  const core = (state.a1.coreConstruct || state.a1.rrlMajorityTest || "").toLowerCase();
  const results = [
    flag(Boolean(state.a3.finalGap), "A3 final gap is available.", "Complete A3 first so the problem is traceable from literature."),
    flag(Boolean(state.a4.literatureProblem), "Literature-based problem is stated.", "Translate the final gap into a problem statement."),
    flag(Boolean(state.a4.centralQuestion), "Central research question is written.", "Write the CRQ that responds to the problem."),
    flag(questions.length >= SRQ_LIMITS.minimum && questions.length <= SRQ_LIMITS.maximum, `There are ${SRQ_LIMITS.minimum}-${SRQ_LIMITS.maximum} specific research questions.`, `Add ${SRQ_LIMITS.minimum}-${SRQ_LIMITS.maximum} SRQs that unpack the central question.`),
    flag(Boolean(state.a4.questionType), "Needed understanding is identified.", "Name whether the study needs measurement, explanation/description, or both."),
    flag(Boolean(state.a4.studiedGroup), "Study focus is visible.", "Clarify who or what will be examined.")
  ];
  if (core && !`${state.a4.centralQuestion || ""} ${text} ${state.a4.literatureProblem || ""}`.toLowerCase().includes(core.split(" ")[0])) {
    results.push({ level: "yellow", text: `The core construct "${state.a1.coreConstruct || state.a1.rrlMajorityTest}" may be missing from the problem or questions.` });
  }
  questions.forEach((q, index) => {
    if (/^(do|does|is|are|will)\b/i.test(q) && !/significant|level|relationship|difference|experience|extent/i.test(q)) {
      results.push({ level: "yellow", text: `Question ${index + 1} may read like a yes/no opinion question.` });
    }
  });
  results.push(...centralQuestionAlignmentItems());
  results.push(...questionStructureWarnings(questions));
  return results;
}

function questionStructureWarnings(questions) {
  const warnings = [];
  if (questions.length > SRQ_LIMITS.preferredMaximum) {
    warnings.push({
      level: "yellow",
      text: `There are ${questions.length} specific research questions. This can be acceptable, but check whether some are only sub-parts of another question or can be combined.`
    });
  }
  const starts = new Map();
  questions.forEach((question, index) => {
    const start = normalizeQuestion(question).split(" ").slice(0, 5).join(" ");
    if (!start) return;
    if (starts.has(start)) {
      warnings.push({
        level: "yellow",
        text: `Questions ${starts.get(start) + 1} and ${index + 1} begin very similarly. Check whether they are separate questions or repeated parts of the same inquiry.`
      });
    } else {
      starts.set(start, index);
    }
    if ((question.match(/\band\b/gi) || []).length >= 2) {
      warnings.push({
        level: "yellow",
        text: `Question ${index + 1} may be double-barreled. Check whether it asks more than one question at once.`
      });
    }
  });
  for (let i = 0; i < questions.length; i += 1) {
    for (let j = i + 1; j < questions.length; j += 1) {
      if (questionOverlap(questions[i], questions[j]) >= 0.72) {
        warnings.push({
          level: "yellow",
          text: `Questions ${i + 1} and ${j + 1} have substantial overlap. Check whether one is a sub-question or duplicate of the other.`
        });
      }
    }
  }
  return warnings;
}

function normalizeQuestion(question) {
  return String(question || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\b(what|how|is|there|the|a|an|of|in|to|for|among|with|and|or|does|do)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function questionOverlap(first, second) {
  const firstTokens = new Set(normalizeQuestion(first).split(" ").filter((token) => token.length > 3));
  const secondTokens = new Set(normalizeQuestion(second).split(" ").filter((token) => token.length > 3));
  if (!firstTokens.size || !secondTokens.size) return 0;
  const shared = [...firstTokens].filter((token) => secondTokens.has(token)).length;
  return shared / Math.min(firstTokens.size, secondTokens.size);
}

function questionPurposeRows() {
  return state.a4.questions.map((question, index) => ({
    index,
    number: index + 1,
    question: String(question || "").trim(),
    purposeKey: state.a4.questionPurposes[index] || "",
    purposeLabel: rqPurposeOptions[state.a4.questionPurposes[index]]?.label || ""
  })).filter((row) => row.question);
}

function stemTokens(text) {
  return normalizeQuestion(text)
    .split(" ")
    .filter((token) => token.length > 3 && !["question", "research", "study", "junior", "senior", "school", "teacher", "student", "participants", "respondents"].includes(token));
}

function centralQuestionAlignmentItems() {
  const rows = questionPurposeRows();
  const central = state.a4.centralQuestion || "";
  const centralTokens = new Set(stemTokens(central));
  const problemTokens = new Set(stemTokens(`${state.a4.literatureProblem || ""} ${state.a3.finalGap || ""} ${state.a4.rqConstructs || ""}`));
  const allSrqTokens = new Set(stemTokens(rows.map((row) => row.question).join(" ")));
  const items = [
    flag(Boolean(central), "Central question is available for alignment checking.", "Write the central research question so the app can check whether the SRQs unpack it."),
    flag(rows.length > 0, "Specific research questions are available for alignment checking.", "Add specific research questions so the app can check alignment with the central question.")
  ];
  if (!central || !rows.length) return items;

  rows.forEach((row) => {
    const tokens = stemTokens(row.question);
    const missing = tokens.filter((token) => !centralTokens.has(token) && !problemTokens.has(token));
    if (tokens.length && missing.length / tokens.length > 0.45) {
      items.push({
        level: "yellow",
        text: `SRQ ${row.number} may introduce ideas not visible in the central question. Revise the central question to include this idea, or remove the SRQ if it is outside the study.`
      });
    } else {
      items.push({ level: "green", text: `SRQ ${row.number} appears traceable to the central question or literature-based problem.` });
    }
  });

  const uncoveredCentral = [...centralTokens].filter((token) => !allSrqTokens.has(token) && !problemTokens.has(token));
  if (uncoveredCentral.length >= 2) {
    items.push({
      level: "yellow",
      text: "Some central-question ideas may not be unpacked by the SRQs. Check whether each major idea in the central question has a matching specific question."
    });
  }
  return items;
}

function designFamily(text) {
  const valueText = String(text || "").toLowerCase();
  const families = new Set();
  if (/mixed/.test(valueText)) families.add("mixed");
  if (/correl|relation|association/.test(valueText)) families.add("relationship");
  if (/compar|difference|t-test|anova|mann|kruskal/.test(valueText)) families.add("compare");
  if (/predict|regression/.test(valueText)) families.add("predict");
  if (/phenomen|case study|narrative|qualitative|interview|thematic|content analysis|grounded/.test(valueText)) families.add("qualitative");
  if (/descriptive|survey|frequency|percentage|mean|standard deviation|level|extent/.test(valueText)) families.add("describe");
  if (/quasi|experiment|intervention|effect/.test(valueText)) families.add("evaluate");
  if (/action research|evaluation|impact|implementation/.test(valueText)) families.add("evaluate");
  if (/develop|development|model|framework|theory|delphi|validation/.test(valueText)) families.add("develop");
  return families;
}

function designFitsPurpose(purposeKey, designText) {
  const family = designFamily(designText);
  if (!purposeKey) return false;
  if (family.has("mixed")) return true;
  const allowed = {
    describe: ["describe", "qualitative"],
    compare: ["compare"],
    relationship: ["relationship"],
    predict: ["predict", "relationship"],
    exploreExperience: ["qualitative"],
    explain: ["qualitative", "compare", "relationship", "evaluate"],
    evaluate: ["evaluate", "compare"],
    develop: ["develop", "qualitative"]
  };
  return (allowed[purposeKey] || []).some((item) => family.has(item));
}

function purposeDesignAlignmentItems() {
  const rows = questionPurposeRows();
  const design = state.methodology.selectedDesign || "";
  const items = [
    flag(Boolean(design), "A selected research design is available for question-design checking.", "Select a research design so the app can check whether it fits the SRQ purposes.")
  ];
  rows.forEach((row) => {
    if (!row.purposeKey) {
      items.push({ level: "yellow", text: `SRQ ${row.number} has no selected purpose. Choose the purpose so the design check can work.` });
      return;
    }
    if (!design) return;
    if (designFitsPurpose(row.purposeKey, design)) {
      items.push({ level: "green", text: `SRQ ${row.number} purpose fits the selected design.` });
    } else {
      items.push({
        level: "yellow",
        text: `SRQ ${row.number} is marked "${row.purposeLabel}", but the selected design is "${design}". Check whether the design should change, or revise the question purpose.`
      });
    }
  });
  return items;
}

function analysisFitsPurpose(purposeKey, analysisText) {
  const family = designFamily(analysisText);
  const text = String(analysisText || "").toLowerCase();
  if (!purposeKey || !text) return false;
  if (/mixed|integration|triangulat/.test(text)) return true;
  const allowed = {
    describe: ["describe", "qualitative"],
    compare: ["compare"],
    relationship: ["relationship"],
    predict: ["predict"],
    exploreExperience: ["qualitative"],
    explain: ["qualitative", "relationship", "compare"],
    evaluate: ["evaluate", "compare", "describe"],
    develop: ["develop", "qualitative"]
  };
  return (allowed[purposeKey] || []).some((item) => family.has(item));
}

function purposeAnalysisAlignmentItems() {
  const rows = questionPurposeRows();
  const analysis = state.methodology.analysis || "";
  const items = [
    flag(Boolean(analysis), "Data analysis plan is available for question-analysis checking.", "Write the data analysis plan so the app can check whether it fits the SRQ purposes.")
  ];
  if (!analysis) return items;
  rows.forEach((row) => {
    if (!row.purposeKey) return;
    if (analysisFitsPurpose(row.purposeKey, analysis)) {
      items.push({ level: "green", text: `SRQ ${row.number} purpose appears supported by the data analysis plan.` });
    } else {
      items.push({
        level: "yellow",
        text: `SRQ ${row.number} is marked "${row.purposeLabel}", but the data analysis plan may not show the needed analysis. Add the matching analysis or revise the SRQ purpose.`
      });
    }
  });
  return items;
}

function instrumentFitsPurpose(row, purposeKey) {
  const text = `${row.instrument || ""} ${row.description || ""} ${row.purpose || ""} ${row.implementation || ""}`.toLowerCase();
  if (!purposeKey || !text.trim()) return false;
  if (purposeKey === "describe") return /survey|questionnaire|test|scale|checklist|rubric|interview|observation|document/.test(text);
  if (purposeKey === "compare" || purposeKey === "relationship" || purposeKey === "predict") return /survey|questionnaire|test|scale|score|variable|measure|rubric|checklist/.test(text);
  if (purposeKey === "exploreExperience" || purposeKey === "explain") return /interview|focus group|observation|journal|open-ended|document|case/.test(text);
  if (purposeKey === "evaluate") return /survey|interview|observation|rubric|checklist|test|pre|post|implementation|outcome/.test(text);
  if (purposeKey === "develop") return /interview|focus group|expert|delphi|validation|document|model|framework|thematic|rubric/.test(text);
  return true;
}

function purposeInstrumentationAlignmentItems() {
  syncInstrumentationRows();
  const rows = questionPurposeRows();
  const items = [];
  rows.forEach((questionRow, index) => {
    const instrumentRow = normalizeInstrumentRow(state.instrumentation.rows[index] || emptyRowFor("instrumentation"));
    if (!instrumentRow.instrument) {
      items.push({ level: "yellow", text: `SRQ ${questionRow.number} needs an instrument or data source.` });
      return;
    }
    if (!questionRow.purposeKey) {
      items.push({ level: "yellow", text: `SRQ ${questionRow.number} has no selected purpose, so the app cannot check its instrument fit.` });
      return;
    }
    if (instrumentFitsPurpose(instrumentRow, questionRow.purposeKey)) {
      items.push({ level: "green", text: `SRQ ${questionRow.number} instrument appears suitable for its purpose.` });
    } else {
      items.push({
        level: "yellow",
        text: `SRQ ${questionRow.number} is marked "${questionRow.purposeLabel}", but the instrument plan may not fit that purpose. Revise the instrument, data source, or SRQ purpose.`
      });
    }
  });
  return items;
}

function checkMethodology() {
  const rec = recommendMethodology().toLowerCase();
  const design = (state.methodology.selectedDesign || "").toLowerCase();
  return [
    flag(Boolean(state.methodology.selectedDesign), "A research design is selected.", "Select or enter a research design after reviewing the recommendation."),
    flag(!design || rec.includes(design.split(" ")[0]) || rec.includes("add question"), "Methodology appears aligned with the question type.", "Review whether the method matches the research questions."),
    flag(Boolean(state.methodology.participants), "Participants are described.", "Describe who will participate."),
    flag(Boolean(state.methodology.collection), "Data collection is planned.", "Add how data will be collected."),
    flag(Boolean(state.methodology.analysis), "Data analysis is planned.", "Add how the data will be analyzed."),
    ...purposeDesignAlignmentItems(),
    ...purposeAnalysisAlignmentItems(),
    ...checkMixedMethods()
  ];
}

function checkFramework() {
  const hasSource = Boolean(state.frameworkFinder.frameworkSource);
  const hasFitEvidence = Boolean(state.framework.problemConnection && state.framework.questionConnection);
  const doesAnalyticalWork = Boolean(state.frameworkFinder.withoutFramework && state.framework.instrumentConnection);
  return [
    flag(Boolean(state.frameworkFinder.pathway), "Research pathway is identified.", "Choose whether the study is problem-led or explicitly theory-led."),
    flag(Boolean(state.frameworkFinder.literatureSignals), "Possible explanations were traced to A2 literature.", "Look back at A2 and record theories, models, concepts, or explanations found in the literature."),
    flag(Boolean(state.frameworkFinder.candidateFrameworks), "Candidate frameworks are considered.", "List one to three literature-supported candidates and what each may explain."),
    flag(hasSource, "A scholarly source for the framework is provided.", "Add the author, year, and publication or complete reference for a source you consulted."),
    flag(Boolean(state.framework.theoryModel), "Framework or explanatory concept is named.", "Name the theory, model, concept, or framework that helps explain the problem."),
    flag(hasFitEvidence, "Framework explains the problem and connects to the questions.", "Explain how the framework makes sense of the gap or problem and guides the central and specific questions."),
    flag(Boolean(state.frameworkFinder.selectionReason), "Selection is justified against alternatives.", "Explain why this candidate fits better than the alternatives considered."),
    flag(doesAnalyticalWork, "Framework performs a clear role in evidence or interpretation.", "Explain what would be harder to explain without the framework and how it guides constructs, evidence, instrument dimensions, analysis, or interpretation."),
    flag(Boolean(state.frameworkFinder.methodFit), "Framework-method fit is explained.", "Explain why the framework and planned research design work coherently; a mismatch is not automatically wrong, but it requires justification."),
    ...scopeControlItems()
  ];
}

function checkMixedMethods() {
  if (!isMixedMethodsLikely()) return [{ level: "green", text: "Mixed methods integration check is not required unless the study uses both quantitative and qualitative data." }];
  return [
    flag(Boolean(state.mixedMethods.quantStrand), "Quantitative strand is described.", "For mixed methods, name the quantitative data strand."),
    flag(Boolean(state.mixedMethods.qualStrand), "Qualitative strand is described.", "For mixed methods, name the qualitative data strand."),
    flag(Boolean(state.mixedMethods.integrationPoint), "Integration point is identified.", "State where the quantitative and qualitative findings will be integrated."),
    flag(Boolean(state.mixedMethods.integrationPurpose), "Integration purpose is explained.", "Explain why the study needs integration instead of separate findings.")
  ];
}

function checkEthics() {
  const checked = Object.values(state.ethics.checks).filter(Boolean).length;
  return [
    flag(checked >= 6, "Core ethics safeguards are selected.", "Select the ethics safeguards that apply to the study."),
    flag(Boolean(state.ethics.permissions), "Institutional permission is considered.", "Name the permission needed from the school or office."),
    flag(Boolean(state.ethics.consentPlan), "Consent and right-to-withdraw plan is described.", "Explain informed consent, voluntary participation, and right to withdraw."),
    flag(Boolean(state.ethics.storagePlan), "Data storage, access, retention, and disposal are described.", "Describe how data will be protected, retained, and disposed of."),
    flag(Boolean(state.ethics.recordingAiUse), "Recording or AI tool use is addressed.", "State whether recordings or AI tools will be used and how privacy will be protected."),
    flag(Boolean(state.ethics.cultureLanguage), "Language and cultural context are considered.", "Address translation, pilot testing, cultural appropriateness, and participant dignity where relevant."),
    flag(Boolean(value("ethics.draft") || buildEthicsDraft()), "A draft ethics section is available.", "Generate or write a draft ethics section.")
  ];
}

function checkInstrumentation() {
  const rows = state.instrumentation.rows.map(normalizeInstrumentRow).filter((row) => row.rq || row.instrument || row.description);
  const results = [flag(rows.length > 0, "At least one instrument row is listed.", "Add instruments for each research question.")];
  rows.forEach((row, index) => {
    if (!row.rq) results.push({ level: "red", text: `Row ${index + 1}: research question is missing.` });
    if (!row.instrument) results.push({ level: "red", text: `Row ${index + 1}: instrument is missing.` });
    if (!row.description) results.push({ level: "yellow", text: `Row ${index + 1}: instrument description is missing.` });
    if (!row.purpose) results.push({ level: "yellow", text: `Row ${index + 1}: instrument purpose is missing.` });
    if (!row.validation) results.push({ level: "yellow", text: `Row ${index + 1}: validation or reliability/trustworthiness is missing.` });
    if (!row.implementation) results.push({ level: "yellow", text: `Row ${index + 1}: instrument implementation is missing.` });
  });
  results.push(...purposeInstrumentationAlignmentItems());
  return results;
}

function checkTerms() {
  const rows = state.terms.rows.map(normalizeTermRow).filter((row) => row.term || row.conceptual || row.operational || row.measured);
  const results = [flag(rows.length > 0, "At least one key term is listed.", "Add one term at a time, starting with the core construct.")];
  rows.forEach((row, index) => {
    if (!row.term) results.push({ level: "red", text: `Term ${index + 1}: term name is missing.` });
    if (!row.conceptual) results.push({ level: "yellow", text: `Term ${index + 1}: conceptual definition is missing.` });
    if (!row.operational) results.push({ level: "yellow", text: `Term ${index + 1}: operational definition is missing.` });
    if (!row.measured) results.push({ level: "yellow", text: `Term ${index + 1}: measurement, observation, or identification detail is missing.` });
  });
  return results;
}

function textIncludesAny(text, terms) {
  const normalized = String(text || "").toLowerCase();
  return terms.some((term) => normalized.includes(term));
}

function hasResearchLevelAnswer(key, minWords = 12) {
  return wordCount(state.researchLevel[key]) >= minWords;
}

function shsAdvancedResearchSignals() {
  const questions = state.a4.questions.filter((question) => question.trim());
  const analysis = `${state.methodology.analysis || ""} ${state.methodology.selectedDesign || ""}`.toLowerCase();
  const contribution = `${state.researchLevel.scholarlyContribution || ""} ${state.a4.questionType || ""}`.toLowerCase();
  const locale = `${state.methodology.locale || ""} ${state.methodology.participants || ""}`.toLowerCase();
  const signals = [];
  if (questions.length > SRQ_LIMITS.preferredMaximum) signals.push("many specific research questions");
  if (/mixed methods|integration|quantitative.*qualitative|qualitative.*quantitative/i.test(`${state.methodology.selectedDesign || ""} ${state.methodology.analysis || ""}`)) signals.push("mixed methods design");
  if (/regression|anova|factor analysis|sem|structural equation|multivariate|path analysis|predictive/i.test(analysis)) signals.push("advanced statistical analysis");
  if (/model|framework|theory|policy|system|original|new knowledge|generate/i.test(contribution)) signals.push("model, framework, policy, or original-knowledge claim");
  if (/division|province|region|multiple schools|many schools|district/i.test(locale)) signals.push("wide sampling or multi-site scope");
  if (/minor|vulnerable|sensitive|trauma|mental health|abuse|violence|sexual/i.test(`${state.ethics.participantAge || ""} ${state.ethics.dataPrivacy || ""} ${state.a4.literatureProblem || ""}`.toLowerCase())) signals.push("higher ethics sensitivity");
  return signals;
}

function degreeLevelReadiness() {
  const degreeKey = state.submission.degreeLevel || "master";
  const degree = degreeLevelInfo();
  const research = state.researchLevel || {};
  const items = [
    flag(Boolean(state.submission.degreeLevel), `Research context is set to ${degree.label} (${degree.pqf}).`, "Choose the research level or use context.")
  ];

  const guidedPlan = hasResearchLevelAnswer("guidedApplication");
  const independentDecision = hasResearchLevelAnswer("independentDecisions");
  const designJustification = hasResearchLevelAnswer("designJustification");
  const tradeoffs = hasResearchLevelAnswer("alternativesTradeoffs");
  const contextualContribution = hasResearchLevelAnswer("contextualContribution");
  const scholarlyContribution = hasResearchLevelAnswer("scholarlyContribution");
  const independence = hasResearchLevelAnswer("levelIndependence");

  const alignedPlan = Boolean(state.a3.finalGap && state.a4.centralQuestion && state.methodology.selectedDesign && state.instrumentation.rows.some((row) => normalizeInstrumentRow(row).instrument));
  const literatureSynthesis = Boolean(state.a2.synthesis && state.a3.finalGap && state.framework.problemConnection);
  const methodsEvidence = Boolean(state.methodology.selectedDesign && state.methodology.collection && state.methodology.analysis);
  const originalLanguage = textIncludesAny(`${research.scholarlyContribution || ""} ${research.contextualContribution || ""}`, [
    "original", "new knowledge", "model", "framework", "theory", "generate", "advance", "field", "discipline", "system", "cross-level", "policy", "knowledge creation", "frontier"
  ]);
  const doctoralDesignLanguage = textIncludesAny(`${research.designJustification || ""} ${research.scholarlyContribution || ""}`, [
    "model", "framework", "theory", "original", "knowledge", "generate", "explain", "system", "integration", "field"
  ]);

  const domains = [];
  if (degreeKey === "shs") {
    const advancedSignals = shsAdvancedResearchSignals();
    const scopeManageable = Boolean(state.framework.scopeBoundaries) && advancedSignals.length <= 2;
    domains.push({
      label: "Research Ambition",
      ready: guidedPlan || literatureSynthesis,
      text: advancedSignals.length
        ? `Shows advanced research thinking through ${advancedSignals.join(", ")}. Keep the idea, then scope the study to what can be completed safely with available time, data, and guidance.`
        : "Shows school-level research thinking that can be developed through clear problem-question-method alignment."
    });
    domains.push({
      label: "Feasibility and Scope",
      ready: scopeManageable,
      text: scopeManageable
        ? "Scope appears manageable for SHS/basic education research."
        : "The idea may need scoping down: reduce questions, limit participants or locale, simplify analysis, or clarify what can realistically be completed."
    });
    domains.push({
      label: "Method and Evidence Fit",
      ready: designJustification || alignedPlan,
      text: designJustification || alignedPlan
        ? "Method, evidence, and instruments are becoming appropriate for the research questions."
        : "Needs a clearer match among the question, data source, instrument, and simple analysis plan."
    });
    if (advancedSignals.length) {
      items.push({
        level: "green",
        text: `Advanced potential detected: ${advancedSignals.join(", ")}. This is not a weakness. It means the project may need tighter boundaries and teacher/adviser guidance.`
      });
    }
  } else if (degreeKey === "bachelor") {
    domains.push({
      label: "Responsibility and Autonomy",
      ready: guidedPlan && independence,
      text: guidedPlan && independence
        ? "Shows guided independence in explaining the study plan and own research decisions."
        : "Needs clearer evidence of guided independence and personal research judgment."
    });
    domains.push({
      label: "Knowledge and Understanding",
      ready: literatureSynthesis || guidedPlan,
      text: literatureSynthesis || guidedPlan
        ? "Applies research concepts to a defined problem within clear boundaries."
        : "Needs clearer application of literature, gap, and framework to the problem."
    });
    domains.push({
      label: "Skills and Application",
      ready: alignedPlan || designJustification,
      text: alignedPlan || designJustification
        ? "Applies research planning skills to align questions, method, instruments, and analysis."
        : "Needs stronger evidence that design and instruments fit the questions."
    });
  } else if (degreeKey === "doctoral") {
    domains.push({
      label: "Responsibility and Autonomy",
      ready: independentDecision && tradeoffs && independence,
      text: independentDecision && tradeoffs && independence
        ? "Shows advanced scholarly independence and decision-making."
        : "Needs stronger evidence of intellectual leadership, independent choices, and trade-off reasoning."
    });
    domains.push({
      label: "Knowledge and Understanding",
      ready: literatureSynthesis && scholarlyContribution && originalLanguage,
      text: literatureSynthesis && scholarlyContribution && originalLanguage
        ? "Shows movement toward original knowledge, framework, model, or field contribution."
        : "Needs clearer evidence of original contribution to knowledge or framework development."
    });
    domains.push({
      label: "Skills and Application",
      ready: designJustification && methodsEvidence && doctoralDesignLanguage,
      text: designJustification && methodsEvidence && doctoralDesignLanguage
        ? "Connects design and methods to original knowledge generation."
        : "Needs stronger justification that the design can create, extend, or transform knowledge."
    });
  } else {
    domains.push({
      label: "Responsibility and Autonomy",
      ready: independentDecision && tradeoffs && independence,
      text: independentDecision && tradeoffs && independence
        ? "Shows graduate-level independent research decisions and trade-off reasoning."
        : "Needs clearer evidence of independent research decisions, alternatives considered, and scholarly judgment."
    });
    domains.push({
      label: "Knowledge and Understanding",
      ready: literatureSynthesis && contextualContribution && scholarlyContribution,
      text: literatureSynthesis && contextualContribution && scholarlyContribution
        ? "Synthesizes literature, context, and contribution beyond template completion."
        : "Needs stronger synthesis of literature, local context, and contribution."
    });
    domains.push({
      label: "Skills and Application",
      ready: designJustification && methodsEvidence && alignedPlan,
      text: designJustification && methodsEvidence && alignedPlan
        ? "Design, methods, instruments, and analysis are justified as one research plan."
        : "Needs stronger justification of how the design and methods answer the problem and questions."
    });
  }

  domains.forEach((domain) => {
    items.push({ level: domain.ready ? "green" : "red", text: `${degree.pqf} - ${domain.label}: ${domain.text}` });
  });

  const hasMajorGap = domains.some((domain) => !domain.ready);
  items.push({
    level: hasMajorGap ? "red" : "green",
    text: hasMajorGap && degreeKey === "shs"
      ? "School-level feasibility has a major gap. Keep the research idea, but narrow the scope or simplify the method before final submission."
      : hasMajorGap
        ? `Degree-level readiness has a major gap for ${degree.label}. Add stronger evidence in the Research Level Justification step.`
        : degreeKey === "shs"
          ? "School-level feasibility is acceptable for formative review."
          : `Degree-level readiness is acceptable for formative ${degree.pqf} review.`
  });

  return { degree, domains, items, hasMajorGap };
}

function checkResearchLevel() {
  const results = [];
  fieldSets.researchLevel.forEach(([key, label]) => {
    results.push(flag(hasResearchLevelAnswer(key), `${label} Evidence is provided.`, `${label} Add a short but specific answer.`));
  });
  return [...results, ...degreeLevelReadiness().items];
}

function checkStudentDetails() {
  return [
    flag(Boolean(state.submission.degreeLevel), "Research level / use context is included.", "Choose the research level or use context."),
    flag(Boolean(state.submission.studentName), "Student name is included.", "Add student name."),
    flag(Boolean(state.submission.course), "Course is included.", "Add course."),
    flag(Boolean(state.submission.submissionDate), "Date is included.", "Add the submission date."),
    flag(Boolean(state.submission.initialReadiness), "Initial readiness reflection is included.", "Add an initial readiness reflection before A1.")
  ];
}

function checkFinalSubmission() {
  return [
    flag(Boolean(state.submission.confidence), "Final readiness reflection is included.", "Add a final readiness reflection after completing the workflow."),
    flag(Boolean(state.submission.readinessChange), "Change explanation is included.", "Explain what changed from the initial reflection and why.")
  ];
}

function flag(condition, pass, fail) {
  return { level: condition ? "green" : "yellow", text: condition ? pass : fail };
}

function feedbackHtml(item) {
  return `<div class="feedback-item ${item.level}">${escapeHtml(item.text)}</div>`;
}

function readinessReport() {
  const baseItems = [
    flag(Boolean(state.a1.coreConstruct || state.a1.rrlMajorityTest) && state.a2.patterns.some((row) => row.notice && row.authors), "Core Construct to Literature Patterns: aligned.", "Core Construct to Literature Patterns: add a core construct and literature patterns with supporting authors."),
    flag(state.a2.patterns.some((row) => row.notice) && Boolean(state.a3.finalGap), "Patterns to Gap: aligned.", "Patterns to Gap: connect A2 patterns to a final A3 gap."),
    flag(Boolean(state.a3.finalGap) && Boolean(state.a4.literatureProblem), "Gap to Problem: aligned.", "Gap to Problem: translate the A3 final gap into a literature-based problem."),
    flag(Boolean(state.a4.literatureProblem) && Boolean(state.a4.centralQuestion) && state.a4.questions.some(Boolean), "Problem to Questions: aligned.", "Problem to Questions: add a literature-based problem, central question, and SRQs."),
    flag(!degreeLevelReadiness().hasMajorGap, "Research Level Readiness: acceptable for formative review.", "Research Level Readiness: add stronger evidence or narrow the scope for the selected context."),
    flag(Boolean(state.methodology.participants) && Object.values(state.ethics.checks).some(Boolean), "Ethics to Participants: aligned.", "Ethics to Participants: describe participants and select applicable ethics safeguards.")
  ];
  const items = [
    ...baseItems,
    ...centralQuestionAlignmentItems(),
    ...checkFramework(),
    ...checkResearchLevel(),
    ...purposeDesignAlignmentItems(),
    ...purposeAnalysisAlignmentItems(),
    ...checkMixedMethods(),
    ...purposeInstrumentationAlignmentItems(),
    ...checkTerms()
  ].map((item) => ({ ...item, level: item.level === "yellow" ? "red" : item.level }));
  const score = Math.round((items.filter((item) => item.level === "green").length / Math.max(items.length, 1)) * 100);
  const label = score >= 80 ? "Ready" : score >= 50 ? "Needs Revision" : "Major Alignment Issue";
  return { score, label, items };
}

function stageCompletion(stageId) {
  const section = state[stageId] || {};
  if (stageId === "details") {
    const fields = ["studentName", "course", "section", "submissionDate", "initialReadiness"];
    return fields.filter((field) => state.submission[field]).length / fields.length;
  }
  if (stageId === "submission") {
    return ["confidence", "readinessChange"].filter((field) => state.submission[field]).length / 2;
  }
  if (stageId === "a1") {
    const fields = ["initialTopic", "majorNouns", "fifteenPageTest", "rrlMajorityTest", "coreConstruct"];
    return fields.filter((field) => state.a1[field]).length / fields.length;
  }
  if (stageId === "a2") {
    const patternProgress = Math.min(state.a2.patterns.filter((row) => row.notice && row.authors).length / 3, 1);
    return (patternProgress + (state.a2.synthesis ? 1 : 0)) / 2;
  }
  if (stageId === "a3") {
    const gapProgress = Math.min(state.a3.gaps.filter((row) => row.lessVisible && row.limits && row.gap).length / 1, 1);
    const selectionFields = ["strongestGap", "weakestGap", "selectionReason", "finalGap"];
    return (gapProgress + selectionFields.filter((field) => state.a3[field]).length / selectionFields.length) / 2;
  }
  if (stageId === "a4") {
    const fields = ["literatureProblem", "centralQuestion", "questionType", "studiedGroup", "rqConstructs"];
    return (fields.filter((field) => state.a4[field]).length / fields.length + Math.min(state.a4.questions.filter(Boolean).length / 3, 1)) / 2;
  }
  if (stageId === "framework") {
    const finderFields = ["pathway", ...fieldSets.frameworkFinder.map((field) => field[0])];
    const writeFields = ["theoryModel", "problemConnection", "questionConnection", "instrumentConnection", "scopeBoundaries"];
    const filled = finderFields.filter((field) => state.frameworkFinder[field]).length + writeFields.filter((field) => state.framework[field]).length;
    return filled / (finderFields.length + writeFields.length);
  }
  if (stageId === "researchLevel") {
    const fields = fieldSets.researchLevel.map((field) => field[0]);
    return fields.filter((field) => state.researchLevel[field]).length / fields.length;
  }
  if (stageId === "methodology") {
    const fields = ["rqTypes", "dataNeeded", "participants", "purpose", "selectedDesign", "sampling", "locale", "collection", "analysis"];
    const baseProgress = fields.filter((field) => state.methodology[field]).length / fields.length;
    if (!isMixedMethodsLikely()) return baseProgress;
    const mixedFields = ["quantStrand", "qualStrand", "integrationPoint", "integrationPurpose"];
    const mixedProgress = mixedFields.filter((field) => state.mixedMethods[field]).length / mixedFields.length;
    return (baseProgress + mixedProgress) / 2;
  }
  if (stageId === "instrumentation") {
    return state.instrumentation.rows.some((row) => row.rq && row.instrument) ? 1 : 0;
  }
  if (stageId === "terms") {
    const rows = state.terms.rows.map(normalizeTermRow).filter((row) => row.term || row.conceptual || row.operational || row.measured);
    if (!rows.length) return 0;
    const filled = rows.reduce((sum, row) => sum + ["term", "conceptual", "operational", "measured"].filter((field) => row[field]).length, 0);
    return filled / (rows.length * 4);
  }
  if (stageId === "readiness") return readinessReport().score / 100;
  const values = Object.values(section).filter((item) => typeof item === "string");
  return values.length ? values.filter(Boolean).length / values.length : 0;
}

function updateDashboard() {
  const completion = Math.round((stages.reduce((sum, stage) => sum + stageCompletion(stage.id), 0) / stages.length) * 100);
  const score = readinessReport().score;
  els.completionText.textContent = `${completion}%`;
  els.completionBar.style.width = `${completion}%`;
  els.alignmentScore.textContent = score;
  const issues = readinessReport().items.filter((item) => item.level !== "green").slice(0, 5);
  els.issueList.innerHTML = issues.length ? issues.map((item) => `<li>${escapeHtml(item.text)}</li>`).join("") : "<li>No major alignment issues detected.</li>";
}

function showFeedback() {
  const items = runChecks();
  els.feedback.innerHTML = items.map(feedbackHtml).join("");
  updateDashboard();
}

function wordCount(text = "") {
  return String(text).trim().split(/\s+/).filter(Boolean).length;
}

function instrumentationOutputHtml(rows) {
  const labels = [
    ["rq", "Research Question"],
    ["instrument", "Instrument"],
    ["description", "Description"],
    ["purpose", "Purpose"],
    ["validation", "Validation"],
    ["implementation", "Implementation"]
  ];
  rows = rows.map(normalizeInstrumentRow);
  const shouldStack = rows.some((row) => wordCount(Object.values(row).join(" ")) > 150);
  if (shouldStack) {
    return `<div class="instrument-cards">${rows.map((row, index) => `
      <section class="instrument-card">
        <h3>Instrument Row ${index + 1}</h3>
        ${labels.map(([key, label]) => `<p><strong>${label}:</strong> ${escapeHtml(row[key])}</p>`).join("")}
      </section>
    `).join("")}</div>`;
  }
  const instrumentRows = rows.map((row) => `<tr><td>${escapeHtml(row.rq)}</td><td>${escapeHtml(row.instrument)}</td><td>${escapeHtml(row.description)}</td><td>${escapeHtml(row.purpose)}</td><td>${escapeHtml(row.validation)}</td><td>${escapeHtml(row.implementation)}</td></tr>`).join("");
  return `<table><thead><tr><th>Research Question</th><th>Instrument</th><th>Description</th><th>Purpose</th><th>Validation</th><th>Implementation</th></tr></thead><tbody>${instrumentRows}</tbody></table>`;
}

function termsOutputHtml(rows) {
  rows = rows.map(normalizeTermRow).filter((row) => row.term || row.conceptual || row.operational || row.measured);
  if (!rows.length) return "<p>No definition of terms entries have been added.</p>";
  return `<div class="instrument-cards">${rows.map((row, index) => `
    <section class="instrument-card">
      <h3>Term ${index + 1}: ${escapeHtml(row.term)}</h3>
      <p><strong>Conceptual Definition:</strong> ${escapeHtml(row.conceptual)}</p>
      <p><strong>Operational Definition:</strong> ${escapeHtml(row.operational)}</p>
      <p><strong>Measured, Observed, or Identified Through:</strong> ${escapeHtml(row.measured)}</p>
    </section>
  `).join("")}</div>`;
}

function readinessPrintSummaryHtml(report) {
  const warnings = report.items.filter((item) => item.level !== "green");
  const degreeReadiness = degreeLevelReadiness();
  const frameworkReady = Boolean(
    state.frameworkFinder.literatureSignals &&
    state.frameworkFinder.candidateFrameworks &&
    state.frameworkFinder.frameworkSource &&
    state.frameworkFinder.selectionReason &&
    state.frameworkFinder.withoutFramework &&
    state.frameworkFinder.methodFit &&
    state.framework.theoryModel &&
    state.framework.problemConnection &&
    state.framework.questionConnection &&
    state.framework.instrumentConnection &&
    state.framework.scopeBoundaries
  );
  const methodologyReady = Boolean(state.methodology.selectedDesign && state.methodology.participants && state.methodology.collection && state.methodology.analysis);
  const ethicsReady = Boolean(state.methodology.participants && Object.values(state.ethics.checks).some(Boolean));
  const instrumentsReady = state.instrumentation.rows.map(normalizeInstrumentRow).some((row) => row.rq && row.instrument && row.description && row.purpose && row.validation && row.implementation);
  const mixedMethodsReady = !isMixedMethodsLikely() || Boolean(state.mixedMethods.quantStrand && state.mixedMethods.qualStrand && state.mixedMethods.integrationPoint && state.mixedMethods.integrationPurpose);
  const termsRows = state.terms.rows.map(normalizeTermRow).filter((row) => row.term || row.conceptual || row.operational || row.measured);
  const termsReady = termsRows.length > 0 && termsRows.every((row) => row.term && row.conceptual && row.operational && row.measured);
  const levelRows = state.submission.degreeLevel === "shs"
    ? [
        ["Research level / use context", degreeReadiness.degree.label],
        ["School-level research ambition", degreeReadiness.domains.find((domain) => domain.label === "Research Ambition")?.text || "Not checked."],
        ["School-level feasibility and scope", degreeReadiness.domains.find((domain) => domain.label === "Feasibility and Scope")?.text || "Not checked."],
        ["School-level method and evidence fit", degreeReadiness.domains.find((domain) => domain.label === "Method and Evidence Fit")?.text || "Not checked."]
      ]
    : [
        ["Research level / use context", `${degreeReadiness.degree.label} (${degreeReadiness.degree.pqf})`],
        ["PQF reference", PQF_REFERENCE],
        ["PQF Responsibility and Autonomy", degreeReadiness.domains.find((domain) => domain.label === "Responsibility and Autonomy")?.text || "Not checked."],
        ["PQF Knowledge and Understanding", degreeReadiness.domains.find((domain) => domain.label === "Knowledge and Understanding")?.text || "Not checked."],
        ["PQF Skills and Application", degreeReadiness.domains.find((domain) => domain.label === "Skills and Application")?.text || "Not checked."]
      ];
  const statusRows = [
    ["Readiness score", `${report.score}/100 - ${report.label}`],
    ["Alignment status", report.score >= 80 ? "Ready for adviser review" : report.score >= 50 ? "Needs revision before submission" : "Major alignment issues remain"],
    ...levelRows,
    ["Framework and scope status", frameworkReady ? "The framework is literature-supported, justified, and connected to the problem, questions, evidence, and scope." : "Framework finding, source support, fit reasoning, or scope alignment still needs detail."],
    ["Methodology status", methodologyReady ? "Methodology has the required core details." : "Methodology is missing design, participants, data gathering, or data analysis details."],
    ["Mixed methods status", mixedMethodsReady ? "Mixed methods integration is complete or not required." : "Mixed methods integration needs quantitative, qualitative, and integration details."],
    ["Ethics status", ethicsReady ? "Ethics safeguards have been started." : "Ethics safeguards need more detail before data gathering."],
    ["Formatting status", "Letter-size print layout with 1-inch margins is applied."],
    ["Instrumentation status", instrumentsReady ? "At least one instrument row includes alignment and validation details." : "Instrumentation needs clearer alignment or validation details."],
    ["Definition of terms status", termsReady ? "Terms are conceptually and operationally defined." : "Definition of terms needs conceptual, operational, and measurement details."]
  ];
  return `
    <div class="readiness-summary">
      ${statusRows.map(([label, text]) => `<p><strong>${label}:</strong> ${escapeHtml(text)}</p>`).join("")}
    </div>
    <h3>Warnings</h3>
    ${warnings.length ? `<ul class="warning-list">${warnings.map((item) => `<li>${escapeHtml(item.text)}</li>`).join("")}</ul>` : "<p>No major warnings detected.</p>"}
  `;
}

function outlineHtml() {
  const majorHeadings = new Set([
    "Chapter 1: The Problem and Its Scope",
    "Introduction",
    "Statement of the Problem",
    "Methodology",
    "Definition of Terms",
    "Appendices"
  ]);
  const subsectionHeadings = new Set([
    "Rationale",
    "Background of the Study",
    "General Statement",
    "Specific Statements in Question Form",
    "Hypothesis/Assumptions",
    "Significance",
    "Design",
    "Scope and Limitations/Delimitations",
    "Participants",
    "Locale",
    "Instrumentation",
    "Data Procedure",
    "Operational Definition of Key Terms"
  ]);
  return buildOutline().split("\n").map((line) => {
    const text = line.trim();
    if (!text) return "";
    if (majorHeadings.has(text)) {
      return `<h3>${escapeHtml(text)}</h3>`;
    }
    if (text.startsWith("- ") && subsectionHeadings.has(text.slice(2))) {
      return `<h4>${escapeHtml(text.slice(2))}</h4>`;
    }
    return `<p>${escapeHtml(text.replace(/^- /, ""))}</p>`;
  }).join("");
}

function buildSubmissionHtml() {
  const report = readinessReport();
  const degreeReadiness = degreeLevelReadiness();
  const generatedAt = new Date();
  const printedBy = value("submission.studentName") || "__________";
  const startedAt = formatTimestamp(state.startedAt);
  const workDuration = formatDuration(state.startedAt, generatedAt);
  const patternRows = state.a2.patterns.map((row) => `<tr><td>${escapeHtml(row.type)}</td><td>${escapeHtml(row.notice)}</td><td>${escapeHtml(row.authors)}</td><td>${escapeHtml(row.years)}</td></tr>`).join("");
  const gapRows = state.a3.gaps.map((row) => `<tr><td>${escapeHtml(row.type)}</td><td>${escapeHtml(row.show)}</td><td>${escapeHtml(row.emphasized)}</td><td>${escapeHtml(row.lessVisible)}</td><td>${escapeHtml(row.limits)}</td><td>${escapeHtml(row.gap)}</td></tr>`).join("");
  const instrumentOutput = instrumentationOutputHtml(state.instrumentation.rows);
  const mixedMethodsOutput = isMixedMethodsLikely() ? `
    <h2>Mixed Methods Integration</h2>
    <p><strong>Quantitative Strand:</strong> ${escapeHtml(value("mixedMethods.quantStrand"))}</p>
    <p><strong>Qualitative Strand:</strong> ${escapeHtml(value("mixedMethods.qualStrand"))}</p>
    <p><strong>Integration Point:</strong> ${escapeHtml(value("mixedMethods.integrationPoint"))}</p>
    <p><strong>Integration Purpose:</strong> ${escapeHtml(value("mixedMethods.integrationPurpose"))}</p>
  ` : "";
  return `
    <h1>Lit-Based Proposal Builder</h1>
    <p><strong>Student Name:</strong> ${escapeHtml(value("submission.studentName"))}<br>
    <strong>Course:</strong> ${escapeHtml(value("submission.course"))}<br>
    <strong>Section:</strong> ${escapeHtml(value("submission.section"))}<br>
    <strong>Date:</strong> ${escapeHtml(value("submission.submissionDate"))}<br>
    <strong>Research Level / Use Context:</strong> ${escapeHtml(degreeReadiness.degree.label)} (${escapeHtml(degreeReadiness.degree.pqf)})</p>
    <h2>Readiness Reflections</h2>
    <h3>Initial Readiness Reflection</h3>
    <p>${escapeHtml(value("submission.initialReadiness"))}</p>
    <h3>Final Readiness Reflection</h3>
    <p>${escapeHtml(value("submission.confidence"))}</p>
    <h3>What Changed and Why</h3>
    <p>${escapeHtml(value("submission.readinessChange"))}</p>
    <h2>A1 Core Construct</h2>
    <p>${escapeHtml(buildTopic())}</p>
    <h2 class="major-section">A2 Literature Pattern Mapping</h2>
    <table><thead><tr><th>Pattern Type</th><th>What appears across studies</th><th>Supporting Authors</th><th>Year</th></tr></thead><tbody>${patternRows}</tbody></table>
    <h2 class="major-section">A3 Literature Gap</h2>
    <table><thead><tr><th>Pattern Type</th><th>Studies Repeatedly Show</th><th>Emphasized</th><th>Less Visible</th><th>Limits Understanding Of</th><th>Refined Gap</th></tr></thead><tbody>${gapRows}</tbody></table>
    <p><strong>Final gap:</strong> ${escapeHtml(value("a3.finalGap"))}</p>
    <h2 class="major-section">A4 Literature-Based Problem</h2>
    <p>${escapeHtml(buildProblem())}</p>
    <p><strong>Central research question:</strong> ${escapeHtml(value("a4.centralQuestion"))}</p>
    <h2>Specific Research Questions</h2>
    <ol>${state.a4.questions.filter(Boolean).map((q) => `<li>${escapeHtml(q)}</li>`).join("")}</ol>
    <h2 class="major-section">Framework and Scope Alignment</h2>
    <p><strong>Research Pathway:</strong> ${escapeHtml(value("frameworkFinder.pathway") === "theory-led" ? "Theory-led" : "Problem-led")}</p>
    <h3>Framework Finder</h3>
    ${fieldSets.frameworkFinder.map(([key, label]) => `<p><strong>${escapeHtml(label)}</strong><br>${escapeHtml(value(`frameworkFinder.${key}`))}</p>`).join("")}
    <h3>Selected Framework and Fit</h3>
    <p><strong>Framework or Explanatory Concept:</strong> ${escapeHtml(value("framework.theoryModel"))}</p>
    <p><strong>Connection to the Problem:</strong> ${escapeHtml(value("framework.problemConnection"))}</p>
    <p><strong>Connection to the Questions:</strong> ${escapeHtml(value("framework.questionConnection"))}</p>
    <p><strong>Connection to Instruments or Analysis:</strong> ${escapeHtml(value("framework.instrumentConnection"))}</p>
    <p><strong>Scope Boundaries:</strong> ${escapeHtml(value("framework.scopeBoundaries"))}</p>
    <h2 class="major-section">Research Level Justification</h2>
    ${state.submission.degreeLevel === "shs" ? `<p><strong>PQF Reference:</strong> ${escapeHtml(PQF_REFERENCE)}</p><p><strong>SHS / PQF Level 3 Note:</strong> Advanced ideas are welcome. The proposal should still be scoped to structured research tasks, emerging independence, available time, data, guidance, and ethical safeguards.</p>` : `<p><strong>PQF Reference:</strong> ${escapeHtml(PQF_REFERENCE)}</p><p><strong>Formative Note:</strong> ${escapeHtml(PQF_NOTE)}</p>`}
    ${fieldSets.researchLevel.map(([key, label]) => `<h3>${escapeHtml(label)}</h3><p>${escapeHtml(value(`researchLevel.${key}`))}</p>`).join("")}
    <h2 class="major-section">Methodology</h2>
    <p><strong>Research Design:</strong> ${escapeHtml(value("methodology.selectedDesign"))}</p>
    <p><strong>Scope and Limitations/Delimitations:</strong> ${escapeHtml(value("framework.scopeBoundaries") || "This study is bounded by the selected participants, locale, constructs, instruments, and data procedures described below.")}</p>
    <p><strong>Participants:</strong> ${escapeHtml(value("methodology.participants"))}</p>
    <p><strong>Sampling:</strong> ${escapeHtml(value("methodology.sampling"))}</p>
    <p><strong>Locale:</strong> ${escapeHtml(value("methodology.locale"))}</p>
    ${mixedMethodsOutput}
    <h2 class="major-section">Instrumentation</h2>
    <p>Each instrument should include its description, purpose, validation, and implementation.</p>
    ${instrumentOutput}
    <h2>Data Procedure</h2>
    <p><strong>Data Gathering:</strong> ${escapeHtml(value("methodology.collection"))}</p>
    <p><strong>Data Analysis:</strong> ${escapeHtml(value("methodology.analysis"))}</p>
    <h2 class="major-section">Ethical Considerations</h2>
    <p>${escapeHtml(value("ethics.draft") || buildEthicsDraft())}</p>
    <h2 class="major-section">Definition of Terms</h2>
    ${termsOutputHtml(state.terms.rows)}
    <h2>Chapter 1 Template Alignment</h2>
    <div class="chapter-template">${outlineHtml()}</div>
    <h2 class="major-section">Proposal Readiness Report</h2>
    ${readinessPrintSummaryHtml(report)}
    <footer><p>Generated by Lit-Based Proposal Builder (${escapeHtml(APP_VERSION)})<br>
    ${escapeHtml(APP_CREDIT)}<br>
    Printed by ${escapeHtml(printedBy)} on ${escapeHtml(formatTimestamp(generatedAt))}.<br>
    Started work on ${escapeHtml(startedAt)}.<br>
    Duration of work: ${escapeHtml(workDuration)}.</p></footer>
  `;
}

function progressPdfSelection() {
  const stageId = document.getElementById("progressPdfStage")?.value || state.currentStage;
  const scope = document.getElementById("progressPdfScope")?.value || "cumulative";
  return { stageId, scope };
}

function progressStageList(stageId, scope) {
  const available = stages.filter((stage) => !["submission"].includes(stage.id));
  if (scope === "single") return available.filter((stage) => stage.id === stageId);
  const index = available.findIndex((stage) => stage.id === stageId);
  return available.slice(0, index >= 0 ? index + 1 : 1);
}

function buildProgressPdfHtml(stageId, scope) {
  const selectedStages = progressStageList(stageId, scope);
  const generatedAt = new Date();
  const degree = degreeLevelInfo();
  return `
    <h1>Lit-Based Proposal Builder</h1>
    <p><strong>Progress PDF:</strong> ${scope === "single" ? "Selected part only" : "Cumulative progress"}<br>
    <strong>Student Name:</strong> ${escapeHtml(value("submission.studentName"))}<br>
    <strong>Course:</strong> ${escapeHtml(value("submission.course"))}<br>
    <strong>Section:</strong> ${escapeHtml(value("submission.section"))}<br>
    <strong>Date:</strong> ${escapeHtml(value("submission.submissionDate"))}<br>
    <strong>Research Level / Use Context:</strong> ${escapeHtml(degree.label)} (${escapeHtml(degree.pqf)})</p>
    ${selectedStages.map((stage) => progressStageHtml(stage.id)).join("")}
    <footer><p>Generated by Lit-Based Proposal Builder (${escapeHtml(APP_VERSION)})<br>
    Printed by ${escapeHtml(value("submission.studentName") || "__________")} on ${escapeHtml(formatTimestamp(generatedAt))}.</p></footer>
  `;
}

function progressStageHtml(stageId) {
  if (stageId === "details") {
    return `<h2 class="major-section">Student Details</h2>
      <p><strong>Initial Readiness Reflection:</strong> ${escapeHtml(value("submission.initialReadiness"))}</p>`;
  }
  if (stageId === "a1") {
    return `<h2 class="major-section">A1 Core Construct</h2>
      ${fieldSets.a1.map(([key, label]) => `<h3>${escapeHtml(label)}</h3><p>${escapeHtml(value(`a1.${key}`))}</p>`).join("")}
      <p><strong>A1 Output:</strong> ${escapeHtml(buildTopic())}</p>`;
  }
  if (stageId === "a2") {
    const patternRows = state.a2.patterns.map((row) => `<tr><td>${escapeHtml(row.type)}</td><td>${escapeHtml(row.notice)}</td><td>${escapeHtml(row.authors)}</td><td>${escapeHtml(row.years)}</td></tr>`).join("");
    return `<h2 class="major-section">A2 Literature Pattern Mapping</h2>
      <table><thead><tr><th>Pattern Type</th><th>What appears across studies</th><th>Supporting Authors</th><th>Year</th></tr></thead><tbody>${patternRows}</tbody></table>
      <h3>Short Synthesis</h3><p>${escapeHtml(value("a2.synthesis"))}</p>`;
  }
  if (stageId === "a3") {
    const gapRows = state.a3.gaps.map((row) => `<tr><td>${escapeHtml(row.type)}</td><td>${escapeHtml(row.show)}</td><td>${escapeHtml(row.emphasized)}</td><td>${escapeHtml(row.lessVisible)}</td><td>${escapeHtml(row.limits)}</td><td>${escapeHtml(row.gap)}</td></tr>`).join("");
    return `<h2 class="major-section">A3 Literature Gap</h2>
      <table><thead><tr><th>Pattern Type</th><th>Studies Repeatedly Show</th><th>Emphasized</th><th>Less Visible</th><th>Limits Understanding Of</th><th>Refined Gap</th></tr></thead><tbody>${gapRows}</tbody></table>
      <p><strong>Final gap:</strong> ${escapeHtml(value("a3.finalGap"))}</p>`;
  }
  if (stageId === "a4") {
    return `<h2 class="major-section">A4 Literature-Based Problem and Questions</h2>
      ${fieldSets.a4.map(([key, label]) => `<h3>${escapeHtml(label)}</h3><p>${escapeHtml(value(`a4.${key}`))}</p>`).join("")}
      <h3>Specific Research Questions</h3><ol>${state.a4.questions.filter(Boolean).map((q) => `<li>${escapeHtml(q)}</li>`).join("")}</ol>`;
  }
  if (stageId === "framework") {
    return `<h2 class="major-section">Framework and Scope Alignment</h2>
      <p><strong>Research Pathway:</strong> ${escapeHtml(value("frameworkFinder.pathway") === "theory-led" ? "Theory-led" : "Problem-led")}</p>
      ${fieldSets.frameworkFinder.map(([key, label]) => `<h3>${escapeHtml(label)}</h3><p>${escapeHtml(value(`frameworkFinder.${key}`))}</p>`).join("")}
      ${fieldSets.framework.map(([key, label]) => `<h3>${escapeHtml(label)}</h3><p>${escapeHtml(value(`framework.${key}`))}</p>`).join("")}`;
  }
  if (stageId === "researchLevel") {
    const degree = degreeLevelInfo();
    return `<h2 class="major-section">Research Level Justification</h2>
      <p><strong>Research Level / Use Context:</strong> ${escapeHtml(degree.label)} (${escapeHtml(degree.pqf)})</p>
      ${fieldSets.researchLevel.map(([key, label]) => `<h3>${escapeHtml(label)}</h3><p>${escapeHtml(value(`researchLevel.${key}`))}</p>`).join("")}`;
  }
  if (stageId === "methodology") {
    return `<h2 class="major-section">Methodology</h2>
      ${fieldSets.methodology.map(([key, label]) => `<h3>${escapeHtml(label)}</h3><p>${escapeHtml(value(`methodology.${key}`))}</p>`).join("")}
      <p><strong>Selected Design:</strong> ${escapeHtml(value("methodology.selectedDesign"))}</p>
      <p><strong>Sampling:</strong> ${escapeHtml(value("methodology.sampling"))}</p>
      <p><strong>Locale:</strong> ${escapeHtml(value("methodology.locale"))}</p>
      <p><strong>Data Gathering:</strong> ${escapeHtml(value("methodology.collection"))}</p>
      <p><strong>Data Analysis:</strong> ${escapeHtml(value("methodology.analysis"))}</p>`;
  }
  if (stageId === "ethics") {
    return `<h2 class="major-section">Ethical Considerations</h2>
      ${fieldSets.ethics.map(([key, label]) => `<h3>${escapeHtml(label)}</h3><p>${escapeHtml(value(`ethics.${key}`))}</p>`).join("")}
      <h3>Draft Ethical Considerations</h3><p>${escapeHtml(value("ethics.draft") || buildEthicsDraft())}</p>`;
  }
  if (stageId === "instrumentation") {
    return `<h2 class="major-section">Instrumentation</h2>${instrumentationOutputHtml(state.instrumentation.rows)}`;
  }
  if (stageId === "terms") {
    return `<h2 class="major-section">Definition of Terms</h2>${termsOutputHtml(state.terms.rows)}`;
  }
  if (stageId === "outline") {
    return `<h2 class="major-section">Proposal Outline</h2><div class="chapter-template">${outlineHtml()}</div>`;
  }
  if (stageId === "readiness") {
    return `<h2 class="major-section">Proposal Readiness Report</h2>${readinessPrintSummaryHtml(readinessReport())}`;
  }
  return "";
}

function previewProgressPdf() {
  const { stageId, scope } = progressPdfSelection();
  activePreviewMode = "progress";
  activeProgressPrint = { stageId, scope };
  els.submissionPreview.innerHTML = buildProgressPdfHtml(stageId, scope);
  const pdfButton = document.getElementById("pdfBtn");
  if (pdfButton) pdfButton.textContent = "Print Progress PDF";
  els.previewDialog.showModal();
}

function printProgressPdf() {
  const { stageId, scope } = progressPdfSelection();
  const printTarget = document.getElementById("printSubmission");
  printTarget.innerHTML = buildProgressPdfHtml(stageId, scope);
  document.body.classList.add("printing-submission");
  window.print();
  window.setTimeout(() => {
    document.body.classList.remove("printing-submission");
    printTarget.innerHTML = "";
  }, 500);
}

function previewSubmission() {
  activePreviewMode = "final";
  activeProgressPrint = null;
  els.submissionPreview.innerHTML = buildSubmissionHtml();
  const pdfButton = document.getElementById("pdfBtn");
  if (pdfButton) pdfButton.textContent = "Generate PDF";
  els.previewDialog.showModal();
}

function previewCurrentOutput() {
  if (state.currentStage === "submission") {
    previewSubmission();
    return;
  }
  activePreviewMode = "progress";
  activeProgressPrint = { stageId: state.currentStage, scope: "cumulative" };
  els.submissionPreview.innerHTML = buildProgressPdfHtml(state.currentStage, "cumulative");
  const pdfButton = document.getElementById("pdfBtn");
  if (pdfButton) pdfButton.textContent = "Print Progress PDF";
  els.previewDialog.showModal();
}

function printActivePreview() {
  if (activePreviewMode === "progress" && activeProgressPrint) {
    const printTarget = document.getElementById("printSubmission");
    printTarget.innerHTML = buildProgressPdfHtml(activeProgressPrint.stageId, activeProgressPrint.scope);
    document.body.classList.add("printing-submission");
    window.print();
    window.setTimeout(() => {
      document.body.classList.remove("printing-submission");
      printTarget.innerHTML = "";
    }, 500);
    return;
  }
  printSubmission();
}

function finalSubmissionMissingItems() {
  syncInstrumentationRows();
  const missing = [];
  const requireValue = (path, label) => {
    if (!String(value(path) || "").trim()) missing.push(label);
  };

  requireValue("submission.studentName", "Student name");
  requireValue("submission.course", "Course");
  requireValue("submission.section", "Section");
  requireValue("submission.submissionDate", "Date");
  requireValue("submission.initialReadiness", "Initial readiness reflection");

  ["initialTopic", "majorNouns", "fifteenPageTest", "rrlMajorityTest", "coreConstruct"].forEach((key) => {
    requireValue(`a1.${key}`, `A1: ${fieldSets.a1.find((field) => field[0] === key)?.[1] || key}`);
  });

  const completeA2Rows = state.a2.patterns.filter((row) => row.notice && row.authors && row.years);
  if (completeA2Rows.length < 3) missing.push("A2: at least three literature pattern rows with notice, supporting authors, and year");
  requireValue("a2.synthesis", "A2: short synthesis");

  const completeA3Rows = state.a3.gaps.filter((row) => row.show && row.emphasized && row.lessVisible && row.limits && row.gap);
  if (completeA3Rows.length < 1) missing.push("A3: at least one complete gap row");
  ["strongestGap", "weakestGap", "selectionReason", "finalGap"].forEach((key) => {
    requireValue(`a3.${key}`, `A3: ${key}`);
  });

  ["literatureProblem", "centralQuestion", "questionType", "studiedGroup", "rqConstructs"].forEach((key) => {
    requireValue(`a4.${key}`, `A4: ${fieldSets.a4.find((field) => field[0] === key)?.[1] || key}`);
  });
  const questions = state.a4.questions.filter((question) => question.trim());
  if (questions.length < SRQ_LIMITS.minimum || questions.length > SRQ_LIMITS.maximum) {
    missing.push(`A4: ${SRQ_LIMITS.minimum}-${SRQ_LIMITS.maximum} specific research questions`);
  }
  questions.forEach((question, index) => {
    if (!state.a4.questionPurposes[index]) missing.push(`A4: purpose for SRQ ${index + 1}`);
  });

  ["theoryModel", "problemConnection", "questionConnection", "instrumentConnection", "scopeBoundaries"].forEach((key) => {
    requireValue(`framework.${key}`, `Framework and Scope: ${fieldSets.framework.find((field) => field[0] === key)?.[1] || key}`);
  });
  requireValue("frameworkFinder.pathway", "Framework Finder: research pathway");
  fieldSets.frameworkFinder.forEach(([key, label]) => {
    requireValue(`frameworkFinder.${key}`, `Framework Finder: ${label}`);
  });

  requireValue("submission.degreeLevel", "Research level / use context");
  fieldSets.researchLevel.forEach(([key, label]) => {
    requireValue(`researchLevel.${key}`, `Research Level Justification: ${label}`);
  });
  if (degreeLevelReadiness().hasMajorGap) {
    missing.push("Research Level Justification: not enough evidence or feasible scope for the selected context");
  }

  ["rqTypes", "dataNeeded", "participants", "purpose"].forEach((key) => {
    requireValue(`methodology.${key}`, `Methodology: ${fieldSets.methodology.find((field) => field[0] === key)?.[1] || key}`);
  });
  ["selectedDesign", "sampling", "locale", "collection", "analysis"].forEach((key) => {
    requireValue(`methodology.${key}`, `Methodology: ${key}`);
  });
  if (isMixedMethodsLikely()) {
    ["quantStrand", "qualStrand", "integrationPoint", "integrationPurpose"].forEach((key) => {
      requireValue(`mixedMethods.${key}`, `Mixed Methods Integration: ${fieldSets.mixedMethods.find((field) => field[0] === key)?.[1] || key}`);
    });
  }

  ["participantAge", "powerIssue", "dataPrivacy", "permissions", "consentPlan", "storagePlan", "recordingAiUse", "cultureLanguage"].forEach((key) => {
    requireValue(`ethics.${key}`, `Ethics: ${fieldSets.ethics.find((field) => field[0] === key)?.[1] || key}`);
  });
  if (!Object.values(state.ethics.checks).some(Boolean)) missing.push("Ethics: select applicable safeguards");
  requireValue("ethics.draft", "Ethics: draft ethical considerations section");

  questions.forEach((question, index) => {
    const row = normalizeInstrumentRow(state.instrumentation.rows[index] || emptyRowFor("instrumentation"));
    ["instrument", "description", "purpose", "validation", "implementation"].forEach((key) => {
      if (!row[key]) missing.push(`Instrumentation: ${key} for SRQ ${index + 1}`);
    });
  });

  const termRows = state.terms.rows.map(normalizeTermRow).filter((row) => row.term || row.conceptual || row.operational || row.measured);
  if (!termRows.length) missing.push("Definition of Terms: at least one term card");
  termRows.forEach((row, index) => {
    if (!row.term) missing.push(`Definition of Terms: term name for Term ${index + 1}`);
    if (!row.conceptual) missing.push(`Definition of Terms: conceptual definition for Term ${index + 1}`);
    if (!row.operational) missing.push(`Definition of Terms: operational definition for Term ${index + 1}`);
    if (!row.measured) missing.push(`Definition of Terms: measurement, observation, or identification detail for Term ${index + 1}`);
  });

  requireValue("submission.confidence", "Final readiness reflection");
  requireValue("submission.readinessChange", "What changed and why");

  return missing;
}

function requireReadyForPdf() {
  const missing = finalSubmissionMissingItems();
  if (!missing.length) return true;
  const shown = missing.slice(0, 12).map((item) => `- ${item}`).join("\n");
  const extra = missing.length > 12 ? `\n...and ${missing.length - 12} more item${missing.length - 12 === 1 ? "" : "s"}.` : "";
  window.alert(`PDF generation is locked until the required parts are complete.\n\nMissing:\n${shown}${extra}\n\nInstructor notes/local format reminders are optional.`);
  return false;
}

function printSubmission() {
  if (!requireReadyForPdf()) return;
  const printTarget = document.getElementById("printSubmission");
  printTarget.innerHTML = buildSubmissionHtml();
  document.body.classList.add("printing-submission");
  window.print();
  window.setTimeout(() => {
    document.body.classList.remove("printing-submission");
    printTarget.innerHTML = "";
  }, 500);
}

function syncStudentDetailsFields() {
  ["degreeLevel", "studentName", "course", "section", "submissionDate", "initialReadiness"].forEach((key) => {
    const field = document.getElementById(`details-${key}`);
    if (field) field.value = value(`submission.${key}`);
  });
}

function openStudentDetails() {
  syncStudentDetailsFields();
  document.getElementById("studentDetailsDialog").showModal();
}

function showWelcomeIfNeeded() {
  if (!els.welcomeDialog || localStorage.getItem(WELCOME_KEY)) return;
  els.welcomeDialog.showModal();
}

function exportJson() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "proposal-builder-a4-draft.json";
  link.click();
  URL.revokeObjectURL(url);
}

async function extractUploadFile(file) {
  if (file.name.toLowerCase().endsWith(".docx")) {
    const ZipReader = getZipReader();
    if (!ZipReader) {
      throw new Error("The DOCX reader is still loading. Please try again in a few seconds.");
    }
    const arrayBuffer = await file.arrayBuffer();
    return extractDocxText(arrayBuffer, ZipReader);
  }
  if (file.name.toLowerCase().endsWith(".pdf")) {
    return extractPdfText(await file.arrayBuffer());
  }
  return file.text();
}

async function getPdfJs() {
  if (!pdfjsModule) {
    pdfjsModule = await import("./pdf.min.mjs");
    pdfjsModule.GlobalWorkerOptions.workerSrc = "./pdf.worker.min.mjs";
  }
  return pdfjsModule;
}

async function extractPdfText(arrayBuffer) {
  const pdfjs = await getPdfJs();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => item.str || "").join(" "));
  }
  return pages.join("\n");
}

function getZipReader() {
  if (typeof globalThis !== "undefined" && globalThis.JSZip) return globalThis.JSZip;
  if (typeof window !== "undefined" && window.JSZip) return window.JSZip;
  if (typeof JSZip !== "undefined") return JSZip;
  return null;
}

async function extractDocxText(arrayBuffer, ZipReader) {
  const zip = await ZipReader.loadAsync(arrayBuffer);
  const documentFile = zip.file("word/document.xml");
  if (!documentFile) throw new Error("This DOCX file does not contain readable document text.");
  const xmlText = await documentFile.async("text");
  const xml = new DOMParser().parseFromString(xmlText, "application/xml");
  const body = Array.from(xml.getElementsByTagNameNS("*", "body"))[0];
  if (!body) return extractTextFromNode(xml).join("\n");
  const blocks = [];
  Array.from(body.childNodes).forEach((node) => {
    if (node.nodeType !== 1) return;
    if (node.localName === "p") {
      const line = extractTextFromNode(node).join("").trim();
      if (line) blocks.push(line);
    }
    if (node.localName === "tbl") {
      Array.from(node.getElementsByTagNameNS("*", "tr")).forEach((row) => {
        const cells = Array.from(row.getElementsByTagNameNS("*", "tc")).map((cell) => extractTextFromNode(cell).join(" ").replace(/\s+/g, " ").trim());
        if (cells.some(Boolean)) blocks.push(cells.join(" | "));
      });
    }
  });
  return blocks.join("\n");
}

function extractTextFromNode(node) {
  return Array.from(node.getElementsByTagNameNS("*", "t")).map((item) => item.textContent || "");
}

function detectFormType(fileName, text) {
  const joined = `${fileName}\n${text}`.toLowerCase();
  if (joined.includes("a1") || joined.includes("core construct")) return "a1";
  if (joined.includes("a2") || joined.includes("pattern mapping")) return "a2";
  if (joined.includes("a3") || joined.includes("patterns to gaps") || joined.includes("gap statement")) return "a3";
  return "unknown";
}

function compactLines(text) {
  return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function afterLabel(text, labels) {
  for (const label of labels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = text.match(new RegExp(`${escaped}\\s*[:\\-]?\\s*([^\\n]+)`, "i"));
    if (match && match[1]) return match[1].trim();
  }
  return "";
}

function parseA1Upload(text) {
  const lines = compactLines(text);
  const topic = afterLabel(text, ["Topic", "Write your topic"]) || lines.find((line) => /topic/i.test(line) && line.length < 160) || "";
  const declaration = afterLabel(text, ["My study is about", "This study is about", "Final Declaration"]);
  const nounLine = afterLabel(text, ["List all major nouns below", "major nouns", "nouns"]);
  const fifteen = afterLabel(text, ["15-page test", "15 Page Test", "could I"]);
  const majority = afterLabel(text, ["If I review 15 journal articles, most of them will primarily define", "RRL Majority Test"]);
  return {
    initialTopic: cleanExtract(topic),
    majorNouns: cleanExtract(nounLine),
    fifteenPageTest: cleanExtract(fifteen),
    rrlMajorityTest: cleanExtract(majority || declaration),
    coreConstruct: cleanExtract(declaration || majority)
  };
}

function parseA2Upload(text) {
  const lines = compactLines(text);
  const patternTypes = ["Context", "Method", "Theory", "Evidence", "Practice", "Population", "Definition"];
  const patterns = [];
  for (const type of patternTypes) {
    const line = lines.find((item) => item.toLowerCase().startsWith(type.toLowerCase()) && item.length > type.length + 8);
    if (line) {
      const parts = line.split(/\t|\s{2,}|\|/).map((part) => part.trim()).filter(Boolean);
      patterns.push({
        type,
        notice: cleanExtract(parts[1] || line.replace(new RegExp(`^${type}`, "i"), "")),
        authors: cleanExtract(parts[2] || ""),
        years: cleanExtract(parts[3] || "")
      });
    }
  }
  const synthesisIndex = lines.findIndex((line) => /short synthesis/i.test(line));
  const synthesis = synthesisIndex >= 0 ? lines.slice(synthesisIndex + 1, synthesisIndex + 8).join(" ") : "";
  return { patterns: patterns.length ? patterns : clone(defaultData.a2.patterns), synthesis: cleanExtract(synthesis) };
}

function parseA3Upload(text) {
  const lines = compactLines(text);
  const patternTypes = ["Context", "Method", "Theory", "Evidence", "Practice", "Population", "Definition"];
  const gaps = [];
  for (const type of patternTypes) {
    const line = lines.find((item) => item.toLowerCase().startsWith(type.toLowerCase()) && /limited|less visible|understanding|because studies/i.test(item));
    if (line) {
      const parts = line.split(/\t|\s{2,}|\|/).map((part) => part.trim()).filter(Boolean);
      gaps.push({
        type,
        show: cleanExtract(parts[1] || ""),
        emphasized: cleanExtract(parts[2] || ""),
        lessVisible: cleanExtract(parts[3] || ""),
        limits: cleanExtract(parts[4] || ""),
        gap: cleanExtract(parts[5] || line)
      });
    }
  }
  const finalGap = afterLabel(text, ["Final Gap", "Write your selected strongest gap clearly", "Gap statement based on A3 matrix"]) || lines.find((line) => /limited understanding|limited clarity/i.test(line)) || "";
  return {
    gaps: gaps.length ? gaps : clone(defaultData.a3.gaps),
    strongestGap: cleanExtract(afterLabel(text, ["Strongest gap"])),
    weakestGap: cleanExtract(afterLabel(text, ["Weakest gap"])),
    selectionReason: cleanExtract(afterLabel(text, ["Reason"])),
    finalGap: cleanExtract(finalGap)
  };
}

function cleanExtract(text) {
  return String(text || "")
    .replace(/_{3,}/g, "")
    .replace(/\s+/g, " ")
    .replace(/^[|:\-\s]+/, "")
    .trim();
}

function mergeUploadStage(target, stageId, extractedStageData) {
  const merged = clone(target);
  if (stageId === "a1" && extractedStageData) {
    merged.a1 = { ...merged.a1, ...nonEmptyObject(extractedStageData) };
  }
  if (stageId === "a2" && extractedStageData) {
    merged.a2 = { ...merged.a2, ...nonEmptyObject({ synthesis: extractedStageData.synthesis }) };
    if (extractedStageData.patterns?.some((row) => row.notice || row.authors || row.years)) merged.a2.patterns = extractedStageData.patterns;
  }
  if (stageId === "a3" && extractedStageData) {
    merged.a3 = { ...merged.a3, ...nonEmptyObject(extractedStageData) };
    if (extractedStageData.gaps?.some((row) => row.gap || row.lessVisible || row.limits)) merged.a3.gaps = extractedStageData.gaps;
  }
  return normalizeState(merged);
}

function nonEmptyObject(obj) {
  return Object.fromEntries(Object.entries(obj || {}).filter(([, item]) => {
    if (Array.isArray(item)) return item.length > 0;
    return Boolean(item);
  }));
}

function uploadPreviewHtml(extracted) {
  const cards = [];
  if (extracted.a1) cards.push(uploadCard("A1 Core Construct", extracted.a1));
  if (extracted.a2) cards.push(uploadCard("A2 Pattern Mapping", extracted.a2));
  if (extracted.a3) cards.push(uploadCard("A3 Gap Mapping", extracted.a3));
  return cards.length ? cards.join("") : `<div class="feedback-item yellow">No A1-A3 form could be detected. Try uploading the accomplished A1, A2, or A3 form, or use a text version.</div>`;
}

function uploadCard(title, data) {
  return `<div class="upload-card"><h3>${escapeHtml(title)}</h3><pre>${escapeHtml(JSON.stringify(data, null, 2))}</pre></div>`;
}

async function handleFormUpload(files) {
  const extracted = {};
  const messages = [];
  for (const file of files) {
    try {
      const text = await extractUploadFile(file);
      const type = detectFormType(file.name, text);
      if (type !== uploadTargetStage) {
        messages.push(`${file.name}: ${type === "unknown" ? "not recognized" : `${type.toUpperCase()} detected, but current target is ${uploadTargetStage.toUpperCase()}`}`);
        continue;
      }
      if (type === "a1") extracted.a1 = { ...(extracted.a1 || {}), ...parseA1Upload(text) };
      if (type === "a2") extracted.a2 = { ...(extracted.a2 || {}), ...parseA2Upload(text) };
      if (type === "a3") extracted.a3 = { ...(extracted.a3 || {}), ...parseA3Upload(text) };
      messages.push(`${file.name}: ${type.toUpperCase()} detected and ready for review`);
    } catch (error) {
      messages.push(`${file.name}: ${error.message}`);
    }
  }
  pendingUploadByStage[uploadTargetStage] = extracted[uploadTargetStage] || null;
  document.getElementById("uploadFeedback").innerHTML = `
    ${messages.map((message) => `<div class="feedback-item ${message.includes("not recognized") ? "yellow" : "green"}">${escapeHtml(message)}</div>`).join("")}
    ${uploadPreviewHtml({ [uploadTargetStage]: pendingUploadByStage[uploadTargetStage] })}
  `;
}

function openUploadDialog() {
  if (!uploadStageIds.includes(state.currentStage)) {
    alert("Upload is available only for A1, A2, and A3 accomplished forms. Go to A1, A2, or A3 first.");
    return;
  }
  const stageId = state.currentStage;
  uploadTargetStage = stageId;
  const stage = stages.find((item) => item.id === stageId);
  document.getElementById("uploadDialogTitle").textContent = `Upload ${stage.code} Accomplished Form`;
  document.getElementById("uploadDialogHint").textContent = `Upload the accomplished ${stage.code} form as DOCX or text. The extracted entries will apply only to ${stage.code}: ${stage.title}.`;
  document.getElementById("applyUploadBtn").textContent = `Apply to ${stage.code}`;
  document.getElementById("formUploadFile").value = "";
  pendingUploadByStage[stageId] = null;
  document.getElementById("uploadFeedback").textContent = `No ${stage.code} file selected yet.`;
  document.getElementById("uploadDialog").showModal();
}

function attachEvents() {
  document.addEventListener("input", (event) => {
    const target = event.target;
    if (target.dataset.section && target.dataset.key) {
      setValue(target.dataset.section, target.dataset.key, target.value);
    }
    if (target.dataset.array === "a4.questions") {
      state.a4.questions[Number(target.dataset.index)] = target.value;
      saveState();
    }
    if (target.dataset.questionPurpose !== undefined) {
      state.a4.questionPurposes[Number(target.dataset.questionPurpose)] = target.value;
      saveState();
      renderStage();
    }
    if (target.dataset.table) {
      const collection = getTableRows(target.dataset.table);
      collection[Number(target.dataset.index)][target.dataset.key] = target.value;
      saveState();
      if (target.dataset.table === "terms") {
        updateTermPreview(Number(target.dataset.index));
      }
    }
  });

  document.addEventListener("change", (event) => {
    const target = event.target;
    if (target.dataset.ethicsCheck) {
      state.ethics.checks[target.dataset.ethicsCheck] = target.checked;
      if (!state.ethics.draft) state.ethics.draft = buildEthicsDraft();
      saveState();
      renderStage();
    }
    if (target.dataset.section && target.dataset.key) {
      setValue(target.dataset.section, target.dataset.key, target.value);
      if (target.tagName === "SELECT") renderStage();
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target) return;
    if (target.dataset.stage) {
      state.currentStage = target.dataset.stage;
      saveState();
      render();
    }
    if (target.dataset.progressPreview !== undefined) {
      previewProgressPdf();
    }
    if (target.dataset.progressPrint !== undefined) {
      printProgressPdf();
    }
    if (target.dataset.addRow) {
      getTableRows(target.dataset.addRow).push(emptyRowFor(target.dataset.addRow));
      saveState();
      renderStage();
    }
    if (target.dataset.removeRow) {
      const [section, index] = target.dataset.removeRow.split(":");
      const rows = getTableRows(section);
      rows.splice(Number(index), 1);
      saveState();
      renderStage();
    }
    if (target.dataset.addQuestion !== undefined) {
      if (state.a4.questions.length < SRQ_LIMITS.maximum) {
        state.a4.questions.push("");
        state.a4.questionPurposes.push("");
      }
      saveState();
      renderStage();
    }
    if (target.dataset.removeQuestion !== undefined) {
      const index = Number(target.dataset.removeQuestion);
      state.a4.questions.splice(index, 1);
      state.a4.questionPurposes.splice(index, 1);
      saveState();
      renderStage();
    }
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    const next = Math.max(0, currentIndex() - 1);
    state.currentStage = stages[next].id;
    saveState();
    render();
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    const next = Math.min(stages.length - 1, currentIndex() + 1);
    state.currentStage = stages[next].id;
    saveState();
    render();
  });

  document.getElementById("saveBtn").addEventListener("click", saveState);
  document.getElementById("checkBtn").addEventListener("click", showFeedback);
  document.getElementById("summaryBtn").addEventListener("click", previewSubmission);
  document.getElementById("previewBtn").addEventListener("click", previewCurrentOutput);
  document.getElementById("studentDetailsBtn").addEventListener("click", openStudentDetails);
  document.getElementById("aboutBtn").addEventListener("click", () => els.aboutDialog.showModal());
  document.getElementById("closeAboutBtn").addEventListener("click", () => els.aboutDialog.close());
  document.getElementById("welcomeAboutBtn").addEventListener("click", () => els.aboutDialog.showModal());
  document.getElementById("proceedBtn").addEventListener("click", () => {
    localStorage.setItem(WELCOME_KEY, "seen");
    els.welcomeDialog.close();
  });
  document.getElementById("closeStudentDetailsBtn").addEventListener("click", () => document.getElementById("studentDetailsDialog").close());
  document.getElementById("closePreviewBtn").addEventListener("click", () => els.previewDialog.close());
  document.getElementById("printBtn").addEventListener("click", printSubmission);
  document.getElementById("pdfBtn").addEventListener("click", printActivePreview);
  document.getElementById("exportBtn").addEventListener("click", exportJson);
  document.getElementById("importBtn").addEventListener("click", () => els.importFile.click());
  document.getElementById("uploadFormsBtn").addEventListener("click", openUploadDialog);
  document.getElementById("closeUploadBtn").addEventListener("click", () => document.getElementById("uploadDialog").close());
  document.getElementById("clearUploadBtn").addEventListener("click", () => {
    pendingUploadByStage[uploadTargetStage] = null;
    document.getElementById("formUploadFile").value = "";
    document.getElementById("uploadFeedback").textContent = `No ${uploadTargetStage.toUpperCase()} file selected yet.`;
  });
  document.getElementById("applyUploadBtn").addEventListener("click", () => {
    const pending = pendingUploadByStage[uploadTargetStage];
    if (!pending) {
      alert(`Upload and review an ${uploadTargetStage.toUpperCase()} form first.`);
      return;
    }
    state = mergeUploadStage(state, uploadTargetStage, pending);
    saveState();
    render();
    document.getElementById("uploadDialog").close();
  });
  document.getElementById("formUploadFile").addEventListener("change", (event) => {
    handleFormUpload(Array.from(event.target.files || []));
  });
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (confirm("Reset this draft? This clears saved work in this browser.")) {
      state = normalizeState(clone(defaultData));
      saveState();
      render();
    }
  });

  els.importFile.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      state = normalizeState({ ...clone(defaultData), ...JSON.parse(await file.text()) });
      saveState();
      render();
    } catch {
      alert("This JSON backup could not be imported.");
    }
  });
}

attachEvents();
render();
showWelcomeIfNeeded();
saveState();
setInterval(saveState, 30000);

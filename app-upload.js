const STORAGE_KEY = "proposalBuilderA4DraftUploadVersion";
const RELEASE_VERSION = "4.8.2";
const APP_VERSION = `v${RELEASE_VERSION} - Offline Access Patch`;
const SCHEMA_VERSION = "4.7.0";
const CHECKPOINT_KEY = `${STORAGE_KEY}:checkpoints`;
const FEEDBACK_KEY = `${STORAGE_KEY}:appFeedback`;
const UI_STATE_KEY = `${STORAGE_KEY}:ui:v4.8`;
const MAX_CHECKPOINTS = 5;
const IDLE_MS = 120000;
const APP_CREDIT = "Developed by J. Arawiran with assistance from OpenAI Codex, GPT-5-based coding assistant, June 2026.";
const WELCOME_KEY = `${STORAGE_KEY}:welcome:v4.8.2-offline`;
const SRQ_LIMITS = {
  minimum: 2,
  preferredMaximum: 5,
  maximum: 7
};
const PQF_REFERENCE = "PQF-NCC Resolution 2026-02";
const PQF_NOTE = "This is a formative guide, not official PQF certification. Verify current PQF issuances through official institutional or government sources.";
const STANDARD_PATTERN_TYPES = ["Context", "Method", "Theory", "Evidence", "Practice", "Population", "Definition"];
const CONTRIBUTION_LEVELS = [
  ["", "Choose a contribution level"],
  ["insufficient", "Not enough information to assess"],
  ["none", "No observable contribution"],
  ["limited", "Limited contribution"],
  ["agreed", "Completed agreed responsibility"],
  ["substantial", "Substantial contribution"]
];
const CONTRIBUTION_BEHAVIORS = [
  ["contributedWork", "Contributed work"],
  ["keptOnTrack", "Kept the team on track"],
  ["supportedQuality", "Supported quality"],
  ["interactedConstructively", "Interacted constructively"],
  ["appliedKnowledge", "Applied relevant knowledge or skill"]
];
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
const methodologyDesigns = {
  quantitative: [
    ["descriptive", "Descriptive quantitative"],
    ["correlational", "Correlational"],
    ["comparative", "Comparative"],
    ["predictive", "Predictive / regression"],
    ["experimental", "Experimental"],
    ["quasiExperimental", "Quasi-experimental"]
  ],
  qualitative: [
    ["qualitativeDescriptive", "Qualitative descriptive / basic qualitative"],
    ["phenomenology", "Phenomenology"],
    ["caseStudy", "Case study"],
    ["narrativeInquiry", "Narrative inquiry"],
    ["groundedTheory", "Grounded theory"],
    ["ethnography", "Ethnography"]
  ],
  mixed: [
    ["convergent", "Convergent mixed methods"],
    ["explanatorySequential", "Explanatory sequential mixed methods"],
    ["exploratorySequential", "Exploratory sequential mixed methods"],
    ["embedded", "Embedded mixed methods"],
    ["multiphase", "Multiphase mixed methods"]
  ]
};
const designGuidance = {
  descriptive: ["Describes levels, profiles, frequencies, or conditions numerically.", "Requires clearly defined variables, suitable measures, and an appropriate sample.", "Consider qualitative descriptive if meanings or detailed accounts matter more than numeric estimates."],
  correlational: ["Examines the direction or strength of relationships among measured variables.", "Requires variables that can be measured defensibly and assumptions appropriate to the selected statistic.", "It does not by itself establish causation."],
  comparative: ["Compares outcomes or conditions across existing groups or categories.", "Requires a defensible grouping basis and comparable evidence from each group.", "Clarify whether the design is descriptive-comparative or causal-comparative."],
  predictive: ["Estimates how one or more factors predict an outcome.", "Requires adequate sample size, defensible measures, and regression assumptions.", "Consider correlational design if prediction is not actually intended."],
  experimental: ["Tests an intervention through deliberate manipulation and strong control, usually including random assignment.", "Requires ethical and practical ability to assign conditions and control competing explanations.", "Use quasi-experimental when random assignment is not feasible."],
  quasiExperimental: ["Tests change or group differences around an intervention without full random assignment.", "Requires comparison logic, baseline or pretest planning where suitable, and attention to alternative explanations.", "Consider action research when local improvement, not causal estimation, is the main purpose."],
  qualitativeDescriptive: ["Provides a close, accessible description of perceptions, practices, events, or processes.", "Requires information-rich participants or sources and a transparent qualitative analysis process.", "Consider phenomenology only when lived experience and its meaning are the central focus."],
  phenomenology: ["Examines the meaning and structure of a shared lived experience.", "Requires participants who experienced the phenomenon and rich first-person accounts.", "It is not a general label for every interview study."],
  caseStudy: ["Investigates a bounded case in depth using multiple sources of evidence.", "Requires a clearly bounded case, context, period, and evidence-source plan.", "Consider qualitative descriptive if there is no defensible case boundary."],
  narrativeInquiry: ["Examines stories, experience over time, and how participants make meaning through narrative.", "Requires narrative data and attention to chronology, context, and researcher-participant relationships.", "Use phenomenology if the goal is a shared essence rather than individual stories."],
  groundedTheory: ["Develops an explanatory process or theory grounded in systematically analyzed data.", "Requires iterative sampling, constant comparison, memoing, and sufficient theoretical depth.", "Do not select it merely because the intended output is called a model."],
  ethnography: ["Examines shared meanings and practices within a culture-sharing group.", "Usually requires sustained engagement, observation, and cultural interpretation.", "Consider case study when the emphasis is a bounded institution rather than culture."],
  convergent: ["Collects quantitative and qualitative evidence in a similar period and integrates results for comparison.", "Requires both strands to address related aspects and an explicit integration strategy.", "Explain how differences or convergence will be interpreted."],
  explanatorySequential: ["Uses quantitative findings first, then qualitative evidence to explain selected results.", "Requires a clear rule for choosing follow-up participants or findings and connecting the phases.", "Use exploratory sequential when qualitative exploration should come first."],
  exploratorySequential: ["Uses qualitative exploration first, then quantitative work to test, measure, or extend findings.", "Requires an explicit process for building the second phase from the first.", "This may fit instrument or model development when validation is planned."],
  embedded: ["Places a secondary evidence strand inside a larger primary design.", "Requires a clear primary design and a distinct purpose for the embedded strand.", "Clarify when and how the strands connect."],
  multiphase: ["Coordinates multiple linked studies or phases toward a larger program goal.", "Requires a feasible sequence, resources, and explicit integration across phases.", "This is usually too extensive for a short student project unless tightly scoped."]
};
const uploadStageIds = ["a1", "a2", "a3"];
let uploadTargetStage = "a1";
let pendingUploadByStage = { a1: null, a2: null, a3: null };
let pdfjsModule = null;
let activePreviewMode = "final";
let activeProgressPrint = null;
let openPhaseMenuId = "";

const stages = [
  { id: "details", code: "Info", title: "Student Details" },
  { id: "a1", code: "A1", title: "Core Construct Identification" },
  { id: "a2", code: "A2", title: "Deepened Review and Pattern Mapping" },
  { id: "a3", code: "A3", title: "From Patterns to Gaps" },
  { id: "a4", code: "A4", title: "Literature-Based Problem and Questions" },
  { id: "framework", code: "F", title: "Framework Finder and Alignment" },
  { id: "methodology", code: "M", title: "Methodology Builder" },
  { id: "ethics", code: "E", title: "Ethical Considerations" },
  { id: "instrumentation", code: "I", title: "Instrumentation Builder" },
  { id: "terms", code: "D", title: "Definition of Terms" },
  { id: "outline", code: "O", title: "Proposal Outline Generator" },
  { id: "researchLevel", code: "L", title: "Research Level Justification" },
  { id: "readiness", code: "R", title: "Proposal Readiness Check" },
  { id: "submission", code: "PDF", title: "PDF Submission Generation" }
];

const journeyPhases = [
  { id: "foundations", label: "Foundations", stages: ["details", "a1", "a2", "a3", "a4"] },
  { id: "studyDesign", label: "Study Design", stages: ["framework", "methodology", "ethics", "instrumentation"] },
  { id: "proposalPreparation", label: "Proposal Preparation", stages: ["terms", "outline"] },
  { id: "readinessSubmission", label: "Readiness & Submission", stages: ["researchLevel", "readiness", "submission"] }
];

const focusedStageCopy = {
  details: { eyebrow: "Before you begin", title: "Tell us about this research work.", support: "These details identify your submission and help the app tailor its guidance." },
  a1: { eyebrow: "Begin with a working idea", title: "Build a clear core construct.", support: "Move from an initial topic to the one construct that will anchor the literature review." },
  a2: { eyebrow: "Look across the literature", title: "Map the patterns that repeat across studies.", support: "Work across articles rather than summarizing one study at a time." },
  a3: { eyebrow: "Turn patterns into gaps", title: "Identify what the literature leaves less visible.", support: "Follow the reasoning chain from what studies show to what cannot yet be understood." },
  a4: { eyebrow: "Move from gap to questions", title: "Build a literature-based problem and aligned questions.", support: "Carry the A3 gap forward, then unpack one broad question into answerable parts." },
  framework: { eyebrow: "Find possible explanations", title: "Find and test frameworks that genuinely help.", support: "Compare literature-supported candidates before selecting and explaining their role." },
  methodology: { eyebrow: "Choose how the study will build evidence", title: "Design a method that can answer the questions.", support: "Start with the broad evidence approach, then make each methodological choice explicit." },
  ethics: { eyebrow: "Plan safeguards as part of the design", title: "Protect participants, data, and relationships.", support: "Work from participant type and risk toward the safeguards and permissions that may apply." },
  instrumentation: { eyebrow: "Plan how each question will be answered", title: "Build a complete question-to-evidence chain.", support: "For each SRQ, connect the intended claim to evidence, source, instrument, and analysis." },
  terms: { eyebrow: "Define terms as they are used in this study", title: "Write precise operational definitions.", support: "Define one important term at a time and connect it to how the study will identify or measure it." },
  outline: { eyebrow: "Assemble the proposal from your work", title: "Review the proposal structure.", support: "The app has placed your work into expected sections. Review the structure without treating it as a finished manuscript." },
  researchLevel: { eyebrow: "Show the reasoning behind the proposal", title: "Explain the degree-level evidence in your decisions.", support: "Use your own words to show coherence, judgment, alternatives, contribution, and independence." },
  readiness: { eyebrow: "Review the proposal before sharing it", title: "Strengthen the first important alignment issue.", support: "Review one evidence-based warning at a time, then return directly to the part that needs attention." },
  submission: { eyebrow: "Prepare a copy for review", title: "Choose what you would like to prepare.", support: "Select a progress copy, cumulative submission, or clean final proposal." }
};

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
    ["purpose", "What is the purpose of the study?", "State whether the study aims to describe a condition, understand an experience, test an intervention, compare groups, or improve classroom practice."],
    ["evidenceSources", "Who or what can provide the evidence needed?", "Separate participants from documents, records, artifacts, outputs, observations, recordings, or test results."],
    ["studyPeriod", "What period will the study cover?", "State the data collection period, academic term, document years, or other time boundary."],
    ["operationalDelimitations", "What will the study include, and what will it deliberately not cover?", "State boundaries for participants, research environment or setting, period, evidence sources, procedures, and inclusion or exclusion decisions."]
  ],
  framework: [
    ["theoryModel", "What framework or combination of frameworks will guide the study?", "Name the selected framework or complementary combination. Do not combine frameworks merely because several seem relevant."],
    ["problemConnection", "How does the selected framework or combination explain the literature-based problem?", "Explain how each selected framework helps make sense of the gap, problem, construct, relationship, or phenomenon."],
    ["questionConnection", "How does the selected framework or combination connect to the central and specific questions?", "Show how each framework guides what the study asks."],
    ["instrumentConnection", "How will the selected framework or combination inform evidence, instruments, analysis, or interpretation?", "Connect each framework to what will be measured, observed, coded, compared, analyzed, or interpreted."],
    ["scopeBoundaries", "What is the conceptual scope of the study?", "State the constructs and relationships included, those excluded, and the theoretical boundaries that keep the explanation focused."]
  ],
  frameworkFinder: [
    ["literatureSignals", "Find: Which theories, models, concepts, or explanations appeared in your A2 literature?", "Look back at the Theory Pattern and supporting studies in A2. List what the authors used to explain the construct, problem, behavior, experience, relationship, system, or practice."],
    ["candidateFrameworks", "Compare: Which one to three candidate frameworks could help explain this study?", "For each literature-supported candidate, identify what it explains and does not explain."],
    ["frameworkSource", "Source Check: What authoritative source supports each framework being considered?", "For every framework, give the author, year, and publication or complete reference actually consulted."],
    ["selectionReason", "Select: Why is the selected framework or combination more useful than the alternatives?", "Compare candidates against the gap, problem, constructs, and questions."],
    ["frameworkRoles", "Explain: What distinct role will each selected framework perform?", "For each framework, name the construct or relationship explained and the section, evidence, analysis, or interpretation it informs."],
    ["combinationReason", "If combining frameworks, why is one framework alone insufficient?", "Explain what each contributes that the other does not. Write Not applicable if only one is selected."],
    ["withoutFramework", "Test: What would be harder to explain or interpret without the selected framework or combination?", "Name the reasoning work performed. If removing it changes nothing, it may be decorative."],
    ["methodFit", "Test: How does the selected framework or combination fit the planned research design?", "Explain how the pairing is coherent in the questions, evidence, analysis, or interpretation."]
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
    conceptual: "State the general meaning based on literature and identify the author or authors and year of the definition you actually consulted.",
    operational: "Define exactly what the term means in this study.",
    measured: "Explain how this term will be measured, observed, identified, coded, or represented in an instrument."
  }
};

const defaultData = {
  currentStage: "details",
  startedAt: "",
  meta: { schemaVersion: SCHEMA_VERSION, sourceAppVersion: APP_VERSION, currentAppVersion: APP_VERSION, migratedFrom: "" },
  engagement: { workStartedAt: "", lastEditedAt: "", activeMs: 0, manualCheckpoints: 0 },
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
    questionIds: ["", "", ""],
    questionPurposes: ["", "", ""],
    questionFocuses: ["", "", ""],
    questionClaims: ["", "", ""],
    refinedGap: "",
    gapRevisionReason: "",
    centralFocus: "",
    studyComponents: "",
    centralPurpose: ""
  },
  methodology: {
    approach: "",
    design: "",
    actionResearch: "no",
    designJustification: "",
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
    draft: "",
    documents: {
      humanParticipants: "",
      capableAdults: "",
      minorsDirect: "",
      vulnerableParticipants: "",
      representativePermission: "",
      twoRepresentativeSignatures: "",
      studyTitle: "",
      coInvestigator: "",
      sponsor: "",
      inclusionCriteria: "",
      exclusionCriteria: "",
      expectedParticipants: "",
      participantActivities: "",
      participantTime: "",
      risks: "",
      riskMitigation: "",
      benefits: "",
      compensation: "",
      researchContact: "",
      childAgeRange: "",
      assentLanguage: ""
    }
  },
  instrumentation: {
    rows: [
      { questionId: "", rq: "", claimNeeded: "", evidenceNeeded: "", evidenceSource: "", instrument: "", analysis: "", description: "", purpose: "", validation: "", implementation: "" }
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
  teamContributions: {},
  submission: {
    degreeLevel: "master",
    workArrangement: "individual",
    adviserName: "",
    studentId: "",
    studentName: "",
    personalGroupReflection: "",
    personalDeclaration: false,
    sourceCopyHistory: [],
    groupName: "",
    groupLeader: { id: "", name: "", initialReadiness: "", confidence: "", readinessChange: "" },
    groupMembers: []
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
let checkpoints = loadCheckpoints();
let appFeedback = loadAppFeedback();
let uiState = loadUiState();
let lastInteractionAt = Date.now();
let lastActiveTickAt = Date.now();

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
  welcomeDialog: document.getElementById("welcomeDialog"),
  activeWorkText: document.getElementById("activeWorkText"),
  migrationNotice: document.getElementById("migrationNotice"),
  historyDialog: document.getElementById("historyDialog"),
  checkpointList: document.getElementById("checkpointList"),
  stageFeedbackForm: document.getElementById("stageFeedbackForm")
  ,updateNotice: document.getElementById("updateNotice")
  ,phaseJourney: document.getElementById("phaseJourney")
  ,stageBreadcrumb: document.getElementById("stageBreadcrumb")
  ,stageTaskCounter: document.getElementById("stageTaskCounter")
  ,taskEyebrow: document.getElementById("taskEyebrow")
  ,taskSupport: document.getElementById("taskSupport")
  ,taskRail: document.getElementById("taskRail")
  ,allTaskList: document.getElementById("allTaskList")
  ,allTasksTitle: document.getElementById("allTasksTitle")
  ,autosaveStatus: document.getElementById("autosaveStatus")
  ,statusActiveWorkText: document.getElementById("statusActiveWorkText")
  ,phaseMenu: document.getElementById("phaseMenu")
  ,appCitationVersion: document.getElementById("appCitationVersion")
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadUiState() {
  try {
    const saved = JSON.parse(localStorage.getItem(UI_STATE_KEY) || "{}");
    return {
      tasks: saved.tasks && typeof saved.tasks === "object" ? saved.tasks : {},
      showAll: saved.showAll && typeof saved.showAll === "object" ? saved.showAll : {}
    };
  } catch {
    return { tasks: {}, showAll: {} };
  }
}

function saveUiState() {
  try {
    localStorage.setItem(UI_STATE_KEY, JSON.stringify(uiState));
  } catch {
    // UI position is expendable; proposal data remains the source of truth.
  }
}

function activeJourneyPhase(stageId = state.currentStage) {
  return journeyPhases.find((phase) => phase.stages.includes(stageId)) || journeyPhases[0];
}

function activeTaskIndex(stageId = state.currentStage, taskCount = Number.POSITIVE_INFINITY) {
  const stored = Number(uiState.tasks[stageId] || 0);
  return Math.max(0, Math.min(Number.isFinite(taskCount) ? taskCount - 1 : stored, stored));
}

function setActiveTask(stageId, index, taskCount) {
  uiState.tasks[stageId] = Math.max(0, Math.min(Math.max(0, taskCount - 1), Number(index) || 0));
  uiState.showAll[stageId] = false;
  saveUiState();
}

function createStableId(prefix = "item") {
  if (globalThis.crypto?.randomUUID) return `${prefix}-${globalThis.crypto.randomUUID()}`;
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return clone(defaultData);
  try {
    return JSON.parse(saved);
  } catch {
    return clone(defaultData);
  }
}

function loadCheckpoints() {
  try {
    const saved = JSON.parse(localStorage.getItem(CHECKPOINT_KEY) || "[]");
    return Array.isArray(saved) ? saved.slice(0, MAX_CHECKPOINTS) : [];
  } catch {
    return [];
  }
}

function loadAppFeedback() {
  try {
    const saved = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || "{}");
    return saved && typeof saved === "object" ? saved : {};
  } catch {
    return {};
  }
}

function inferSourceAppVersion(nextState) {
  if (nextState.meta?.sourceAppVersion) return nextState.meta.sourceAppVersion;
  if (nextState.frameworkFinder?.candidateFrameworks || nextState.frameworkFinder?.frameworkSource) return "v4.5.4 draft";
  if (nextState.researchLevel || nextState.submission?.degreeLevel) return "v4.5.3 or earlier v4 draft";
  return "Earlier v4 draft";
}

function normalizeStandardRows(rows, section) {
  const normalizedRows = (Array.isArray(rows) ? rows : []).map((row) => ({
    ...emptyRowFor(section),
    ...(row || {})
  }));
  STANDARD_PATTERN_TYPES.forEach((type) => {
    const exists = normalizedRows.some((row) => String(row.type || "").trim().toLowerCase() === type.toLowerCase());
    if (!exists) normalizedRows.push({ ...emptyRowFor(section), type });
  });
  return normalizedRows;
}

function normalizeState(nextState) {
  const normalized = { ...clone(defaultData), ...nextState };
  const sourceSchema = nextState.meta?.schemaVersion || "pre-4.5.5";
  normalized.meta = {
    ...clone(defaultData.meta),
    ...(nextState.meta || {}),
    schemaVersion: SCHEMA_VERSION,
    sourceAppVersion: inferSourceAppVersion(nextState),
    currentAppVersion: APP_VERSION,
    migratedFrom: sourceSchema === SCHEMA_VERSION ? (nextState.meta?.migratedFrom || "") : sourceSchema
  };
  normalized.engagement = { ...clone(defaultData.engagement), ...(nextState.engagement || {}) };
  normalized.a1 = { ...clone(defaultData.a1), ...(nextState.a1 || {}) };
  normalized.a2 = { ...clone(defaultData.a2), ...(nextState.a2 || {}) };
  normalized.a3 = { ...clone(defaultData.a3), ...(nextState.a3 || {}) };
  normalized.a4 = { ...clone(defaultData.a4), ...(nextState.a4 || {}) };
  normalized.framework = { ...clone(defaultData.framework), ...(nextState.framework || {}) };
  normalized.frameworkFinder = { ...clone(defaultData.frameworkFinder), ...(nextState.frameworkFinder || {}) };
  normalized.researchLevel = { ...clone(defaultData.researchLevel), ...(nextState.researchLevel || {}) };
  normalized.methodology = { ...clone(defaultData.methodology), ...(nextState.methodology || {}) };
  migrateMethodologySelection(normalized.methodology);
  normalized.mixedMethods = { ...clone(defaultData.mixedMethods), ...(nextState.mixedMethods || {}) };
  normalized.ethics = { ...clone(defaultData.ethics), ...(nextState.ethics || {}) };
  normalized.ethics.documents = { ...clone(defaultData.ethics.documents), ...(nextState.ethics?.documents || {}) };
  normalized.instrumentation = { ...clone(defaultData.instrumentation), ...(nextState.instrumentation || {}) };
  normalized.terms = { ...clone(defaultData.terms), ...(nextState.terms || {}) };
  normalized.outline = { ...clone(defaultData.outline), ...(nextState.outline || {}) };
  normalized.teamContributions = normalizeContributionRecords(nextState.teamContributions || {});
  normalized.submission = { ...clone(defaultData.submission), ...(nextState.submission || {}) };
  if (!normalized.submission.degreeLevel) normalized.submission.degreeLevel = "master";
  if (!normalized.submission.workArrangement) normalized.submission.workArrangement = "individual";
  normalized.submission.groupLeader = normalizeGroupPerson(normalized.submission.groupLeader, "leader");
  if (!Array.isArray(normalized.submission.groupMembers)) normalized.submission.groupMembers = [];
  normalized.submission.groupMembers = normalized.submission.groupMembers.map((person) => normalizeGroupPerson(person, "member"));
  if (!Array.isArray(normalized.submission.sourceCopyHistory)) normalized.submission.sourceCopyHistory = [];
  if (normalized.submission.workArrangement === "group" && !normalized.submission.studentId) {
    const previousOwner = normalized.submission.groupLeader;
    normalized.submission.studentId = previousOwner.id;
    normalized.submission.studentName = normalized.submission.studentName || previousOwner.name;
    normalized.submission.initialReadiness = normalized.submission.initialReadiness || previousOwner.initialReadiness || "";
    normalized.submission.confidence = normalized.submission.confidence || previousOwner.confidence || "";
    normalized.submission.readinessChange = normalized.submission.readinessChange || previousOwner.readinessChange || "";
  }
  normalized.a2.patterns = normalizeStandardRows(normalized.a2.patterns, "a2Patterns");
  normalized.a3.gaps = normalizeStandardRows(normalized.a3.gaps, "a3Gaps");
  if (!Array.isArray(normalized.a4.questions)) normalized.a4.questions = ["", "", ""];
  if (!Array.isArray(normalized.a4.questionIds)) normalized.a4.questionIds = [];
  normalized.a4.questionIds = normalized.a4.questions.map((_, index) => normalized.a4.questionIds[index] || createStableId("srq"));
  if (!Array.isArray(normalized.a4.questionPurposes)) normalized.a4.questionPurposes = [];
  normalized.a4.questionPurposes = normalized.a4.questions.map((_, index) => normalized.a4.questionPurposes[index] || "");
  if (!Array.isArray(normalized.a4.questionFocuses)) normalized.a4.questionFocuses = [];
  if (!Array.isArray(normalized.a4.questionClaims)) normalized.a4.questionClaims = [];
  normalized.a4.questionFocuses = normalized.a4.questions.map((_, index) => normalized.a4.questionFocuses[index] || "");
  normalized.a4.questionClaims = normalized.a4.questions.map((_, index) => normalized.a4.questionClaims[index] || "");
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
    questionId: row.questionId || "",
    rq: row.rq || "",
    claimNeeded: row.claimNeeded || "",
    evidenceNeeded: row.evidenceNeeded || row.data || "",
    evidenceSource: row.evidenceSource || row.source || "",
    instrument: row.instrument || "",
    analysis: row.analysis || "",
    description: row.description || row.data || "",
    purpose: row.purpose || row.sample || "",
    validation: row.validation || "",
    implementation: row.implementation || ""
  };
}

function migrateMethodologySelection(methodology) {
  if (methodology.approach && methodology.design) {
    methodology.selectedDesign = methodologyDisplayName(methodology.approach, methodology.design, methodology.actionResearch === "yes");
    return;
  }
  const old = String(methodology.selectedDesign || "").toLowerCase();
  const mappings = [
    ["descriptive quantitative", "quantitative", "descriptive"], ["correlational", "quantitative", "correlational"],
    ["comparative", "quantitative", "comparative"], ["predictive", "quantitative", "predictive"],
    ["quasi-experimental", "quantitative", "quasiExperimental"], ["phenomenology", "qualitative", "phenomenology"],
    ["case study", "qualitative", "caseStudy"], ["narrative", "qualitative", "narrativeInquiry"],
    ["basic qualitative", "qualitative", "qualitativeDescriptive"], ["mixed methods", "mixed", "convergent"]
  ];
  const match = mappings.find(([needle]) => old.includes(needle));
  if (match) {
    methodology.approach = match[1];
    methodology.design = match[2];
  }
  if (old.includes("action research")) methodology.actionResearch = "yes";
}

function normalizeGroupPerson(person = {}, role = "member") {
  return {
    ...person,
    id: person.id || createStableId(role),
    name: person.name || "",
    initialReadiness: person.initialReadiness || "",
    confidence: person.confidence || "",
    readinessChange: person.readinessChange || ""
  };
}

function normalizeContributionAssessment(assessment = {}) {
  return {
    level: assessment.level || "",
    behaviors: Array.isArray(assessment.behaviors) ? assessment.behaviors.filter((item) => CONTRIBUTION_BEHAVIORS.some(([key]) => key === item)) : [],
    evidence: assessment.evidence || "",
    context: assessment.context || ""
  };
}

function normalizeContributionRecords(records = {}) {
  return Object.fromEntries(Object.entries(records).map(([stageId, record]) => [stageId, {
    stageId,
    rosterSnapshot: Array.isArray(record?.rosterSnapshot) ? record.rosterSnapshot.map((person) => ({
      id: person.id || createStableId("roster"),
      name: person.name || "",
      role: person.role || "member"
    })) : [],
    assessments: Object.fromEntries(Object.entries(record?.assessments || {}).map(([personId, assessment]) => [personId, normalizeContributionAssessment(assessment)])),
    updatedAt: record?.updatedAt || ""
  }]));
}

function isAcademicStage(stageId) {
  return stages.some((stage) => stage.id === stageId) && !["details", "submission"].includes(stageId);
}

function groupRoster() {
  if (state.submission.workArrangement !== "group") return [];
  return [
    { ...state.submission.groupLeader, role: "leader" },
    ...state.submission.groupMembers.map((person) => ({ ...person, role: "member" }))
  ].filter((person) => person.id);
}

function contributionRecord(stageId) {
  if (!state.teamContributions[stageId]) {
    state.teamContributions[stageId] = { stageId, rosterSnapshot: [], assessments: {}, updatedAt: "" };
  }
  const record = state.teamContributions[stageId];
  const roster = groupRoster();
  const known = new Set(record.rosterSnapshot.map((person) => person.id));
  roster.forEach((person) => {
    if (!known.has(person.id)) record.rosterSnapshot.push({ id: person.id, name: person.name || "", role: person.role });
    if (!record.assessments[person.id]) record.assessments[person.id] = normalizeContributionAssessment();
  });
  record.updatedAt = record.updatedAt || new Date().toISOString();
  return record;
}

function contributionAssessmentMissing(assessment = {}) {
  const missing = [];
  if (!assessment.level) missing.push("contribution level");
  if (["none", "substantial"].includes(assessment.level) && !String(assessment.evidence || "").trim()) missing.push("factual evidence for the selected level");
  return missing;
}

function renderTeamContributionRecord(stageId) {
  if (!isAcademicStage(stageId) || state.submission.workArrangement !== "group") return "";
  const record = contributionRecord(stageId);
  const ownerId = state.submission.studentId;
  const roster = record.rosterSnapshot;
  const card = (person, index) => {
    const assessment = record.assessments[person.id] || normalizeContributionAssessment();
    const isSelf = person.id === ownerId;
    const prefix = `contribution-${stageId}-${person.id}`;
    return `<section class="contribution-card">
      <h4>${isSelf ? "Your contribution" : `Group member: ${escapeHtml(person.name || `Member ${index + 1}`)}`}</h4>
      <label for="${prefix}-level">Contribution level</label>
      <select id="${prefix}-level" data-contribution-stage="${escapeHtml(stageId)}" data-contribution-person="${escapeHtml(person.id)}" data-contribution-key="level">
        ${CONTRIBUTION_LEVELS.map(([key, label]) => `<option value="${escapeHtml(key)}" ${assessment.level === key ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}
      </select>
      <fieldset class="contribution-behaviors">
        <legend>Observable contributions</legend>
        ${CONTRIBUTION_BEHAVIORS.map(([key, label]) => `<label><input type="checkbox" data-contribution-stage="${escapeHtml(stageId)}" data-contribution-person="${escapeHtml(person.id)}" data-contribution-behavior="${escapeHtml(key)}" ${assessment.behaviors.includes(key) ? "checked" : ""}> ${escapeHtml(label)}</label>`).join("")}
      </fieldset>
      <label for="${prefix}-evidence">Brief factual evidence</label>
      <textarea id="${prefix}-evidence" data-contribution-stage="${escapeHtml(stageId)}" data-contribution-person="${escapeHtml(person.id)}" data-contribution-key="evidence" placeholder="Describe observable actions or submitted work for this part.">${escapeHtml(assessment.evidence)}</textarea>
      <label for="${prefix}-context">Context or concern <span class="hint">(optional)</span></label>
      <textarea id="${prefix}-context" data-contribution-stage="${escapeHtml(stageId)}" data-contribution-person="${escapeHtml(person.id)}" data-contribution-key="context" placeholder="Add context without inferring motives or personality.">${escapeHtml(assessment.context)}</textarea>
    </section>`;
  };
  return `<details class="team-contribution-panel">
    <summary>Confidential Team Contribution Record <span class="confidential-label">For Adviser Review Only</span></summary>
    <div class="team-contribution-content">
      <p class="hint">Complete this record for ${escapeHtml(stages.find((stage) => stage.id === stageId)?.code || stageId)}. The app stores the responses but does not score, rank, interpret, or adjust grades.</p>
      <p class="privacy-note">Use “Not enough information to assess” when appropriate. Describe observable behavior, submitted work, or evidence rather than motives.</p>
      ${roster.length ? roster.map(card).join("") : `<p class="hint">Add the group roster in Student Details first.</p>`}
    </div>
  </details>`;
}

function normalizeTermRow(row = {}) {
  return {
    term: row.term || row.keyTerms || "",
    conceptual: row.conceptual || row.conceptualDefinitions || "",
    operational: row.operational || row.operationalDefinitions || "",
    measured: row.measured || row.measurementObservation || ""
  };
}

function saveState(updateUi = true) {
  state.meta.schemaVersion = SCHEMA_VERSION;
  state.meta.currentAppVersion = APP_VERSION;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    alert("The current draft could not be saved because browser storage is full. Download a backup before continuing.");
  }
  if (updateUi) updateDashboard();
}

function saveCheckpoints() {
  try {
    localStorage.setItem(CHECKPOINT_KEY, JSON.stringify(checkpoints));
    return true;
  } catch {
    if (checkpoints.length > 1) {
      checkpoints.pop();
      try {
        localStorage.setItem(CHECKPOINT_KEY, JSON.stringify(checkpoints));
        alert("Browser storage is nearly full. The oldest checkpoint was removed. Download a backup to preserve a portable copy of your work.");
        return true;
      } catch {
        // The current draft remains untouched even when checkpoint storage fails.
      }
    }
    alert("A checkpoint could not be created. Download a backup to preserve your work.");
    return false;
  }
}

function overallCompletion() {
  return Math.round((stages.reduce((sum, stage) => sum + stageCompletion(stage.id), 0) / stages.length) * 100);
}

function academicSnapshot() {
  const snapshot = clone(state);
  delete snapshot.engagement;
  return snapshot;
}

function createCheckpoint(label = "", kind = "manual") {
  checkpoints.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    label: String(label || "").trim(),
    kind,
    stage: state.currentStage,
    completion: overallCompletion(),
    appVersion: APP_VERSION,
    schemaVersion: SCHEMA_VERSION,
    data: academicSnapshot()
  });
  checkpoints = checkpoints.slice(0, MAX_CHECKPOINTS);
  if (!saveCheckpoints()) return false;
  if (kind === "manual") state.engagement.manualCheckpoints += 1;
  saveState();
  return true;
}

function restoreCheckpoint(id) {
  const selected = checkpoints.find((checkpoint) => checkpoint.id === id);
  if (!selected) return;
  createCheckpoint("Before checkpoint restore", "recovery");
  const preservedEngagement = clone(state.engagement);
  state = normalizeState({ ...clone(selected.data), engagement: preservedEngagement });
  markContentEdit();
  saveState();
  render();
  renderCheckpointHistory();
  alert("Checkpoint restored. The version from before restoration remains available in Draft History.");
}

function markInteraction() {
  lastInteractionAt = Date.now();
}

function markContentEdit() {
  const now = new Date().toISOString();
  if (!state.engagement.workStartedAt) state.engagement.workStartedAt = now;
  state.engagement.lastEditedAt = now;
  markInteraction();
}

function tickActiveTime() {
  const now = Date.now();
  const delta = now - lastActiveTickAt;
  lastActiveTickAt = now;
  if (!state.engagement.workStartedAt || document.hidden || now - lastInteractionAt > IDLE_MS) return;
  if (delta < 0 || delta > 60000) return;
  state.engagement.activeMs += delta;
  saveState(false);
  updateActiveTimeDisplay();
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
  markContentEdit();
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

function formatActiveTime(milliseconds = 0) {
  const totalMinutes = Math.max(0, Math.round(Number(milliseconds || 0) / 60000));
  if (totalMinutes < 1) return "Less than 1 minute";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return [hours ? `${hours} hour${hours === 1 ? "" : "s"}` : "", minutes ? `${minutes} minute${minutes === 1 ? "" : "s"}` : ""].filter(Boolean).join(", ");
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
  els.stageNav.innerHTML = journeyPhases.map((phase) => `
    <section class="stage-group">
      <h3>${escapeHtml(phase.label)}</h3>
      ${phase.stages.map((stageId) => {
        const stage = stages.find((item) => item.id === stageId);
        const done = stageCompletion(stage.id) > 0.55 ? "done" : "";
        const active = state.currentStage === stage.id ? "active" : "";
        const index = stages.findIndex((item) => item.id === stage.id);
        return `<button class="stage-tab ${active}" type="button" data-stage="${stage.id}" title="Step ${index + 1}: ${stage.title}">
          <span class="stage-code">${stage.code}</span>
          <span class="stage-label"><small>Step ${index + 1}</small>${stage.title}</span>
          <span class="status-dot ${done}" aria-hidden="true"></span>
        </button>`;
      }).join("")}
    </section>`).join("");
}

function renderPhaseJourney() {
  if (!els.phaseJourney) return;
  const active = activeJourneyPhase();
  els.phaseJourney.innerHTML = journeyPhases.map((phase, index) => {
    const completed = phase.stages.every((stageId) => stageCompletion(stageId) > 0.55);
    const expanded = openPhaseMenuId === phase.id;
    return `<button type="button" class="phase-step ${phase.id === active.id ? "active" : ""} ${completed ? "complete" : ""}" data-phase="${phase.id}" aria-expanded="${expanded}" aria-controls="phaseMenu">
      <span class="phase-number">${completed ? "&#10003;" : index + 1}</span>
      <span>${escapeHtml(phase.label)}</span>
    </button>`;
  }).join("");
}

function renderPhaseMenu() {
  if (!els.phaseMenu) return;
  const phase = journeyPhases.find((item) => item.id === openPhaseMenuId);
  if (!phase) {
    els.phaseMenu.hidden = true;
    els.phaseMenu.innerHTML = "";
    return;
  }
  els.phaseMenu.innerHTML = `<div class="phase-menu-heading">${escapeHtml(phase.label)}</div>${phase.stages.map((stageId) => {
    const stage = stages.find((item) => item.id === stageId);
    const stageIndex = stages.findIndex((item) => item.id === stageId);
    const active = state.currentStage === stageId;
    const completed = stageCompletion(stageId) > 0.55;
    return `<button type="button" class="phase-menu-item ${active ? "active" : ""}" role="menuitem" data-stage="${stageId}" ${active ? 'aria-current="step"' : ""}>
      <span class="phase-menu-code">${escapeHtml(stage.code)}</span>
      <span class="phase-menu-copy"><small>Step ${stageIndex + 1}</small><strong>${escapeHtml(stage.title)}</strong></span>
      <span class="phase-menu-status ${completed ? "done" : ""}" aria-label="${completed ? "Started or completed" : "Not yet started"}"></span>
    </button>`;
  }).join("")}`;
  els.phaseMenu.hidden = false;
  requestAnimationFrame(positionPhaseMenu);
}

function positionPhaseMenu() {
  if (!openPhaseMenuId || !els.phaseMenu || els.phaseMenu.hidden) return;
  const trigger = els.phaseJourney?.querySelector(`[data-phase="${openPhaseMenuId}"]`);
  if (!trigger) return;
  const rect = trigger.getBoundingClientRect();
  const width = Math.min(330, Math.max(260, window.innerWidth - 24));
  const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12));
  els.phaseMenu.style.width = `${width}px`;
  els.phaseMenu.style.left = `${left}px`;
  els.phaseMenu.style.top = `${Math.min(window.innerHeight - 12, rect.bottom + 8)}px`;
}

function closePhaseMenu({ restoreFocus = false } = {}) {
  const previousId = openPhaseMenuId;
  openPhaseMenuId = "";
  if (els.phaseMenu) {
    els.phaseMenu.hidden = true;
    els.phaseMenu.innerHTML = "";
  }
  els.phaseJourney?.querySelectorAll("[data-phase]").forEach((button) => button.setAttribute("aria-expanded", "false"));
  if (restoreFocus && previousId) els.phaseJourney?.querySelector(`[data-phase="${previousId}"]`)?.focus();
}

function togglePhaseMenu(phaseId) {
  if (openPhaseMenuId === phaseId) {
    closePhaseMenu();
    return;
  }
  openPhaseMenuId = phaseId;
  renderPhaseJourney();
  renderPhaseMenu();
}

function handlePhaseMenuKeydown(event) {
  const phaseTrigger = event.target.closest?.("[data-phase]");
  if (phaseTrigger && event.key === "ArrowDown") {
    event.preventDefault();
    openPhaseMenuId = phaseTrigger.dataset.phase;
    renderPhaseJourney();
    renderPhaseMenu();
    els.phaseMenu?.querySelector(".phase-menu-item")?.focus();
    return;
  }
  if (!openPhaseMenuId) return;
  if (event.key === "Escape") {
    event.preventDefault();
    closePhaseMenu({ restoreFocus: true });
    return;
  }
  if (!event.target.closest?.("#phaseMenu")) return;
  const items = Array.from(els.phaseMenu.querySelectorAll(".phase-menu-item"));
  const index = items.indexOf(document.activeElement);
  if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowDown") nextIndex = (index + 1 + items.length) % items.length;
    if (event.key === "ArrowUp") nextIndex = (index - 1 + items.length) % items.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = items.length - 1;
    items[nextIndex]?.focus();
  }
}

function render() {
  const stage = stages[currentIndex()];
  document.title = `Lit-Based Proposal Builder v${RELEASE_VERSION}`;
  if (els.appVersion) els.appVersion.textContent = APP_VERSION;
  if (els.appCredit) els.appCredit.textContent = APP_CREDIT;
  if (els.appCitationVersion) els.appCitationVersion.textContent = RELEASE_VERSION;
  els.currentStage.textContent = stage.code;
  renderPhaseJourney();
  renderPhaseMenu();
  renderNav();
  renderStage();
  syncStudentDetailsFields();
  updateStudentDetailsButtonVisibility();
  updateUploadButtonLabel();
  updateMemberCopyButtonVisibility();
  updateDashboard();
  renderMigrationNotice();
  renderStageFeedback();
  if (els.autosaveStatus) els.autosaveStatus.textContent = "Saved";
}

function renderMigrationNotice() {
  if (!els.migrationNotice) return;
  const migrated = state.meta.migratedFrom;
  const stageNeedsReview = {
    a4: !state.a4.centralFocus || !state.a4.studyComponents || state.a4.questionClaims.some((claim) => !claim),
    framework: !state.frameworkFinder.frameworkRoles || !state.frameworkFinder.combinationReason,
    methodology: !state.methodology.evidenceSources || !state.methodology.operationalDelimitations,
    instrumentation: state.instrumentation.rows.some((row) => !row.claimNeeded || !row.evidenceSource || !row.analysis)
  };
  const needsReview = Boolean(migrated && stageNeedsReview[state.currentStage]);
  els.migrationNotice.hidden = !needsReview;
  els.migrationNotice.innerHTML = needsReview
    ? `<strong>New fields need your review.</strong> This draft came from ${escapeHtml(state.meta.sourceAppVersion || migrated)}. Previous answers were preserved, but new semantic fields were left blank rather than inferred. Review and complete this section.`
    : "";
}

function semverParts(version = "") {
  return String(version).match(/\d+/g)?.slice(0, 3).map(Number) || [0, 0, 0];
}

function isNewerVersion(candidate, current) {
  const next = semverParts(candidate);
  const here = semverParts(current);
  for (let index = 0; index < 3; index += 1) {
    if ((next[index] || 0) > (here[index] || 0)) return true;
    if ((next[index] || 0) < (here[index] || 0)) return false;
  }
  return false;
}

async function checkForUpdates() {
  if (!els.updateNotice) return;
  try {
    const response = await fetch(`version.json?checked=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return;
    const release = await response.json();
    if (!release.version || !isNewerVersion(release.version, RELEASE_VERSION)) return;
    const notes = Array.isArray(release.notes) ? release.notes : [];
    els.updateNotice.hidden = false;
    els.updateNotice.innerHTML = `<div><strong>A newer version (${escapeHtml(release.version)}) is available.</strong><p>Your current draft will not reload or update automatically. Download a backup first.</p></div><div class="inline-actions"><button type="button" class="ghost compact" data-show-whats-new>What's New</button><button type="button" class="ghost compact" data-download-update-backup>Download Backup</button><a class="button-link compact" href="${escapeHtml(release.url || "./")}" target="_blank" rel="noopener">Open New Version</a></div><div class="update-notes" hidden>${notes.length ? `<ul>${notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>` : "<p>No release notes were provided.</p>"}</div>`;
  } catch {
    // Offline or malformed version checks never interrupt local work.
  }
}

function stageFeedbackEntry(stageId = state.currentStage) {
  return appFeedback[stageId] || { clarity: "", helpfulness: "", difficulty: "", confusion: "", suggestion: "", updatedAt: "" };
}

function renderStageFeedback() {
  if (!els.stageFeedbackForm) return;
  const item = stageFeedbackEntry();
  const ratingOptions = (selected) => ["", "1", "2", "3", "4", "5"].map((option) => `<option value="${option}" ${selected === option ? "selected" : ""}>${option || "Select"}</option>`).join("");
  els.stageFeedbackForm.innerHTML = `
    <div class="app-feedback-grid">
      <label>Clarity (1-5)<select data-app-feedback="clarity">${ratingOptions(item.clarity)}</select></label>
      <label>Helpfulness (1-5)<select data-app-feedback="helpfulness">${ratingOptions(item.helpfulness)}</select></label>
      <label>Difficulty<select data-app-feedback="difficulty">
        ${["", "Too easy", "Manageable", "Too difficult"].map((option) => `<option value="${option}" ${item.difficulty === option ? "selected" : ""}>${option || "Select"}</option>`).join("")}
      </select></label>
    </div>
    <div class="app-feedback-comments">
      <label>What confused you or felt unnecessary?<textarea data-app-feedback="confusion">${escapeHtml(item.confusion)}</textarea></label>
      <label>What would improve this step?<textarea data-app-feedback="suggestion">${escapeHtml(item.suggestion)}</textarea></label>
    </div>`;
}

function saveAppFeedbackField(key, nextValue) {
  const stageId = state.currentStage;
  appFeedback[stageId] = { ...stageFeedbackEntry(stageId), [key]: nextValue, updatedAt: new Date().toISOString() };
  try {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(appFeedback));
  } catch {
    alert("App feedback could not be saved because browser storage is full.");
  }
}

function renderCheckpointHistory() {
  if (!els.checkpointList) return;
  els.checkpointList.innerHTML = checkpoints.length ? checkpoints.map((checkpoint) => `
    <section class="checkpoint-item">
      <div>
        <p><strong>${escapeHtml(checkpoint.label || (checkpoint.kind === "recovery" ? "Recovery checkpoint" : "Draft checkpoint"))}</strong></p>
        <p>${escapeHtml(formatTimestamp(checkpoint.createdAt))} - ${escapeHtml(checkpoint.stage.toUpperCase())} - ${escapeHtml(String(checkpoint.completion))}% complete</p>
        <p class="hint">${escapeHtml(checkpoint.appVersion)} | schema ${escapeHtml(checkpoint.schemaVersion)}</p>
      </div>
      <button type="button" data-restore-checkpoint="${escapeHtml(checkpoint.id)}">Restore</button>
    </section>`).join("") : `<p>No manual checkpoints yet. Autosave still protects the latest version.</p>`;
}

function updateActiveTimeDisplay() {
  const fullText = state.engagement.workStartedAt ? formatActiveTime(state.engagement.activeMs) : "Not started";
  if (els.activeWorkText) {
    const totalMinutes = Math.max(0, Math.round(Number(state.engagement.activeMs || 0) / 60000));
    if (!state.engagement.workStartedAt) els.activeWorkText.textContent = "Not started";
    else if (totalMinutes < 60) els.activeWorkText.textContent = `${Math.max(1, totalMinutes)} min active`;
    else els.activeWorkText.textContent = `${Math.floor(totalMinutes / 60)} hr ${totalMinutes % 60} min active`;
  }
  if (els.statusActiveWorkText) els.statusActiveWorkText.textContent = fullText;
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

function updateMemberCopyButtonVisibility() {
  const button = document.getElementById("memberCopyBtn");
  if (!button) return;
  const memberCopyStages = ["a1", "a2", "a3", "a4", "framework", "methodology", "ethics", "instrumentation", "terms", "outline", "researchLevel"];
  button.hidden = state.submission.workArrangement !== "group" || !memberCopyStages.includes(state.currentStage);
}

function renderStage() {
  const id = state.currentStage;
  let result;
  if (id === "a1") result = renderA1();
  else if (id === "details") result = renderStudentDetailsStage();
  else if (id === "a2") result = renderA2();
  else if (id === "a3") result = renderA3();
  else if (id === "a4") result = renderA4();
  else if (id === "framework") result = renderFramework();
  else if (id === "researchLevel") result = renderResearchLevel();
  else if (id === "methodology") result = renderMethodology();
  else if (id === "ethics") result = renderEthics();
  else if (id === "instrumentation") result = renderInstrumentation();
  else if (id === "terms") result = renderTerms();
  else if (id === "outline") result = renderOutline();
  else if (id === "readiness") result = renderReadiness();
  else result = renderSubmission();
  if (isAcademicStage(id) && state.submission.workArrangement === "group") {
    els.stageForm.insertAdjacentHTML("beforeend", renderTeamContributionRecord(id));
  }
  applyFocusedStageLayout(id);
  return result;
}

function uniqueNodes(nodes = []) {
  return [...new Set(nodes.filter(Boolean))];
}

function focusWrapper(node) {
  if (!node) return null;
  if (node.matches?.("button")) return node;
  if (node.matches?.(".field, fieldset, .guided-step, .question-card, .table-row, .output-box, .checker-panel, .consent-preparation, .personal-declaration, .group-details, .source-copy-summary")) return node;
  return node.closest?.(".field, fieldset, .guided-step, .question-card, label, .table-row, .output-box, .checker-panel, .consent-preparation, .personal-declaration, .source-copy-summary, .group-details") || node;
}

function taskNodes(selectors = [], root = els.stageForm) {
  return uniqueNodes(selectors.flatMap((selector) => Array.from(root.querySelectorAll(selector)).map(focusWrapper)));
}

function fieldTask(section, key, label, title, support) {
  return {
    label,
    title: title || label,
    support: support || "Complete this part in your own words. You can revise it as the study becomes clearer.",
    items: taskNodes([`[data-section="${section}"][data-key="${key}"]`])
  };
}

function tableTask(section, index, label, title, support) {
  const control = els.stageForm.querySelector(`[data-table="${section}"][data-index="${index}"]`);
  const row = control?.closest(".table-row");
  return {
    label,
    title,
    support,
    roots: row ? [row] : [],
    items: row ? [row] : []
  };
}

function buildFocusedTasks(stageId) {
  const standardSupport = "Use the scaffold when needed, then write the answer in your own words.";
  if (stageId === "details") {
    const groupDetails = els.stageForm.querySelector(".group-details");
    return [
      { label: "Research context", title: "What kind of research work is this?", support: "Choose the degree or use context and whether this is individual or group work.", items: taskNodes(["[data-section=\"submission\"][data-key=\"degreeLevel\"]", "[data-work-arrangement]"]) },
      { label: "Student or group", title: "Who owns this copy?", support: "Identify the student completing this copy. For group work, add the shared roster first.", roots: groupDetails ? [groupDetails] : [], items: taskNodes(["[data-section=\"submission\"][data-key=\"studentName\"]", "[data-section=\"submission\"][data-key=\"groupName\"]", "[data-group-person-key]", "[data-copy-owner]", "[data-add-group-member]", ".source-copy-summary"]) },
      { label: "Course and adviser", title: "Where will this work be reviewed?", support: "Add the adviser, course, section, and required date.", items: taskNodes(["[data-section=\"submission\"][data-key=\"adviserName\"]", "[data-section=\"submission\"][data-key=\"course\"]", "[data-section=\"submission\"][data-key=\"section\"]", "[data-section=\"submission\"][data-key=\"submissionDate\"]"]) },
      { label: "Reflection and declaration", title: "What is your starting point?", support: "Record one personal reflection, then confirm that this copy and its confidential entries belong to you.", roots: groupDetails ? [groupDetails] : [], items: taskNodes(["[data-section=\"submission\"][data-key=\"initialReadiness\"]", "[data-section=\"submission\"][data-key=\"personalGroupReflection\"]", "[data-personal-declaration]"]) }
    ];
  }
  if (stageId === "a1") {
    return fieldSets.a1.map(([key, label, support], index) => fieldTask("a1", key, `A1.${index + 1}`, label, support));
  }
  if (stageId === "a2") {
    const rows = state.a2.patterns.map((row, index) => tableTask("a2Patterns", index, row.type || `Pattern ${index + 1}`, `What pattern appears across the studies?`, tableScaffolds.a2Patterns.notice));
    rows.push(fieldTask("a2", "synthesis", "Synthesis", "What do these patterns show together?", "Write a short synthesis across the mapped patterns, including what is well studied and what remains less developed."));
    return rows;
  }
  if (stageId === "a3") {
    const rows = state.a3.gaps.map((row, index) => tableTask("a3Gaps", index, row.type || `Gap chain ${index + 1}`, `Follow the ${row.type || "selected"} pattern to a defensible gap.`, "Move from what studies repeatedly show to what becomes less visible and what this prevents us from understanding."));
    rows.push(
      fieldTask("a3", "strongestGap", "Select", "Which gap is strongest?", "Choose the gap that is specific, consequential, researchable, and best supported by the mapped literature."),
      fieldTask("a3", "weakestGap", "Compare", "Which gap is weakest?", "Identify a weaker gap so you can compare the reasoning rather than accepting the first idea."),
      fieldTask("a3", "selectionReason", "Justify", "Why is the selected gap stronger?", "Explain why the chosen gap is more useful and defensible than the alternative."),
      fieldTask("a3", "finalGap", "Carry forward", "What final gap will guide A4?", "State the gap clearly enough that a research problem and questions can emerge from it.")
    );
    return rows;
  }
  if (stageId === "a4") {
    return Array.from(els.stageForm.querySelectorAll(".guided-step")).map((item, index) => ({
      label: `A4.${index + 1}`,
      title: item.querySelector("summary")?.textContent.replace(/^\d+\.\s*/, "") || `A4 task ${index + 1}`,
      support: "Complete this reasoning step before moving to the next part of the question structure.",
      roots: [item], items: [item]
    }));
  }
  if (stageId === "framework") {
    return [
      { label: "Find", title: "What possible frameworks appear in the literature?", support: "Return to A2 and list literature-supported candidates before committing to one.", items: taskNodes(["[data-section=\"frameworkFinder\"][data-key=\"pathway\"]", "[data-section=\"frameworkFinder\"][data-key=\"literatureSignals\"]"]) },
      { label: "Compare", title: "How do the candidates differ?", support: "Compare what each candidate explains, its source, and its limits.", items: taskNodes(["[data-section=\"frameworkFinder\"][data-key=\"candidateFrameworks\"]", "[data-section=\"frameworkFinder\"][data-key=\"frameworkSource\"]"]) },
      { label: "Select", title: "Which framework or combination fits best?", support: "Select only what is needed and explain why the alternatives fit less well.", items: taskNodes(["[data-section=\"frameworkFinder\"][data-key=\"selectionReason\"]", "[data-section=\"framework\"][data-key=\"theoryModel\"]"]) },
      { label: "Test", title: "Does the framework perform real work in the study?", support: "Test its connection to the problem, questions, design, evidence, analysis, and interpretation.", items: taskNodes(["[data-section=\"frameworkFinder\"][data-key=\"withoutFramework\"]", "[data-section=\"frameworkFinder\"][data-key=\"methodFit\"]", "[data-section=\"framework\"][data-key=\"problemConnection\"]", "[data-section=\"framework\"][data-key=\"questionConnection\"]", "[data-section=\"framework\"][data-key=\"instrumentConnection\"]"]) },
      { label: "Explain", title: "What distinct role does each framework perform?", support: "Explain the role, combination logic, and conceptual boundaries in language an adviser can review.", items: taskNodes(["[data-section=\"frameworkFinder\"][data-key=\"frameworkRoles\"]", "[data-section=\"frameworkFinder\"][data-key=\"combinationReason\"]", "[data-section=\"framework\"][data-key=\"scopeBoundaries\"]"]) }
    ];
  }
  if (stageId === "methodology") {
    return [
      { label: "Evidence approach", title: "What broad evidence approach can answer the questions?", support: "Compare quantitative, qualitative, and mixed methods using the A4 purposes, claims, and evidence needs.", items: taskNodes(["[data-section=\"methodology\"][data-key=\"rqTypes\"]", "[data-section=\"methodology\"][data-key=\"dataNeeded\"]", "[data-section=\"methodology\"][data-key=\"purpose\"]", "[data-methodology-selection=\"approach\"]", ".methodology-recommendation"]) },
      { label: "Design", title: "Which design within that approach may fit?", support: "Review requirements, assumptions, an alternative, and why the selected design fits better.", items: taskNodes(["[data-methodology-selection=\"design\"]", "[data-methodology-action]", "[data-section=\"methodology\"][data-key=\"designJustification\"]", ".design-guidance"]) },
      { label: "Participants and sources", title: "Who or what can provide the evidence?", support: "Keep participants separate from documents, artifacts, records, observations, and other evidence sources.", items: taskNodes(["[data-section=\"methodology\"][data-key=\"participants\"]", "[data-section=\"methodology\"][data-key=\"evidenceSources\"]"]) },
      { label: "Sampling", title: "How will participants or evidence sources be selected?", support: "Choose a defensible selection process that fits the design and the intended claims.", items: taskNodes(["[data-section=\"methodology\"][data-key=\"sampling\"]"]) },
      { label: "Environment and boundaries", title: "Where and within what boundaries will the study occur?", support: "Define the research environment, period, inclusion and exclusion decisions, and practical delimitations.", items: taskNodes(["[data-section=\"methodology\"][data-key=\"locale\"]", "[data-section=\"methodology\"][data-key=\"studyPeriod\"]", "[data-section=\"methodology\"][data-key=\"operationalDelimitations\"]"]) },
      { label: "Collection and analysis", title: "How will the evidence be collected and analyzed?", support: "Sequence the collection procedure and name the analysis that will produce the intended claim for each question.", items: taskNodes(["[data-section=\"methodology\"][data-key=\"collection\"]", "[data-section=\"methodology\"][data-key=\"analysis\"]", "[data-section=\"mixedMethods\"]"]) }
    ];
  }
  if (stageId === "ethics") {
    const ethicsChecklist = els.stageForm.querySelector("[data-ethics-check]")?.closest(".field");
    return [
      { label: "Participants", title: "Who may need additional protection?", support: "Identify minors, vulnerable groups, power relationships, and cultural or language considerations.", items: taskNodes(["[data-section=\"ethics\"][data-key=\"participantAge\"]", "[data-section=\"ethics\"][data-key=\"powerIssue\"]", "[data-section=\"ethics\"][data-key=\"cultureLanguage\"]"]) },
      { label: "Consent", title: "How will participation remain voluntary and informed?", support: "Explain consent, right to withdraw, assent when applicable, and how coercion will be prevented.", items: taskNodes(["[data-section=\"ethics\"][data-key=\"consentPlan\"]"]) },
      { label: "Privacy and data", title: "How will private information be protected?", support: "Plan confidentiality or anonymity, access, storage, retention, disposal, recording, and any AI-tool use.", items: taskNodes(["[data-section=\"ethics\"][data-key=\"dataPrivacy\"]", "[data-section=\"ethics\"][data-key=\"storagePlan\"]", "[data-section=\"ethics\"][data-key=\"recordingAiUse\"]"]) },
      { label: "Permissions", title: "What permissions and review may be required?", support: "Identify institutional permission and adviser or ERB review needed before recruitment or data collection.", items: taskNodes(["[data-section=\"ethics\"][data-key=\"permissions\"]"]) },
      { label: "Safeguards", title: "Which safeguards apply to this study?", support: "Select applicable safeguards and revise the draft Ethical Considerations section in future tense.", roots: ethicsChecklist ? [ethicsChecklist] : [], items: taskNodes(["[data-ethics-check]", "[data-section=\"ethics\"][data-key=\"draft\"]"]) },
      { label: "Consent documents", title: "Which consent, permission, or assent drafts may be needed?", support: "Use this preparation area only after the participant and permission decisions are clear. All outputs remain drafts for adviser and ERB review.", items: taskNodes([".consent-preparation"]) }
    ];
  }
  if (stageId === "instrumentation") {
    const tasks = [];
    Array.from(els.stageForm.querySelectorAll(".instrumentation-row")).forEach((row, rowIndex) => {
      const groups = [
        ["Claim", ["claimNeeded"]], ["Evidence", ["evidenceNeeded"]], ["Source", ["evidenceSource"]],
        ["Instrument", ["instrument", "description", "purpose"]], ["Analysis", ["analysis"]], ["Quality and use", ["validation", "implementation"]]
      ];
      groups.forEach(([label, keys]) => tasks.push({
        label: `Q${rowIndex + 1} · ${label}`,
        title: `${label} for Research Question ${rowIndex + 1}`,
        support: instrumentationScaffold(keys[0], state.a4.questionPurposes[rowIndex] || ""),
        roots: [row],
        context: Array.from(row.querySelectorAll(":scope > .output-box")),
        items: keys.flatMap((key) => taskNodes([`[data-table=\"instrumentation\"][data-index=\"${rowIndex}\"][data-key=\"${key}\"]`], row))
      }));
    });
    return tasks.length ? tasks : [{ label: "Begin in A4", title: "Add specific research questions first.", support: "Instrumentation cards are created automatically from the SRQs.", items: taskNodes([".empty-state"]) }];
  }
  if (stageId === "terms") {
    const tasks = [];
    Array.from(els.stageForm.querySelectorAll(".instrumentation-row")).forEach((row, rowIndex) => {
      [["Term", "term"], ["Conceptual", "conceptual"], ["Operational", "operational"], ["Evidence link", "measured"]].forEach(([label, key]) => tasks.push({
        label: `Term ${rowIndex + 1} · ${label}`,
        title: label === "Term" ? `Choose Term ${rowIndex + 1}` : `${label} definition for ${state.terms.rows[rowIndex]?.term || `Term ${rowIndex + 1}`}`,
        support: tableScaffolds.terms[key], roots: [row], context: Array.from(row.querySelectorAll(":scope > .output-box")),
        items: taskNodes([`[data-table=\"terms\"][data-index=\"${rowIndex}\"][data-key=\"${key}\"]`], row)
      }));
    });
    return tasks;
  }
  if (stageId === "outline") {
    const sectionTasks = Array.from(els.stageForm.querySelectorAll("[data-outline-section]")).map((item) => ({ label: item.dataset.outlineSection, title: `Review ${item.dataset.outlineSection}`, support: "Check whether the generated structure carries forward the right proposal elements. The outline is not a finished manuscript.", roots: [item], items: [item] }));
    sectionTasks.push(fieldTask("outline", "notes", "Local reminders", "What local format requirements should remain visible?", "Add only instructor, adviser, department, or institution-specific reminders that affect the outline."));
    return sectionTasks;
  }
  if (stageId === "researchLevel") {
    return fieldSets.researchLevel.map(([key, label, support], index) => fieldTask("researchLevel", key, `L.${index + 1}`, label, support));
  }
  if (stageId === "readiness") {
    const items = Array.from(els.stageForm.querySelectorAll(".feedback-item"));
    return items.length ? items.map((item, index) => ({ label: `Review ${index + 1}`, title: item.querySelector("strong")?.textContent || `Alignment review ${index + 1}`, support: "Read what was compared, why the issue matters, and where to revise. Discuss important decisions with your adviser.", roots: [item.closest(".checker-panel")], items: [item] })) : [{ label: "Summary", title: "Review proposal readiness", support: standardSupport, items: taskNodes([".output-box", ".checker-panel"]) }];
  }
  if (stageId === "submission") {
    const boxes = Array.from(els.stageForm.querySelectorAll(":scope > .output-box"));
    return boxes.map((box, index) => ({ label: ["Choose", "Progress PDF", "Final readiness", "Reflection"][index] || `Submission ${index + 1}`, title: box.querySelector("h3")?.textContent || "Prepare a submission", support: "Choose the output that matches the work you are ready to share for review.", roots: [box], items: [box] }));
  }
  return [{ label: "Current task", title: focusedStageCopy[stageId]?.title || "Continue this stage", support: standardSupport, items: Array.from(els.stageForm.children) }];
}

function applyFocusedStageLayout(stageId) {
  const tasks = buildFocusedTasks(stageId).filter((task) => task.items?.length || task.roots?.length);
  const contributionPanel = els.stageForm.querySelector(".team-contribution-panel");
  if (contributionPanel) tasks.push({
    label: "Team contribution",
    title: "Record observable contributions for this part.",
    support: "Complete the confidential self- and peer-assessment using factual evidence. The adviser, not the app, interprets these records.",
    roots: [contributionPanel],
    items: [contributionPanel]
  });
  if (!tasks.length) return;
  uiState.tasks[stageId] = Math.min(Math.max(0, Number(uiState.tasks[stageId] || 0)), tasks.length - 1);
  const activeIndex = uiState.tasks[stageId];
  const activeTask = tasks[activeIndex];
  const allItems = uniqueNodes(tasks.flatMap((task) => task.items || []));
  const allRoots = uniqueNodes(tasks.flatMap((task) => task.roots || []));
  allItems.forEach((node) => { node.hidden = true; node.classList.add("focus-task-item"); });
  allRoots.forEach((node) => { node.hidden = true; node.classList.add("focus-task-root"); });
  uniqueNodes([...(activeTask.roots || []), ...(activeTask.context || []), ...(activeTask.items || [])]).forEach((node) => { node.hidden = false; });
  (activeTask.items || []).forEach((node) => node.classList.add("is-current-task"));
  els.stageForm.querySelectorAll(".guided-step").forEach((item) => { item.open = !item.hidden; });
  els.stageForm.querySelectorAll(":scope > .output-box, :scope > .table-wrap > h3, :scope > .table-wrap > .hint").forEach((node) => {
    if (!node.closest(".focus-task-root") && !activeTask.items.includes(node) && !activeTask.context?.includes(node)) node.classList.add("focus-secondary-context");
  });
  renderFocusedStageChrome(tasks, activeIndex);
  saveUiState();
}

function focusedCollectionAction(stageId) {
  if (stageId === "a2") return { section: "a2Patterns", label: "+ Add pattern" };
  if (stageId === "a3") return { section: "a3Gaps", label: "+ Add gap row" };
  if (stageId === "terms") return { section: "terms", label: "+ Add term" };
  return null;
}

function renderFocusedStageChrome(tasks, activeIndex) {
  const stage = stages[currentIndex()];
  const phase = activeJourneyPhase();
  const copy = focusedStageCopy[stage.id] || {};
  const task = tasks[activeIndex];
  els.stageBreadcrumb.textContent = `${phase.label} · ${stage.title}`;
  els.stageTaskCounter.textContent = `Task ${activeIndex + 1} of ${tasks.length}`;
  els.taskEyebrow.textContent = task.label || copy.eyebrow || "Current task";
  els.stageTitle.textContent = task.title || copy.title || stage.title;
  els.taskSupport.textContent = task.support || copy.support || "Complete this task, then continue.";
  const collectionAction = focusedCollectionAction(stage.id);
  els.taskRail.innerHTML = `<div class="task-rail-heading"><span>${escapeHtml(stage.code)}</span><strong>${escapeHtml(stage.title)}</strong></div>${tasks.map((item, index) => `<button type="button" class="task-rail-item ${index === activeIndex ? "active" : ""}" data-focus-task="${index}"><span>${index + 1}</span><span>${escapeHtml(item.label || `Task ${index + 1}`)}</span></button>`).join("")}${collectionAction ? `<button type="button" class="task-rail-add" data-add-row="${collectionAction.section}">${collectionAction.label}</button>` : ""}`;
  els.allTasksTitle.textContent = stage.title;
  els.allTaskList.innerHTML = tasks.map((item, index) => `<button type="button" class="all-task-item ${index === activeIndex ? "active" : ""}" data-focus-task="${index}"><span class="task-number">${index + 1}</span><span><strong>${escapeHtml(item.label || `Task ${index + 1}`)}</strong><small>${escapeHtml(item.title || "")}</small></span></button>`).join("");
  document.getElementById("backBtn").textContent = activeIndex > 0 ? "Back" : currentIndex() > 0 ? "Previous step" : "Back";
  document.getElementById("nextBtn").textContent = activeIndex < tasks.length - 1 ? "Continue" : currentIndex() < stages.length - 1 ? "Next step" : "Finish";
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
    ${renderStudentDetailsForm()}
  `;
}

function renderStudentDetailsForm(prefix = "") {
  const group = state.submission.workArrangement === "group";
  const commonFields = [
    ["adviserName", "Adviser Name", "Enter the adviser assigned to review this proposal."],
    ["course", "Course", "Enter the course or subject where this output will be submitted."],
    ["section", "Section", "Add the section, block, program, or class schedule if required."],
    ["submissionDate", "Date", "Use the submission date or the date required by the instructor."]
  ];
  return `
    <div class="field-grid">
      ${renderDegreeLevelSelect(prefix)}
      <fieldset class="field full arrangement-picker">
        <legend>Work Arrangement</legend>
        <div class="segmented-control" role="radiogroup" aria-label="Work arrangement">
          <label><input type="radio" name="${prefix}workArrangement" data-work-arrangement value="individual" ${group ? "" : "checked"}> Individual</label>
          <label><input type="radio" name="${prefix}workArrangement" data-work-arrangement value="group" ${group ? "checked" : ""}> Group</label>
        </div>
        <p class="hint">For group work, each student keeps a personal copy. The proposal may be shared, but the reflection, declaration, and confidential contribution records belong only to the student completing this copy.</p>
      </fieldset>
      ${commonFields.map(([key, label, hint]) => studentDetailField(prefix, key, label, hint)).join("")}
    </div>
    ${group ? renderGroupDetails(prefix) : renderIndividualDetails(prefix)}
    ${renderPersonalDeclaration(prefix)}
  `;
}

function studentDetailField(prefix, key, label, hint, full = false) {
  const id = `${prefix}${key}`;
  return `
    <div class="field ${full ? "full" : ""}">
      <div class="field-label"><label for="${id}">${escapeHtml(label)}</label>${helpControl(`${id}-help`, label, hint)}</div>
      <input id="${id}" data-section="submission" data-key="${key}" value="${escapeHtml(value(`submission.${key}`))}" aria-describedby="${id}-help">
    </div>`;
}

function renderIndividualDetails(prefix) {
  const nameId = `${prefix}studentName`;
  const reflectionId = `${prefix}initialReadiness`;
  return `
    <div class="field-grid">
      <div class="field full">
        <div class="field-label"><label for="${nameId}">Student Name</label>${helpControl(`${nameId}-help`, "Student Name", "Use the name required by the instructor or institution.")}</div>
        <input id="${nameId}" data-section="submission" data-key="studentName" value="${escapeHtml(value("submission.studentName"))}" aria-describedby="${nameId}-help">
      </div>
      <div class="field full">
        <div class="field-label"><label for="${reflectionId}">Initial Readiness Reflection</label>${helpControl(`${reflectionId}-help`, "Initial Readiness Reflection", "Before starting A1, state how ready you think your proposal idea is and why.")}</div>
        <textarea id="${reflectionId}" data-section="submission" data-key="initialReadiness" aria-describedby="${reflectionId}-help">${escapeHtml(value("submission.initialReadiness"))}</textarea>
      </div>
    </div>`;
}

function renderGroupDetails(prefix) {
  const groupNameId = `${prefix}groupName`;
  const reflectionId = `${prefix}personalGroupReflection`;
  const roster = groupRoster();
  return `
    <section class="group-details">
      <div class="field">
        <label for="${groupNameId}">Group Name <span class="hint">(optional)</span></label>
        <input id="${groupNameId}" data-section="submission" data-key="groupName" value="${escapeHtml(state.submission.groupName || "")}">
      </div>
      ${groupPersonCard(state.submission.groupLeader, "leader", 0, prefix, true)}
      <div class="group-member-list">
        ${state.submission.groupMembers.map((person, index) => groupPersonCard(person, "member", index, prefix)).join("")}
      </div>
      <button type="button" class="ghost" data-add-group-member>Add Group Member</button>
      <div class="field full copy-owner-field">
        <div class="field-label"><label for="${prefix}studentId">Student completing this copy</label>${helpControl(`${prefix}studentId-help`, "Student completing this copy", "Choose the student whose personal reflection, declaration, activity record, and confidential contribution record belong in this copy.")}</div>
        <select id="${prefix}studentId" data-copy-owner aria-describedby="${prefix}studentId-help">
          <option value="">Choose a group member</option>
          ${roster.map((person) => `<option value="${escapeHtml(person.id)}" ${state.submission.studentId === person.id ? "selected" : ""}>${escapeHtml(person.name || (person.role === "leader" ? "Unnamed group leader" : "Unnamed group member"))}</option>`).join("")}
        </select>
      </div>
      <div class="field full">
        <div class="field-label"><label for="${reflectionId}">Personal Group-Work Reflection</label>${helpControl(`${reflectionId}-help`, "Personal Group-Work Reflection", "In one reflection, explain what you learned, what you personally contributed, and how working with the group influenced your research thinking.")}</div>
        <textarea id="${reflectionId}" data-section="submission" data-key="personalGroupReflection" aria-describedby="${reflectionId}-help">${escapeHtml(state.submission.personalGroupReflection || "")}</textarea>
      </div>
      <section class="source-copy-summary">
        <h3>Personal and Member Copies</h3>
        <p class="hint">A member copy includes the shared proposal and roster, but removes your reflection, declaration, checkpoints, app feedback, and all confidential contribution records.</p>
        <button type="button" class="ghost" data-open-member-copy>Create Copy for Another Group Member</button>
      </section>
    </section>`;
}

function groupPersonCard(person, role, index, prefix, open = false) {
  const label = role === "leader" ? "Group Leader" : `Group Member ${index + 1}`;
  return `
    <details class="group-person-card" ${open ? "open" : ""}>
      <summary>${escapeHtml(person.name || label)}</summary>
      <div class="field-grid">
        <div class="field full">
          <label>${label} Name</label>
          <input data-group-person-role="${role}" data-group-person-index="${index}" data-group-person-key="name" value="${escapeHtml(person.name)}">
        </div>
      </div>
      ${role === "member" ? `<button type="button" class="danger ghost" data-remove-group-member="${index}">Remove Member</button>` : ""}
    </details>`;
}

function renderPersonalDeclaration(prefix = "") {
  const id = `${prefix}personalDeclaration`;
  return `<section class="personal-declaration">
    <label for="${id}"><input id="${id}" type="checkbox" data-personal-declaration ${state.submission.personalDeclaration ? "checked" : ""}> I declare that this personal copy identifies me as the student completing it and that my reflection and confidential contribution record are my own entries.</label>
    <p class="hint">This declaration is required before printing a submission. It does not claim that one student completed all group work.</p>
  </section>`;
}

function openMemberCopyDialog() {
  const dialog = document.getElementById("memberCopyDialog");
  const form = document.getElementById("memberCopyForm");
  if (!dialog || !form) return;
  const ownerId = state.submission.studentId;
  const options = groupRoster().filter((person) => person.id !== ownerId).map((person) => `<option value="${escapeHtml(person.id)}">${escapeHtml(person.name || "Unnamed group member")}</option>`).join("");
  form.innerHTML = `<p>Shared proposal content will be included. The source student's identity, reflection, declaration, checkpoints, app feedback, and confidential contribution records will not be copied.</p>
    <h3>Included</h3><p>Proposal responses, group roster, course, and adviser details.</p>
    <h3>Not included</h3><p>Personal reflection, declaration, activity history, checkpoints, self-assessment, peer assessments, and comments.</p>
    <label for="copyRecipient">Receiving group member</label>
    <select id="copyRecipient"><option value="">Choose a member</option>${options}</select>
    <label class="checkbox-line"><input type="checkbox" id="includeSourceRecord" checked> Include a read-only Source Copy Record</label>
    <p class="privacy-note">The source record shows provenance only. It is not evidence of the entire group's work.</p>`;
  dialog.showModal();
}

function createMemberCopy(memberId, includeSourceRecord = true) {
  const recipient = groupRoster().find((person) => person.id === memberId);
  if (!recipient) {
    alert("Choose a receiving group member first.");
    return;
  }
  const copy = clone(state);
  const sourceRecord = {
    sourceStudent: state.submission.studentName || "Unnamed student",
    exportedAt: new Date().toISOString(),
    workStartedAt: state.engagement.workStartedAt || "",
    lastEditedAt: state.engagement.lastEditedAt || "",
    estimatedActiveMs: state.engagement.activeMs || 0,
    appVersion: APP_VERSION,
    note: "Source activity is provenance only and is not interpreted as total group work."
  };
  copy.submission.studentId = recipient.id;
  copy.submission.studentName = recipient.name || "";
  copy.submission.personalGroupReflection = "";
  copy.submission.personalDeclaration = false;
  copy.submission.sourceCopyHistory = includeSourceRecord ? [...(copy.submission.sourceCopyHistory || []), sourceRecord] : [...(copy.submission.sourceCopyHistory || [])];
  copy.submission.groupLeader = normalizeGroupPerson({ ...copy.submission.groupLeader, initialReadiness: "", confidence: "", readinessChange: "" }, "leader");
  copy.submission.groupMembers = copy.submission.groupMembers.map((person) => normalizeGroupPerson({ ...person, initialReadiness: "", confidence: "", readinessChange: "" }, "member"));
  copy.engagement = clone(defaultData.engagement);
  copy.teamContributions = {};
  const backup = { backupFormat: "lit-based-proposal-builder", appVersion: APP_VERSION, schemaVersion: SCHEMA_VERSION, state: normalizeState(copy), checkpoints: [] };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `proposal-builder-member-copy-${(recipient.name || "member").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "member"}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  alert(`A clean member copy for ${recipient.name || "the selected member"} was created. Download it, then use Restore Backup on that student's device.`);
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
  const purposeOptions = (selected) => `<option value="">Choose an inquiry purpose</option>${Object.entries(rqPurposeOptions).map(([key, option]) => `<option value="${key}" ${selected === key ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}`;
  const centralStarter = state.a4.centralPurpose && rqPurposeOptions[state.a4.centralPurpose]
    ? rqPurposeOptions[state.a4.centralPurpose].starters
    : "Choose the broad inquiry purpose to see suitable question starters.";
  els.stageForm.innerHTML = `
    <section class="output-box">
      <h3>A4 Guided Reasoning Path</h3>
      <div class="generated-text">Move from evidence to questions: A3 gap &rarr; literature-based problem &rarr; central study focus &rarr; components and environment &rarr; inquiry purpose &rarr; central question &rarr; specific questions. Open one step at a time.</div>
    </section>
    <section class="output-box"><h3>Your original A3 final gap</h3><div class="generated-text">${escapeHtml(state.a3.finalGap || "Complete the A3 final gap first. Your answer to the literature-based problem begins there.")}</div></section>
    <details class="guided-step" name="a4-flow" open>
      <summary>1. State the literature-based problem</summary>
      <div class="guided-step-content">
        <label>Optional refined gap for A4<textarea data-section="a4" data-key="refinedGap">${escapeHtml(state.a4.refinedGap)}</textarea><span class="hint">Refine the wording if the gap became clearer. The original A3 gap will not be overwritten.</span></label>
        <label>Why did the gap wording change?<textarea data-section="a4" data-key="gapRevisionReason">${escapeHtml(state.a4.gapRevisionReason)}</textarea></label>
        <label>Literature-Based Problem: What problem becomes visible from A3?<textarea data-section="a4" data-key="literatureProblem">${escapeHtml(state.a4.literatureProblem)}</textarea><span class="hint">State the problem revealed by what remains less visible and what this limits us from understanding.</span></label>
      </div>
    </details>
    <details class="guided-step" name="a4-flow">
      <summary>2. Identify the central study focus</summary>
      <div class="guided-step-content">
        <label>Central Study Focus: What phenomenon, relationship, process, alignment, or condition will be investigated?<textarea data-section="a4" data-key="centralFocus">${escapeHtml(state.a4.centralFocus)}</textarea><span class="hint">State what is being investigated, not the people or materials that will provide evidence.</span></label>
        ${state.a4.studiedGroup ? `<section class="output-box"><h3>Previous-version study-focus answer</h3><div class="generated-text">${escapeHtml(state.a4.studiedGroup)}</div><p class="hint">This answer was preserved. Decide whether it describes participants, an environment, evidence sources, or the central focus; the app will not reinterpret it automatically.</p></section>` : ""}
      </div>
    </details>
    <details class="guided-step" name="a4-flow">
      <summary>3. Identify the study components</summary>
      <div class="guided-step-content">
        <label>Study Components: What dimensions, variables, experiences, processes, or categories are needed to examine that focus?<textarea data-section="a4" data-key="studyComponents">${escapeHtml(state.a4.studyComponents)}</textarea></label>
        <label>Required Ideas: What A1 construct and A3 gap ideas must remain visible?<textarea data-section="a4" data-key="rqConstructs">${escapeHtml(state.a4.rqConstructs)}</textarea></label>
      </div>
    </details>
    <details class="guided-step" name="a4-flow">
      <summary>4. Identify the research environment or setting</summary>
      <div class="guided-step-content">
        <label>Research environment or setting<textarea data-section="methodology" data-key="locale">${escapeHtml(state.methodology.locale)}</textarea><span class="hint">Describe the physical, institutional, social, community, workplace, classroom, document, or online environment relevant to the study.</span></label>
      </div>
    </details>
    <details class="guided-step" name="a4-flow">
      <summary>5. Clarify the broad inquiry purpose</summary>
      <div class="guided-step-content">
        <label>Broad inquiry purpose<select data-section="a4" data-key="centralPurpose">${purposeOptions(state.a4.centralPurpose)}</select></label>
        <section class="output-box"><h3>Possible central-question starters</h3><div class="generated-text" data-central-starters>${escapeHtml(centralStarter)}</div></section>
      </div>
    </details>
    <details class="guided-step" name="a4-flow">
      <summary>6. Write the central research question</summary>
      <div class="guided-step-content">
        <label>Central Research Question: What broad question will the study answer?<textarea data-section="a4" data-key="centralQuestion">${escapeHtml(state.a4.centralQuestion)}</textarea></label>
        <ul class="hint"><li>Responds to the A3 problem</li><li>Retains the central focus and required ideas</li><li>Names the relevant environment when needed</li><li>Is broad enough to contain the SRQs</li><li>Does not introduce an unsupported new idea</li></ul>
      </div>
    </details>
    <details class="guided-step" name="a4-flow">
      <summary>7. Break the central question into specific research questions</summary>
      <div class="guided-step-content">
        <section class="output-box rq-anchor-box"><h3>Central question to unpack</h3><div class="generated-text">${escapeHtml(state.a4.centralQuestion || "Write the central research question first.")}</div></section>
        <p class="hint">Each SRQ should answer one necessary part of the central question. Add ${SRQ_LIMITS.minimum}-${SRQ_LIMITS.maximum} as needed.</p>
        <div class="editable-list">
          ${state.a4.questions.map((question, index) => `
            <details class="question-card" ${index === 0 ? "open" : ""}>
              <summary>Specific Research Question ${index + 1}${question ? `: ${escapeHtml(question.slice(0, 90))}` : ""}</summary>
              <div class="guided-step-content">
                <label>What specific part of the central question will this answer?<textarea data-question-focus="${index}">${escapeHtml(state.a4.questionFocuses[index])}</textarea></label>
                <label>Question purpose<select data-question-purpose="${index}">${purposeOptions(state.a4.questionPurposes[index])}</select></label>
                <section class="output-box"><h3>Suggested starters</h3><div class="generated-text">${escapeHtml(questionStarterHint(index))}</div></section>
                <label>What claim should the evidence allow the study to make?<textarea data-question-claim="${index}">${escapeHtml(state.a4.questionClaims[index])}</textarea></label>
                <label>Write the specific research question<textarea data-array="a4.questions" data-index="${index}">${escapeHtml(question)}</textarea></label>
                <div class="inline-actions question-actions">
                  <button class="ghost compact" type="button" data-move-question="${index}:up" ${index === 0 ? "disabled" : ""}>Move Up</button>
                  <button class="ghost compact" type="button" data-move-question="${index}:down" ${index === state.a4.questions.length - 1 ? "disabled" : ""}>Move Down</button>
                  <button class="danger compact" type="button" data-remove-question="${index}">Remove Question</button>
                </div>
              </div>
            </details>`).join("")}
        </div>
        <button type="button" data-add-question>Add Question</button>
      </div>
    </details>
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
  const approach = state.methodology.approach || "";
  const design = state.methodology.design || "";
  const mixedNeeded = approach === "mixed";
  const recommendation = methodologyRecommendation();
  els.stageForm.innerHTML = `
    ${renderFields("methodology", fieldSets.methodology)}
    <section class="output-box methodology-recommendation">
      <h3>Design Guidance from A4</h3>
      <div class="generated-text">${escapeHtml(recommendation.summary)}</div>
      <p class="hint">Compared with: A4 inquiry purposes, intended claims, and evidence needs. This is a recommendation, not a decision. Review alternatives with your adviser.</p>
    </section>
    <section class="field-grid methodology-cascade">
      <div class="field full">
        <label for="methodology-approach">1. What broad evidence approach will answer the questions?</label>
        <select id="methodology-approach" data-methodology-selection="approach">
          <option value="">Choose after reviewing A4</option>
          <option value="quantitative" ${approach === "quantitative" ? "selected" : ""}>Quantitative</option>
          <option value="qualitative" ${approach === "qualitative" ? "selected" : ""}>Qualitative</option>
          <option value="mixed" ${approach === "mixed" ? "selected" : ""}>Mixed Methods</option>
        </select>
        <p class="hint">Quantitative uses measurable variables; qualitative examines meanings, experiences, processes, cases, or culture; mixed methods requires both and an explicit integration purpose.</p>
      </div>
      ${approach ? `<div class="field full">
        <label for="methodology-design">2. Which design within ${escapeHtml(approachLabel(approach))} may fit?</label>
        <select id="methodology-design" data-methodology-selection="design">
          <option value="">Choose a design</option>
          ${methodologyDesigns[approach].map(([key, label]) => `<option value="${key}" ${design === key ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}
        </select>
      </div>` : ""}
      <div class="field full">
        <label class="toggle-line"><input type="checkbox" data-methodology-action ${state.methodology.actionResearch === "yes" ? "checked" : ""}> This study also uses an Action Research orientation</label>
        <p class="hint">Action research is an improvement orientation, not a fourth evidence approach. It may use quantitative, qualitative, or mixed evidence through a plan-act-observe-reflect cycle.</p>
      </div>
    </section>
    ${design ? designGuidanceHtml(design) : ""}
    <section class="field full">
      <label for="methodology-designJustification">Why does this design fit better than the alternatives?</label>
      <textarea id="methodology-designJustification" data-section="methodology" data-key="designJustification">${escapeHtml(state.methodology.designJustification || "")}</textarea>
      <p class="hint">Connect the design to the questions, claims, evidence, feasibility, and assumptions. Name an alternative considered and why it fits less well.</p>
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

function approachLabel(approach) {
  return { quantitative: "Quantitative", qualitative: "Qualitative", mixed: "Mixed Methods" }[approach] || "";
}

function methodologyDisplayName(approach, design, actionResearch = false) {
  const label = methodologyDesigns[approach]?.find(([key]) => key === design)?.[1] || "";
  return [label, actionResearch ? "with Action Research orientation" : ""].filter(Boolean).join(" ");
}

function designGuidanceHtml(design) {
  const guidance = designGuidance[design] || [];
  return `<section class="output-box design-guidance"><h3>Why this option may fit</h3><p>${escapeHtml(guidance[0] || "Review how this design produces the intended claims.")}</p><h3>Requirements and assumptions</h3><p>${escapeHtml(guidance[1] || "State the conditions this design requires.")}</p><h3>Alternative to discuss</h3><p>${escapeHtml(guidance[2] || "Compare at least one defensible alternative with your adviser.")}</p></section>`;
}

function methodologyRecommendation() {
  const purposes = state.a4.questionPurposes.filter(Boolean);
  const claims = state.a4.questionClaims.join(" ").toLowerCase();
  const evidence = `${state.methodology.dataNeeded || ""} ${state.methodology.evidenceSources || ""}`.toLowerCase();
  const numeric = purposes.some((p) => ["describe", "compare", "relationship", "predict", "evaluate"].includes(p)) || /score|level|frequency|difference|relationship|predict|numeric|survey/.test(`${claims} ${evidence}`);
  const qualitative = purposes.some((p) => ["exploreExperience", "explain", "develop"].includes(p)) || /experience|meaning|process|theme|narrative|interview|observation|document/.test(`${claims} ${evidence}`);
  let approach = numeric && qualitative ? "mixed" : qualitative ? "qualitative" : numeric ? "quantitative" : "";
  const candidates = [];
  if (purposes.includes("relationship")) candidates.push("correlational");
  if (purposes.includes("compare")) candidates.push("comparative");
  if (purposes.includes("predict")) candidates.push("predictive");
  if (purposes.includes("exploreExperience")) candidates.push("phenomenology", "qualitative descriptive", "case study");
  if (purposes.includes("develop")) candidates.push("grounded theory", "exploratory sequential mixed methods");
  if (purposes.includes("evaluate")) candidates.push("quasi-experimental", "case study", "mixed methods", "action research orientation");
  if (!candidates.length && purposes.includes("describe")) candidates.push(numeric ? "descriptive quantitative" : "qualitative descriptive");
  const approachText = approach ? `${approachLabel(approach)} may fit` : "More A4 detail is needed";
  return { approach, candidates, summary: `${approachText}${candidates.length ? `. Candidate designs to compare: ${[...new Set(candidates)].join(", ")}.` : ". Add the intended claims and evidence needs before selecting a design."}` };
}

function renderFramework() {
  const pathway = value("frameworkFinder.pathway") || "problem-led";
  els.stageForm.innerHTML = `
    <section class="output-box">
      <h3>Framework Finder: Find &rarr; Compare &rarr; Select &rarr; Test &rarr; Explain</h3>
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
      <h3>Explain the Selected Framework or Combination</h3>
      <div class="generated-text">Show the distinct work performed by each framework. Keep conceptual scope here: included and excluded constructs, examined relationships, and theoretical boundaries. Operational delimitations belong in Methodology.</div>
    </section>
    ${renderFields("framework", fieldSets.framework)}
    <section class="checker-panel">
      <h3>Framework Alignment Readiness</h3>
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
      <div class="generated-text">Term: Science teaching self-efficacy
Conceptual definition (with author/s and year): Bandura (1997) describes self-efficacy as a person's belief in their capability to organize and carry out actions needed for a task.
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
    ["conceptual", "Conceptual Definition (with Author/s and Year)"],
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
      <button class="row-remove" type="button" data-remove-row="terms:${index}" aria-label="Remove this term">Remove term</button>
    </div>
  `;
}

function termDefinitionPreview(row) {
  row = normalizeTermRow(row);
  if (!row.term && !row.conceptual && !row.operational && !row.measured) {
    return "The draft definition will appear here after you add the term details.";
  }
  const term = row.term || "[term]";
  const conceptual = row.conceptual || "[add the literature-based meaning with author/s and year]";
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
    ["locale", "Research environment or setting", "Describe the physical, institutional, social, community, workplace, classroom, document, or online environment without exposing unnecessary identifying details."],
    ["collection", "Data Collection", "Sequence the steps: permission, consent, instrument administration, interview/observation, retrieval, and safekeeping."],
    ["analysis", "Data Analysis", "Match analysis to data: frequency/mean, t-test, correlation, thematic analysis, content analysis, or reflection cycle."]
  ];
  return `<div class="field-grid">${fields.map(([key, label]) => `
    <div class="field">
      <div class="field-label">
        <label for="methodology-${key}">${label}</label>
        ${helpControl(`methodology-${key}-help`, label, `${methodologyFieldGuidance(key, fields.find((field) => field[0] === key)[2])} This can change after your adviser checks the design.`)}
      </div>
      <textarea id="methodology-${key}" data-section="methodology" data-key="${key}" aria-describedby="methodology-${key}-help">${escapeHtml(value(`methodology.${key}`))}</textarea>
    </div>
  `).join("")}</div>`;
}

function methodologyFieldGuidance(key, fallback) {
  const approach = state.methodology.approach;
  const design = state.methodology.design;
  const specifics = {
    quantitative: {
      sampling: "State the target population, sampling frame where available, selection procedure, and how the intended analysis affects sample needs.",
      collection: "Describe standardized administration, scoring, quality checks, and comparable procedures across respondents or groups.",
      analysis: "Name descriptive and inferential procedures that directly answer each SRQ, including assumptions that must be checked."
    },
    qualitative: {
      sampling: "Explain how information-rich participants, cases, events, or documents will be selected and when sufficient depth will be judged.",
      collection: "Describe interviews, observations, documents, artifacts, field notes, or other sources and how depth and reflexivity will be supported.",
      analysis: "Name the qualitative analytic process, coding or interpretation steps, and trustworthiness strategies."
    },
    mixed: {
      sampling: "Explain sampling for both strands and whether the same, nested, or different participants or sources will be used.",
      collection: "Sequence both strands and identify where one phase informs the other or where the evidence is brought together.",
      analysis: "State the analysis for each strand and the integration method, such as connecting, merging, embedding, or a joint display."
    }
  };
  let text = specifics[approach]?.[key] || fallback;
  if (design === "caseStudy" && key === "locale") text = "Define the bounded case, its environment, the relevant period, and why that boundary forms one case.";
  if (state.methodology.actionResearch === "yes" && key === "collection") text += " Show the plan-act-observe-reflect cycle and how each cycle informs improvement.";
  return text;
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
    ${renderConsentDocumentPreparation()}
  `;
}

function renderConsentDocumentPreparation() {
  const docs = state.ethics.documents;
  const fields = [
    ["studyTitle", "Study title", state.ethics.documents.studyTitle || state.a1.initialTopic || ""],
    ["coInvestigator", "Co-investigator/s", docs.coInvestigator],
    ["sponsor", "Study sponsor", docs.sponsor],
    ["inclusionCriteria", "Inclusion criteria", docs.inclusionCriteria],
    ["exclusionCriteria", "Exclusion criteria", docs.exclusionCriteria],
    ["expectedParticipants", "Expected number of participants", docs.expectedParticipants],
    ["participantActivities", "What participants will do", docs.participantActivities],
    ["participantTime", "Participant time commitment", docs.participantTime],
    ["risks", "Foreseeable risks or discomforts", docs.risks],
    ["riskMitigation", "Safeguards and risk mitigation", docs.riskMitigation],
    ["benefits", "Expected benefits", docs.benefits],
    ["compensation", "Compensation, reimbursement, or gift", docs.compensation],
    ["researchContact", "Researcher contact information", docs.researchContact],
    ["childAgeRange", "Child age range, if applicable", docs.childAgeRange],
    ["assentLanguage", "Assent form language, if applicable", docs.assentLanguage]
  ];
  return `<details class="table-wrap consent-preparation">
    <summary><strong>Consent, Permission, and Assent Document Preparation</strong></summary>
    <div class="guided-step-content">
      <section class="notice-box"><strong>Draft for Adviser and ERB Review - Not Approved for Recruitment or Data Collection</strong><p>This tool prepares editable drafts from the supplied HNU Consent Forms v2 template. Verify the latest official ERB form and instructions with your adviser or institution before use.</p></section>
      <div class="field-grid">
        ${consentSelect("humanParticipants", "Does the study involve direct human participants?", [["", "Choose"], ["yes", "Yes"], ["no", "No - documents or non-human sources only"], ["uncertain", "Uncertain - adviser/ERB decision needed"]])}
        ${consentSelect("capableAdults", "Are all direct participants adults able to provide their own consent?", [["", "Choose"], ["yes", "Yes"], ["no", "No"], ["uncertain", "Uncertain"]])}
        ${consentSelect("minorsDirect", "Are minors direct participants?", [["", "Choose"], ["yes", "Yes"], ["no", "No"], ["uncertain", "Uncertain"]])}
        ${consentSelect("vulnerableParticipants", "Are vulnerable participants involved?", [["", "Choose"], ["yes", "Yes"], ["no", "No"], ["uncertain", "Uncertain"]])}
        ${consentSelect("representativePermission", "Is parent or legally authorized representative permission needed?", [["", "Choose"], ["yes", "Yes"], ["no", "No"], ["adviser", "Adviser/ERB must decide"]])}
        ${docs.minorsDirect === "yes" ? consentSelect("twoRepresentativeSignatures", "Did the adviser or ERB explicitly require two representative signatures?", [["", "Choose"], ["yes", "Yes"], ["no", "No"], ["adviser", "Not yet decided"]]) : ""}
      </div>
      <div class="field-grid">${fields.map(([key, label, current]) => `<div class="field"><label>${escapeHtml(label)}</label><textarea data-ethics-document="${key}">${escapeHtml(current || "")}</textarea></div>`).join("")}</div>
      <section class="output-box"><h3>Documents indicated by current answers</h3><div class="generated-text">${escapeHtml(consentDocumentDecision().message)}</div></section>
      <button type="button" data-download-consent-docs ${consentDocumentDecision().files.length ? "" : "disabled"}>Generate Draft Word Form${consentDocumentDecision().files.length === 1 ? "" : "s"}</button>
      <p class="hint">The app creates one master copy of each applicable form. Participant names, signatures, and signed dates remain blank. Never store signed forms or participant-identifying information in this app.</p>
      <p class="hint">This proposal builder only helps you draft the Ethical Considerations section. It does not replace the official ethics review process. Before data gathering, ask your adviser, program head, or dean for the official ERB protocol packet and submission procedures required by your institution. Do not begin recruitment or data collection until the required permissions and ethics clearance, when applicable, have been secured.</p>
    </div>
  </details>`;
}

function consentSelect(key, label, options) {
  return `<div class="field"><label>${escapeHtml(label)}</label><select data-ethics-document="${key}">${options.map(([value, text]) => `<option value="${value}" ${state.ethics.documents[key] === value ? "selected" : ""}>${escapeHtml(text)}</option>`).join("")}</select></div>`;
}

function consentDocumentDecision() {
  const docs = state.ethics.documents;
  if (docs.humanParticipants === "no") return { files: [], message: "No consent form is indicated because the study is currently marked as having no direct human participants. Institutional permission or an ERB determination may still be needed." };
  if (docs.humanParticipants !== "yes") return { files: [], message: "Clarify whether direct human participants are involved and discuss uncertain cases with the adviser or ERB." };
  const files = [];
  if (docs.capableAdults === "yes") files.push(["adult-consent.docx", "HNU-v2-adult-informed-consent.docx"]);
  if (docs.minorsDirect === "yes") {
    files.push(["parent-permission.docx", "HNU-v2-parent-LAR-permission.docx"], ["child-assent.docx", "HNU-v2-child-assent.docx"]);
    if (docs.twoRepresentativeSignatures === "yes") files.push(["two-representative-permission.docx", "HNU-v2-two-representative-permission.docx"]);
  } else if (docs.representativePermission === "yes") {
    files.push(["parent-permission.docx", "HNU-v2-LAR-permission.docx"]);
  }
  if (!files.length) return { files, message: "No form can be selected confidently yet. Complete adult capacity, minor participation, and representative-permission decisions with your adviser or ERB." };
  return { files, message: `Prepare: ${files.map(([, name]) => name.replace("HNU-v2-", "").replace(".docx", "")).join(", ")}. These remain drafts for adviser and ERB review.` };
}

function consentTemplateValues() {
  const docs = state.ethics.documents;
  return {
    "{{STUDY_TITLE}}": docs.studyTitle || state.a1.initialTopic || "[Study title]",
    "{{PRINCIPAL_INVESTIGATOR}}": state.submission.workArrangement === "group" ? state.submission.groupLeader.name : state.submission.studentName,
    "{{CO_INVESTIGATOR}}": docs.coInvestigator || (state.submission.workArrangement === "group" ? state.submission.groupMembers.map((person) => person.name).filter(Boolean).join(", ") : ""),
    "{{FACULTY_ADVISER}}": state.submission.adviserName || "[Faculty adviser]",
    "{{SPONSOR}}": docs.sponsor || "None stated",
    "{{PURPOSE}}": state.a4.literatureProblem || "[Purpose and significance]",
    "{{INCLUSION}}": docs.inclusionCriteria || "[Inclusion criteria]",
    "{{EXCLUSION}}": docs.exclusionCriteria || "[Exclusion criteria]",
    "{{EXPECTED_PARTICIPANTS}}": docs.expectedParticipants || "[Expected number]",
    "{{SETTING}}": state.methodology.locale || "[Research environment or setting]",
    "{{ACTIVITIES}}": docs.participantActivities || state.methodology.collection || "[Participant activities and procedures]",
    "{{TIME_COMMITMENT}}": docs.participantTime || "[Time commitment]",
    "{{RISKS}}": docs.risks || "[Foreseeable risks or discomforts]",
    "{{SAFEGUARDS}}": docs.riskMitigation || state.ethics.draft || "[Safeguards]",
    "{{BENEFITS}}": docs.benefits || "[Expected benefits]",
    "{{COMPENSATION}}": docs.compensation || "No compensation stated",
    "{{CONTACT}}": docs.researchContact || "[Researcher contact information]",
    "{{CHILD_AGE}}": docs.childAgeRange || "[Child age range]",
    "{{ASSENT_LANGUAGE}}": docs.assentLanguage || "[Assent language]"
  };
}

async function generateConsentDocxDrafts() {
  const decision = consentDocumentDecision();
  if (!decision.files.length) return;
  try {
    const output = new JSZip();
    for (const [templateName, outputName] of decision.files) {
      const response = await fetch(`erb-templates/${templateName}`);
      if (!response.ok) throw new Error(`Missing template: ${templateName}`);
      const docx = await JSZip.loadAsync(await response.arrayBuffer());
      const documentFile = docx.file("word/document.xml");
      let xml = await documentFile.async("string");
      Object.entries(consentTemplateValues()).forEach(([token, replacement]) => {
        xml = xml.split(token).join(escapeXml(replacement));
      });
      docx.file("word/document.xml", xml);
      output.file(outputName, await docx.generateAsync({ type: "blob" }));
    }
    const blob = await output.generateAsync({ type: "blob" });
    downloadBlob(blob, `ERB-draft-forms-${new Date().toISOString().slice(0, 10)}.zip`);
  } catch (error) {
    alert(`The Word drafts could not be generated. ${error.message}`);
  }
}

function escapeXml(text = "") {
  return String(text).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function renderInstrumentation() {
  syncInstrumentationRows();
  const rows = state.instrumentation.rows;
  if (!rows.length) {
    els.stageForm.innerHTML = `
      <section class="output-box empty-state">
        <h3>No Specific Research Questions Yet</h3>
        <div class="generated-text">Instrumentation begins with the specific research questions. Return to A4, add the SRQs, and this section will create exactly one instrumentation card for each question.</div>
        <button type="button" data-stage="a4">Go to A4</button>
      </section>`;
    return;
  }
  els.stageForm.innerHTML = `
    <section class="table-wrap">
      <h3>Question-to-Evidence Alignment</h3>
      <p class="hint">Complete the chain for every SRQ: claim needed &rarr; evidence needed &rarr; evidence source &rarr; instrument/procedure &rarr; analysis. Participants are not the only possible sources; documents, artifacts, records, observations, and outputs may also provide evidence.</p>
      <div class="table-scroll">
        <div class="editable-list">
          ${rows.map((row, index) => instrumentationRow(index)).join("")}
        </div>
      </div>
    </section>
  `;
}

function syncInstrumentationRows() {
  const existingRows = state.instrumentation.rows.map(normalizeInstrumentRow);
  const byId = new Map(existingRows.filter((row) => row.questionId).map((row) => [row.questionId, row]));
  const usedLegacyIndexes = new Set();
  state.instrumentation.rows = state.a4.questions.map((question, index) => ({ question, index }))
    .filter(({ question }) => question.trim())
    .map(({ question, index }) => {
      const questionId = state.a4.questionIds[index] || (state.a4.questionIds[index] = createStableId("srq"));
      let existing = byId.get(questionId);
      if (!existing) {
        existing = existingRows.find((row, legacyIndex) => !row.questionId && !usedLegacyIndexes.has(legacyIndex) && row.rq.trim() === question.trim());
      }
      if (!existing) {
        const legacyIndex = existingRows.findIndex((row, rowIndex) => !row.questionId && !usedLegacyIndexes.has(rowIndex));
        if (legacyIndex >= 0) {
          usedLegacyIndexes.add(legacyIndex);
          existing = existingRows[legacyIndex];
        }
      }
      return { ...(existing || emptyRowFor("instrumentation")), questionId, rq: question };
    });
}

function instrumentationRow(index) {
  const row = state.instrumentation.rows[index];
  const questionIndex = state.a4.questionIds.indexOf(row.questionId);
  const purposeKey = state.a4.questionPurposes[questionIndex] || "";
  const purpose = rqPurposeOptions[purposeKey];
  const purposeHint = purpose
    ? `Question purpose from A4: ${purpose.label}. Suggested question starters: ${purpose.starters}`
    : "No A4 question purpose selected yet. Return to A4 and choose the purpose of this question.";
  const labels = {
    claimNeeded: "Claim Needed",
    evidenceNeeded: "Evidence Needed",
    evidenceSource: "Evidence Source",
    instrument: "Instrument / Procedure",
    analysis: "Analysis",
    description: "Description",
    purpose: "Purpose",
    validation: "Validation",
    implementation: "Implementation"
  };
  return `
    <div class="table-row instrumentation-row" style="--cols:10">
      <section class="output-box">
        <h3>Research Question ${index + 1}</h3>
        <div class="generated-text">${escapeHtml(row.rq || "No research question has been entered yet.")}</div>
        <p class="hint">${escapeHtml(purposeHint)}</p>
      </section>
      ${["claimNeeded", "evidenceNeeded", "evidenceSource", "instrument", "analysis", "description", "purpose", "validation", "implementation"].map((key) => `
        <label>
          <span class="field-label">
            <span>${escapeHtml(labels[key])}</span>
            ${helpControl(`instrumentation-${index}-${key}-help`, key, instrumentationScaffold(key, purposeKey))}
          </span>
          <textarea data-table="instrumentation" data-index="${index}" data-key="${key}" aria-describedby="instrumentation-${index}-${key}-help">${escapeHtml(row[key] || "")}</textarea>
        </label>
      `).join("")}
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
    claimNeeded: "State the defensible claim this SRQ should support. Distinguish reported understanding, documented expectation, produced output, and demonstrated practice.",
    evidenceNeeded: "Name the evidence required to support that claim: detailed accounts, scores, policy statements, observed actions, artifacts, records, or another suitable form.",
    evidenceSource: "Name who or what provides the evidence: participants, documents, artifacts, records, observations, recordings, outputs, or test results.",
    instrument: "Choose the instrument or procedure: survey, test, interview guide, observation, document analysis, rubric, record review, or another defensible method.",
    analysis: "State how this evidence will be analyzed to produce the intended claim, such as descriptive statistics, correlation, thematic analysis, content analysis, or comparison.",
    description: "Describe the instrument parts, scales, prompts, indicators, sections, and sample item or example indicator.",
    purpose: purposeSpecific[purposeKey] || "Explain what data this instrument needs to collect for the research question.",
    validation: "Explain expert validation, pilot testing, reliability, inter-rater checking, or trustworthiness strategy.",
    implementation: "Explain the source of data and how, when, where, and by whom the instrument will be administered or used."
  };
  return base[key] || "Add a clear, study-specific detail.";
}

function renderOutline() {
  const outlineSections = buildOutline().split(/\n(?=Chapter\s+[123]:|Appendices)/i).filter((section) => section.trim());
  els.stageForm.innerHTML = `
    ${outlineSections.map((section, index) => {
      const heading = section.match(/^(Chapter\s+[123]:[^\n]*|Appendices)/i)?.[1] || `Outline Part ${index + 1}`;
      return `<section class="output-box" data-outline-section="${escapeHtml(heading)}"><h3>${escapeHtml(heading)}</h3><div class="generated-text">${escapeHtml(section)}</div></section>`;
    }).join("")}
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
      <h3>Proposal Readiness</h3>
      <div class="generated-text">${escapeHtml(report.label)}
Formative alignment indicator: ${report.score}/100</div>
    </section>
    <section class="checker-panel">
      <h3>Alignment Report</h3>
      <div class="feedback">${report.items.map(feedbackHtml).join("")}</div>
    </section>
    <section class="output-box"><h3>Adviser-Review Reminder</h3><div class="generated-text">The app provides developmental guidance and alignment checks. Its outputs do not constitute adviser, panel, or institutional approval. Research decisions remain subject to scholarly justification and adviser review.</div></section>
    ${workRecordHtml()}
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
    ${state.submission.workArrangement === "group" ? `
      <section class="output-box">
        <h3>Personal Group-Work Reflection</h3>
        <div class="generated-text">This reflection belongs to the student completing this copy and explains what the student learned, contributed, and experienced while working with the group.</div>
        <p>${escapeHtml(state.submission.personalGroupReflection || "No personal group-work reflection has been entered yet.")}</p>
        <button type="button" data-stage="details">Review Group Reflections</button>
      </section>` : `
      <section class="output-box">
        <h3>Initial Readiness Reflection</h3>
        <div class="generated-text">${escapeHtml(value("submission.initialReadiness") || "No initial readiness reflection has been entered yet. Return to Info - Student Details to add it.")}</div>
        <p class="hint">This is read-only here. Edit it in Info - Student Details if correction is needed.</p>
      </section>
      ${renderFields("submission", fieldSets.finalSubmission)}`}
  `;
}

function tableRow(section, index, keys, labels) {
  const row = getTableRows(section)[index];
  const protectedRow = isProtectedStandardRow(section, index);
  return `
    <div class="table-row ${section}-row ${protectedRow ? "protected-standard-row" : "additional-row"}" style="--cols:${keys.length}">
      ${keys.map((key, keyIndex) => protectedRow && key === "type" ? `
        <div class="protected-pattern-field">
          <span class="field-label">
            <span>${labels[keyIndex]}</span>
            ${helpControl(`${section}-${index}-${key}-help`, labels[keyIndex], tableScaffolds[section]?.[key] || "Add a clear, study-specific detail.")}
          </span>
          <strong class="protected-pattern-value">${escapeHtml(row[key] || "")}</strong>
          <small>Required template category</small>
        </div>` : `
        <label>
          <span class="field-label">
            <span>${labels[keyIndex]}</span>
            ${helpControl(`${section}-${index}-${key}-help`, labels[keyIndex], tableScaffolds[section]?.[key] || "Add a clear, study-specific detail.")}
          </span>
          <textarea data-table="${section}" data-index="${index}" data-key="${key}" aria-describedby="${section}-${index}-${key}-help">${escapeHtml(row[key] || "")}</textarea>
        </label>
      `).join("")}
      ${protectedRow ? "" : `<button class="row-remove" type="button" data-remove-row="${section}:${index}" aria-label="Remove this additional row">Remove extra row</button>`}
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
  return { questionId: "", rq: "", claimNeeded: "", evidenceNeeded: "", evidenceSource: "", instrument: "", analysis: "", description: "", purpose: "", validation: "", implementation: "" };
}

function canonicalPatternType(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return STANDARD_PATTERN_TYPES.find((type) => type.toLowerCase() === normalized) || "";
}

function isProtectedStandardRow(section, index) {
  if (!["a2Patterns", "a3Gaps"].includes(section)) return false;
  const rows = getTableRows(section);
  const canonical = canonicalPatternType(rows[index]?.type);
  if (!canonical) return false;
  return rows.findIndex((row) => canonicalPatternType(row.type) === canonical) === Number(index);
}

function rowHasSavedWork(row = {}) {
  return Object.values(row).some((value) => String(value || "").trim());
}

function addedRowTaskIndex(section, rowIndex) {
  return section === "terms" ? rowIndex * 4 : rowIndex;
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
  const text = `${state.a4.questionType || ""} ${state.a4.centralPurpose || ""} ${state.methodology.selectedDesign || ""} ${state.methodology.rqTypes || ""} ${state.methodology.dataNeeded || ""} ${state.methodology.purpose || ""} ${state.a4.questions.join(" ")}`.toLowerCase();
  return /mixed|both|quantitative and qualitative|qualitative and quantitative|survey.*interview|interview.*survey|numeric.*experience|level.*experience/.test(text);
}

function scopeControlItems() {
  const rows = questionPurposeRows();
  const purposeCount = new Set(rows.map((row) => row.purposeKey).filter(Boolean)).size;
  const text = `${state.a4.rqConstructs || ""} ${state.framework.scopeBoundaries || ""} ${state.methodology.operationalDelimitations || ""} ${state.methodology.dataNeeded || ""}`.toLowerCase();
  const variableMarkers = (text.match(/,| and |;|\bvariable\b|\bconstruct\b/g) || []).length;
  const instrumentCount = state.instrumentation.rows.filter((row) => row.instrument).length;
  const items = [];
  items.push(flag(rows.length <= SRQ_LIMITS.preferredMaximum, "SRQ count is within the preferred scope.", `There are ${rows.length} SRQs. Check whether some can be combined or moved to sub-questions.`));
  items.push(flag(purposeCount <= 3, "Question purposes are focused.", "The study uses many question purposes. Check whether it is trying to describe, compare, relate, predict, evaluate, explore, and develop too much at once."));
  items.push(flag(variableMarkers <= 8, "Construct/variable load appears manageable.", "The construct or variable load may be heavy. Narrow the study before adding instruments."));
  items.push(flag(instrumentCount <= Math.max(rows.length, 1), "Instrument count appears tied to the research questions.", "There may be more instruments than research questions. Check feasibility and respondent burden."));
  items.push(flag(Boolean(state.framework.scopeBoundaries), "Conceptual scope is stated.", "Clarify included and excluded constructs, relationships, and theoretical boundaries."));
  return items;
}

function recommendMethodology() {
  return `Recommendation: ${methodologyRecommendation().summary}`;
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
  Selected framework or combination: ${state.framework.theoryModel || "[Name framework, theory, model, or concept]"}
  Authoritative sources: ${state.frameworkFinder.frameworkSource || "[Cite each selected framework]"}
  Distinct roles: ${state.frameworkFinder.frameworkRoles || "[Explain what each framework contributes]"}
  Connection to the problem: ${state.framework.problemConnection || "[Explain how the framework explains the problem]"}
  Connection to the questions: ${state.framework.questionConnection || "[Explain how the framework guides the questions]"}
  Connection to instruments or analysis: ${state.framework.instrumentConnection || "[Explain how the framework guides indicators, instruments, or analysis]"}

Statement of the Problem
- General Statement
  Carry forward this literature-based problem: ${problem}
  Central study focus: ${state.a4.centralFocus || "[State the phenomenon, relationship, process, alignment, or condition]"}
  Study components: ${state.a4.studyComponents || "[State dimensions, variables, experiences, processes, or categories]"}
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
  Conceptual scope: ${state.framework.scopeBoundaries || "Identify included and excluded constructs, relationships, and theoretical boundaries."}
  Operational delimitations: ${state.methodology.operationalDelimitations || "Identify participant, environment, period, evidence-source, and procedure boundaries."}
- Participants
  ${state.methodology.participants || "[Describe participants]"}
  Sampling: ${state.methodology.sampling || "[Describe sampling]"}
- Research Environment or Setting
  ${state.methodology.locale || "[Describe research environment or setting]"}
- Evidence Sources and Period
  Evidence sources: ${state.methodology.evidenceSources || "[Identify participants, documents, artifacts, records, observations, outputs, or other sources]"}
  Study period: ${state.methodology.studyPeriod || "[State the relevant time boundary]"}
- Instrumentation
  Align each SRQ with its intended claim, evidence, source, instrument/procedure, analysis, validation, and implementation.
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
    flag(Boolean(state.a4.centralFocus), "Central study focus is stated separately from participants and evidence sources.", "State the phenomenon, relationship, process, alignment, or condition being investigated."),
    flag(Boolean(state.a4.studyComponents), "Study components are identified.", "Identify the dimensions, variables, experiences, processes, or categories needed to examine the central focus."),
    flag(Boolean(state.methodology.locale), "Research environment or setting is identified.", "Describe the environment or setting relevant to the inquiry."),
    flag(Boolean(state.a4.centralPurpose), "Broad inquiry purpose is selected.", "Choose whether the central inquiry describes, compares, relates, predicts, explores, explains, evaluates, or develops."),
    flag(Boolean(state.a4.centralQuestion), "Central research question is written.", "Write the CRQ that responds to the problem."),
    flag(questions.length >= SRQ_LIMITS.minimum && questions.length <= SRQ_LIMITS.maximum, `There are ${SRQ_LIMITS.minimum}-${SRQ_LIMITS.maximum} specific research questions.`, `Add ${SRQ_LIMITS.minimum}-${SRQ_LIMITS.maximum} SRQs that unpack the central question.`),
    flag(!state.a4.refinedGap || Boolean(state.a4.gapRevisionReason), "Any A4 gap refinement is explained.", "Explain why the A3 gap wording was refined in A4.")
  ];
  if (core && !`${state.a4.centralQuestion || ""} ${text} ${state.a4.literatureProblem || ""}`.toLowerCase().includes(core.split(" ")[0])) {
    results.push({ level: "yellow", text: `The core construct "${state.a1.coreConstruct || state.a1.rrlMajorityTest}" may be missing from the problem or questions.` });
  }
  questions.forEach((q, index) => {
    if (!state.a4.questionFocuses[index]) results.push({ level: "yellow", text: `SRQ ${index + 1} needs a specific focus showing which part of the central question it answers.` });
    if (!state.a4.questionPurposes[index]) results.push({ level: "yellow", text: `SRQ ${index + 1} needs an inquiry purpose.` });
    if (!state.a4.questionClaims[index]) results.push({ level: "yellow", text: `SRQ ${index + 1} needs an intended claim before evidence can be planned.` });
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
        text: `Review SRQ ${row.number}: it may introduce ideas not visible in the central question or literature-based problem.`,
        evidence: {
          compared: `A3 gap, A4 central question, and SRQ ${row.number}`,
          matched: tokens.filter((token) => centralTokens.has(token) || problemTokens.has(token)).join(", ") || "General study wording",
          mismatch: `Possible new terms: ${missing.slice(0, 8).join(", ")}`,
          why: "A specific question should unpack the central inquiry rather than silently expand the study.",
          revisit: "A2 patterns, A3 gap, or A4 question wording",
          action: "Add literature and problem support, broaden the central question with justification, or revise the SRQ. Discuss uncertain additions with your adviser."
        }
      });
    } else {
      items.push({ level: "green", text: `SRQ ${row.number} appears traceable to the central question or literature-based problem.` });
    }
  });

  const uncoveredCentral = [...centralTokens].filter((token) => !allSrqTokens.has(token) && !problemTokens.has(token));
  if (uncoveredCentral.length >= 2) {
    items.push({
      level: "yellow",
      text: "Review coverage: some central-question ideas may not be unpacked by the SRQs.",
      evidence: {
        compared: "A4 central question and all SRQs",
        matched: [...centralTokens].filter((token) => allSrqTokens.has(token)).join(", ") || "Limited direct overlap",
        mismatch: `Possibly uncovered terms: ${uncoveredCentral.slice(0, 8).join(", ")}`,
        why: "Every important part of the central inquiry should be answerable through at least one SRQ.",
        revisit: "A4 central question and SRQ set",
        action: "Clarify, combine, add, or remove questions after reviewing the intended coverage."
      }
    });
  }
  return items;
}

function claimEvidenceAlignmentItems() {
  syncInstrumentationRows();
  const items = [];
  state.instrumentation.rows.map(normalizeInstrumentRow).forEach((row, index) => {
    if (!row.rq) return;
    const questionIndex = state.a4.questionIds.indexOf(row.questionId);
    const claim = `${row.claimNeeded} ${state.a4.questionClaims[questionIndex] || ""}`.toLowerCase();
    const source = `${row.evidenceSource} ${row.instrument} ${row.description} ${row.implementation}`.toLowerCase();
    const analysis = row.analysis.toLowerCase();
    if (!row.claimNeeded || !row.evidenceNeeded || !row.evidenceSource || !row.instrument || !row.analysis) {
      items.push({
        level: "yellow",
        text: `Complete the evidence chain for SRQ ${index + 1}.`,
        evidence: {
          compared: `SRQ ${index + 1}, intended claim, evidence, source, instrument/procedure, and analysis`,
          matched: [row.claimNeeded && "claim", row.evidenceNeeded && "evidence", row.evidenceSource && "source", row.instrument && "instrument/procedure", row.analysis && "analysis"].filter(Boolean).join(", ") || "Research question only",
          mismatch: "One or more warrant-chain elements are blank.",
          why: "Data cannot support a claim unless the source, collection procedure, and analysis are explicit.",
          revisit: `Instrumentation row ${index + 1}`,
          action: "Complete the chain, then discuss whether it is sufficient with your adviser."
        }
      });
      return;
    }
    if (/learned|understanding|competenc|knowledge/.test(claim) && /survey|questionnaire|self.report|response/.test(source) && !/observation|artifact|lesson plan|performance|test|output/.test(source)) {
      items.push({ level: "yellow", text: `Review SRQ ${index + 1}: self-reports may support reported understanding, but not demonstrated learning by themselves.`, evidence: { compared: "Intended claim and evidence source", matched: "Self-report evidence is available", mismatch: "The claim may imply learned or demonstrated competence", why: "Reported understanding and demonstrated application are different claims.", revisit: `SRQ ${index + 1} wording and instrumentation`, action: "Narrow the claim to reported understanding or add appropriate performance, artifact, test, or observation evidence." } });
    }
    if (/demonstrat|appl|practice|perform/.test(claim) && !/observation|artifact|lesson plan|rubric|performance|output|recording/.test(source)) {
      items.push({ level: "yellow", text: `Review SRQ ${index + 1}: a demonstrated-practice claim may need observable or artifact-based evidence.`, evidence: { compared: "Intended claim and evidence source", matched: row.evidenceSource, mismatch: "No clear observation, artifact, performance, or output source detected", why: "Practice claims require evidence of action or produced work, not perception alone.", revisit: `Evidence source and instrument for SRQ ${index + 1}`, action: "Add observable evidence or revise the claim and justify the decision with your adviser." } });
    }
    if (/taught|curriculum|instruction/.test(claim) && !/syllab|curricul|document|policy|faculty|teacher educator|course/.test(source)) {
      items.push({ level: "yellow", text: `Review SRQ ${index + 1}: a claim about what is taught may need curriculum, syllabus, policy, or teacher-educator evidence.`, evidence: { compared: "Taught-content claim and evidence source", matched: row.evidenceSource, mismatch: "No formal teaching-content source detected", why: "Participant recall alone may not establish what the formal or enacted curriculum contains.", revisit: `Evidence source for SRQ ${index + 1}`, action: "Add documentary or educator evidence, or narrow the claim." } });
    }
    if (/expect|require|standard|policy/.test(claim) && !/policy|standard|document|administrator|school leader|teacher|employer/.test(source)) {
      items.push({ level: "yellow", text: `Review SRQ ${index + 1}: an expectations claim may need policy, administrator, practitioner, or institutional evidence.`, evidence: { compared: "Expectation claim and evidence source", matched: row.evidenceSource, mismatch: "No clear institutional-expectation source detected", why: "Expectations should be traceable to those who set, communicate, or enact them.", revisit: `Evidence source for SRQ ${index + 1}`, action: "Add an authoritative expectation source or qualify the claim." } });
    }
  });
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
  const rec = methodologyRecommendation();
  const selectedApproach = state.methodology.approach || "";
  return [
    flag(Boolean(selectedApproach), "A broad evidence approach is selected.", "Select Quantitative, Qualitative, or Mixed Methods after reviewing what the questions need."),
    flag(Boolean(state.methodology.design), "A research design is selected.", "Select a design within the chosen evidence approach."),
    flag(!selectedApproach || !rec.approach || rec.approach === selectedApproach, "The selected evidence approach is consistent with the current A4 purposes and intended claims.", `Review why ${approachLabel(selectedApproach) || "the selected approach"} fits better than ${approachLabel(rec.approach) || "the suggested candidate"}. A different choice may still be justified.`),
    flag(Boolean(state.methodology.designJustification), "The design choice is justified.", "Explain why this design fits the problem and questions better than the alternatives you considered."),
    flag(Boolean(state.methodology.participants), "Participants are described.", "Describe who will participate."),
    flag(Boolean(state.methodology.locale), "Research environment or setting is described.", "Describe the physical, institutional, social, document, or online environment relevant to the study."),
    flag(Boolean(state.methodology.evidenceSources), "Participants and other evidence sources are identified.", "Identify who or what provides evidence, including documents, artifacts, records, observations, or outputs where relevant."),
    flag(Boolean(state.methodology.studyPeriod), "Study period is bounded.", "State the relevant data collection or document period."),
    flag(Boolean(state.methodology.operationalDelimitations), "Operational delimitations are stated.", "State what the study includes and deliberately does not cover."),
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
    flag(Boolean(state.frameworkFinder.frameworkRoles), "Each selected framework has a distinct role.", "For each framework, explain the construct or relationship it explains and the section or interpretation it informs."),
    flag(Boolean(state.frameworkFinder.combinationReason), "The single-framework choice or combination is justified.", "If combining frameworks, explain what each contributes that the other does not. If using one, state that a combination is not needed."),
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
    if (!row.claimNeeded) results.push({ level: "yellow", text: `Row ${index + 1}: intended claim is missing.` });
    if (!row.evidenceNeeded) results.push({ level: "yellow", text: `Row ${index + 1}: evidence needed is missing.` });
    if (!row.evidenceSource) results.push({ level: "yellow", text: `Row ${index + 1}: evidence source is missing.` });
    if (!row.instrument) results.push({ level: "red", text: `Row ${index + 1}: instrument is missing.` });
    if (!row.analysis) results.push({ level: "yellow", text: `Row ${index + 1}: analysis is missing.` });
    if (!row.description) results.push({ level: "yellow", text: `Row ${index + 1}: instrument description is missing.` });
    if (!row.purpose) results.push({ level: "yellow", text: `Row ${index + 1}: instrument purpose is missing.` });
    if (!row.validation) results.push({ level: "yellow", text: `Row ${index + 1}: validation or reliability/trustworthiness is missing.` });
    if (!row.implementation) results.push({ level: "yellow", text: `Row ${index + 1}: instrument implementation is missing.` });
  });
  results.push(...purposeInstrumentationAlignmentItems());
  results.push(...claimEvidenceAlignmentItems());
  return results;
}

function checkTerms() {
  const rows = state.terms.rows.map(normalizeTermRow).filter((row) => row.term || row.conceptual || row.operational || row.measured);
  const results = [flag(rows.length > 0, "At least one key term is listed.", "Add one term at a time, starting with the core construct.")];
  rows.forEach((row, index) => {
    if (!row.term) results.push({ level: "red", text: `Term ${index + 1}: term name is missing.` });
    if (!row.conceptual) results.push({ level: "yellow", text: `Term ${index + 1}: conceptual definition is missing.` });
    else if (!conceptualDefinitionHasSource(row.conceptual)) results.push({ level: "yellow", text: `Term ${index + 1}: identify the author or authors and year supporting the conceptual definition.` });
    if (!row.operational) results.push({ level: "yellow", text: `Term ${index + 1}: operational definition is missing.` });
    if (!row.measured) results.push({ level: "yellow", text: `Term ${index + 1}: measurement, observation, or identification detail is missing.` });
  });
  return results;
}

function conceptualDefinitionHasSource(text = "") {
  return /[A-Za-z][A-Za-z .,&'-]{1,80}\(?\s*(?:19|20)\d{2}\s*\)?/.test(text);
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
  const evidence = item.evidence || (item.level !== "green" ? {
    compared: "The current answer and the requirements of this proposal stage",
    matched: "Any completed or traceable information already entered",
    mismatch: item.text,
    why: "The missing or unclear connection may weaken alignment or make the intended claim difficult to justify.",
    revisit: `The ${stages.find((stage) => stage.id === state.currentStage)?.title || "relevant"} section`,
    action: "Review, clarify, or justify the decision, then discuss unresolved choices with your adviser."
  } : null);
  return `<div class="feedback-item ${item.level}">
    <div>${escapeHtml(item.text)}</div>
    ${evidence ? `<details class="evidence-feedback"><summary>Why this guidance appears</summary><div class="evidence-grid">
      <span><strong>Compared:</strong> ${escapeHtml(evidence.compared || "Relevant proposal sections")}</span>
      <span><strong>Match found:</strong> ${escapeHtml(evidence.matched || "No clear match detected")}</span>
      <span><strong>Review:</strong> ${escapeHtml(evidence.mismatch || "No mismatch identified")}</span>
      <span><strong>Why it matters:</strong> ${escapeHtml(evidence.why || "Alignment supports a defensible research plan.")}</span>
      <span><strong>Revisit:</strong> ${escapeHtml(evidence.revisit || "Discuss this decision with your adviser.")}</span>
      <span><strong>Suggested action:</strong> ${escapeHtml(evidence.action || "Clarify or justify the connection.")}</span>
    </div></details>` : ""}
  </div>`;
}

function readinessReport() {
  const baseItems = [
    flag(Boolean(state.a1.coreConstruct || state.a1.rrlMajorityTest) && state.a2.patterns.some((row) => row.notice && row.authors), "Core Construct to Literature Patterns: aligned.", "Core Construct to Literature Patterns: add a core construct and literature patterns with supporting authors."),
    flag(state.a2.patterns.some((row) => row.notice) && Boolean(state.a3.finalGap), "Patterns to Gap: aligned.", "Patterns to Gap: connect A2 patterns to a final A3 gap."),
    flag(Boolean(state.a3.finalGap) && Boolean(state.a4.literatureProblem), "Gap to Problem: aligned.", "Gap to Problem: translate the A3 final gap into a literature-based problem."),
    flag(Boolean(state.a4.literatureProblem) && Boolean(state.a4.centralQuestion) && state.a4.questions.some(Boolean), "Problem to Questions: aligned.", "Problem to Questions: add a literature-based problem, central question, and SRQs."),
    flag(Boolean(state.a4.centralFocus) && Boolean(state.a4.studyComponents), "Central focus and study components are distinguished.", "Clarify the central phenomenon or relationship and the components needed to examine it."),
    flag(Boolean(state.methodology.locale) && Boolean(state.methodology.evidenceSources), "Research environment and evidence sources are identified separately.", "Distinguish the research environment from participants, documents, artifacts, observations, and other evidence sources."),
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
    ...claimEvidenceAlignmentItems(),
    ...checkTerms()
  ];
  const score = Math.round((items.filter((item) => item.level === "green").length / Math.max(items.length, 1)) * 100);
  const label = score >= 80 ? "Ready for adviser review" : score >= 50 ? "Needs alignment review" : "Needs development";
  return { score, label, items };
}

function stageCompletion(stageId) {
  const section = state[stageId] || {};
  if (stageId === "details") {
    const common = ["adviserName", "course", "section", "submissionDate"].filter((field) => state.submission[field]).length;
    if (state.submission.workArrangement === "group") {
      const people = [state.submission.groupLeader, ...state.submission.groupMembers];
      const peopleTotal = Math.max(people.length * 2, 2);
      const peopleDone = people.reduce((sum, person) => sum + [person.name, person.initialReadiness].filter(Boolean).length, 0);
      return (common + peopleDone) / (4 + peopleTotal);
    }
    const individual = ["studentName", "initialReadiness"].filter((field) => state.submission[field]).length;
    return (common + individual) / 6;
  }
  if (stageId === "submission") {
    if (state.submission.workArrangement === "group") {
      const people = [state.submission.groupLeader, ...state.submission.groupMembers];
      if (!people.length) return 0;
      return people.reduce((sum, person) => sum + [person.confidence, person.readinessChange].filter(Boolean).length, 0) / (people.length * 2);
    }
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
    const fields = ["literatureProblem", "centralQuestion", "centralFocus", "studyComponents", "centralPurpose", "rqConstructs"];
    const questionSlots = state.a4.questions.length * 4;
    const questionFilled = state.a4.questions.reduce((sum, question, index) => sum + [question, state.a4.questionFocuses[index], state.a4.questionPurposes[index], state.a4.questionClaims[index]].filter(Boolean).length, 0);
    return (fields.filter((field) => state.a4[field]).length / fields.length + (questionSlots ? questionFilled / questionSlots : 0)) / 2;
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
    const fields = ["rqTypes", "dataNeeded", "participants", "purpose", "evidenceSources", "studyPeriod", "operationalDelimitations", "approach", "design", "designJustification", "sampling", "locale", "collection", "analysis"];
    const baseProgress = fields.filter((field) => state.methodology[field]).length / fields.length;
    if (!isMixedMethodsLikely()) return baseProgress;
    const mixedFields = ["quantStrand", "qualStrand", "integrationPoint", "integrationPurpose"];
    const mixedProgress = mixedFields.filter((field) => state.mixedMethods[field]).length / mixedFields.length;
    return (baseProgress + mixedProgress) / 2;
  }
  if (stageId === "instrumentation") {
    const rows = state.instrumentation.rows.map(normalizeInstrumentRow).filter((row) => row.rq || row.instrument || row.claimNeeded);
    if (!rows.length) return 0;
    const required = ["rq", "claimNeeded", "evidenceNeeded", "evidenceSource", "instrument", "analysis", "description", "purpose", "validation", "implementation"];
    const filled = rows.reduce((sum, row) => sum + required.filter((field) => row[field]).length, 0);
    return filled / (rows.length * required.length);
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
  const completion = overallCompletion();
  const score = readinessReport().score;
  els.completionText.textContent = `${completion}%`;
  els.completionBar.style.width = `${completion}%`;
  els.alignmentScore.textContent = score;
  updateActiveTimeDisplay();
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
    ["claimNeeded", "Claim Needed"],
    ["evidenceNeeded", "Evidence Needed"],
    ["evidenceSource", "Evidence Source"],
    ["instrument", "Instrument / Procedure"],
    ["analysis", "Analysis"],
    ["description", "Description"],
    ["purpose", "Purpose"],
    ["validation", "Validation"],
    ["implementation", "Implementation"]
  ];
  rows = rows.map(normalizeInstrumentRow);
  const shouldStack = labels.length > 6 || rows.some((row) => wordCount(Object.values(row).join(" ")) > 150);
  if (shouldStack) {
    return `<div class="instrument-cards">${rows.map((row, index) => `
      <section class="instrument-card">
        <h3>Instrument Row ${index + 1}</h3>
        ${labels.map(([key, label]) => `<p><strong>${label}:</strong> ${escapeHtml(row[key])}</p>`).join("")}
      </section>
    `).join("")}</div>`;
  }
  const instrumentRows = rows.map((row) => `<tr>${labels.map(([key]) => `<td>${escapeHtml(row[key])}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${labels.map(([, label]) => `<th>${escapeHtml(label)}</th>`).join("")}</tr></thead><tbody>${instrumentRows}</tbody></table>`;
}

function termsOutputHtml(rows) {
  rows = rows.map(normalizeTermRow).filter((row) => row.term || row.conceptual || row.operational || row.measured);
  if (!rows.length) return "<p>No definition of terms entries have been added.</p>";
  return `<div class="instrument-cards">${rows.map((row, index) => `
    <section class="instrument-card">
      <h3>Term ${index + 1}: ${escapeHtml(row.term)}</h3>
      <p><strong>Conceptual Definition (Author/s and Year):</strong> ${escapeHtml(row.conceptual)}</p>
      <p><strong>Operational Definition:</strong> ${escapeHtml(row.operational)}</p>
      <p><strong>Measured, Observed, or Identified Through:</strong> ${escapeHtml(row.measured)}</p>
    </section>
  `).join("")}</div>`;
}

function readinessPrintSummaryHtml(report, includeWorkRecord = true) {
  const warnings = report.items.filter((item) => item.level !== "green");
  const degreeReadiness = degreeLevelReadiness();
  const frameworkReady = Boolean(
    state.frameworkFinder.literatureSignals &&
    state.frameworkFinder.candidateFrameworks &&
    state.frameworkFinder.frameworkSource &&
    state.frameworkFinder.selectionReason &&
    state.frameworkFinder.frameworkRoles &&
    state.frameworkFinder.combinationReason &&
    state.frameworkFinder.withoutFramework &&
    state.frameworkFinder.methodFit &&
    state.framework.theoryModel &&
    state.framework.problemConnection &&
    state.framework.questionConnection &&
    state.framework.instrumentConnection &&
    state.framework.scopeBoundaries
  );
  const methodologyReady = Boolean(state.methodology.approach && state.methodology.design && state.methodology.designJustification && state.methodology.participants && state.methodology.locale && state.methodology.evidenceSources && state.methodology.operationalDelimitations && state.methodology.collection && state.methodology.analysis);
  const ethicsReady = Boolean(state.methodology.participants && Object.values(state.ethics.checks).some(Boolean));
  const instrumentsReady = state.instrumentation.rows.map(normalizeInstrumentRow).some((row) => row.rq && row.claimNeeded && row.evidenceNeeded && row.evidenceSource && row.instrument && row.analysis && row.description && row.purpose && row.validation && row.implementation);
  const mixedMethodsReady = !isMixedMethodsLikely() || Boolean(state.mixedMethods.quantStrand && state.mixedMethods.qualStrand && state.mixedMethods.integrationPoint && state.mixedMethods.integrationPurpose);
  const termsRows = state.terms.rows.map(normalizeTermRow).filter((row) => row.term || row.conceptual || row.operational || row.measured);
  const termsReady = termsRows.length > 0 && termsRows.every((row) => row.term && row.conceptual && conceptualDefinitionHasSource(row.conceptual) && row.operational && row.measured);
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
    ["Alignment status", report.label],
    ...levelRows,
    ["Framework and conceptual-scope status", frameworkReady ? "The framework is literature-supported, justified, and connected to the problem, questions, evidence, and conceptual scope." : "Framework finding, source support, distinct roles, fit reasoning, or conceptual scope still needs detail."],
    ["Methodology status", methodologyReady ? "Methodology includes a justified approach and design, participants, boundaries, evidence sources, data gathering, and analysis." : "Methodology is missing a justified approach or design, participants, boundaries, evidence sources, data gathering, or analysis."],
    ["Mixed methods status", mixedMethodsReady ? "Mixed methods integration is complete or not required." : "Mixed methods integration needs quantitative, qualitative, and integration details."],
    ["Ethics status", ethicsReady ? "Ethics safeguards have been started." : "Ethics safeguards need more detail before data gathering."],
    ["Formatting status", "Letter-size print layout with 1-inch margins is applied."],
    ["Instrumentation status", instrumentsReady ? "At least one instrument row includes alignment and validation details." : "Instrumentation needs clearer alignment or validation details."],
    ["Definition of terms status", termsReady ? "Terms are conceptually defined with author and year, then operationally defined for this study." : "Definition of terms needs a cited conceptual definition, operational definition, and measurement or observation details."]
  ];
  return `
    ${includeWorkRecord ? workRecordHtml() : ""}
    <div class="readiness-summary">
      ${statusRows.map(([label, text]) => `<p><strong>${label}:</strong> ${escapeHtml(text)}</p>`).join("")}
    </div>
    <h3>Warnings</h3>
    ${warnings.length ? `<div class="feedback">${warnings.map((item) => {
      const evidence = item.evidence || { compared: "Relevant proposal sections", matched: "Completed information", mismatch: item.text, why: "The connection may need clarification.", revisit: "Relevant proposal section", action: "Review and discuss with your adviser." };
      return `<section class="feedback-item ${item.level}"><strong>${escapeHtml(item.text)}</strong><div class="evidence-grid"><span><strong>Compared:</strong> ${escapeHtml(evidence.compared)}</span><span><strong>Match found:</strong> ${escapeHtml(evidence.matched)}</span><span><strong>Review:</strong> ${escapeHtml(evidence.mismatch)}</span><span><strong>Why it matters:</strong> ${escapeHtml(evidence.why)}</span><span><strong>Revisit:</strong> ${escapeHtml(evidence.revisit)}</span><span><strong>Suggested action:</strong> ${escapeHtml(evidence.action)}</span></div></section>`;
    }).join("")}</div>` : "<p>No major warnings detected.</p>"}
    <p><strong>Adviser-review reminder:</strong> The app provides developmental guidance and alignment checks. Its outputs do not constitute adviser, panel, or institutional approval. Research decisions remain subject to scholarly justification and adviser review.</p>
  `;
}

function workRecordHtml() {
  return `<section class="work-record"><h2>Work Record</h2>
    <p><strong>Work started:</strong> ${escapeHtml(formatTimestamp(state.engagement.workStartedAt))}<br>
    <strong>Last edited:</strong> ${escapeHtml(formatTimestamp(state.engagement.lastEditedAt))}<br>
    <strong>Estimated active work time:</strong> ${escapeHtml(formatActiveTime(state.engagement.activeMs))}<br>
    <strong>Manual checkpoints created:</strong> ${escapeHtml(String(state.engagement.manualCheckpoints || 0))}</p>
    <p>Estimated active work time reflects detected interaction with this app only. It does not include work completed outside the app and should not be interpreted as a measure of research quality.</p></section>`;
}

function submissionIdentityHtml() {
  if (state.submission.workArrangement !== "group") {
    return `<strong>Student Name:</strong> ${escapeHtml(value("submission.studentName"))}`;
  }
  const members = state.submission.groupMembers.map((person) => person.name).filter(Boolean);
  return `<strong>Work Arrangement:</strong> Group<br>
    ${state.submission.groupName ? `<strong>Group Name:</strong> ${escapeHtml(state.submission.groupName)}<br>` : ""}
    <strong>Student completing this copy:</strong> ${escapeHtml(state.submission.studentName || "________________________")}<br>
    <strong>Group Leader:</strong> ${escapeHtml(state.submission.groupLeader.name)}<br>
    <strong>Group Members:</strong> ${escapeHtml(members.join(", ") || "None listed")}`;
}

function readinessReflectionsHtml() {
  if (state.submission.workArrangement !== "group") {
    return `<h2>Readiness Reflections</h2>
      <h3>Initial Readiness Reflection</h3><p>${escapeHtml(value("submission.initialReadiness"))}</p>
      <h3>Final Readiness Reflection</h3><p>${escapeHtml(value("submission.confidence"))}</p>
      <h3>What Changed and Why</h3><p>${escapeHtml(value("submission.readinessChange"))}</p>`;
  }
  return `<h2>Personal Group-Work Reflection</h2>
    <p><strong>Student completing this copy:</strong> ${escapeHtml(state.submission.studentName || "")}</p>
    <p>${escapeHtml(state.submission.personalGroupReflection || "")}</p>`;
}

function contributionAppendixHtml(stageIds) {
  if (state.submission.workArrangement !== "group") return "";
  const ids = stageIds.filter(isAcademicStage);
  if (!ids.length) return "";
  return `<section class="contribution-appendix major-section">
    <h2>Confidential Team Contribution Records</h2>
    <p><strong>For Adviser Review Only.</strong> These are original, nonvalidated developmental records. The app does not score, rank, interpret, or adjust grades.</p>
    ${ids.map((stageId) => {
      const stage = stages.find((item) => item.id === stageId);
      const record = state.teamContributions[stageId];
      if (!record) return `<section class="contribution-print-card"><h3>${escapeHtml(stage.code)} - ${escapeHtml(stage.title)}</h3><p>No contribution record was entered.</p></section>`;
      const rows = record.rosterSnapshot.map((person) => {
        const assessment = record.assessments[person.id] || {};
        const level = CONTRIBUTION_LEVELS.find(([key]) => key === assessment.level)?.[1] || "Not entered";
        const behaviors = (assessment.behaviors || []).map((key) => CONTRIBUTION_BEHAVIORS.find(([name]) => name === key)?.[1]).filter(Boolean).join(", ");
        return `<tr><td>${escapeHtml(person.name || "Unnamed member")}</td><td>${escapeHtml(level)}</td><td>${escapeHtml(behaviors || "None selected")}</td><td>${escapeHtml(assessment.evidence || "")}</td><td>${escapeHtml(assessment.context || "")}</td></tr>`;
      }).join("");
      return `<section class="contribution-print-card"><h3>${escapeHtml(stage.code)} - ${escapeHtml(stage.title)}</h3>
        <table><thead><tr><th>Person assessed</th><th>Contribution level</th><th>Observable contributions</th><th>Factual evidence</th><th>Context or concern</th></tr></thead><tbody>${rows}</tbody></table>
        ${adviserReviewBlock(stage)}</section>`;
    }).join("")}
    <p class="hint">Adviser analysis, synthesis, interpretation, and grading judgment are outside the app.</p>
  </section>`;
}

function adviserReviewBlock(stage) {
  return `<section class="adviser-review-block">
    <h3>Adviser Review Record: ${escapeHtml(stage.code)} - ${escapeHtml(stage.title)}</h3>
    <div class="review-lines"><span><strong>Reviewed by:</strong> ${escapeHtml(state.submission.adviserName || "________________________")}</span><span><strong>Signature:</strong> ________________________</span><span><strong>Date reviewed:</strong> ________________________</span></div>
  </section>`;
}

function finalAdviserReviewRecordHtml() {
  const academicStages = stages.filter((stage) => !["details", "submission"].includes(stage.id));
  return `<section class="major-section adviser-review-record"><h2>Adviser Review Record</h2>
    <p><strong>Adviser:</strong> ${escapeHtml(state.submission.adviserName || "________________________")}</p>
    <p>This record documents review. It does not indicate institutional or ethics approval.</p>
    <table><thead><tr><th>Academic Part</th><th>Reviewed by</th><th>Signature</th><th>Date reviewed</th></tr></thead><tbody>
      ${academicStages.map((stage) => `<tr><td>${escapeHtml(stage.code)} - ${escapeHtml(stage.title)}</td><td>${escapeHtml(state.submission.adviserName || "")}</td><td></td><td></td></tr>`).join("")}
    </tbody></table></section>`;
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
    "Research Environment or Setting",
    "Evidence Sources and Period",
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
  const degreeReadiness = degreeLevelReadiness();
  const generatedAt = new Date();
  const printedBy = state.submission.workArrangement === "group" ? (state.submission.groupLeader.name || state.submission.groupName || "__________") : (value("submission.studentName") || "__________");
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
    <p>${submissionIdentityHtml()}<br>
    <strong>Adviser Name:</strong> ${escapeHtml(value("submission.adviserName"))}<br>
    <strong>Course:</strong> ${escapeHtml(value("submission.course"))}<br>
    <strong>Section:</strong> ${escapeHtml(value("submission.section"))}<br>
    <strong>Date:</strong> ${escapeHtml(value("submission.submissionDate"))}<br>
    <strong>Research Level / Use Context:</strong> ${escapeHtml(degreeReadiness.degree.label)} (${escapeHtml(degreeReadiness.degree.pqf)})</p>
    ${readinessReflectionsHtml()}
    <h2>A1 Core Construct</h2>
    <p>${escapeHtml(buildTopic())}</p>
    <h2 class="major-section">A2 Literature Pattern Mapping</h2>
    <table><thead><tr><th>Pattern Type</th><th>What appears across studies</th><th>Supporting Authors</th><th>Year</th></tr></thead><tbody>${patternRows}</tbody></table>
    <h2 class="major-section">A3 Literature Gap</h2>
    <table><thead><tr><th>Pattern Type</th><th>Studies Repeatedly Show</th><th>Emphasized</th><th>Less Visible</th><th>Limits Understanding Of</th><th>Refined Gap</th></tr></thead><tbody>${gapRows}</tbody></table>
    <p><strong>Final gap:</strong> ${escapeHtml(value("a3.finalGap"))}</p>
    <h2 class="major-section">A4 Literature-Based Problem</h2>
    <p><strong>Original A3 Gap:</strong> ${escapeHtml(value("a3.finalGap"))}</p>
    ${state.a4.refinedGap ? `<p><strong>Refined Gap Used in A4:</strong> ${escapeHtml(state.a4.refinedGap)}</p>` : ""}
    <p>${escapeHtml(buildProblem())}</p>
    <p><strong>Central Study Focus:</strong> ${escapeHtml(value("a4.centralFocus"))}</p>
    <p><strong>Study Components:</strong> ${escapeHtml(value("a4.studyComponents"))}</p>
    <p><strong>Central research question:</strong> ${escapeHtml(value("a4.centralQuestion"))}</p>
    <h2>Specific Research Questions</h2>
    <ol>${state.a4.questions.filter(Boolean).map((q) => `<li>${escapeHtml(q)}</li>`).join("")}</ol>
    <h2 class="major-section">Framework and Conceptual Scope</h2>
    <p><strong>Research Pathway:</strong> ${escapeHtml(value("frameworkFinder.pathway") === "theory-led" ? "Theory-led" : "Problem-led")}</p>
    <p><strong>Selected Framework or Combination:</strong> ${escapeHtml(value("framework.theoryModel"))}</p>
    <p><strong>Authoritative Sources:</strong> ${escapeHtml(value("frameworkFinder.frameworkSource"))}</p>
    <p><strong>Selection Justification:</strong> ${escapeHtml(value("frameworkFinder.selectionReason"))}</p>
    <p><strong>Distinct Roles:</strong> ${escapeHtml(value("frameworkFinder.frameworkRoles"))}</p>
    <p><strong>Combination Justification:</strong> ${escapeHtml(value("frameworkFinder.combinationReason"))}</p>
    <p><strong>Connection to the Problem:</strong> ${escapeHtml(value("framework.problemConnection"))}</p>
    <p><strong>Connection to the Questions:</strong> ${escapeHtml(value("framework.questionConnection"))}</p>
    <p><strong>Connection to Instruments or Analysis:</strong> ${escapeHtml(value("framework.instrumentConnection"))}</p>
    <p><strong>Conceptual Scope:</strong> ${escapeHtml(value("framework.scopeBoundaries"))}</p>
    <h2 class="major-section">Research Level Justification</h2>
    ${state.submission.degreeLevel === "shs" ? `<p><strong>PQF Reference:</strong> ${escapeHtml(PQF_REFERENCE)}</p><p><strong>SHS / PQF Level 3 Note:</strong> Advanced ideas are welcome. The proposal should still be scoped to structured research tasks, emerging independence, available time, data, guidance, and ethical safeguards.</p>` : `<p><strong>PQF Reference:</strong> ${escapeHtml(PQF_REFERENCE)}</p><p><strong>Formative Note:</strong> ${escapeHtml(PQF_NOTE)}</p>`}
    ${fieldSets.researchLevel.map(([key, label]) => `<h3>${escapeHtml(label)}</h3><p>${escapeHtml(value(`researchLevel.${key}`))}</p>`).join("")}
    <h2 class="major-section">Methodology</h2>
    <p><strong>Research Design:</strong> ${escapeHtml(value("methodology.selectedDesign"))}</p>
    <p><strong>Design Justification:</strong> ${escapeHtml(value("methodology.designJustification"))}</p>
    <p><strong>Operational Delimitations:</strong> ${escapeHtml(value("methodology.operationalDelimitations"))}</p>
    <p><strong>Participants:</strong> ${escapeHtml(value("methodology.participants"))}</p>
    <p><strong>Sampling:</strong> ${escapeHtml(value("methodology.sampling"))}</p>
    <p><strong>Research Environment or Setting:</strong> ${escapeHtml(value("methodology.locale"))}</p>
    <p><strong>Evidence Sources:</strong> ${escapeHtml(value("methodology.evidenceSources"))}</p>
    <p><strong>Study Period:</strong> ${escapeHtml(value("methodology.studyPeriod"))}</p>
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
    ${finalAdviserReviewRecordHtml()}
    ${contributionAppendixHtml(stages.filter((stage) => isAcademicStage(stage.id)).map((stage) => stage.id))}
    <footer><p>Generated by Lit-Based Proposal Builder (${escapeHtml(APP_VERSION)})<br>
    ${escapeHtml(APP_CREDIT)}<br>
    Printed by ${escapeHtml(printedBy)} on ${escapeHtml(formatTimestamp(generatedAt))}.</p></footer>
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
    ${submissionIdentityHtml()}<br>
    <strong>Adviser Name:</strong> ${escapeHtml(value("submission.adviserName"))}<br>
    <strong>Course:</strong> ${escapeHtml(value("submission.course"))}<br>
    <strong>Section:</strong> ${escapeHtml(value("submission.section"))}<br>
    <strong>Date:</strong> ${escapeHtml(value("submission.submissionDate"))}<br>
    <strong>Research Level / Use Context:</strong> ${escapeHtml(degree.label)} (${escapeHtml(degree.pqf)})</p>
    ${workRecordHtml()}
    ${selectedStages.map((stage) => `${progressStageHtml(stage.id)}${contributionAppendixHtml([stage.id])}${adviserReviewBlock(stage)}`).join("")}
    <footer><p>Generated by Lit-Based Proposal Builder (${escapeHtml(APP_VERSION)})<br>
    Printed by ${escapeHtml(state.submission.workArrangement === "group" ? (state.submission.groupLeader.name || state.submission.groupName || "__________") : (value("submission.studentName") || "__________"))} on ${escapeHtml(formatTimestamp(generatedAt))}.<br>
    The app provides developmental guidance and alignment checks. Its outputs do not constitute adviser, panel, or institutional approval.</p></footer>
  `;
}

function progressStageHtml(stageId) {
  if (stageId === "details") {
    return `<h2 class="major-section">Student Details</h2>
      <p>${submissionIdentityHtml()}<br><strong>Adviser Name:</strong> ${escapeHtml(value("submission.adviserName"))}</p>
      ${readinessReflectionsHtml()}`;
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
      <h3>Original A3 Gap</h3><p>${escapeHtml(value("a3.finalGap"))}</p>
      <h3>Refined Gap Used in A4</h3><p>${escapeHtml(value("a4.refinedGap"))}</p>
      <h3>Reason for Gap Revision</h3><p>${escapeHtml(value("a4.gapRevisionReason"))}</p>
      <h3>Literature-Based Problem</h3><p>${escapeHtml(value("a4.literatureProblem"))}</p>
      <h3>Central Study Focus</h3><p>${escapeHtml(value("a4.centralFocus"))}</p>
      <h3>Study Components</h3><p>${escapeHtml(value("a4.studyComponents"))}</p>
      <h3>Research Environment or Setting</h3><p>${escapeHtml(value("methodology.locale"))}</p>
      <h3>Central Research Question</h3><p>${escapeHtml(value("a4.centralQuestion"))}</p>
      <h3>Specific Research Questions</h3><ol>${state.a4.questions.filter(Boolean).map((q, index) => `<li>${escapeHtml(q)}<br><strong>Specific focus:</strong> ${escapeHtml(state.a4.questionFocuses[index])}<br><strong>Intended claim:</strong> ${escapeHtml(state.a4.questionClaims[index])}</li>`).join("")}</ol>`;
  }
  if (stageId === "framework") {
    return `<h2 class="major-section">Framework Finder and Alignment</h2>
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
      <p><strong>Design Justification:</strong> ${escapeHtml(value("methodology.designJustification"))}</p>
      <p><strong>Sampling:</strong> ${escapeHtml(value("methodology.sampling"))}</p>
      <p><strong>Research Environment or Setting:</strong> ${escapeHtml(value("methodology.locale"))}</p>
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
    return `<h2 class="major-section">Proposal Readiness Report</h2>${readinessPrintSummaryHtml(readinessReport(), false)}`;
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
  const missing = progressSubmissionMissingItems(stageId, scope);
  if (missing.length) {
    alert(`This progress submission is locked until the personal declaration and contribution record are complete.\n\nMissing:\n${missing.slice(0, 10).map((item) => `- ${item}`).join("\n")}`);
    return;
  }
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
    const missing = progressSubmissionMissingItems(activeProgressPrint.stageId, activeProgressPrint.scope);
    if (missing.length) {
      alert(`This progress submission is locked until the personal declaration and contribution record are complete.\n\nMissing:\n${missing.slice(0, 10).map((item) => `- ${item}`).join("\n")}`);
      return;
    }
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

  requireValue("submission.adviserName", "Adviser name");
  if (!state.submission.personalDeclaration) missing.push("Personal copy declaration");
  if (state.submission.workArrangement === "group") {
    if (!state.submission.groupLeader.name) missing.push("Group leader name");
    if (!state.submission.groupMembers.length) missing.push("At least one group member");
    if (!state.submission.studentId) missing.push("Student completing this copy");
    if (!state.submission.studentName) missing.push("Student completing this copy: name");
    requireValue("submission.personalGroupReflection", "Personal group-work reflection");
    missing.push(...contributionMissingForStages(stages.filter((stage) => isAcademicStage(stage.id)).map((stage) => stage.id)));
  } else {
    requireValue("submission.studentName", "Student name");
    requireValue("submission.initialReadiness", "Initial readiness reflection");
  }
  requireValue("submission.course", "Course");
  requireValue("submission.section", "Section");
  requireValue("submission.submissionDate", "Date");

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

  [["literatureProblem", "literature-based problem"], ["centralFocus", "central study focus"], ["studyComponents", "study components"], ["centralPurpose", "broad inquiry purpose"], ["centralQuestion", "central research question"], ["rqConstructs", "required construct and gap ideas"]].forEach(([key, label]) => requireValue(`a4.${key}`, `A4: ${label}`));
  if (state.a4.refinedGap && !state.a4.gapRevisionReason) missing.push("A4: reason for refining the A3 gap");
  const questions = state.a4.questions.filter((question) => question.trim());
  if (questions.length < SRQ_LIMITS.minimum || questions.length > SRQ_LIMITS.maximum) {
    missing.push(`A4: ${SRQ_LIMITS.minimum}-${SRQ_LIMITS.maximum} specific research questions`);
  }
  questions.forEach((question, index) => {
    if (!state.a4.questionPurposes[index]) missing.push(`A4: purpose for SRQ ${index + 1}`);
    if (!state.a4.questionFocuses[index]) missing.push(`A4: specific focus for SRQ ${index + 1}`);
    if (!state.a4.questionClaims[index]) missing.push(`A4: intended claim for SRQ ${index + 1}`);
  });

  ["theoryModel", "problemConnection", "questionConnection", "instrumentConnection", "scopeBoundaries"].forEach((key) => {
    requireValue(`framework.${key}`, `Framework Alignment: ${fieldSets.framework.find((field) => field[0] === key)?.[1] || key}`);
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

  ["rqTypes", "dataNeeded", "participants", "purpose", "evidenceSources", "studyPeriod", "operationalDelimitations"].forEach((key) => {
    requireValue(`methodology.${key}`, `Methodology: ${fieldSets.methodology.find((field) => field[0] === key)?.[1] || key}`);
  });
  ["approach", "design", "designJustification", "selectedDesign", "sampling", "locale", "collection", "analysis"].forEach((key) => {
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
    ["claimNeeded", "evidenceNeeded", "evidenceSource", "instrument", "analysis", "description", "purpose", "validation", "implementation"].forEach((key) => {
      if (!row[key]) missing.push(`Instrumentation: ${key} for SRQ ${index + 1}`);
    });
  });

  const termRows = state.terms.rows.map(normalizeTermRow).filter((row) => row.term || row.conceptual || row.operational || row.measured);
  if (!termRows.length) missing.push("Definition of Terms: at least one term card");
  termRows.forEach((row, index) => {
    if (!row.term) missing.push(`Definition of Terms: term name for Term ${index + 1}`);
    if (!row.conceptual) missing.push(`Definition of Terms: conceptual definition for Term ${index + 1}`);
    else if (!conceptualDefinitionHasSource(row.conceptual)) missing.push(`Definition of Terms: author/s and year for the conceptual definition of Term ${index + 1}`);
    if (!row.operational) missing.push(`Definition of Terms: operational definition for Term ${index + 1}`);
    if (!row.measured) missing.push(`Definition of Terms: measurement, observation, or identification detail for Term ${index + 1}`);
  });

  if (state.submission.workArrangement !== "group") {
    requireValue("submission.confidence", "Final readiness reflection");
    requireValue("submission.readinessChange", "What changed and why");
  }

  return missing;
}

function contributionMissingForStages(stageIds = []) {
  if (state.submission.workArrangement !== "group") return [];
  const missing = [];
  const roster = groupRoster();
  stageIds.filter(isAcademicStage).forEach((stageId) => {
    const stage = stages.find((item) => item.id === stageId);
    const record = state.teamContributions[stageId];
    if (!record) {
      missing.push(`${stage.code}: confidential Team Contribution Record`);
      return;
    }
    roster.forEach((person) => {
      const issues = contributionAssessmentMissing(record.assessments?.[person.id]);
      issues.forEach((issue) => missing.push(`${stage.code}: ${person.name || "Unnamed member"} - ${issue}`));
    });
  });
  return missing;
}

function progressSubmissionMissingItems(stageId, scope) {
  if (state.submission.workArrangement !== "group") return [];
  const selectedStages = progressStageList(stageId, scope).map((stage) => stage.id);
  const missing = [];
  if (!state.submission.personalDeclaration) missing.push("Personal copy declaration");
  if (!state.submission.studentId || !state.submission.studentName) missing.push("Student completing this copy");
  missing.push(...contributionMissingForStages(selectedStages));
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
  const form = document.getElementById("studentDetailsDialogForm");
  if (form) form.innerHTML = renderStudentDetailsForm("details-");
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
  const backup = { backupFormat: "lit-based-proposal-builder", appVersion: APP_VERSION, schemaVersion: SCHEMA_VERSION, state, checkpoints };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `proposal-builder-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadAppFeedbackReport() {
  const entries = stages.map((stage) => ({ stage, feedback: appFeedback[stage.id] })).filter((entry) => entry.feedback && Object.values(entry.feedback).some(Boolean));
  const degree = degreeLevelInfo();
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Lit-Based Proposal Builder App Feedback</title><style>body{font-family:Arial,sans-serif;max-width:850px;margin:40px auto;padding:0 24px;color:#1e2528}section{border-top:1px solid #ccd4d6;padding:18px 0}h1,h2{color:#214f48}dt{font-weight:bold;margin-top:8px}dd{margin-left:0}</style></head><body>
    <h1>Anonymous App Feedback Report</h1>
    <p><strong>App version:</strong> ${escapeHtml(APP_VERSION)}<br><strong>Research level / use context:</strong> ${escapeHtml(degree.label)}<br><strong>Generated:</strong> ${escapeHtml(formatTimestamp(new Date()))}</p>
    <p>This report contains app-experience ratings and comments only. It excludes student identity and proposal answers.</p>
    ${entries.length ? entries.map(({ stage, feedback }) => `<section><h2>${escapeHtml(stage.code)} - ${escapeHtml(stage.title)}</h2><dl><dt>Clarity</dt><dd>${escapeHtml(feedback.clarity || "Not rated")}/5</dd><dt>Helpfulness</dt><dd>${escapeHtml(feedback.helpfulness || "Not rated")}/5</dd><dt>Difficulty</dt><dd>${escapeHtml(feedback.difficulty || "Not rated")}</dd><dt>Confusing or unnecessary</dt><dd>${escapeHtml(feedback.confusion || "No comment")}</dd><dt>Suggested improvement</dt><dd>${escapeHtml(feedback.suggestion || "No comment")}</dd></dl></section>`).join("") : "<p>No app feedback has been entered yet.</p>"}
  </body></html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `lit-based-proposal-builder-feedback-${new Date().toISOString().slice(0, 10)}.html`;
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
    markInteraction();
    if (target.dataset.contributionStage && target.dataset.contributionKey) {
      const record = contributionRecord(target.dataset.contributionStage);
      const assessment = record.assessments[target.dataset.contributionPerson] || normalizeContributionAssessment();
      assessment[target.dataset.contributionKey] = target.value;
      record.assessments[target.dataset.contributionPerson] = assessment;
      record.updatedAt = new Date().toISOString();
      markContentEdit();
      saveState();
      return;
    }
    if (target.dataset.appFeedback) {
      saveAppFeedbackField(target.dataset.appFeedback, target.value);
      return;
    }
    if (target.dataset.groupPersonKey) {
      const person = target.dataset.groupPersonRole === "leader"
        ? state.submission.groupLeader
        : state.submission.groupMembers[Number(target.dataset.groupPersonIndex)];
      if (person) {
        person[target.dataset.groupPersonKey] = target.value;
        if (target.dataset.groupPersonKey === "name" && person.id === state.submission.studentId) state.submission.studentName = target.value;
        markContentEdit();
        saveState();
      }
      return;
    }
    if (target.dataset.ethicsDocument) {
      state.ethics.documents[target.dataset.ethicsDocument] = target.value;
      markContentEdit();
      saveState();
      return;
    }
    if (target.dataset.section && target.dataset.key) {
      setValue(target.dataset.section, target.dataset.key, target.value);
    }
    if (target.dataset.array === "a4.questions") {
      state.a4.questions[Number(target.dataset.index)] = target.value;
      markInteraction();
      saveState();
    }
    if (target.dataset.questionFocus !== undefined) {
      state.a4.questionFocuses[Number(target.dataset.questionFocus)] = target.value;
      markContentEdit();
      saveState();
    }
    if (target.dataset.questionClaim !== undefined) {
      state.a4.questionClaims[Number(target.dataset.questionClaim)] = target.value;
      markContentEdit();
      saveState();
    }
    if (target.dataset.questionPurpose !== undefined) {
      const questionIndex = Number(target.dataset.questionPurpose);
      state.a4.questionPurposes[questionIndex] = target.value;
      markContentEdit();
      saveState();
      const starter = target.closest(".question-card")?.querySelector(".generated-text");
      if (starter) starter.textContent = questionStarterHint(questionIndex);
    }
    if (target.dataset.table) {
      const collection = getTableRows(target.dataset.table);
      collection[Number(target.dataset.index)][target.dataset.key] = target.value;
      markContentEdit();
      saveState();
      if (target.dataset.table === "terms") {
        updateTermPreview(Number(target.dataset.index));
      }
    }
  });

  document.addEventListener("change", (event) => {
    const target = event.target;
    markInteraction();
    if (target.dataset.contributionStage && target.dataset.contributionKey) {
      const record = contributionRecord(target.dataset.contributionStage);
      const assessment = record.assessments[target.dataset.contributionPerson] || normalizeContributionAssessment();
      assessment[target.dataset.contributionKey] = target.value;
      record.assessments[target.dataset.contributionPerson] = assessment;
      record.updatedAt = new Date().toISOString();
      markContentEdit();
      saveState();
      return;
    }
    if (target.dataset.contributionStage && target.dataset.contributionBehavior) {
      const record = contributionRecord(target.dataset.contributionStage);
      const assessment = record.assessments[target.dataset.contributionPerson] || normalizeContributionAssessment();
      const behavior = target.dataset.contributionBehavior;
      assessment.behaviors = target.checked ? [...new Set([...assessment.behaviors, behavior])] : assessment.behaviors.filter((item) => item !== behavior);
      record.assessments[target.dataset.contributionPerson] = assessment;
      record.updatedAt = new Date().toISOString();
      markContentEdit();
      saveState();
      return;
    }
    if (target.dataset.appFeedback) {
      saveAppFeedbackField(target.dataset.appFeedback, target.value);
      return;
    }
    if (target.dataset.workArrangement !== undefined) {
      state.submission.workArrangement = target.value;
      if (target.value === "group" && !state.submission.groupLeader.name && state.submission.studentName) {
        state.submission.groupLeader.name = state.submission.studentName;
        state.submission.groupLeader.initialReadiness = state.submission.initialReadiness || "";
      }
      markContentEdit();
      saveState();
      renderStage();
      syncStudentDetailsFields();
      updateMemberCopyButtonVisibility();
      return;
    }
    if (target.dataset.copyOwner !== undefined) {
      state.submission.studentId = target.value;
      const owner = groupRoster().find((person) => person.id === target.value);
      state.submission.studentName = owner?.name || "";
      markContentEdit();
      saveState();
      renderStage();
      syncStudentDetailsFields();
      return;
    }
    if (target.dataset.methodologySelection) {
      const key = target.dataset.methodologySelection;
      state.methodology[key] = target.value;
      if (key === "approach") state.methodology.design = "";
      state.methodology.selectedDesign = methodologyDisplayName(state.methodology.approach, state.methodology.design, state.methodology.actionResearch === "yes");
      markContentEdit();
      saveState();
      renderStage();
      return;
    }
    if (target.dataset.ethicsDocument) {
      state.ethics.documents[target.dataset.ethicsDocument] = target.value;
      markContentEdit();
      saveState();
      renderStage();
      return;
    }
    if (target.dataset.methodologyAction !== undefined) {
      state.methodology.actionResearch = target.checked ? "yes" : "no";
      state.methodology.selectedDesign = methodologyDisplayName(state.methodology.approach, state.methodology.design, target.checked);
      markContentEdit();
      saveState();
      renderStage();
      return;
    }
    if (target.dataset.ethicsCheck) {
      state.ethics.checks[target.dataset.ethicsCheck] = target.checked;
      markContentEdit();
      if (!state.ethics.draft) state.ethics.draft = buildEthicsDraft();
      saveState();
      renderStage();
    }
    if (target.dataset.section && target.dataset.key) {
      setValue(target.dataset.section, target.dataset.key, target.value);
      if (target.dataset.section === "a4" && target.dataset.key === "centralPurpose") {
        const starter = document.querySelector("[data-central-starters]");
        if (starter) starter.textContent = rqPurposeOptions[target.value]?.starters || "Choose the broad inquiry purpose to see suitable question starters.";
      } else if (target.tagName === "SELECT") renderStage();
    }
  });

  document.addEventListener("click", (event) => {
    markInteraction();
    if (openPhaseMenuId && !event.target.closest?.("#phaseMenu") && !event.target.closest?.("[data-phase]")) closePhaseMenu();
    const target = event.target.closest("button");
    if (!target) return;
    if (target.dataset.focusTask !== undefined) {
      const tasks = buildFocusedTasks(state.currentStage).filter((task) => task.items?.length || task.roots?.length);
      setActiveTask(state.currentStage, Number(target.dataset.focusTask), tasks.length);
      document.getElementById("allTasksDialog")?.close();
      renderStage();
      return;
    }
    if (target.dataset.phase) {
      togglePhaseMenu(target.dataset.phase);
      return;
    }
    if (target.dataset.stage) {
      state.currentStage = target.dataset.stage;
      saveState();
      closePhaseMenu();
      document.getElementById("allStepsDialog")?.close();
      render();
      return;
    }
    if (target.dataset.progressPreview !== undefined) {
      previewProgressPdf();
    }
    if (target.dataset.progressPrint !== undefined) {
      printProgressPdf();
    }
    if (target.dataset.addRow) {
      const section = target.dataset.addRow;
      const rows = getTableRows(section);
      rows.push(emptyRowFor(section));
      const stageId = section === "a2Patterns" ? "a2" : section === "a3Gaps" ? "a3" : "terms";
      uiState.tasks[stageId] = addedRowTaskIndex(section, rows.length - 1);
      uiState.showAll[stageId] = false;
      saveUiState();
      markContentEdit();
      saveState();
      renderStage();
      requestAnimationFrame(() => els.stageForm.querySelector(`[data-table="${section}"][data-index="${rows.length - 1}"]`)?.focus());
      return;
    }
    if (target.dataset.removeRow) {
      const [section, index] = target.dataset.removeRow.split(":");
      const rows = getTableRows(section);
      const rowIndex = Number(index);
      if (isProtectedStandardRow(section, rowIndex)) return;
      if (rowHasSavedWork(rows[rowIndex]) && !confirm("This additional row contains saved work. Remove it?")) return;
      rows.splice(rowIndex, 1);
      const stageId = section === "a2Patterns" ? "a2" : section === "a3Gaps" ? "a3" : "terms";
      uiState.tasks[stageId] = addedRowTaskIndex(section, Math.max(0, rowIndex - 1));
      saveUiState();
      markContentEdit();
      saveState();
      renderStage();
      return;
    }
    if (target.dataset.addQuestion !== undefined) {
      if (state.a4.questions.length < SRQ_LIMITS.maximum) {
        state.a4.questions.push("");
        state.a4.questionIds.push(createStableId("srq"));
        state.a4.questionPurposes.push("");
        state.a4.questionFocuses.push("");
        state.a4.questionClaims.push("");
      }
      markContentEdit();
      saveState();
      renderStage();
    }
    if (target.dataset.removeQuestion !== undefined) {
      const index = Number(target.dataset.removeQuestion);
      const questionId = state.a4.questionIds[index];
      const linkedInstrument = state.instrumentation.rows.find((row) => row.questionId === questionId);
      if (linkedInstrument && instrumentRowHasAnswers(linkedInstrument) && !confirm("This research question has completed instrumentation details. Remove the question and its linked instrumentation card?")) return;
      state.a4.questions.splice(index, 1);
      state.a4.questionIds.splice(index, 1);
      state.a4.questionPurposes.splice(index, 1);
      state.a4.questionFocuses.splice(index, 1);
      state.a4.questionClaims.splice(index, 1);
      markContentEdit();
      saveState();
      renderStage();
    }
    if (target.dataset.moveQuestion) {
      const [indexText, direction] = target.dataset.moveQuestion.split(":");
      const index = Number(indexText);
      const nextIndex = direction === "up" ? index - 1 : index + 1;
      if (nextIndex >= 0 && nextIndex < state.a4.questions.length) {
        ["questions", "questionIds", "questionPurposes", "questionFocuses", "questionClaims"].forEach((key) => {
          [state.a4[key][index], state.a4[key][nextIndex]] = [state.a4[key][nextIndex], state.a4[key][index]];
        });
        syncInstrumentationRows();
        markContentEdit();
        saveState();
        renderStage();
      }
    }
    if (target.dataset.addGroupMember !== undefined) {
      state.submission.groupMembers.push(normalizeGroupPerson({}, "member"));
      markContentEdit();
      saveState();
      renderStage();
      syncStudentDetailsFields();
    }
    if (target.dataset.removeGroupMember !== undefined) {
      const index = Number(target.dataset.removeGroupMember);
      const person = state.submission.groupMembers[index];
      const hasContributionWork = person && Object.values(state.teamContributions || {}).some((record) => record.assessments?.[person.id] && Object.values(record.assessments[person.id]).some((item) => Array.isArray(item) ? item.length : String(item || "").trim()));
      const hasSavedWork = person && ([person.name, person.initialReadiness, person.confidence, person.readinessChange].some((item) => String(item || "").trim()) || hasContributionWork);
      if (hasSavedWork && !confirm("This group member has saved information or reflections. Remove this member and their entries?")) return;
      state.submission.groupMembers.splice(index, 1);
      markContentEdit();
      saveState();
      renderStage();
      syncStudentDetailsFields();
    }
    if (target.dataset.openMemberCopy !== undefined) openMemberCopyDialog();
    if (target.dataset.cancelMemberCopy !== undefined) document.getElementById("memberCopyDialog")?.close();
    if (target.dataset.createMemberCopy !== undefined) {
      createMemberCopy(document.getElementById("copyRecipient")?.value || "", document.getElementById("includeSourceRecord")?.checked !== false);
      document.getElementById("memberCopyDialog")?.close();
    }
    if (target.dataset.downloadConsentDocs !== undefined) generateConsentDocxDrafts();
    if (target.dataset.downloadUpdateBackup !== undefined) exportJson();
    if (target.dataset.showWhatsNew !== undefined) {
      const notes = els.updateNotice?.querySelector(".update-notes");
      if (notes) notes.hidden = !notes.hidden;
    }
    if (target.dataset.restoreCheckpoint) restoreCheckpoint(target.dataset.restoreCheckpoint);
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    const tasks = buildFocusedTasks(state.currentStage).filter((task) => task.items?.length || task.roots?.length);
    const taskIndex = activeTaskIndex(state.currentStage, tasks.length);
    if (taskIndex > 0) {
      setActiveTask(state.currentStage, taskIndex - 1, tasks.length);
      renderStage();
      return;
    }
    const next = Math.max(0, currentIndex() - 1);
    state.currentStage = stages[next].id;
    saveState();
    render();
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    const tasks = buildFocusedTasks(state.currentStage).filter((task) => task.items?.length || task.roots?.length);
    const taskIndex = activeTaskIndex(state.currentStage, tasks.length);
    if (taskIndex < tasks.length - 1) {
      setActiveTask(state.currentStage, taskIndex + 1, tasks.length);
      renderStage();
      return;
    }
    const next = Math.min(stages.length - 1, currentIndex() + 1);
    state.currentStage = stages[next].id;
    saveState();
    render();
  });

  document.getElementById("skipBtn").addEventListener("click", () => document.getElementById("nextBtn").click());
  document.addEventListener("keydown", handlePhaseMenuKeydown);
  window.addEventListener("resize", positionPhaseMenu);
  window.addEventListener("scroll", positionPhaseMenu, true);
  document.getElementById("allStepsBtn").addEventListener("click", () => {
    closePhaseMenu();
    document.getElementById("allStepsDialog").showModal();
  });
  document.getElementById("closeAllStepsBtn").addEventListener("click", () => document.getElementById("allStepsDialog").close());
  document.getElementById("allTasksBtn").addEventListener("click", () => document.getElementById("allTasksDialog").showModal());
  document.getElementById("closeAllTasksBtn").addEventListener("click", () => document.getElementById("allTasksDialog").close());
  document.getElementById("statusBtn").addEventListener("click", () => document.getElementById("statusDialog").showModal());
  document.getElementById("closeStatusBtn").addEventListener("click", () => document.getElementById("statusDialog").close());
  document.getElementById("toolsBtn").addEventListener("click", () => document.getElementById("toolsDialog").showModal());
  document.getElementById("closeToolsBtn").addEventListener("click", () => document.getElementById("toolsDialog").close());

  document.getElementById("saveBtn").addEventListener("click", () => {
    const label = prompt("Optional checkpoint label (for example: Before adviser consultation)", "");
    if (label === null) return;
    if (createCheckpoint(label, "manual")) alert("Draft checkpoint created. Autosave continues to protect your latest work.");
  });
  document.getElementById("historyBtn").addEventListener("click", () => {
    renderCheckpointHistory();
    els.historyDialog.showModal();
  });
  document.getElementById("closeHistoryBtn").addEventListener("click", () => els.historyDialog.close());
  document.getElementById("downloadFeedbackBtn").addEventListener("click", downloadAppFeedbackReport);
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
    markContentEdit();
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
      checkpoints = [];
      localStorage.removeItem(CHECKPOINT_KEY);
      saveState();
      render();
    }
  });

  els.importFile.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const imported = JSON.parse(await file.text());
      const importedState = imported.backupFormat === "lit-based-proposal-builder" ? imported.state : imported;
      state = normalizeState(importedState);
      if (imported.backupFormat === "lit-based-proposal-builder" && Array.isArray(imported.checkpoints)) {
        checkpoints = imported.checkpoints.slice(0, MAX_CHECKPOINTS);
        saveCheckpoints();
      }
      markInteraction();
      saveState();
      render();
    } catch {
      alert("This JSON backup could not be imported.");
    }
  });
}

function instrumentRowHasAnswers(row = {}) {
  return ["claimNeeded", "evidenceNeeded", "evidenceSource", "instrument", "analysis", "description", "purpose", "validation", "implementation"]
    .some((key) => String(row[key] || "").trim());
}

attachEvents();
render();
showWelcomeIfNeeded();
checkForUpdates();
if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // Offline caching is an enhancement; registration failure must not interrupt work.
    });
  });
}
saveState();
setInterval(saveState, 30000);
setInterval(tickActiveTime, 15000);
document.addEventListener("visibilitychange", () => {
  lastActiveTickAt = Date.now();
  if (!document.hidden) markInteraction();
});
window.addEventListener("beforeunload", () => {
  tickActiveTime();
  saveState(false);
});

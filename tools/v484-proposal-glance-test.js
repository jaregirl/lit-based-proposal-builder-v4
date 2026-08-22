const { chromium } = require("playwright");

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4184/index.html?v=v484-proposal-glance-test";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1024 } });
  const page = await context.newPage();
  page.setDefaultTimeout(7000);
  const pageErrors = [];
  const consoleErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem("proposalBuilderA4DraftUploadVersion:welcome:v4.8.2-offline", "seen");
  });
  await page.reload({ waitUntil: "domcontentloaded" });

  await page.evaluate(() => {
    state.a1.coreConstruct = "Assessment literacy";
    state.a2.synthesis = "Studies repeatedly describe assessment knowledge, while its use during practicum remains less developed.";
    state.a3.finalGap = "How preservice teachers apply assessment knowledge in classroom decisions remains insufficiently explained.";
    state.a4.literatureProblem = "Limited understanding of how assessment literacy is enacted during teaching practicum.";
    state.a4.centralQuestion = "How do preservice teachers apply assessment literacy during teaching practicum?";
    state.a4.questions = ["How do preservice teachers use assessment information when planning instruction?"];
    state.a4.questionIds = ["srq-shared-claim"];
    state.a4.questionPurposes = ["describe"];
    state.a4.questionFocuses = ["Use of assessment information"];
    state.a4.questionClaims = ["Earlier A4 claim"];
    state.methodology.selectedDesign = "Qualitative multiple-case study";
    state.methodology.participants = "Preservice teachers";
    state.methodology.locale = "Teacher education program and partner schools";
    state.methodology.operationalDelimitations = "One semester of teaching practicum";
    state.framework.theoryModel = "Assessment literacy framework";
    state.ethics.draft = "Informed consent and confidentiality";
    state.instrumentation.rows = [{
      questionId: "srq-shared-claim",
      rq: state.a4.questions[0],
      claimNeeded: "Revised instrumentation claim",
      evidenceNeeded: "Planning decisions and reasons",
      evidenceSource: "Lesson plans and interviews",
      instrument: "Document guide and interview protocol",
      analysis: "Within-case and cross-case thematic analysis",
      description: "",
      purpose: "",
      validation: "",
      implementation: ""
    }];
    saveState(false);
  });
  await page.reload({ waitUntil: "domcontentloaded" });

  const migrated = await page.evaluate(() => ({
    a4: state.a4.questionClaims[0],
    instrumentation: state.instrumentation.rows[0].claimNeeded
  }));
  assert(migrated.a4 === "Revised instrumentation claim", "The later Instrumentation claim did not migrate into the shared A4 claim.");
  assert(migrated.instrumentation === migrated.a4, "The migrated claim is still duplicated with different values.");

  await page.evaluate(() => {
    activateStage("a4");
    const selector = '[data-question-claim="0"]';
    const taskIndex = issueTargetTaskIndex("a4", selector);
    setActiveTask("a4", taskIndex, buildFocusedTasks("a4").length);
    renderStage();
  });
  await page.locator('[data-question-claim="0"]').fill("Claim revised in A4");
  assert(await page.evaluate(() => state.instrumentation.rows[0].claimNeeded === "Claim revised in A4"), "Editing A4 did not update Instrumentation.");

  await page.evaluate(() => {
    activateStage("instrumentation");
    const selector = '[data-table="instrumentation"][data-index="0"][data-key="claimNeeded"]';
    const taskIndex = issueTargetTaskIndex("instrumentation", selector);
    setActiveTask("instrumentation", taskIndex, buildFocusedTasks("instrumentation").length);
    renderStage();
  });
  await page.locator('[data-table="instrumentation"][data-index="0"][data-key="claimNeeded"]').fill("Claim refined during instrumentation");
  assert(await page.evaluate(() => state.a4.questionClaims[0] === "Claim refined during instrumentation"), "Editing Instrumentation did not update A4.");
  await page.reload({ waitUntil: "domcontentloaded" });
  const persistedClaim = await page.evaluate(() => ({
    a4: state.a4.questionClaims[0],
    instrumentation: state.instrumentation.rows[0].claimNeeded
  }));
  assert(persistedClaim.a4 === "Claim refined during instrumentation" && persistedClaim.instrumentation === persistedClaim.a4, "The shared claim did not persist after reload.");

  await page.locator("#statusBtn").click();
  const statusOptions = page.locator('#statusMenu [role="menuitem"]');
  assert(await statusOptions.count() === 3, "Status does not contain exactly three focused options.");
  await page.locator('[data-status-action="glance"]').click();
  assert(await page.locator("#proposalGlanceView").isVisible(), "Proposal at a Glance did not open.");
  assert(await page.locator(".workspace").evaluate((node) => node.classList.contains("glance-open")), "The guided workspace was not replaced by the glance view.");
  assert(!(await page.locator("#statusDialog").evaluate((dialog) => dialog.open)), "Proposal at a Glance incorrectly opened inside the Status dialog.");
  assert((await page.locator("#proposalLogic").innerText()).includes("Assessment literacy"), "Whole-proposal logic did not use the saved construct.");
  const desktopLogicTops = await page.locator(".proposal-logic-card").evaluateAll((cards) => cards.map((card) => Math.round(card.getBoundingClientRect().top)));
  assert(Math.max(...desktopLogicTops) - Math.min(...desktopLogicTops) <= 2, "Whole-proposal logic did not remain on one line on desktop.");
  assert((await page.locator("#proposalAlignmentBody").innerText()).includes("Claim refined during instrumentation"), "The alignment table did not use the shared claim.");
  assert(!(await page.locator("#proposalGlanceView").innerText()).includes("Lane et al."), "The unverified mock citation appeared in the app.");
  assert(await page.locator("#proposalGlanceView .proposal-source-link").count() >= 11, "Source-task links are missing from the glance view.");
  await page.screenshot({ path: "qa/v484-proposal-glance.png", fullPage: true });

  await page.locator("#proposalAlignmentBody tr td:nth-child(2) .proposal-source-link").click();
  assert(await page.evaluate(() => state.currentStage === "a4"), "The intended-claim source link did not return to A4.");
  assert(await page.locator('[data-question-claim="0"]').evaluate((node) => node === document.activeElement), "The intended-claim source field did not receive focus.");

  await page.evaluate(() => openProposalGlance());
  await page.locator("#proposalAlignmentBody tr td:nth-child(3) .proposal-source-link").click();
  await page.waitForTimeout(120);
  assert(await page.evaluate(() => state.currentStage === "instrumentation"), "The evidence source link did not return to Instrumentation.");
  const evidenceFocus = await page.evaluate(() => ({
    active: document.activeElement?.outerHTML?.slice(0, 240) || "",
    target: document.querySelector('[data-table="instrumentation"][data-index="0"][data-key="evidenceNeeded"]')?.outerHTML?.slice(0, 240) || "",
    hidden: document.querySelector('[data-table="instrumentation"][data-index="0"][data-key="evidenceNeeded"]')?.hidden,
    visible: Boolean(document.querySelector('[data-table="instrumentation"][data-index="0"][data-key="evidenceNeeded"]')?.offsetParent),
    activeTask: activeTaskIndex("instrumentation"),
    tasks: buildFocusedTasks("instrumentation").map((task) => task.label)
  }));
  assert(await page.locator('[data-table="instrumentation"][data-index="0"][data-key="evidenceNeeded"]').evaluate((node) => node === document.activeElement), `The evidence-needed source field did not receive focus: ${JSON.stringify(evidenceFocus)}`);

  await page.evaluate(() => {
    openProposalGlance();
    window.print = () => { window.__glancePrintCalled = true; };
  });
  await page.locator("#printProposalGlanceBtn").click();
  assert(await page.evaluate(() => window.__glancePrintCalled === true), "Print this view did not invoke printing.");

  await page.setViewportSize({ width: 390, height: 844 });
  const mobile = await page.evaluate(() => ({
    bodyFits: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    logicColumns: getComputedStyle(document.querySelector(".proposal-logic")).gridTemplateColumns.split(" ").length,
    logicScrollsInside: document.querySelector(".proposal-logic").scrollWidth > document.querySelector(".proposal-logic").clientWidth,
    tableFits: document.querySelector(".proposal-alignment-scroll").scrollWidth <= document.querySelector(".proposal-alignment-scroll").clientWidth,
    analysisVisible: Boolean(document.querySelector('#proposalAlignmentBody td[data-label="Analysis"]')?.offsetParent)
  }));
  assert(mobile.bodyFits, "Proposal at a Glance causes page-level horizontal scrolling on mobile.");
  assert(mobile.logicColumns === 6, "Whole-proposal logic did not remain one continuous line on mobile.");
  assert(mobile.logicScrollsInside, "Whole-proposal logic does not scroll within its own row on mobile.");
  assert(mobile.tableFits, "The alignment table still requires horizontal scrolling on mobile.");
  assert(mobile.analysisVisible, "The final alignment field is hidden on mobile.");
  await page.screenshot({ path: "qa/v484-proposal-glance-mobile.png", fullPage: true });

  assert(pageErrors.length === 0, `Page errors occurred: ${pageErrors.join(" | ")}`);
  assert(consoleErrors.length === 0, `Console errors occurred: ${consoleErrors.join(" | ")}`);
  console.log(JSON.stringify({ status: "passed", sharedClaim: true, migration: true, glance: true, sourceLinks: true, print: true, mobile: true }, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});

const { chromium } = require("playwright");

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4176/index.html?v=v460-smoke";
const storageKey = "proposalBuilderA4DraftUploadVersion";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.evaluate((key) => {
    localStorage.clear();
    localStorage.setItem(`${key}:welcome:v4.0`, "true");
  }, storageKey);
  await page.reload({ waitUntil: "networkidle" });

  assert(await page.getByText("Before You Begin: Privacy and Local Saving").isVisible(), "Privacy notice is not visible in Student Details.");
  await page.locator('#stageForm input[data-work-arrangement][value="group"]').check();
  await page.locator('#stageForm [data-group-person-role="leader"][data-group-person-key="name"]').fill("Group Leader");
  await page.getByRole("button", { name: "Add Group Member" }).click();
  assert(await page.locator("#stageForm .group-person-card").count() === 2, "Group member card was not added.");
  await page.locator("#stageForm .group-person-card summary").nth(1).click();
  await page.locator('#stageForm [data-group-person-role="member"][data-group-person-key="name"]').fill("Member One");

  await page.locator('[data-stage="a4"]').click();
  await page.getByText("7. Break the central question into specific research questions").click();
  const questionInputs = page.locator('[data-array="a4.questions"]');
  await questionInputs.nth(0).fill("What is the level of assessment practice?");
  await page.locator(".question-card summary").nth(1).click();
  await questionInputs.nth(1).fill("How do teachers describe assessment practice?");
  await page.locator(".question-card summary").nth(2).click();
  await questionInputs.nth(2).fill("How are policy expectations and practice aligned?");
  await page.locator('[data-question-purpose="0"]').selectOption("describe");
  await page.locator('[data-question-purpose="1"]').selectOption("exploreExperience");
  await page.locator('[data-question-purpose="2"]').selectOption("compare");
  await page.locator('[data-stage="instrumentation"]').click();
  assert(await page.locator(".instrumentation-row").count() === 3, "Instrumentation did not create exactly one card per SRQ.");
  assert(await page.getByRole("button", { name: "Add Instrument Row" }).count() === 0, "Add Instrument Row is still present.");
  await page.locator('[data-table="instrumentation"][data-index="0"][data-key="instrument"]').fill("Survey questionnaire");
  await page.locator('[data-stage="a4"]').click();
  await page.getByText("7. Break the central question into specific research questions").click();
  await questionInputs.nth(0).fill("What is the reported level of assessment practice?");
  await page.locator('[data-move-question="0:down"]').click();
  await page.locator('[data-stage="instrumentation"]').click();
  assert(await page.locator('[data-table="instrumentation"][data-index="1"][data-key="instrument"]').inputValue() === "Survey questionnaire", "Instrumentation answer detached after SRQ wording edit or reorder.");

  await page.locator('[data-stage="methodology"]').click();
  await page.locator('[data-methodology-selection="approach"]').selectOption("mixed");
  assert(await page.locator('[data-methodology-selection="design"] option').count() === 6, "Mixed-methods designs did not cascade.");
  await page.locator('[data-methodology-selection="design"]').selectOption("explanatorySequential");
  assert(await page.getByText("Requirements and assumptions").isVisible(), "Design-specific guidance is missing.");
  assert(await page.getByText("Mixed Methods Integration").isVisible(), "Mixed-methods integration fields are missing.");

  await page.locator('[data-stage="ethics"]').click();
  await page.locator(".consent-preparation summary").click();
  await page.locator('select[data-ethics-document="humanParticipants"]').selectOption("yes");
  await page.locator(".consent-preparation summary").click();
  await page.locator('select[data-ethics-document="capableAdults"]').selectOption("yes");
  assert(await page.locator("[data-download-consent-docs]").isEnabled(), "Adult-consent draft did not become available.");
  await page.locator(".consent-preparation summary").click();
  const consentDownload = page.waitForEvent("download");
  await page.locator("[data-download-consent-docs]").click();
  const consentFile = await consentDownload;
  assert(consentFile.suggestedFilename().startsWith("ERB-draft-forms-"), "ERB Word-draft ZIP was not generated.");

  await page.screenshot({ path: "qa/v460-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.locator('[data-stage="details"]').click();
  await page.screenshot({ path: "qa/v460-portrait.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "qa/v460-mobile.png", fullPage: true });

  page.on("dialog", async (dialog) => {
    if (dialog.type() === "prompt") await dialog.accept("Pilot checkpoint");
    else await dialog.accept();
  });
  const adviserInput = page.locator('#stageForm [data-section="submission"][data-key="adviserName"]');
  await adviserInput.fill("Checkpoint Baseline");
  await page.getByRole("button", { name: "Save Draft" }).click();
  for (let index = 1; index < 5; index += 1) {
    await adviserInput.fill(`Checkpoint ${index}`);
    await page.getByRole("button", { name: "Save Draft" }).click();
  }
  const storedCheckpoints = await page.evaluate((key) => JSON.parse(localStorage.getItem(`${key}:checkpoints`)), storageKey);
  assert(storedCheckpoints.length === 5, "Save Draft did not retain exactly five restorable checkpoints.");
  await adviserInput.fill("Unsaved checkpoint state");
  await page.getByRole("button", { name: "Draft History" }).click();
  await page.locator("[data-restore-checkpoint]").last().click();
  assert(await adviserInput.inputValue() === "Checkpoint Baseline", "Checkpoint restoration did not recover the selected academic state.");
  const recoveredCheckpoints = await page.evaluate((key) => JSON.parse(localStorage.getItem(`${key}:checkpoints`)), storageKey);
  assert(recoveredCheckpoints.some((checkpoint) => checkpoint.kind === "recovery"), "Restoration did not preserve a recovery checkpoint.");

  const timingChecks = await page.evaluate(() => {
    state.engagement.workStartedAt = state.engagement.workStartedAt || new Date().toISOString();
    state.engagement.activeMs = 5000;
    lastInteractionAt = Date.now() - IDLE_MS - 1000;
    lastActiveTickAt = Date.now() - 15000;
    tickActiveTime();
    const idlePaused = state.engagement.activeMs === 5000;
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    lastInteractionAt = Date.now();
    lastActiveTickAt = Date.now() - 15000;
    tickActiveTime();
    const hiddenPaused = state.engagement.activeMs === 5000;
    delete document.hidden;
    lastInteractionAt = Date.now();
    lastActiveTickAt = Date.now() + 1000;
    tickActiveTime();
    const clockAnomalyIgnored = state.engagement.activeMs === 5000;
    return { idlePaused, hiddenPaused, clockAnomalyIgnored };
  });
  assert(timingChecks.idlePaused && timingChecks.hiddenPaused && timingChecks.clockAnomalyIgnored, "Active-time tracking did not pause safely for idle, hidden, or clock-anomaly conditions.");

  const storageRecovery = await page.evaluate(() => {
    const originalSetItem = Storage.prototype.setItem;
    const before = checkpoints.length;
    let remainingFailures = 1;
    Storage.prototype.setItem = function setItemWithOneQuotaFailure(key, value) {
      if (key === CHECKPOINT_KEY && remainingFailures > 0) {
        remainingFailures -= 1;
        throw new DOMException("Simulated quota limit", "QuotaExceededError");
      }
      return originalSetItem.call(this, key, value);
    };
    let saved;
    try {
      saved = saveCheckpoints();
    } finally {
      Storage.prototype.setItem = originalSetItem;
    }
    return { saved, before, after: checkpoints.length };
  });
  assert(storageRecovery.saved && storageRecovery.after === storageRecovery.before - 1, "Storage-pressure handling did not remove only the oldest checkpoint and retry.");

  await page.close();

  const migrationFixtures = [
    { label: "v3.3", schemaVersion: undefined },
    { label: "v4.5.3", schemaVersion: "4.5.3" },
    { label: "v4.5.4", schemaVersion: "4.5.4" },
    { label: "v4.5.6", schemaVersion: "4.5.6" }
  ];
  for (const fixture of migrationFixtures) {
    const migrationContext = await browser.newContext({ viewport: { width: 1200, height: 800 } });
    await migrationContext.addInitScript(({ key, old }) => {
      localStorage.setItem(`${key}:welcome:v4.0`, "true");
      localStorage.setItem(key, JSON.stringify(old));
    }, { key: storageKey, old: {
      meta: fixture.schemaVersion ? { schemaVersion: fixture.schemaVersion, appVersion: fixture.label } : undefined,
      currentStage: "details",
      submission: { studentName: "Legacy Student", course: "RES 101", section: "A", submissionDate: "2026-06-01", initialReadiness: "Starting" },
      a4: { questions: ["Legacy question 1", "Legacy question 2"] },
      methodology: { selectedDesign: "Correlational Quantitative" },
      instrumentation: { rows: [{ rq: "Legacy question 1", instrument: "Survey" }, { rq: "Legacy question 2", instrument: "Interview" }] }
      } });
    const migrationPage = await migrationContext.newPage();
    migrationPage.on("pageerror", (error) => pageErrors.push(error.message));
    await migrationPage.goto(baseUrl, { waitUntil: "networkidle" });
    const migrated = await migrationPage.evaluate((key) => JSON.parse(localStorage.getItem(key)), storageKey);
    assert(migrated.meta.schemaVersion === "4.6.0", `${fixture.label} backup did not migrate to schema 4.6.0.`);
    assert(migrated.submission.workArrangement === "individual", `${fixture.label} backup did not default to Individual Work.`);
    assert(migrated.submission.studentName === "Legacy Student", `${fixture.label} student name was overwritten.`);
    assert(migrated.methodology.approach === "quantitative" && migrated.methodology.design === "correlational", `${fixture.label} methodology design was not preserved.`);
    assert(migrated.a4.questionIds.every(Boolean), `${fixture.label} stable SRQ IDs were not created during migration.`);
    await migrationContext.close();
  }

  const updateCases = [
    { label: "newer", mode: "json", body: { version: "v9.0.0", url: "https://example.test/new", notes: ["Test release"] }, visible: true },
    { label: "malformed", mode: "text", body: "not-json", visible: false },
    { label: "offline", mode: "abort", visible: false }
  ];
  for (const updateCase of updateCases) {
    const updateContext = await browser.newContext({ viewport: { width: 1200, height: 800 } });
    await updateContext.addInitScript((key) => localStorage.setItem(`${key}:welcome:v4.0`, "true"), storageKey);
    await updateContext.route("**/version.json?**", async (route) => {
      if (updateCase.mode === "abort") return route.abort("internetdisconnected");
      if (updateCase.mode === "text") return route.fulfill({ status: 200, contentType: "application/json", body: updateCase.body });
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(updateCase.body) });
    });
    const updatePage = await updateContext.newPage();
    updatePage.on("pageerror", (error) => pageErrors.push(error.message));
    await updatePage.goto(baseUrl, { waitUntil: "networkidle" });
    const updateVisible = await updatePage.locator("#updateNotice").isVisible();
    assert(updateVisible === updateCase.visible, `${updateCase.label} update response had the wrong notice state.`);
    await updateContext.close();
  }

  assert(pageErrors.length === 0, `Browser errors: ${pageErrors.join(" | ")}`);
  console.log("v4.6.0 smoke test passed");
  await browser.close();
})().catch((error) => {
  console.error(error.stack || error);
  process.exit(1);
});

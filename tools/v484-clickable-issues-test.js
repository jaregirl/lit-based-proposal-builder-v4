const { chromium } = require("playwright");

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4184/index.html?v=v484-clickable-issues-test";

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
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem("proposalBuilderA4DraftUploadVersion:welcome:v4.8.2-offline", "seen");
  });
  await page.reload({ waitUntil: "domcontentloaded" });

  const screenshotRoutes = await page.evaluate(() => [
    "Research Level Readiness: add stronger evidence or narrow the scope for the selected context.",
    "Review coverage: some central-question ideas may not be unpacked by the SRQs.",
    "The construct or variable load may be heavy. Narrow the study before adding instruments.",
    "How do your literature gap, research questions, methodology, instruments, and analysis work together as one research plan? Add a short but specific answer.",
    "What important research decisions did you make because of the literature, context, or problem, not simply because the template asked for them? Add a short but specific answer."
  ].map((text) => readinessIssueDestination({ text })));
  assert(screenshotRoutes[0].stage === "researchLevel" && screenshotRoutes[0].selector.includes("guidedApplication"), "Research Level Readiness route is incorrect.");
  assert(screenshotRoutes[1].stage === "a4" && screenshotRoutes[1].selector.includes("centralQuestion"), "Central-question coverage route is incorrect.");
  assert(screenshotRoutes[2].stage === "framework" && screenshotRoutes[2].selector.includes("scopeBoundaries"), "Construct-load route is incorrect.");
  assert(screenshotRoutes[3].stage === "researchLevel" && screenshotRoutes[3].selector.includes("guidedApplication"), "Guided-application route is incorrect.");
  assert(screenshotRoutes[4].stage === "researchLevel" && screenshotRoutes[4].selector.includes("independentDecisions"), "Research-decisions route is incorrect.");

  await page.evaluate(() => {
    state.a1.coreConstruct = "assessment literacy";
    state.a2.patterns[0].notice = "Studies commonly describe preservice teachers' assessment knowledge.";
    state.a2.patterns[0].authors = "Illustrative source";
    state.a3.finalGap = "";
    updateDashboard();
  });

  const unrouted = await page.evaluate(() => outstandingIssues()
    .map((item) => ({ text: item.text, sourceStage: item.sourceStage, destination: readinessIssueDestination(item) }))
    .filter((item) => item.destination.stage === "readiness"));
  assert(unrouted.length === 0, `Some outstanding issues still lead back to Status instead of their work area: ${JSON.stringify(unrouted)}`);

  await page.locator("#statusBtn").click();
  assert(await page.locator("#checkBtn").innerText() === "Check Current Step", "The current-step check is still labeled Run Check.");
  const issueButtons = page.locator("#issueList [data-issue-index]");
  assert(await issueButtons.count() > 5, "Status should show the complete outstanding-issue list, not only five items.");
  const a3Issue = issueButtons.filter({ hasText: "Write the final gap clearly." });
  assert(await a3Issue.count() === 1, "The expected A3 issue is missing from the complete list.");
  assert((await a3Issue.innerText()).includes("A3 · NEEDS ATTENTION"), "The issue label does not identify its actual A3 destination.");
  await a3Issue.focus();
  assert(await a3Issue.evaluate((button) => button === document.activeElement), "Outstanding issue is not keyboard focusable.");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(120);

  assert(!(await page.locator("#statusDialog").evaluate((dialog) => dialog.open)), "Status dialog did not close after selecting an issue.");
  assert(await page.evaluate(() => state.currentStage === "a3"), "The issue did not open A3.");
  const finalGap = page.locator('#stageForm [data-section="a3"][data-key="finalGap"]');
  assert(await finalGap.isVisible(), "The relevant A3 task was not disclosed.");
  assert(await finalGap.evaluate((control) => control === document.activeElement), "Focus did not move to the final-gap field.");
  assert(await finalGap.locator("xpath=ancestor-or-self::*[contains(concat(' ', normalize-space(@class), ' '), ' needs-attention-target ')][1]").count() === 1, "The target did not receive the visible attention marker.");
  assert(await page.getByText("Needs attention", { exact: true }).count() >= 1, "The marker relies on color without a text label.");

  assert(pageErrors.length === 0, `Page errors occurred: ${pageErrors.join(" | ")}`);
  console.log(JSON.stringify({ status: "passed", screenshotRoutes: 5, clickable: true, keyboard: true, stage: "a3", taskDisclosed: true, focusMoved: true, textAndOutlineMarker: true }, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});

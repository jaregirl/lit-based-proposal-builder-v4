const { chromium } = require("playwright");

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4184/index.html?v=v484-content-quality-test";

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
    setActiveTask("details", 3, 4);
    renderStage();
  });

  const reflection = page.locator('#stageForm [data-section="submission"][data-key="initialReadiness"]');
  assert(await reflection.isVisible(), "Initial readiness reflection is not visible.");
  await reflection.fill("asdf");
  await page.locator("#statusBtn").click();
  await page.locator('[data-status-action="current"]').click();
  const placeholderFeedback = await page.locator("#feedback").innerText();
  assert(placeholderFeedback.includes("resembles placeholder or test text"), "Obvious placeholder text was not flagged.");
  assert(placeholderFeedback.includes("does not evaluate academic quality"), "The placeholder warning overstates what the app can judge.");
  assert(await reflection.inputValue() === "asdf", "Running the check changed the student's response.");

  await page.locator("#closeStatusBtn").click();
  await reflection.fill("I can identify the topic, but I still need to clarify the evidence required for the study.");
  await page.locator("#statusBtn").click();
  await page.locator('[data-status-action="current"]').click();
  const substantiveFeedback = await page.locator("#feedback").innerText();
  assert(substantiveFeedback.includes("found no obvious placeholder text"), "Substantive text did not receive the conservative presence message.");
  assert(substantiveFeedback.includes("academic quality and correctness were not evaluated"), "The positive message does not preserve the scholarly-quality boundary.");
  assert(!substantiveFeedback.includes("resembles placeholder or test text"), "Substantive text was incorrectly flagged as placeholder text.");
  assert((await page.locator('[data-status-section="current"] .hint').innerText()).includes("cannot determine whether a response is academically sound"), "The visible quality boundary is missing.");

  const detectorCases = await page.evaluate(() => ({
    qwerty: Boolean(obviousPlaceholderReason("qwerty")),
    repeated: Boolean(obviousPlaceholderReason("aaaaaa")),
    keyboard: Boolean(obviousPlaceholderReason("sdfghj")),
    construct: Boolean(obviousPlaceholderReason("assessment literacy")),
    acronym: Boolean(obviousPlaceholderReason("CHED"))
  }));
  assert(detectorCases.qwerty && detectorCases.repeated && detectorCases.keyboard, "Expected placeholder patterns were not detected.");
  assert(!detectorCases.construct && !detectorCases.acronym, "Plausible research text was incorrectly flagged.");
  assert(pageErrors.length === 0, `Page errors occurred: ${pageErrors.join(" | ")}`);
  assert(consoleErrors.length === 0, `Console errors occurred: ${consoleErrors.join(" | ")}`);

  console.log(JSON.stringify({ status: "passed", obviousPlaceholder: true, conservativeBoundary: true, responsePreserved: true }, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});

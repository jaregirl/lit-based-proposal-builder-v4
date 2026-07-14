const { chromium } = require("playwright");

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4181/index.html?v=v480-focused-test";
const outputDir = process.env.QA_DIR || "qa";

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
  page.setDefaultTimeout(6000);
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  console.log("opening app");
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem("proposalBuilderA4DraftUploadVersion:welcome:v4.0", "seen");
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);

  assert(await page.locator(".journey-header").isVisible(), "Journey header is missing.");
  assert(await page.locator(".phase-step").count() === 4, "Four journey phases were not rendered.");
  assert(await page.locator("#stageTaskCounter").innerText() === "Task 1 of 4", "Student Details task count is incorrect.");
  assert(await page.locator("#taskRail .task-rail-item.active").count() === 1, "Exactly one task should be active.");
  assert(await page.locator("#stageForm [data-section='submission'][data-key='degreeLevel']").isVisible(), "The first Student Details task is not visible.");

  const firstTitle = await page.locator("#stageTitle").innerText();
  await page.locator("#nextBtn").click();
  assert((await page.locator("#stageTitle").innerText()) !== firstTitle, "Continue did not advance to the next task.");
  await page.locator("#allTasksBtn").click();
  assert(await page.locator("#allTasksDialog").evaluate((dialog) => dialog.open), "All Tasks dialog did not open.");
  await page.locator("#closeAllTasksBtn").click();
  await page.locator("#statusBtn").click();
  assert(await page.locator("#statusDialog").evaluate((dialog) => dialog.open), "Status dialog did not open.");
  await page.locator("#closeStatusBtn").click();
  await page.locator("#toolsBtn").click();
  assert(await page.locator("#toolsDialog").evaluate((dialog) => dialog.open), "Tools dialog did not open.");
  await page.locator("#closeToolsBtn").click();
  console.log("core navigation passed");

  const stageIds = ["details", "a1", "a2", "a3", "a4", "framework", "methodology", "ethics", "instrumentation", "terms", "outline", "researchLevel", "readiness", "submission"];
  for (const stageId of stageIds) {
    await page.evaluate((id) => document.querySelector(`[data-stage="${id}"]`)?.click(), stageId);
    await page.waitForTimeout(80);
    const counter = await page.locator("#stageTaskCounter").innerText();
    assert(/^Task \d+ of \d+$/.test(counter), `${stageId} did not render a focused task counter.`);
    assert(await page.locator("#stageTitle").isVisible(), `${stageId} has no visible task title.`);
    console.log(`stage ${stageId} passed`);
  }

  await page.evaluate(() => document.querySelector('[data-stage="submission"]')?.click());
  await page.locator("#nextBtn").click();
  await page.locator("#progressPdfScope").selectOption("single");
  await page.locator("[data-progress-preview]").click();
  assert(await page.locator("#previewDialog").evaluate((dialog) => dialog.open), "Single-part progress PDF preview did not open.");
  await page.locator("#closePreviewBtn").click();

  await page.evaluate(() => document.querySelector('[data-stage="a1"]')?.click());
  await page.waitForTimeout(100);
  assert(await page.locator("#stageForm .focus-task-item:not([hidden])").count() >= 1, "A1 has no visible focused task.");
  await page.screenshot({ path: `${outputDir}/v480-desktop.png`, fullPage: true });

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${outputDir}/v480-portrait.png`, fullPage: true });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "Portrait layout has horizontal overflow.");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${outputDir}/v480-mobile.png`, fullPage: true });
  const mobileOverflow = await page.evaluate(() => ({
    viewport: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    elements: Array.from(document.querySelectorAll("body *")).map((element) => {
      const rect = element.getBoundingClientRect();
      return { tag: element.tagName, id: element.id, className: String(element.className || ""), left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) };
    }).filter((item) => item.right > window.innerWidth + 1 || item.left < -1).slice(0, 12)
  }));
  if (mobileOverflow.scrollWidth > mobileOverflow.viewport + 1) console.log(JSON.stringify({ mobileOverflow }, null, 2));
  assert(mobileOverflow.scrollWidth <= mobileOverflow.viewport + 1, "Mobile layout has horizontal overflow.");
  assert(!(await page.locator("#taskRail").isVisible()), "Task rail should be hidden on mobile.");
  assert(await page.locator("#nextBtn").isVisible(), "Primary Continue action is not visible on mobile.");

  assert(pageErrors.length === 0, `Page errors: ${pageErrors.join(" | ")}`);
  console.log(JSON.stringify({ status: "passed", stages: stageIds.length, screenshots: 3 }, null, 2));
  await browser.close();
})().catch(async (error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});

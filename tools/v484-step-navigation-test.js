const { chromium } = require("playwright");

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4182/index.html?v=v484-step-navigation-test";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function chooseFoundationStep(page, stageId) {
  await page.locator('[data-phase="foundations"]').click();
  assert(await page.locator("#phaseMenu").isVisible(), "Foundations menu did not open.");
  await page.locator(`#phaseMenu [data-stage="${stageId}"]`).click();
  await page.waitForTimeout(100);
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
  });
  const context = await browser.newContext({ viewport: { width: 712, height: 1213 } });
  const page = await context.newPage();
  page.setDefaultTimeout(7000);
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("dialog", (dialog) => dialog.accept());

  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem("proposalBuilderA4DraftUploadVersion:welcome:v4.8.2-offline", "seen");
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    const key = "proposalBuilderA4DraftUploadVersion";
    const draft = JSON.parse(localStorage.getItem(key));
    draft.currentStage = "a4";
    draft.meta.migratedFrom = "v4.8.3";
    localStorage.setItem(key, JSON.stringify(draft));
  });
  await page.reload({ waitUntil: "domcontentloaded" });

  await chooseFoundationStep(page, "a2");
  assert((await page.locator("#stageBreadcrumb").innerText()).includes("Deepened Review"), "A2 did not open.");
  assert(await page.locator("#phaseMenu").isHidden(), "Foundations menu remained open after choosing A2.");
  const a2Example = page.locator('button[data-example-stage="a2"]:visible').first();
  assert(await a2Example.isVisible(), "A2 View example control is missing.");
  await a2Example.click();
  assert(await page.locator("#exampleDialog").isVisible(), "A2 example pop-up did not open.");
  await page.getByRole("button", { name: "Return to my answer" }).click();

  await chooseFoundationStep(page, "a3");
  assert((await page.locator("#stageBreadcrumb").innerText()).includes("From Patterns to Gaps"), "A3 did not open.");
  assert(await page.locator("#phaseMenu").isHidden(), "Foundations menu remained open after choosing A3.");
  const a3Example = page.locator('button[data-example-stage="a3"]:visible').first();
  assert(await a3Example.isVisible(), "A3 View example control is missing.");
  await a3Example.click();
  assert(await page.locator("#exampleDialog").isVisible(), "A3 example pop-up did not open.");

  assert(pageErrors.length === 0, `Page errors occurred: ${pageErrors.join(" | ")}`);
  console.log(JSON.stringify({ status: "passed", viewport: "712x1213", stages: ["A2", "A3"], migratedDraft: true }, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

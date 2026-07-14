const { chromium } = require("playwright");

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4182/index.html?v=v481-ui-test";
const outputDir = process.env.QA_DIR || "qa";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function openStage(page, phaseId, stageId) {
  await page.locator(`[data-phase="${phaseId}"]`).click();
  await page.locator(`#phaseMenu [data-stage="${stageId}"]`).click();
  await page.waitForTimeout(80);
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
  page.on("dialog", (dialog) => dialog.accept());

  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem("proposalBuilderA4DraftUploadVersion:welcome:v4.0", "seen");
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);

  assert((await page.locator("#appVersion").innerText()).includes("v4.8.1"), "Header version is not v4.8.1.");
  assert((await page.locator("#appCitationVersion").innerText()) === "4.8.1", "About citation version is not v4.8.1.");
  assert(await page.locator(".status-summary").isVisible(), "Compact header status is missing.");

  const foundations = page.locator('[data-phase="foundations"]');
  await foundations.click();
  assert(await page.locator("#phaseMenu").isVisible(), "Phase menu did not open.");
  assert(await page.locator("#phaseMenu .phase-menu-item").count() === 5, "Foundations menu should contain five stages.");
  assert((await foundations.getAttribute("aria-expanded")) === "true", "Phase trigger does not expose expanded state.");
  await page.locator('#phaseMenu [data-stage="a2"]').click();
  assert((await page.locator("#stageBreadcrumb").innerText()).includes("Deepened Review"), "Phase menu did not navigate to A2.");
  assert(await page.locator("#phaseMenu").isHidden(), "Phase menu did not close after navigation.");

  const studyDesign = page.locator('[data-phase="studyDesign"]');
  await studyDesign.focus();
  await studyDesign.press("ArrowDown");
  await page.waitForTimeout(80);
  const keyboardMenuState = await page.evaluate(() => ({
    menuHidden: document.getElementById("phaseMenu").hidden,
    activeTag: document.activeElement?.tagName,
    activeClass: document.activeElement?.className || "",
    expanded: document.querySelector('[data-phase="studyDesign"]')?.getAttribute("aria-expanded")
  }));
  assert(await page.locator("#phaseMenu .phase-menu-item").first().evaluate((node) => node === document.activeElement), `ArrowDown did not focus the first phase-menu item: ${JSON.stringify(keyboardMenuState)}`);
  await page.keyboard.press("Escape");
  assert(await page.locator("#phaseMenu").isHidden(), "Escape did not close the phase menu.");

  await page.locator('[data-phase="proposalPreparation"]').click();
  await page.locator(".workspace").click({ position: { x: 5, y: 5 } });
  assert(await page.locator("#phaseMenu").isHidden(), "Outside click did not close the phase menu.");

  await openStage(page, "foundations", "a2");
  assert(await page.locator(".a2Patterns-row.protected-standard-row").count() === 7, "A2 standard rows are not protected.");
  assert(await page.locator('.a2Patterns-row [data-key="type"]').count() === 0, "A2 standard pattern types remain editable.");
  assert(await page.locator('.a2Patterns-row [data-remove-row]').count() === 0, "A2 standard rows still have removal controls.");
  assert(await page.locator('#taskRail [data-add-row="a2Patterns"]').isVisible(), "Desktop Add Pattern control is missing.");
  await page.locator('#taskRail [data-add-row="a2Patterns"]').click();
  assert(await page.locator(".a2Patterns-row").count() === 8, "Add Pattern did not create a row.");
  assert(await page.locator('.a2Patterns-row.additional-row [data-remove-row]').count() === 1, "Added A2 row is not removable.");
  await page.locator('.a2Patterns-row.additional-row textarea[data-key="type"]').fill("Additional pattern");
  await page.locator('.a2Patterns-row.additional-row [data-remove-row]').click();
  assert(await page.locator(".a2Patterns-row").count() === 7, "Additional A2 row was not removed.");

  await openStage(page, "foundations", "a3");
  assert(await page.locator(".a3Gaps-row.protected-standard-row").count() === 7, "A3 standard rows are not protected.");
  const containment = await page.locator(".a3Gaps-row:not([hidden])").evaluate((row) => {
    const gap = row.querySelector('[data-key="gap"]');
    const rowRect = row.getBoundingClientRect();
    const gapRect = gap.getBoundingClientRect();
    const formRect = document.querySelector("#stageForm").getBoundingClientRect();
    return { rowRight: rowRect.right, gapRight: gapRect.right, formRight: formRect.right, columns: getComputedStyle(row).gridTemplateColumns.split(" ").length };
  });
  assert(containment.columns === 2, "Desktop A3 card is not using two columns.");
  assert(containment.gapRight <= containment.rowRight + 1 && containment.rowRight <= containment.formRight + 1, "Refined Gap Statement escapes the A3 card.");
  await page.screenshot({ path: `${outputDir}/v481-desktop-a3.png`, fullPage: true });

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(250);
  assert(await page.locator('#stageForm [data-add-row="a3Gaps"]').isVisible(), "Portrait Add Gap Row control is missing.");
  const portraitColumns = await page.locator(".a3Gaps-row:not([hidden])").evaluate((row) => getComputedStyle(row).gridTemplateColumns.split(" ").length);
  assert(portraitColumns === 1, "Portrait A3 card is not using one column.");
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "Portrait layout has horizontal overflow.");
  await page.screenshot({ path: `${outputDir}/v481-portrait-a3.png`, fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(250);
  await page.locator('[data-phase="foundations"]').click();
  const menuRect = await page.locator("#phaseMenu").evaluate((menu) => {
    const rect = menu.getBoundingClientRect();
    return { left: rect.left, right: rect.right, width: window.innerWidth };
  });
  assert(menuRect.left >= 0 && menuRect.right <= menuRect.width + 1, "Mobile phase menu escapes the viewport.");
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "Mobile layout has horizontal overflow.");
  await page.screenshot({ path: `${outputDir}/v481-mobile-menu.png`, fullPage: true });

  await openStage(page, "proposalPreparation", "terms");
  assert(await page.locator('#stageForm [data-add-row="terms"]').isVisible(), "Mobile Add Term control is missing.");

  await page.evaluate(() => {
    const key = "proposalBuilderA4DraftUploadVersion";
    const draft = JSON.parse(localStorage.getItem(key));
    draft.a2.patterns[0] = { ...draft.a2.patterns[0], type: "Local Context", notice: "Preserve this renamed older row." };
    draft.a3.gaps = draft.a3.gaps.filter((row) => row.type !== "Practice");
    localStorage.setItem(key, JSON.stringify(draft));
  });
  const migrationPage = await context.newPage();
  migrationPage.on("pageerror", (error) => pageErrors.push(error.message));
  await migrationPage.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await migrationPage.waitForTimeout(250);
  await openStage(migrationPage, "foundations", "a2");
  assert(await migrationPage.locator('.a2Patterns-row .protected-pattern-value', { hasText: "Context" }).count() === 1, "A missing A2 standard category was not restored.");
  assert(await migrationPage.locator('.a2Patterns-row.additional-row textarea[data-key="type"]').inputValue() === "Local Context", "A renamed older A2 row was not preserved.");
  await openStage(migrationPage, "foundations", "a3");
  assert(await migrationPage.locator('.a3Gaps-row .protected-pattern-value', { hasText: "Practice" }).count() === 1, "A missing A3 standard category was not restored.");
  await migrationPage.close();

  assert(pageErrors.length === 0, `Page errors: ${pageErrors.join(" | ")}`);
  console.log(JSON.stringify({ status: "passed", phaseMenus: 4, protectedA2: 7, protectedA3: 7, migrationChecks: 3, screenshots: 3 }, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});

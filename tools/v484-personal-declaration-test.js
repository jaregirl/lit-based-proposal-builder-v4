const { chromium } = require("playwright");

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4184/index.html?v=v484-personal-declaration-test";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function openDeclarationTask(page) {
  await page.evaluate(() => document.querySelector('[data-stage="details"]')?.click());
  await page.waitForTimeout(80);
  await page.locator("#allTasksBtn").click();
  const declarationTask = page.locator('#allTaskList [data-focus-task="3"]');
  assert(await declarationTask.count() === 1, "Personal declaration task is missing.");
  await declarationTask.click();
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
  page.on("dialog", (dialog) => dialog.dismiss());

  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem("proposalBuilderA4DraftUploadVersion:welcome:v4.8.2-offline", "seen");
  });
  await page.reload({ waitUntil: "domcontentloaded" });

  const groupArrangement = page.locator('#stageForm [data-work-arrangement][value="group"]');
  assert(await groupArrangement.count() === 1, "Group work arrangement control is missing.");
  await groupArrangement.check();

  await openDeclarationTask(page);
  const declaration = page.locator('#stageForm [data-personal-declaration]');
  const declarationCount = await declaration.count();
  if (declarationCount !== 1) {
    const detailsDebug = await page.evaluate(() => ({
      currentStage: document.getElementById("currentStage")?.textContent,
      taskCounter: document.getElementById("stageTaskCounter")?.textContent,
      declarationCount: document.querySelectorAll("#stageForm [data-personal-declaration]").length,
      groupDetailsCount: document.querySelectorAll(".group-details").length,
      visibleTaskText: document.querySelector("#stageTitle")?.textContent
    }));
    throw new Error(`Personal declaration checkbox is missing: ${JSON.stringify(detailsDebug)}`);
  }
  await declaration.check();

  const savedAfterCheck = await page.evaluate(() => JSON.parse(localStorage.getItem("proposalBuilderA4DraftUploadVersion")).submission.personalDeclaration);
  assert(savedAfterCheck === true, "Checking the declaration did not save it to the draft.");
  const missingAfterCheck = await page.evaluate(() => progressSubmissionMissingItems("a1", "single"));
  assert(!missingAfterCheck.includes("Personal copy declaration"), "Progress PDF still treats the checked declaration as missing.");

  await page.evaluate(() => document.querySelector('[data-stage="a1"]')?.click());
  await openDeclarationTask(page);
  assert(await declaration.evaluate((checkbox) => checkbox.checked), "Declaration was lost after a stage rerender.");

  await page.reload({ waitUntil: "domcontentloaded" });
  await openDeclarationTask(page);
  assert(await declaration.evaluate((checkbox) => checkbox.checked), "Declaration was lost after page reload.");

  await declaration.uncheck();
  const missingAfterUncheck = await page.evaluate(() => progressSubmissionMissingItems("a1", "single"));
  assert(missingAfterUncheck.includes("Personal copy declaration"), "Unchecking the declaration did not relock Progress PDF.");

  assert(pageErrors.length === 0, `Page errors occurred: ${pageErrors.join(" | ")}`);
  console.log(JSON.stringify({ status: "passed", persistedAfterRerender: true, persistedAfterReload: true, pdfValidationUpdated: true }, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});

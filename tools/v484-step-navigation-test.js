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

  await chooseFoundationStep(page, "details");
  const groupArrangement = page.locator('input[data-work-arrangement][value="group"]:visible');
  await groupArrangement.check();
  assert(await groupArrangement.isChecked(), "Group work arrangement was not selected before the navigation test.");
  await chooseFoundationStep(page, "a3");
  assert((await page.locator("#stageBreadcrumb").innerText()).includes("From Patterns to Gaps"), "A3 did not open.");
  assert(await page.locator("#phaseMenu").isHidden(), "Foundations menu remained open after choosing A3.");

  await page.locator("#allTasksBtn").click();
  const teamContributionTask = page.locator('#allTaskList [data-focus-task]').filter({ hasText: "Team contribution" });
  assert(await teamContributionTask.count() === 1, "Team contribution is missing from the A3 task list for group work.");
  await teamContributionTask.click();
  const selectedTaskLabel = await page.locator("#taskEyebrow").innerText();
  assert(selectedTaskLabel.toLowerCase() === "team contribution", `Choosing Team contribution returned to another A3 task: ${selectedTaskLabel}`);
  assert((await page.locator("#stageTaskCounter").innerText()) === "Task 13 of 13", "Team contribution was not counted as the final A3 task.");
  await page.locator("#allTasksBtn").click();
  assert(await teamContributionTask.evaluate((element) => element.classList.contains("active")), "Team contribution was not retained when All Tasks reopened.");
  await page.locator('#allTaskList [data-focus-task="0"]').click();

  const a3Example = page.locator('button[data-example-stage="a3"]:visible').first();
  assert(await a3Example.isVisible(), "A3 View example control is missing.");
  await a3Example.click();
  assert(await page.locator("#exampleDialog").isVisible(), "A3 example pop-up did not open.");
  await page.getByRole("button", { name: "Return to my answer" }).click();

  await chooseFoundationStep(page, "details");
  await page.locator("#allTasksBtn").click();
  await page.locator('#allTaskList [data-focus-task="1"]').click();
  const addMember = page.locator('button[data-add-group-member]:visible');
  await addMember.click();
  await page.locator('details.group-person-card:visible').last().locator("summary").click();
  await page.locator('[data-group-person-role="member"][data-group-person-key="name"]:visible').nth(0).fill("Jia Verso");
  await addMember.click();
  await page.locator('details.group-person-card:visible').last().locator("summary").click();
  await page.locator('[data-group-person-role="member"][data-group-person-key="name"]:visible').last().fill("Jia Verso");
  const memberNames = await page.evaluate(() => JSON.parse(localStorage.getItem("proposalBuilderA4DraftUploadVersion")).submission.groupMembers.map((member) => member.name));
  assert(memberNames.filter((name) => name === "Jia Verso").length === 2, `Duplicate roster setup failed: ${memberNames.join(", ")}`);

  await chooseFoundationStep(page, "a3");
  await page.locator("#allTasksBtn").click();
  await teamContributionTask.click();
  await page.locator(".team-contribution-panel > summary").click();
  assert(await page.locator(".group-roster-warning:visible").count() === 1, "Duplicate group names did not produce a roster warning.");
  assert(await page.locator('[data-contribution-key="level"]:visible').count() === 0, "Contribution inputs remained available for a duplicate roster.");
  await page.locator('button[data-open-student-details]:visible').click();
  assert(await page.locator("#studentDetailsDialog").isVisible(), "Review group roster did not open Student Details.");
  await page.locator("#studentDetailsDialog details.group-person-card").last().locator("summary").click();
  await page.locator('button[data-remove-group-member="1"]:visible').click();
  await page.locator("#closeStudentDetailsBtn").click();
  await page.locator(".team-contribution-panel > summary").click();
  assert(await page.locator(".group-roster-warning:visible").count() === 0, "Roster warning remained after the duplicate member was removed.");
  assert(await page.getByRole("heading", { name: "Group member: Jia Verso" }).count() === 1, "The corrected roster still produced duplicate contribution cards.");

  assert(pageErrors.length === 0, `Page errors occurred: ${pageErrors.join(" | ")}`);
  console.log(JSON.stringify({ status: "passed", viewport: "712x1213", stages: ["A2", "A3"], migratedDraft: true }, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

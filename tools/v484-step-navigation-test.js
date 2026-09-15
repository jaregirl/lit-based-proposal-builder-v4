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

async function chooseSectionTask(page, taskIndex) {
  const task = page.locator(`#sectionTaskPath [data-section-task="${taskIndex}"]`);
  assert(await task.isVisible(), `Section task ${taskIndex + 1} was not visible.`);
  await task.click();
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

  await chooseFoundationStep(page, "a4");
  await chooseSectionTask(page, 0);
  const a4Path = page.getByRole("navigation", { name: /Tasks in Literature-Based Problem and Questions/i });
  assert(await a4Path.isVisible(), "The A4 section path is not available.");
  assert((await a4Path.getByRole("button").count()) === 7, "The A4 section path did not list all seven tasks.");
  const a4ProblemExample = page.locator('[data-example-stage="a4"][data-example-type="problem"]').first();
  assert(await a4ProblemExample.isVisible(), "A4.1 did not provide an illustrative example.");
  await a4ProblemExample.click();
  assert(await page.locator("#exampleDialog[open]").isVisible(), "The A4.1 example dialog did not open.");
  assert((await page.locator("#exampleDialogBody").innerText()).includes("Use this template"), "The A4.1 example did not provide a template.");
  await page.locator("#closeExampleDialogBtn").click();
  const gapRefinement = page.locator(".gap-refinement");
  assert(await gapRefinement.isVisible(), "A4 gap refinement is unavailable.");
  assert(!(await gapRefinement.evaluate((element) => element.open)), "An empty optional gap refinement should begin collapsed.");
  await gapRefinement.locator("summary").click();
  await gapRefinement.locator('[data-key="refinedGap"]').fill("The wording is now more specific.");
  assert(await gapRefinement.getByText("Why did the gap wording change?").isVisible(), "The explanation field did not appear after a gap refinement.");
  const a3GapLink = page.getByRole("button", { name: "A3: Final Gap" }).first();
  assert(await a3GapLink.isVisible(), "A4 did not provide an in-context link to the A3 final gap.");
  await a3GapLink.click();
  assert((await page.locator("#stageBreadcrumb").innerText()).includes("From Patterns to Gaps"), "The A3 final-gap link did not open A3.");
  const returnToA4 = page.getByRole("button", { name: "Return to A4.1: State the literature-based problem" });
  assert(await returnToA4.isVisible(), "The source task did not offer a return link to A4.1.");
  await returnToA4.click();
  assert((await page.locator("#stageBreadcrumb").innerText()).includes("Literature-Based Problem and Questions"), "The return link did not restore A4.");
  assert((await page.locator("#taskEyebrow").innerText()) === "A4.1", "The return link did not restore the original A4 task.");

  await chooseFoundationStep(page, "details");
  const groupArrangement = page.locator('input[data-work-arrangement][value="group"]:visible');
  await groupArrangement.check();
  assert(await groupArrangement.isChecked(), "Group work arrangement was not selected before the navigation test.");
  await chooseFoundationStep(page, "a3");
  assert((await page.locator("#stageBreadcrumb").innerText()).includes("From Patterns to Gaps"), "A3 did not open.");
  assert(await page.locator("#phaseMenu").isHidden(), "Foundations menu remained open after choosing A3.");

  const teamContributionTask = page.locator('#sectionTaskPath [data-section-task]').last();
  assert(await teamContributionTask.getAttribute("title") === "Team contribution", "Team contribution is missing from the A3 section path for group work.");
  await teamContributionTask.click();
  const selectedTaskLabel = await page.locator("#taskEyebrow").innerText();
  assert(selectedTaskLabel.toLowerCase() === "team contribution", `Choosing Team contribution returned to another A3 task: ${selectedTaskLabel}`);
  assert((await page.locator("#stageTaskCounter").innerText()) === "Task 13 of 13", "Team contribution was not counted as the final A3 task.");
  assert(await teamContributionTask.getAttribute("aria-current") === "step", "Team contribution was not retained as the current section task.");
  await chooseSectionTask(page, 0);

  const a3Example = page.locator('button[data-example-stage="a3"]:visible').first();
  assert(await a3Example.isVisible(), "A3 View example control is missing.");
  await a3Example.click();
  assert(await page.locator("#exampleDialog").isVisible(), "A3 example pop-up did not open.");
  await page.getByRole("button", { name: "Return to my answer" }).click();

  await chooseFoundationStep(page, "details");
  await chooseSectionTask(page, 1);
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
  await teamContributionTask.click();
  await page.locator(".team-contribution-panel > summary").click();
  assert(await page.locator(".group-roster-warning:visible").count() === 1, "Duplicate group names did not produce a roster warning.");
  assert((await page.locator(".group-roster-warning:visible").innerText()).includes("where the group names were first entered"), "Duplicate roster warning did not direct students back to the original Student Details roster.");
  assert(await page.locator('[data-contribution-key="level"]:visible').count() === 0, "Contribution inputs remained available for a duplicate roster.");
  await page.locator('button[data-open-student-details]:visible').click();
  assert(await page.locator("#studentDetailsDialog").isVisible(), "Review group roster did not open Student Details.");
  await page.locator("#studentDetailsDialog details.group-person-card").last().locator("summary").click();
  await page.locator('button[data-remove-group-member="1"]:visible').click();
  await page.locator("#closeStudentDetailsBtn").click();
  await page.locator(".team-contribution-panel > summary").click();
  assert(await page.locator(".group-roster-warning:visible").count() === 0, "Roster warning remained after the duplicate member was removed.");
  assert(await page.getByRole("heading", { name: "Group member: Jia Verso" }).count() === 1, "The corrected roster still produced duplicate contribution cards.");
  const contributionMemberId = await page.evaluate(() => JSON.parse(localStorage.getItem("proposalBuilderA4DraftUploadVersion")).submission.groupMembers[0].id);
  await page.locator(`[data-contribution-person="${contributionMemberId}"][data-contribution-key="level"]:visible`).selectOption("agreed");

  await chooseFoundationStep(page, "a2");
  await page.locator("#sectionTaskPath [data-section-task]").last().click();
  await page.locator(".team-contribution-panel > summary").click();

  await chooseFoundationStep(page, "details");
  await chooseSectionTask(page, 1);
  await page.locator('details.group-person-card:visible').last().locator("summary").click();
  await page.locator('[data-group-person-role="member"][data-group-person-key="name"]:visible').fill("Jia Verso Updated");
  const synchronizedRecords = await page.evaluate(() => {
    const draft = JSON.parse(localStorage.getItem("proposalBuilderA4DraftUploadVersion"));
    const member = draft.submission.groupMembers[0];
    return ["a2", "a3"].map((stageId) => ({
      stageId,
      rosterName: draft.teamContributions[stageId]?.rosterSnapshot.find((person) => person.id === member.id)?.name || "",
      level: draft.teamContributions[stageId]?.assessments[member.id]?.level || ""
    }));
  });
  assert(synchronizedRecords.every((record) => record.rosterName === "Jia Verso Updated"), `Roster name did not synchronize across saved contribution records: ${JSON.stringify(synchronizedRecords)}`);
  assert(synchronizedRecords.find((record) => record.stageId === "a3")?.level === "agreed", "Existing A3 contribution level was lost when the roster name changed.");

  assert(pageErrors.length === 0, `Page errors occurred: ${pageErrors.join(" | ")}`);
  console.log(JSON.stringify({ status: "passed", viewport: "712x1213", stages: ["A2", "A3"], migratedDraft: true }, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

# Focused Task Declutter Design QA

## Evidence

- Desktop focused-task capture: `qa/v480-desktop.png`, 1440 x 1024 pixels.
- Desktop A3 capture: `qa/v481-desktop-a3.png`, 1440 pixels wide.
- Mobile focused-task capture: `qa/v480-mobile.png`, 390 pixels wide.
- Selected visual target: the existing focused-task screen with the duplicate right-side task rail removed.

## Findings

No actionable P0, P1, or P2 differences remain.

- The duplicate right-side task rail is absent and the response remains the sole central work area.
- The focused task, working-draft notice, A3 work area, and feedback boundary now use the freed width up to a shared 1,180-pixel maximum rather than preserving the former rail's empty column.
- Add Pattern, Add Gap Row, and Add Term remain available inside their relevant tasks.
- The footer names the current builder on desktop, such as `All Tasks for Instrumentation Builder`.
- At 390 pixels, the same control uses the compact stage-aware form `All A1 Tasks`, preventing the footer from becoming unusually tall. Its accessible name retains the full builder wording.
- Back, Continue, the task chooser, all 14 stages, A2/A3 controls, the personal declaration, and Proposal at a Glance passed browser checks.
- Page errors: none.

final result: passed

---

# Proposal at a Glance Design QA

## Evidence

- Source visual truth: `C:/Users/guestjare.MYLAPTOP/.codex/generated_images/019fae83-de4c-7b73-b6de-b5bd441b83b1/exec-10bae152-7f46-4f06-901c-816409e6ed17.png`
- Source dimensions: 1487 x 1058 pixels.
- Browser-rendered desktop implementation: `qa/v484-proposal-glance.png`
- Desktop implementation dimensions and viewport: 1440 x 1024 pixels at a 1440 x 1024 CSS viewport, device scale factor 1.
- Browser-rendered mobile implementation: `qa/v484-proposal-glance-mobile.png`
- Mobile implementation dimensions and viewport: 390 x 1783 full-page pixels at a 390 x 844 CSS viewport, device scale factor 1.
- Side-by-side comparison: `qa/v484-proposal-glance-comparison.png`, 1600 x 720 pixels.
- State: Proposal at a Glance open from Status with one completed research-question alignment row and assessment-literacy demonstration data.
- Density normalization: source and desktop implementation were both rendered at their native 1x pixel dimensions and scaled proportionally into equal-width columns for the comparison.

## Findings

No actionable P0, P1, or P2 differences remain.

- Fonts and typography: The implementation preserves the app's Arial/Helvetica type system, heading hierarchy, readable body size, and restrained link emphasis. The source and implementation wrap differently only where their example content differs.
- Spacing and layout rhythm: The implementation matches the full-width page structure, top-right actions, notice, six-part logic row, alignment table, and summary strip. Card spacing and section rhythm remain consistent with the existing app.
- Colors and visual tokens: Existing paper, surface, deep-green accent, muted gray text, and thin-border tokens are preserved. No new gradients or heavy shadows were introduced.
- Image quality and asset fidelity: The screen uses only the app's existing logo asset. The source mock contains no required illustration or photographic assets. No image asset was replaced with a code-drawn approximation.
- Copy and content: The guidance disclaimer, section labels, source-task actions, Not entered state, and research alignment headings match the approved wording. The unverified author-year citation from the mock was intentionally omitted.
- Responsive behavior: At 390 pixels, the six-part logic remains one continuous horizontal sequence with its own sideways scroller, while each research-question alignment row becomes a labeled vertical group. There is no page-level or table-level horizontal scrolling.
- Accessibility and interaction: Status exposes three keyboard-focusable options. Source-task links return to and focus the exact response field. The glance heading receives focus when opened. Print and return actions work.

## Intentional Differences

- The selected mock uses arrows between logic cards. The implementation uses explicit numbering and left-to-right order to preserve the relationship without introducing decorative connector assets.
- The mock shows two sample research questions. The implementation renders the student's actual question count; the tested state has one completed question.
- The active journey phase reflects the student's real current stage rather than forcing Readiness and Submission.

## Comparison History

1. Initial capture found a P1 layout error: the whole-proposal sequence was nested inside a second grid, compressing all six cards into narrow columns.
2. The duplicate grid wrapper was removed and the ordered list became the single six-column grid.
3. The revised desktop capture shows six readable cards spanning the page, consistent with the selected mock.
4. Mobile inspection found that a horizontally scrolling table hid later alignment columns from the static view. The table was changed to labeled stacked fields at 390 pixels. The revised capture shows every field without horizontal scrolling.
5. The logic sequence was kept in one horizontal line at every width. Narrow screens use readable fixed-width cards within an internal sideways scroller rather than stacking the proposal logic.

## Verification

- Shared claim migrated from older duplicate A4 and Instrumentation values.
- Editing A4 updates Instrumentation.
- Editing Instrumentation updates A4.
- The shared value persists after reload.
- Proposal at a Glance opens from Status without using the Status dialog.
- Whole-proposal and question-level source links open and focus their exact tasks.
- Print this view invokes the print flow.
- Desktop and mobile layouts passed focused checks.
- Existing Status, A2/A3 navigation, personal declaration, and focused-stage regression tests passed.
- Browser page errors and console errors: none.

## Follow-up Polish

None required for this implementation scope.

final result: passed

---

# Previous v4.8.0 Design QA

## Reference

The implementation was compared with the approved Option 3 Research Journey mockups for Student Details, A1-A4, Framework, Methodology, Ethics, Instrumentation, Definition of Terms, Proposal Outline, Research Level Justification, Readiness, and PDF Submission.

## Verified Experience

| Area | Result |
| --- | --- |
| Four-phase Research Journey | Passed |
| One active task at a time | Passed |
| Back and Continue move through tasks before stages | Passed |
| All Tasks and All Steps provide direct access | Passed |
| Status and Tools remain available without dominating the workspace | Passed |
| All 14 stages render a focused task title and counter | Passed |
| Existing v4.7 proposal schema remains unchanged | Passed |
| Single-part progress-PDF preview | Passed |
| Desktop 1440 x 1024 | Passed |
| Portrait 768 x 1024 | Passed |
| Mobile 390 x 844 | Passed |
| Mobile horizontal overflow | Passed |
| Mobile primary action visibility | Passed |
| Browser page errors | Passed |

## Learner Experience Evaluation

- **Next-step visibility:** Strong. The active task title, task counter, Continue action, and desktop task rail make the next action explicit.
- **Cognitive load:** Improved. Students see one research decision at a time while retaining All Tasks and All Steps for non-linear revision.
- **Scaffold clarity:** Preserved. Existing field guidance remains available through the help control and task support text.
- **Research-process integrity:** Preserved. The interface changes presentation only; literature-first reasoning, alignment checks, adviser review, ethics, instrumentation, and PDF logic remain intact.
- **Error recovery:** Strong. Students can move backward, skip temporarily, jump to another task or stage, restore checkpoints, and download backups.
- **Novice suitability:** Improved. Utilities, scores, and outstanding issues no longer compete with the current learning task.
- **Adviser role:** Preserved. Automated checks remain developmental and do not present app output as academic approval.

## Visual Notes

- Typography now distinguishes phase, task, title, support, field label, and guidance.
- The palette uses restrained green for navigation, warm orange for task orientation, and neutral surfaces for sustained reading.
- Active fields use the full working column on desktop and portrait screens.
- The right task rail disappears on mobile, while All Tasks remains available.
- The bottom action bar remains visible without covering the active input.
- Confidential group contribution records appear as their own task instead of adding clutter beneath every academic prompt.

## Evidence

- `qa/v480-desktop.png`
- `qa/v480-portrait.png`
- `qa/v480-mobile.png`
- `tools/v480-focused-ui-test.js`

## Remaining Pilot Questions

- Whether students understand the distinction between All Tasks and All Steps without teacher explanation.
- Whether Skip for now is used productively or encourages excessive incomplete sections.
- Whether the number of Instrumentation subtasks feels proportionate when seven SRQs are used.
- Whether advisers prefer the contribution-record task at the end of each part or at submission time.

final result: passed

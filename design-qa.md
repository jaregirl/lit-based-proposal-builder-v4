# v4.8.0 Design QA

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

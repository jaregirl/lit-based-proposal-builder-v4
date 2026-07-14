# Lit-Based Proposal Builder v4

The Lit-Based Proposal Builder is a browser-based guided academic thinking tool developed by J. Arawiran. It helps novice researchers move from literature patterns to a gap, problem, questions, framework, methodology, ethics, instrumentation, and proposal-ready outputs.

## v4.8.1 Navigation and UI Consistency Patch

This release reorganizes the complete v4 proposal workflow into a quieter, task-focused learning interface while preserving the v4.7 proposal schema and outputs.

- four visible phases: Foundations, Study Design, Proposal Preparation, and Readiness & Submission;
- one meaningful research task at a time;
- task-first Back and Continue navigation;
- All Tasks and All Steps views for direct access;
- compact Status and Tools dialogs;
- responsive desktop, portrait, and mobile layouts;
- no change to the proposal-data schema, backup format, progress PDFs, final PDFs, ERB drafts, or group-accountability records.

The preserved v4.7 capabilities include:

- individual and group work with per-person readiness reflections;
- adviser information and review records;
- stable research-question-to-instrument alignment;
- a transparent quantitative, qualitative, and mixed-methods design cascade;
- action research as a separate orientation;
- local ERB consent, permission, and assent draft preparation;
- forward restoration of older backups;
- local update notifications, checkpoints, active-work estimates, and anonymous app feedback;
- progress, readiness, and academically clean final outputs.
- personal member copies that strip confidential source-student records;
- confidential, adviser-only Team Contribution Records for each submitted academic part;
- source-copy provenance without interpreting activity as total group work;
- Brookhart and CATME citation notes as conceptual influences only.

## Run Locally

Serve this folder with any static file server, then open `index.html`. The app has no backend and does not require an AI service.

## Privacy and Saving

Proposal data is stored in the user's browser. The app does not send proposal answers to the developer, instructor, or a cloud server. When online, the app requests only the same-site `version.json` file to check for a newer release.

- **Autosave** preserves the latest browser state.
- **Save Draft** creates a restorable checkpoint.
- **Download Backup** creates a portable JSON file.

Users should download a backup before opening a newer version or changing devices or browsers.

## ERB Drafts

Generated consent, permission, and assent documents are working drafts for adviser and ERB review. They do not constitute ethics approval and must not be used to begin recruitment or data collection. The current official institutional form and procedures must be verified before use. Signed forms and participant-identifying information must never be stored in the app.

## Verification

Run the browser smoke test from this directory:

```powershell
node tools/pilot-smoke-test.js
```

The test covers responsive layouts, old-backup migration, group work, stable SRQ/instrument linkage, methodology cascading, ERB draft download, and update-check behavior.

The tokenized DOCX files are structurally checked by `tools/build_erb_templates.py`. Visual rendering still requires Microsoft Word or LibreOffice.

The Team Contribution Record is original and nonvalidated. It does not reproduce CATME's instrument, behavioral anchors, scoring method, or exceptional-condition classifications. Advisers perform all analysis and interpretation.

## Attribution and Rights

Ordinary student use does not require citation. A suggested citation is available inside the app. Reproducing or presenting the instructional scaffolds requires attribution to J. Arawiran. Adaptation or redistribution requires permission while institutional ownership is being clarified.

See `THIRD_PARTY_NOTICES.md` for third-party and HNU template notices. No definitive proprietary license is asserted in this pilot.

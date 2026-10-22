# v4.9.3 Task Workspace Layout

## Scope

Approved layout integrated into the existing app without replacing research forms or event handlers. Tools provides Classic/New layout switching. Classic is the initial default; the browser remembers the selected layout separately from proposal data. Case-study guidance is not included in this release.

## Checks completed

- JavaScript syntax checks and ten Node-only regression suites covering A1/A4 saved responses, examples (78 task/approach renderings), eligibility, term exports, adviser data isolation/matrix, update loading, shared UI, layout wiring and offline asset references.
- Browser inspection of the integrated test copy: whole desktop left panel remains pinned below the header; stationary footer stays clear of it; Work arrangement dropdown retains the existing Group selection.
- Mobile at 390x844: sticky resource row, expandable full question, Help opening/closing and return focus. Desktop 985x524 retains full question and hides the mobile toggle.
- Compact header measured 94.67px versus the prior 151.5px at phone width; phase labels fit without horizontal scrolling. No page-wide overflow observed at 320x524 and 390x844. Full Study Design menu still opens.
- Proposal storage key, schema version and export routines retained. No existing browser data is reset or migrated by the layout preference.
- Tabler icon assets and their MIT license are included in the offline shell.

## Remaining verification limits

Broad end-to-end browser regression across every task, backup/restore downloads, official PDF output, fresh offline installation/update, physical touch/virtual keyboard, 200% zoom and formal accessibility testing have not been completed for this integration. Earlier browser checks were initially blocked; the connected test copy later became available and the checks listed above were completed. Do not represent this as full accessibility or workflow certification.

User requested copying the reviewed changes into the actual app folder, leaving commit/push to the user. No commit or publication was performed by the assistant.

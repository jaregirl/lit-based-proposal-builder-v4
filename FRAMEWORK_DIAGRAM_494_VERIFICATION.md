# Framework diagram builder — v4.9.4

## Location and scope

Study Design → Framework Finder and Alignment → Diagram → Edit diagram. Available in Classic and New layouts. Optional: existing written framework responses and completion requirements are unchanged.

Students add/edit/delete concept boxes; select From/To concepts; label arrows; identify their basis as literature/theory-supported or proposed; explain connections; and save positions. Pointer dragging and keyboard arrows are implemented. Undo restores concept deletion and connected arrows. Self-links are not supported in this first version. On phones the editor opens on Diagram, with Concepts & arrows as a separate editing view and horizontal canvas scrolling.

Diagrams use an additive `frameworkDiagram` object: version, nodes, links and explanation. Existing proposal storage keys and schema remain unchanged. Old backups receive an empty optional diagram; valid diagram JSON round-trips. No bitmap or remote service is stored or used. No student responses or demonstration diagram are copied into application files.

## Verified

- Eleven Node-only regression suites passed, including the new diagram test: legacy written responses, valid diagram round-trip, malformed/duplicate/orphan safety, coordinate bounds, HTML/SVG escaping, adviser import preservation, progress/final export and offline asset wiring. Existing examples, terms, eligibility, adviser isolation and update-loading suites also passed.
- Integrated browser at 1280×850: three demonstration concepts, two labelled arrows and a written explanation. Reopened after page reload; keyboard movement changed x from 40 to 45. Deleting a selected concept removed its linked arrow; Undo restored all three concepts and both arrows.
- Editing a new relationship did not change an existing arrow. SVG download completed. JSON backup downloaded and restored through the normal interface, retaining labels, positions, arrows and explanation.
- Submission preview contained one framework SVG plus its complete text description.
- At 390×844, no editor-wide horizontal overflow; the canvas intentionally scrolls horizontally. Mobile Diagram/Concepts & arrows switching verified.
- Adviser view is read-only by implementation. Node tests verify imported diagram records remain unchanged; no new diagram requirement is added to readiness checks.

## Limitations / pending checks

- Direct mouse/touch dragging could not be exercised through the available browser controls. Keyboard movement was verified; physical pointer/touch and pen testing remain pending.
- Adviser diagram display was not separately exercised in the browser; data preservation and read-only wiring were checked in source/Node tests.
- Actual PDF print output, multi-page long-diagram layouts, device keyboards and formal accessibility testing remain pending. Submission-preview rendering is not a claim of print/PDF verification.
- Long labels are shortened visually within boxes; full text remains in editing controls, SVG titles and the text description. Students must arrange overlapping boxes/arrows themselves; no automatic layout or methodological validation is performed.

Browser demonstration data is isolated to http://127.0.0.1:4201/ and is not in the actual app's student storage. No commit or push was performed.

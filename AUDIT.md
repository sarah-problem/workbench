# Clinical Workbench audit — October 3, 2026

Reviewed the 37 production source files individually: 11 HTML pages, 11 stylesheets, and 15 scripts. The review covered dependencies, state changes, output generation, reset behavior, numerical handling, CSS hierarchy, unused code, accessibility wiring, and comments. The README and test documentation were rewritten afterward.

This is a software review, not a certification that every clinical instrument is reproduced or interpreted correctly. Passing these checks is evidence for the behaviors tested, not proof that all possible defects have been eliminated.

## Confirmed issues corrected

| Finding                                                                                                                                               | Correction                                                                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Inherited object keys such as `?measure=constructor` could break the brief assessment page.                                                           | Restrict URL lookup to explicitly defined measures; test unsupported keys.                                                               |
| TSDS could include typed Other text while its checkbox remained unchecked.                                                                            | Typing and selecting are independent; output includes only checked attributions.                                                         |
| TSDS lowercased the first-person pronoun in generated question text.                                                                                  | Preserve “I” when joining the introductory phrase to a question.                                                                         |
| Number fields could display a decimal or out-of-range value while output used a silently clamped value.                                               | Preserve typed values, apply native bounds/step validation, and block documentation/copying while an enabled numerical field is invalid. |
| ISAS could include an unnamed Other count in its total but omit the behavior from documentation.                                                      | Include a neutral “Other behavior” label when a positive count has no description.                                                       |
| Y-BOCS Reset cleared only the visible age version.                                                                                                    | Clear both adult and child states so hidden answers cannot carry into the next assessment.                                               |
| FASM and TSDS rebuilt whole control groups after individual selections.                                                                               | Update affected controls in place, preserving focus and unfinished edits elsewhere.                                                      |
| Comprehensive risk progress did not count detailed thought findings as an entry.                                                                      | Count frequency, duration, controllability, deterrents, and reasons consistently with other inquiry details.                             |
| Risk HTML contained a low-risk explanation before any risk level was selected.                                                                        | Start with empty, hidden explanations; shared JavaScript reveals only the selected level.                                                |
| PHQ-9 instructions and adolescent timeframe guidance conflicted.                                                                                      | Remove the one-week recommendation and clarify that this page does not reproduce the adolescent-modified form.                           |
| CSS visually placed Create before Copy while keyboard/DOM order placed Copy first.                                                                    | Insert Create before Copy in the DOM too.                                                                                                |
| Some generated fields had only placeholder labels; the LPFS reference table lacked cell roles; Y-BOCS hidden radios lacked a visible focus indicator. | Add accessible names, complete the table's roles, and style keyboard focus.                                                              |
| Embedded link handling intercepted modified clicks and could throw on malformed URL fragments.                                                        | Preserve ordinary browser link behavior and safely ignore invalid fragments.                                                             |

The adolescent-modified PHQ-A uses a two-week symptom timeframe and includes wording/questions not reproduced by the standard page. Reference: [NIMH PHQ-A form](https://www.nimh.nih.gov/sites/default/files/documents/PHQ-A_with_depression_questions_and_ASQ_PDF.pdf). The audit corrected conflicting guidance rather than relabeling the existing questionnaire as PHQ-A.

## Removed repetition and vestiges

- Removed three unused MSE helpers, an unused teaching-data helper, and the obsolete second Notes/comparison rendering pathway.
- Removed duplicate speech/thought-process definitions that could never render because those sections use their visual-guide explanations.
- Consolidated successive MSE teaching-panel CSS overrides; the measured MSE styles matched before and after this consolidation.
- Removed unused brief-screen metadata, unused output references, an unused ISAS ranking variable, and unused screening selectors.
- Removed a redundant screening interpretation render; built the static LPFS reference table once instead of after every answer.
- Centralized optional-detail opening rules in one named map; combined identical reset loops.
- Standardized numerical result sizing, quieted the remaining bold custom-symptom labels, and retained regular-weight answer/action text.
- Expanded dense HTML template strings, formatted the source consistently, corrected stale comments, and explained validation, state, output, and indexing decisions.

Shared concepts remain shared; clinically different calculations and output styles remain in their respective tools. Small local helpers in separate standalone pages are not automatically a problem—forcing all of them through a generalized engine would add coupling without necessarily improving readability.

## File-by-file record

| File                      | Review/result                                                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `index.html`              | Tool links, assets, theme wiring; corrected PHQ-9 description.                                                         |
| `mse.html`                | Mode controls, toolbar, generated fields, dependency order; named output and current shared references.                |
| `quick-risk.html`         | Input/value mappings, optional text, reset/output controls; neutral initial risk display and accessible text fields.   |
| `comprehensive-risk.html` | Every inquiry and factor group, detail controls, output mappings; neutral initial risk display and field labels.       |
| `screening.html`          | Dynamic question targets, score/impact displays, alert, output controls.                                               |
| `brief-assessment.html`   | Shared measure containers, result fields, output and references.                                                       |
| `isas.html`               | Behavior/context inputs, function results, notices, section links.                                                     |
| `fasm.html`               | Behavior/context/reason targets, score displays, notices, section links.                                               |
| `lpfs.html`               | Question/result/reference targets; completed reference-table roles.                                                    |
| `tsds.html`               | Symptom/attribution/results targets, section links, output controls.                                                   |
| `ybocs.html`              | Version controls, checklist/severity targets, output and references.                                                   |
| `workbench.css`           | Dashboard grid, card spacing, breakpoints; merged identical grid declarations.                                         |
| `mse.css`                 | Learn/Compact, teaching content, diagrams, context and conditional fields; removed historical override stack.          |
| `risk.css`                | Both risk layouts, selected chips, risk categories, responsive rules; merged duplicate adjacent selector.              |
| `screening.css`           | Shared scored-tool base, answers, results and alerts; removed unused selectors.                                        |
| `brief-assessment.css`    | Numeric fields, compact response grids, introductory/reference panels; retained.                                       |
| `isas.css`                | Behavior/function/result layouts and breakpoints; corrected misleading navigation comment.                             |
| `fasm.css`                | Behavior rows, context and function results, responsive layouts; retained.                                             |
| `lpfs.css`                | Domain results, marker bars and horizontally scrolling reference table; retained.                                      |
| `tsds.css`                | Attribution/percentage rows and response distribution; retained.                                                       |
| `ybocs.css`               | Symptom rows, target fields, anchors and results; retained with shared focus correction.                               |
| `workbench-shared.css`    | Palette, type hierarchy, controls and output toolbar; result scale, quiet custom labels, validation and focus rules.   |
| `mse-data.js`             | IDs/defaults/categories, choice coverage, context relevance and teaching data; removed unused definitions/helper.      |
| `mse.js`                  | Rendering, selection, context, both outputs, reset and modes; removed dead pathways and labeled orientation groups.    |
| `quick-risk.js`           | Selected-only output, details, reset and risk display; removed unnecessary readonly-field listeners and stale comment. |
| `comprehensive-risk.js`   | Group mapping, both formats, progress, detail toggling, reset; corrected progress and consolidated wiring.             |
| `screening.js`            | Score bands, impact, alert, outputs and reset; removed redundant work and conflicting guidance.                        |
| `brief-assessment.js`     | All seven configurations, label/score state, reset, numerical inputs and URL selection; validation and lookup fixes.   |
| `isas.js`                 | Item numbering, function sums, behavior totals, ranking, outputs and reset; fixed unnamed Other and count handling.    |
| `fasm.js`                 | Factor alignment, means, behavior/context state and outputs; numerical validation and updates that preserve focus.     |
| `lpfs.js`                 | Item/weight/domain alignment, totals, markers, outputs and reset; explicit preset naming and static table rendering.   |
| `tsds.js`                 | Symptom totals, attribution handling, outputs and reset; checked-only Other, pronoun, percentages and focus fixes.     |
| `ybocs.js`                | Separate states, severity totals, checklist and additional items, outputs/reset; reset both versions and field naming. |
| `embed-resize.js`         | Standalone exit, layout messages, link handling and observers; defensive fragment/modifier handling.                   |
| `workbench-theme.js`      | Pre-paint theme, saved preference/fallback, button creation and cross-tab changes; retained.                           |
| `workbench-ui.js`         | Generation/edit/reset state, selected-state accessibility, clipboard paths; numerical gate and toolbar DOM order.      |

## Verification and limits

[tests/QA.md](tests/QA.md) records the checks performed. Automated tests cover calculations as configured, not independent clinical scoring validation. Browser checks cover the in-app browser at 1280px and 390px widths; they do not constitute a full cross-browser or assistive-technology certification.

Remaining boundaries:

- Preset responses are still intentional. A note can reflect unreviewed presets if someone clicks Create without reviewing; the software cannot establish that an assessment occurred.
- Instrument wording, versions, cutoffs, factor assignments, norms, and reproduction permissions need a separate source-by-source clinical review. This audit did not certify them.
- Method-frequency totals do not establish a count of unique episodes when several methods occur in one episode.
- The embedding parent and production deployment are outside this folder and were not changed or tested end to end.
- No private documents or unrelated helper scripts in the folder were treated as app code or modified.

A pre-edit backup of the website source and tests was saved locally at `/private/tmp/clinical-audit-20261003-before`. Temporary-folder backups are not permanent version control. No changes were uploaded or published.

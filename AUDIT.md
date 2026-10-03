# Clinical Workbench audit — October 3, 2026

Reviewed the 37 production source files individually: 11 HTML pages, 11 stylesheets, and 15 scripts. The review covered dependencies, state changes, output generation, reset behavior, numerical handling, CSS hierarchy, unused code, accessibility wiring, and comments. The README and test documentation were rewritten afterward.

This is a software review, not a certification that every clinical instrument is reproduced or interpreted correctly. Passing these checks is evidence for the behaviors tested, not proof that all possible defects have been eliminated.

## Remaining questionnaire defaults removed

Extended the blank-start correction to ISAS, FASM, TSDS, Y-BOCS/CY-BOCS, and all seven brief screeners. Ratings, numeric fields, medical-treatment choices, and other context no longer receive preset clinical answers. Required scoring inputs gate total scores and completed documentation; optional context remains optional. Individual ISAS/FASM function scores require all their component responses. Alerts continue to respond to explicit endorsements before completion.

ISAS supports Section I-only documentation when all listed counts are explicitly zero, no other/main behavior is entered, and function ratings are untouched. PC-PTSD-5 uses its existing No-exposure route without requiring symptom responses or inserting zero answers. Y-BOCS optional ratings are omitted unless entered. MSE retains its normal preset; risk forms were already blank.

Added `tests/questionnaire-defaults.cjs` and updated earlier tests to expect unanswered resets. All five automated scripts pass. Browser checks found no initial answer selections, numeric prefills, or generated notes across the 11 newly changed routes; CY-BOCS was checked separately. ISAS full generation/reset, FASM blank follow-ups, Y-BOCS optional-rating omission/version separation, PC-PTSD-5 skip behavior, and TSDS blank percentages were exercised. See [tests/QA.md](tests/QA.md).

## Earlier blank-start correction

After reviewing the preset behavior with the user, changed LPFS-SR, PHQ-9, and GAD-7 to start and reset unanswered. The earlier audit retained those presets; that was a usability issue it should have flagged. Unanswered items now remain distinct from zero-point answers. Scores, interpretations, and completed documentation are withheld until all scored items have responses; progress is shown instead. Functional impact also starts unselected and is omitted from documentation unless answered. PHQ-9 item 9 still triggers its existing alert on a partially completed form.

Added `tests/blank-start.cjs` and a shared generation-gate regression. The earlier verification sections describe the behavior at the time; preset claims there no longer apply to these three questionnaires. The subsequent correction above extends this behavior to the remaining questionnaires.

## Follow-up review after the interrupted session

Revisited the production files and completed the interrupted FASM/TSDS follow-up fields. The file-by-file table below records the original audit; this section records the subsequent corrections rather than treating old work as new.

| Finding                                                                                                                               | Correction                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| FASM frequency and treatment controls looked available before their behavior was selected; the checkbox was separated from its label. | Keep checkbox and label together; reveal enabled follow-up fields only after selection. Other text is conditional too.                                                               |
| TSDS percentages looked editable for unchecked attributions.                                                                          | Reveal the percentage only for a checked attribution and reveal Other text only when Other is checked; retain entries for reselection while excluding unchecked entries from output. |
| Shared introduction, question, navigation, and alert styles were repeated in tool stylesheets.                                        | Move common layout rules into `screening.css`; preserve tool-specific differences, including ISAS static navigation. Remove overridden response-grid rules and unused selectors.     |
| Output labels and generated-note typography varied across apps.                                                                       | Use Generated Documentation and Narrative / List consistently; share 16px regular-weight output text and its box spacing, including MSE Compact.                                     |
| Quick-risk detail buttons used different wording.                                                                                     | Match the comprehensive form’s Add details label.                                                                                                                                    |
| MSE observation buttons did not communicate their open state, and some example placeholders still contained instructions.             | Add matching Add/Hide labels and expanded-state attributes; combine plain examples under one Ex.: prefix.                                                                            |
| MSE repeated context-summary logic and orientation domain names.                                                                      | Use one context-summary helper and read orientation domains from the existing data definition. Rename the choice renderer to reflect support for multiple selections.                |
| MSE thought-content output could read “with notable for … thought content.”                                                           | Give thought content its own grammatical clause. Remove redundant definition sentences.                                                                                              |
| ISAS tried to update score elements that no longer exist and retained unused item metadata.                                           | Remove the dead update loop and metadata; use native hidden state for its notice and make count/rating accessible names more specific.                                               |
| A checked custom Y-BOCS symptom vanished from documentation when its text was blank.                                                  | Include a neutral “not described” fallback; trim blank target entries and fix two-item list punctuation. Add symptom group names for Current/Past controls.                          |
| FASM called summed method frequencies “incidents.”                                                                                    | Label the result Total across methods and describe it as summed frequency. Arithmetic is unchanged; several methods can occur within one episode.                                    |

Comments now explain the shared ownership of layouts, conditional-field state, example selection, and the distinction between method frequencies and episodes. The fixes preserve configured scoring and existing selections/defaults.

Three automated test scripts pass. The repeated 44-combination browser matrix found no page-level horizontal overflow; sampled answer options remained 14px/400 and generated output was 16px/400 across tools and themes. See [tests/QA.md](tests/QA.md) for the additional interaction checks and the limits of that coverage.

A second pre-edit source snapshot is at `/private/tmp/clinical-review-followup-before`; it already includes the interrupted conditional-field edits. Neither temporary snapshot replaces permanent version control. No files were uploaded or published.

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

- MSE normal preset responses are still intentional; scored questionnaires now start unanswered. A note can reflect unreviewed presets if someone clicks Create without reviewing; the software cannot establish that an assessment occurred.
- Instrument wording, versions, cutoffs, factor assignments, norms, and reproduction permissions need a separate source-by-source clinical review. This audit did not certify them.
- Method-frequency totals do not establish a count of unique episodes when several methods occur in one episode.
- The embedding parent and production deployment are outside this folder and were not changed or tested end to end.
- No private documents or unrelated helper scripts in the folder were treated as app code or modified.

A pre-edit backup of the website source and tests was saved locally at `/private/tmp/clinical-audit-20261003-before`. Temporary-folder backups are not permanent version control. No changes were uploaded or published.

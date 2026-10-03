# Clinical Workbench

A static website for clinical assessment, screening, teaching, and documentation. Start with `index.html`. There is no build step, package installation, database, or application server required by the website.

## Running and uploading

Open `index.html` in a modern browser, or preview it over localhost from this folder:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Then visit `http://127.0.0.1:8765/index.html`. Stop the preview with Ctrl+C. Localhost is useful for testing browser behavior such as copying; clipboard permissions can differ when opening a file directly.

Upload the root `.html`, `.css`, and `.js` files together, keeping their filenames and relative locations. The `?v=...` suffixes on asset links are cache versions, not part of the filenames. When changing shared code or styles, update their version suffix on every page that loads them. Nothing in this project publishes changes automatically.

The `tests` folder and Markdown documentation are development resources; they are not required to run the site. Unrelated scripts, generated documents, and private files that happen to share this folder are not website assets and should not be included in a website upload.

The old filenames `app.js` and `styles.css` were replaced by `mse.js` and `mse.css`. No current page loads the old names.

## File map

HTML defines the page structure; CSS controls appearance; JavaScript supplies questions, handles answers, calculates scores, and assembles notes.

| Page                      | Content and behavior         | Page styles                             |
| ------------------------- | ---------------------------- | --------------------------------------- |
| `index.html`              | Tool links in the HTML       | `workbench.css`                         |
| `mse.html`                | `mse-data.js`, then `mse.js` | `mse.css`                               |
| `quick-risk.html`         | `quick-risk.js`              | `risk.css`                              |
| `comprehensive-risk.html` | `comprehensive-risk.js`      | `risk.css`                              |
| `screening.html`          | `screening.js`               | `screening.css`                         |
| `brief-assessment.html`   | `brief-assessment.js`        | `screening.css`, `brief-assessment.css` |
| `isas.html`               | `isas.js`                    | `screening.css`, `isas.css`             |
| `fasm.html`               | `fasm.js`                    | `screening.css`, `fasm.css`             |
| `lpfs.html`               | `lpfs.js`                    | `screening.css`, `lpfs.css`             |
| `tsds.html`               | `tsds.js`                    | `screening.css`, `tsds.css`             |
| `ybocs.html`              | `ybocs.js`                   | `screening.css`, `ybocs.css`            |

Shared files:

| File                   | Responsibility                                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `workbench-shared.css` | Suite palette, type sizes, spacing, controls, light/dark themes, and documentation toolbar. Loads **last**.                                       |
| `workbench-theme.js`   | Applies the saved theme before painting; wires the sun/moon button. Loads in the HTML head.                                                       |
| `workbench-ui.js`      | Copying, documentation generation state, number-field validation, and selected-button accessibility state. Loads before each assessment's script. |
| `risk-presentation.js` | Shared risk labels and explanations for the two risk pages. Displays the clinician's selection; does not calculate risk.                          |
| `embed-resize.js`      | Height and scroll messages when embedded in another website. Loads last; exits when opened outside a frame.                                       |

Two pages serve several measures through a URL parameter:

- `screening.html?measure=phq9` or `screening.html?measure=gad7`.
- `brief-assessment.html?measure=mdq`, `ace`, `pce`, `asrs`, `who5`, `pcptsd5`, or `crafft`.

Missing or unsupported measure keys fall back to PHQ-9 or MDQ respectively. Y-BOCS/CY-BOCS switches versions within its page.

## Following the code

Most tool scripts follow this flow:

1. **Definitions:** questions, answer options, defaults, weights, and interpretation ranges.
2. **State:** arrays or objects holding answers for the current visit.
3. **Rendering:** `render...` functions build controls from those definitions and answers.
4. **Events:** input/change/click handlers update the answers.
5. **Results:** scoring and `update...` functions refresh the displays.
6. **Documentation:** output functions assemble plain text and pass it to `Workbench.writeOutput(text)`.
7. **Startup:** calls at the bottom initialize the page.

The risk pages keep most questions in HTML and read the controls directly. MSE builds its form from `mse-data.js`. The scored tools generally keep questions and answers in JavaScript arrays.

`$` in some scripts means `document.getElementById`; it is not an external library. `map` converts each array item, `filter` keeps matching items, and `reduce` combines values such as scores. Array indexes normally start at zero; ISAS deliberately uses printed item numbers 1–39 and leaves index zero unused.

An element's `id` connects it to a specific lookup; a `class` usually connects it to CSS; `data-*` attributes carry identifiers from controls to event handlers. `textContent` and textarea `.value` write plain text. `innerHTML` builds markup; any user text inserted into an HTML attribute must pass through that script's `escapeAttr` helper.

Comments explain responsibilities, sequencing, exceptions, and scoring relationships. They do not appear on the website. Prefer comments that explain _why_ a rule exists rather than repeating each assignment in English.

## Documentation and reset behavior

**Risk pages start blank.** Output updates as findings are entered. Unchecked factors do not become documented absences; unanswered radios do not become denials. Reset clears the assessment, closes optional details, and returns the output format to Narrative. Risk levels and disposition are always selected by the clinician.

**Single-answer choices can be cleared:** click the selected answer again (or press Space while it is focused). This applies to the blank-start questionnaires and both risk forms, including context buttons. Clearing a required answer removes the completed score and note until it is answered again. Output format, age version, and MSE preset controls keep their existing behavior.

**All scored questionnaires start unanswered.** Reset clears responses, including numeric counts and optional context. Empty is distinct from zero, No, Never, or Not relevant. Total scores and interpretations wait for the required score inputs; incomplete forms show progress and cannot generate a completed note. Individual ISAS/FASM function scores can appear once every item in that function is answered.

Optional context remains optional and is never filled with a negative answer. PHQ-9/GAD-7 functional impact, Y-BOCS additional ratings, and TSDS percentages appear in documentation only as entered (List may identify missing context as not documented). PHQ-9 item 9, ISAS Anti-Suicide endorsements, and FASM intent still trigger their notices on partial forms.

**MSE retains its normal findings preset.** Its Reset restores that profile and clears optional entries. The risk assessments continue to start blank.

MSE and scored tools keep the note blank until **Create documentation** is clicked. Editing an answer clears the displayed note and requires another click. Changing output format or MSE layout preserves the current generated state. Completion checks establish that required answers are present, not that the assessment is clinically valid.

Reset preserves the selected output format on questionnaires and MSE; MSE also preserves Learn/Compact and teaching-panel choices. Y-BOCS Reset clears **both** adult and child answers while retaining the visible version; switching versions without resetting keeps their answers separate.

Number fields use native `min`, `max`, and `step` validation. Invalid values stay visible for correction and block note generation/copying. Count and percentage handlers retain their last valid values for score previews while an invalid edit is present. FASM requires a positive whole-number count for a selected behavior; disabled fields are excluded from validation. CRAFFT day counts permit 0–366 to allow a leap-year interval.

Every output panel is titled **Generated Documentation** and uses **Narrative / List** for format selection. Every output toolbar places format selection, generation when applicable, and Copy together. Generated note text stays 16px in every app, including MSE Compact mode. DOM order matches visual order. Copy tries the clipboard API, then a selection-based fallback; if neither works, it selects the text and prompts for Cmd/Ctrl+C instead of reporting success.

## Tool-specific relationships to preserve

### MSE

- `mse-data.js` holds section IDs, choices, defaults, categories, definitions, Notes, diagrams' explanatory text, and context examples.
- `mseCategories` controls the order of both the form and List output.
- `buildNarrativeOutput()` in `mse.js` has its own phrasing. List output uses `mseListWording`, falling back to option sentences in the data file. These are intentionally separate writing styles.
- Learn and Compact use the same answers. Compact hides teaching panels and the additional-observation controls; observations already entered in Learn remain part of the assessment.
- The Open all/Close all button controls teaching panels, not baseline panels. A mixture of open and closed teaching panels offers Open all.
- Context selections do not infer diagnoses. No modifier or unknown baseline clears source attribution. Hidden, irrelevant specific-observation checkboxes are cleared before generating output.
- Mood and safety “Other” fields retain text for editing, but it is omitted when Other is not selected. Placeholder examples are never treated as answers.
- Observation placeholders combine selection-specific examples with section examples, deduplicate them, and show up to three after one `Ex.:` prefix. The Add/Hide observation button exposes its open state to assistive technology.
- `descriptorDiagram()` draws the speech/thought-process SVGs. Only the vocabulary labels use pink; diagram strokes and letters follow the ordinary text color. Notes use yellow/gold bullet markers.

### Risk assessments

The comprehensive form groups inquiry into Thoughts; Plan, access and preparation; Behavior and history; and Intent. Selections or free text can document an area. Detail disclosures are optional; closing one does not remove its entered findings. Clicking an already selected radio inside a detailed disclosure returns it to unanswered.

`assessmentGroups` maps controls to output labels and groups. Progress and clarification messages belong to the interface, not the copied note. Having an entry in every area is not a completeness or safety determination. Shared risk explanations are display text, not a scoring algorithm or a generated disposition.

### Scored tools

| Tool           | Important implementation detail                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PHQ-9/GAD-7    | Functional impact is documented separately from the item total. PHQ-9 item 9 controls an additional assessment notice. This page uses standard PHQ-9 wording, not the full adolescent-modified form.                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Brief screens  | `answers` stores scores; `answerChoices` stores selected labels. Keep both aligned, because different labels can share a score. Reset clears both to null. MDQ needs its co-occurrence/impairment responses for interpretation; PC-PTSD-5 can stop after an explicit No exposure response. Other supplementary questions remain optional.                                                                                                                                                                                                                                                                                        |
| ISAS           | Each of 13 functions sums three 0–2 ratings. Behavior counts are separate from function scores. An unnamed positive Other count appears as “Other behavior.” If every standard behavior count is explicitly zero, no other/main behavior is entered, and function ratings are untouched, Section I can be documented without scoring Section II.                                                                                                                                                                                                                                                                                 |
| FASM           | `FACTORS[i]` assigns reason `i` to a function. Function results are means; Other is excluded. Method counts and contextual answers do not contribute to those means. All core reason ratings must be entered; the final Other rating is optional. Selecting a method reveals frequency and medical-treatment fields; frequency and treatment start blank, and deselection clears those two answers. The summed frequency across methods is not a count of unique episodes.                                                                                                                                                       |
| LPFS-SR        | Item, weight, and domain arrays align by index. Responses multiply weights, including negative weights. Unanswered items are stored as null; domain and total scores remain unavailable until all 80 responses are entered.                                                                                                                                                                                                                                                                                                                                                                                                      |
| TSDS           | The 21 symptom responses are scored independently of discrimination-attribution percentages. Selecting an attribution reveals its percentage field; selecting Other also reveals its description. Deselection retains those entries for editing but excludes them from output.                                                                                                                                                                                                                                                                                                                                                   |
| Y-BOCS/CY-BOCS | Only the ten severity items contribute to the total and are required for scoring; additional ratings stay optional. Checklist selections and additional ratings are separate. Adult and child states are independent until Reset clears both. Each checklist category supports multiple custom symptoms with independent Current/Past selections and Add/Remove controls. Entries are separate for adult and child versions; Reset clears both. A checked custom symptom without text is documented as “not described,” rather than silently omitted. Both Narrative and List include selected current and past custom symptoms. |

The arithmetic checks verify the configured implementation. They do not authenticate instrument wording, editions, permissions, reference norms, or clinical interpretation. See [AUDIT.md](AUDIT.md) for the scope and remaining clinical review boundary.

## Editing the design

Use variables near the top of `workbench-shared.css` for suite-wide changes:

| Variable                                            | Current use                                                                |
| --------------------------------------------------- | -------------------------------------------------------------------------- |
| `--accent-primary`                                  | Pink definitions, selected options, and primary actions                    |
| `--accent-secondary`                                | Yellow in dark mode, gold in light mode; section accents and Notes bullets |
| `--font-page-title`                                 | 32px desktop page titles; narrow screens use 28px                          |
| `--font-section-title` / `--font-subheading`        | 21px / 17px hierarchy                                                      |
| `--font-option` / `--font-field` / `--font-hint`    | 14px choices, 15px field labels, 13px placeholders                         |
| `--font-result`                                     | 24px numeric result displays                                               |
| `--space-panel` / `--space-row` / `--space-options` | 16px / 12px / 8px shared spacing                                           |

`screening.css` owns the scored tools’ shared introduction, question, navigation, and alert layouts. Page-specific CSS owns distinct layouts; the final shared stylesheet owns common presentation. A more specific selector can still override a later general rule, so check the browser's computed styles before adding another override. Consolidate an existing rule when possible rather than appending another historical correction.

## Storage, network, and embedding

Assessment answers live in the current page's memory. The application does not save them to local storage or send them to a backend. The theme preference is stored under `workbench-theme`, with `mse-theme` retained as a migration fallback. Browser history, session restoration, extensions, and the operating-system clipboard are outside this code's control.

Pages request Asap and Cutive from Google Fonts; fallback fonts work when unavailable. Copying explicitly places the note on the device clipboard. There is no analytics or assessment-submission code in these files.

When embedded, `embed-resize.js` sends only two kinds of messages:

```js
{ type: "clinical-workbench-height", height: 900 }
{ type: "clinical-workbench-scroll", top: 0 }
```

Values change with the layout or destination section. The containing website must receive them, verify both `event.origin` and `event.source`, and resize/scroll its iframe. That containing site's handler is not included here. The sender uses `"*"` because the containing domain is not configured in this suite; it does not send answers or note text. Standalone pages do not send these messages.

## Checking changes

Run these dependency-free checks with Node:

```sh
node tests/regression.cjs
node tests/invariants.cjs
node tests/followups.cjs
node tests/blank-start.cjs
node tests/questionnaire-defaults.cjs
```

The first checks reset/label consistency, invalid measure links, blank risk output, clipboard failure paths, documentation state, and numeric validation. The second checks calculation boundaries, item mappings, version separation, MSE output coverage, JavaScript syntax, local links/IDs, stylesheet order, and CSS variables.

The third checks conditional FASM/TSDS fields, invalid edits and reselection, custom Y-BOCS symptom output, MSE observation examples, and thought-content sentence grammar.

The fourth checks blank, partial, complete, and reset states for LPFS-SR, PHQ-9, and GAD-7, explicit zero responses, unselected impact, and the PHQ-9 alert on an incomplete form.

The fifth extends blank/partial/complete/reset checks to the other questionnaires, including optional context, separate Y-BOCS versions, and partial-form alerts.

Browser checks remain necessary for real control behavior, responsive layout, colors, keyboard focus, and clipboard permissions. [tests/QA.md](tests/QA.md) records the latest performed checks and a repeatable checklist. [AUDIT.md](AUDIT.md) records the file-by-file review and changes.

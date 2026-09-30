# Clinical Workbench: a guide to the files

Start with `index.html`: it is the home page linking to every tool. This is a collection of web pages, with no build step required. Keep the website files together in the same folder when uploading them to GitHub.

## The three file types

- **HTML (`.html`)** defines the page structure: headings, fields, buttons, and places where results appear.
- **CSS (`.css`)** controls appearance: colors, fonts, spacing, layouts, and smaller-screen adjustments.
- **JavaScript (`.js`)** makes the page respond: builds questions, remembers current selections, calculates results, and generates copyable notes.

Comments explain the source code and do not appear on the website. In HTML they look like `<!-- explanation -->`; in CSS they look like `/* explanation */`; JavaScript uses either `// explanation` or `/* explanation */`.

## Which files belong together?

| Tool 							| Page 				| Behavior and content 		| Appearance 					|
| ----------------------------------------------------- | -----------------------------	| -----------------------------	| ---------------------------------------------	|
| Home page 						| `index.html` 			| Links are in the HTML 	| `workbench.css` 				|
| Mental Status Exam 					| `mse.html` 			| `mse-data.js`, then `mse.js` 	| `mse.css` 					|
| Quick Risk Assessment 				| `quick-risk.html` 		| `quick-risk.js` 		| `risk.css` 					|
| Comprehensive Suicide Assessment 			| `comprehensive-risk.html` 	| `comprehensive-risk.js` 	| `risk.css` 					|
| PHQ-9 and GAD-7 					| `screening.html` 		| `screening.js` 		| `screening.css` 				|
| MDQ, ACEs, PCEs, ASRS, WHO-5, PC-PTSD-5, CRAFFT 	| `brief-assessment.html` 	| `brief-assessment.js` 	| `screening.css`, then `brief-assessment.css` 	|
| ISAS 							| `isas.html` 			| `isas.js` 			| `screening.css`, then `isas.css` 		|
| FASM 							| `fasm.html` 			| `fasm.js` 			| `screening.css`, then `fasm.css` 		|
| LPFS-SR 						| `lpfs.html` 			| `lpfs.js` 			| `screening.css`, then `lpfs.css` 		|
| TSDS 							| `tsds.html` 			| `tsds.js` 			| `screening.css`, then `tsds.css` 		|
| Y-BOCS and CY-BOCS 					| `ybocs.html` 			| `ybocs.js` 			| `screening.css`, then `ybocs.css` 		|

Every page also loads **`embed-resize.js`**. When a tool is displayed inside another website, this helper sends height and scroll messages to that containing page. The containing website must handle those messages. When a tool is opened on its own, the helper exits immediately.

CSS files are different parts of the site's styling, not a menu of alternative themes. Changing `risk.css` affects both risk pages. Changing `screening.css` affects every page that loads that shared base. A tool-specific stylesheet loads afterward and can override it.

## What was renamed?

- `app.js` → **`mse.js`**
- `styles.css` → **`mse.css`**

These files belong only to the MSE. `mse.html` now loads their new names, and the content-file comments point to `mse.js`.

For this update, upload the revised website HTML, CSS, and JavaScript files together. On GitHub, remove the old `app.js` and `styles.css` after the new files and updated `mse.html` are in place. Uploading a differently named file does not itself delete the old one. This local update does not publish anything to GitHub.

## How to read the JavaScript

Most tools follow the same sequence:

1. **Definitions:** lists of questions, answer labels, weights, or interpretation ranges near the top.
2. **Current answers:** variables such as `answers`, `choices`, or `states` hold the current page's selections.
3. **Rendering:** functions named `render...` build visible controls from those definitions and answers.
4. **Events:** `onclick`, `onchange`, `oninput`, or `addEventListener` connect clicks and typing to functions.
5. **Results:** functions named `update...`, `scores`, or `generate...` refresh scores and notes.
6. **Output:** `summaryOutput`, `narrativeOutput`, `detailedOutput`, or `listOutput` assemble text for copying.
7. **Startup:** calls at the bottom build the first view when the page opens.

A **function** is a named set of instructions. An **array** (`[...]`) is an ordered list. An **object** (`{...}`) stores named values. `map` turns each list entry into something else, `filter` keeps matching entries, and `reduce` combines entries, often into a total. Array positions start at zero unless a tool deliberately uses printed item numbers, as ISAS does.

`document.getElementById("output")` finds the HTML element with `id="output"`. Many tools abbreviate this lookup as `$("output")`; here `$` is a small helper, not a separate library. `.value` reads or writes a form field. `.textContent` writes plain text. `.innerHTML` builds HTML controls from text templates. `data-*` attributes carry identifiers from generated controls back to JavaScript.

Backticks create **template strings**, which can contain HTML or note text. `${...}` inserts a calculated value into one of those strings. Some HTML templates remain long because they represent a complete repeated question or row.

## Where to make common changes

- **Change the home page's tool names or links:** `index.html`.
- **Change colors or spacing:** the relevant CSS file. Variables under `:root` collect the main colors and fonts in the base stylesheets. Later CSS rules may override earlier ones.
- **Change MSE choices, defaults, or teaching explanations:** `mse-data.js`. Keep internal identifiers aligned with `mse.js`.
- **Change the MSE narrative wording:** `buildNarrativeOutput()` in `mse.js`. It contains additional wording maps; the narrative is not generated solely from the data file. The list format uses choice labels from the data.
- **Change a screening question, score range, or calculation:** the tool's JavaScript definitions and scoring functions. The comments describe the existing implementation; this cleanup did not review or change clinical scoring rules.
- **Change note formatting:** the tool's output functions.
- **Change copy or reset behavior:** handlers near the bottom of the tool's JavaScript, plus any functions those handlers call.

## Details that help explain the logic

The link `screening.html?measure=gad7` loads the shared screening page and asks it to show GAD-7. `brief-assessment.html?measure=mdq` does the same for MDQ. The characters after `?` are URL parameters read by JavaScript.

The two risk tools display and document the acute and chronic risk levels selected in the form. Their JavaScript does not calculate those levels from the checked factors.

Each assessment has its own scoring implementation. For example, LPFS-SR aligns question positions with weights and domains; Y-BOCS adds only the ten severity items; FASM averages the reasons assigned to each function. Preserve those relationships when editing.

Reset uses each tool's existing defaults, which may preselect answers. It does not mean that an assessment has been completed. The page's answer variables are held in memory; these scripts do not provide a saved-record system.

To inspect the site locally, open `index.html` in a browser and follow its links. Clipboard access can depend on the browser and how the page is opened; Select text lets you copy manually. For editing, open the files in a text/code editor rather than a word processor.

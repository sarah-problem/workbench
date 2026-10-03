/**
 * quick-risk.js
 * Quick Risk Assessment: reads the form and assembles narrative or list documentation.
 * Loaded by quick-risk.html after the page markup is available.
 * See README.md for the file map and a guide to following the code.
 */

let outputStyle = "narrative";

// Find the selected radio button in a named group.
function selectedInput(name) {
  return document.querySelector(`input[name="${name}"]:checked`);
}

// Read the value of the selected radio button; return empty text if none is selected.
function selectedValue(name) {
  return selectedInput(name)?.value || "";
}

// Read the human-readable label stored on the selected radio button.
function selectedLabel(name) {
  return selectedInput(name)?.dataset.label || "";
}

// Collect the values of all checked options in the requested group.
function checkedValues(group) {
  return [
    ...document.querySelectorAll(`[data-group="${group}"] input[type="checkbox"]:checked`),
  ].map((input) => input.value);
}

// Collect the display labels of checked options, falling back to their values.
function checkedLabels(group) {
  return [
    ...document.querySelectorAll(`[data-group="${group}"] input[type="checkbox"]:checked`),
  ].map((input) => input.dataset.label || input.value);
}

// Append a free-text entry to a list only when it is not blank.
function addOptional(items, id) {
  const value = document.getElementById(id).value.trim();
  return value ? [...items, value] : items;
}

// Join choices into readable English, handling empty, one-item, and longer lists.
function listText(items) {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

// Trim free text and add ending punctuation if it is missing.
function punctuate(text) {
  const clean = text.trim();
  if (!clean) return "";
  return /[.!?]$/.test(clean) ? clean : `${clean}.`;
}

// Turn the selected findings and optional notes into connected sentences.
function narrativeOutput() {
  const ideation = selectedValue("ideation");
  const plan = selectedValue("plan");
  const means = selectedValue("means");
  const behavior = selectedValue("behavior");
  const risk = addOptional(checkedValues("riskFactors"), "riskOther");
  const protective = addOptional(checkedValues("protectiveFactors"), "protectiveOther");
  const interventions = checkedValues("interventions");
  const rationale = punctuate(document.getElementById("rationale").value);
  const interventionNotes = punctuate(document.getElementById("interventionNotes").value);

  const sentences = [];

  if (ideation)
    sentences.push(
      ideation === "denied"
        ? "Client denied current suicidal ideation."
        : `Client endorsed ${ideation}.`,
    );
  if (plan)
    sentences.push(
      plan === "none"
        ? "No current suicide plan was identified."
        : `Current suicide plan was described as ${plan}.`,
    );
  if (means)
    sentences.push(
      means === "none identified"
        ? "No access to lethal means was identified."
        : `Access to lethal means was ${means}.`,
    );
  if (behavior)
    sentences.push(
      behavior === "none"
        ? "No recent suicidal behavior was identified."
        : `Recent suicidal behavior included ${behavior}.`,
    );
  if (risk.length) sentences.push(`Relevant risk factors include ${listText(risk)}.`);
  if (protective.length) sentences.push(`Protective factors include ${listText(protective)}.`);
  if (selectedValue("acute"))
    sentences.push(`Acute risk is assessed as ${selectedValue("acute")}.`);
  if (selectedValue("chronic"))
    sentences.push(`Chronic risk is assessed as ${selectedValue("chronic")}.`);

  if (rationale) sentences.push(`Clinical rationale: ${rationale}`);

  if (interventions.length) {
    sentences.push(`Interventions included ${listText(interventions)}.`);
  }

  if (interventionNotes) sentences.push(`Intervention and follow-up notes: ${interventionNotes}`);

  return sentences.join(" ");
}

// Arrange the same assessment information under headings for list output.
function listOutput() {
  const risk = addOptional(checkedLabels("riskFactors"), "riskOther");
  const protective = addOptional(checkedLabels("protectiveFactors"), "protectiveOther");
  const interventions = checkedLabels("interventions");
  const rationale = document.getElementById("rationale").value.trim();
  const interventionNotes = document.getElementById("interventionNotes").value.trim();

  const groups = [
    [
      "Current Risk",
      ["ideation", "plan", "means", "behavior"]
        .filter((name) => selectedValue(name))
        .map((name) => `${name[0].toUpperCase() + name.slice(1)}: ${selectedLabel(name)}`),
    ],
    ["Risk Factors", risk],
    ["Protective Factors", protective],
    [
      "Assessment",
      [
        selectedValue("acute") && `Acute: ${selectedLabel("acute")}`,
        selectedValue("chronic") && `Chronic: ${selectedLabel("chronic")}`,
        rationale && `Rationale: ${rationale}`,
      ].filter(Boolean),
    ],
    [
      "Interventions",
      [...interventions, interventionNotes && `Notes: ${interventionNotes}`].filter(Boolean),
    ],
  ];
  return groups
    .filter(([, entries]) => entries.length)
    .map(([heading, entries]) => `${heading}\n${entries.map((entry) => `- ${entry}`).join("\n")}`)
    .join("\n\n");
}

// Replace the output field with the chosen narrative or list format.
function generate() {
  Workbench.writeOutput(outputStyle === "list" ? listOutput() : narrativeOutput());
}

// Clear findings without assigning denials or a risk level.
function resetAssessment() {
  document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach((input) => {
    input.checked = false;
  });

  document.querySelectorAll("textarea:not(#output)").forEach((textarea) => {
    textarea.value = "";
  });

  document.querySelectorAll(".optional-details").forEach((panel) => {
    panel.classList.remove("open");
  });

  document.querySelectorAll(".toggle-details").forEach((button) => {
    button.setAttribute("aria-expanded", "false");
    button.textContent =
      button.dataset.originalLabel || button.textContent.replace("− Hide", "+ Add");
  });

  outputStyle = "narrative";
  document.querySelectorAll(".output-style-button").forEach((button) => {
    button.classList.toggle("selected", button.dataset.style === outputStyle);
  });

  updateRiskDisplay("acute", selectedValue("acute"));
  updateRiskDisplay("chronic", selectedValue("chronic"));
  generate();
}

// Connect page controls: reset answers, change output style, refresh documentation. Copy is handled by workbench-ui.js.
document.querySelectorAll("input, textarea:not([readonly])").forEach((control) => {
  if (control.matches("textarea, input[type=text]")) control.addEventListener("input", generate);
  control.addEventListener("change", () => {
    if (control.name === "acute") updateRiskDisplay("acute", selectedValue("acute"));
    if (control.name === "chronic") updateRiskDisplay("chronic", selectedValue("chronic"));
    if (!control.matches("textarea, input[type=text]")) generate();
  });
});

document.querySelectorAll(".toggle-details").forEach((button) => {
  button.dataset.originalLabel = button.textContent;
  button.setAttribute("aria-controls", button.dataset.target);
  button.setAttribute("aria-expanded", "false");
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.target);
    const isOpen = target.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
    button.textContent = isOpen ? "− Hide details" : button.dataset.originalLabel;
  });
});

document.querySelectorAll(".output-style-button").forEach((button) => {
  button.addEventListener("click", () => {
    outputStyle = button.dataset.style;
    document.querySelectorAll(".output-style-button").forEach((item) => {
      item.classList.toggle("selected", item === button);
    });
    generate();
  });
});

document.getElementById("reset").addEventListener("click", resetAssessment);

// Initial page setup: populate the form and show its starting results.
updateRiskDisplay("acute", selectedValue("acute"));
updateRiskDisplay("chronic", selectedValue("chronic"));
generate();

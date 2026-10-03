/**
 * comprehensive-risk.js
 * Comprehensive Suicide Assessment: collects the full form into one assessment and formats the note.
 * Loaded by comprehensive-risk.html after the page markup is available.
 * See README.md for the file map and a guide to following the code.
 */

let outputStyle = "narrative";
// Remember the prior selection because browsers check radios before click handlers run.
const detailedSelections = new Map();

// Read the value of the selected radio button; return empty text if none is selected.
function selectedValue(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value || "";
}

// Collect the values of all checked options in the requested group.
function checkedValues(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(
    (input) => input.value,
  );
}

// Join choices into readable English, handling empty, one-item, and longer lists.
function listText(items) {
  const values = items.filter(Boolean);
  if (!values.length) return "";
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

// Read a text field and remove leading and trailing spaces.
function cleanText(id) {
  return document.getElementById(id).value.trim();
}

// Add ending punctuation when the supplied text needs it.
function sentence(text) {
  if (!text) return "";
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

// Each output row has a label, control name, and optional free-text field.
// Unanswered controls produce no finding; placeholders are never read as answers.
const assessmentGroups = [
  [
    "Risk Factors",
    [
      ["Acute risk factors", "acuteRisk", "checks"],
      ["Chronic risk factors", "chronicRisk", "checks"],
      ["Additional risk context", "additional-risk", "text"],
    ],
  ],
  [
    "Protective Factors",
    [
      ["Internal protective factors", "internalProtective", "checks"],
      ["External protective factors", "externalProtective", "checks"],
      ["Additional protective factors", "additional-protective", "text"],
    ],
  ],
  [
    "Thoughts",
    [
      ["Current suicidal thoughts", "ideationSeverity"],
      ["Thoughts / timeframe", "thought-summary", "text"],
      ["Frequency", "frequency"],
      ["Duration", "duration"],
      ["Controllability", "controllability"],
      ["Deterrents", "deterrents"],
      ["Reasons for ideation", "reason"],
    ],
  ],
  [
    "Plan, Access & Preparation",
    [
      ["Current plan", "currentPlan"],
      ["Plan / access / preparation", "plan-summary", "text"],
      ["Access to means", "meansAccess"],
      ["Preparation", "preparation"],
      ["Plan context", "means-description", "text"],
    ],
  ],
  [
    "Behavior & History",
    [
      ["Behavior / history", "behaviorStatus"],
      ["Behavior summary", "behavior-summary", "text"],
      ["Behavior type", "behaviorType", "checks"],
      ["Most recent behavior", "behaviorTiming"],
      ["Behavior context", "behavior-description", "text"],
    ],
  ],
  [
    "Intent",
    [
      ["Current intent", "currentIntent"],
      ["Intent / ambivalence", "intent-summary", "text"],
    ],
  ],
  [
    "Assessment & Next Steps",
    [
      ["Acute risk", "acuteLevel"],
      ["Chronic risk", "chronicLevel"],
      ["Interventions", "intervention", "checks"],
      ["Recommendation", "recommendation"],
      ["Clinical rationale", "clinical-rationale", "text"],
    ],
  ],
];
// Collect only entered findings into labeled groups shared by both output styles.
function getAssessmentData() {
  return assessmentGroups
    .map(([title, fields]) => ({
      title,
      rows: fields
        .map(([label, name, kind]) => {
          const value =
            kind === "text"
              ? cleanText(name)
              : kind === "checks"
                ? listText(checkedValues(name))
                : selectedValue(name);
          return value ? sentence(`${label}: ${value}`) : "";
        })
        .filter(Boolean),
    }))
    .filter((group) => group.rows.length);
}
// Keep each assessment area together as one paragraph.
function narrativeOutput(groups) {
  return groups.map((group) => group.rows.join(" ")).join("\n\n");
}
// Use plain hyphens so copied lists work in clinical note systems.
function listOutput(groups) {
  return groups
    .map((group) => `${group.title}\n${group.rows.map((row) => `- ${row}`).join("\n")}`)
    .join("\n\n");
}

// Progress belongs to the interface, never to the copied clinical note.
function updateAssessmentProgress() {
  const core = [
    [
      "Thoughts",
      "ideationSeverity",
      "thought-summary",
      "frequency",
      "duration",
      "controllability",
      "deterrents",
      "reason",
    ],
    [
      "Plan/access/preparation",
      "currentPlan",
      "plan-summary",
      "meansAccess",
      "preparation",
      "means-description",
    ],
    [
      "Behavior/history",
      "behaviorStatus",
      "behavior-summary",
      "behaviorType",
      "behaviorTiming",
      "behavior-description",
    ],
    ["Intent", "currentIntent", "intent-summary"],
  ];
  const missing = core
    .filter(
      ([, ...names]) =>
        !names.some(
          (name) => document.getElementById(name)?.value.trim() || checkedValues(name).length,
        ),
    )
    .map(([label]) => label);
  const notAssessed = core
    .filter(([, name]) => selectedValue(name) === "not assessed")
    .map(([label]) => label);
  document.getElementById("assessment-progress").textContent = [
    missing.length
      ? `Inquiry areas not yet documented: ${missing.join(", ")}.`
      : "Each inquiry area has an entry; review completeness before copying.",
    notAssessed.length ? `Marked not assessed: ${notAssessed.join(", ")}.` : "",
    !selectedValue("acuteLevel") ? "Acute risk level not selected." : "",
    !cleanText("clinical-rationale") ? "Clinical rationale not entered." : "",
  ]
    .filter(Boolean)
    .join(" ");
  const concerns = [];
  if (
    selectedValue("ideationSeverity") === "No current suicidal ideation" &&
    ["frequency", "duration", "controllability", "deterrents", "reason"].some((name) =>
      selectedValue(name),
    )
  )
    concerns.push(
      "Current thoughts are denied but thought details are entered; clarify their timeframe.",
    );
  if (
    selectedValue("behaviorStatus") === "No suicidal or self-injurious behavior reported" &&
    checkedValues("behaviorType").length
  )
    concerns.push(
      "The behavior summary and selected behavior types differ; review their timeframe.",
    );
  if (
    selectedValue("currentPlan") === "none" &&
    selectedValue("preparation") === "active preparatory behavior"
  )
    concerns.push(
      "No current plan and active preparation are both selected; clarify this finding.",
    );
  document.getElementById("assessment-review").textContent = concerns.join(" ");
}
// Live output on this blank-start tool does not need a preset-generation action.
function generateAssessment() {
  const data = getAssessmentData();
  Workbench.writeOutput(outputStyle === "list" ? listOutput(data) : narrativeOutput(data));
  updateAssessmentProgress();
}

// Remember the chosen format, highlight its button, and regenerate the note.
function setOutputStyle(style) {
  outputStyle = style;
  document.querySelectorAll(".output-style-button").forEach((button) => {
    button.classList.toggle("selected", button.dataset.style === style);
  });
  generateAssessment();
}

// Clear the assessment without assigning normal findings or a risk level.
function resetAssessment() {
  detailedSelections.clear();
  document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach((input) => {
    input.checked = false;
  });
  document.querySelectorAll("textarea:not([readonly])").forEach((textarea) => {
    textarea.value = "";
  });
  document.querySelectorAll(".optional-details").forEach((panel) => panel.classList.remove("open"));
  document.querySelectorAll(".toggle-details").forEach((button) => {
    button.textContent = button.dataset.closedLabel;
    button.setAttribute("aria-expanded", "false");
  });

  document.querySelectorAll(".inquiry-details").forEach((panel) => {
    panel.open = false;
  });
  setOutputStyle("narrative");
  updateRiskDisplay("acute", selectedValue("acuteLevel"));
  updateRiskDisplay("chronic", selectedValue("chronicLevel"));
}

// Optional detail radios can return to unanswered by activating the same choice.
// Native labels and Space activation both deliver a click to the associated input.
document.querySelectorAll('.inquiry-details input[type="radio"]').forEach((control) => {
  control.addEventListener("click", () => {
    if (detailedSelections.get(control.name) === control.value) {
      control.checked = false;
      detailedSelections.delete(control.name);
      control.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      detailedSelections.set(control.name, control.value);
    }
  });
  // Arrow-key navigation also updates the remembered selection.
  control.addEventListener("change", () => {
    if (control.checked) detailedSelections.set(control.name, control.value);
    else detailedSelections.delete(control.name);
  });
});

// These values offer a relevant detail panel; opening it never supplies an answer.
const detailPrompts = {
  ideationSeverity: {
    id: "thought-details",
    values: ["Passive thoughts of death", "Active suicidal thoughts", "unclear"],
  },
  currentPlan: {
    id: "plan-details",
    values: ["vague or partially developed", "specific and developed", "unclear"],
  },
  behaviorStatus: {
    id: "behavior-inquiry-details",
    values: ["Past behavior reported", "Recent behavior reported", "unclear"],
  },
};

// Answer changes refresh documentation; copy is handled by workbench-ui.js.
document.querySelectorAll("input, textarea:not([readonly])").forEach((control) => {
  if (control.matches("textarea, input[type=text]"))
    control.addEventListener("input", generateAssessment);
  control.addEventListener("change", () => {
    // Offer relevant detail without making it mandatory or hiding other areas.
    const detail = detailPrompts[control.name];
    if (detail?.values.includes(control.value)) document.getElementById(detail.id).open = true;
    if (control.name === "acuteLevel") updateRiskDisplay("acute", selectedValue("acuteLevel"));
    if (control.name === "chronicLevel")
      updateRiskDisplay("chronic", selectedValue("chronicLevel"));
    if (!control.matches("textarea, input[type=text]")) generateAssessment();
  });
});

document.querySelectorAll(".toggle-details").forEach((button) => {
  button.dataset.closedLabel = button.textContent;
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", button.dataset.target);
  button.addEventListener("click", () => {
    const panel = document.getElementById(button.dataset.target);
    const isOpen = panel.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
    button.textContent = isOpen ? "− Hide details" : button.dataset.closedLabel;
  });
});

document.querySelectorAll(".output-style-button").forEach((button) => {
  button.dataset.style = button.id.startsWith("list") ? "list" : "narrative";
  button.addEventListener("click", () => setOutputStyle(button.dataset.style));
});

document.getElementById("reset-assessment").addEventListener("click", resetAssessment);

// Initial page setup: populate the form and show its starting results.
updateRiskDisplay("acute", selectedValue("acuteLevel"));
updateRiskDisplay("chronic", selectedValue("chronicLevel"));
generateAssessment();

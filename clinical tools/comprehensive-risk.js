const output = document.getElementById("comprehensive-output");
const copyStatus = document.getElementById("copy-status");
let outputStyle = "narrative";

const riskDescriptions = {
  acute: {
    low: "Current circumstances are unlikely to result in suicidal behavior. Outpatient care is generally appropriate when otherwise clinically indicated.",
    "low-moderate": "Current circumstances increase suicide risk but can typically be managed safely in outpatient care with appropriate supports, monitoring, and safety planning.",
    moderate: "Suicide risk is clinically significant and requires active intervention, close monitoring, and consideration of a higher level of care if risk increases.",
    "moderate-high": "Suicide risk is substantial. Urgent evaluation, intensive intervention, and careful consideration of the appropriate level of care are indicated.",
    high: "Suicide risk appears imminent or severe. Immediate intervention and emergency evaluation are generally indicated."
  },
  chronic: {
    low: "Long-term history suggests little ongoing elevation above baseline suicide risk.",
    "low-moderate": "Long-term risk is mildly elevated because of enduring risk factors or psychiatric history.",
    moderate: "Long-term risk remains meaningfully elevated because of persistent risk factors, recurrent suicidal ideation, or previous suicidal behavior.",
    "moderate-high": "Multiple enduring risk factors substantially increase future suicide risk and warrant ongoing monitoring and intervention.",
    high: "Long-term history indicates persistently severe suicide risk requiring intensive long-term risk management."
  }
};

const riskLabels = {
  low: "Low",
  "low-moderate": "Low–moderate",
  moderate: "Moderate",
  "moderate-high": "Moderate–high",
  high: "High"
};

const riskClasses = Object.keys(riskLabels).map(level => `risk-${level}`);

function selectedValue(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value || "";
}

function checkedValues(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value);
}

function listText(items, emptyText = "none specifically identified") {
  const values = items.filter(Boolean);
  if (!values.length) return emptyText;
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

function cleanText(id) {
  return document.getElementById(id).value.trim();
}

function sentence(text) {
  if (!text) return "";
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function getAssessmentData() {
  return {
    acuteFactors: checkedValues("acuteRisk"),
    chronicFactors: checkedValues("chronicRisk"),
    internalProtective: checkedValues("internalProtective"),
    externalProtective: checkedValues("externalProtective"),
    ideation: selectedValue("ideationSeverity"),
    frequency: selectedValue("frequency"),
    duration: selectedValue("duration"),
    controllability: selectedValue("controllability"),
    deterrents: selectedValue("deterrents"),
    reason: selectedValue("reason"),
    behaviors: checkedValues("behaviorType"),
    behaviorTiming: selectedValue("behaviorTiming"),
    intent: selectedValue("currentIntent"),
    plan: selectedValue("currentPlan"),
    means: selectedValue("meansAccess"),
    preparation: selectedValue("preparation"),
    acuteLevel: selectedValue("acuteLevel"),
    chronicLevel: selectedValue("chronicLevel"),
    interventions: checkedValues("intervention"),
    recommendation: selectedValue("recommendation"),
    additionalRisk: cleanText("additional-risk"),
    behaviorDetails: cleanText("behavior-description"),
    meansDetails: cleanText("means-description"),
    rationale: cleanText("clinical-rationale")
  };
}

function narrativeOutput(data) {
  const parts = [
    `Acute risk factors include ${listText(data.acuteFactors)}; chronic or historical risk factors include ${listText(data.chronicFactors)}.`,
    `Internal protective factors include ${listText(data.internalProtective)}; external protective factors include ${listText(data.externalProtective)}.`,
    `${data.ideation}. When present, ideation occurs ${data.frequency}, lasts ${data.duration}, is ${data.controllability}, and ${data.deterrents}. The primary reason for ideation is described as ${data.reason}.`,
    `Suicidal or self-injurious behavior includes ${listText(data.behaviors)}, with the most recent behavior identified as ${data.behaviorTiming}.`,
    `Current intent is ${data.intent}; the current plan is ${data.plan}; access to means is ${data.means}; and preparation is ${data.preparation}.`,
    `Acute suicide risk is assessed as ${data.acuteLevel}, and chronic risk as ${data.chronicLevel}. Interventions include ${listText(data.interventions)}. The clinical recommendation is ${data.recommendation}.`
  ];

  if (data.additionalRisk) parts.splice(1, 0, sentence(data.additionalRisk));
  if (data.behaviorDetails) parts.splice(5, 0, sentence(data.behaviorDetails));
  if (data.meansDetails) parts.splice(parts.length - 1, 0, sentence(data.meansDetails));
  if (data.rationale) parts.push(sentence(data.rationale));

  return parts.join(" ");
}

function listOutput(data) {
  const sections = [
    ["Risk Factors",
      `Acute: ${listText(data.acuteFactors)}`,
      `Chronic: ${listText(data.chronicFactors)}`,
      ...(data.additionalRisk ? [`Additional context: ${data.additionalRisk}`] : [])],
    ["Protective Factors",
      `Internal: ${listText(data.internalProtective)}`,
      `External: ${listText(data.externalProtective)}`],
    ["Suicidal Ideation",
      `Severity: ${data.ideation}`,
      `Frequency: ${data.frequency}`,
      `Duration: ${data.duration}`,
      `Controllability: ${data.controllability}`,
      `Deterrents: ${data.deterrents}`,
      `Primary reason: ${data.reason}`],
    ["Behavior",
      `Type: ${listText(data.behaviors)}`,
      `Most recent: ${data.behaviorTiming}`,
      ...(data.behaviorDetails ? [`Details: ${data.behaviorDetails}`] : [])],
    ["Plan, Intent, and Means",
      `Intent: ${data.intent}`,
      `Plan: ${data.plan}`,
      `Means: ${data.means}`,
      `Preparation: ${data.preparation}`,
      ...(data.meansDetails ? [`Details: ${data.meansDetails}`] : [])],
    ["Assessment",
      `Acute: ${data.acuteLevel}`,
      `Chronic: ${data.chronicLevel}`,
      ...(data.rationale ? [`Rationale: ${data.rationale}`] : [])],
    ["Interventions and Recommendation",
      `Interventions: ${listText(data.interventions)}`,
      `Recommendation: ${data.recommendation}`]
  ];

  return sections.map(section => section.join("\n")).join("\n\n");
}

function generateAssessment() {
  const data = getAssessmentData();
  output.value = outputStyle === "list" ? listOutput(data) : narrativeOutput(data);
}

function setOutputStyle(style) {
  outputStyle = style;
  document.querySelectorAll(".output-style-button").forEach(button => {
    button.classList.toggle("selected", button.dataset.style === style);
  });
  generateAssessment();
}

function updateRiskDisplay(kind) {
  const value = selectedValue(`${kind}Level`);
  const result = document.getElementById(`${kind}-result`);
  const explainer = document.getElementById(`${kind}-explainer`);

  [result, explainer].forEach(element => {
    element.classList.remove(...riskClasses);
    element.classList.add(`risk-${value}`);
  });

  result.textContent = `${riskLabels[value]} ${kind} risk`;
  explainer.textContent = riskDescriptions[kind][value];
}

function resetAssessment() {
  document.querySelectorAll('input[type="radio"]').forEach(input => {
    input.checked = input.defaultChecked;
  });
  document.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.checked = false;
  });
  document.querySelectorAll('textarea:not([readonly])').forEach(textarea => {
    textarea.value = "";
  });
  document.querySelectorAll(".optional-details").forEach(panel => panel.classList.remove("open"));
  document.querySelectorAll(".toggle-details").forEach(button => {
    button.textContent = button.dataset.closedLabel;
  });

  setOutputStyle("narrative");
  updateRiskDisplay("acute");
  updateRiskDisplay("chronic");
}

async function copyAssessment() {
  try {
    await navigator.clipboard.writeText(output.value);
    copyStatus.textContent = "Copied";
  } catch {
    selectAssessment();
    document.execCommand("copy");
    copyStatus.textContent = "Copied";
  }
  setTimeout(() => { copyStatus.textContent = ""; }, 1800);
}

function selectAssessment() {
  output.focus();
  output.select();
}

document.querySelectorAll("input, textarea").forEach(control => {
  control.addEventListener("input", generateAssessment);
  control.addEventListener("change", () => {
    if (control.name === "acuteLevel") updateRiskDisplay("acute");
    if (control.name === "chronicLevel") updateRiskDisplay("chronic");
    generateAssessment();
  });
});

document.querySelectorAll(".toggle-details").forEach(button => {
  button.dataset.closedLabel = button.textContent;
  button.addEventListener("click", () => {
    const panel = document.getElementById(button.dataset.target);
    const isOpen = panel.classList.toggle("open");
    button.textContent = isOpen ? "− Hide details" : button.dataset.closedLabel;
  });
});

document.querySelectorAll(".output-style-button").forEach(button => {
  button.dataset.style = button.id.startsWith("list") ? "list" : "narrative";
  button.addEventListener("click", () => setOutputStyle(button.dataset.style));
});

document.getElementById("reset-assessment").addEventListener("click", resetAssessment);
document.getElementById("copy-assessment").addEventListener("click", copyAssessment);
document.getElementById("select-assessment").addEventListener("click", selectAssessment);

updateRiskDisplay("acute");
updateRiskDisplay("chronic");
generateAssessment();

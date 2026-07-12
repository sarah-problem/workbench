let outputStyle = "narrative";

const acuteRiskDescriptions = {
  low: "Current circumstances are unlikely to result in suicidal behavior. Outpatient care is generally appropriate when otherwise clinically indicated.",
  "low-moderate": "Current circumstances increase suicide risk but can typically be managed safely in outpatient care with appropriate supports, monitoring, and safety planning.",
  moderate: "Suicide risk is clinically significant and requires active intervention, close monitoring, and consideration of a higher level of care if risk increases.",
  "moderate-high": "Suicide risk is substantial. Urgent evaluation, intensive intervention, and careful consideration of the appropriate level of care are indicated.",
  high: "Suicide risk appears imminent or severe. Immediate intervention and emergency evaluation are generally indicated."
};

const chronicRiskDescriptions = {
  low: "Long-term history suggests little ongoing elevation above baseline suicide risk.",
  "low-moderate": "Long-term risk is mildly elevated because of enduring risk factors or psychiatric history.",
  moderate: "Long-term risk remains meaningfully elevated because of persistent risk factors, recurrent suicidal ideation, or previous suicidal behavior.",
  "moderate-high": "Multiple enduring risk factors substantially increase future suicide risk and warrant ongoing monitoring and intervention.",
  high: "Long-term history indicates persistently severe suicide risk requiring intensive long-term risk management."
};

const riskLevelLabels = {
  low: "Low",
  "low-moderate": "Low–moderate",
  moderate: "Moderate",
  "moderate-high": "Moderate–high",
  high: "High"
};

function updateRiskLevelDisplay(kind) {
  const value = selectedValue(kind);
  const result = document.getElementById(`${kind}-result`);
  const explainer = document.getElementById(`${kind}-explainer`);
  const descriptions = kind === "acute" ? acuteRiskDescriptions : chronicRiskDescriptions;
  const riskClasses = ["risk-low", "risk-low-moderate", "risk-moderate", "risk-moderate-high", "risk-high"];

  result.classList.remove(...riskClasses);
  explainer.classList.remove(...riskClasses);
  result.classList.add(`risk-${value}`);
  explainer.classList.add(`risk-${value}`);
  result.textContent = `${riskLevelLabels[value]} ${kind} risk`;
  explainer.textContent = descriptions[value];
}

function selectedInput(name) {
  return document.querySelector(`input[name="${name}"]:checked`);
}

function selectedValue(name) {
  return selectedInput(name)?.value || "";
}

function selectedLabel(name) {
  return selectedInput(name)?.dataset.label || "";
}

function checkedValues(group) {
  return [...document.querySelectorAll(`[data-group="${group}"] input[type="checkbox"]:checked`)]
    .map(input => input.value);
}

function checkedLabels(group) {
  return [...document.querySelectorAll(`[data-group="${group}"] input[type="checkbox"]:checked`)]
    .map(input => input.dataset.label || input.value);
}

function addOptional(items, id) {
  const value = document.getElementById(id).value.trim();
  return value ? [...items, value] : items;
}

function listText(items) {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function punctuate(text) {
  const clean = text.trim();
  if (!clean) return "";
  return /[.!?]$/.test(clean) ? clean : `${clean}.`;
}

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

  if (ideation === "denied") {
    sentences.push("Client denied current suicidal ideation.");
  } else {
    sentences.push(`Client endorsed ${ideation}.`);
  }

  sentences.push(`No current suicide plan was identified.`.replace("No current suicide plan was identified.",
    plan === "none" ? "No current suicide plan was identified." : `Current suicide plan was described as ${plan}.`));

  sentences.push(
    means === "none identified"
      ? "No access to lethal means was identified."
      : `Access to lethal means was ${means}.`
  );

  sentences.push(
    behavior === "none"
      ? "No recent suicidal behavior was identified."
      : `Recent suicidal behavior included ${behavior}.`
  );

  sentences.push(
    risk.length
      ? `Relevant risk factors include ${listText(risk)}.`
      : "No additional acute or chronic risk factors were identified."
  );

  sentences.push(
    protective.length
      ? `Protective factors include ${listText(protective)}.`
      : "No protective factors were selected."
  );

  sentences.push(`Acute risk is assessed as ${selectedValue("acute")}, with chronic risk assessed as ${selectedValue("chronic")}.`);

  if (rationale) sentences.push(`Clinical rationale: ${rationale}`);

  if (interventions.length) {
    sentences.push(`Interventions included ${listText(interventions)}.`);
  }

  if (interventionNotes) sentences.push(`Intervention and follow-up notes: ${interventionNotes}`);

  return sentences.join(" ");
}

function listOutput() {
  const risk = addOptional(checkedLabels("riskFactors"), "riskOther");
  const protective = addOptional(checkedLabels("protectiveFactors"), "protectiveOther");
  const interventions = checkedLabels("interventions");
  const rationale = document.getElementById("rationale").value.trim();
  const interventionNotes = document.getElementById("interventionNotes").value.trim();

  const lines = [
    "Current Risk",
    `Ideation: ${selectedLabel("ideation")}`,
    `Plan: ${selectedLabel("plan")}`,
    `Means: ${selectedLabel("means")}`,
    `Behavior: ${selectedLabel("behavior")}`,
    "",
    "Risk Factors",
    ...(risk.length ? risk : ["None identified"]),
    "",
    "Protective Factors",
    ...(protective.length ? protective : ["None selected"]),
    "",
    "Assessment",
    `Acute: ${selectedLabel("acute")}`,
    `Chronic: ${selectedLabel("chronic")}`
  ];

  if (rationale) lines.push(`Rationale: ${rationale}`);

  lines.push("", "Interventions", ...(interventions.length ? interventions : ["None selected"]));

  if (interventionNotes) lines.push(`Notes: ${interventionNotes}`);

  return lines.join("\n");
}

function generate() {
  document.getElementById("output").value = outputStyle === "list"
    ? listOutput()
    : narrativeOutput();
}

function resetToNormal() {
  document.querySelector('input[name="ideation"][value="denied"]').checked = true;
  document.querySelector('input[name="plan"][value="none"]').checked = true;
  document.querySelector('input[name="means"][value="none identified"]').checked = true;
  document.querySelector('input[name="behavior"][value="none"]').checked = true;
  document.querySelector('input[name="acute"][value="low"]').checked = true;
  document.querySelector('input[name="chronic"][value="low"]').checked = true;

  document.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.checked = false;
  });

  document.querySelectorAll("textarea:not(#output)").forEach(textarea => {
    textarea.value = "";
  });

  document.querySelectorAll(".optional-details").forEach(panel => {
    panel.classList.remove("open");
  });

  document.querySelectorAll(".toggle-details").forEach(button => {
    button.textContent = button.dataset.originalLabel || button.textContent.replace("− Hide", "+ Add");
  });

  outputStyle = "narrative";
  document.querySelectorAll(".output-style-button").forEach(button => {
    button.classList.toggle("selected", button.dataset.style === outputStyle);
  });

  updateRiskLevelDisplay("acute");
  updateRiskLevelDisplay("chronic");
  generate();
}

document.querySelectorAll("input, textarea").forEach(control => {
  control.addEventListener("input", generate);
  control.addEventListener("change", () => {
    if (control.name === "acute") updateRiskLevelDisplay("acute");
    if (control.name === "chronic") updateRiskLevelDisplay("chronic");
    generate();
  });
});

document.querySelectorAll(".toggle-details").forEach(button => {
  button.dataset.originalLabel = button.textContent;
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.target);
    const isOpen = target.classList.toggle("open");
    button.textContent = isOpen ? "− Hide details" : button.dataset.originalLabel;
  });
});

document.querySelectorAll(".output-style-button").forEach(button => {
  button.addEventListener("click", () => {
    outputStyle = button.dataset.style;
    document.querySelectorAll(".output-style-button").forEach(item => {
      item.classList.toggle("selected", item === button);
    });
    generate();
  });
});

document.getElementById("reset").addEventListener("click", resetToNormal);

document.getElementById("copy").addEventListener("click", async () => {
  const output = document.getElementById("output");
  const status = document.getElementById("copy-status");

  try {
    await navigator.clipboard.writeText(output.value);
    status.textContent = "Copied";
  } catch {
    output.select();
    document.execCommand("copy");
    status.textContent = "Copied";
  }

  setTimeout(() => {
    status.textContent = "";
  }, 1800);
});

document.getElementById("selectText").addEventListener("click", () => {
  const output = document.getElementById("output");
  output.focus();
  output.select();
});

updateRiskLevelDisplay("acute");
updateRiskLevelDisplay("chronic");
generate();

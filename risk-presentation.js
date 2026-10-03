/** Shared labels and display for clinician-selected risk levels.
 * This preserves the existing explanatory wording; it does not calculate risk.
 */
// Explanations shown for clinician-selected acute and chronic risk levels.
const riskDescriptions = {
  acute: {
    low: "Current circumstances are unlikely to result in suicidal behavior. Outpatient care is generally appropriate when otherwise clinically indicated.",
    "low-moderate":
      "Current circumstances increase suicide risk but can typically be managed safely in outpatient care with appropriate supports, monitoring, and safety planning.",
    moderate:
      "Suicide risk is clinically significant and requires active intervention, close monitoring, and consideration of a higher level of care if risk increases.",
    "moderate-high":
      "Suicide risk is substantial. Urgent evaluation, intensive intervention, and careful consideration of the appropriate level of care are indicated.",
    high: "Suicide risk appears imminent or severe. Immediate intervention and emergency evaluation are generally indicated.",
  },
  chronic: {
    low: "Long-term history suggests little ongoing elevation above baseline suicide risk.",
    "low-moderate":
      "Long-term risk is mildly elevated because of enduring risk factors or psychiatric history.",
    moderate:
      "Long-term risk remains meaningfully elevated because of persistent risk factors, recurrent suicidal ideation, or previous suicidal behavior.",
    "moderate-high":
      "Multiple enduring risk factors substantially increase future suicide risk and warrant ongoing monitoring and intervention.",
    high: "Long-term history indicates persistently severe suicide risk requiring intensive long-term risk management.",
  },
};

const riskLabels = {
  low: "Low",
  "low-moderate": "Low–moderate",
  moderate: "Moderate",
  "moderate-high": "Moderate–high",
  high: "High",
};

const riskClasses = Object.keys(riskLabels).map((level) => `risk-${level}`);

function updateRiskDisplay(kind, value) {
  const result = document.getElementById(`${kind}-result`);
  const explainer = document.getElementById(`${kind}-explainer`);

  [result, explainer].forEach((element) => {
    element.classList.remove(...riskClasses);
    if (value) element.classList.add(`risk-${value}`);
  });

  result.textContent = value ? `${riskLabels[value]} ${kind} risk` : "Not selected";
  explainer.textContent = riskDescriptions[kind][value] || "";
  explainer.hidden = !value;
}

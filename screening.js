/**
 * screening.js
 * PHQ-9 and GAD-7: the URL measure parameter chooses the questions and score ranges.
 * Loaded by screening.html after the page markup is available.
 * See README.md for the file map and a guide to following the code.
 */

const RESPONSE_OPTIONS = [
  { label: "Not at all", score: 0 },
  { label: "Several days", score: 1 },
  { label: "More than half the days", score: 2 },
  { label: "Nearly every day", score: 3 },
];

const IMPACT_OPTIONS = [
  "Not difficult at all",
  "Somewhat difficult",
  "Very difficult",
  "Extremely difficult",
];

// Question wording and score bands for each supported URL measure. Item order also determines answer-array positions.
const MEASURES = {
  phq9: {
    title: "PHQ-9",
    instructions:
      "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
    ageGuidance:
      "This page uses the standard PHQ-9 wording and a two-week timeframe. The adolescent-modified PHQ-A has different wording and additional questions; this page does not reproduce that form.",
    impactPrompt:
      "If you checked off any problems, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?",
    max: 27,
    symptomLabel: "depressive symptoms",
    questions: [
      "Little interest or pleasure in doing things",
      "Feeling down, depressed, or hopeless",
      "Trouble falling or staying asleep, or sleeping too much",
      "Feeling tired or having little energy",
      "Poor appetite or overeating",
      "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
      "Trouble concentrating on things, such as reading the newspaper or watching television",
      "Moving or speaking so slowly that other people could have noticed; or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
      "Thoughts that you would be better off dead, or of hurting yourself in some way",
    ],
    ranges: [
      { min: 0, max: 4, label: "Minimal depression" },
      { min: 5, max: 9, label: "Mild depression" },
      { min: 10, max: 14, label: "Moderate depression" },
      { min: 15, max: 19, label: "Moderately severe depression" },
      { min: 20, max: 27, label: "Severe depression" },
    ],
  },
  gad7: {
    title: "GAD-7",
    instructions:
      "Over the last 2 weeks, how often have you been bothered by the following problems?",
    ageGuidance:
      "The GAD-7 has supporting evidence for adolescent use; interpret scores with age-appropriate clinical context.",
    impactPrompt:
      "If you checked off any problems, how difficult have these made it for you to do your work, take care of things at home, or get along with other people?",
    max: 21,
    symptomLabel: "anxiety symptoms",
    questions: [
      "Feeling nervous, anxious, or on edge",
      "Not being able to stop or control worrying",
      "Worrying too much about different things",
      "Trouble relaxing",
      "Being so restless that it is hard to sit still",
      "Becoming easily annoyed or irritable",
      "Feeling afraid, as if something awful might happen",
    ],
    ranges: [
      { min: 0, max: 4, label: "Minimal anxiety" },
      { min: 5, max: 9, label: "Mild anxiety" },
      { min: 10, max: 14, label: "Moderate anxiety" },
      { min: 15, max: 21, label: "Severe anxiety" },
    ],
  },
};

// Choose the measure from ?measure= in the link; an unknown value falls back to PHQ-9.
const requestedMeasure = new URLSearchParams(window.location.search).get("measure");
const currentMeasure = Object.hasOwn(MEASURES, requestedMeasure) ? requestedMeasure : "phq9";
let answers = [];
let impact = "Not difficult at all";

const questionsContainer = document.getElementById("questions");

// Return the configuration for the measure selected by the URL.
function measure() {
  return MEASURES[currentMeasure];
}

// Set every symptom response to zero and reset the functional impact choice.
function resetAnswers() {
  Workbench.resetReview();
  answers = Array(measure().questions.length).fill(0);
  impact = "Not difficult at all";
}

// Build the selected measure, attach its controls, and display the initial results.
function renderMeasure() {
  const config = measure();
  document.title = `${config.title} | Clinical Workbench`;
  document.getElementById("page-title").textContent = config.title;
  document.getElementById("measure-title").textContent = config.title;
  document.getElementById("measure-instructions").textContent = config.instructions;
  document.getElementById("age-guidance").textContent = config.ageGuidance;
  document.getElementById("impact-prompt").textContent = config.impactPrompt;

  questionsContainer.innerHTML = config.questions
    .map(
      (question, index) => `
    <section class="card question-card">
      <h2><span class="question-number">${index + 1}.</span>${question}</h2>
      <div class="response-grid">
        ${RESPONSE_OPTIONS.map(
          (option) => `
          <label class="response-option">
            <input type="radio" name="question-${index}" value="${option.score}" ${answers[index] === option.score ? "checked" : ""}>
            <span>${option.label}<br>${option.score} ${option.score === 1 ? "point" : "points"}</span>
          </label>
        `,
        ).join("")}
      </div>
    </section>
  `,
    )
    .join("");

  document.getElementById("impact-options").innerHTML = IMPACT_OPTIONS.map(
    (option) => `
    <button type="button" class="segment-button ${impact === option ? "selected" : ""}" data-impact="${option}">${option}</button>
  `,
  ).join("");

  questionsContainer.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener("change", (event) => {
      const index = Number(event.target.name.replace("question-", ""));
      answers[index] = Number(event.target.value);
      updateResults();
    });
  });

  document.querySelectorAll("[data-impact]").forEach((button) => {
    button.addEventListener("click", () => {
      impact = button.dataset.impact;
      document
        .querySelectorAll("[data-impact]")
        .forEach((item) => item.classList.toggle("selected", item === button));
      updateResults();
    });
  });

  updateResults();
}

// Add symptom scores; the separate functional impact choice is not included.
function totalScore() {
  return answers.reduce((sum, value) => sum + value, 0);
}

// Find the configured severity band containing the current total.
function currentRange() {
  const total = totalScore();
  return measure().ranges.find((range) => total >= range.min && total <= range.max);
}

// Display all configured score bands and highlight the current one.
function renderInterpretation() {
  const total = totalScore();
  document.getElementById("interpretation-table").innerHTML = measure()
    .ranges.map(
      (range) => `
    <div class="interpretation-row ${total >= range.min && total <= range.max ? "current" : ""}">
      <span class="interpretation-range">${range.min}–${range.max}</span>
      <span>${range.label}</span>
    </div>
  `,
    )
    .join("");
}

// Convert a numeric response into its frequency label.
function answerText(score) {
  return RESPONSE_OPTIONS.find((option) => option.score === score).label;
}

// Join choices into readable English, handling empty, one-item, and longer lists.
function sentenceList(items) {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

// Build the paragraph version of the note from the current results.
function summaryOutput() {
  const config = measure();
  const total = totalScore();
  const severity = currentRange().label;
  const endorsed = config.questions
    .map((question, index) => ({
      question,
      score: answers[index],
      response: answerText(answers[index]),
    }))
    .filter((item) => item.score > 0);

  let text = `${config.title} completed with a total score of ${total}/${config.max}, falling in the ${severity.toLowerCase()} range.`;

  if (endorsed.length === 0) {
    text += ` No ${config.symptomLabel} were endorsed.`;
  } else {
    const phrases = endorsed.map(
      (item) => `${item.question.toLowerCase()} (${item.response.toLowerCase()})`,
    );
    text += ` Endorsed symptoms included ${sentenceList(phrases)}.`;
  }

  text += ` Functional impact was rated as ${impact.toLowerCase()}.`;

  if (currentMeasure === "phq9" && answers[8] > 0) {
    text += ` Item 9 was endorsed at ${answerText(answers[8]).toLowerCase()} and requires direct suicide-risk assessment.`;
  }

  return text;
}

// Build the detailed note, including individual answers and scores.
function detailedOutput() {
  const config = measure();
  const lines = [config.title, ""];

  config.questions.forEach((question, index) => {
    lines.push(`${index + 1}. ${question}`);
    lines.push(
      `${answerText(answers[index])} — ${answers[index]} ${answers[index] === 1 ? "point" : "points"}`,
    );
    lines.push("");
  });

  lines.push(`Total: ${totalScore()} / ${config.max}`);
  lines.push(`Interpretation: ${currentRange().label}`);
  lines.push(`Functional impact: ${impact}`);

  if (currentMeasure === "phq9" && answers[8] > 0) {
    lines.push("");
    lines.push(
      "Safety note: PHQ-9 item 9 was endorsed and requires direct suicide-risk assessment.",
    );
  }

  return lines.join("\n");
}

// Refresh the total, severity band, PHQ-9 item 9 alert, and generated note.
function updateResults() {
  const config = measure();
  const total = totalScore();
  document.getElementById("score-display").textContent = `${total} / ${config.max}`;
  document.getElementById("severity-display").textContent = currentRange().label;
  document.getElementById("safety-alert").hidden = !(currentMeasure === "phq9" && answers[8] > 0);
  renderInterpretation();
  const style = document.querySelector('input[name="outputStyle"]:checked').value;
  Workbench.writeOutput(style === "summary" ? summaryOutput() : detailedOutput());
}

// Connect page controls: reset answers, change output style, and refresh documentation.
document.getElementById("reset-button").addEventListener("click", () => {
  resetAnswers();
  renderMeasure();
});

document
  .querySelectorAll('input[name="outputStyle"]')
  .forEach((input) => input.addEventListener("change", updateResults));

Workbench.initReview();

// Initial page setup: populate the form and show its starting results.
resetAnswers();
renderMeasure();

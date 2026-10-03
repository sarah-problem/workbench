/**
 * fasm.js
 * FASM: records behaviors and context, then calculates four reinforcement function means.
 * Loaded by fasm.html after the page markup is available.
 * See README.md for the file map and a guide to following the code.
 */

const BEHAVIORS = [
  "Cut or carved on your skin",
  "Hit yourself on purpose",
  "Pulled your hair out",
  "Gave yourself a tattoo",
  "Picked at a wound",
  "Burned your skin (for example, with a cigarette, match, or other hot object)",
  "Inserted objects under your nails or skin",
  "Bit yourself (for example, your mouth or lip)",
  "Picked areas of your body to the point of drawing blood",
  "Scraped your skin",
  '"Erased" your skin',
  "Other",
];

const REASONS = [
  "To avoid school, work, or other activities",
  'To relieve feeling "numb" or empty',
  "To get attention",
  "To feel something, even if it was pain",
  "To avoid having to do something unpleasant you don't want to do",
  "To get control of a situation",
  "To try to get a reaction from someone, even if it's a negative reaction",
  "To receive more attention from your parents or friends",
  "To avoid being with people",
  "To punish yourself",
  "To get other people to act differently or change",
  "To be like someone you respect",
  "To avoid punishment or paying the consequences",
  "To stop bad feelings",
  "To let others know how desperate you were",
  "To feel more a part of a group",
  "To get your parents to understand or notice you",
  "To give yourself something to do when alone",
  "To give yourself something to do when with others",
  "To get help",
  "To make others angry",
  "To feel relaxed",
  "Other",
];

// Position i assigns reason i to a reinforcement factor. null excludes the Other reason from factor means.
const FACTORS = [
  "SNR",
  "ANR",
  "SPR",
  "APR",
  "SNR",
  "SPR",
  "SPR",
  "SPR",
  "SNR",
  "APR",
  "SPR",
  "SPR",
  "SNR",
  "ANR",
  "SPR",
  "SPR",
  "SPR",
  "SPR",
  "SPR",
  "SPR",
  "SPR",
  "APR",
  null,
];
const FACTOR_INFO = {
  ANR: {
    name: "Automatic Negative Reinforcement",
    description: "Reducing or escaping unwanted internal experiences",
  },
  APR: {
    name: "Automatic Positive Reinforcement",
    description: "Generating an internal sensation or experience",
  },
  SNR: {
    name: "Social Negative Reinforcement",
    description: "Escaping or avoiding interpersonal demands or situations",
  },
  SPR: {
    name: "Social Positive Reinforcement",
    description: "Obtaining attention, support, response, or interpersonal change",
  },
};
const FACTOR_ORDER = ["ANR", "APR", "SNR", "SPR"];
const REASON_OPTIONS = [
  { value: 0, label: "Never" },
  { value: 1, label: "Rarely" },
  { value: 2, label: "Some" },
  { value: 3, label: "Often" },
];
// These context choices are recorded separately from reason scores.
const CONTEXT_OPTIONS = {
  intent: ["No", "Yes"],
  delay: [
    "None",
    "A few minutes",
    "Less than 60 minutes",
    "More than 1 hour but less than 24 hours",
    "More than 1 day but less than a week",
    "Greater than a week",
  ],
  substances: ["No", "Yes"],
  pain: ["No pain", "Little pain", "Moderate pain", "Severe pain"],
};
const $ = (id) => document.getElementById(id);
// Current in-page answers. Reset restores these values; they are not saved across a page reload.
let behaviors = [],
  reasons = [],
  context = {},
  lifetime = "",
  otherReason = "";

// Restore the starting answers, rebuild the controls, and refresh the results.
function reset() {
  Workbench.resetReview();
  behaviors = BEHAVIORS.map(() => ({ selected: false, count: null, medical: "", other: "" }));
  reasons = REASONS.map(() => null);
  context = { intent: "", delay: "", substances: "", pain: "", age: "" };
  lifetime = "";
  otherReason = "";
  render();
}

// Build the visible form from the current answers and refresh its results.
function render() {
  renderBehaviors();
  renderLifetime();
  renderContext();
  renderReasons();
  update();
}

// Build behavior fields and attach handlers that keep the stored answers current.
function renderBehaviors() {
  $("behavior-list").innerHTML = BEHAVIORS.map((name, i) => {
    const item = behaviors[i];
    return `<div class="behavior-row">
        <div class="behavior-name"><label class="behavior-check">
        <input type="checkbox" data-behavior-check="${i}" ${item.selected ? "checked" : ""}><span>${i + 1}. ${name}</span></label>
        ${i === BEHAVIORS.length - 1 ? `<input class="other-input" type="text" aria-label="Other self-harm behavior" data-behavior-other="${i}" value="${escapeAttr(item.other)}" placeholder="Describe other behavior" ${item.selected ? "" : "hidden disabled"}>` : ""}</div>
        <div class="behavior-details" ${item.selected ? "" : "hidden"}>
        <label class="field-label">How many times?<input type="number" min="1" step="1" required data-behavior-count="${i}" value="${item.selected ? (item.count ?? "") : ""}" ${item.selected ? "" : "disabled"}></label>
        <div class="field-label"><span id="medical-label-${i}">Medical treatment?</span>
        <div class="segmented-options" role="group" aria-labelledby="medical-label-${i}">${["No", "Yes"].map((value) => `<button type="button" class="segment-button ${item.medical === value && item.selected ? "selected" : ""}" data-medical="${i}" data-value="${value}" ${item.selected ? "" : "disabled"}>${value}</button>`).join("")}</div></div>
        </div></div>`;
  }).join("");
  document.querySelectorAll("[data-behavior-check]").forEach(
    (input) =>
      (input.onchange = () => {
        const item = behaviors[Number(input.dataset.behaviorCheck)];
        item.selected = input.checked;
        if (!input.checked) item.count = null;
        if (!input.checked) item.medical = "";
        // Update this row in place so keyboard focus and other in-progress inputs survive.
        const row = input.closest(".behavior-row");
        // Hidden follow-ups stay disabled so they cannot block documentation validation.
        row.querySelector(".behavior-details").hidden = !item.selected;
        const other = row.querySelector("[data-behavior-other]");
        if (other) other.hidden = other.disabled = !item.selected;
        const count = row.querySelector("[data-behavior-count]");
        count.disabled = !item.selected;
        count.value = item.selected ? (item.count ?? "") : "";
        row.querySelectorAll("[data-medical]").forEach((button) => {
          button.disabled = !item.selected;
          button.classList.toggle(
            "selected",
            item.selected && button.dataset.value === item.medical,
          );
        });
        update();
      }),
  );
  document.querySelectorAll("[data-behavior-count]").forEach(
    (input) =>
      (input.oninput = () => {
        if (input.validity.valid)
          behaviors[Number(input.dataset.behaviorCount)].count =
            input.value === "" ? null : Number(input.value);
        update();
      }),
  );
  document.querySelectorAll("[data-behavior-other]").forEach(
    (input) =>
      (input.oninput = () => {
        behaviors[Number(input.dataset.behaviorOther)].other = input.value;
        update();
      }),
  );
  document.querySelectorAll("[data-medical]").forEach(
    (button) =>
      (button.onclick = () => {
        const item = behaviors[Number(button.dataset.medical)];
        item.medical = item.medical === button.dataset.value ? "" : button.dataset.value;
        button
          .closest(".segmented-options")
          .querySelectorAll("button")
          .forEach((choice) => {
            choice.classList.toggle("selected", choice.dataset.value === item.medical);
          });
        update();
      }),
  );
}

// Build the lifetime-history choices and remember the selected one.
function renderLifetime() {
  $("lifetime-options").innerHTML = ["No", "Yes", "Not documented"]
    .map(
      (value) =>
        `<button type="button" class="segment-button ${lifetime === value ? "selected" : ""}" data-lifetime="${value}">${value}</button>`,
    )
    .join("");
  document.querySelectorAll("[data-lifetime]").forEach(
    (button) =>
      (button.onclick = () => {
        lifetime = lifetime === button.dataset.lifetime ? "" : button.dataset.lifetime;
        document.querySelectorAll("[data-lifetime]").forEach((choice) => {
          choice.classList.toggle("selected", choice.dataset.lifetime === lifetime);
        });
        update();
      }),
  );
}

// Build intent, delay, substance, pain, and onset-age controls and attach their handlers.
function renderContext() {
  const fields = [
    ["intent", "C. While doing any of the above acts, were you trying to kill yourself?"],
    ["delay", "D. How long did you think about doing the act(s) before actually doing them?"],
    ["substances", "E. Did any of the behaviors occur while taking drugs or alcohol?"],
    ["pain", "F. Did you experience pain during the self-harm?"],
  ];
  $("context-fields").innerHTML =
    fields
      .map(
        ([key, label]) =>
          `<div class="context-item">
        <h3>${label}</h3>
        <div class="segmented-options">${CONTEXT_OPTIONS[key].map((value) => `<button type="button" class="segment-button ${context[key] === value ? "selected" : ""}" data-context="${key}" data-value="${value}">${value}</button>`).join("")}</div>
        </div>`,
      )
      .join("") +
    `<div class="context-item">
        <h3>G. How old were you when you first harmed yourself in this way?</h3>
        <input class="age-input" id="onset-age" aria-label="Age at first self-harm" type="number" min="0" max="120" step="1" value="${escapeAttr(context.age)}" placeholder="Age">
        </div>`;
  document.querySelectorAll("[data-context]").forEach(
    (button) =>
      (button.onclick = () => {
        const key = button.dataset.context;
        context[key] = context[key] === button.dataset.value ? "" : button.dataset.value;
        button
          .closest(".segmented-options")
          .querySelectorAll("button")
          .forEach((choice) => {
            choice.classList.toggle("selected", choice.dataset.value === context[key]);
          });
        update();
      }),
  );
  $("onset-age").oninput = (event) => {
    context.age = event.target.value;
    update();
  };
}

// Build the reason-rating controls, including the optional other-reason description.
function renderReasons() {
  $("reason-list").innerHTML = REASONS.map(
    (text, i) =>
      `<section class="card reason-card">
        <h2>
        <span class="question-number">${i + 1}.</span>${text}</h2>${i === REASONS.length - 1 ? `<input class="other-input" id="other-reason" aria-label="Other reason for self-harm" type="text" value="${escapeAttr(otherReason)}" placeholder="Describe other reason">` : ""}<div class="response-grid">${REASON_OPTIONS.map(
          (option) => `<label class="response-option">
        <input type="radio" name="reason-${i}" value="${option.value}" ${reasons[i] === option.value ? "checked" : ""}>
        <span>${option.value}<br>${option.label}</span>
        </label>`,
        ).join("")}</div>
        </section>`,
  ).join("");
  document.querySelectorAll('[name^="reason-"]').forEach(
    (input) =>
      (input.onchange = () => {
        reasons[Number(input.name.split("-")[1])] = input.checked ? Number(input.value) : null;
        update();
      }),
  );
  const other = $("other-reason");
  if (other)
    other.oninput = (event) => {
      otherReason = event.target.value;
      update();
    };
}

// The final Other reason is optional and excluded from all function means.
function completionMessage() {
  const required = reasons.slice(0, -1);
  const answered = required.filter(Number.isInteger).length;
  if (answered !== required.length)
    return `${answered} of ${required.length} reason ratings answered — complete these items to generate documentation.`;
  if (selectedBehaviors().some((item) => !Number.isInteger(item.count) || item.count < 1))
    return "Enter a frequency for each selected behavior.";
  return "";
}

// Group reason ratings using FACTORS, then calculate each mean. The final Other reason is excluded.
function functionScores() {
  return Object.fromEntries(
    FACTOR_ORDER.map((code) => {
      const indexes = FACTORS.map((factor, i) => (factor === code ? i : -1)).filter((i) => i >= 0);
      const total = indexes.reduce((sum, i) => sum + reasons[i], 0);
      const complete = indexes.every((i) => Number.isInteger(reasons[i]));
      return [
        code,
        {
          mean: complete ? total / indexes.length : null,
          total: complete ? total : null,
          count: indexes.length,
        },
      ];
    }),
  );
}

// Recalculate the displayed results and regenerate the selected output format.
function update() {
  const selected = selectedBehaviors(),
    // Several methods can occur in one episode; this is a sum of method frequencies.
    behaviorTotal = selected.reduce((sum, item) => sum + item.count, 0),
    scores = functionScores();
  $("method-count").textContent = selected.length;
  $("behavior-total").textContent =
    selected.length && selected.every((item) => Number.isInteger(item.count)) ? behaviorTotal : "—";
  $("intent-alert").hidden = context.intent !== "Yes";
  $("function-results").innerHTML = FACTOR_ORDER.map((code) => {
    const info = FACTOR_INFO[code],
      score = scores[code];
    return `<div class="function-card">
        <h3>${info.name}</h3>
        <div class="function-score">${score.mean === null ? "—" : `${score.mean.toFixed(2)} / 3`}</div>
        <div class="function-description">${info.description}</div>
        <div class="function-bar">
        <span style="width:${((score.mean ?? 0) / 3) * 100}%">
        </span>
        </div>
        </div>`;
  }).join("");
  const ranked = REASONS.slice(0, -1)
    .map((text, i) => ({ text, value: reasons[i] }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);
  $("highest-reasons").innerHTML = ranked.length
    ? ranked
        .slice(0, 5)
        .map(
          (item) =>
            `<p>
        <strong>${REASON_OPTIONS[item.value].label} (${item.value}):</strong> ${item.text}</p>`,
        )
        .join("")
    : `<p>${reasons.slice(0, -1).some((value) => value === null) ? `${reasons.slice(0, -1).filter(Number.isInteger).length} of ${REASONS.length - 1} reason ratings answered.` : "No reasons endorsed above Never."}</p>`;
  const detailed = document.querySelector('[name="outputStyle"]:checked').value === "detailed";
  Workbench.writeOutput(
    completionMessage()
      ? ""
      : detailed
        ? detailedOutput(selected, behaviorTotal, scores)
        : summaryOutput(selected, behaviorTotal, scores, ranked),
  );
}

// Collect checked behaviors and substitute the free-text name for Other when supplied.
function selectedBehaviors() {
  return behaviors
    .map((item, i) => ({
      ...item,
      name: i === BEHAVIORS.length - 1 && item.other.trim() ? item.other.trim() : BEHAVIORS[i],
    }))
    .filter((item) => item.selected);
}

// Build the paragraph version of the note from the current results.
function summaryOutput(selected, behaviorTotal, scores, ranked) {
  if (completionMessage()) return "";
  const methodText = selected.length
    ? selected
        .map(
          (item) =>
            `${item.name} (${item.count} time${item.count === 1 ? "" : "s"}${item.medical === "Yes" ? ", medical treatment received" : ""})`,
        )
        .join(", ")
    : "no past-year self-harm behaviors entered";
  const functions = FACTOR_ORDER.map(
    (code) => `${FACTOR_INFO[code].name} ${scores[code].mean.toFixed(2)}/3`,
  ).join(", ");
  const top = ranked.length
    ? ranked
        .slice(0, 3)
        .map((item) => `${item.text} (${REASON_OPTIONS[item.value].label})`)
        .join("; ")
    : "none endorsed above Never";
  const details = [];
  if (lifetime) details.push(`Lifetime history outside the past year: ${lifetime}.`);
  if (context.intent) details.push(`Suicidal intent during the reported acts: ${context.intent}.`);
  if (context.delay) details.push(`Typical contemplation period: ${context.delay.toLowerCase()}.`);
  if (context.substances)
    details.push(`Substance involvement: ${context.substances.toLowerCase()}.`);
  if (context.pain) details.push(`Pain: ${context.pain.toLowerCase()}.`);
  if (context.age !== "") details.push(`Age at first self-harm: ${context.age}.`);
  return `FASM completed. Past-year behavior entries were ${methodText}${selected.length ? `, with a summed frequency of ${behaviorTotal} across methods during the past year` : ""}. ${details.length ? details.join(" ") + " " : ""}Function means were ${functions}. Highest endorsed reasons were ${top}. The FASM has no diagnostic cutoff; results require integration with clinical interview and direct safety assessment.`;
}

// Build the detailed note, including individual answers and scores.
function detailedOutput(selected, behaviorTotal, scores) {
  if (completionMessage()) return "";
  const lines = ["Functional Assessment of Self-Mutilation (FASM)", "", "Past-Year Behaviors"];
  if (selected.length)
    selected.forEach((item) =>
      lines.push(
        item.name,
        `Frequency: ${item.count}`,
        `Medical treatment: ${item.medical || "Not documented"}`,
        "",
      ),
    );
  else lines.push("No behaviors entered", "");
  lines.push(
    `Total methods: ${selected.length}`,
    `Total frequency across methods: ${behaviorTotal}`,
    `Lifetime history outside past year: ${lifetime || "Not documented"}`,
    "",
    "Contextual Features",
    `Suicidal intent during acts: ${context.intent || "Not documented"}`,
    `Contemplation period: ${context.delay || "Not documented"}`,
    `Drugs or alcohol: ${context.substances || "Not documented"}`,
    `Pain: ${context.pain || "Not documented"}`,
    `Age at first self-harm: ${context.age || "Not documented"}`,
    "",
    "Function Profiles",
  );
  FACTOR_ORDER.forEach((code) =>
    lines.push(
      `${FACTOR_INFO[code].name}: ${scores[code].mean.toFixed(2)} / 3 (${scores[code].total}/${scores[code].count * 3})`,
    ),
  );
  lines.push("", "Reason Ratings");
  REASONS.forEach((text, i) =>
    lines.push(
      "",
      `${i + 1}. ${i === REASONS.length - 1 && otherReason.trim() ? otherReason.trim() : text}`,
      `${reasons[i] === null ? "Not answered" : `${REASON_OPTIONS[reasons[i]].label} - ${reasons[i]}`}`,
    ),
  );
  lines.push(
    "",
    "Interpretation",
    "Function scores are descriptive mean item ratings. No diagnostic cutoff is established. Integrate findings with clinical interview, behavioral context, and direct suicide risk assessment.",
  );
  return lines.join("\n");
}

// Escape special characters before inserting text into a quoted HTML attribute.
function escapeAttr(value = "") {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

// Connect page controls: reset answers, change output style, and refresh documentation.
$("reset-button").onclick = reset;
document.querySelectorAll('[name="outputStyle"]').forEach((input) => (input.onchange = update));
Workbench.initReview({ validate: completionMessage });

// Initial page setup: populate the form and show its starting results.
reset();

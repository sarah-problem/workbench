/**
 * mse.js
 * Mental Status Exam: builds the form from mse-data.js and turns selections into a note.
 * Loaded by mse.html after the page markup is available.
 * See README.md for the file map and a guide to following the code.
 */

/**
 * MSE APPLICATION LOGIC
 * ------------------------------------------------------------
 * This file controls the interface and generated output.
 * Choices and teaching content live in mse-data.js.
 * Narrative sentence wording also lives in buildNarrativeOutput() below.
 */

/* Build the page from the sections defined in mse-data.js. */
function renderSections() {
  const container = document.getElementById("mse-fields");
  container.innerHTML = "";

  // Create category containers once, then place each existing field in its category.
  const categoryBodies = new Map();
  mseCategories.forEach((category) => {
    const group = document.createElement("section");
    group.className = "mse-category";
    group.setAttribute("aria-labelledby", `category-${category.id}`);
    group.innerHTML = `<h2 class="mse-category-title" id="category-${category.id}">${category.title}</h2><div class="mse-category-fields"></div>`;
    container.appendChild(group);
    categoryBodies.set(category.id, group.querySelector(".mse-category-fields"));
  });

  mseSections.forEach((section) => {
    const card = document.createElement("section");
    card.className = "card mse-section";
    card.dataset.section = section.id;

    card.innerHTML = `
      <div class="section-header">
        <h3>${section.title} <span class="dimension-description learning-only">(${mseDimensionDescriptions[section.id]})</span></h3>
        ${
          section.observation
            ? `<button type="button" class="tiny-button" aria-expanded="false" aria-controls="${section.id}-observation-box" onclick="toggleObservation('${section.id}')">+ Add observation</button>`
            : ""
        }
      </div>

      <div class="control-area"></div>

      ${
        section.observation
          ? `
          <div class="observation-box" id="${section.id}-observation-box">
            <label for="${section.id}-observation">Additional observation:</label>
            <textarea
              id="${section.id}-observation"
              class="observation-text"
              placeholder=""
            ></textarea>
          </div>
        `
          : ""
      }

      ${
        mseOtherHints[section.id]
          ? `<div class="other-entry" id="${section.id}-other-entry" hidden>
        <label for="${section.id}-other-text">${section.id === "mood" ? "Client’s own words for mood:" : "Describe other / client’s response:"}</label>
        <textarea id="${section.id}-other-text" class="other-text" placeholder="Ex.: ${mseOtherHints[section.id]}"></textarea>
      </div>`
          : ""
      }
      <details class="more-info">
        <summary>More information</summary>
        <div class="info-content">${moreInfoHTML(section)}</div>
      </details>
    `;

    const category = mseCategories.find((item) => item.sections.includes(section.id));
    categoryBodies.get(category.id).appendChild(card);

    const controlArea = card.querySelector(".control-area");

    if (section.type === "orientation") {
      renderOrientation(section, controlArea);
    } else {
      renderChoiceButtons(section, controlArea);
    }

    if (mseContextSections.includes(section.id)) renderContextModifier(section, controlArea);

    const other = document.getElementById(`${section.id}-other-text`);
    if (other) other.addEventListener("input", generateMSE);
    const observation = document.getElementById(`${section.id}-observation`);
    if (observation) {
      observation.addEventListener("input", generateMSE);
    }
  });
}

// Optional context belongs to a single domain. Free text can describe a more specific
// baseline, setting, or observed pattern without forcing a diagnostic interpretation.
function contextOptionsFor(sectionId) {
  return mseContextOptions.filter((item) => !item.sections || item.sections.includes(sectionId));
}

function renderContextModifier(section, controlArea) {
  const panel = document.createElement("details");
  panel.className = "context-panel";
  panel.innerHTML = `
    <summary>Context / baseline</summary>
    <div class="context-fields">
      <fieldset class="context-choices">
        <legend>${section.title} modifier</legend>
        ${contextOptionsFor(section.id)
          .map(
            (item) =>
              `<label><input type="radio" name="${section.id}-context" class="context-select" value="${item.value}" ${item.value === "" ? "checked" : ""}> ${item.label}</label>`,
          )
          .join("")}
      </fieldset>
      <fieldset class="context-choices context-source-group" disabled>
        <legend>How the baseline is known</legend>
        ${mseBaselineSources.map((item) => `<label><input type="radio" name="${section.id}-context-source" class="context-source" value="${item.value}" ${item.value === "" ? "checked" : ""}> ${item.label}</label>`).join("")}
      </fieldset>
      ${
        mseContextObservations.some((item) => item.sections.includes(section.id))
          ? `
        <fieldset class="context-observations">
          <legend>Specific observations</legend>
          ${mseContextObservations
            .filter((item) => item.sections.includes(section.id))
            .map(
              (item) => `
            <label><input type="checkbox" class="context-observation" data-context-section="${section.id}" value="${item.value}"> ${item.label}</label>
          `,
            )
            .join("")}
        </fieldset>`
          : ""
      }
      <label for="${section.id}-context-note">Additional context/clarification</label>
      <textarea id="${section.id}-context-note" class="context-note" placeholder="Ex.: ${mseContextNoteExamples[section.id].map((example) => example.replace(/\.$/, "")).join(" / ")}"></textarea>

    </div>`;
  controlArea.appendChild(panel);
  panel.querySelectorAll("select, textarea, input").forEach((control) => {
    control.addEventListener("input", () => {
      const selected = panel.querySelector(".context-select:checked");
      const source = panel.querySelector(".context-source-group");
      // Clear source attribution when the comparison is absent or unknown.
      source.disabled = !selected.value || selected.value === "unknown";
      if (source.disabled) source.querySelector('input[value=""]').checked = true;
      updateContextSummary(panel, section.id);
      generateMSE();
    });
  });
}

// Show only qualifiers relevant to the selected findings. Visibility does not
// select a finding: the clinician must check each observation explicitly.
function updateContextObservations() {
  Object.entries(mseObservationRelevance).forEach(([sectionId, relevant]) => {
    const card = document.querySelector(`[data-section="${sectionId}"]`);
    const group = card?.querySelector(".context-observations");
    if (!group) return;
    const values = getSelectedValues(sectionId);
    let anyVisible = false;
    group.querySelectorAll(".context-observation").forEach((input) => {
      const visible = relevant[input.value]?.some((value) => values.includes(value)) || false;
      input.closest("label").hidden = !visible;
      input.disabled = !visible;
      // A hidden qualifier must not remain in the generated note.
      if (!visible) input.checked = false;
      anyVisible ||= visible;
    });
    group.hidden = !anyVisible;
    const panel = card.querySelector(".context-panel");
    updateContextSummary(panel, sectionId);
  });
}

// One label rule keeps context changes and automatically cleared observations in sync.
function updateContextSummary(panel, sectionId) {
  const value = panel.querySelector(".context-select:checked")?.value || "";
  const label = contextOptionsFor(sectionId).find((item) => item.value === value)?.label;
  const custom = panel.querySelector(".context-note").value.trim();
  const observed = panel.querySelector(".context-observation:checked");
  const suffix = value ? label : custom ? "Custom context" : observed ? "Observations added" : "";
  panel.querySelector("summary").textContent = `Context / baseline${suffix ? ` · ${suffix}` : ""}`;
}

// Read context as plain text. It is written into the output textarea, never interpreted as HTML.
function getContext(sectionId) {
  const value = document.querySelector(`input[name="${sectionId}-context"]:checked`)?.value || "";
  const option = contextOptionsFor(sectionId).find((item) => item.value === value);
  const sourceValue =
    document.querySelector(`input[name="${sectionId}-context-source"]:checked`)?.value || "";
  const source = mseBaselineSources.find((item) => item.value === sourceValue)?.phrase || "";
  const phrase = option?.phrase ? `${option.phrase}${source ? `, ${source}` : ""}` : "";
  const observations = [
    ...document.querySelectorAll(
      `.context-observation[data-context-section="${sectionId}"]:checked`,
    ),
  ]
    .map(
      (control) =>
        mseContextObservations.find(
          (item) => item.value === control.value && item.sections.includes(sectionId),
        )?.sentence,
    )
    .filter(Boolean)
    .join(" ");
  const note = document.getElementById(`${sectionId}-context-note`)?.value.trim() || "";
  return {
    phrase,
    statement: option?.statement || "",
    observations,
    note: note ? (/[.!?]$/.test(note) ? note : `${note}.`) : "",
  };
}

/* Render the standard button choices used by most sections. */
function renderChoiceButtons(section, controlArea) {
  const group = document.createElement("div");
  group.className = section.multiple
    ? "segmented-options multi-select-options"
    : "segmented-options";
  group.setAttribute("role", "group");
  group.setAttribute("aria-label", section.title);

  section.options.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "segment-button";
    button.textContent = choice.label;
    button.dataset.value = choice.value;

    button.addEventListener("click", () => {
      selectOption(section.id, choice.value);
    });

    group.appendChild(button);
  });

  controlArea.appendChild(group);
}

/* Orientation uses four separate domains instead of one broad label. */
function renderOrientation(section, controlArea) {
  const grid = document.createElement("div");
  grid.className = "orientation-grid";

  section.domains.forEach((domain) => {
    const row = document.createElement("div");
    row.className = "orientation-row";
    row.dataset.domain = domain.id;
    row.dataset.value = "oriented";
    row.setAttribute("role", "group");
    row.setAttribute("aria-label", `${domain.label} orientation`);

    row.innerHTML = `
      <span class="orientation-label">${domain.label}</span>
      <button type="button" class="segment-button small selected" data-value="oriented">Oriented</button>
      <button type="button" class="segment-button small" data-value="disoriented">Disoriented</button>
    `;

    row.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        selectOrientation(domain.id, button.dataset.value);
      });
    });

    grid.appendChild(row);
  });

  controlArea.appendChild(grid);
}

// Teaching panels show definitions (or diagrams for speech/thought process) and Notes.
function moreInfoHTML(section) {
  const info = section.info || {};
  const pieces = [];

  const choices =
    section.type === "orientation"
      ? section.domains.map((domain) => ({ value: domain.id, label: domain.label }))
      : section.options;

  const explanations = choices
    .map((choice) => {
      const explanation = optionHelp[section.id]?.[choice.value];
      return explanation ? `<p><strong>${choice.label}:</strong> ${explanation}</p>` : "";
    })
    .filter(Boolean)
    .join("");

  if (["speech", "thoughtProcess"].includes(section.id) && mseVisualGuides[section.id]) {
    pieces.push(visualGuideHTML(section));
  } else if (explanations) {
    pieces.push(`<div class="option-explanations">${explanations}</div>`);
  }

  if (info.nuances?.length) {
    pieces.push(`
      <div class="question-block">
        <span class="info-label">Notes:</span>
        <ul class="question-list">
          ${info.nuances.map((note) => `<li>${note}</li>`).join("")}
        </ul>
      </div>
    `);
  }

  return pieces.join("");
}

// Inline vector diagrams use currentColor, so they stay monochrome in both themes.
// Text labels and explanations carry the meaning; the decorative SVG is hidden from
// screen readers. No external image files, emoji fonts, or network requests are needed.
function descriptorDiagram(sectionId, value) {
  const line = (d, extra = "") => `<path d="${d}" ${extra}/>`;
  const text = (x, y, label) =>
    `<text x="${x}" y="${y}" stroke="none" fill="currentColor" font-size="12" font-family="sans-serif" text-anchor="middle">${label}</text>`;
  let drawing = "";
  if (sectionId === "speech") {
    const positions = {
      normal: [16, 28, 40, 60, 72, 84],
      rapid: [10, 18, 26, 34, 42, 50, 58, 66, 74, 82],
      pressured: [8, 15, 22, 29, 36, 43, 50, 57, 64, 71, 78],
      slow: [18, 48, 78],
      quiet: [16, 28, 40, 60, 72, 84],
      latent: [58, 70, 82],
      impoverished: [18, 30],
    }[value];
    if (positions) {
      drawing = positions
        .map((x, i) => {
          const height = value === "quiet" ? 5 : [12, 20, 15][i % 3];
          return line(`M${x} ${24 - height / 2}v${height}`);
        })
        .join("");
      if (value === "latent") drawing += line("M10 24H44", 'stroke-dasharray="2 5"');
      if (value === "pressured") {
        // Leave a gap in the speech marks for a second forward arrow.
        drawing = positions
          .filter((x) => x < 36 || x > 50)
          .map((x, i) => {
            const height = [12, 20, 15][i % 3];
            return line(`M${x} ${24 - height / 2}v${height}`);
          })
          .join("");
        drawing += line("M35 24h15m-5-5 5 5-5 5M82 24h12m-5-5 5 5-5 5");
      }
    } else drawing = line("M12 10h72v26H34L22 43v-7H12Z") + text(48, 28, "…");
  } else if (sectionId === "thoughtProcess") {
    const paths = {
      linear:
        line("M20 24h20m-4-4 4 4-4 4M59 24h20m-4-4 4 4-4 4") +
        text(10, 28, "A") +
        text(50, 28, "B") +
        text(90, 28, "C"),
      circumstantial:
        text(10, 28, "A") +
        line("M20 24Q28 0 42 12T62 35Q70 45 81 24m-6 2 6-2-1 6") +
        text(91, 28, "B"),
      tangential:
        text(10, 28, "A") + text(91, 28, "B") + line("M20 24h20L72 7m-7 0h7v7") + text(84, 10, "C"),
      perseverative: text(16, 28, "A") + line("M28 24C42 1 81 4 80 25S42 44 31 31m6 1-6-1 1 6"),
      flight:
        text(8, 28, "A") +
        text(35, 28, "B") +
        text(63, 28, "C") +
        text(91, 28, "D") +
        line("M17 24h9m-3-3 3 3-3 3M44 24h10m-3-3 3 3-3 3M72 24h10m-3-3 3 3-3 3"),
      blocking: text(12, 28, "A") + line("M23 24h40m-5-5 5 5-5 5M70 12v24"),
      disorganized:
        text(10, 13, "A") +
        text(85, 15, "D") +
        text(46, 43, "B") +
        line("M20 10l15 7M65 16l-8 12M17 35l12-3", 'stroke-dasharray="3 4"'),
      other: text(12, 28, "A") + line("M24 24h39", 'stroke-dasharray="4 4"') + text(80, 28, "?"),
    };
    drawing = paths[value];
  }
  return `<svg class="descriptor-diagram" viewBox="0 0 100 48" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${drawing}</svg>`;
}

// Guides are always visible inside More information, without nested disclosures.
function visualGuideHTML(section) {
  const cards = section.options
    .map((choice) => {
      const guide = mseVisualGuides[section.id][choice.value];
      if (!guide) return "";
      return `<div class="descriptor-card">
      <h4 class="descriptor-heading">${descriptorDiagram(section.id, choice.value)}<span>${choice.label}</span></h4>
      <div class="descriptor-body">
        <p>${guide}</p>
      </div>
    </div>`;
    })
    .join("");
  return `<div class="visual-guide"><div class="descriptor-grid">${cards}</div></div>`;
}

/* Update a section; multi-select findings toggle while single choices replace the value. */
function selectOption(sectionId, value, refresh = true) {
  const section = mseSections.find((item) => item.id === sectionId);
  const card = document.querySelector(`[data-section="${sectionId}"]`);

  // In multi-select sections, the normal choice and non-default findings exclude each other.
  if (section?.multiple) {
    const current = new Set((card.dataset.values || section.normal).split(",").filter(Boolean));

    if (value === section.normal) {
      current.clear();
      current.add(section.normal);
    } else {
      current.delete(section.normal);

      if (current.has(value)) {
        current.delete(value);
      } else {
        current.add(value);
      }

      if (current.size === 0) {
        current.add(section.normal);
      }
    }

    card.dataset.values = [...current].join(",");

    card.querySelectorAll(".segment-button").forEach((button) => {
      button.classList.toggle("selected", current.has(button.dataset.value));
    });
  } else {
    card.dataset.value = value;

    card.querySelectorAll(".segment-button").forEach((button) => {
      button.classList.toggle("selected", button.dataset.value === value);
    });
  }

  const otherEntry = document.getElementById(`${sectionId}-other-entry`);
  if (otherEntry) otherEntry.hidden = value !== "other";
  if (refresh) generateMSE();
}

/* Store one selected value for an orientation domain. */
function selectOrientation(domainId, value, refresh = true) {
  const row = document.querySelector(`.orientation-row[data-domain="${domainId}"]`);
  row.dataset.value = value;

  row.querySelectorAll(".segment-button").forEach((button) => {
    button.classList.toggle("selected", button.dataset.value === value);
  });

  if (refresh) generateMSE();
}

/* Return every selected value for a section, including multi-select sections. */
function getSelectedValues(sectionId) {
  const section = mseSections.find((item) => item.id === sectionId);
  if (!section || section.type === "orientation") return [];

  const card = document.querySelector(`[data-section="${sectionId}"]`);

  if (section.multiple) {
    return (card?.dataset.values || section.normal).split(",").filter(Boolean);
  }

  return [card?.dataset.value || section.normal];
}

/* Convert orientation domain selections into a natural sentence. */
function getOrientationSentence() {
  const domains = mseSections.find((section) => section.id === "orientation").domains;

  const oriented = [];
  const disoriented = [];

  domains.forEach(({ id, label: title }) => {
    const label = title.toLowerCase();
    const row = document.querySelector(`.orientation-row[data-domain="${id}"]`);
    const value = row?.dataset.value || "oriented";

    if (value === "oriented") oriented.push(label);
    else disoriented.push(label);
  });

  if (disoriented.length === 0) {
    return "Oriented to person, place, time, and situation.";
  }

  if (oriented.length === 0) {
    return `Disoriented to ${listText(disoriented)}.`;
  }

  return `Oriented to ${listText(oriented)}; disoriented to ${listText(disoriented)}.`;
}

/* Join a short English list: "person, place, and time." */
function listText(items) {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;

  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

/* Read the selected output format. */
function getOutputStyle() {
  return document.querySelector('input[name="outputStyle"]:checked').value;
}

/* Add punctuation to free-text observations if needed. */
function getObservation(section) {
  const field = document.getElementById(`${section.id}-observation`);

  if (!field) return "";

  const text = field.value.trim();

  if (!text) return "";

  return /[.!?]$/.test(text) ? text : `${text}.`;
}

// Hidden Other text is retained for editing but omitted unless Other is selected.
function otherDescription(sectionId) {
  if (getSelectedValue(sectionId) !== "other") return "";
  return document.getElementById(`${sectionId}-other-text`)?.value.trim() || "";
}
function otherSentence(sectionId) {
  const text = otherDescription(sectionId);
  if (!text) return "";
  if (sectionId === "mood") return `Client described their mood as “${text}”.`;
  const label = { sib: "Self-injury", si: "Suicidal ideation", hi: "Homicidal ideation" }[
    sectionId
  ];
  return `${label}: ${text}${/[.!?]$/.test(text) ? "" : "."}`;
}

/* Generate Narrative or List output. */

/**
 * Return the currently selected value for a standard section.
 */
function getSelectedValue(sectionId) {
  return getSelectedValues(sectionId)[0] || "";
}

/**
 * Add a section's optional free-text observation directly after its
 * generated sentence so it stays connected to the correct MSE domain.
 */
function withObservation(sectionId, sentence) {
  const section = mseSections.find((item) => item.id === sectionId);
  const observation = section ? getObservation(section) : "";
  const context = getContext(sectionId);
  const domainLabel = section.title.charAt(0) + section.title.slice(1).toLowerCase();
  // Narrative sentences sometimes combine domains. Naming the domain here keeps
  // a modifier for thought process from accidentally modifying thought content too.
  const contextText = context.phrase ? `${domainLabel} findings were ${context.phrase}.` : "";
  const customText = context.note ? `${domainLabel} context: ${context.note}` : "";
  const baselineText = context.statement ? `${domainLabel}: ${context.statement}` : "";
  const observedText = context.observations
    ? `${domainLabel} observations: ${context.observations}`
    : "";
  return [sentence, contextText, baselineText, observedText, customText, observation]
    .filter(Boolean)
    .join(" ");
}

/**
 * Build a smoother clinical narrative instead of concatenating
 * one short sentence for every selected button.
 */
function buildNarrativeOutput() {
  const appearance = getSelectedValues("appearance");
  const behavior = getSelectedValues("behavior");
  const eyeContact = getSelectedValue("eyeContact");
  const speech = getSelectedValues("speech");
  const mood = getSelectedValue("mood");
  const affect = getSelectedValues("affect");
  const thoughtProcess = getSelectedValues("thoughtProcess");
  const thoughtContent = getSelectedValues("thoughtContent");
  const perception = getSelectedValue("perception");
  const attentionMemory = getSelectedValue("attentionMemory");
  const insight = getSelectedValue("insight");
  const judgment = getSelectedValue("judgment");
  const impulse = getSelectedValue("impulse");
  const sib = getSelectedValue("sib");
  const si = getSelectedValue("si");
  const hi = getSelectedValue("hi");

  const sentences = [];

  // These maps supply narrative phrasing, separate from the labels and sentences in mse-data.js.
  const appearanceMap = {
    appropriate: "appropriate grooming and attire",
    disheveled: "a disheveled appearance",
    poorHygiene: "poor hygiene",
    inappropriate: "attire inappropriate for the setting or weather",
    other: "an otherwise notable appearance",
  };

  const behaviorMap = {
    cooperative: "cooperative and appropriately engaged",
    guarded: "guarded",
    withdrawn: "withdrawn",
    restless: "restless",
    agitated: "agitated",
    other: "otherwise notable in behavior",
  };

  const appearanceText = listText(appearance.map((value) => appearanceMap[value]).filter(Boolean));

  const behaviorText = listText(behavior.map((value) => behaviorMap[value]).filter(Boolean));

  sentences.push(
    withObservation(
      "appearance",
      withObservation(
        "behavior",
        `The client presented with ${appearanceText} and was ${behaviorText} throughout the interview.`,
      ),
    ),
  );

  const eyeContactText =
    {
      appropriate: "Eye contact was appropriate.",
      limited: "Eye contact was limited.",
      avoidant: "Eye contact was avoidant.",
      intense: "Eye contact was intense.",
      variable: "Eye contact was variable.",
    }[eyeContact] || "Eye contact was otherwise notable.";

  sentences.push(withObservation("eyeContact", eyeContactText));

  const speechMap = {
    normal: "normal in rate, rhythm, volume, and quantity",
    rapid: "rapid but interruptible",
    pressured: "pressured and difficult to interrupt",
    slow: "slowed",
    quiet: "quiet",
    latent: "notable for response latency",
    impoverished: "impoverished, with reduced quantity and spontaneity",
    other: "otherwise notable",
  };

  const speechText = `Speech was ${listText(
    speech.map((value) => speechMap[value]).filter(Boolean),
  )}.`;

  sentences.push(withObservation("speech", speechText));

  const moodText =
    {
      euthymic: "euthymic",
      anxious: "anxious",
      depressed: "depressed",
      irritable: "irritable",
      dysphoric: "dysphoric",
      euphoric: "euphoric",
      other: "otherwise notable",
    }[mood] || "otherwise notable";

  const affectMap = {
    congruentFull: "congruent and full-range",
    restricted: "restricted",
    blunted: "blunted",
    flat: "flat",
    labile: "labile",
    incongruent: "incongruent",
    tearful: "tearful",
    other: "otherwise notable",
  };

  const affectText = listText(affect.map((value) => affectMap[value]).filter(Boolean));

  sentences.push(
    withObservation(
      "affect",
      otherSentence("mood")
        ? `${otherSentence("mood")} Affect was ${affectText}.`
        : `Mood was ${moodText}, with ${affectText} affect.`,
    ),
  );

  const processMap = {
    linear: "linear and goal-directed",
    circumstantial: "circumstantial",
    tangential: "tangential",
    perseverative: "perseverative",
    flight: "notable for flight of ideas",
    blocking: "notable for intermittent thought blocking",
    disorganized: "disorganized",
    other: "otherwise notable",
  };

  const contentMap = {
    unremarkable: "unremarkable",
    ruminative: "ruminative",
    preoccupied: "preoccupied",
    obsessional: "obsessional",
    paranoid: "notable for paranoid ideation",
    delusional: "notable for delusional beliefs",
    other: "otherwise notable",
  };

  const processText = listText(thoughtProcess.map((value) => processMap[value]).filter(Boolean));

  const contentText = `${listText(
    thoughtContent.map((value) => contentMap[value]).filter(Boolean),
  )}`;

  sentences.push(
    withObservation(
      "thoughtProcess",
      withObservation(
        "thoughtContent",
        `Thought processes were ${processText}; thought content was ${contentText}.`,
      ),
    ),
  );

  const perceptionText =
    {
      none: "No perceptual disturbances were observed or reported.",
      internalStimuli: "The client appeared to respond to internal stimuli.",
      auditory: "The client reported auditory hallucinations.",
      visual: "The client reported visual hallucinations.",
      command: "The client reported command hallucinations.",
      unclear: "Perceptual disturbance was unclear and requires further assessment.",
      other: "Perception was otherwise notable.",
    }[perception] || "Perception was otherwise notable.";

  sentences.push(withObservation("perception", perceptionText));

  sentences.push(getOrientationSentence());

  const attentionText =
    {
      intact: "Attention, concentration, and memory appeared grossly intact.",
      mild: "Attention, concentration, and/or memory appeared mildly impaired.",
      moderate: "Attention, concentration, and/or memory appeared moderately impaired.",
      severe: "Attention, concentration, and/or memory appeared severely impaired.",
      other: "Attention, concentration, and/or memory were otherwise notable.",
    }[attentionMemory] || "Attention, concentration, and/or memory were otherwise notable.";

  sentences.push(withObservation("attentionMemory", attentionText));

  const insightText =
    {
      good: "good",
      fair: "fair",
      limited: "limited",
      poor: "poor",
      mixed: "mixed or variable",
      other: "otherwise notable",
    }[insight] || "otherwise notable";

  const judgmentText =
    {
      good: "good",
      fair: "fair",
      limited: "limited",
      poor: "poor",
      mixed: "mixed or variable",
      other: "otherwise notable",
    }[judgment] || "otherwise notable";

  const impulseText =
    {
      intact: "intact",
      fair: "fair",
      limited: "limited",
      poor: "poor",
      other: "otherwise notable",
    }[impulse] || "otherwise notable";

  const insightJudgmentSentence =
    insight === judgment
      ? `Insight and judgment were ${insightText}, and impulse control was ${impulseText}.`
      : `Insight was ${insightText}, judgment was ${judgmentText}, and impulse control was ${impulseText}.`;

  sentences.push(
    withObservation(
      "insight",
      withObservation("judgment", withObservation("impulse", insightJudgmentSentence)),
    ),
  );

  const sibText =
    {
      denied: "denied current self-injury urges or behavior",
      urges: "reported current self-injury urges without recent behavior",
      recent: "reported recent self-injurious behavior",
      history: "reported a history of self-injury without current urges or behavior",
      other: "reported otherwise notable self-injury concerns",
    }[sib] || "reported otherwise notable self-injury concerns";

  const siText =
    {
      denied: "denied current suicidal ideation",
      passive: "reported passive suicidal ideation",
      activeNoIntent: "reported active suicidal ideation without intent",
      activeIntent: "reported active suicidal ideation with intent",
      other: "reported otherwise notable suicidal ideation",
    }[si] || "reported otherwise notable suicidal ideation";

  const hiText =
    {
      denied: "denied homicidal ideation",
      passive: "reported passive homicidal ideation",
      active: "reported active homicidal ideation",
      other: "reported otherwise notable homicidal ideation",
    }[hi] || "reported otherwise notable homicidal ideation";

  const safetyParts = [
    ["sib", sibText],
    ["si", siText],
    ["hi", hiText],
  ];
  const safetySentence = safetyParts
    .map(([id, text]) => otherSentence(id) || `The client ${text}.`)
    .join(" ");

  sentences.push(
    withObservation("sib", withObservation("si", withObservation("hi", safetySentence))),
  );

  return sentences.join(" ");
}

// Expanded wording is for grouped output only: button labels, teaching text, and
// narrative wording remain independent. Unlisted choices keep their existing sentence.
const mseListWording = {
  appearance: {
    appropriate: "Appearance appropriate in grooming and attire for the session.",
    disheveled: "Appearance disheveled in grooming or attire during the session.",
    poorHygiene: "Appearance notable for signs of poor personal hygiene.",
  },
  behavior: {
    cooperative: "Behavior cooperative and receptive to therapeutic interaction.",
    guarded: "Behavior guarded in engagement with the interview.",
    withdrawn: "Behavior withdrawn, with limited interpersonal engagement.",
    restless: "Behavior restless during the interaction.",
    agitated: "Behavior agitated during the interaction.",
  },
  eyeContact: {
    appropriate: "Eye contact appropriate to the interaction.",
    limited: "Eye contact limited during the interaction.",
    avoidant: "Eye contact avoidant during interpersonal engagement.",
    intense: "Eye contact notable for an intense gaze during the interaction.",
    variable: "Eye contact variable over the course of the interaction.",
  },
  mood: {
    euthymic: "Mood euthymic at the time of the session.",
    anxious: "Mood anxious at the time of the session.",
    depressed: "Mood depressed at the time of the session.",
    irritable: "Mood irritable at the time of the session.",
    dysphoric: "Mood dysphoric at the time of the session.",
    euphoric: "Mood euphoric at the time of the session.",
  },
  affect: {
    congruentFull: "Affect full in range and congruent with the client's stated mood.",
    restricted: "Affect restricted in the range of emotional expression observed.",
    blunted: "Affect blunted, with reduced intensity of emotional expression.",
    flat: "Affect flat, with minimal observable emotional expression.",
    labile: "Affect labile, with shifts in emotional expression during the session.",
    incongruent: "Affect incongruent with the client's stated mood.",
    tearful: "Affect notable for tearfulness during the session.",
  },
  thoughtProcess: {
    linear: "Thought process linear and organized toward the topic or goal of discussion.",
    circumstantial:
      "Thought process circumstantial, with additional detail before returning to the main point.",
    tangential:
      "Thought process tangential, with responses moving away from the original question.",
    perseverative:
      "Thought process perseverative, with repeated return to the same ideas or themes.",
    disorganized:
      "Thought process disorganized, with difficulty following the connections between ideas.",
  },
  thoughtContent: {
    unremarkable:
      "Thought content unremarkable, with no unusual content elicited during the interview.",
    ruminative:
      "Thought content ruminative, with repetitive focus on concerns or distressing themes.",
    preoccupied: "Thought content notable for preoccupation with particular concerns or themes.",
  },
  perception: {
    none: "No perceptual disturbances were observed or reported during the session.",
  },
  attentionMemory: {
    intact: "Attention, concentration, and memory grossly intact in the context of the interview.",
  },
  insight: {
    good: "Insight good regarding the concerns discussed during the session.",
    fair: "Insight fair regarding the concerns discussed during the session.",
    limited: "Insight limited regarding the concerns discussed during the session.",
    poor: "Insight poor regarding the concerns discussed during the session.",
    mixed: "Insight mixed or variable across the concerns discussed.",
  },
  judgment: {
    good: "Judgment good in the situations explored during the interview.",
    fair: "Judgment fair in the situations explored during the interview.",
    limited: "Judgment limited in the situations explored during the interview.",
    poor: "Judgment poor in the situations explored during the interview.",
    mixed: "Judgment mixed or variable across the situations discussed.",
  },
  impulse: {
    intact: "Impulse control intact as observed during the session.",
    fair: "Impulse control fair as observed during the session.",
    limited: "Impulse control limited as observed during the session.",
    poor: "Impulse control poor as observed during the session.",
  },
};

// Turn the existing choice sentences into fuller prose. Multi-select domains share
// one subject rather than repeating "Speech was..." for every selected descriptor.
function sectionListSentence(section) {
  if (mseOtherHints[section.id] && otherSentence(section.id)) return otherSentence(section.id);
  if (section.type === "orientation") return getOrientationSentence();
  const subjectById = {
    appearance: "Appearance",
    behavior: "Behavior",
    eyeContact: "Eye contact",
    speech: "Speech",
    mood: "Mood",
    affect: "Affect",
    thoughtProcess: "Thought process",
    thoughtContent: "Thought content",
    attentionMemory: "Attention, concentration, and(?:/or)? memory",
    insight: "Insight",
    judgment: "Judgment",
    impulse: "Impulse control",
    perception: "Perception",
    sib: "Self-injury status",
    si: "Suicidal ideation",
    hi: "Homicidal ideation",
  };
  const choices = getSelectedValues(section.id).map((value) =>
    section.options.find((item) => item.value === value),
  );
  const sentences = choices.map(
    (item) => mseListWording[section.id]?.[item.value] || item.sentence,
  );
  const subject = subjectById[section.id];
  if (subject) {
    const prefix = new RegExp(`^(${subject}) `);
    const matched = sentences[0].match(prefix);
    if (matched) {
      const phrases = sentences.map((text) => text.replace(prefix, "").replace(/[.!?]$/, ""));
      const verb = section.id === "attentionMemory" ? "were" : "was";
      return `${matched[1]} ${verb} ${listText(phrases)}.`;
    }
  }
  return sentences
    .map((text) =>
      text
        .replace(/\bSIB\b/g, "self-injury")
        .replace(/\bSI\b/g, "suicidal ideation")
        .replace(/\bHI\b/g, "homicidal ideation")
        .replace(/^(Denied|Reported) /, (_, verb) => `Client ${verb.toLowerCase()} `),
    )
    .join(" ");
}

// Plain ASCII hyphens and blank lines keep the list easy to paste into note systems.
function buildListOutput() {
  return mseCategories
    .map((category) => {
      const rows = category.sections.map((id) => {
        const section = mseSections.find((item) => item.id === id);
        const context = getContext(id);
        let sentence = sectionListSentence(section);
        if (context.phrase) sentence = `${sentence.replace(/[.!?]$/, "")}; ${context.phrase}.`;
        return `- ${[sentence, context.statement, context.observations, context.note, getObservation(section)].filter(Boolean).join(" ")}`;
      });
      return `${category.title}\n${rows.join("\n")}`;
    })
    .join("\n\n");
}

// Both formats use the same selections and context; the output box and copy controls stay shared.
function generateMSE() {
  updateContextObservations();
  updateObservationHints();
  const style = getOutputStyle();

  if (style === "narrative") {
    Workbench.writeOutput(buildNarrativeOutput());
    return;
  }

  Workbench.writeOutput(buildListOutput());
}

// Change only placeholder text when selections change. Preserve anything the
// clinician has typed, and never copy example text into the output.
function updateObservationHints() {
  mseSections.forEach((section) => {
    const field = document.getElementById(`${section.id}-observation`);
    if (!field) return;
    const hints = mseObservationHints[section.id] || {};
    const specific = getSelectedValues(section.id)
      .map((value) => hints[value])
      .filter(Boolean);
    const fallback =
      mseContextNoteExamples[section.id] || mseOtherHints[section.id]?.split(" / ") || [];
    const examples = [...new Set([...specific, ...fallback])].slice(0, 3);
    field.placeholder = examples.length
      ? `Ex.: ${examples.map((text) => text.replace(/\.$/, "")).join(" / ")}`
      : "";
  });
}

/* Reset every section to the defined normal value. */
function resetToNormal() {
  Workbench.resetReview();
  document.querySelectorAll(".other-text").forEach((field) => {
    field.value = "";
  });
  document.querySelectorAll(".other-entry").forEach((entry) => {
    entry.hidden = true;
  });
  // Clear context as well as findings so a previous client's baseline is not retained.
  document.querySelectorAll(".context-note").forEach((field) => {
    field.value = "";
  });
  document.querySelectorAll(".context-select, .context-source").forEach((field) => {
    field.checked = field.value === "";
  });
  document.querySelectorAll(".context-source-group").forEach((field) => {
    field.disabled = true;
  });
  document.querySelectorAll(".context-observation").forEach((field) => {
    field.checked = false;
  });
  document.querySelectorAll(".context-panel").forEach((panel) => {
    panel.open = false;
    panel.querySelector("summary").textContent = "Context / baseline";
  });
  mseSections.forEach((section) => {
    if (section.multiple) {
      const card = document.querySelector(`[data-section="${section.id}"]`);
      if (card) card.dataset.values = "";
    }

    if (section.type === "orientation") {
      section.domains.forEach((domain) => {
        selectOrientation(domain.id, "oriented", false);
      });
    } else {
      selectOption(section.id, section.normal, false);
    }
  });

  document.querySelectorAll(".observation-text").forEach((field) => {
    field.value = "";
  });

  document.querySelectorAll(".observation-box").forEach((box) => {
    box.classList.remove("open");
  });

  document.querySelectorAll(".tiny-button[aria-controls]").forEach((button) => {
    button.setAttribute("aria-expanded", "false");
    button.textContent = "+ Add observation";
  });
  generateMSE();
}

/* Show or hide one optional observation box. */
function toggleObservation(sectionId) {
  const box = document.getElementById(`${sectionId}-observation-box`);
  const open = box.classList.toggle("open");
  const button = document.querySelector(`[aria-controls="${sectionId}-observation-box"]`);
  button.setAttribute("aria-expanded", String(open));
  button.textContent = open ? "− Hide observation" : "+ Add observation";
}

/* Learn keeps expandable teaching panels; Compact hides them and tightens layout. */
function setMode() {
  const mode = document.querySelector('input[name="mode"]:checked').value;

  document.body.classList.toggle("compact-mode", mode === "compact");
}

/* Keep the shared action in sync with individually opened teaching panels.
 * A mixed state offers Open all; once every panel is open, it offers Close all.
 */
function syncAllInfoButton() {
  const panels = [...document.querySelectorAll(".more-info")];
  const allOpen = panels.length > 0 && panels.every((panel) => panel.open);
  const button = document.getElementById("toggle-all-info");
  button.textContent = allOpen ? "Close all info" : "Open all info";
  button.setAttribute("aria-expanded", String(allOpen));
}

function toggleAllInfo() {
  const panels = [...document.querySelectorAll(".more-info")];
  const open = !panels.every((panel) => panel.open);
  panels.forEach((panel) => {
    panel.open = open;
  });
  syncAllInfoButton();
}

/* Update output when format or mode changes. */
document.querySelectorAll('input[name="outputStyle"]').forEach((input) => {
  input.addEventListener("change", generateMSE);
});

document.querySelectorAll('input[name="mode"]').forEach((input) => {
  input.addEventListener("change", setMode);
});

Workbench.initReview();

/* Initial page setup. */
renderSections();
document.querySelectorAll(".more-info").forEach((panel) => {
  panel.addEventListener("toggle", syncAllInfoButton);
});
syncAllInfoButton();
resetToNormal();
setMode();

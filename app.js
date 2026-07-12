/**
 * MSE APPLICATION LOGIC
 * ------------------------------------------------------------
 * This file controls the interface and generated output.
 * Clinical wording belongs in mse-data.js.
 */

/* Build the page from the sections defined in mse-data.js. */
function renderSections() {
  const container = document.getElementById("mse-fields");
  container.innerHTML = "";

  mseSections.forEach(section => {
    const card = document.createElement("section");
    card.className = "card mse-section";
    card.dataset.section = section.id;

    card.innerHTML = `
      <div class="section-header">
        <h2>${section.title}</h2>
        ${section.observation
          ? `<button type="button" class="tiny-button" onclick="toggleObservation('${section.id}')">+ Add observation</button>`
          : ""}
      </div>

      <div class="control-area"></div>

      ${section.observation
        ? `
          <div class="observation-box" id="${section.id}-observation-box">
            <label for="${section.id}-observation">Additional observation:</label>
            <textarea
              id="${section.id}-observation"
              class="observation-text"
              placeholder="Optional extra wording for this section."
            ></textarea>
          </div>
        `
        : ""}

      <details class="more-info">
        <summary>More information</summary>
        <div class="info-content">${moreInfoHTML(section)}</div>
      </details>
    `;

    container.appendChild(card);

    const controlArea = card.querySelector(".control-area");

    if (section.type === "orientation") {
      renderOrientation(section, controlArea);
    } else {
      renderSingleChoice(section, controlArea);
    }

    const observation = document.getElementById(`${section.id}-observation`);
    if (observation) {
      observation.addEventListener("input", generateMSE);
    }
  });
}

/* Render the standard button choices used by most sections. */
function renderSingleChoice(section, controlArea) {
  const group = document.createElement("div");
  group.className = section.multiple
    ? "segmented-options multi-select-options"
    : "segmented-options";
  group.setAttribute("role", "group");
  group.setAttribute("aria-label", section.title);

  section.options.forEach(choice => {
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

  section.domains.forEach(domain => {
    const row = document.createElement("div");
    row.className = "orientation-row";
    row.dataset.domain = domain.id;
    row.dataset.value = "oriented";

    row.innerHTML = `
      <span class="orientation-label">${domain.label}</span>
      <button type="button" class="segment-button small selected" data-value="oriented">Oriented</button>
      <button type="button" class="segment-button small" data-value="disoriented">Disoriented</button>
    `;

    row.querySelectorAll("button").forEach(button => {
      button.addEventListener("click", () => {
        selectOrientation(domain.id, button.dataset.value);
      });
    });

    grid.appendChild(row);
  });

  controlArea.appendChild(grid);
}

/* Build the optional learning/reference panel. */
/**
 * Build one compact information panel.
 *
 * The panel has only three possible parts:
 *   - short explanations of useful options
 *   - Ask yourself
 *   - Notes
 *
 * Comparisons are folded into ordinary note sentences rather than
 * displayed as separate comparison cards or subheadings.
 */
function moreInfoHTML(section) {
  const info = section.info || {};
  const pieces = [];

  const choices = section.type === "orientation"
    ? section.domains.map(domain => ({ value: domain.id, label: domain.label }))
    : section.options;

  const explanations = choices
    .map(choice => {
      const explanation = optionHelp[section.id]?.[choice.value];
      return explanation
        ? `<p><strong>${choice.label}:</strong> ${explanation}</p>`
        : "";
    })
    .filter(Boolean)
    .join("");

  if (explanations) {
    pieces.push(`<div class="option-explanations">${explanations}</div>`);
  }

  if (info.questions?.length) {
    pieces.push(`
      <div class="question-block">
        <span class="info-label">Ask yourself:</span>
        <ul class="question-list">
          ${info.questions.map(question => `<li>${question}</li>`).join("")}
        </ul>
      </div>
    `);
  }

  const notes = [];

  if (info.comparisons?.length) {
    info.comparisons.forEach(group => {
      const entries = group.items || [];

      if (entries.length === 1) {
        notes.push(`<p><strong>${entries[0].term}:</strong> ${entries[0].text}</p>`);
      }

      if (entries.length === 2) {
        notes.push(
          `<p><strong>${entries[0].term}:</strong> ${entries[0].text}<br>` +
          `<strong>${entries[1].term}:</strong> ${entries[1].text}</p>`
        );
      }

      if (entries.length > 2) {
        const sentence = entries
          .map(entry => `<strong>${entry.term}:</strong> ${entry.text}`)
          .join("<br>");
        notes.push(`<p>${sentence}</p>`);
      }
    });
  }

  if (info.notes?.length) {
    notes.push(...info.notes.map(note => `<p>${note}</p>`));
  }

  if (notes.length) {
    pieces.push(`
      <div class="notes-block">
        <span class="info-label">Notes:</span>
        ${notes.join("")}
      </div>
    `);
  }

  return pieces.join("");
}

/* Lowercase the first character so definitions flow inside a sentence. */
function lowerFirst(text) {
  if (!text) return "";
  return text.charAt(0).toLowerCase() + text.slice(1);
}

/* Store one selected value for a standard section. */
function selectOption(sectionId, value) {
  const section = mseSections.find(item => item.id === sectionId);
  const card = document.querySelector(`[data-section="${sectionId}"]`);

  if (section?.multiple) {
    const current = new Set(
      (card.dataset.values || section.normal)
        .split(",")
        .filter(Boolean)
    );

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

    card.querySelectorAll(".segment-button").forEach(button => {
      button.classList.toggle("selected", current.has(button.dataset.value));
    });
  } else {
    card.dataset.value = value;

    card.querySelectorAll(".segment-button").forEach(button => {
      button.classList.toggle("selected", button.dataset.value === value);
    });
  }

  generateMSE();
}

/* Store one selected value for an orientation domain. */
function selectOrientation(domainId, value) {
  const row = document.querySelector(`.orientation-row[data-domain="${domainId}"]`);
  row.dataset.value = value;

  row.querySelectorAll(".segment-button").forEach(button => {
    button.classList.toggle("selected", button.dataset.value === value);
  });

  generateMSE();
}

/* Look up the selected option object for a section. */
function getSelected(section) {
  const values = getSelectedValues(section.id);

  if (section.multiple) {
    return {
      label: values
        .map(value => section.options.find(choice => choice.value === value)?.label)
        .filter(Boolean)
        .join(", ")
    };
  }

  return section.options.find(choice => choice.value === values[0]);
}

/* Return every selected value for a section, including multi-select sections. */
function getSelectedValues(sectionId) {
  const section = mseSections.find(item => item.id === sectionId);
  if (!section || section.type === "orientation") return [];

  const card = document.querySelector(`[data-section="${sectionId}"]`);

  if (section.multiple) {
    return (card?.dataset.values || section.normal)
      .split(",")
      .filter(Boolean);
  }

  return [card?.dataset.value || section.normal];
}

/* Convert orientation domain selections into a natural sentence. */
function getOrientationSentence() {
  const domains = [
    ["person", "person"],
    ["place", "place"],
    ["time", "time"],
    ["situation", "situation"]
  ];

  const oriented = [];
  const disoriented = [];

  domains.forEach(([id, label]) => {
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

/* Short label used by List output. */
function getOrientationLabel() {
  const domains = [
    ["person", "Person"],
    ["place", "Place"],
    ["time", "Time"],
    ["situation", "Situation"]
  ];

  const disoriented = [];

  domains.forEach(([id, label]) => {
    const row = document.querySelector(`.orientation-row[data-domain="${id}"]`);
    const value = row?.dataset.value || "oriented";

    if (value === "disoriented") {
      disoriented.push(label);
    }
  });

  return disoriented.length === 0
    ? "Oriented x4"
    : `Disoriented to ${listText(disoriented)}`;
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
  const section = mseSections.find(item => item.id === sectionId);
  const observation = section ? getObservation(section) : "";

  return observation ? `${sentence} ${observation}` : sentence;
}

/**
 * Build a smoother clinical narrative instead of simply concatenating
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

  const appearanceMap = {
    appropriate: "appropriate grooming and attire",
    disheveled: "a disheveled appearance",
    poorHygiene: "poor hygiene",
    inappropriate: "attire inappropriate for the setting or weather",
    other: "an otherwise notable appearance"
  };

  const behaviorMap = {
    cooperative: "cooperative and appropriately engaged",
    guarded: "guarded",
    withdrawn: "withdrawn",
    restless: "restless",
    agitated: "agitated",
    other: "otherwise notable in behavior"
  };

  const appearanceText = listText(
    appearance.map(value => appearanceMap[value]).filter(Boolean)
  );

  const behaviorText = listText(
    behavior.map(value => behaviorMap[value]).filter(Boolean)
  );

  sentences.push(
    withObservation(
      "appearance",
      withObservation(
        "behavior",
        `The client presented with ${appearanceText} and was ${behaviorText} throughout the interview.`
      )
    )
  );

  const eyeContactText = {
    appropriate: "Eye contact was appropriate.",
    limited: "Eye contact was limited.",
    avoidant: "Eye contact was avoidant.",
    intense: "Eye contact was intense.",
    variable: "Eye contact was variable."
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
    other: "otherwise notable"
  };

  const speechText = `Speech was ${listText(
    speech.map(value => speechMap[value]).filter(Boolean)
  )}.`;

  sentences.push(withObservation("speech", speechText));

  const moodText = {
    euthymic: "euthymic",
    anxious: "anxious",
    depressed: "depressed",
    irritable: "irritable",
    dysphoric: "dysphoric",
    euphoric: "euphoric",
    other: "otherwise notable"
  }[mood] || "otherwise notable";

  const affectMap = {
    congruentFull: "congruent and full-range",
    restricted: "restricted",
    blunted: "blunted",
    flat: "flat",
    labile: "labile",
    incongruent: "incongruent",
    tearful: "tearful",
    other: "otherwise notable"
  };

  const affectText = listText(
    affect.map(value => affectMap[value]).filter(Boolean)
  );

  sentences.push(
    withObservation(
      "affect",
      `Mood was ${moodText}, with ${affectText} affect.`
    )
  );

  const processMap = {
    linear: "linear and goal-directed",
    circumstantial: "circumstantial",
    tangential: "tangential",
    perseverative: "perseverative",
    flight: "notable for flight of ideas",
    blocking: "notable for intermittent thought blocking",
    disorganized: "disorganized",
    other: "otherwise notable"
  };

  const contentMap = {
    unremarkable: "unremarkable",
    ruminative: "ruminative",
    preoccupied: "preoccupied",
    obsessional: "obsessional",
    paranoid: "notable for paranoid ideation",
    delusional: "notable for delusional beliefs",
    other: "otherwise notable"
  };

  const processText = listText(
    thoughtProcess.map(value => processMap[value]).filter(Boolean)
  );

  const contentText = `${listText(
    thoughtContent.map(value => contentMap[value]).filter(Boolean)
  )} thought content`;

  sentences.push(
    withObservation(
      "thoughtProcess",
      withObservation(
        "thoughtContent",
        `Thought processes were ${processText}, with ${contentText}.`
      )
    )
  );

  const perceptionText = {
    none: "No perceptual disturbances were observed or reported.",
    internalStimuli: "The client appeared to respond to internal stimuli.",
    auditory: "The client reported auditory hallucinations.",
    visual: "The client reported visual hallucinations.",
    command: "The client reported command hallucinations.",
    unclear: "Perceptual disturbance was unclear and requires further assessment.",
    other: "Perception was otherwise notable."
  }[perception] || "Perception was otherwise notable.";

  sentences.push(withObservation("perception", perceptionText));

  sentences.push(getOrientationSentence());

  const attentionText = {
    intact: "Attention, concentration, and memory appeared grossly intact.",
    mild: "Attention, concentration, and/or memory appeared mildly impaired.",
    moderate: "Attention, concentration, and/or memory appeared moderately impaired.",
    severe: "Attention, concentration, and/or memory appeared severely impaired.",
    other: "Attention, concentration, and/or memory were otherwise notable."
  }[attentionMemory] || "Attention, concentration, and/or memory were otherwise notable.";

  sentences.push(withObservation("attentionMemory", attentionText));

  const insightText = {
    good: "good",
    fair: "fair",
    limited: "limited",
    poor: "poor",
    mixed: "mixed or variable",
    other: "otherwise notable"
  }[insight] || "otherwise notable";

  const judgmentText = {
    good: "good",
    fair: "fair",
    limited: "limited",
    poor: "poor",
    mixed: "mixed or variable",
    other: "otherwise notable"
  }[judgment] || "otherwise notable";

  const impulseText = {
    intact: "intact",
    fair: "fair",
    limited: "limited",
    poor: "poor",
    other: "otherwise notable"
  }[impulse] || "otherwise notable";

  const insightJudgmentSentence = insight === judgment
    ? `Insight and judgment were ${insightText}, and impulse control was ${impulseText}.`
    : `Insight was ${insightText}, judgment was ${judgmentText}, and impulse control was ${impulseText}.`;

  sentences.push(
    withObservation(
      "insight",
      withObservation(
        "judgment",
        withObservation("impulse", insightJudgmentSentence)
      )
    )
  );

  const sibText = {
    denied: "denied current self-injury urges or behavior",
    urges: "reported current self-injury urges without recent behavior",
    recent: "reported recent self-injurious behavior",
    history: "reported a history of self-injury without current urges or behavior",
    other: "reported otherwise notable self-injury concerns"
  }[sib] || "reported otherwise notable self-injury concerns";

  const siText = {
    denied: "denied current suicidal ideation",
    passive: "reported passive suicidal ideation",
    activeNoIntent: "reported active suicidal ideation without intent",
    activeIntent: "reported active suicidal ideation with intent",
    other: "reported otherwise notable suicidal ideation"
  }[si] || "reported otherwise notable suicidal ideation";

  const hiText = {
    denied: "denied homicidal ideation",
    passive: "reported passive homicidal ideation",
    active: "reported active homicidal ideation",
    other: "reported otherwise notable homicidal ideation"
  }[hi] || "reported otherwise notable homicidal ideation";

  const safetySentence = `The client ${listText([sibText, siText, hiText])}.`;

  sentences.push(
    withObservation(
      "sib",
      withObservation(
        "si",
        withObservation("hi", safetySentence)
      )
    )
  );

  return sentences.join(" ");
}

function generateMSE() {
  const style = getOutputStyle();

  if (style === "narrative") {
    document.getElementById("output").value = buildNarrativeOutput();
    return;
  }

  const rows = mseSections.map(section => {
    if (section.type === "orientation") {
      return {
        title: section.title,
        label: getOrientationLabel()
      };
    }

    const selected = getSelected(section);
    const observation = getObservation(section);
    const extra = observation ? ` — ${observation}` : "";

    return {
      title: section.title,
      label: `${selected.label}${extra}`
    };
  });

  document.getElementById("output").value =
    rows.map(row => `${row.title}: ${row.label}`).join("\n");
}

/* Reset every section to the defined normal value. */
function resetToNormal() {
  mseSections.forEach(section => {
    if (section.multiple) {
      const card = document.querySelector(`[data-section="${section.id}"]`);
      if (card) card.dataset.values = "";
    }

    if (section.type === "orientation") {
      section.domains.forEach(domain => {
        selectOrientation(domain.id, "oriented");
      });
    } else {
      selectOption(section.id, section.normal);
    }
  });

  document.querySelectorAll(".observation-text").forEach(field => {
    field.value = "";
  });

  document.querySelectorAll(".observation-box").forEach(box => {
    box.classList.remove("open");
  });

  generateMSE();
}

/* Show or hide one optional observation box. */
function toggleObservation(sectionId) {
  const box = document.getElementById(`${sectionId}-observation-box`);
  box.classList.toggle("open");
}

/* Copy the generated note to the clipboard. */
async function copyOutput() {
  const output = document.getElementById("output");
  const status = document.getElementById("copyStatus");

  try {
    await navigator.clipboard.writeText(output.value);
    status.textContent = "Copied!";
  } catch {
    selectOutput();
    status.textContent = "Selected — press Cmd/Ctrl+C.";
  }

  window.setTimeout(() => {
    status.textContent = "";
  }, 1600);
}

/* Select the output text manually. */
function selectOutput() {
  const output = document.getElementById("output");
  output.focus();
  output.select();
}

/* Learn shows info; Document hides info; Compact also tightens layout. */
function setMode() {
  const mode = document.querySelector('input[name="mode"]:checked').value;

  document.body.classList.toggle("document-mode", mode === "document");
  document.body.classList.toggle("compact-mode", mode === "compact");
}

/* Expand or collapse every More information panel. */
function toggleAllInfo(open) {
  document.querySelectorAll(".more-info").forEach(panel => {
    panel.open = open;
  });
}

/* Update output when format or mode changes. */
document.querySelectorAll('input[name="outputStyle"]').forEach(input => {
  input.addEventListener("change", generateMSE);
});

document.querySelectorAll('input[name="mode"]').forEach(input => {
  input.addEventListener("change", setMode);
});

/* Initial page setup. */
renderSections();
resetToNormal();
setMode();

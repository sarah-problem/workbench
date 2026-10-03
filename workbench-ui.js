/** Shared documentation controls. Answers stay in memory; nothing is saved. */
const Workbench = (() => {
  let reviewPanel, reviewButton;
  let reviewed = false;
  let pendingOutput = "";
  let copyTimer;
  let validateReview = () => "";
  const output = () => document.querySelector("[data-note-output]");
  const status = () => document.querySelector("[data-copy-status]");

  // Tools prepare notes separately from displaying them. Blank-start questionnaires
  // can provide a completeness check; other tools retain their existing review flow.
  function initReview({ validate = () => "" } = {}) {
    validateReview = validate;
    reviewPanel = document.createElement("div");
    reviewPanel.className = "preset-review";
    reviewPanel.innerHTML = '<button type="button">Create documentation</button>';
    reviewButton = reviewPanel.querySelector("button");
    // DOM order matches the visual order for keyboard and screen-reader navigation.
    const row = document.querySelector(".output-style-row");
    row.insertBefore(reviewPanel, row.querySelector(".output-copy-actions"));
    reviewButton.addEventListener("click", () => {
      if (!numbersAreValid(true)) return;
      const incomplete = validateReview();
      if (incomplete) {
        if (status()) status().textContent = incomplete;
        return;
      }
      reviewed = true;
      reviewPanel.hidden = true;
      reviewButton.hidden = true;
      output().value = pendingOutput;
    });
    // Capture runs before each tool updates its answer state and output.
    const invalidate = (event) => {
      const target = event.target;
      if (target.closest(".output-style-row") || ["mode", "outputStyle"].includes(target.name))
        return;
      if (event.type === "click" && !target.closest(".segment-button, [data-version]")) return;
      if (event.type !== "click" && !target.matches("input, textarea, select")) return;
      if (target === output()) return;
      resetReview();
    };
    ["input", "change", "click"].forEach((type) =>
      document.addEventListener(type, invalidate, true),
    );
    resetReview();
  }

  // An answer edit clears the displayed note but keeps the latest prepared text.
  // Input and change may both fire for one edit; neither should discard that text.
  function resetReview() {
    if (!reviewPanel) return;
    reviewed = false;
    reviewPanel.hidden = false;
    reviewButton.hidden = false;
    output().value = "";
    output().placeholder = "";
    if (status()) status().textContent = "";
  }

  // Native min/max/step rules are the single source of numerical validity.
  // Preserve the entered value so the user can correct it, rather than silently
  // changing a count or percentage behind the scenes. Disabled fields do not count.
  function numbersAreValid(showMessage = false) {
    const invalid = [...document.querySelectorAll('input[type="number"]')].find(
      (field) => !field.disabled && !field.validity.valid,
    );
    if (invalid && showMessage) invalid.reportValidity();
    return !invalid;
  }

  // Each app formats its own note; this helper controls when that note is visible.
  function writeOutput(text) {
    // Button-based choices expose the same selected state visually and to assistive technology.
    document
      .querySelectorAll(".segment-button, .output-style-button, [data-version]")
      .forEach((button) => {
        button.setAttribute("aria-pressed", String(button.classList.contains("selected")));
      });
    pendingOutput = text;
    const valid = numbersAreValid();
    output().value = valid && (!reviewPanel || reviewed) ? text : "";
    if (status()) status().textContent = valid ? "" : "Check the highlighted number fields.";
  }

  // Prefer the modern clipboard, then try selection-based copying and report failure honestly.
  async function copyOutput() {
    const field = output();
    const message = status();
    clearTimeout(copyTimer);
    if (!numbersAreValid(true)) {
      message.textContent = "Check the highlighted number fields.";
      return;
    }
    const incomplete = validateReview();
    if (incomplete) {
      message.textContent = incomplete;
      return;
    }
    if (!field.value.trim()) {
      message.textContent =
        reviewPanel && !reviewed ? "Create documentation first." : "No documentation to copy yet.";
      return;
    }
    let copied = false;
    try {
      await navigator.clipboard.writeText(field.value);
      copied = true;
    } catch {
      field.focus();
      field.select();
      try {
        copied = document.execCommand("copy");
      } catch {
        /* Keep manual selection. */
      }
    }
    message.textContent = copied ? "Copied" : "Selected — press Cmd/Ctrl+C.";
    if (copied)
      copyTimer = setTimeout(() => {
        message.textContent = "";
      }, 1800);
  }

  // Blank-start assessments allow a second activation to clear a radio answer.
  // Track changes too so arrow-key navigation, label clicks, and Space agree.
  // Delegation covers questionnaire controls rebuilt after Reset or version changes.
  if (document.body?.hasAttribute("data-clearable-answers")) {
    const selected = new Map();
    const isAnswer = (target) =>
      target.matches('input[type="radio"]') && target.name !== "outputStyle";
    const clearAnswer = (target) => {
      target.checked = false;
      selected.delete(target.name);
      target.dispatchEvent(new Event("input", { bubbles: true }));
      target.dispatchEvent(new Event("change", { bubbles: true }));
    };
    // Some browsers do not click an already checked radio on Space.
    document.addEventListener("keydown", (event) => {
      if (event.key !== " " || event.repeat || !isAnswer(event.target) || !event.target.checked)
        return;
      event.preventDefault();
      clearAnswer(event.target);
    });
    document.addEventListener(
      "click",
      (event) => {
        const target = event.target;
        if (target.closest("[data-reset-assessment]")) {
          selected.clear();
          return;
        }
        if (!isAnswer(target)) return;
        if (selected.get(target.name) === target) {
          // Clearing is a real answer edit: invalidate the note and update stored state.
          clearAnswer(target);
        } else {
          selected.set(target.name, target);
        }
      },
      true,
    );
    document.addEventListener("change", (event) => {
      const target = event.target;
      if (!isAnswer(target)) return;
      if (target.checked) selected.set(target.name, target);
      else selected.delete(target.name);
    });
  }

  document
    .querySelectorAll("[data-copy-output]")
    .forEach((button) => button.addEventListener("click", copyOutput));
  return { initReview, resetReview, writeOutput };
})();

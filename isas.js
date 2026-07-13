const BEHAVIORS = [
  "Cutting",
  "Severe scratching",
  "Biting",
  "Banging or hitting self",
  "Burning",
  "Interfering with wound healing",
  "Carving",
  "Rubbing skin against a rough surface",
  "Pinching",
  "Sticking self with needles",
  "Pulling hair",
  "Swallowing dangerous substances"
];

const FUNCTIONS = [
  {
    name: "Affect Regulation",
    items: [
      [1, "calming myself down"],
      [14, "releasing emotional pressure that has built up inside of me"],
      [27, "reducing anxiety, frustration, anger, or other overwhelming emotions"]
    ]
  },
  {
    name: "Interpersonal Boundaries",
    items: [
      [2, "creating a boundary between myself and others"],
      [15, "demonstrating that I am separate from other people"],
      [28, "establishing a barrier between myself and others"]
    ]
  },
  {
    name: "Self-Punishment",
    items: [
      [3, "punishing myself"],
      [16, "expressing anger towards myself for being worthless or stupid"],
      [29, "reacting to feeling unhappy with myself or disgusted with myself"]
    ]
  },
  {
    name: "Self-Care",
    items: [
      [4, "giving myself a way to care for myself by attending to the wound"],
      [17, "creating a physical injury that is easier to care for than my emotional distress"],
      [30, "allowing myself to focus on treating the injury, which can be gratifying or satisfying"]
    ]
  },
  {
    name: "Anti-Dissociation/Feeling-Generation",
    items: [
      [5, "causing pain so I will stop feeling numb"],
      [18, "trying to feel something, as opposed to nothing, even if it is physical pain"],
      [31, "making sure I am still alive when I do not feel real"]
    ]
  },
  {
    name: "Anti-Suicide",
    items: [
      [6, "avoiding the impulse to attempt suicide"],
      [19, "responding to suicidal thoughts without actually attempting suicide"],
      [32, "putting a stop to suicidal thoughts"]
    ]
  },
  {
    name: "Sensation-Seeking",
    items: [
      [7, "doing something to generate excitement or exhilaration"],
      [20, "entertaining myself or others by doing something extreme"],
      [33, "pushing my limits in a manner akin to skydiving or other extreme activities"]
    ]
  },
  {
    name: "Peer-Bonding",
    items: [
      [8, "bonding with peers"],
      [21, "fitting in with others"],
      [34, "creating a sign of friendship or kinship with friends or loved ones"]
    ]
  },
  {
    name: "Interpersonal Influence",
    items: [
      [9, "letting others know the extent of my emotional pain"],
      [22, "seeking care or help from others"],
      [35, "keeping a loved one from leaving or abandoning me"]
    ]
  },
  {
    name: "Toughness",
    items: [
      [10, "seeing if I can stand the pain"],
      [23, "demonstrating I am tough or strong"],
      [36, "proving I can take the physical pain"]
    ]
  },
  {
    name: "Marking Distress",
    items: [
      [11, "creating a physical sign that I feel awful"],
      [24, "proving to myself that my emotional pain is real"],
      [37, "signifying the emotional distress I am experiencing"]
    ]
  },
  {
    name: "Revenge",
    items: [
      [12, "getting back at someone"],
      [25, "getting revenge against others"],
      [38, "trying to hurt someone close to me"]
    ]
  },
  {
    name: "Autonomy",
    items: [
      [13, "ensuring that I am self-sufficient"],
      [26, "demonstrating that I do not need to rely on others for help"],
      [39, "establishing that I am autonomous or independent"]
    ]
  }
];

const RESPONSE_LABELS = ["Not relevant", "Somewhat relevant", "Very relevant"];

let behaviorCounts = Object.fromEntries(BEHAVIORS.map(name => [name, 0]));
let mainBehaviors = new Set();
let responses = Array(40).fill(0);
let choices = {
  pain: "Not documented",
  alone: "Not documented",
  delay: "Not documented",
  stop: "Not documented"
};

function renderBehaviors() {
  document.getElementById("behavior-grid").innerHTML = BEHAVIORS.map((name, index) => `
    <div class="behavior-row">
      <div class="behavior-name">${name}</div>
      <label>
        <span class="small-label">Lifetime count</span>
        <input type="number" min="0" step="1" value="${behaviorCounts[name]}" data-behavior-count="${index}">
      </label>
      <label class="main-check">
        <input type="checkbox" data-main-behavior="${index}" ${mainBehaviors.has(name) ? "checked" : ""}>
        <span>Main form</span>
      </label>
    </div>
  `).join("");

  document.querySelectorAll("[data-behavior-count]").forEach(input => {
    input.addEventListener("input", () => {
      const name = BEHAVIORS[Number(input.dataset.behaviorCount)];
      behaviorCounts[name] = Math.max(0, Number(input.value) || 0);
      updateAll();
    });
  });

  document.querySelectorAll("[data-main-behavior]").forEach(input => {
    input.addEventListener("change", () => {
      const name = BEHAVIORS[Number(input.dataset.mainBehavior)];
      if (input.checked) mainBehaviors.add(name);
      else mainBehaviors.delete(name);
      updateAll();
    });
  });
}

function orderedFunctionItems() {
  return FUNCTIONS
    .flatMap(group => group.items.map(([number, text]) => ({ number, text, functionName: group.name })))
    .sort((a, b) => a.number - b.number);
}

function renderFunctions() {
  document.getElementById("function-items").innerHTML = `
    <div class="function-list">
      ${orderedFunctionItems().map(({ number, text }) => `
        <div class="function-item">
          <div class="function-item-text"><span class="function-item-number">${number}.</span> When I self-harm, I am ${text}.</div>
          <div class="function-response">
            ${RESPONSE_LABELS.map((label, score) => `
              <label title="${label}">
                <input type="radio" name="item-${number}" value="${score}" ${responses[number] === score ? "checked" : ""}>
                <span>${score}</span>
              </label>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  `;

  document.querySelectorAll('#function-items input[type="radio"]').forEach(input => {
    input.addEventListener("change", () => {
      const number = Number(input.name.replace("item-", ""));
      responses[number] = Number(input.value);
      updateAll();
    });
  });
}

function scoreFor(group) {
  return group.items.reduce((sum, [number]) => sum + responses[number], 0);
}

function functionScores() {
  return FUNCTIONS.map(group => ({
    name: group.name,
    score: scoreFor(group),
    items: group.items
  }));
}

function totalFunctionScore() {
  return functionScores().reduce((sum, group) => sum + group.score, 0);
}

function lifetimeBehaviorTotal() {
  const standard = Object.values(behaviorCounts).reduce((sum, count) => sum + count, 0);
  const other = Math.max(0, Number(document.getElementById("other-behavior-count").value) || 0);
  return standard + other;
}

function behaviorSummary() {
  const entries = BEHAVIORS
    .filter(name => behaviorCounts[name] > 0)
    .map(name => ({ name, count: behaviorCounts[name], main: mainBehaviors.has(name) }));

  const otherName = document.getElementById("other-behavior-name").value.trim();
  const otherCount = Math.max(0, Number(document.getElementById("other-behavior-count").value) || 0);
  if (otherName && otherCount > 0) {
    entries.push({ name: otherName, count: otherCount, main: document.getElementById("other-behavior-main").checked });
  }
  return entries;
}

function updateFunctionResults() {
  const scores = functionScores();
  scores.forEach(group => {
    const domain = document.querySelector(`[data-domain-score="${CSS.escape(group.name)}"]`);
    if (domain) domain.textContent = `${group.score} / 6`;
  });

  const highest = Math.max(...scores.map(group => group.score));
  document.getElementById("total-display").textContent = `${totalFunctionScore()} / 78`;
  document.getElementById("highest-display").textContent = `${highest} / 6`;

  document.getElementById("function-scores").innerHTML = scores.map(group => `
    <div class="score-row score-${group.score}">
      <span class="score-name">${group.name}</span>
      <div class="score-track" aria-hidden="true"><div class="score-fill" style="width:${(group.score / 6) * 100}%"></div></div>
      <span class="score-value">${group.score} / 6</span>
    </div>
  `).join("");

  const ranked = [...scores].sort((a, b) => b.score - a.score || FUNCTIONS.findIndex(group => group.name === a.name) - FUNCTIONS.findIndex(group => group.name === b.name));
  const highestGroups = ranked.filter(group => group.score === highest);
  const shown = highest === 0 ? ranked.slice(0, 3) : ranked.filter(group => group.score > 0).slice(0, 5);

  document.getElementById("ranked-functions").innerHTML = highest === 0
    ? '<div class="ranked-function">No functions are currently endorsed.</div>'
    : shown.map((group, index) => {
        const endorsed = group.items
          .filter(([number]) => responses[number] > 0)
          .map(([number, text]) => `${number}: ${text} (${responses[number]})`);
        return `
          <div class="ranked-function">
            <strong>${index + 1}. ${group.name} — ${group.score}/6</strong>
            <p>${endorsed.join("; ")}</p>
          </div>
        `;
      }).join("");

  document.getElementById("suicide-function-alert").hidden = scoreFor(FUNCTIONS.find(group => group.name === "Anti-Suicide")) === 0;
}

function sentenceList(items) {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function dateText(value) {
  if (!value) return "not documented";
  const [year, month, day] = value.split("-");
  return `${month}/${day}/${year}`;
}

function summaryOutput() {
  const behaviors = behaviorSummary();
  const scores = [...functionScores()].sort((a, b) => b.score - a.score);
  const positiveScores = scores.filter(group => group.score > 0);
  const highest = positiveScores.slice(0, 3);

  let text = "ISAS completed.";

  if (behaviors.length === 0) {
    text += " No lifetime non-suicidal self-injury behaviors were entered.";
  } else {
    const main = behaviors.filter(item => item.main).map(item => item.name.toLowerCase());
    const behaviorText = behaviors.map(item => `${item.name.toLowerCase()} (${item.count} lifetime)`).join(", ");
    text += ` Endorsed behaviors included ${behaviorText}.`;
    if (main.length) text += ` Main form${main.length === 1 ? "" : "s"} identified: ${sentenceList(main)}.`;
  }

  const age = document.getElementById("age-first").value;
  const recent = document.getElementById("most-recent").value;
  if (age) text += ` Age at first self-injury was approximately ${age}.`;
  if (recent) text += ` Most recent self-injury was ${dateText(recent)}.`;

  if (choices.pain !== "Not documented") text += ` Physical pain during self-harm was reported as ${choices.pain.toLowerCase()}.`;
  if (choices.alone !== "Not documented") text += ` Being alone during self-harm was reported as ${choices.alone.toLowerCase()}.`;
  if (choices.delay !== "Not documented") text += ` Typical delay from urge to behavior was ${choices.delay.toLowerCase()}.`;
  if (choices.stop !== "Not documented") text += ` Desire to stop self-harming was reported as ${choices.stop.toLowerCase()}.`;

  text += ` Function total was ${totalFunctionScore()}/78.`;
  if (highest.length === 0) {
    text += " No self-injury functions were endorsed.";
  } else {
    text += ` Highest endorsed functions were ${sentenceList(highest.map(group => `${group.name} (${group.score}/6)`))}.`;
  }

  if (scoreFor(FUNCTIONS.find(group => group.name === "Anti-Suicide")) > 0) {
    text += " Anti-Suicide items were endorsed and require direct assessment of suicidal thoughts and behavior.";
  }

  return text;
}

function detailedOutput() {
  const lines = ["ISAS", "", "Section I: Behaviors", ""];
  const behaviors = behaviorSummary();

  if (behaviors.length === 0) {
    lines.push("No lifetime NSSI behaviors entered.");
  } else {
    behaviors.forEach(item => lines.push(`${item.name}: ${item.count} lifetime${item.main ? " — main form" : ""}`));
    lines.push(`Lifetime behavior total: ${lifetimeBehaviorTotal()}`);
  }

  lines.push("");
  lines.push(`Age first self-harmed: ${document.getElementById("age-first").value || "Not documented"}`);
  lines.push(`Most recent self-harm: ${dateText(document.getElementById("most-recent").value)}`);
  lines.push(`Physical pain: ${choices.pain}`);
  lines.push(`Usually alone: ${choices.alone}`);
  lines.push(`Urge-to-behavior delay: ${choices.delay}`);
  lines.push(`Wanted to stop: ${choices.stop}`);

  lines.push("", "Section II: Item Responses", "");
  orderedFunctionItems().forEach(({ number, text }) => {
    lines.push(`${number}. ${text}`);
    lines.push(`${RESPONSE_LABELS[responses[number]]} — ${responses[number]} ${responses[number] === 1 ? "point" : "points"}`);
  });

  lines.push("", "Function Scores", "");
  FUNCTIONS.forEach(group => lines.push(`${group.name}: ${scoreFor(group)} / 6`));
  lines.push("", `Function total: ${totalFunctionScore()} / 78`);

  const accurate = document.getElementById("more-accurate").value.trim();
  const suggested = document.getElementById("suggested-items").value.trim();
  if (accurate) lines.push("", `More accurate statements: ${accurate}`);
  if (suggested) lines.push("", `Suggested additional statements: ${suggested}`);

  if (scoreFor(FUNCTIONS.find(group => group.name === "Anti-Suicide")) > 0) {
    lines.push("", "Safety note: Anti-Suicide items were endorsed and require direct suicide-risk assessment.");
  }

  return lines.join("\n");
}

function updateOutput() {
  const style = document.querySelector('input[name="outputStyle"]:checked').value;
  document.getElementById("output").value = style === "summary" ? summaryOutput() : detailedOutput();
}

function updateAll() {
  document.getElementById("no-behavior-note").classList.toggle("hidden", lifetimeBehaviorTotal() > 0);
  updateFunctionResults();
  updateOutput();
}

function wireChoiceGroups() {
  document.querySelectorAll("[data-choice-group]").forEach(group => {
    group.querySelectorAll("button").forEach(button => {
      button.addEventListener("click", () => {
        const name = group.dataset.choiceGroup;
        choices[name] = button.dataset.value;
        group.querySelectorAll("button").forEach(item => item.classList.toggle("selected", item === button));
        updateAll();
      });
    });
  });
}

function wireInputs() {
  ["other-behavior-name", "other-behavior-count", "age-first", "most-recent", "more-accurate", "suggested-items"].forEach(id => {
    document.getElementById(id).addEventListener("input", updateAll);
  });
  document.getElementById("other-behavior-main").addEventListener("change", updateAll);
  document.querySelectorAll('input[name="outputStyle"]').forEach(input => input.addEventListener("change", updateOutput));
}

function resetAll() {
  behaviorCounts = Object.fromEntries(BEHAVIORS.map(name => [name, 0]));
  mainBehaviors = new Set();
  responses = Array(40).fill(0);
  choices = { pain: "Not documented", alone: "Not documented", delay: "Not documented", stop: "Not documented" };

  document.getElementById("other-behavior-name").value = "";
  document.getElementById("other-behavior-count").value = 0;
  document.getElementById("other-behavior-main").checked = false;
  document.getElementById("age-first").value = "";
  document.getElementById("most-recent").value = "";
  document.getElementById("more-accurate").value = "";
  document.getElementById("suggested-items").value = "";

  document.querySelectorAll("[data-choice-group]").forEach(group => {
    group.querySelectorAll("button").forEach(button => button.classList.toggle("selected", button.dataset.value === "Not documented"));
  });

  renderBehaviors();
  renderFunctions();
  updateAll();
}

document.getElementById("reset-button").addEventListener("click", resetAll);
document.getElementById("copy-button").addEventListener("click", async () => {
  await navigator.clipboard.writeText(document.getElementById("output").value);
  const status = document.getElementById("copy-status");
  status.textContent = "Copied";
  setTimeout(() => { status.textContent = ""; }, 1500);
});
document.getElementById("select-button").addEventListener("click", () => {
  const output = document.getElementById("output");
  output.focus();
  output.select();
});

renderBehaviors();
renderFunctions();
wireChoiceGroups();
wireInputs();
updateAll();

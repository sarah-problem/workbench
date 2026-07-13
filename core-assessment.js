const choice = labels => labels.map((label, index) => ({ label, value: index }));
const YES_NO = choice(["No", "Yes"]);
const RCADS_FREQ = choice(["Never", "Sometimes", "Often", "Always"]);
const DERS_FREQ = choice(["Almost never", "Sometimes", "About half the time", "Most of the time", "Almost always"])
  .map(option => ({ ...option, value: option.value + 1 }));
const CATQ_AGREE = choice(["Strongly disagree", "Disagree", "Somewhat disagree", "Neither", "Somewhat agree", "Agree", "Strongly agree"])
  .map(option => ({ ...option, value: option.value + 1 }));
const CATS_FREQ = choice(["Never", "Once in a while", "Half the time", "Almost always"]);
const PCL_FREQ = choice(["Not at all", "A little bit", "Moderately", "Quite a bit", "Extremely"]);

const question = (id, text, section, options, number = null, extra = {}) => ({ id, text, section, options, number, ...extra });
const sum = values => values.reduce((total, value) => total + Number(value || 0), 0);

function valueFor(config, answers, id) {
  return answers[config.questions.findIndex(item => item.id === id)];
}

function valuesFor(config, answers, ids, transform = value => value) {
  return ids.map(id => transform(valueFor(config, answers, id), id));
}

function incompleteResult(done, needed) {
  return {
    complete: false,
    score: `${done} / ${needed} required items answered`,
    result: "Incomplete",
    note: "Complete the required items before interpreting or documenting a score.",
    subscales: []
  };
}

const rcadsItems = [
  "I worry about things", "I feel sad or empty", "When I have a problem, I get a funny feeling in my stomach", "I worry when I think I have done poorly at something", "I would feel afraid of being on my own at home", "Nothing is much fun anymore", "I feel scared when I have to take a test", "I feel worried when I think someone is angry with me", "I worry about being away from my parents", "I get bothered by bad or silly thoughts or pictures in my mind", "I have trouble sleeping", "I worry that I will do badly at my school work", "I worry that something awful will happen to someone in my family", "I suddenly feel as if I can't breathe when there is no reason for this", "I have problems with my appetite", "I have to keep checking that I have done things right (like the switch is off, or the door is locked)", "I feel scared if I have to sleep on my own", "I have trouble going to school in the mornings because I feel nervous or afraid", "I have no energy for things", "I worry I might look foolish", "I am tired a lot", "I worry that bad things will happen to me", "I can't seem to get bad or silly thoughts out of my head", "When I have a problem, my heart beats really fast", "I cannot think clearly", "I suddenly start to tremble or shake when there is no reason for this", "I worry that something bad will happen to me", "When I have a problem, I feel shaky", "I feel worthless", "I worry about making mistakes", "I have to think of special thoughts (like numbers or words) to stop bad things from happening", "I worry what other people think of me", "I am afraid of being in crowded places (like shopping centers, the movies, buses, busy playgrounds)", "All of a sudden I feel really scared for no reason at all", "I worry about what is going to happen", "I suddenly become dizzy or faint when there is no reason for this", "I think about death", "I feel afraid if I have to talk in front of my class", "My heart suddenly starts to beat too quickly for no reason", "I feel like I don’t want to move", "I worry that I will suddenly get a scared feeling when there is nothing to be afraid of", "I have to do some things over and over again (like washing my hands, cleaning, or putting things in a certain order)", "I feel afraid that I will make a fool of myself in front of people", "I have to do some things in just the right way to stop bad things from happening", "I worry when I go to bed at night", "I would feel scared if I had to stay away from home overnight", "I feel restless"
];

const dersItems = [
  "I am clear about my feelings", "I pay attention to how I feel", "I experience my emotions as overwhelming and out of control", "I have no idea how I am feeling", "I have difficulty making sense out of my feelings", "I am attentive to my feelings", "I know exactly how I am feeling", "I care about what I am feeling", "I am confused about how I feel", "When I’m upset, I acknowledge my emotions", "When I’m upset, I become angry with myself for feeling that way", "When I’m upset, I become embarrassed for feeling that way", "When I’m upset, I have difficulty getting work done", "When I’m upset, I become out of control", "When I’m upset, I believe that I will remain that way for a long time", "When I’m upset, I believe that I’ll end up feeling very depressed", "When I’m upset, I believe that my feelings are valid and important", "When I’m upset, I have difficulty focusing on other things", "When I’m upset, I feel out of control", "When I’m upset, I can still get things done", "When I’m upset, I feel ashamed with myself for feeling that way", "When I’m upset, I know that I can find a way to eventually feel better", "When I’m upset, I feel like I am weak", "When I’m upset, I feel like I can remain in control of my behaviors", "When I’m upset, I feel guilty for feeling that way", "When I’m upset, I have difficulty concentrating", "When I’m upset, I have difficulty controlling my behaviors", "When I’m upset, I believe there is nothing I can do to make myself feel better", "When I’m upset, I become irritated with myself for feeling that way", "When I’m upset, I start to feel very bad about myself", "When I’m upset, I believe that wallowing in it is all I can do", "When I’m upset, I lose control over my behaviors", "When I’m upset, I have difficulty thinking about anything else", "When I’m upset, I take time to figure out what I’m really feeling", "When I’m upset, it takes me a long time to feel better", "When I’m upset, my emotions feel overwhelming"
];

const catqItems = [
  "When I am interacting with someone, I deliberately copy their body language or facial expressions", "I monitor my body language or facial expressions so that I appear relaxed", "I rarely feel the need to put on an act in order to get through a social situation", "I have developed a script to follow in social situations (for example, a list of questions or topics of conversation)", "I will repeat phrases that I have heard others say in the exact same way that I first heard them", "I adjust my body language or facial expressions so that I appear relaxed", "When talking to other people, I feel like the conversation flows naturally", "I monitor my body language or facial expressions so that I appear interested by the person I am interacting with", "I learn how people use their bodies and faces to interact by watching television or films, or by reading fiction", "I need the support of other people in order to socialise", "I practice my facial expressions and body language to make sure they look natural", "I don’t feel the need to make eye contact with other people if I don’t want to", "I have to force myself to interact with people when I am in social situations", "I have tried to improve my understanding of social skills by watching other people", "I adjust my body language or facial expressions so that I appear interested by the person I am interacting with", "In social situations, I feel like I’m ‘performing’ rather than being myself", "I have researched the rules of social interactions (for example, by studying psychology or reading books on human behaviour) to improve my own social skills", "I always think about the impression I make on other people", "I feel free to be myself when I am with other people", "I have spent time learning social skills from television shows and films, and try to use these in my interactions", "I am always aware of the impression I make on other people", "In social interactions, I do not pay attention to what my face or body are doing", "In my own social interactions, I use behaviours that I have learned from watching other people interacting", "I don’t need to rely on other people to socialise", "When in social situations, I try to find ways to avoid interacting with others"
];

const catsEvents = [
  "Serious natural disaster such as a flood, tornado, hurricane, earthquake, or fire", "Serious accident or injury such as a car or bike crash, dog bite, or sports injury", "Robbed by threat, force, or weapon", "Slapped, punched, or beaten up in your family", "Slapped, punched, or beaten up by someone outside your family", "Seeing someone in your family get slapped, punched, or beaten up", "Seeing someone in the community get slapped, punched, or beaten up", "Someone older touching your private parts when they should not", "Someone forcing or pressuring sex, or when you could not say no", "Someone close to you dying suddenly or violently", "Attacked, stabbed, shot at, or badly hurt", "Seeing someone attacked, stabbed, shot at, badly hurt, or killed", "Stressful or scary medical procedure", "Being around war", "Another stressful or scary event"
];

const catsSymptoms = [
  "Upsetting thoughts or pictures about what happened that pop into your head", "Bad dreams reminding you of what happened", "Feeling as if what happened is happening all over again", "Feeling very upset when you are reminded of what happened", "Strong feelings in your body when reminded (such as sweating, fast heartbeat, or upset stomach)", "Trying not to think about what happened or not to have feelings about it", "Staying away from people, places, things, situations, or conversations that remind you", "Not being able to remember part of what happened", "Negative thoughts about yourself or others, such as believing you will not have a good life, no one can be trusted, or the world is unsafe", "Blaming yourself for what happened, or blaming someone else when it was not their fault", "Bad feelings such as fear, anger, guilt, or shame a lot of the time", "Not wanting to do things you used to do", "Not feeling close to people", "Not being able to have good or happy feelings", "Feeling mad, having fits of anger, and taking it out on others", "Doing unsafe things", "Being overly careful or checking who is around you", "Being jumpy", "Problems paying attention", "Trouble falling or staying asleep"
];

const pclItems = [
  "Repeated, disturbing, and unwanted memories of the stressful experience", "Repeated, disturbing dreams of the stressful experience", "Suddenly feeling or acting as if the stressful experience were actually happening again", "Feeling very upset when something reminded you of the stressful experience", "Having strong physical reactions when something reminded you of the stressful experience", "Avoiding memories, thoughts, or feelings related to the stressful experience", "Avoiding external reminders of the stressful experience", "Trouble remembering important parts of the stressful experience", "Having strong negative beliefs about yourself, other people, or the world", "Blaming yourself or someone else for the stressful experience or what happened after it", "Having strong negative feelings such as fear, horror, anger, guilt, or shame", "Loss of interest in activities that you used to enjoy", "Feeling distant or cut off from other people", "Trouble experiencing positive feelings", "Irritable behavior, angry outbursts, or acting aggressively", "Taking too many risks or doing things that could cause you harm", "Being ‘superalert,’ watchful, or on guard", "Feeling jumpy or easily startled", "Having difficulty concentrating", "Trouble falling or staying asleep"
];

const MEASURES = {
  rcads: {
    short: "RCADS-47",
    title: "Revised Children’s Anxiety and Depression Scale — Youth",
    age: "Validated primarily for youth ages 8–18. This page reports raw scores; use UCLA’s current scoring resources for normed T-scores.",
    instructions: "Choose how often each statement happens to the young person. There are no right or wrong answers.",
    alert: "Item 37 concerns thoughts about death. Review any endorsement clinically and assess suicide risk directly; the RCADS response is not a suicide-risk classification.",
    questions: rcadsItems.map((text, index) => question(`q${index + 1}`, text, "47-item youth self-report", RCADS_FREQ, index + 1)),
    score(answers) {
      const done = answers.filter(value => value !== null).length;
      if (done < 47) return incompleteResult(done, 47);
      const scales = {
        "Social phobia": [4, 7, 8, 12, 20, 30, 32, 38, 43],
        "Panic disorder": [3, 14, 24, 26, 28, 34, 36, 39, 41],
        "Major depression": [2, 6, 11, 15, 19, 21, 25, 29, 40, 47],
        "Separation anxiety": [5, 9, 17, 18, 33, 45, 46],
        "Generalized anxiety": [1, 13, 22, 27, 35, 37],
        "Obsessive-compulsive": [10, 16, 23, 31, 42, 44]
      };
      const subscales = Object.entries(scales).map(([label, items]) => ({ label, value: sum(items.map(item => answers[item - 1])), max: items.length * 3 }));
      const depressionItems = new Set(scales["Major depression"]);
      const anxiety = sum(answers.filter((_, index) => !depressionItems.has(index + 1)));
      const depression = subscales.find(scale => scale.label === "Major depression").value;
      return { complete: true, score: `${sum(answers)} / 141 raw`, result: `Anxiety ${anxiety} / 111; Depression ${depression} / 30`, note: "Raw scores do not establish a diagnosis. Use the official current UCLA scoring program for grade- and norm-referenced T-scores; T ≥65 is commonly flagged as borderline and T ≥70 as clinically elevated.", subscales };
    },
    safety(answers) { return answers[36] > 0 ? "Thoughts about death were endorsed. Complete a direct suicide-risk assessment and respond according to clinical context and policy." : ""; },
    note: "RCADS distinguishes social phobia, panic, major depression, separation anxiety, generalized anxiety, and obsessive-compulsive symptoms. Interpret within developmental, cultural, neurodivergent, and functional context.",
    attribution: "© 1998 Bruce F. Chorpita and Susan H. Spence. Included for individual professional clinical use under the RCADS terms; do not publish or distribute the instrument publicly.",
    source: "https://rcads.ucla.edu/"
  },
  bce: {
    short: "BCEs",
    title: "Benevolent Childhood Experiences Scale",
    age: "Ten favorable experiences occurring from birth through age 18; commonly completed retrospectively by adults.",
    instructions: "Indicate whether each experience was present during childhood. Use the individual items to explore sources of safety, predictability, support, and resilience.",
    questions: [
      "At least one caregiver with whom you felt safe", "At least one good friend", "Beliefs that gave you comfort", "Enjoyment of school", "At least one teacher who cared about you", "Good neighbors", "An adult other than a parent or caregiver who could provide support or advice", "Opportunities to have a good time", "Being able to like yourself or feel comfortable with yourself", "A predictable home routine, such as regular meals and bedtime"
    ].map((text, index) => question(`q${index + 1}`, text, "Benevolent experiences", YES_NO, index + 1)),
    score(answers) {
      const done = answers.filter(value => value !== null).length;
      if (done < 10) return incompleteResult(done, 10);
      const total = sum(answers);
      return { complete: true, score: `${total} / 10`, result: `${total} benevolent childhood ${total === 1 ? "experience" : "experiences"} endorsed`, note: "Higher totals reflect more favorable experiences. There is no diagnostic cutoff; review the pattern of endorsed and absent supports rather than treating the score as a resilience verdict.", subscales: [] };
    },
    note: "BCEs complement ACEs but do not erase adversity. Avoid using either cumulative score as an individual prediction; use them to guide formulation and identify potential resources.",
    attribution: "Benevolent Childhood Experiences Scale (Narayan et al., 2018).",
    source: "https://doi.org/10.1016/j.chiabu.2017.09.005"
  },
  ders: {
    short: "DERS",
    title: "Difficulties in Emotion Regulation Scale — 36 Item",
    age: "Originally developed and validated with adults; use with adolescents only with appropriate age-specific judgment and norms.",
    instructions: "Indicate how often each statement applies. Higher scores reflect greater reported difficulty with emotion regulation.",
    questions: dersItems.map((text, index) => question(`q${index + 1}`, text, "Emotion regulation", DERS_FREQ, index + 1)),
    score(answers) {
      const done = answers.filter(value => value !== null).length;
      if (done < 36) return incompleteResult(done, 36);
      const reversed = new Set([1, 2, 6, 7, 8, 10, 17, 20, 22, 24, 34]);
      const scored = answers.map((value, index) => reversed.has(index + 1) ? 6 - value : value);
      const scales = {
        Nonacceptance: [11, 12, 21, 23, 25, 29],
        Goals: [13, 18, 20, 26, 33],
        Impulse: [3, 14, 19, 24, 27, 32],
        Awareness: [2, 6, 8, 10, 17, 34],
        Strategies: [15, 16, 22, 28, 30, 31, 35, 36],
        Clarity: [1, 4, 5, 7, 9]
      };
      const subscales = Object.entries(scales).map(([label, items]) => ({ label, value: sum(items.map(item => scored[item - 1])), max: items.length * 5 }));
      return { complete: true, score: `${sum(scored)} / 180`, result: "Higher scores indicate greater emotion-regulation difficulty", note: "The DERS does not have a universal diagnostic cutoff. Compare subscales and change over time within the same version and population.", subscales };
    },
    note: "Use the six domains—nonacceptance, goals, impulse, awareness, strategies, and clarity—to support formulation and treatment planning rather than reducing the result to a single trait.",
    attribution: "Difficulties in Emotion Regulation Scale (Gratz & Roemer, 2004). Reproduced for personal clinical use; verify permission before broader distribution.",
    source: "https://doi.org/10.1023/B:MOEM.0000040155.28969.9b"
  },
  catq: {
    short: "CAT-Q",
    title: "Camouflaging Autistic Traits Questionnaire",
    age: "Validated primarily in autistic and non-autistic adults. Adolescent evidence is emerging; interpret developmentally.",
    instructions: "Rate agreement with each statement. Higher scores reflect more reported camouflaging, not greater likelihood or severity of autism.",
    questions: catqItems.map((text, index) => question(`q${index + 1}`, text, "Social camouflaging", CATQ_AGREE, index + 1)),
    score(answers) {
      const done = answers.filter(value => value !== null).length;
      if (done < 25) return incompleteResult(done, 25);
      const reversed = new Set([3, 12, 19, 22, 24]);
      const scored = answers.map((value, index) => reversed.has(index + 1) ? 8 - value : value);
      const scales = {
        Compensation: [1, 4, 5, 9, 11, 14, 17, 20, 23],
        Masking: [2, 6, 8, 12, 15, 18, 21, 22],
        Assimilation: [3, 7, 10, 13, 16, 19, 24, 25]
      };
      const subscales = Object.entries(scales).map(([label, items]) => ({ label, value: sum(items.map(item => scored[item - 1])), max: items.length * 7 }));
      return { complete: true, score: `${sum(scored)} / 175`, result: "Higher scores indicate more reported camouflaging", note: "No official diagnostic cutoff is established. CAT-Q scores do not diagnose autism and may also be elevated in people navigating anxiety, stigma, marginalization, or other social demands.", subscales };
    },
    note: "Review compensation, masking, and assimilation separately. Ask about effort, exhaustion, safety, identity, context, and whether particular strategies are chosen, protective, costly, or unwanted.",
    attribution: "Camouflaging Autistic Traits Questionnaire (Hull et al., 2019), published under a Creative Commons license.",
    source: "https://doi.org/10.1007/s10803-018-3792-6"
  },
  cats: {
    short: "CATS",
    title: "Child and Adolescent Trauma Screen — Self-Report, Ages 7–17",
    age: "Youth self-report for ages 7–17. Consider interview administration when reading comprehension or developmental needs make self-report difficult.",
    instructions: "First identify stressful or scary events. If any event is endorsed, rate symptoms from the last two weeks and associated interference.",
    questions: [
      ...catsEvents.map((text, index) => question(`e${index + 1}`, text, "Stressful or scary events", YES_NO, index + 1)),
      question("worst", "Which event is bothering you the most now?", "Event focus", null, null, { type: "text", condition: "exposure" }),
      ...catsSymptoms.map((text, index) => question(`s${index + 1}`, text, "Symptoms in the last two weeks", CATS_FREQ, index + 1, { condition: "exposure" })),
      ...["Getting along with others", "Hobbies or fun", "School or work", "Family relationships", "General happiness"].map((text, index) => question(`f${index + 1}`, text, "Interference", YES_NO, index + 1, { condition: "exposure" }))
    ],
    hasExposure(answers) { return answers.slice(0, 15).some(value => value === 1); },
    required(answers) {
      const base = this.questions.slice(0, 15);
      return this.hasExposure(answers) ? [...base, ...this.questions.filter(item => /^s|^f/.test(item.id))] : base;
    },
    score(answers) {
      const eventAnswers = answers.slice(0, 15);
      const eventsDone = eventAnswers.filter(value => value !== null).length;
      if (eventsDone < 15) return incompleteResult(eventsDone, 15);
      const exposures = sum(eventAnswers);
      if (!exposures) return { complete: true, score: "0 events endorsed", result: "No traumatic event exposure endorsed", note: "The symptom section is not scored when no potentially traumatic event is endorsed. Use clinical judgment if the event list may not capture the client’s experience.", subscales: [] };
      const symptomValues = valuesFor(this, answers, Array.from({ length: 20 }, (_, index) => `s${index + 1}`));
      const functionValues = valuesFor(this, answers, Array.from({ length: 5 }, (_, index) => `f${index + 1}`));
      const completed = symptomValues.filter(value => value !== null).length + functionValues.filter(value => value !== null).length;
      if (completed < 25) return incompleteResult(15 + completed, 40);
      const total = sum(symptomValues);
      const interference = sum(functionValues);
      const result = total >= 21 ? "Probable PTSD range" : total >= 15 ? "Moderate trauma-related distress" : "Below suggested clinical elevation";
      const subscales = [
        { label: "Re-experiencing", value: sum(symptomValues.slice(0, 5)), max: 15 },
        { label: "Avoidance", value: sum(symptomValues.slice(5, 7)), max: 6 },
        { label: "Mood / cognition", value: sum(symptomValues.slice(7, 14)), max: 21 },
        { label: "Arousal / reactivity", value: sum(symptomValues.slice(14, 20)), max: 18 },
        { label: "Interference", value: interference, max: 5 }
      ];
      return { complete: true, score: `${total} / 60`, result, note: "A score of 21 or higher suggests probable PTSD; 15–20 suggests moderate distress. CATS is a screen, not a diagnosis. Follow elevated or clinically concerning results with interview-based assessment.", subscales };
    },
    note: "Administer as a clinical encounter. Explain confidentiality, avoid requiring unnecessary event details, and attend to distress, immediate safety, mandated-reporting duties, and caregiver involvement as appropriate.",
    attribution: "Child and Adolescent Trauma Screen (CATS), Goldbeck, Berliner, and the CATS Consortium. Freely accessible with no licensing fee.",
    source: "https://istss.org/clinical-resources/child-adolescent-trauma-assessments/child-and-adolescent-trauma-screen/"
  },
  pcl5: {
    short: "PCL-5",
    title: "PTSD Checklist for DSM-5 — Past Month",
    age: "Adult self-report measure. Interpretation should be completed by a qualified health professional.",
    instructions: "Keeping the most stressful event in mind, rate how much each problem has bothered the person in the past month.",
    questions: [
      question("worst", "Most stressful event (optional; document only what is clinically necessary)", "Event focus", null, null, { type: "text" }),
      ...pclItems.map((text, index) => question(`q${index + 1}`, text, "Symptoms in the past month", PCL_FREQ, index + 1))
    ],
    score(answers) {
      const symptoms = answers.slice(1);
      const done = symptoms.filter(value => value !== null).length;
      if (done < 20) return incompleteResult(done, 20);
      const total = sum(symptoms);
      const endorsed = symptoms.map(value => value >= 2);
      const b = endorsed.slice(0, 5).filter(Boolean).length;
      const c = endorsed.slice(5, 7).filter(Boolean).length;
      const d = endorsed.slice(7, 14).filter(Boolean).length;
      const e = endorsed.slice(14, 20).filter(Boolean).length;
      const provisional = b >= 1 && c >= 1 && d >= 2 && e >= 2;
      const result = provisional ? "DSM-5 symptom-cluster rule met provisionally" : total >= 31 ? "Elevated total score; cluster rule not met" : "Below commonly used provisional cutoff range";
      const subscales = [
        { label: "Intrusion (B)", value: sum(symptoms.slice(0, 5)), max: 20 },
        { label: "Avoidance (C)", value: sum(symptoms.slice(5, 7)), max: 8 },
        { label: "Mood / cognition (D)", value: sum(symptoms.slice(7, 14)), max: 28 },
        { label: "Arousal / reactivity (E)", value: sum(symptoms.slice(14, 20)), max: 24 }
      ];
      return { complete: true, score: `${total} / 80`, result, note: "A total score around 31–33 is commonly used as a provisional cutoff, but optimal thresholds vary by population and purpose. The DSM-5 symptom rule requires ≥1 B, ≥1 C, ≥2 D, and ≥2 E items rated at least Moderately.", subscales };
    },
    note: "The PCL-5 can monitor symptoms or support provisional screening. A structured clinical interview remains the diagnostic standard, and results should be interpreted with trauma exposure, impairment, differential diagnosis, and context.",
    attribution: "PCL-5, U.S. Department of Veterans Affairs National Center for PTSD. Public domain; version dated August 2023.",
    source: "https://www.ptsd.va.gov/professional/assessment/adult-sr/ptsd-checklist.asp"
  }
};

const key = new URLSearchParams(location.search).get("measure");
const config = MEASURES[key] || MEASURES.bce;
let answers = config.questions.map(item => item.type === "text" ? "" : null);
const $ = id => document.getElementById(id);

function isVisible(item) {
  return item.condition !== "exposure" || config.hasExposure?.(answers);
}

function requiredQuestions() {
  if (config.required) return config.required(answers);
  return config.questions.filter(item => item.type !== "text" && isVisible(item));
}

function answerLabel(item, value) {
  if (item.type === "text") return value || "Not documented";
  return item.options.find(option => option.value === value)?.label || "Not answered";
}

function reset() {
  answers = config.questions.map(item => item.type === "text" ? "" : null);
  render();
}

function renderQuestion(item, index) {
  const number = item.number ? `<span class="question-number">${item.number}.</span>` : "";
  const input = item.type === "text"
    ? `<textarea class="text-response" data-text-index="${index}" placeholder="Optional clinical note">${answers[index] || ""}</textarea>`
    : `<div class="response-grid">${item.options.map(option => `<label class="response-option"><input type="radio" name="q-${index}" value="${option.value}" data-index="${index}" ${answers[index] === option.value ? "checked" : ""}><span>${option.label}</span></label>`).join("")}</div>`;
  return `<div class="question-row" data-question-id="${item.id}" ${isVisible(item) ? "" : "hidden"}><h3>${number}<span>${item.text}</span></h3>${input}</div>`;
}

function render() {
  document.title = `${config.short} | Clinical Workbench`;
  $("page-title").textContent = config.short;
  $("full-title").textContent = config.title;
  $("age-note").textContent = config.age;
  $("instructions").textContent = config.instructions;
  $("clinical-note").textContent = config.note;
  $("attribution").textContent = config.attribution;
  $("source-link").href = config.source;
  $("measure-alert").hidden = !config.alert;
  $("measure-alert").textContent = config.alert || "";

  const sections = [...new Set(config.questions.map(item => item.section))];
  $("questions").innerHTML = sections.map(section => {
    const rows = config.questions.map((item, index) => item.section === section ? renderQuestion(item, index) : "").join("");
    return `<section class="card measure-section"><h2>${section}</h2>${rows}</section>`;
  }).join("");

  document.querySelectorAll("[data-index]").forEach(input => {
    input.addEventListener("change", () => {
      answers[Number(input.dataset.index)] = Number(input.value);
      update();
    });
  });
  document.querySelectorAll("[data-text-index]").forEach(input => {
    input.addEventListener("input", () => {
      answers[Number(input.dataset.textIndex)] = input.value.trim();
      update();
    });
  });
  update();
}

function updateVisibility() {
  config.questions.forEach(item => {
    const row = document.querySelector(`[data-question-id="${item.id}"]`);
    if (row) row.hidden = !isVisible(item);
  });
}

function detailedOutput(result) {
  const lines = [config.title, ""];
  let currentSection = "";
  config.questions.forEach((item, index) => {
    if (!isVisible(item)) return;
    if (item.section !== currentSection) {
      currentSection = item.section;
      lines.push(currentSection);
    }
    lines.push(`${item.number ? `${item.number}. ` : ""}${item.text}: ${answerLabel(item, answers[index])}`);
  });
  lines.push("", `Score: ${result.score}`, `Result: ${result.result}`);
  if (result.subscales?.length) lines.push(...result.subscales.map(scale => `${scale.label}: ${scale.value} / ${scale.max}`));
  lines.push("", result.note);
  return lines.join("\n");
}

function summaryOutput(result) {
  if (!result.complete) return `${config.short} is incomplete (${result.score}). No score was interpreted.`;
  const subscaleText = result.subscales?.length
    ? ` Subscales: ${result.subscales.map(scale => `${scale.label} ${scale.value}/${scale.max}`).join("; ")}.`
    : "";
  return `${config.short} completed. Score: ${result.score}. Result: ${result.result}.${subscaleText} ${result.note}`;
}

function update() {
  updateVisibility();
  const required = requiredQuestions();
  const answered = required.filter(item => answers[config.questions.indexOf(item)] !== null).length;
  $("completion-badge").textContent = `${answered} / ${required.length} answered`;
  const result = config.score(answers);
  $("score-display").textContent = result.score;
  $("result-display").textContent = result.result;
  $("result-note").textContent = result.note;
  $("subscale-results").innerHTML = (result.subscales || []).map(scale => `<div class="subscale-result"><span>${scale.label}</span><strong>${scale.value} / ${scale.max}</strong></div>`).join("");
  const safety = config.safety?.(answers) || "";
  $("measure-alert").hidden = !(config.alert || safety);
  $("measure-alert").textContent = safety || config.alert || "";
  const detailed = document.querySelector('[name="outputStyle"]:checked').value === "detailed";
  $("output").value = detailed ? detailedOutput(result) : summaryOutput(result);
}

$("reset-button").addEventListener("click", reset);
document.querySelectorAll('[name="outputStyle"]').forEach(input => input.addEventListener("change", update));
$("copy-button").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("output").value);
  } catch {
    $("output").focus();
    $("output").select();
    document.execCommand("copy");
  }
  $("copy-status").textContent = "Copied";
  setTimeout(() => { $("copy-status").textContent = ""; }, 1500);
});
$("select-button").addEventListener("click", () => { $("output").focus(); $("output").select(); });

reset();

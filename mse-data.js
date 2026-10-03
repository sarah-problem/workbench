/**
 * mse-data.js
 * Mental Status Exam content: section definitions, choices, defaults, and teaching explanations.
 * Load before mse.js. Narrative phrasing also lives in mse.js.
 * See README.md for the file map and a guide to following the code.
 */

/**
 * MSE CLINICAL CONTENT
 * ------------------------------------------------------------
 * Edit clinical wording here.
 *
 * Each section can include:
 *   - options: selectable choices and generated sentences
 *   - info.nuances: practical ambiguities and limits when interpreting findings
 *
 * The interface code lives in mse.js.
 */

// Plain-language teaching labels appear beside field headings in Learn mode only.
// These explain what is being assessed, without adding claims to the generated note.
const mseDimensionDescriptions = {
  appearance: "grooming, hygiene, and clothing in context",
  behavior: "how the client engages and behaves during the session",
  eyeContact: "pattern of gaze during interaction",
  speech: "how the client speaks: rate, rhythm, volume, and amount",
  mood: "the client's reported emotional state",
  affect: "observable emotional expression",
  thoughtProcess: "how thoughts are organized and connected",
  thoughtContent: "the ideas, beliefs, and concerns being expressed",
  perception: "sensory experiences, such as hearing or seeing things",
  orientation: "awareness of person, place, time, and situation",
  attentionMemory: "ability to focus, sustain attention, and recall information",
  insight: "recognition of one's patterns, difficulties, and their impact",
  judgment: "ability to weigh options and consequences when making decisions",
  impulse: "ability to pause and regulate urges before acting",
  sib: "self-injury urges, behavior, and history",
  si: "thoughts of death or ending one's life",
  hi: "thoughts of killing another person",
};

// Placeholder examples are hints only, never defaults or generated note content.
// More specific examples take priority when their corresponding choice is selected.
const mseObservationHints = {
  appearance: {
    default:
      "Describe the specific observation and relevant context, e.g., Arrived in work clothing immediately after a shift.",
  },
  behavior: {
    default: "e.g., Initially reserved; became more engaged as the session progressed.",
    guarded: "e.g., Answered general questions but declined to discuss family conflict.",
    restless:
      "e.g., Frequently shifted position while continuing to participate in the conversation.",
  },
  eyeContact: {
    default: "e.g., Eye contact varied with the topic being discussed.",
    limited:
      "e.g., Limited eye contact was consistent with prior sessions; client remained engaged in the interaction.",
  },
  speech: {
    default: "Describe rate, volume, pauses, or amount of speech and any relevant context.",
    latent: "e.g., Took additional time before answering; responses were relevant when given time.",
    impoverished:
      "e.g., Responses were brief, with little spontaneous elaboration; continued to participate when prompted.",
    rapid: "e.g., Spoke quickly but paused for questions and clarification.",
    other:
      "Describe the speech feature in your own words, e.g., Volume increased when discussing the conflict.",
  },
  affect: {
    default: "e.g., Became tearful when discussing a recent loss.",
    restricted: "e.g., Emotional expression was limited in range, consistent with prior sessions.",
  },
  thoughtProcess: {
    default: "Describe how ideas connected and whether the client reached the point.",
    circumstantial:
      "e.g., Provided extensive background before answering; returned to the original question with brief redirection.",
    tangential: "e.g., Shifted from the question to other topics and required redirection.",
    perseverative: "e.g., Repeatedly returned to the same concern despite changes in topic.",
  },
  thoughtContent: {
    default: "Describe the specific theme and whether it was reported or observed.",
    ruminative: "e.g., Repeatedly revisited a recent disagreement and concerns about its meaning.",
    preoccupied: "e.g., Much of the discussion centered on an upcoming housing decision.",
  },
  perception: {
    default:
      "Clarify what the client reported versus what you observed, including timing and context.",
  },
  attentionMemory: {
    default:
      "Clarify attention and memory separately when needed, e.g., Needed occasional repetition of questions; recalled recent events.",
  },
  insight: {
    default: "Describe what the client recognizes and what remains unclear.",
    good: "e.g., Recognized a recurring interpersonal pattern and described its effect on relationships.",
    fair: "e.g., Recognized distress but had difficulty identifying recurring triggers.",
    limited:
      "e.g., Recognized associated distress but had limited awareness of recurring interpersonal patterns.",
    poor: "Describe the specific concern the client did not recognize, rather than making a global statement about awareness.",
    mixed:
      "e.g., Recognized difficulties at school but had less awareness of their impact at home.",
  },
  judgment: {
    default: "Give a specific example of a decision, the options available, and the context.",
    fair: "e.g., Identified some possible consequences but needed support to consider alternatives.",
    limited:
      "e.g., Could identify consequences during discussion but reported difficulty applying this understanding during conflict.",
    poor: "Describe the decision and its consequences, and distinguish reported behavior from what you observed today.",
    mixed:
      "e.g., Considered alternatives during the session; caregiver reported difficulty making decisions during conflict at home.",
  },
  impulse: {
    default:
      "Distinguish behavior in the session from recent reported behavior, and identify the source.",
    intact:
      "e.g., Behavioral control was maintained during the session; parent reported continued impulsive behavior at school.",
    fair: "e.g., Needed occasional reminders to pause before responding during the session.",
    limited:
      "e.g., Behavioral control was maintained during the session; caregiver reported episodes of hitting peers when frustrated.",
    poor: "Describe the specific behavior, when it occurred, and who reported it; clarify what was observed during this session.",
  },
  sib: {
    default:
      "Clarify urges versus behavior, timing, and source of information. Include only findings actually assessed.",
  },
  si: {
    default:
      "Clarify the client's report, timing, and any further risk assessment or action taken. Include only findings actually assessed.",
  },
  hi: {
    default:
      "Clarify the client's report and context, and any further risk assessment or action taken. Include only findings actually assessed.",
  },
};

// One shared category map keeps the form and the grouped list output in the same order.
const mseCategories = [
  {
    id: "presentation",
    title: "General Presentation",
    sections: ["appearance", "behavior", "eyeContact"],
  },
  {
    id: "speech-emotion",
    title: "Speech & Emotional Presentation",
    sections: ["speech", "mood", "affect"],
  },
  {
    id: "thought-perception",
    title: "Thought & Perception",
    sections: ["thoughtProcess", "thoughtContent", "perception"],
  },
  { id: "cognition", title: "Cognition", sections: ["orientation", "attentionMemory"] },
  {
    id: "insight-judgment",
    title: "Self-Awareness & Self-Regulation",
    sections: ["insight", "judgment", "impulse"],
  },
  { id: "safety", title: "Safety / Risk", sections: ["sib", "si", "hi"] },
];

// Context is explicitly selected for one finding; it never infers a diagnosis or cause.
const mseContextOptions = [
  { value: "", label: "No modifier", phrase: "" },
  {
    value: "unknown",
    label: "Baseline not yet established",
    phrase: "",
    statement: "Baseline has not yet been established.",
  },
  {
    value: "baseline",
    label: "Consistent with baseline",
    phrase: "consistent with the client's baseline presentation",
  },
  {
    value: "change",
    label: "Change from baseline",
    phrase: "a change from the client's baseline presentation",
  },
];
// Sources qualify the selected baseline comparison, not the observed finding itself.
const mseBaselineSources = [
  { value: "", label: "Not specified", phrase: "" },
  {
    value: "sessions",
    label: "Observed across prior sessions",
    phrase: "based on observations across prior sessions",
  },
  { value: "client", label: "Client report", phrase: "per client report" },
  { value: "collateral", label: "Collateral report", phrase: "per collateral report" },
];

// Offer only observations relevant to a domain; each must be explicitly checked.
const mseContextObservations = [
  {
    value: "redirectable",
    label: "Benefits from redirection",
    sentence: "Client benefited from redirection.",
    sections: ["thoughtProcess", "attentionMemory"],
  },
  {
    value: "responseTime",
    label: "Benefits from additional response time",
    sentence: "Client benefited from additional time to formulate responses.",
    sections: ["speech", "thoughtProcess", "attentionMemory"],
  },
  {
    value: "engaged",
    label: "Remains engaged and responsive",
    sentence: "Client remained engaged and responsive.",
    sections: ["behavior", "eyeContact", "speech", "affect", "attentionMemory"],
  },
];
const mseContextSections = [
  "appearance",
  "behavior",
  "eyeContact",
  "speech",
  "affect",
  "thoughtProcess",
  "thoughtContent",
  "perception",
  "attentionMemory",
  "insight",
  "judgment",
  "impulse",
];

// Each section has a stable id, displayed title, normal default, and choices. multiple allows several selections; observation enables free text. Keep ids aligned with mse.js.
const mseSections = [
  {
    type: "single",
    id: "appearance",
    title: "Appearance",
    normal: "appropriate",
    multiple: true,
    observation: true,
    options: [
      option("appropriate", "Appropriate", "Appearance appropriate."),
      option("disheveled", "Disheveled", "Appearance disheveled."),
      option("poorHygiene", "Poor hygiene", "Appearance notable for poor hygiene."),
      option(
        "inappropriate",
        "Inappropriate setting/weather",
        "Appearance inappropriate for setting or weather.",
      ),
      option("other", "Other", "Appearance otherwise notable."),
    ],
    info: {
      nuances: [
        "Grooming can reflect access to resources, sensory preferences, or the circumstances of the visit. A change may relate to disrupted routines or lost support as well as changes in the client’s functioning; the appearance alone does not establish why it changed.",
      ],
    },
  },

  {
    type: "single",
    id: "behavior",
    title: "Behavior",
    normal: "cooperative",
    multiple: true,
    observation: true,
    options: [
      option("cooperative", "Cooperative", "Behavior cooperative."),
      option("guarded", "Guarded", "Behavior guarded."),
      option("withdrawn", "Withdrawn", "Behavior withdrawn."),
      option("restless", "Restless", "Behavior restless."),
      option("agitated", "Agitated", "Behavior agitated."),
      option("other", "Other", "Behavior otherwise notable."),
    ],
    info: {
      nuances: [
        "Engagement may shift with the topic, who is present, or how comfortable the client feels with the interviewer. Someone can be cooperative overall and still protect information they expect could lead to conflict or consequences.",
        "Frequent movement alone does not establish agitation, especially when the client remains calm and engaged.",
      ],
    },
  },

  {
    type: "single",
    id: "eyeContact",
    title: "Eye Contact",
    normal: "appropriate",
    observation: true,
    options: [
      option("appropriate", "Appropriate", "Eye contact appropriate."),
      option("limited", "Limited", "Eye contact limited."),
      option("avoidant", "Avoidant", "Eye contact avoidant."),
      option("intense", "Intense", "Eye contact intense."),
      option("variable", "Variable", "Eye contact variable."),
    ],
    info: {
      nuances: [
        "Someone who rarely looks directly at you may still be following closely, with eye contact varying by culture, sensory comfort, and whether they are listening or speaking. On video, screen placement can also affect where they appear to be looking.",
      ],
    },
  },

  {
    type: "single",
    id: "speech",
    title: "Speech",
    normal: "normal",
    multiple: true,
    observation: true,
    options: [
      option("normal", "Normal", "Speech normal in rate, rhythm, volume, and quantity."),
      option("rapid", "Rapid", "Speech rapid but interruptible."),
      option("pressured", "Pressured", "Speech pressured and difficult to interrupt."),
      option("slow", "Slow", "Speech slowed."),
      option("quiet", "Quiet", "Speech quiet."),
      option("latent", "Latent", "Speech notable for response latency."),
      option(
        "impoverished",
        "Impoverished",
        "Speech impoverished with reduced quantity and spontaneity.",
      ),
      option("other", "Other", "Speech otherwise notable."),
    ],
    info: {
      nuances: [
        "Long pauses may reflect processing time, word-finding, or reluctance to disclose. How the client responds when given more time or a differently phrased question can help clarify what you are observing.",
        "Brief answers around one topic may suggest something different from sparse speech throughout the interview, especially if the client elaborates freely elsewhere.",
      ],
    },
  },

  {
    type: "single",
    id: "mood",
    title: "Mood",
    normal: "euthymic",
    observation: false,
    options: [
      option("euthymic", "Euthymic", "Mood euthymic."),
      option("anxious", "Anxious", "Mood anxious."),
      option("depressed", "Depressed", "Mood depressed."),
      option("irritable", "Irritable", "Mood irritable."),
      option("dysphoric", "Dysphoric", "Mood dysphoric."),
      option("euphoric", "Euphoric", "Mood euphoric."),
      option("other", "Other", "Mood otherwise notable."),
    ],
    info: {
      nuances: [
        "The client’s own wording can be more useful when one mood label does not capture their experience, such as feeling anxious and numb at the same time.",
      ],
    },
  },

  {
    type: "single",
    id: "affect",
    title: "Affect",
    normal: "congruentFull",
    multiple: true,
    observation: true,
    options: [
      option("congruentFull", "Congruent/full", "Affect congruent and full range."),
      option("restricted", "Restricted/constricted", "Affect restricted."),
      option("blunted", "Blunted", "Affect blunted."),
      option("flat", "Flat", "Affect flat."),
      option("labile", "Labile", "Affect labile."),
      option("incongruent", "Incongruent", "Affect incongruent."),
      option("tearful", "Tearful", "Affect tearful."),
      option("other", "Other", "Affect otherwise notable."),
    ],
    info: {
      nuances: [
        "When considering lability, it helps to look at whether emotional shifts follow changes in topic and how readily the client settles.",
        "A client may describe considerable distress while showing little outward emotion — expression and felt experience do not always match. Comfort with the interviewer and expectations about showing emotion may also shape what is visible.",
      ],
    },
  },

  {
    type: "single",
    id: "thoughtProcess",
    title: "Thought Process",
    normal: "linear",
    multiple: true,
    observation: true,
    options: [
      option("linear", "Linear/goal-directed", "Thought process linear and goal-directed."),
      option("circumstantial", "Circumstantial", "Thought process circumstantial."),
      option("tangential", "Tangential", "Thought process tangential."),
      option("perseverative", "Perseverative", "Thought process perseverative."),
      option("flight", "Flight of ideas", "Thought process notable for flight of ideas."),
      option(
        "blocking",
        "Thought blocking",
        "Thought process notable for intermittent thought blocking.",
      ),
      option("disorganized", "Disorganized", "Thought process disorganized."),
      option("other", "Other", "Thought process otherwise notable."),
    ],
    info: {
      nuances: [
        "Redirection can make the conversation easier to follow. Whether the client reaches the point independently or relies on prompting helps describe their thought process.",
        "An unfamiliar storytelling style, language differences, or extensive background detail can make an account hard to follow without necessarily indicating disorganized thinking.",
      ],
    },
  },

  {
    type: "single",
    id: "thoughtContent",
    title: "Thought Content",
    normal: "unremarkable",
    multiple: true,
    observation: true,
    options: [
      option("unremarkable", "Unremarkable", "Thought content unremarkable."),
      option("ruminative", "Ruminative", "Thought content ruminative."),
      option("preoccupied", "Preoccupied", "Thought content preoccupied."),
      option("obsessional", "Obsessional", "Thought content obsessional."),
      option("paranoid", "Paranoid ideation", "Thought content notable for paranoid ideation."),
      option("delusional", "Delusional", "Thought content notable for delusional beliefs."),
      option("other", "Other", "Thought content otherwise notable."),
    ],
    info: {
      nuances: [
        "An intrusive thought may be distressing because the client does not want it; its content alone does not establish that they believe it, desire it, or intend to act on it.",
        "Suspiciousness may relate to actual threats or prior experiences, and beliefs need to be understood in their cultural context. How firmly the client holds a belief and how they respond to other explanations can help clarify the concern.",
      ],
    },
  },

  {
    type: "single",
    id: "perception",
    title: "Perception",
    normal: "none",
    observation: true,
    options: [
      option("none", "None observed/reported", "No perceptual disturbance observed or reported."),
      option(
        "internalStimuli",
        "Responding to internal stimuli",
        "Client appeared to respond to internal stimuli.",
      ),
      option("auditory", "Auditory hallucinations", "Client reported auditory hallucinations."),
      option("visual", "Visual hallucinations", "Client reported visual hallucinations."),
      option("command", "Command hallucinations", "Client reported command hallucinations."),
      option(
        "unclear",
        "Unclear/assess further",
        "Perceptual disturbance unclear and requires further assessment.",
      ),
      option("other", "Other", "Perception otherwise notable."),
    ],
    info: {
      nuances: [
        "Experiences around sleep, trauma reminders, or dissociation can be difficult to categorize. The description becomes clearer with details about when they occur, what they feel or sound like, and how the client understands them.",
        "When a client’s account differs from what their behavior appears to suggest, documenting each separately keeps an observation from becoming a presumed experience.",
      ],
    },
  },

  {
    type: "orientation",
    id: "orientation",
    title: "Orientation",
    observation: false,
    domains: [
      { id: "person", label: "Person" },
      { id: "place", label: "Place" },
      { id: "time", label: "Time" },
      { id: "situation", label: "Situation" },
    ],
    info: {
      nuances: [
        "Getting the exact date wrong differs from losing track of the broader time period or setting. Even a fluent conversation may leave some orientation domains untested.",
      ],
    },
  },

  {
    type: "single",
    id: "attentionMemory",
    title: "Attention / Memory",
    normal: "intact",
    observation: true,
    options: [
      option("intact", "Grossly intact", "Attention, concentration, and memory grossly intact."),
      option("mild", "Mild impairment", "Attention, concentration, and/or memory mildly impaired."),
      option(
        "moderate",
        "Moderate impairment",
        "Attention, concentration, and/or memory moderately impaired.",
      ),
      option(
        "severe",
        "Severe impairment",
        "Attention, concentration, and/or memory severely impaired.",
      ),
      option("other", "Other", "Attention, concentration, and/or memory otherwise notable."),
    ],
    info: {
      nuances: [
        "If attention was limited when information was presented, difficulty recalling it later may reflect what was taken in. Attention and memory may need separate descriptions rather than one overall rating.",
        "Following a quiet, structured conversation and managing competing demands at home or school are different tasks. Better performance with fewer distractions or more support is useful context for the finding.",
      ],
    },
  },

  {
    type: "single",
    id: "insight",
    title: "Insight",
    normal: "good",
    observation: true,
    options: [
      option("good", "Good", "Insight good."),
      option("fair", "Fair", "Insight fair."),
      option("limited", "Limited", "Insight limited."),
      option("poor", "Poor", "Insight poor."),
      option("mixed", "Mixed/variable", "Insight mixed or variable."),
      option("other", "Other", "Insight otherwise notable."),
    ],
    info: {
      nuances: [
        "A client may recognize their distress while still learning to connect it with triggers or recurring patterns. Describing what they understand and what remains unclear can be more useful than a global rating.",
        "Developmental and cognitive abilities affect how someone explains their experience. A client may also understand the problem through a different cultural or family framework — disagreement with the clinician’s explanation does not by itself establish a lack of awareness.",
      ],
    },
  },

  {
    type: "single",
    id: "judgment",
    title: "Judgment",
    normal: "good",
    observation: true,
    options: [
      option("good", "Good", "Judgment good."),
      option("fair", "Fair", "Judgment fair."),
      option("limited", "Limited", "Judgment limited."),
      option("poor", "Poor", "Judgment poor."),
      option("mixed", "Mixed/variable", "Judgment mixed or variable."),
      option("other", "Other", "Judgment otherwise notable."),
    ],
    info: {
      nuances: [
        "A client may be able to discuss consequences in session but struggle to apply that understanding during conflict, with emotional activation and available support affecting how judgment shows up in different settings.",
        "Decisions need to be understood in light of the options available, including constraints or coercion; an unfavorable outcome alone does not establish poor judgment.",
      ],
    },
  },

  {
    type: "single",
    id: "impulse",
    title: "Impulse Control",
    normal: "intact",
    observation: true,
    options: [
      option("intact", "Intact", "Impulse control intact."),
      option("fair", "Fair", "Impulse control fair."),
      option("limited", "Limited", "Impulse control limited."),
      option("poor", "Poor", "Impulse control poor."),
      option("other", "Other", "Impulse control otherwise notable."),
    ],
    info: {
      nuances: [
        "A client may maintain behavioral control in a structured session while struggling during conflict or distress elsewhere — both accounts can be accurate. Differences in demands, relationships, and available support are worth exploring without assuming they explain the behavior.",
      ],
    },
  },

  {
    type: "single",
    id: "sib",
    title: "Self-Injury",
    normal: "denied",
    observation: true,
    options: [
      option("denied", "Denied current SIB/urges", "Denied current SIB urges or behavior."),
      option(
        "urges",
        "Current urges, no behavior",
        "Reported current SIB urges without recent self-injurious behavior.",
      ),
      option("recent", "Recent SIB", "Reported recent self-injurious behavior."),
      option(
        "history",
        "History only",
        "Reported history of SIB without current urges or behavior.",
      ),
      option("other", "Other", "Self-injury status otherwise notable."),
    ],
    info: {
      nuances: [
        "Intent may vary between episodes or remain mixed or unclear; neither the method nor a history of nonsuicidal self-injury establishes intent for a new episode.",
      ],
    },
  },

  {
    type: "single",
    id: "si",
    title: "Suicidal Ideation",
    normal: "denied",
    observation: true,
    options: [
      option("denied", "Denied current SI", "Denied current SI."),
      option("passive", "Passive SI", "Reported passive SI."),
      option("activeNoIntent", "Active SI, no intent", "Reported active SI without intent."),
      option("activeIntent", "Active SI with intent", "Reported active SI with intent."),
      option("other", "Other", "Suicidal ideation otherwise notable."),
    ],
    info: {
      nuances: [
        "“Passive” describes the thoughts rather than an overall risk level. Plans, access, preparation, and recent behavior may add information that the MSE selection does not capture.",
      ],
    },
  },

  {
    type: "single",
    id: "hi",
    title: "Homicidal Ideation",
    normal: "denied",
    observation: true,
    options: [
      option("denied", "Denied HI", "Denied HI."),
      option("passive", "Passive HI", "Reported passive HI."),
      option("active", "Active HI", "Reported active HI."),
      option("other", "Other", "Homicidal ideation otherwise notable."),
    ],
    info: {
      nuances: [
        "Because similar wording can describe unwanted violent thoughts, anger, threats, or an intention to harm, the client’s experience of the thought and what they want or intend to do need clarification.",
        "A specific target, access to means, or preparatory actions may call for a fuller violence risk assessment beyond the MSE description.",
      ],
    },
  },
];

// Teaching explanations keyed by section and option identifiers. These populate the More information panels.
const optionHelp = {
  appearance: {
    appropriate:
      "Presentation is adequate for the setting and does not raise a clinically meaningful concern.",
    disheveled:
      "Hair, clothing, or overall presentation appears noticeably unkempt. Describes appearance or presentation.",
    poorHygiene:
      "There are observable concerns with basic hygiene or hygiene-related ADLs, such as bathing, oral care, body odor, or changing into clean clothing.",
    inappropriate:
      "Clothing or presentation is meaningfully mismatched to the setting, weather, or situation.",
    other:
      "Use this for other clinically meaningful aspects of appearance, including presentation that does not fit the listed choices, or when additional clarification is needed.",
  },
  behavior: {
    cooperative:
      "The client participates, answers questions, and engages, even if anxious, tearful, or upset.",
    guarded:
      "The client engages but protects information, avoids elaboration, or selectively avoids topics. Describes behavior or speech that is limited or selective.",
    withdrawn:
      "The client shows reduced interpersonal engagement or responsiveness overall. Describes behavior or speech that is reduced across the interaction rather than only around certain topics.",
    restless:
      "The body does not settle: fidgeting, shifting, bouncing a leg, pacing, or repeatedly getting up. The client may still be calm and engaged.",
    agitated:
      "Restless body movement that is accompanied by visible emotional escalation, irritability, anger, anxiety, distress, or difficulty calming down.",
    other:
      "Use this for other clinically meaningful behavior, including changes in engagement, motor activity, or interpersonal presentation, or when additional clarification is needed.",
  },
  eyeContact: {
    appropriate: "Eye contact fits the interaction and context.",
    limited:
      "The client makes little direct eye contact. Describes eye contact that is infrequent without clear evidence that the client is trying to avoid it.",
    avoidant:
      "The client appears to actively avoid eye contact. Describes eye contact that is actively turned away, looked down, or otherwise evaded.",
    intense:
      "Eye contact is unusually sustained or forceful enough to be clinically notable. Describes eye contact that is intense or fixated. ",
    variable:
      "Eye contact changes across topics, emotional states, or moments in session. Describes eye contact that is inconsistent or fluctuating.",
  },
  mood: {
    euthymic:
      "Mood is relatively neutral or stable without a prominent depressive, anxious, irritable, or elevated state.",
    anxious: "The client reports worry, apprehension, tension, or fearfulness.",
    depressed:
      "The client reports low mood, sadness, heaviness, hopelessness, or related depressive experience.",
    irritable: "The client reports feeling easily annoyed, frustrated, or reactive.",
    dysphoric:
      "The client reports a broadly distressed, unpleasant, or emotionally uncomfortable mood.",
    euphoric: "Mood is unusually elevated, expansive, or intensely positive.",
    other:
      "Use this when the client's reported mood is better described by another term or includes a mixed or unclear emotional state, or when additional clarification is needed.",
  },
  affect: {
    congruentFull:
      "Affect fits the mood or topic and shows a broad, flexible range of emotional expression.",
    incongruent: "Affect does not fit the reported mood or emotional content being discussed.",
    restricted:
      "Emotion is clearly present, but the range is narrow. The client may smile briefly or become mildly tearful while otherwise staying fairly neutral.",
    blunted:
      "Emotion is present but muted. Facial expression and vocal emotion change less than expected when meaningful topics arise.",
    flat: "Emotional expression is almost absent. Emotionally meaningful and neutral topics are discussed with essentially the same expression and tone.",
    labile: "Affect shifts rapidly or intensely and may appear difficult to control or regulate.",
    tearful: "The client is visibly crying or near tears.",
    other:
      "Use this for other clinically meaningful qualities of emotional expression, including changes in range, intensity, stability, or congruence, or when additional clarification is needed.",
  },
  thoughtContent: {
    unremarkable:
      "No clinically notable delusional, paranoid, obsessional, or unusually dominant thought content is evident.",
    ruminative:
      "The client repeatedly thinks about distress, losses, mistakes, problems, or emotionally charged material.",
    preoccupied:
      "A particular concern dominates attention and repeatedly pulls the conversation back to it.",
    obsessional: "Thoughts, images, or urges are intrusive, unwanted, and difficult to dismiss.",
    paranoid:
      "The client expresses suspiciousness or fear of being watched, harmed, targeted, or deceived.",
    delusional: "The client holds a fixed false belief that is not responsive to evidence.",
    other:
      "Use this for other clinically meaningful themes, beliefs, fears, urges, or preoccupations, or when additional clarification is needed.",
  },
  perception: {
    none: "No perceptual disturbance is reported and none is apparent during the interaction.",
    internalStimuli:
      "The client appears to listen, look toward, speak to, or react to stimuli that are not externally present.",
    auditory: "The client reports hearing voices or sounds others do not hear.",
    visual: "The client reports seeing things others do not see.",
    command: "The client reports voices instructing them to act.",
    unclear:
      "The experience may be perceptual, dissociative, intrusive, trauma-related, substance-related, or otherwise unclear.",
    other:
      "Use this for other clinically meaningful sensory or perceptual experiences, including experiences that do not fit the listed choices, or when additional clarification is needed.",
  },
  orientation: {
    person: "Knows who they are; disorientation to person is uncommon and clinically significant.",
    place: "Knows where they are or understands the setting.",
    time: "Reasonably understands the date, day, month, year, or current time period.",
    situation: "Understands why they are there and what is happening.",
  },
  attentionMemory: {
    intact:
      "The client follows the conversation and recalls relevant information without a clinically meaningful problem.",
    mild: "The client is distractible or forgetful but remains redirectable and able to participate.",
    moderate:
      "Frequent redirection or repetition is needed, and participation is meaningfully affected.",
    severe:
      "The client cannot reliably sustain the interaction or recall basic relevant information.",
    other:
      "Use this when attention, concentration, and memory differ from one another or cannot be represented by a single overall rating, or when additional clarification is needed.",
  },
  insight: {
    good: "The client recognizes relevant symptoms, patterns, needs, or consequences.",
    fair: "The client has partial awareness but may not fully recognize impact or patterns.",
    limited:
      "The client minimizes, externalizes, or struggles to connect symptoms and consequences.",
    poor: "The client has little awareness that clinically significant symptoms, patterns, or risks are present.",
    mixed: "Insight differs by topic, emotional state, symptom, or context.",
    other:
      "Use this when awareness differs across symptoms, patterns, risks, or areas of functioning, or when additional clarification is needed.",
  },
  judgment: {
    good: "The client generally makes safe and reasonable decisions given developmental stage, information, and context.",
    fair: "Decision-making is mostly adequate but includes some clinically relevant vulnerabilities.",
    limited: "The client repeatedly struggles to apply safer choices or anticipate consequences.",
    poor: "Current decision-making is significantly impaired in a way that affects safety or functioning.",
    mixed: "Judgment changes by topic, emotional state, environment, or available support.",
    other:
      "Use this when decision-making differs across situations, emotional states, or areas of functioning, or when additional clarification is needed.",
  },
  impulse: {
    intact: "No current clinically meaningful difficulty inhibiting behavior is evident.",
    fair: "Some difficulty is present, but behavioral control is generally manageable.",
    limited: "The client repeatedly struggles to inhibit unsafe or impairing behavior.",
    poor: "Behavioral control is significantly impaired in the current context.",
    other:
      "Use this when behavioral control differs across situations, emotional states, or types of impulses, or when additional clarification is needed.",
  },
  sib: {
    denied: "No current self-injury urges or behavior are reported.",
    urges: "The client reports wanting or feeling compelled to self-harm without recent behavior.",
    recent: "Self-injurious behavior occurred recently.",
    history: "There is a history of SIB without current urges or behavior.",
    other:
      "Use this when urges, behavior, suicidal intent, method, frequency, or timing are not adequately represented by the listed choices, or when additional clarification is needed.",
  },
  si: {
    denied: "No current suicidal thoughts are reported.",
    passive:
      "The client reports thoughts of death, disappearing, or not wanting to exist, without active thoughts of taking their life.",
    activeNoIntent: "The client reports thoughts of suicide but denies intending to act.",
    activeIntent: "The client reports suicidal thoughts and intent to act.",
    other:
      "Use this when the frequency, duration, intensity, planning, intent, or relationship to behavior is not adequately represented by the listed choices, or when additional clarification is needed.",
  },
  hi: {
    denied: "No homicidal ideation is reported.",
    passive:
      "The client reports vague or non-specific thoughts without intent or a developed plan.",
    active:
      "The client reports more specific thoughts of harming or killing another person. Use when the thoughts reflect a desire, fantasy, threat, or possibility of harming another person and assess target, intent, planning, access, and risk.",
    other:
      "Use this when the experience may involve anger, intrusive thoughts, fantasy, threats, an unclear target, planning, intent, or risk that is not adequately represented by the listed choices, or when additional clarification is needed.",
  },
};

// Visual guides are teaching aids only. The observation examples are illustrative,
// never inserted into a note or used to select a finding automatically.
const mseVisualGuides = {
  speech: {
    normal: "Speech has a conversational rate, rhythm, volume, and amount, with ordinary pauses.",
    rapid: "Words come quickly, but the client can pause for another speaker and redirect.",
    pressured:
      "Speech feels driven, continues with few pauses, and is difficult to interrupt; it may resume quickly after interruption.",
    slow: "Words are produced at a slower pace once the client begins speaking.",
    quiet: "Speech is low in volume. This describes loudness, not the amount said.",
    latent: "There is a noticeable delay between a question and the start of the response.",
    impoverished:
      "Responses remain brief across topics, with little spontaneous elaboration even after prompting.",
    other:
      "Describe a feature not captured above, such as unusual rhythm, articulation, fluency, or intonation.",
  },
  thoughtProcess: {
    linear: "An answer follows understandable connections toward the question or goal.",
    circumstantial:
      "The answer includes substantial background and side details before reaching the point.",
    tangential: "The answer moves onto another topic without returning to the question.",
    perseverative:
      "The client repeatedly returns to the same topic even as the conversation moves on.",
    flight: "Ideas change rapidly while the links between them remain understandable.",
    blocking:
      "An ongoing train of thought stops suddenly, and the client may be unable to resume it; this differs from a delay before answering.",
    disorganized: "It is difficult to follow how one idea relates to the next.",
    other:
      "Describe the actual pattern and whether the client reaches the point or benefits from redirection.",
  },
};

/* Small helpers that make the data above easier to read. */

// Package the internal value, button label, and sentence for one choice.
function option(value, label, sentence) {
  return { value, label, sentence };
}

// Context examples are placeholder hints only; they never populate the clinical note.
const mseContextNoteExamples = {
  appearance: [
    "Arrived in work clothing immediately after a shift.",
    "Appearance could only be partially assessed by video.",
  ],
  behavior: [
    "Participation improved with a predictable structure.",
    "Used a movement break and returned to the activity.",
    "Initially reserved; engagement increased with rapport.",
  ],
  eyeContact: ["Limited eye contact with continued engagement.", "Eye contact varied by topic."],
  speech: [
    "Needed extra time to formulate responses.",
    "Brief responses became more detailed with prompting.",
  ],
  affect: [
    "Expression became more varied as rapport developed.",
    "Client described a usually reserved expressive style.",
  ],
  thoughtProcess: [
    "Returned to the question with brief redirection.",
    "Organization improved with one question at a time.",
  ],
  thoughtContent: [
    "Thoughts described as unwanted rather than endorsed beliefs.",
    "Conviction varied when alternatives were explored.",
    "Content was difficult to assess because responses were limited.",
  ],
  perception: [
    "Experience reported only while falling asleep.",
    "No similar experience reported during the interview.",
    "Client distinguished the experience from external events.",
  ],
  attentionMemory: [
    "Followed one question at a time more easily.",
    "Recalled details with a reminder of the topic.",
    "Attention improved with brief breaks.",
  ],
  insight: [
    "Limited but developing awareness of trauma-related patterns.",
    "Understanding was concrete and consistent with developmental level.",
    "Recognized patterns with simplified language and repeated examples.",
  ],
  judgment: [
    "Reasoning improved with concrete choices and prompting.",
    "Ability to anticipate consequences varied with emotional activation.",
    "Assessment was limited by difficulty understanding hypothetical questions.",
  ],
  impulse: [
    "No difficulty inhibiting behavior observed during this visit; difficulties reported in other settings.",
    "Needed external prompts to pause before acting.",
    "Behavioral inhibition improved with structure and breaks.",
  ],
};

// Other fields are user-entered descriptions, not prefilled clinical findings.
const mseOtherHints = {
  mood: "‘fucked up’ / ‘numb’ / ‘all over the place’",
  sib: "Current status could not be established / Client declined to discuss self-injury / Reported behavior with unclear intent",
  si: "Client declined to answer / Current ideation could not be established / Client and collateral reports differed",
  hi: "Client declined to answer / Meaning of a statement about harming someone remained unclear / Current ideation could not be established",
};

// These mappings control visibility only, never infer an observation from a finding.
const mseObservationRelevance = {
  behavior: { engaged: ["guarded", "withdrawn", "restless", "agitated", "other"] },
  eyeContact: { engaged: ["limited", "avoidant", "intense", "variable"] },
  speech: {
    responseTime: ["slow", "latent", "impoverished", "other"],
    engaged: ["rapid", "pressured", "slow", "quiet", "latent", "impoverished", "other"],
  },
  affect: {
    engaged: ["restricted", "blunted", "flat", "labile", "incongruent", "tearful", "other"],
  },
  thoughtProcess: {
    redirectable: [
      "circumstantial",
      "tangential",
      "perseverative",
      "flight",
      "disorganized",
      "other",
    ],
    responseTime: ["blocking", "disorganized", "other"],
  },
  attentionMemory: {
    redirectable: ["mild", "moderate", "severe", "other"],
    responseTime: ["mild", "moderate", "severe", "other"],
    engaged: ["mild", "moderate", "severe", "other"],
  },
};

/**
 * MSE CLINICAL CONTENT
 * ------------------------------------------------------------
 * Edit clinical wording here.
 *
 * Each section can include:
 *   - options: selectable choices and generated sentences
 *   - info.questions: prompts that build clinical reasoning
 *
 * The interface code lives in app.js.
 */

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
      option("inappropriate", "Inappropriate setting/weather", "Appearance inappropriate for setting or weather."),
      option("other", "Other", "Appearance otherwise notable.")
    ],
    info: {
      questions: [
        "Could this appearance be explained by the setting, weather, culture, finances, sensory needs, work/school, transportation, or telehealth rather than psychopathology?",
        "Does this represent the client's typical level of functioning, or is it a situational or temporary change?",
        "Would documenting this observation meaningfully improve another clinician's understanding of the client?"
      ]
    }
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
      option("other", "Other", "Behavior otherwise notable.")
    ],
    info: {
      questions: [
        "Does this describe the client's overall behavioral pattern, or is it better explained by speech style, anxiety, neurodevelopment, or the specific topic being discussed?",
        "Is this behavior consistent throughout the interaction, or does it change across situations, topics, or emotional states?",
        "Does this behavior represent the client's baseline, or a meaningful change in functioning?"
      ]
    }
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
      option("variable", "Variable", "Eye contact variable.")
    ],
    info: {
      questions: [
        "Could this pattern of eye contact be better explained by autism, anxiety, trauma, culture, or the telehealth setting than by psychopathology?",
        "Is the quality of eye contact clinically meaningful, or simply different from my own expectations or communication style?"
      ]
    }
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
      option("impoverished", "Impoverished", "Speech impoverished with reduced quantity and spontaneity."),
      option("other", "Other", "Speech otherwise notable.")
    ],
    info: {
      questions: [
        "Which aspect of speech is actually abnormal--rate, volume, response latency, quantity, rhythm, or fluency--and are multiple characteristics present?",
        "Could anxiety, autism, depression, fatigue, medication effects, language differences, or processing speed better explain these speech characteristics?",
        "Is limited verbal output due to impoverished speech, or is the client selectively withholding information because they are guarded?"
      ]
    }
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
      option("other", "Other", "Mood otherwise notable.")
    ],
    info: {
      questions: [
        "Is this the client's reported internal emotional experience, or am I inferring mood from observed affect or behavior?",
        "Does the reported mood remain consistent throughout the interview, and is it congruent with the observed affect?"
      ]
    }
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
      option("other", "Other", "Affect otherwise notable.")
    ],
    info: {
      questions: [
        "Which aspect of affect is notable--range, intensity, stability, congruence, or emotional expression--and are multiple characteristics present?",
        "Could autism, masking, culture, medication, trauma, personality style, or exhaustion better explain the observed affect?",
        "Does this reflect what was actually observed, rather than my expectation of how the client \"should\" express emotion?"
      ]
    }
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
      option("blocking", "Thought blocking", "Thought process notable for intermittent thought blocking."),
      option("disorganized", "Disorganized", "Thought process disorganized."),
      option("other", "Other", "Thought process otherwise notable.")
    ],
    info: {
      questions: [
        "Is the primary difficulty organization, speed, persistence, or maintaining the thread of conversation, and are multiple thought process abnormalities present?",
        "Do the client's associations remain understandable, and do they ultimately answer the original question?",
        "Could anxiety, ADHD, autism, language differences, or communication style better explain this presentation?"
      ]
    }
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
      option("other", "Other", "Thought content otherwise notable.")
    ],
    info: {
      questions: [
        "Is the concern the content of the client's thoughts, or the way those thoughts are connected and communicated?",
        "Are these thoughts intrusive, repetitive, emotionally dominant, suspicious, fixed, or simply understandable reactions to the client's circumstances?"
      ]
    }
  },

  {
    type: "single",
    id: "perception",
    title: "Perception",
    normal: "none",
    observation: true,
    options: [
      option("none", "None observed/reported", "No perceptual disturbance observed or reported."),
      option("internalStimuli", "Responding to internal stimuli", "Client appeared to respond to internal stimuli."),
      option("auditory", "Auditory hallucinations", "Client reported auditory hallucinations."),
      option("visual", "Visual hallucinations", "Client reported visual hallucinations."),
      option("command", "Command hallucinations", "Client reported command hallucinations."),
      option("unclear", "Unclear/assess further", "Perceptual disturbance unclear and requires further assessment."),
      option("other", "Other", "Perception otherwise notable.")
    ],
    info: {
      questions: [
        "Was this experience directly observed, reported by the client, or inferred from behavior, and how confident am I in that distinction?",
        "Could trauma, dissociation, intrusive thoughts, sleep deprivation, substance use, or another explanation better account for this experience?",
        "Does this finding have immediate implications for safety, distress, or level of care?"
      ]
    }
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
      { id: "situation", label: "Situation" }
    ],
    info: {       
      questions: [
        "Is this true disorientation, or could anxiety, dissociation, inattention, fatigue, misunderstanding, or joking better explain the presentation?",
        "Which specific domains are impaired, and does this require medical or psychiatric follow-up?"
      ]
    }
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
      option("moderate", "Moderate impairment", "Attention, concentration, and/or memory moderately impaired."),
      option("severe", "Severe impairment", "Attention, concentration, and/or memory severely impaired."),
      option("other", "Other", "Attention, concentration, and/or memory otherwise notable.")
    ],
    info: {
      questions: [
        "Is the difficulty primarily attention, concentration, memory, or a combination, and how does it affect participation in the session?",
        "Could ADHD, anxiety, depression, dissociation, sleep deprivation, intoxication, medication effects, or a cognitive disorder better explain these findings?"
      ]
    }
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
      option("other", "Other", "Insight otherwise notable.")
    ],
    info: {
      questions: [
        "How well does the client recognize their symptoms, patterns, needs, and the impact those have on their life?",
        "Could development, trauma, neurodevelopment, shame, fear, or mistrust affect what they can acknowledge?",
        "Does the client truly lack insight, or do they understand the concern but disagree, prioritize different values, or reach a different conclusion?"
      ]
    }
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
      option("other", "Other", "Judgment otherwise notable.")
    ],
    info: {
      questions: [
        "Given the client's developmental stage, available information, emotional state, and environment, how reasonable were their decisions?",
        "Does this reflect impaired judgment, or simply an unfavorable outcome?",
        "Could trauma, coercion, neurodevelopment, emotional activation, or limited options better explain the client's decisions?"
      ]
    }
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
      option("other", "Other", "Impulse control otherwise notable.")
    ],
    info: {
      questions: [
        "Does the client have difficulty inhibiting behavior, or are the primary problems poor coping skills, emotional overwhelm, environmental factors, or limited opportunities to use better strategies?",
        "Is this conclusion supported by observed behavior, recent behavior, or meaningful risk?"
      ]
    }
  },

  {
    type: "single",
    id: "sib",
    title: "Self-Injury",
    normal: "denied",
    observation: true,
    options: [
      option("denied", "Denied current SIB/urges", "Denied current SIB urges or behavior."),
      option("urges", "Current urges, no behavior", "Reported current SIB urges without recent self-injurious behavior."),
      option("recent", "Recent SIB", "Reported recent self-injurious behavior."),
      option("history", "History only", "Reported history of SIB without current urges or behavior."),
      option("other", "Other", "Self-injury status otherwise notable.")
    ],
    info: {
      questions: [
        "Are there urges, behavior, or both, and when did self-injury most recently occur?",
        "Is the behavior suicidal, non-suicidal, mixed, or still unclear, and does it require a more comprehensive risk assessment?"
      ]
    }
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
      option("other", "Other", "Suicidal ideation otherwise notable.")
    ],
    info: {
      questions: [
        "Are the thoughts passive or active, and is there intent, planning, access to means, preparatory behavior, or recent suicidal behavior?",
        "Does the current presentation require a comprehensive suicide risk assessment or a higher level of care?"
      ]
    }
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
      option("other", "Other", "Homicidal ideation otherwise notable.")
    ],
    info: {
      questions: [
        "Does this represent anger, an intrusive thought, a fantasy, a threat, intent, or a plan, and is there an identifiable target?",
        "What is the client's access to means, current level of risk, and need for immediate intervention or a comprehensive violence risk assessment?"
      ]
    }
  }
];

const optionHelp = {
  "appearance": {
    "appropriate": "Presentation is adequate for the setting and does not raise a clinically meaningful concern.",
    "disheveled": "Hair, clothing, or overall presentation appears noticeably unkempt. Describes appearance or presentation.",
    "poorHygiene": "There are observable concerns with basic hygiene or hygiene-related ADLs, such as bathing, oral care, body odor, or changing into clean clothing.",
    "inappropriate": "Clothing or presentation is meaningfully mismatched to the setting, weather, or situation.",
    "other": "Use this for other clinically meaningful aspects of appearance, including presentation that does not fit the listed choices, or when additional clarification is needed."
  },
  "behavior": {
    "cooperative": "The client participates, answers questions, and engages, even if anxious, tearful, or upset.",
    "guarded": "The client engages but protects information, avoids elaboration, or selectively avoids topics. Describes behavior or speech that is limited or selective.",
    "withdrawn": "The client shows reduced interpersonal engagement or responsiveness overall. Describes behavior or speech that is reduced across the interaction rather than only around certain topics.",
    "restless": "The body does not settle: fidgeting, shifting, bouncing a leg, pacing, or repeatedly getting up. The client may still be calm and engaged.",
    "agitated": "Restless body movement that is accompanied by visible emotional escalation, irritability, anger, anxiety, distress, or difficulty calming down.",
    "other": "Use this for other clinically meaningful behavior, including changes in engagement, motor activity, or interpersonal presentation, or when additional clarification is needed."
  },
  "eyeContact": {
    "appropriate": "Eye contact fits the interaction and context.",
    "limited": "The client makes little direct eye contact. Describes eye contact that is infrequent without clear evidence that the client is trying to avoid it.",
    "avoidant": "The client appears to actively avoid eye contact. Describes eye contact that is actively turned away, looked down, or otherwise evaded.",
    "intense": "Eye contact is unusually sustained or forceful enough to be clinically notable. Describes eye contact that is intense or fixated. ",
    "variable": "Eye contact changes across topics, emotional states, or moments in session. Describes eye contact that is inconsistent or fluctuating."
  },
  "speech": {
    "normal": "Rate, rhythm, volume, and amount of speech are unremarkable.",
    "rapid": "The client speaks quickly but can pause, be interrupted, and redirect.",
    "pressured": "Speech feels driven, is difficult to interrupt, and resumes quickly after interruption.",
    "slow": "Words and sentences are produced at a reduced rate.",
    "quiet": "Volume is low, while the amount and content of speech may otherwise be normal.",
    "latent": "There is a noticeable delay before the client begins responding.",
    "impoverished": "The client produces little speech or spontaneous elaboration, often using brief responses across topics. Verbal output remains sparse across topics, even after prompting.",
    "other": "Use this for other clinically meaningful speech characteristics, including unusual rhythm, articulation, fluency, or prosody, or when additional clarification is needed."
  },
  "mood": {
    "euthymic": "Mood is relatively neutral or stable without a prominent depressive, anxious, irritable, or elevated state.",
    "anxious": "The client reports worry, apprehension, tension, or fearfulness.",
    "depressed": "The client reports low mood, sadness, heaviness, hopelessness, or related depressive experience.",
    "irritable": "The client reports feeling easily annoyed, frustrated, or reactive.",
    "dysphoric": "The client reports a broadly distressed, unpleasant, or emotionally uncomfortable mood.",
    "euphoric": "Mood is unusually elevated, expansive, or intensely positive.",
    "other": "Use this when the client's reported mood is better described by another term or includes a mixed or unclear emotional state, or when additional clarification is needed."
  },
  "affect": {
    "congruentFull": "Affect fits the mood or topic and shows a broad, flexible range of emotional expression.",
    "incongruent": "Affect does not fit the reported mood or emotional content being discussed.",
    "restricted": "Emotion is clearly present, but the range is narrow. The client may smile briefly or become mildly tearful while otherwise staying fairly neutral.",
    "blunted": "Emotion is present but muted. Facial expression and vocal emotion change less than expected when meaningful topics arise.",
    "flat": "Emotional expression is almost absent. Emotionally meaningful and neutral topics are discussed with essentially the same expression and tone.",
    "labile": "Affect shifts rapidly or intensely and may appear difficult to control or regulate.",
    "tearful": "The client is visibly crying or near tears.",
    "other": "Use this for other clinically meaningful qualities of emotional expression, including changes in range, intensity, stability, or congruence, or when additional clarification is needed."
  },
  "thoughtProcess": {
    "linear": "Thoughts are organized, connected, and move toward answering the question or goal.",
    "circumstantial": "The client includes excessive detail but eventually answers the original question.",
    "tangential": "The client moves away from the question and never gets back to the point.",
    "perseverative": "The client repeatedly returns to the same idea, phrase, concern, or topic.",
    "flight": "Ideas move rapidly, but the connections remain understandable.",
    "blocking": "The train of thought suddenly stops, and the client may be unable to continue or recover it.",
    "disorganized": "Connections between ideas become difficult or impossible to follow.",
    "other": "Use this for other clinically meaningful patterns in how thoughts are organized, connected, or expressed, or when additional clarification is needed."
  },
  "thoughtContent": {
    "unremarkable": "No clinically notable delusional, paranoid, obsessional, or unusually dominant thought content is evident.",
    "ruminative": "The client repeatedly thinks about distress, losses, mistakes, problems, or emotionally charged material.",
    "preoccupied": "A particular concern dominates attention and repeatedly pulls the conversation back to it.",
    "obsessional": "Thoughts, images, or urges are intrusive, unwanted, and difficult to dismiss.",
    "paranoid": "The client expresses suspiciousness or fear of being watched, harmed, targeted, or deceived.",
    "delusional": "The client holds a fixed false belief that is not responsive to evidence.",
    "other": "Use this for other clinically meaningful themes, beliefs, fears, urges, or preoccupations, or when additional clarification is needed."
  },
  "perception": {
    "none": "No perceptual disturbance is reported and none is apparent during the interaction.",
    "internalStimuli": "The client appears to listen, look toward, speak to, or react to stimuli that are not externally present.",
    "auditory": "The client reports hearing voices or sounds others do not hear.",
    "visual": "The client reports seeing things others do not see.",
    "command": "The client reports voices instructing them to act.",
    "unclear": "The experience may be perceptual, dissociative, intrusive, trauma-related, substance-related, or otherwise unclear.",
    "other": "Use this for other clinically meaningful sensory or perceptual experiences, including experiences that do not fit the listed choices, or when additional clarification is needed."
  },
  "orientation": {
    "person": "Knows who they are; disorientation to person is uncommon and clinically significant.",
    "place": "Knows where they are or understands the setting.",
    "time": "Reasonably understands the date, day, month, year, or current time period.",
    "situation": "Understands why they are there and what is happening."
  },
  "attentionMemory": {
    "intact": "The client follows the conversation and recalls relevant information without a clinically meaningful problem.",
    "mild": "The client is distractible or forgetful but remains redirectable and able to participate.",
    "moderate": "Frequent redirection or repetition is needed, and participation is meaningfully affected.",
    "severe": "The client cannot reliably sustain the interaction or recall basic relevant information.",
    "other": "Use this when attention, concentration, and memory differ from one another or cannot be represented by a single overall rating, or when additional clarification is needed."
  },
  "insight": {
    "good": "The client recognizes relevant symptoms, patterns, needs, or consequences.",
    "fair": "The client has partial awareness but may not fully recognize impact or patterns.",
    "limited": "The client minimizes, externalizes, or struggles to connect symptoms and consequences.",
    "poor": "The client has little awareness that clinically significant symptoms, patterns, or risks are present.",
    "mixed": "Insight differs by topic, emotional state, symptom, or context.",
    "other": "Use this when awareness differs across symptoms, patterns, risks, or areas of functioning, or when additional clarification is needed."
  },
  "judgment": {
    "good": "The client generally makes safe and reasonable decisions given developmental stage, information, and context.",
    "fair": "Decision-making is mostly adequate but includes some clinically relevant vulnerabilities.",
    "limited": "The client repeatedly struggles to apply safer choices or anticipate consequences.",
    "poor": "Current decision-making is significantly impaired in a way that affects safety or functioning.",
    "mixed": "Judgment changes by topic, emotional state, environment, or available support.",
    "other": "Use this when decision-making differs across situations, emotional states, or areas of functioning, or when additional clarification is needed."
  },
  "impulse": {
    "intact": "No current clinically meaningful difficulty inhibiting behavior is evident.",
    "fair": "Some difficulty is present, but behavioral control is generally manageable.",
    "limited": "The client repeatedly struggles to inhibit unsafe or impairing behavior.",
    "poor": "Behavioral control is significantly impaired in the current context.",
    "other": "Use this when behavioral control differs across situations, emotional states, or types of impulses, or when additional clarification is needed."
  },
  "sib": {
    "denied": "No current self-injury urges or behavior are reported.",
    "urges": "The client reports wanting or feeling compelled to self-harm without recent behavior.",
    "recent": "Self-injurious behavior occurred recently.",
    "history": "There is a history of SIB without current urges or behavior.",
    "other": "Use this when urges, behavior, suicidal intent, method, frequency, or timing are not adequately represented by the listed choices, or when additional clarification is needed."
  },
  "si": {
    "denied": "No current suicidal thoughts are reported.",
    "passive": "The client reports thoughts of death, disappearing, or not wanting to exist, without active thoughts of taking their life.",
    "activeNoIntent": "The client reports thoughts of suicide but denies intending to act.",
    "activeIntent": "The client reports suicidal thoughts and intent to act.",
    "other": "Use this when the frequency, duration, intensity, planning, intent, or relationship to behavior is not adequately represented by the listed choices, or when additional clarification is needed."
  },
  "hi": {
    "denied": "No homicidal ideation is reported.",
    "passive": "The client reports vague or non-specific thoughts without intent or a developed plan.",
    "active": "The client reports more specific thoughts of harming or killing another person. Use when the thoughts reflect a desire, fantasy, threat, or possibility of harming another person and assess target, intent, planning, access, and risk.",
    "other": "Use this when the experience may involve anger, intrusive thoughts, fantasy, threats, an unclear target, planning, intent, or risk that is not adequately represented by the listed choices, or when additional clarification is needed."
  }
};

/* Small helpers that make the data above easier to read. */
function option(value, label, sentence) {
  return { value, label, sentence };
}

function item(term, text) {
  return { term, text };
}

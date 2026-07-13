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
  "\"Erased\" your skin",
  "Other"
];

const REASONS = [
  "To avoid school, work, or other activities",
  "To relieve feeling \"numb\" or empty",
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
  "Other"
];

const FACTORS = ["SNR","ANR","SPR","APR","SNR","SPR","SPR","SPR","SNR","APR","SPR","SPR","SNR","ANR","SPR","SPR","SPR","SPR","SPR","SPR","SPR","APR",null];
const FACTOR_INFO = {
  ANR:{name:"Automatic Negative Reinforcement",description:"Reducing or escaping unwanted internal experiences"},
  APR:{name:"Automatic Positive Reinforcement",description:"Generating an internal sensation or experience"},
  SNR:{name:"Social Negative Reinforcement",description:"Escaping or avoiding interpersonal demands or situations"},
  SPR:{name:"Social Positive Reinforcement",description:"Obtaining attention, support, response, or interpersonal change"}
};
const FACTOR_ORDER = ["ANR","APR","SNR","SPR"];
const REASON_OPTIONS = [{value:0,label:"Never"},{value:1,label:"Rarely"},{value:2,label:"Some"},{value:3,label:"Often"}];
const CONTEXT_OPTIONS = {
  intent:["No","Yes"],
  delay:["None","A few minutes","Less than 60 minutes","More than 1 hour but less than 24 hours","More than 1 day but less than a week","Greater than a week"],
  substances:["No","Yes"],
  pain:["No pain","Little pain","Moderate pain","Severe pain"]
};
const $ = id => document.getElementById(id);
let behaviors = [], reasons = [], context = {}, lifetime = "No", otherReason = "";

function reset(){
  behaviors=BEHAVIORS.map(()=>({selected:false,count:0,medical:"No",other:""}));
  reasons=REASONS.map(()=>0);
  context={intent:"No",delay:"None",substances:"No",pain:"No pain",age:""};
  lifetime="No";
  otherReason="";
  render();
}

function render(){renderBehaviors();renderLifetime();renderContext();renderReasons();update()}

function renderBehaviors(){
  $("behavior-list").innerHTML=BEHAVIORS.map((name,i)=>{const item=behaviors[i];return `<div class="behavior-row"><div class="behavior-name"><label><input type="checkbox" data-behavior-check="${i}" ${item.selected?"checked":""}> ${i+1}. ${name}</label>${i===11?`<input class="other-input" type="text" data-behavior-other="${i}" value="${escapeAttr(item.other)}" placeholder="Describe other behavior">`:""}</div><label class="field-label">How many times?<input type="number" min="1" step="1" data-behavior-count="${i}" value="${item.selected?item.count:""}" ${item.selected?"":"disabled"}></label><div><span class="small-label">Medical treatment?</span></div><div class="segmented-options">${["No","Yes"].map(value=>`<button type="button" class="segment-button ${item.medical===value&&item.selected?"selected":""}" data-medical="${i}" data-value="${value}" ${item.selected?"":"disabled"}>${value}</button>`).join("")}</div></div>`}).join("");
  document.querySelectorAll("[data-behavior-check]").forEach(input=>input.onchange=()=>{const item=behaviors[Number(input.dataset.behaviorCheck)];item.selected=input.checked;item.count=input.checked?Math.max(1,item.count||0):0;if(!input.checked)item.medical="No";renderBehaviors();update()});
  document.querySelectorAll("[data-behavior-count]").forEach(input=>input.oninput=()=>{behaviors[Number(input.dataset.behaviorCount)].count=Math.max(1,Math.floor(Number(input.value)||1));update()});
  document.querySelectorAll("[data-behavior-other]").forEach(input=>input.oninput=()=>{behaviors[Number(input.dataset.behaviorOther)].other=input.value;update()});
  document.querySelectorAll("[data-medical]").forEach(button=>button.onclick=()=>{behaviors[Number(button.dataset.medical)].medical=button.dataset.value;renderBehaviors();update()});
}

function renderLifetime(){
  $("lifetime-options").innerHTML=["No","Yes","Not documented"].map(value=>`<button type="button" class="segment-button ${lifetime===value?"selected":""}" data-lifetime="${value}">${value}</button>`).join("");
  document.querySelectorAll("[data-lifetime]").forEach(button=>button.onclick=()=>{lifetime=button.dataset.lifetime;renderLifetime();update()});
}

function renderContext(){
  const fields=[
    ["intent","C. While doing any of the above acts, were you trying to kill yourself?"],
    ["delay","D. How long did you think about doing the act(s) before actually doing them?"],
    ["substances","E. Did any of the behaviors occur while taking drugs or alcohol?"],
    ["pain","F. Did you experience pain during the self-harm?"]
  ];
  $("context-fields").innerHTML=fields.map(([key,label])=>`<div class="context-item"><h3>${label}</h3><div class="segmented-options">${CONTEXT_OPTIONS[key].map(value=>`<button type="button" class="segment-button ${context[key]===value?"selected":""}" data-context="${key}" data-value="${value}">${value}</button>`).join("")}</div></div>`).join("")+`<div class="context-item"><h3>G. How old were you when you first harmed yourself in this way?</h3><input class="age-input" id="onset-age" type="number" min="0" max="120" step="1" value="${escapeAttr(context.age)}" placeholder="Age"></div>`;
  document.querySelectorAll("[data-context]").forEach(button=>button.onclick=()=>{context[button.dataset.context]=button.dataset.value;renderContext();update()});
  $("onset-age").oninput=event=>{context.age=event.target.value;update()};
}

function renderReasons(){
  $("reason-list").innerHTML=REASONS.map((text,i)=>`<section class="card reason-card"><h2><span class="question-number">${i+1}.</span>${text}</h2>${i===22?`<input class="other-input" id="other-reason" type="text" value="${escapeAttr(otherReason)}" placeholder="Describe other reason">`:""}<div class="response-grid">${REASON_OPTIONS.map(option=>`<label class="response-option"><input type="radio" name="reason-${i}" value="${option.value}" ${reasons[i]===option.value?"checked":""}><span>${option.value}<br>${option.label}</span></label>`).join("")}</div></section>`).join("");
  document.querySelectorAll('[name^="reason-"]').forEach(input=>input.onchange=()=>{reasons[Number(input.name.split("-")[1])]=Number(input.value);update()});
  const other=$("other-reason");if(other)other.oninput=event=>{otherReason=event.target.value;update()};
}

function functionScores(){
  return Object.fromEntries(FACTOR_ORDER.map(code=>{const indexes=FACTORS.map((factor,i)=>factor===code?i:-1).filter(i=>i>=0);const total=indexes.reduce((sum,i)=>sum+reasons[i],0);return [code,{mean:total/indexes.length,total,count:indexes.length}]}));
}

function update(){
  const selected=selectedBehaviors(), incidents=selected.reduce((sum,item)=>sum+item.count,0), scores=functionScores();
  $("method-count").textContent=selected.length;
  $("incident-count").textContent=incidents;
  $("intent-alert").hidden=context.intent!=="Yes";
  $("function-results").innerHTML=FACTOR_ORDER.map(code=>{const info=FACTOR_INFO[code],score=scores[code];return `<div class="function-card"><h3>${info.name}</h3><div class="function-score">${score.mean.toFixed(2)} / 3</div><div class="function-description">${info.description}</div><div class="function-bar"><span style="width:${score.mean/3*100}%"></span></div></div>`}).join("");
  const ranked=REASONS.slice(0,22).map((text,i)=>({text,value:reasons[i]})).filter(item=>item.value>0).sort((a,b)=>b.value-a.value);
  $("highest-reasons").innerHTML=ranked.length?ranked.slice(0,5).map(item=>`<p><strong>${REASON_OPTIONS[item.value].label} (${item.value}):</strong> ${item.text}</p>`).join(""):"<p>No reasons endorsed above Never.</p>";
  const detailed=document.querySelector('[name="outputStyle"]:checked').value==="detailed";
  $("output").value=detailed?detailedOutput(selected,incidents,scores):summaryOutput(selected,incidents,scores,ranked);
}

function selectedBehaviors(){return behaviors.map((item,i)=>({...item,name:i===11&&item.other.trim()?item.other.trim():BEHAVIORS[i]})).filter(item=>item.selected)}

function summaryOutput(selected,incidents,scores,ranked){
  const methodText=selected.length?selected.map(item=>`${item.name} (${item.count} time${item.count===1?"":"s"}${item.medical==="Yes"?", medical treatment received":""})`).join(", "):"no past-year self-harm behaviors";
  const functions=FACTOR_ORDER.map(code=>`${FACTOR_INFO[code].name} ${scores[code].mean.toFixed(2)}/3`).join(", ");
  const top=ranked.length?ranked.slice(0,3).map(item=>`${item.text} (${REASON_OPTIONS[item.value].label})`).join("; "):"none endorsed above Never";
  return `FASM completed. The client reported ${methodText}, totaling ${incidents} reported incident${incidents===1?"":"s"} during the past year. Lifetime history outside the past year: ${lifetime}. Suicidal intent during the reported acts: ${context.intent}. Typical contemplation period was ${context.delay.toLowerCase()}; substance involvement was ${context.substances.toLowerCase()}; pain was rated ${context.pain.toLowerCase()}${context.age!==""?`; age at first self-harm was ${context.age}`:""}. Function means were ${functions}. Highest endorsed reasons were ${top}. The FASM has no diagnostic cutoff; results require integration with clinical interview and direct safety assessment.`;
}

function detailedOutput(selected,incidents,scores){
  const lines=["Functional Assessment of Self-Mutilation (FASM)","","Past-Year Behaviors"];
  if(selected.length)selected.forEach(item=>lines.push(item.name,`Frequency: ${item.count}`,`Medical treatment: ${item.medical}`,""));else lines.push("None endorsed","");
  lines.push(`Total methods: ${selected.length}`,`Total reported incidents: ${incidents}`,`Lifetime history outside past year: ${lifetime}`,"","Contextual Features",`Suicidal intent during acts: ${context.intent}`,`Contemplation period: ${context.delay}`,`Drugs or alcohol: ${context.substances}`,`Pain: ${context.pain}`,`Age at first self-harm: ${context.age||"Not documented"}`,"","Function Profiles");
  FACTOR_ORDER.forEach(code=>lines.push(`${FACTOR_INFO[code].name}: ${scores[code].mean.toFixed(2)} / 3 (${scores[code].total}/${scores[code].count*3})`));
  lines.push("","Reason Ratings");
  REASONS.forEach((text,i)=>lines.push("",`${i+1}. ${i===22&&otherReason.trim()?otherReason.trim():text}`,`${REASON_OPTIONS[reasons[i]].label} - ${reasons[i]}`));
  lines.push("","Interpretation","Function scores are descriptive mean item ratings. No diagnostic cutoff is established. Integrate findings with clinical interview, behavioral context, and direct suicide risk assessment.");
  return lines.join("\n");
}

function escapeAttr(value=""){return String(value).replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;")}

$("reset-button").onclick=reset;
document.querySelectorAll('[name="outputStyle"]').forEach(input=>input.onchange=update);
$("copy-button").onclick=async()=>{await navigator.clipboard.writeText($("output").value);$("copy-status").textContent="Copied";setTimeout(()=>$("copy-status").textContent="",1500)};
$("select-button").onclick=()=>{$("output").focus();$("output").select()};
reset();

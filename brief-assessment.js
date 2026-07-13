const YES_NO = [{ label: "No", value: 0 }, { label: "Yes", value: 1 }];
const FREQ5 = ["Never", "Rarely", "Sometimes", "Often", "Very often"].map((label, value) => ({ label, value }));

const MEASURES = {
  mdq: {
    short: "MDQ", title: "Mood Disorder Questionnaire", age: "Adult bipolar-spectrum screening measure.",
    instructions: "Answer each question using the period when the described experiences were most prominent.",
    questions: [
      "Felt so good or hyper that others thought you were not your normal self, or you got into trouble", "Were so irritable that you shouted at people or started fights or arguments", "Felt much more self-confident than usual", "Got much less sleep than usual and did not really miss it", "Were much more talkative or spoke faster than usual", "Thoughts raced or you could not slow your mind down", "Were so easily distracted that you had trouble concentrating or staying on track", "Had much more energy than usual", "Were much more active or did many more things than usual", "Were much more social or outgoing than usual", "Were much more interested in sex than usual", "Did things that were unusual, excessive, foolish, or risky", "Spending money got you or your family into trouble"
    ].map(text => ({ text, options: YES_NO })),
    extras: [
      { text: "Did several endorsed experiences occur during the same period?", options: YES_NO },
      { text: "How much of a problem did these experiences cause?", options: ["No problem", "Minor problem", "Moderate problem", "Serious problem"].map((label, value) => ({ label, value })) },
      { text: "Has a blood relative had manic-depressive illness or bipolar disorder?", options: YES_NO },
      { text: "Has a health professional ever told you that you have bipolar disorder?", options: YES_NO }
    ], max: 13,
    score(a) { const symptoms=a.slice(0,13).reduce(sum,0), concurrent=a[13]===1, impairment=a[14]>=2; return { score:`${symptoms} / 13 symptoms`, result: symptoms>=7&&concurrent&&impairment?"Positive screen":"Screening criteria not met", note:"A positive MDQ screen requires at least 7 symptoms, co-occurrence, and moderate or serious impairment. It is not a diagnosis." }; },
    note: "Use as a starting point for a full evaluation that considers duration, episodicity, impairment, substances, medications, medical causes, and differential diagnosis.", attribution: "Adapted from Hirschfeld et al., American Journal of Psychiatry (2000)."
  },
  ace: {
    short:"ACEs", title:"Adverse Childhood Experiences (ACEs)", age:"For adults reporting experiences before age 18.", instructions:"Select Yes for every category experienced before the 18th birthday.",
    questions:["Not having enough to eat, having to wear dirty clothes, or having no one to protect or care for you","Loss of a parent through divorce, abandonment, death, or another reason","Living with someone who was depressed, mentally ill, or attempted suicide","Living with someone who had a problem with alcohol or drug use","Adults in the home hitting, punching, beating, or threatening to harm each other","Living with someone who went to jail or prison","A parent or adult in the home swearing at, insulting, or putting you down","A parent or adult in the home hitting, beating, kicking, or physically hurting you","Feeling that no one in the family loved you or thought you were special","Experiencing unwanted sexual contact"].map(text=>({text,options:YES_NO})),
    extras:[{text:"How much do you believe these experiences have affected your health?",options:["Not much","Some","A lot"].map((label,value)=>({label,value}))}], max:10,
    score(a){const n=a.slice(0,10).reduce(sum,0);return{score:`${n} / 10`,result:`${n} ACE ${n===1?"category":"categories"} endorsed`,note:"The ACE total is an exposure count, not a diagnosis or individual prediction. Interpret with strengths, protective experiences, current context, and client choice."};},
    note:"Use trauma-informed administration. Do not require details beyond what is clinically necessary, and explain privacy and confidentiality.", attribution:"California Surgeon General’s Clinical Advisory Committee, ACE Questionnaire for Adults."
  },
  pce: {
    short:"PCEs", title:"Positive Childhood Experiences (PCEs)", age:"Experiences occurring before age 18.", instructions:"Choose the response that best describes the client’s childhood experience.",
    questions:["There was an adult in the household who made you feel safe and protected","You felt that you belonged at your high school","You felt supported by your friends","There were at least two adults, other than your parents, who took a genuine interest in you","You were able to talk to your family about your feelings","You enjoyed participating in your community’s traditions","Your family stood by you during difficult times"].map((text,i)=>({text,options:(i===0?["Never","A little of the time","Some of the time","Most of the time","All of the time"]:["Never","Rarely","Sometimes","Often","Very often"]).map((label,value)=>({label,value:value>=3?1:0,displayValue:value}))})), max:7,
    score(a){const n=a.reduce(sum,0);return{score:`${n} / 7`,result:`${n} positive experience ${n===1?"category":"categories"} endorsed`,note:"Higher totals reflect more endorsed positive childhood experiences. Use the individual responses to identify relational and community strengths; do not treat the total as a diagnostic cutoff."};},
    note:"PCEs complement rather than cancel adverse experiences. Discuss them as potential sources of resilience and connection.", attribution:"Based on Bethell et al., JAMA Pediatrics (2019)."
  },
  asrs: {
    short:"ASRS v1.1",title:"Adult ADHD Self-Report Scale v1.1 - 6-Question Screener",age:"For adults age 18 and older.",instructions:"Rate how you have felt and conducted yourself over the past 6 months.",
    questions:["Trouble wrapping up the final details of a project once the challenging parts have been done","Difficulty getting things in order for a task that requires organization","Problems remembering appointments or obligations","Avoiding or delaying getting started on a task that requires a lot of thought","Fidgeting or squirming with hands or feet when sitting for a long time","Feeling overly active and compelled to do things, as if driven by a motor"].map(text=>({text,options:FREQ5})), max:6,
    score(a){const thresholds=[2,2,2,3,3,3];const n=a.filter((v,i)=>v>=thresholds[i]).length;return{score:`${n} / 6 shaded responses`,result:n>=4?"Symptoms may be consistent with adult ADHD":"Screening threshold not met",note:"Four or more responses in the screener’s shaded range suggest that further clinical evaluation may be beneficial."};},
    note:"This is a screener, not a diagnostic test. Evaluation should address childhood onset, cross-setting impairment, differential diagnosis, sleep, substances, medical factors, and comorbidity.", attribution:"Adult ASRS v1.1 developed with the World Health Organization. © New York University and Ronald C. Kessler, PhD."
  },
  who5: {
    short:"WHO-5",title:"World Health Organization-Five Well-Being Index",age:"Suitable as a brief measure of current mental well-being.",instructions:"Indicate which response is closest to how you have been feeling over the last two weeks.",
    questions:["I have felt cheerful and in good spirits","I have felt calm and relaxed","I have felt active and vigorous","I woke up feeling fresh and rested","My daily life has been filled with things that interest me"].map(text=>({text,options:["At no time","Some of the time","Less than half of the time","More than half of the time","Most of the time","All of the time"].map((label,value)=>({label,value}))})),max:25,
    score(a){const raw=a.reduce(sum,0),pct=raw*4;return{score:`${raw} / 25 (${pct}%)`,result:raw<13?"Below suggested well-being threshold":"At or above suggested well-being threshold",note:"A raw score below 13 (below 50%) has been suggested as an indication for further assessment of possible mental health concerns."};},
    note:"Higher scores indicate better well-being. Interpret alongside symptoms, functioning, context, and clinical interview.",attribution:"© World Health Organization 2024. CC BY-NC-SA 3.0 IGO."
  },
  pcptsd5: {
    short:"PC-PTSD-5",title:"Primary Care PTSD Screen for DSM-5",age:"Brief PTSD screen for adults.",instructions:"Begin with lifetime trauma exposure. If exposure is endorsed, answer the five symptom questions for the past month.",
    questions:[{text:"Have you ever experienced an unusually or especially frightening, horrible, or traumatic event?",options:YES_NO},...[
      "Had nightmares about the event or thought about it when you did not want to","Tried hard not to think about the event or avoided reminders","Been constantly on guard, watchful, or easily startled","Felt numb or detached from people, activities, or surroundings","Felt guilty or unable to stop blaming yourself or others for the event or resulting problems"
    ].map(text=>({text,context:"In the past month",options:YES_NO}))],max:5,
    score(a){const exposed=a[0]===1,n=exposed?a.slice(1).reduce(sum,0):0;return{score:`${n} / 5`,result:exposed?(n>=4?"Positive screen at cut-point 4":"Screening threshold not met"):"No trauma exposure endorsed",note:"A positive screen requires additional assessment. Cut-point performance varies by population and screening purpose; clinical judgment may support a lower threshold in some settings."};},
    note:"A PC-PTSD-5 result does not establish PTSD. Follow a positive screen with a fuller trauma and diagnostic assessment.",attribution:"PC-PTSD-5 (2022), U.S. Department of Veterans Affairs National Center for PTSD."
  },
  crafft: {
    short:"CRAFFT 2.1",title:"CRAFFT 2.1 Adolescent Substance Use Screen",age:"For adolescents and young adults ages 12–21.",instructions:"Enter past-year use days, then answer the six CRAFFT questions. Administer privately whenever possible.",
    questions:[
      {text:"Days in the past 12 months with more than a few sips of alcohol",type:"number"},{text:"Days in the past 12 months using marijuana in any form",type:"number"},{text:"Days in the past 12 months using anything else to get high",type:"number"},
      ...["Ridden in a CAR driven by someone, including yourself, who was high or had been using alcohol or drugs","Used alcohol or drugs to RELAX, feel better about yourself, or fit in","Used alcohol or drugs while you were by yourself, or ALONE","FORGOTTEN things you did while using alcohol or drugs","Had FAMILY or FRIENDS tell you that you should cut down","Gotten into TROUBLE while using alcohol or drugs"].map(text=>({text,options:YES_NO}))
    ],max:6,
    score(a){const use=a.slice(0,3).some(v=>v>0),n=a.slice(3).reduce(sum,0);let result=!use&&n===0?"Low risk":use&&n>=2?"High risk":"Medium risk";return{score:`${n} / 6`,result,note:"High risk: past-year use plus a CRAFFT score of 2 or more. Medium risk includes any past-year use with a score below 2, or no use with endorsement of the CAR item."};},
    note:"Use results for developmentally appropriate brief intervention, driving/riding safety counseling, further assessment, and referral when indicated. Protect adolescent confidentiality within applicable law and policy.",attribution:"CRAFFT 2.1, Center for Adolescent Behavioral Health Research, Boston Children’s Hospital."
  }
};

const key=new URLSearchParams(location.search).get("measure");
const config=MEASURES[key]||MEASURES.mdq;
const allQuestions=[...config.questions,...(config.extras||[])];
let answers=[];
const sum=(a,b)=>a+(Number(b)||0);
const $=id=>document.getElementById(id);

function reset(){answers=allQuestions.map(q=>q.type==="number"?0:0);render();}
function render(){
  document.title=`${config.short} | Clinical Workbench`; $("page-title").textContent=config.short; $("full-title").textContent=config.title; $("instructions").textContent=config.instructions; $("age-note").textContent=config.age;
  $("clinical-note").textContent=config.note; $("attribution").textContent=config.attribution;
  $("questions").innerHTML=allQuestions.map((q,i)=>`<section class="card question-card"><h2><span class="question-number">${i+1}.</span>${q.text}</h2>${q.context?`<p class="question-context">${q.context}</p>`:""}${q.type==="number"?`<label class="number-answer"><input type="number" min="0" step="1" value="${answers[i]}" data-number="${i}"></label>`:`<div class="response-grid compact">${q.options.map((o,j)=>`<label class="response-option"><input type="radio" name="q-${i}" value="${o.value}" data-index="${i}" data-choice="${j}" ${answers[i]===o.value&&((q._choice??0)===j)?"checked":""}><span>${o.label}</span></label>`).join("")}</div>`}</section>`).join("");
  document.querySelectorAll("[data-index]").forEach(el=>el.onchange=()=>{const i=+el.dataset.index;answers[i]=+el.value;allQuestions[i]._choice=+el.dataset.choice;update();});
  document.querySelectorAll("[data-number]").forEach(el=>el.oninput=()=>{answers[+el.dataset.number]=Math.max(0,+el.value||0);update();}); update();
}
function update(){const r=config.score(answers);$("score-display").textContent=r.score;$("result-display").textContent=r.result;$("result-note").textContent=r.note;const detailed=document.querySelector('[name="outputStyle"]:checked').value==="detailed";$("output").value=detailed?detail(r):`${config.short} completed. Score: ${r.score}. Result: ${r.result}. ${r.note}`;}
function labelFor(q,i){if(q.type==="number")return `${answers[i]} days`;const selected=q.options?.[q._choice??0]||(q.options||[]).find(o=>o.value===answers[i]);return selected?selected.label:"Not answered";}
function detail(r){const lines=[config.title,""];allQuestions.forEach((q,i)=>lines.push(`${i+1}. ${q.text}`,labelFor(q,i),""));lines.push(`Score: ${r.score}`,`Result: ${r.result}`,"",r.note);return lines.join("\n");}
$("reset-button").onclick=reset;document.querySelectorAll('[name="outputStyle"]').forEach(x=>x.onchange=update);$("copy-button").onclick=async()=>{await navigator.clipboard.writeText($("output").value);$("copy-status").textContent="Copied";setTimeout(()=>$("copy-status").textContent="",1500);};$("select-button").onclick=()=>{$("output").focus();$("output").select();};reset();

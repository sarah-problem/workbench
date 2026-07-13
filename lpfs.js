const ITEMS = [
  "Across many different situations, I manage to behave in a manner appropriate to that situation.",
  "All I can really understand about other people are their weaknesses.",
  "Almost no close relationship turns out well in the end.",
  "Although I might have different feelings at different times, I can handle all of them pretty well.",
  "Although I try, I can't seem to keep any successful, lasting relationships.",
  "Although I value close relationships, sometimes strong emotions get in the way.",
  "Events in my life can really change whether or not I feel good about myself.",
  "Feedback from others plays a big role in determining what is important to me.",
  "Getting close to others has little appeal to me.",
  "Getting close to others just leaves me vulnerable and isn't really worth the risk.",
  "I can appreciate the viewpoint of other people even when I disagree with them.",
  "I can only get close to somebody who understands me very well.",
  "I can only get close to someone who can acknowledge and address my needs.",
  "I can step back and objectively evaluate the way that I'm feeling at any given time.",
  "I can't always tell the difference between what is my opinion, and what is the way other people want me to think.",
  "I can't even imagine living a life that I would find satisfying.",
  "I can't stand it when there are sharp differences of opinion.",
  "I don't have a clue about why other people do what they do.",
  "I don't have many positive interactions with other people.",
  "I don't pay much attention to, or care very much about, the effect I have on other people.",
  "I don't understand what motivates other people at all.",
  "I don't waste time thinking about my experiences, feelings, and actions.",
  "I have a strong need for others to approve of me.",
  "I have difficult setting and completing goals.",
  "I have little understanding of how I feel or what I do.",
  "I have many satisfying relationships, both personally and on the job.",
  "I have relationships, but not many that I consider to be very close.",
  "I have some difficulty setting goals.",
  "I have trouble deciding between different goals.",
  "I mainly act in the moment, rather than focusing on long term goals.",
  "I mainly pay attention to others to the extent that they are likely to impact me in some way.",
  "I mainly pay attention to people based upon what they might do to me, or for me.",
  "I never seem to have much hope that good things will happen to me.",
  "I set personal standards for myself that are very difficult to satisfy.",
  "I tend to feel either really good or really bad about myself.",
  "I tend to let others set my goals for me, rather than come up with them on my own.",
  "I try hard to be flexible and cooperative when dealing with others.",
  "I typically understand other peoples' feelings better than they do.",
  "I work on my close relationships, because they are important to me.",
  "I'm confident about the difference between my values and those that others might want me to have.",
  "I'm no good at stepping back and looking objectively at my life.",
  "I'm not sure exactly what standards I've set for myself.",
  "I'm only interested in relationships that can provide me with some comfort.",
  "I'm very aware of the impact I'm having on other people.",
  "In a close relationship, it's as if I can't live without the other person.",
  "In close relationships I tend to be torn between being afraid and being \"clingy\".",
  "In many situations I feel quite differently than others seem to expect me to feel.",
  "In very trying times, I sometimes lose sight of what is important to me.",
  "Interacting with other people usually leaves me feeling confused.",
  "It seems as if most other people have their life together more than I.",
  "I've got goals that are reasonable given my abilities.",
  "I've had lasting relationships, but they haven't always been very satisfying.",
  "Life is a dangerous place without a lot of meaning to it.",
  "Many people around me have very destructive motives.",
  "Most things that I do are a reaction to what others do.",
  "My emotions rapidly shift around.",
  "My life is basically controlled by the actions of others.",
  "My motives are mainly imposed upon me, rather than being a personal choice.",
  "My personal standards change quite a bit depending upon circumstances.",
  "Other people often expect too much from me.",
  "People think I am pretty good at reading the feelings and motives of others in most situations.",
  "People think I'm a \"hater\", but it's often more related to them than to me.",
  "Relationships are mainly a source of pain and suffering.",
  "Sometimes all I care about are my goals.",
  "Sometimes I am too harsh on myself.",
  "Sometimes I feel that certain other people are just like me; other times I believe they are nothing like me at all.",
  "Sometimes I'm not very cooperative because other people don't live up to my standards.",
  "Sometimes it is easy for me to overlook the impact that I'm having on others.",
  "The key to a successful relationship is whether I am getting my needs met.",
  "The standards that I set for myself often seem to be too demanding, or not demanding enough.",
  "The way that others perceive me is totally different from the way that I really am.",
  "There are parts of my personality that just don't fit together very well.",
  "When dealing with people, I mainly pay attention to how they are likely to affect me.",
  "When feelings get too strong, I try to shut myself off from them.",
  "When I disagree with others, there often isn't much use in trying to see things from their perspective.",
  "When I feel that I've done something well, I'm almost always right.",
  "When I'm not doing well at something, I might get very angry or feel ashamed about my abilities.",
  "When I'm successful I tend to feel like an imposter.",
  "When others disapprove of me, it's difficult to keep my emotions under control.",
  "When thinking about myself, I can get pretty narrow in my focus."
];

const WEIGHTS = [-.5,2.5,2.5,-.5,2.5,.5,2.5,1.5,3.5,3.5,-.5,1.5,1.5,-.5,3.5,3.5,2.5,2.5,3.5,1.5,3.5,3.5,1.5,2.5,2.5,-.5,1.5,.5,.5,3.5,1.5,3.5,2.5,.5,2.5,1.5,-.5,1.5,-.5,-.5,1.5,2.5,3.5,-.5,2.5,2.5,3.5,.5,3.5,1.5,-.5,.5,2.5,2.5,2.5,2.5,3.5,3.5,3.5,.5,-.5,3.5,3.5,.5,.5,2.5,.5,.5,3.5,1.5,3.5,2.5,2.5,.5,.5,-.5,1.5,1.5,1.5,.5];
const DOMAINS = ["Self-Direction","Empathy","Intimacy","Identity","Intimacy","Intimacy","Identity","Identity","Intimacy","Intimacy","Empathy","Intimacy","Intimacy","Self-Direction","Identity","Self-Direction","Empathy","Empathy","Intimacy","Empathy","Empathy","Self-Direction","Identity","Self-Direction","Self-Direction","Intimacy","Intimacy","Self-Direction","Self-Direction","Self-Direction","Empathy","Empathy","Identity","Self-Direction","Identity","Self-Direction","Intimacy","Empathy","Intimacy","Identity","Self-Direction","Self-Direction","Intimacy","Empathy","Intimacy","Intimacy","Identity","Identity","Empathy","Identity","Self-Direction","Intimacy","Self-Direction","Empathy","Identity","Identity","Identity","Self-Direction","Self-Direction","Empathy","Empathy","Identity","Intimacy","Self-Direction","Identity","Identity","Intimacy","Empathy","Intimacy","Self-Direction","Identity","Identity","Intimacy","Identity","Empathy","Identity","Identity","Self-Direction","Identity","Self-Direction"];
const OPTIONS = [
  {value:1,label:"Totally false, not at all true"},
  {value:2,label:"Slightly true"},
  {value:3,label:"Mainly true"},
  {value:4,label:"Very true"}
];
const NORMS = {
  "Total": [232.4,308.8,347.1,385.3],
  "Identity": [75.8,101.0,113.6,126.2],
  "Self-Direction": [53.4,73.6,83.7,93.7],
  "Empathy": [39.1,53.3,60.5,67.6],
  "Intimacy": [64.1,87.1,98.6,110.1]
};
const DOMAIN_ORDER = ["Identity","Self-Direction","Empathy","Intimacy"];
const $ = id => document.getElementById(id);
let answers = [];

function normalAnswers(){return WEIGHTS.map(weight=>weight<0?4:1)}
function reset(){answers=normalAnswers();renderQuestions();update()}

function renderQuestions(){
  $("questions").innerHTML=ITEMS.map((text,i)=>`<section class="card question-card"><h2><span class="question-number">${i+1}.</span>${text}</h2><div class="response-grid">${OPTIONS.map(option=>`<label class="response-option"><input type="radio" name="item-${i}" value="${option.value}" ${answers[i]===option.value?"checked":""}><span>${option.value}<br>${option.label}</span></label>`).join("")}</div></section>`).join("");
  document.querySelectorAll('[name^="item-"]').forEach(input=>input.onchange=()=>{answers[Number(input.name.split("-")[1])]=Number(input.value);update()});
}

function scores(){
  const result={Identity:0,"Self-Direction":0,Empathy:0,Intimacy:0};
  answers.forEach((answer,i)=>result[DOMAINS[i]]+=answer*WEIGHTS[i]);
  Object.keys(result).forEach(key=>result[key]=round(result[key]));
  result.Total=round(DOMAIN_ORDER.reduce((total,key)=>total+result[key],0));
  return result;
}

function marker(name,score){
  const [,sd1,sd15,sd2]=NORMS[name];
  if(score>=sd2)return "At or above the +2.0 SD marker";
  if(score>=sd15)return "At or above the +1.5 SD marker";
  if(score>=sd1)return "At or above the +1.0 SD marker";
  return "Below the +1.0 SD marker";
}

function benchmarkLevel(name,score){return NORMS[name].filter(value=>score>=value).length}

function update(){
  const result=scores();
  $("total-score").textContent=format(result.Total);
  $("total-marker").textContent=marker("Total",result.Total);
  $("domain-results").innerHTML=DOMAIN_ORDER.map(name=>domainCard(name,result[name])).join("");
  $("reference-rows").innerHTML=Object.entries(NORMS).map(([name,values])=>`<div class="reference-row ${name==="Total"?"current":""}" role="row"><span>${name}</span>${values.map(format).map(value=>`<span>${value}</span>`).join("")}</div>`).join("");
  const detailed=document.querySelector('[name="outputStyle"]:checked').value==="detailed";
  $("output").value=detailed?detailedOutput(result):summaryOutput(result);
}

function domainCard(name,score){
  const active=benchmarkLevel(name,score);
  return `<div class="domain-card"><h3>${name}</h3><div class="domain-score">${format(score)}</div><div class="domain-marker">${marker(name,score)}</div><div class="benchmark-bar" aria-hidden="true">${[1,2,3,4].map(level=>`<span class="${level<=active?"active":""}"></span>`).join("")}</div></div>`;
}

function summaryOutput(result){
  const domains=DOMAIN_ORDER.map(name=>`${name} ${format(result[name])} (${marker(name,result[name]).toLowerCase()})`).join(", ");
  return `LPFS-SR completed with a total weighted score of ${format(result.Total)}, ${marker("Total",result.Total).toLowerCase()}. Domain scores were ${domains}. Scores were interpreted using the published non-clinical reference markers. The LPFS-SR supports assessment of personality functioning and does not independently establish a diagnosis.`;
}

function detailedOutput(result){
  const lines=["Level of Personality Functioning Scale - Self Report (LPFS-SR)","","Weighted Scores",`Total: ${format(result.Total)} - ${marker("Total",result.Total)}`];
  DOMAIN_ORDER.forEach(name=>lines.push(`${name}: ${format(result[name])} - ${marker(name,result[name])}`));
  lines.push("","Item Responses");
  ITEMS.forEach((text,i)=>lines.push("",`${i+1}. ${text}`,`${answers[i]} - ${OPTIONS.find(option=>option.value===answers[i]).label}`));
  lines.push("","Interpretation","Higher weighted scores indicate greater impairment in personality functioning. Published score markers are based on a non-clinical reference sample and should be integrated with clinical interview, history, context, and clinical judgment.");
  return lines.join("\n");
}

function round(value){return Math.round((value+Number.EPSILON)*10)/10}
function format(value){return Number(value).toFixed(1)}

$("reset-button").onclick=reset;
document.querySelectorAll('[name="outputStyle"]').forEach(input=>input.onchange=update);
$("copy-button").onclick=async()=>{await navigator.clipboard.writeText($("output").value);$("copy-status").textContent="Copied";setTimeout(()=>$("copy-status").textContent="",1500)};
$("select-button").onclick=()=>{$("output").focus();$("output").select()};
reset();

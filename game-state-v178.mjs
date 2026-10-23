import{normalizeRecords,recordClear}from'./companion-info-v144.mjs';
import{createRound,normalizeRound,roundScore,ROUND_SIZE,REWARD,questionFor,createReviewRound}from'./quiz-bank-v178.mjs';
import{getStage}from'./expansion-v100.mjs';
import{allies}from'./catalog-v100.mjs';
const KEY='sengoku-yokai-progress-v070',ids=allies.map(a=>a.id),starter=['ashigaru','nobunaga','kazutoyo'];
export const TEST_UNLOCKS=true;
export let storageOK=true;
let data={coins:1000,owned:[...starter],team:[...starter],wins:0,cleared:[],selectedStage:1,quiz:null,reviewIds:[],records:{}};
try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&Array.isArray(saved.owned)&&Array.isArray(saved.team)){data={coins:Number.isFinite(saved.coins)?Math.max(0,Math.floor(saved.coins)):1000,owned:[...new Set(['ashigaru',...saved.owned.filter(id=>ids.includes(id))])],team:[],wins:Math.max(0,Number(saved.wins)||0),cleared:Array.isArray(saved.cleared)?[...new Set(saved.cleared.filter(n=>Number.isInteger(n)&&n>=1&&n<=5))]:Number(saved.wins)>0?[1]:[],selectedStage:Number(saved.selectedStage)||1,quiz:normalizeRound(saved.quiz),reviewIds:Array.isArray(saved.reviewIds)?[...new Set(saved.reviewIds.filter(id=>!!questionFor(id)))]:[],records:normalizeRecords(saved.records)};if(!Array.isArray(saved.reviewIds)&&data.quiz)data.reviewIds=[...new Set(data.quiz.answers.flatMap((choice,i)=>data.quiz.items[i].order[choice]===0?[]:[data.quiz.items[i].id]))];data.team=[...new Set(['ashigaru',...saved.team.filter(id=>TEST_UNLOCKS?ids.includes(id):data.owned.includes(id))])].slice(0,6)}else{const legacy=JSON.parse(localStorage.getItem('sengoku-yokai-team-v1')||'null');if(Array.isArray(legacy)){data.team=[...new Set(['ashigaru',...legacy.filter(id=>ids.includes(id))])].slice(0,6);data.owned=[...new Set([...starter,...data.team])]}}}catch{storageOK=false}
if(!stageUnlocked(data.selectedStage))data.selectedStage=Math.min(5,1+(data.cleared.length?Math.max(...data.cleared):0));
function save(){try{localStorage.setItem(KEY,JSON.stringify(data))}catch{storageOK=false}}
export const snapshot=()=>structuredClone({...data,collected:[...data.owned],owned:TEST_UNLOCKS?[...ids]:data.owned});
export const getLoadout=()=>[...data.team];
export function setTeam(team){if(!Array.isArray(team)||team.length>6||team[0]!=='ashigaru'||new Set(team).size!==team.length||team.some(id=>!(TEST_UNLOCKS?ids:data.owned).includes(id)))return false;data.team=[...team];save();return true}
export function stageUnlocked(id){return Number.isInteger(id)&&id>=1&&id<=5&&(TEST_UNLOCKS||id===1||data.cleared.includes(id-1))}
export function selectStage(id){if(!stageUnlocked(id))return false;data.selectedStage=id;save();return true}
export function creditWin(stageId=1,seconds){if(!stageUnlocked(stageId))return 0;const reward=getStage(stageId).reward;data.records=recordClear(data.records,stageId,seconds);data.coins+=reward;data.wins++;if(!data.cleared.includes(stageId))data.cleared.push(stageId);save();return reward}
export const rates={legend:10,rare:35,normal:55};
export function chance(id){const a=allies.find(a=>a.id===id);if(!a||id==='ashigaru')return 0;return rates[a.rarity]/allies.filter(v=>v.id!=='ashigaru'&&v.rarity===a.rarity).length}
export function pull(random=Math.random){if(data.coins<100)return null;const r=Math.max(0,Math.min(.999999,random()))*100,rank=r<10?'legend':r<45?'rare':'normal',pool=allies.filter(a=>a.id!=='ashigaru'&&a.rarity===rank);const start=rank==='legend'?0:rank==='rare'?10:45;const index=Math.min(pool.length-1,Math.floor((r-start)/rates[rank]*pool.length));const id=pool[index].id,isNew=!data.owned.includes(id);data.coins-=100;if(isNew)data.owned.push(id);else data.coins+=30;save();return{id,isNew,refund:isNew?0:30}}

export const getQuiz=()=>data.quiz?structuredClone(data.quiz):null;
export function startQuiz(level='easy',random=Math.random){if(data.quiz&&data.quiz.answers.length<data.quiz.items.length)return getQuiz();data.quiz=createRound(level,random,data.quiz?.items.map(i=>i.id)||[]);save();return getQuiz()}
// The answer and its coin award share one save; stale/double clicks cannot award twice.
export function answerQuiz(roundId,index,choice){const r=data.quiz;if(!r||r.id!==roundId||index!==r.answers.length||index>=r.items.length||!Number.isInteger(choice)||choice<0||choice>2)return null;const correct=r.items[index].order[choice]===0;r.answers.push(choice);const qid=r.items[index].id;data.reviewIds=data.reviewIds.filter(id=>id!==qid);if(!correct)data.reviewIds.push(qid);const earned=correct?REWARD:0;data.coins+=earned;save();return{correct,earned,score:roundScore(r),saved:storageOK}}

export const getReviewIds=(level)=>[...data.reviewIds].filter(id=>!level||questionFor(id)?.level===level);
export const getStageRecord=id=>data.records[id]?{...data.records[id]}:null;
export function startReview(level='easy',random=Math.random){if(data.quiz&&data.quiz.answers.length<data.quiz.items.length)return getQuiz();const round=createReviewRound(getReviewIds(level),level,random);if(!round)return null;data.quiz=round;save();return getQuiz()}

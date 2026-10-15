import{allies}from'./lane-engine-v063.mjs';
const KEY='sengoku-yokai-progress-v070',ids=allies.map(a=>a.id),starter=['ashigaru','nobunaga','kazutoyo'];
export let storageOK=true;
let data={coins:1000,owned:[...starter],team:[...starter],wins:0};
try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&Array.isArray(saved.owned)&&Array.isArray(saved.team)){data={coins:Number.isFinite(saved.coins)?Math.max(0,Math.floor(saved.coins)):1000,owned:[...new Set(['ashigaru',...saved.owned.filter(id=>ids.includes(id))])],team:[],wins:Number(saved.wins)||0};data.team=[...new Set(['ashigaru',...saved.team.filter(id=>data.owned.includes(id))])].slice(0,6)}else{const legacy=JSON.parse(localStorage.getItem('sengoku-yokai-team-v1')||'null');if(Array.isArray(legacy)){data.team=[...new Set(['ashigaru',...legacy.filter(id=>ids.includes(id))])].slice(0,6);data.owned=[...new Set([...starter,...data.team])]}}}catch{storageOK=false}
function save(){try{localStorage.setItem(KEY,JSON.stringify(data))}catch{storageOK=false}}
export const snapshot=()=>structuredClone(data);
export const getLoadout=()=>[...data.team];
export function setTeam(team){if(!Array.isArray(team)||team.length>6||team[0]!=='ashigaru'||new Set(team).size!==team.length||team.some(id=>!data.owned.includes(id)))return false;data.team=[...team];save();return true}
export function creditWin(){data.coins+=120;data.wins++;save()}
// Five named warriors, each exactly 20%; foot soldier is a permanent starter.
export function pull(random=Math.random){if(data.coins<100)return null;const pool=ids.slice(1),id=pool[Math.min(4,Math.max(0,Math.floor(random()*5)))],isNew=!data.owned.includes(id);data.coins-=100;if(isNew)data.owned.push(id);else data.coins+=30;save();return{id,isNew,refund:isNew?0:30}}

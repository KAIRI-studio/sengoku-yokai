import{battleBackground}from'./battle-backgrounds-v159.mjs';
import{allies,enemies}from'./catalog-v100.mjs';
import{getStage}from'./expansion-v100.mjs';
export function battleAssetPlan(team,stageId=1){
 const stage=getStage(stageId),enemyIds=new Set([...stage.waves,stage.boss]);
 for(const id of enemyIds){const u=enemies.find(v=>v.id===id);if(u?.summon)enemyIds.add(u.summon)}
 const units=[...allies.filter(u=>team.includes(u.id)),...enemies.filter(u=>enemyIds.has(u.id))];
 return [{kind:'background',url:battleBackground(stage.id)},...units.map(u=>({kind:'sheet',id:u.id,url:u.asset||`./assets/motion-${u.id}-v050.webp`})),...units.filter(u=>team.includes(u.id)&&u.skill).map(u=>({kind:'cutin',id:u.id,url:`./assets/standing-${u.id}-v111.webp`}))]
}
export function imageLoader(load){const pending=new Map();return url=>{if(!pending.has(url)){const p=Promise.resolve().then(()=>load(url)).catch(error=>{pending.delete(url);throw error});pending.set(url,p)}return pending.get(url)}}
export async function loadBattleAssets(plan,load,onProgress=()=>{}){let complete=0;onProgress(0,plan.length);return Promise.all(plan.map(async item=>{const image=await load(item.url);onProgress(++complete,plan.length);return{...item,image}}))}

import{Battle,allies}from'../lane-engine-v182.mjs';
import{runAutoDeploy}from'../auto-deploy-v119.mjs';
import{fireAutoSpecial}from'../auto-special-v118.mjs';
import{runBattleFrame}from'../battle-experience-v181.mjs';
export const legends=allies.filter(a=>a.rarity==='legend').map(a=>a.id);
export const others=allies.filter(a=>a.rarity!=='legend'&&a.id!=='ashigaru').map(a=>a.id);
export function combinations(arr,k){return k===0?[[]]:arr.flatMap((x,i)=>combinations(arr.slice(i+1),k-1).map(c=>[x,...c]))}
// Use the exact order and fixed timestep of the released battle screen.
export function simulate(stage,team,{speed=1,maxWall=1200,manual=false}={}){
 const b=new Battle(stage),indices=team.map(id=>allies.findIndex(a=>a.id===id));let frames=0;
 if(team.length>6||indices.some(i=>i<0)||new Set(team).size!==team.length)throw Error('Invalid test roster');
 while(!b.result&&frames<60*maxWall){runBattleFrame(b,speed,()=>{if(manual){for(const i of indices.filter(i=>i!==0))if(b.canDeploy(i))b.deploy(i);if(b.canDeploy(0))b.deploy(0)}else runAutoDeploy(b,true,indices);fireAutoSpecial(b,true);b.takeEvents()});frames++}
 return{result:b.result||'timeout',seconds:Math.round(b.time),wall:Math.round(frames/60),home:b.home,temple:b.temple};
}

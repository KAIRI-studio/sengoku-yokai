const KEY='sengoku-yokai-auto-deploy-v119',states=new WeakMap();
export function readAutoDeploy(storage){try{return storage?.getItem(KEY)==='on'}catch{return false}}
export function writeAutoDeploy(storage,on){try{storage?.setItem(KEY,on?'on':'off')}catch{}}
// Rotate through warriors before foot soldiers; reserve rice for the next candidate.
export function runAutoDeploy(battle,enabled,indices){
 if(!enabled||battle.result||battle.cutLeft>0||!indices.length)return false;
 let state=states.get(battle);if(!state){state={cursor:0,nextAt:0};states.set(battle,state)}
 if(battle.time<state.nextAt)return false;
 const order=[...indices.filter(i=>i!==0),...indices.filter(i=>i===0)];
 for(let offset=0;offset<order.length;offset++){
  const n=(state.cursor+offset)%order.length,i=order[n];
  if(i!==0&&battle.active(i)||battle.cooldowns[i]>0)continue;
  if(!battle.canDeploy(i))return false;
  if(battle.deploy(i)){state.cursor=(n+1)%order.length;state.nextAt=battle.time+.6;return true}
 }
 return false;
}

import test from 'node:test';
import assert from 'node:assert/strict';
import {Battle} from '../lane-engine-v174.mjs';
import {Battle as PreviousBattle} from '../lane-engine-v100.mjs';

test('presentation attribution preserves combat outcomes on all five stages',()=>{
 for(let stage=1;stage<=5;stage++){
  const old=new PreviousBattle(stage),next=new Battle(stage);
  for(let frame=0;frame<60*100;frame++){
   for(const b of [old,next]){for(const i of [0,1,2])b.deploy(i);for(const u of b.units)if(b.canSpecial(u.uid))b.fireSpecial(u.uid);b.step(1/60);b.takeEvents()}
  }
  const state=b=>({time:b.time,rice:b.rice,home:b.home,temple:b.temple,kills:b.kills,result:b.result,units:b.units});
  assert.deepEqual(state(next),state(old),'stage '+stage);
 }
});
test('normal and special hits identify the attacking and defeated characters',()=>{
 const b=new Battle(),hero=b.add(1,1),enemy=b.add(-1,0);hero.x=500;enemy.x=530;b.takeEvents();
 b.impact(hero,{target:enemy.uid});let hits=b.takeEvents().filter(e=>e.type==='damage');assert.equal(hits[0].source,hero);assert.equal(hits[0].uid,enemy.uid);
 enemy.hp=1;hero.pose=.72;b.specialImpact(hero);const events=b.takeEvents();assert.ok(events.some(e=>e.type==='damage'&&e.special&&e.source===hero));assert.ok(events.some(e=>e.type==='fall'&&e.u===enemy&&e.source===hero));
});

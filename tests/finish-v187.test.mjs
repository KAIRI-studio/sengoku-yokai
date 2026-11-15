import test from'node:test';import assert from'node:assert/strict';
const m=new Map();globalThis.localStorage={getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v)};const api=await import('../game-state-v187.mjs');
test('backup roundtrip preserves state and rejects malformed or foreign saves',()=>{const text=api.exportProgress(),before=api.snapshot();assert.deepEqual(api.restoreProgress(text),before);for(const bad of ['{}','not json',JSON.stringify({game:'sengoku-yokai',version:1,progress:{}})])assert.throws(()=>api.restoreProgress(bad));assert.deepEqual(api.snapshot(),before)});
test('twenty-fifth draw guarantees a missing legend and progress persists',()=>{const x=JSON.parse(api.exportProgress());x.progress.coins=10000;x.progress.pity=23;api.restoreProgress(JSON.stringify(x));assert.equal(api.pull(()=>.99).guaranteed,false);assert.equal(api.snapshot().pity,24);const roundtrip=api.exportProgress();api.restoreProgress(roundtrip);const result=api.pull(()=>.99);assert.equal(result.guaranteed,true);assert.equal(result.isNew,true);assert.equal(api.snapshot().pity,0);assert.ok(api.snapshot().owned.includes(result.id))});
test('invalid restore cannot change coins or team',()=>{const before=api.snapshot(),x=JSON.parse(api.exportProgress());x.progress.team=['unknown'];assert.throws(()=>api.restoreProgress(JSON.stringify(x)));assert.deepEqual(api.snapshot(),before)});
test('storage failure leaves live progress unchanged',()=>{const before=api.snapshot(),text=api.exportProgress(),old=globalThis.localStorage.setItem;globalThis.localStorage.setItem=()=>{throw Error('full')};assert.throws(()=>api.restoreProgress(text));assert.deepEqual(api.snapshot(),before);globalThis.localStorage.setItem=old});

test('a player already past the new guarantee threshold keeps the next guaranteed draw',async()=>{
 const save=JSON.parse(api.exportProgress());
 save.progress.coins=100;
 save.progress.pity=28;
 const key='sengoku-yokai-progress-v070';
 m.set(key,JSON.stringify(save.progress));
 const reloaded=await import('../game-state-v187.mjs?guarantee-balance');
 assert.equal(reloaded.snapshot().pity,24);
 assert.deepEqual(reloaded.snapshot().owned,save.progress.owned);
 assert.deepEqual(reloaded.snapshot().team,save.progress.team);
 assert.equal(reloaded.pull(()=>.99).guaranteed,true);
});

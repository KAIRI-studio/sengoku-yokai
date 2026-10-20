import test from 'node:test';
import assert from 'node:assert/strict';

test('collection tracks earned companions independently of test unlocks and duplicate pulls',async()=>{
 let saved=null;
 globalThis.localStorage={getItem:()=>null,setItem:(_key,value)=>{saved=JSON.parse(value)}};
 const state=await import('../game-state-v163.mjs?collection-test');
 const before=state.snapshot();
 assert.ok(before.owned.length>before.collected.length);
 assert.deepEqual(before.collected,['ashigaru','nobunaga','kazutoyo']);
 const first=state.pull(()=>0.025);
 assert.equal(first.isNew,true);
 assert.equal(state.snapshot().collected.length,4);
 const again=state.pull(()=>0.025);
 assert.equal(again.isNew,false);
 assert.equal(state.snapshot().collected.length,4);
 assert.equal(saved.owned.length,4);
 const detached=state.snapshot();detached.collected.length=0;
 assert.equal(state.snapshot().collected.length,4);
 delete globalThis.localStorage;
});

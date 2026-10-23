import test from 'node:test';
import assert from 'node:assert/strict';
import {createRound} from '../quiz-bank-v178.mjs';
import {Battle,allies} from '../lane-engine-v179.mjs';
import {runAutoDeploy} from '../auto-deploy-v119.mjs';
import {fireAutoSpecial} from '../auto-special-v118.mjs';
const KEY='sengoku-yokai-progress-v070';let serial=0;
async function load(saved,legacy){const store=new Map();if(saved)store.set(KEY,JSON.stringify(saved));if(legacy)store.set('sengoku-yokai-team-v1',JSON.stringify(legacy));globalThis.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};return {api:await import(`../game-state-v179.mjs?case=${serial++}`),store};}
test('new players begin with two normal companions and one pull; only stage one is open',async()=>{
 const {api}=await load();const s=api.snapshot();assert.deepEqual(s.owned,['ashigaru','kazutoyo']);assert.deepEqual(s.team,s.owned);assert.deepEqual(s.collected,s.owned);assert.equal(s.coins,100);
 assert.equal(api.stageUnlocked(1),true);for(const id of [0,2,3,4,5,6,1.5,NaN])assert.equal(api.stageUnlocked(id),false);
 assert.equal(api.selectStage(2),false);assert.equal(api.creditWin(2,10),0);assert.equal(api.snapshot().coins,100);assert.equal(api.setTeam(['ashigaru','nobunaga']),false);
});
test('each clear opens exactly the next stage, with no roster ownership requirement',async()=>{
 const {api}=await load();for(let id=1;id<=5;id++){assert.equal(api.stageUnlocked(id),true);if(id<5)assert.equal(api.stageUnlocked(id+1),false);assert.ok(api.creditWin(id,100)>0);if(id<5){assert.equal(api.stageUnlocked(id+1),true);assert.equal(api.selectStage(id+1),true);}}
 assert.deepEqual(api.snapshot().cleared,[1,2,3,4,5]);
});
test('migration preserves earned characters, wallet, clears, quiz and records while filtering test-only members',async()=>{
 const quiz=createRound('normal',()=>.3);quiz.answers=[quiz.items[0].order.indexOf(0)];const saved={coins:1450,owned:['ashigaru','nobunaga','kazutoyo','hideyoshi'],team:['ashigaru','nobunaga','kenshin','ieyasu','hideyoshi','shingen'],cleared:[1],selectedStage:5,wins:1,quiz,reviewIds:[quiz.items[1].id],records:{1:{best:85,clears:1}}};
 const {api,store}=await load(saved);const next=api.snapshot();assert.equal(next.coins,1450);assert.deepEqual(new Set(next.owned),new Set(saved.owned));assert.deepEqual(next.team,['ashigaru','nobunaga','hideyoshi']);assert.deepEqual(next.cleared,[1]);assert.equal(next.selectedStage,2);assert.deepEqual(next.quiz,quiz);assert.deepEqual(next.records,saved.records);api.selectStage(2);const again=await load(JSON.parse(store.get(KEY)));assert.deepEqual(again.api.snapshot().team,next.team);assert.equal(again.api.snapshot().coins,1450);
});
test('sparse test clears cannot bypass the campaign and old team-only saves do not grant legends',async()=>{
 const {api}=await load({coins:50,owned:['ashigaru','kazutoyo'],team:['ashigaru','kenshin'],cleared:[4],selectedStage:5});assert.equal(api.snapshot().selectedStage,1);assert.equal(api.stageUnlocked(5),false);api.creditWin(1,90);assert.equal(api.stageUnlocked(2),true);assert.equal(api.stageUnlocked(5),false);
 const legacy=await load(null,['ashigaru','nobunaga','kenshin','kazutoyo']);assert.deepEqual(legacy.api.snapshot().owned,['ashigaru','kazutoyo']);assert.deepEqual(legacy.api.snapshot().team,['ashigaru','kazutoyo']);
});
test('gacha owns a new legend only after drawing it; duplicates refund without adding another',async()=>{
 const {api}=await load();assert.equal(api.pull(()=>0).id,'nobunaga');assert.ok(api.snapshot().owned.includes('nobunaga'));assert.equal(api.setTeam(['ashigaru','kazutoyo','nobunaga']),true);assert.equal(api.snapshot().coins,0);assert.equal(api.pull(()=>0),null);api.creditWin(1,90);const repeat=api.pull(()=>0);assert.equal(repeat.isNew,false);assert.equal(repeat.refund,30);assert.equal(api.snapshot().owned.length,3);assert.equal(api.snapshot().coins,50);
});
function simulate(stage,team){const b=new Battle(stage),indices=team.map(id=>allies.findIndex(a=>a.id===id));for(let i=0;i<60*600&&!b.result;i++){runAutoDeploy(b,true,indices);fireAutoSpecial(b,true);b.step(1/60);b.takeEvents();}return b;}
test('starter team can farm both early stages, but needs reinforcements for the later campaign',()=>{
 for(const stage of [1,2])assert.equal(simulate(stage,['ashigaru','kazutoyo']).result,'win');assert.equal(simulate(3,['ashigaru','kazutoyo']).result,'lose');
 for(const hero of allies.filter(a=>a.rarity==='legend'))assert.equal(simulate(3,['ashigaru','kazutoyo',hero.id]).result,'win',hero.id);
});
test('several legends materially improve the final-stage outcome without a hard collection gate',()=>{
 const weak=simulate(5,['ashigaru','kazutoyo','nobunaga']);assert.equal(weak.result,'lose');const strong=simulate(5,['ashigaru','nobunaga','kenshin','shingen','hideyoshi','ieyasu']);assert.equal(strong.result,'win');assert.ok(strong.time<240);assert.ok(strong.home>0);
});


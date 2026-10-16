import test from 'node:test';
import assert from 'node:assert/strict';
import{QUESTIONS,createRound,normalizeRound,roundScore,questionFor,REWARD}from'../quiz-bank-v113.mjs';
const KEY='sengoku-yokai-progress-v070';
let serial=0;
async function state(saved){const store=new Map(saved?[[KEY,JSON.stringify(saved)]]:[]);globalThis.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};const api=await import(`../game-state-v113.mjs?test=${serial++}`);return{api,store}}
const old={coins:83,owned:['ashigaru','nobunaga'],team:['ashigaru','yukimura','kazutoyo'],wins:2,cleared:[1,2],selectedStage:3};
test('48 valid questions; random rounds use five unique questions and shuffled options',()=>{assert.equal(QUESTIONS.length,48);assert.equal(new Set(QUESTIONS.map(q=>q.id)).size,48);for(const q of QUESTIONS){assert.equal(new Set(q.choices).size,3);assert.ok(q.explanation&&q.prompt)}for(const level of ['easy','normal']){assert.equal(QUESTIONS.filter(q=>q.level===level).length,24);const r=createRound(level,()=>0);assert.equal(normalizeRound(r).items.length,5);assert.equal(new Set(r.items.map(i=>i.id)).size,5);assert.ok(r.items.every(i=>questionFor(i.id).level===level&&i.order.join()!=='0,1,2'));const next=createRound(level,()=>0,r.items.map(i=>i.id));assert.ok(next.items.every(i=>!r.items.some(j=>i.id===j.id)))}});
test('old coins, team and progression survive; virtual test unlocks do not overwrite ownership',async()=>{const{api,store}=await state(old);api.startQuiz();const s=JSON.parse(store.get(KEY));for(const k of ['coins','team','cleared','selectedStage','owned'])assert.deepEqual(s[k],old[k]);assert.equal(api.snapshot().owned.length,16);assert.ok(api.stageUnlocked(5))});
test('five correct answers earn exactly 100; double/stale/invalid answers do not add coins',async()=>{const{api}=await state(old),r=api.startQuiz();for(let i=0;i<5;i++){const c=r.items[i].order.indexOf(0);assert.equal(api.answerQuiz(r.id,i,c).earned,REWARD);assert.equal(api.answerQuiz(r.id,i,c),null);assert.equal(api.answerQuiz('stale',i+1,c),null);assert.equal(api.answerQuiz(r.id,i+1,-1),null)}assert.equal(api.snapshot().coins,183);assert.equal(roundScore(api.getQuiz()),5);assert.equal(api.answerQuiz(r.id,5,0),null)});
test('five wrong answers earn zero; completed round never pays on read/reopen',async()=>{const{api}=await state(old),r=api.startQuiz();for(let i=0;i<5;i++)api.answerQuiz(r.id,i,r.items[i].order.indexOf(1));assert.equal(roundScore(api.getQuiz()),0);assert.equal(api.snapshot().coins,83);const next=api.startQuiz('normal');assert.notEqual(next.id,r.id);assert.equal(next.level,'normal');assert.equal(api.snapshot().coins,83)});
test('reload resumes after three answers and cannot pay those answers again',async()=>{const{api,store}=await state(old),r=api.startQuiz();for(let i=0;i<3;i++)api.answerQuiz(r.id,i,r.items[i].order.indexOf(i===1?1:0));const saved=JSON.parse(store.get(KEY));assert.equal(saved.coins,123);const{api:reloaded}=await state(saved);assert.deepEqual(reloaded.startQuiz('normal'),api.getQuiz());assert.equal(reloaded.answerQuiz(r.id,0,r.items[0].order.indexOf(0)),null);assert.equal(reloaded.snapshot().coins,123);assert.equal(reloaded.getQuiz().answers.length,3)});
test('malformed quiz data is dropped without resetting existing progress',async()=>{for(const quiz of [{items:[]},{...createRound(),answers:[-1]},{...createRound(),items:Array(5).fill({id:'e01',order:[0,1,2]})}]){const{api}=await state({...old,quiz});assert.equal(api.getQuiz(),null);assert.equal(api.snapshot().coins,83);assert.deepEqual(api.snapshot().team,old.team)}});
test('storage failure does not crash play or permit duplicate rewards; status is reported',async()=>{const{api}=await state(old);globalThis.localStorage.setItem=()=>{throw Error('quota')};const r=api.startQuiz();const a=api.answerQuiz(r.id,0,r.items[0].order.indexOf(0));assert.equal(a.saved,false);assert.equal(api.storageOK,false);assert.equal(api.answerQuiz(r.id,0,r.items[0].order.indexOf(0)),null);assert.equal(api.snapshot().coins,103)});

test('every question has a complete official source, grade, unit and unambiguous PDF page',async()=>{const{SOURCES}=await import('../quiz-bank-v113.mjs');for(const q of QUESTIONS){assert.ok(q.grade>=3&&q.grade<=6);assert.ok(q.unit);assert.equal(q.level,q.grade<5?'easy':'normal');const s=SOURCES[q.source.id];assert.equal(new URL(s.url).hostname,'www.mext.go.jp');assert.equal(q.source.pdfPage,q.source.printedPage+4);assert.ok(q.source.section.includes(`第${q.grade}学年`));assert.ok(q.source.basis)}});
test('pre-source-bank round is retired without losing koban, roster, team or clears',async()=>{const{createRound:oldRound}=await import('../quiz-bank-v109.mjs');const previous=oldRound();previous.answers=[previous.items[0].order.indexOf(0)];const saved={...old,coins:103,quiz:previous};const{api,store}=await state(saved);assert.equal(api.getQuiz(),null);assert.equal(api.snapshot().coins,103);api.startQuiz();const result=JSON.parse(store.get(KEY));for(const k of ['coins','owned','team','cleared','selectedStage'])assert.deepEqual(result[k],saved[k])});


 test('v111 rounds, source references, answer positions and wallet survive the wording update',async()=>{
 const before=await import('../quiz-bank-v111.mjs');
 for(const level of ['easy','normal']){
  const r=before.createRound(level,()=>.2);r.answers=[r.items[0].order.indexOf(0)];
  assert.deepEqual(normalizeRound(r),r);
  const {api}=await state({...old,coins:103,quiz:r});
  assert.deepEqual(api.getQuiz(),r);assert.equal(api.snapshot().coins,103);
  assert.equal(api.answerQuiz(r.id,0,r.items[0].order.indexOf(0)),null);
 }
 for(const q of QUESTIONS){const prev=before.questionFor(q.id);assert.equal(q.level,prev.level);assert.equal(q.grade,prev.grade);assert.deepEqual(q.source,prev.source)}
 });
 test('grade courses never mix and child-facing text uses only the reviewed simple-kanji set',async()=>{
 const {LEVELS}=await import('../quiz-bank-v113.mjs');
 assert.match(LEVELS.easy.name,/3・4年生/);assert.match(LEVELS.normal.name,/5・6年生/);
 const simple=new Set('一上下中主事交人今仕代会住体何作使先入全具冬出分切前力勝北南受古合同名和品図国土地場売夏外多大字学守実家寺小少山工市平年広店度後心所手文新方日昔春時書木本来東校業歩毎気水池決温火物生用田畑県真知社秋米考聞自船行表西見角話買赤起車近送通進道遠重金銀長開間集雨雪電風食馬魚');
 for(const q of QUESTIONS){assert.ok((q.level==='easy'?[3,4]:[5,6]).includes(q.grade));for(const text of [q.prompt,...q.choices,q.explanation,q.unit,q.category])for(const char of text.match(/[\p{Script=Han}]/gu)||[])assert.ok(simple.has(char),q.id+': '+char)}
 });

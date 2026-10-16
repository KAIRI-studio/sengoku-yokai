import test from'node:test';import assert from'node:assert/strict';import{readFileSync}from'node:fs';
import{statusFor}from'../card-status-v118.mjs';import{CLOUDS as current}from'../title-clouds-v118.mjs';import{CLOUDS as old}from'../title-clouds-v114.mjs';
test('status slot covers deployment, charging, enemy wait, ready skill, and non-skill units',()=>{
 assert.equal(statusFor({canDeploy:true}).kind,'deploy');
 assert.deepEqual(statusFor({deployed:true,skill:true,charge:34.9}),{kind:'charge',label:'ひっさつ 34%',progress:34});
 assert.deepEqual(statusFor({deployed:true,skill:true,charge:100}),{kind:'charge',label:'てきまち',progress:100});
 assert.equal(statusFor({deployed:true,skill:true,charge:100,ready:true}).kind,'special');
 assert.equal(statusFor({deployed:true,skill:false}).label,'こうげき中');
 assert.equal(statusFor({wait:2.3}).label,'3びょう');assert.equal(statusFor({rice:40,cost:100}).label,'おこめまち');
 assert.equal(statusFor({deployed:true,skill:true,charge:0}).progress,0);
 assert.equal(statusFor({canDeploy:true,charge:78}).kind,'deploy')
});
test('each cloud is 1.5 times faster with its layout and distinct speeds preserved',()=>{for(let i=0;i<old.length;i++){assert.ok(Math.abs(current[i].speed-old[i].speed*1.5)<1e-8);for(const k of ['x','y','width','alpha'])assert.equal(current[i][k],old[i][k])}});
test('bottom resource area contains only HP and the status slot owns charging',()=>{const s=readFileSync(new URL('../faithful-app-v118.mjs',import.meta.url),'utf8');assert.doesNotMatch(s,/class="resource-row skill-row"/);assert.match(s,/class="skill-charge"/);assert.match(s,/statusFor\(/);assert.match(s,/skill-charge b'\).textContent=status.label/);const art=readFileSync(new URL('../status-art-v118.mjs',import.meta.url),'utf8');assert.match(art,/preserveAspectRatio="none"/);assert.match(art,/skill-lettering-v118/)});

test('unit limit takes priority over rice and cooldown and clears after a slot opens',()=>{assert.equal(statusFor({atLimit:true,wait:3,rice:0,cost:100}).label,'これ以上 でれない');assert.equal(statusFor({atLimit:false,canDeploy:true}).kind,'deploy')});

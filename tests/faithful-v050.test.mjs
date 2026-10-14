import assert from'node:assert/strict';import fs from'node:fs';import{Battle,allies}from'../lane-engine-v050.mjs';
const advance=(b,s)=>{for(let t=0;t<s;t+=1/60)b.step(1/60)};
assert.equal(allies.length,6);assert.equal(allies[5].id,'kazutoyo');assert.equal(allies[5].cost,200);
let b=new Battle();assert(b.deploy(1));assert(!b.deploy(1));assert(!b.deploy(2));advance(b,15);assert(!b.deploy(1));
b=new Battle();assert(b.deploy(0));assert(!b.deploy(0));advance(b,1.5);assert(b.deploy(0));assert(b.deploy(5));assert(!b.deploy(5));
b=new Battle();let u=b.add(1,1),v=b.add(-1,0);u.x=500;v.x=550;u.attackLeft=0;v.attackLeft=10;advance(b,.15);assert.equal(v.hp,v.max,'anticipation does not deal damage');advance(b,.25);assert(v.hp<v.max,'damage lands on strike');assert(u.stop>=0);
b=new Battle();u=b.add(1,1);v=b.add(-1,0);u.x=500;v.x=550;u.charge=100;v.attackLeft=10;b.step(1/60);assert(b.cut);assert.equal(v.hp,v.max,'cutin before impact');const time=b.time;advance(b,.5);assert.equal(b.time,time);advance(b,.6);assert.equal(v.hp,0);assert.equal(b.cut,null);
b=new Battle();u=b.add(1,2);u.x=899;b.temple=10;u.attackLeft=0;advance(b,.5);assert.equal(b.result,'win');
b=new Battle();v=b.add(-1,0);v.x=106;v.attackLeft=0;b.home=10;advance(b,.5);assert.equal(b.result,'lose');
b=new Battle();advance(b,34);assert(b.boss);assert(b.units.some(u=>u.id==='tengu'));
b=new Battle();let skills=0;for(let t=0;t<300&&!b.result;t+=1/60){for(const i of [1,2,3,4,5])if(b.canDeploy(i))b.deploy(i);if(b.units.filter(u=>u.side===1).length<4&&b.canDeploy(0))b.deploy(0);b.step(1/60);skills+=b.takeEvents().filter(e=>e.type==='skill-impact').length}assert.equal(b.result,'win');assert(skills>0);
const meta=JSON.parse(fs.readFileSync(new URL('../motion-meta-v050.json',import.meta.url)));assert.equal(Object.keys(meta).length,9);for(const [id,m]of Object.entries(meta)){assert.equal(m.rects.length,8);assert.equal(m.feet.length,8);assert(m.head>200);for(const [i,r]of m.rects.entries()){assert(r[0]>=0&&r[1]>=0&&r[0]+r[2]<=m.width&&r[1]+r[3]<=m.height,`${id} frame bounds`);assert.equal(r[1]+r[3]-1,m.feet[i],`${id} planted baseline`)}assert(m.anchor>0)}
console.log('PASS: six warriors, costs/redeploy, anticipation/impact, automatic cutin before skill, win/loss/boss, complete battle, nine eight-frame atlases and foot anchors.');

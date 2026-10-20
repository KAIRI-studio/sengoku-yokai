import test from 'node:test';import assert from 'node:assert/strict';
import {period,shoulder,upperPivot,elbowPivot,armScale,poseAt,joints,forePoint} from './title-salute-rig-v172.mjs';
const angle=([x,y])=>Math.atan2(y,x)*180/Math.PI;
test('salute elbow stays on the original flexion side and limbs never spin through a half turn',()=>{
  const upperAngle=angle([elbowPivot[0]-upperPivot[0],elbowPivot[1]-upperPivot[1]]),lowerAngle=angle([215-elbowPivot[0],665-elbowPivot[1]]);
  for(let t=0;t<=period;t+=8){const p=poseAt(t),flex=lowerAngle+joints(p).foreAngle-upperAngle-p.shoulder;assert.ok(flex>=3&&flex<=22,`reverse elbow at ${t}: ${flex}`);assert.ok(Math.abs(p.shoulder)<90);assert.ok(Math.abs(joints(p).foreAngle)<90)}
});
test('shoulder and elbow retain their bone length and the same shared elbow anchor',()=>{
  const length=Math.hypot(elbowPivot[0]-upperPivot[0],elbowPivot[1]-upperPivot[1])*armScale;
  for(let t=0;t<=period;t+=8){const p=poseAt(t),j=joints(p),start=forePoint(elbowPivot,p);assert.ok(Math.abs(Math.hypot(j.elbow[0]-shoulder[0],j.elbow[1]-shoulder[1])-length)<1e-9);assert.deepEqual(start,j.elbow)}
});
test('blade stays above the planted feet across the full motion',()=>{
  const blade=[[355,717],[600,860],[860,1000],[1200,1145]];
  for(let t=0;t<=period;t+=8)for(const p of blade)assert.ok(forePoint(p,poseAt(t))[1]<1230-30,`blade drags at ${t}`);
});
test('blade avoids the face at eye level through raise and return',()=>{
  const blade=[[355,717],[600,860],[860,1000],[1200,1145]],eyeLeft=740,eyeRight=895;
  for(let t=0;t<=period;t+=8){const points=blade.map(p=>forePoint(p,poseAt(t)));for(let k=1;k<points.length;k++)for(let s=0;s<=1;s+=.02){const a=points[k-1],b=points[k],x=a[0]+(b[0]-a[0])*s,y=a[1]+(b[1]-a[1])*s;if(y>=370&&y<=445)assert.ok(x<eyeLeft-24||x>eyeRight+24,`blade crosses eyes at ${t}: ${x},${y}`)}}
});

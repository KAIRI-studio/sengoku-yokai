import test from 'node:test';
import assert from 'node:assert/strict';
import {CLOUDS,cloudPosition} from '../title-clouds-v114.mjs';
import {readFileSync} from 'node:fs';
test('cloud motion follows time, crosses the scene continuously and wraps off-screen',()=>{
 for(const c of CLOUDS){assert.ok(c.speed>0);assert.equal(cloudPosition(c,0),c.x);assert.ok(Math.abs(cloudPosition(c,1)-cloudPosition(c,0)-c.speed)<1e-9);const period=(1000+c.width*2)/c.speed;assert.ok(Math.abs(cloudPosition(c,period)-cloudPosition(c,0))<1e-8);for(const t of [0,1,30,90,3600]){const x=cloudPosition(c,t);assert.ok(Number.isFinite(x)&&x>=-c.width&&x<1000+c.width)}}
 assert.ok(new Set(CLOUDS.map(c=>c.speed)).size>1)
});
test('title never tracks the mouse or translates the landscape; float belongs only to logo',()=>{
 const js=readFileSync(new URL('../title-motion-v114.mjs',import.meta.url),'utf8'),css=readFileSync(new URL('../polish-v114.css',import.meta.url),'utf8');
 assert.doesNotMatch(js,/pointermove|mousemove|pointerleave|title-look/);assert.doesNotMatch(css,/scenery-breathe|title-look/);
 assert.match(css,/\.title-landscape\{[^}]*transform:none;animation:none;transition:none/);
 assert.match(css,/translateY\(-1\.3cqw\)/);assert.match(js,/destination-in/);
 assert.match(js,/document.hidden/);assert.match(js,/cancelAnimationFrame/);assert.match(js,/prefers-reduced-motion/)
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {viewportCanvas,viewportLayout} from '../viewport-v107.mjs';

test('the complete scene scales to the available width and height with safe insets',()=>{
 for(const [width,height,insets] of [[667,320,{}],[844,390,{left:44,bottom:21}],[580,280,{}],[1024,768,{}],[1366,768,{}]]){
  const {game}=viewportLayout({width,height,insets});
  const canvas=viewportCanvas(game);
  assert.equal(canvas.width,Math.max(900,game.width));
  assert.ok(Math.abs(canvas.width*canvas.scale-game.width)<0.001);
  assert.ok(Math.abs(canvas.height*canvas.scale-game.height)<0.001);
  assert.ok(game.left>=(insets.left||0));
  assert.ok(game.left+game.width<=width+0.001);
  assert.ok(game.top+game.height<=height-(insets.bottom||0)+0.001);
 }
});

test('loading battle reuses the layout already installed by the hub',()=>{
 const layoutImport=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8').match(/import '\.\/(shell-layout[^']+)'/)?.[1];
 const hubLayout=layoutImport('hub-app-v187.mjs');
 assert.ok(hubLayout);
 assert.equal(layoutImport('faithful-app-v187.mjs'),hubLayout);
});

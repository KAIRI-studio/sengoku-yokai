import test from'node:test';import assert from'node:assert/strict';
import{allies}from'../catalog-v100.mjs';import{FOOT_ANCHORS}from'../character-stage-v139.mjs';import{mountHomeAura,HOME_AURA_COLORS}from'../home-aura-v173.mjs';
test('all sixteen home characters share the same canvas, foot centre and ground, including aura-free rarities',async()=>{
  const canvases=[],frames=new Map();let serial=0;
  function surface(){const c={width:64,height:64,draws:[],setAttribute(){},remove(){}};const api={getImageData(){const data=new Uint8ClampedArray(c.width*c.height*4);for(let y=1;y<c.height-1;y++)for(let x=1;x<c.width-1;x++)data[(y*c.width+x)*4+3]=255;return{data}},drawImage(...args){c.draws.push(args)},createRadialGradient:()=>({addColorStop(){}}),createLinearGradient:()=>({addColorStop(){}})};c.getContext=()=>new Proxy(api,{get(o,k){return o[k]||(()=>{})},set(o,k,v){o[k]=v;return true}});canvases.push(c);return c}
  globalThis.document={hidden:false,createElement:surface,addEventListener(){},removeEventListener(){}};globalThis.Image=class{naturalWidth=64;naturalHeight=64;async decode(){}};
  globalThis.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});globalThis.IntersectionObserver=class{observe(){}disconnect(){}};
  globalThis.requestAnimationFrame=fn=>{frames.set(++serial,fn);return serial};globalThis.cancelAnimationFrame=id=>frames.delete(id);
  assert.equal(allies.length,16);
  for(const hero of allies){
    const first=canvases.length,host={dataset:{},append(){},classList:{add(){},remove(){}}};
    const stop=mountHomeAura(host,hero.id,{alignFeet:true,home:true});await new Promise(resolve=>setImmediate(resolve));
    if(HOME_AURA_COLORS[hero.id]){const [id,paint]=frames.entries().next().value;frames.delete(id);paint(100)}else assert.equal(frames.size,0,'ordinary art must not animate');
    const main=canvases[first];assert.equal(main.width,1020,hero.id);assert.equal(main.height,660,hero.id);
    const art=main.draws.find(args=>args.length===5&&args[0].naturalHeight&&args[0].width<600);assert.ok(art,hero.id+' has drawn art');
    const [,x,y,w,h]=art;assert.ok(Math.abs(x+w*FOOT_ANCHORS[hero.id]-340)<1e-6,hero.id+' horizontal feet');assert.equal(y+h,410,hero.id+' ground');
    stop();assert.equal(frames.size,0);
  }
});

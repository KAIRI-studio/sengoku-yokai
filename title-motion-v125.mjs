import{CLOUDS,cloudPosition}from'./title-clouds-v118.mjs';
const title=document.querySelector('#title-screen'),canvas=document.querySelector('#title-atmosphere');
const ctx=canvas.getContext('2d'),motion=matchMedia('(prefers-reduced-motion: reduce)');
const cloud=new Image(),background=new Image(),mask=document.createElement('canvas');
cloud.src='./assets/title-cloud-v114.png';background.src='./assets/title-plate-v125.webp';
let frame=0,last=0,time=0,width=1000,height=563,loaded=false;
function load(image){return new Promise((resolve,reject)=>{if(image.complete&&image.naturalWidth)return resolve();image.onload=resolve;image.onerror=reject})}
function resize(){const box=title.getBoundingClientRect();if(!box.width)return;width=1000;height=1000*box.height/box.width;canvas.width=width;canvas.height=Math.round(height);if(loaded)buildSkyMask()}
// Keep drifting clouds behind roofs, banners and trees by masking the sky pixels.
// This is calculated once per resize, not once per animation frame.
function buildSkyMask(){mask.width=canvas.width;mask.height=canvas.height;const g=mask.getContext('2d',{willReadFrequently:true});g.drawImage(background,0,0,mask.width,mask.height);const pixels=g.getImageData(0,0,mask.width,mask.height),data=pixels.data;
 for(let y=0;y<mask.height;y++)for(let x=0;x<mask.width;x++){const i=(y*mask.width+x)*4,r=data[i],green=data[i+1],b=data[i+2];data[i]=data[i+1]=data[i+2]=255;data[i+3]=y<mask.height*.295&&b>190&&green>170&&b-r>55&&green-r>45?255:0}
 g.putImageData(pixels,0,0)
}
function draw(seconds){ctx.clearRect(0,0,width,height);if(!loaded)return;
 for(const c of CLOUDS){ctx.globalAlpha=c.alpha;const h=c.width*cloud.naturalHeight/cloud.naturalWidth;ctx.drawImage(cloud,cloudPosition(c,seconds),c.y,c.width,h)}
 ctx.globalAlpha=1;ctx.globalCompositeOperation='destination-in';ctx.drawImage(mask,0,0);ctx.globalCompositeOperation='source-over';
}
function active(){return loaded&&!title.hidden&&!document.hidden&&title.classList.contains('title-active')&&!motion.matches}
function tick(now){frame=0;if(!active()){last=0;return}const dt=last?Math.min((now-last)/1000,.05):0;last=now;time+=dt;draw(time);frame=requestAnimationFrame(tick)}
function sync(){if(frame)cancelAnimationFrame(frame);frame=0;last=0;resize();draw(time);if(active())frame=requestAnimationFrame(tick)}
new MutationObserver(sync).observe(title,{attributes:true,attributeFilter:['hidden','class']});
new ResizeObserver(()=>{resize();draw(time)}).observe(title);
document.addEventListener('visibilitychange',sync);motion.addEventListener('change',sync);
Promise.all([load(cloud),load(background)]).then(()=>{loaded=true;sync()}).catch(error=>{console.error('Title cloud assets failed to load',error)});
sync();

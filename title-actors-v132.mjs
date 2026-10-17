import{RUNNERS,runnerPose}from'./title-runners-v131.mjs';
const title=document.querySelector('#title-screen'),canvas=document.querySelector('#title-characters'),ctx=canvas.getContext('2d'),motion=matchMedia('(prefers-reduced-motion: reduce)');
let ready=false,raf=0,last=0,time=0,meta,sheets;
const load=src=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=src});
function draw(){
 if(!ready)return;const ratio=Math.min(devicePixelRatio||1,2),width=Math.round(canvas.clientWidth*ratio),height=Math.round(canvas.clientHeight*ratio);if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height}ctx.setTransform(width/1000,0,0,height/563,0,0);ctx.clearRect(0,0,1000,563);
 RUNNERS.forEach((runner,index)=>{const pose=runnerPose(index,time),m=meta[runner.id],f=pose.frame,c=m.width/4,h=m.height/2,scale=runner.size/(m.scaleWidth||c),foot=m.feet[f],sx=f%4*c,ground=559,x=pose.x-m.anchor*scale;
 ctx.fillStyle='#78572e26';ctx.beginPath();ctx.ellipse(pose.x,ground+2,28,4,0,0,Math.PI*2);ctx.fill();ctx.save();if(runner.flip!==!!m.flipped?.includes(f)){ctx.translate(pose.x*2,0);ctx.scale(-1,1)}
 const rect=m.rects[f];ctx.save();ctx.beginPath();ctx.rect(x+(rect[0]-sx)*scale,ground+(rect[1]-foot)*scale,rect[2]*scale,rect[3]*scale);for(const q of m.holes?.[f]||[])ctx.rect(x+(q[0]-sx)*scale,ground+(q[1]-foot)*scale,q[2]*scale,q[3]*scale);ctx.clip('evenodd');ctx.drawImage(sheets[index],...rect,x+(rect[0]-sx)*scale,ground+(rect[1]-foot)*scale,rect[2]*scale,rect[3]*scale);ctx.restore();for(const p of m.extensions?.[f]||[])ctx.drawImage(sheets[index],...p,x+(p[0]-sx)*scale,ground+(p[1]-foot)*scale,p[2]*scale,p[3]*scale);ctx.restore();
 });canvas.dataset.time=time.toFixed(2);canvas.dataset.renderer='battle-sprites';canvas.dataset.figures=RUNNERS.length;
}
function active(){return ready&&!document.hidden&&!title.hidden&&title.classList.contains('title-active')}
function tick(now){raf=0;if(!active()){last=0;return}if(last)time+=Math.min((now-last)/1000,.1);last=now;draw();raf=requestAnimationFrame(tick)}
function sync(){cancelAnimationFrame(raf);last=0;draw();if(active()&&!motion.matches)raf=requestAnimationFrame(tick)}
Promise.all([fetch('./motion-meta-v100.json').then(r=>{if(!r.ok)throw Error('Sprite metadata');return r.json()}),Promise.all(RUNNERS.map(r=>load(`./assets/motion-${r.id}-v050.webp`))),load('./assets/title-plate-v125.webp')]).then(([data,images])=>{meta=data;sheets=images;ready=true;draw();title.classList.add('characters-ready');sync()}).catch(error=>{canvas.dataset.error=String(error)});
new MutationObserver(sync).observe(title,{attributes:true,attributeFilter:['class','hidden']});document.addEventListener('visibilitychange',sync);motion.addEventListener('change',sync);new ResizeObserver(draw).observe(canvas);

// A small, self-contained title scene. No timers run while the title is hidden.
const title=document.querySelector('#title-screen'),canvas=document.querySelector('#title-atmosphere');
const ctx=canvas.getContext('2d'),motion=matchMedia('(prefers-reduced-motion: reduce)');
let frame=0,last=0,time=0,width=1000,height=563;
const particles=Array.from({length:24},(_,i)=>({x:(i*.61803398875)%1,y:(i*.38196601125)%1,size:i%3===0?3.8:1.1,speed:8+i%7,phase:i*1.7,leaf:i%4===0}));
function resize(){const box=title.getBoundingClientRect();if(!box.width)return;width=1000;height=1000*box.height/box.width;canvas.width=1000;canvas.height=Math.round(height)}
function active(){return !title.hidden&&!document.hidden&&title.classList.contains('title-active')&&!motion.matches}
function tick(now){frame=0;if(!active()){last=0;return}const dt=last?Math.min((now-last)/1000,.05):0;last=now;time+=dt;ctx.clearRect(0,0,width,height);
 for(const p of particles){const x=(p.x*width+time*p.speed)%(width+40)-20,y=p.y*height+Math.sin(time*.5+p.phase)*13;ctx.save();ctx.translate(x,y);ctx.rotate(time*(p.leaf?.3:.15)+p.phase);ctx.globalAlpha=p.leaf?.46:.28+Math.sin(time+p.phase)*.15;ctx.fillStyle=p.leaf?'#e5ac48':'#fff6bd';if(p.leaf){ctx.beginPath();ctx.ellipse(0,0,p.size*1.6,p.size*.55,0,0,Math.PI*2);ctx.fill()}else{ctx.shadowColor='#fff7ca';ctx.shadowBlur=9;ctx.beginPath();ctx.arc(0,0,p.size,0,Math.PI*2);ctx.fill()}ctx.restore()}
 frame=requestAnimationFrame(tick)}
function sync(){if(frame)cancelAnimationFrame(frame);frame=0;last=0;resize();if(active())frame=requestAnimationFrame(tick);else ctx.clearRect(0,0,width,height)}
new MutationObserver(sync).observe(title,{attributes:true,attributeFilter:['hidden','class']});
new ResizeObserver(resize).observe(title);document.addEventListener('visibilitychange',sync);motion.addEventListener('change',sync);
title.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||motion.matches)return;const b=title.getBoundingClientRect();title.style.setProperty('--title-look-x',((e.clientX-b.left)/b.width-.5)*.55+'cqw');title.style.setProperty('--title-look-y',((e.clientY-b.top)/b.height-.5)*.35+'cqw')});
title.addEventListener('pointerleave',()=>{title.style.setProperty('--title-look-x','0cqw');title.style.setProperty('--title-look-y','0cqw')});sync();

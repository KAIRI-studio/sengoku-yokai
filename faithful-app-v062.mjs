import{Battle,allies,enemies,WORLD_WIDTH,HOME_X,ENEMY_X}from'./lane-engine-v059.mjs';
const $=s=>document.querySelector(s),game=$('#game'),canvas=$('#battle-canvas'),ctx=canvas.getContext('2d'),W=1000,H=941/1672*1000,GROUND=362,ids=[...allies,...enemies].map(u=>u.id),sheets={};let meta={},battle=new Battle(),mode='welcome',paused=false,ready=false,last=0,acc=0,clock=0,motionTime=0,cutU=null,resultTimer=0;let camera=0,drag=null,suppressTap=false,manualCameraUntil=0;const effects=[],ghosts=[];const cell=1672/6;
$('#cards').innerHTML=allies.map((a,i)=>`<button class="card ${a.rarity}" data-index="${i}" aria-label="${a.name}を出す おこめ${a.cost}"><svg class="card-art" viewBox="${i*cell} 637 ${cell} 294" preserveAspectRatio="none" aria-hidden="true"><image href="./assets/approved-six-v050.webp" width="1672" height="941"/></svg><span class="veil"></span><span class="skill-seal" aria-hidden="true"><img src="./assets/skill-ready-v058.webp" alt=""/></span><span class="resources" aria-hidden="true"><span class="resource-row hp-row"><span class="resource-name">HP</span><span class="resource-bar hp-bar"><i></i></span></span><span class="resource-row skill-row"><span class="resource-name">ひっさつ</span><span class="resource-bar skill-bar"><i></i></span></span></span><span class="meter"><i></i></span><span class="badge"></span>${a.rarity==='normal'?'':`<span class="sparkles"><i class="glint">✦</i><i class="glint">✦</i>${a.rarity==='legend'?'<i class="glint">✦</i>':''}</span>`}</button>`).join('');const cards=[...document.querySelectorAll('.card')];
const preview=[{...allies[0],x:65,uid:101,frame:0},{...allies[0],x:168,uid:102,frame:2},{...allies[1],x:288,uid:103,frame:7},{...allies[2],x:413,uid:104,frame:7},{...allies[3],x:533,uid:105,frame:7},{...enemies[0],x:621,uid:106,frame:0},{...enemies[0],x:710,uid:107,frame:2},{...enemies[1],x:795,uid:108,frame:7},{...enemies[2],x:915,uid:109,frame:7}].map(u=>({...u,side:u.art>=6?-1:1,hp:u.hp,max:u.hp,charge:65,hit:0,pose:0,walk:0}));
const motionAllies=allies.map((d,i)=>({...d,uid:200+i,x:60+i*156,baseX:60+i*156,side:1,hp:d.hp,max:d.hp,charge:50,hit:0,walk:0}));
const motionEnemies=enemies.map((d,i)=>({...d,uid:210+i,x:250+i*240,baseX:250+i*240,side:-1,hp:d.hp,max:d.hp,charge:50,hit:0,walk:0}));let motionUnits=motionAllies;
function announce(t){$('#announcement').textContent=t}
// Fit the complete 16:9 scene into the actual visible browser area.
// No fullscreen permission, installation or orientation lock is required.
let viewportFrame=0;
function fitViewport(){
 viewportFrame=0;
 const viewport=window.visualViewport;
 if(viewport&&Math.abs(viewport.scale-1)>.01)return;
 const width=viewport?.width||window.innerWidth,height=viewport?.height||window.innerHeight;
 document.documentElement.style.setProperty('--visible-height',height+'px');
 const padding=getComputedStyle(document.body);
 const horizontal=(parseFloat(padding.paddingLeft)||0)+(parseFloat(padding.paddingRight)||0);
 const vertical=(parseFloat(padding.paddingTop)||0)+(parseFloat(padding.paddingBottom)||0);
 const availableWidth=Math.max(1,width-horizontal),availableHeight=Math.max(1,height-vertical);
 const gameWidth=Math.min(availableWidth,availableHeight*1672/941);
 game.style.width=gameWidth+'px';game.style.height=gameWidth*941/1672+'px';
 const sideWidth=Math.max(0,(availableWidth-gameWidth)/2),showSides=sideWidth>=64&&availableHeight>=200;
 const left=document.querySelector('#side-brand'),right=document.querySelector('#side-guide');
 for(const panel of [left,right]){if(!panel)continue;panel.hidden=!showSides;panel.style.width=sideWidth+'px';panel.style.height=availableHeight+'px';panel.style.top=(parseFloat(padding.paddingTop)||0)+'px'}
 if(left)left.style.left=(parseFloat(padding.paddingLeft)||0)+'px';
 if(right)right.style.right=(parseFloat(padding.paddingRight)||0)+'px';

}
function scheduleViewport(){if(!viewportFrame)viewportFrame=requestAnimationFrame(fitViewport)}
window.addEventListener('resize',scheduleViewport,{passive:true});
window.addEventListener('orientationchange',scheduleViewport,{passive:true});
window.addEventListener('pageshow',scheduleViewport,{passive:true});
window.visualViewport?.addEventListener('resize',scheduleViewport,{passive:true});
fitViewport();
function resize(){const r=game.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);draw()}
if('ResizeObserver'in window)new ResizeObserver(resize).observe(game);else window.addEventListener('resize',resize);
function frameOf(u){if(mode==='welcome')return u.frame;if(mode==='motion'){const phase=(motionTime+u.uid*.13)%4.3;return phase<2.3?Math.floor(phase*9)%4:attackFrame((phase-2.3)%1)}if(u.action)return attackFrame(u.action.elapsed);if(u.pose>0)return 6;if(u.moving)return Math.floor(u.walk*9)%4;return 7}
function attackFrame(t){return t<.13?4:t<.28?5:t<.46?6:7}
function sprite(u,opacity=1){const im=sheets[u.id],m=meta[u.id];if(!im||!m)return;const f=frameOf(u),c=m.width/4,h=m.height/2,scale=u.size/c,foot=m.feet[f],anchor=m.anchor,sy=Math.floor(f/4)*h,sx=f%4*c;let lunge=0;if(u.action){const t=u.action.elapsed;lunge=t<.16?-2*Math.sin(t/.16*Math.PI):t<.46?8*Math.sin((t-.16)/.3*Math.PI):0}if(mode==='motion'&&f===6)lunge=6;const x=u.x-anchor*scale+lunge*u.side,y=GROUND-foot*scale;
 ctx.save();ctx.globalAlpha=opacity;ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';if(u.hit>0)ctx.filter='brightness(1.55)';const flipped=m.flipped?.includes(f);if(flipped){ctx.translate(u.x*2,0);ctx.scale(-1,1)}const rect=m.rects[f];ctx.save();ctx.beginPath();ctx.rect(x+(rect[0]-sx)*scale,GROUND+(rect[1]-foot)*scale,rect[2]*scale,rect[3]*scale);for(const q of m.holes?.[f]||[])ctx.rect(x+(q[0]-sx)*scale,GROUND+(q[1]-foot)*scale,q[2]*scale,q[3]*scale);ctx.clip('evenodd');ctx.drawImage(im,...rect,x+(rect[0]-sx)*scale,GROUND+(rect[1]-foot)*scale,rect[2]*scale,rect[3]*scale);ctx.restore();
 // Small source rectangles extend the weapon only; body scale remains constant.
 for(const p of m.extensions?.[f]||[])ctx.drawImage(im,...p,x+(p[0]-sx)*scale,GROUND+(p[1]-foot)*scale,p[2]*scale,p[3]*scale);
 ctx.restore();
 if(opacity<1)return;
 if(u.skill&&mode!=='motion'){const barY=GROUND-m.head*scale-12;ctx.save();ctx.fillStyle='#39291c';round(u.x-23,barY,59,9,4);ctx.fill();ctx.strokeStyle='#ffe38c';ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle='#f4bf38';round(u.x-21,barY+2,55*Math.min(100,u.charge)/100,5,2);ctx.fill();ctx.translate(u.x-26,barY+4.5);ctx.rotate(Math.PI/4);ctx.fillStyle='#ffd750';ctx.fillRect(-5,-5,10,10);ctx.strokeStyle='#503516';ctx.lineWidth=1.4;ctx.strokeRect(-5,-5,10,10);ctx.restore()}
 if(mode==='battle'&&u.hp<u.max){ctx.save();ctx.globalAlpha=.8;ctx.fillStyle='#403122';round(u.x-22,GROUND+3,44,3,2);ctx.fill();ctx.fillStyle=u.side===1?'#94f16b':'#ff7463';round(u.x-22,GROUND+3,44*Math.max(0,u.hp/u.max),3,2);ctx.fill();ctx.restore()}
}
function round(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,Math.max(.1,w),h,r)}
function arc(x,y,r,tint,alpha=1){ctx.save();ctx.globalAlpha=alpha;for(const [color,thick,offset]of[[tint,23,0],['#fffaf0',12,-2]]){ctx.beginPath();for(let j=0;j<=32;j++){const t=j/32,a=-2.15+t*2.15,rr=r+offset+Math.sin(t*Math.PI)*thick/2;const xx=x+Math.cos(a)*rr,yy=y+Math.sin(a)*rr;if(j===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy)}for(let j=32;j>=0;j--){const t=j/32,a=-2.15+t*2.15,rr=r+offset-Math.sin(t*Math.PI)*thick/2;ctx.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}ctx.closePath();ctx.fillStyle=color;ctx.fill()}ctx.restore()}
function vfx(e){const p=e.t/e.life,a=1-p;ctx.save();ctx.globalAlpha=a;
 if(e.type==='dust'){ctx.fillStyle='#fff1d3';ctx.beginPath();ctx.ellipse(e.x,GROUND-2-e.t*8,3+p*10,2+p*6,0,0,Math.PI*2);ctx.fill()}
 if(e.type==='damage'){ctx.font=`900 ${e.big?27:19}px system-ui`;ctx.textAlign='center';ctx.strokeStyle='#44271b';ctx.lineWidth=3;ctx.fillStyle='#fff4cc';const y=GROUND-100-p*28;ctx.strokeText(e.text,e.x,y);ctx.fillText(e.text,e.x,y)}
 if(e.type==='slash'){arc(e.x+e.side*8,GROUND-70,58+p*12,e.tint,a);if(e.style==='spear'){ctx.strokeStyle='#fff9df';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(e.x,GROUND-67);ctx.lineTo(e.x+e.side*(100+p*35),GROUND-67);ctx.stroke();ctx.strokeStyle=e.tint;ctx.lineWidth=12;ctx.globalAlpha=a*.5;ctx.stroke()}}
 if(e.type==='skill'){const x=e.x+50;arc(x,GROUND-83,105+p*60,e.tint,a);arc(x+70,GROUND-63,73+p*40,e.tint,a*.7);ctx.globalAlpha=a*.65;for(let i=0;i<9;i++){const q=i/8;const xx=x+q*175,yy=GROUND-20-Math.sin(q*Math.PI)*120-p*35;ctx.fillStyle=i%2?'#fff7dd':e.tint;ctx.beginPath();ctx.moveTo(xx,yy-18);ctx.lineTo(xx+10,yy+6);ctx.lineTo(xx-8,yy+14);ctx.closePath();ctx.fill()}}
 ctx.restore()}
function draw(){if(!ctx)return;ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);ctx.clearRect(0,0,W,H);if(!ready)return;const units=mode==='welcome'?preview:mode==='motion'?motionUnits:battle.units;ctx.save();ctx.translate(mode==='battle'?-camera:0,0);ctx.fillStyle='#4c2a171c';for(const u of units){ctx.beginPath();ctx.ellipse(u.x,GROUND+1,u.size*.19,4,0,0,Math.PI*2);ctx.fill()}
 if(mode==='welcome'){arc(382,GROUND-117,100,'#ee342f',.95);arc(550,GROUND-77,58,'#48bcff',.85)}
 for(const u of [...units].sort((a,b)=>a.art===8?-1:b.art===8?1:a.x-b.x))sprite(u);for(const g of ghosts)sprite(g.u,Math.max(0,1-g.t/.4));for(const e of effects)vfx(e);ctx.restore();syncCamera();syncSpecials();
 canvas.dataset.mode=mode;canvas.dataset.frames=units.map(u=>u.id+':'+frameOf(u)).join(',');canvas.dataset.time=battle.time.toFixed(2);canvas.dataset.camera=String(Math.round(camera));
}
function effect(e){effects.push({t:0,life:.4,...e})}
function events(){for(const e of battle.takeEvents()){
 if(e.type==='spawn')announce(e.u.name+'、しゅつげき！');
 if(e.type==='damage')effect({type:'damage',x:e.x,text:e.amount,life:.75});
 if(e.type==='attack')effect({type:'slash',x:e.u.x,side:e.u.side,style:e.u.style,tint:e.u.tint||(e.u.side===1?'#ff8a4c':'#994fbe'),life:.28});
 if(e.type==='fall'){const u=battle.units.find(u=>u.uid===e.uid);if(u)ghosts.push({u:{...u,action:null,pose:0,moving:false},t:0})}
 if(e.type==='boss')announce('大きな てんぐが あらわれた！');
 if(e.type==='special'){cutU=e.u;showCut(e.u);announce(e.u.name+'の '+e.u.skill+'！')}
 if(e.type==='skill-impact'){hideCut();effect({type:'skill',x:e.u.x,tint:e.u.tint,life:.75})}
 if(e.type==='result'){resultTimer=.6;hideCut()}
 }}
// Render only the selected sprite, including its weapon extensions, onto an isolated surface.
const cutArt=new Map();
function isolatedCutArt(u){
 if(cutArt.has(u.id))return cutArt.get(u.id);
 const m=meta[u.id],f=6,r=m.rects[f],parts=[r,...(m.extensions?.[f]||[])],pad=12;
 const left=Math.min(...parts.map(q=>q[0]))-pad,top=Math.min(...parts.map(q=>q[1]))-pad;
 const right=Math.max(...parts.map(q=>q[0]+q[2]))+pad,bottom=Math.max(...parts.map(q=>q[1]+q[3]))+pad;
 const c=document.createElement('canvas');c.width=right-left;c.height=bottom-top;
 const g=c.getContext('2d');g.save();g.beginPath();g.rect(r[0]-left,r[1]-top,r[2],r[3]);
 for(const q of m.holes?.[f]||[])g.rect(q[0]-left,q[1]-top,q[2],q[3]);
 g.clip('evenodd');g.drawImage(sheets[u.id],...r,r[0]-left,r[1]-top,r[2],r[3]);g.restore();
 for(const q of parts.slice(1))g.drawImage(sheets[u.id],...q,q[0]-left,q[1]-top,q[2],q[3]);
 const url=c.toDataURL();cutArt.set(u.id,url);return url;
}
function showCut(u){
 $('#cutin').innerHTML=`<div class="cut-lines"></div><div class="cut-spark"></div><div class="cutface"><img src="${isolatedCutArt(u)}" alt="${u.name}" /></div><div class="cutwords"><small>${u.name}</small><strong>${u.skill}</strong><span>ひっさつ！</span></div>`;
 $('#cutin').style.setProperty('--tint',u.tint);$('#cutin').hidden=false;
 $('#cutin').style.animation='none';void $('#cutin').offsetWidth;$('#cutin').style.animation='';
}
function hideCut(){$('#cutin').hidden=true;cutU=null}
function ui(){const welcome=mode!=='battle';$('#rice').textContent=welcome?'850':Math.floor(battle.rice);for(const [sel,value,max]of[['.home',battle.home,3000],['.enemy',battle.temple,4600]]){const e=$('.base-hp'+sel);e.querySelector('i').style.width=(welcome?100:value/max*100)+'%';e.setAttribute('aria-valuenow',String(welcome?max:value))}
 cards.forEach((b,i)=>{
 const u=battle.active(i),alive=i>0&&!!u,isSkill=alive&&!!u.skill;
 const skillReady=isSkill&&battle.canSpecial(u.uid),can=mode==='battle'&&!paused&&(isSkill?skillReady:battle.canDeploy(i));
 b.disabled=!can;b.classList.toggle('disabled',mode==='battle'&&!can&&!alive);b.classList.toggle('deployed',alive);b.classList.toggle('ready',can);
 b.classList.toggle('skill-charging',mode==='battle'&&isSkill);b.classList.toggle('skill-ready',mode==='battle'&&skillReady);b.classList.toggle('hp-active',mode==='battle'&&alive);b.querySelector('.hp-bar i').style.width=(alive?u.hp/u.max*100:0)+'%';b.querySelector('.skill-bar i').style.width=(isSkill?u.charge:0)+'%';
 const cd=battle.cooldowns[i],badge=b.querySelector('.badge');
 badge.textContent=alive?'':cd>0?Math.ceil(cd)+'びょう':battle.rice<allies[i].cost?'おこめ待ち':'';
 b.setAttribute('aria-label',isSkill?allies[i].name+'のひっさつ '+(skillReady?'使える':Math.floor(u.charge)+'パーセント'):allies[i].name+'を出す おこめ'+allies[i].cost);
 b.querySelector('.meter i').style.width=(welcome?55:alive?u.hp/u.max*100:cd>0?(1-cd/allies[i].wait)*100:100)+'%';
 })}

function syncCamera(){
 const active=mode==='battle';$('#camera-tools').hidden=!active;
 $('#backdrop').style.width=active?`${WORLD_WIDTH/W*100}%`:'100%';
 $('#backdrop').style.transform=active?`translateX(${-camera/WORLD_WIDTH*100}%)`:'';
 for(const [sel,x]of[['.home',HOME_X],['.enemy',ENEMY_X]]){
  const hp=$('.base-hp'+sel);hp.style.left=active?`${(x-camera-58)/W*100}%`:'';hp.style.right=active?'auto':'';
  hp.hidden=active&&(x-camera<-58||x-camera>W+58);
 }
 $('#camera-left').disabled=camera<=0;$('#camera-right').disabled=camera>=WORLD_WIDTH-W;
 $('#camera-position').style.setProperty('--position',`${camera/(WORLD_WIDTH-W)*100}%`);
}
function syncSpecials(){$('#specials').replaceChildren()}
function moveCamera(x){manualCameraUntil=clock+3;camera=Math.max(0,Math.min(WORLD_WIDTH-W,x));draw()}
function followLeader(dt){
 if(mode!=='battle'||drag||clock<manualCameraUntil||battle.cutLeft>0||battle.result)return;
 const alive=battle.units.filter(u=>u.side===1&&u.hp>0);
 if(!alive.length)return;
 const lead=Math.max(...alive.map(u=>u.x)),target=Math.max(0,Math.min(WORLD_WIDTH-W,lead-W*.42));
 camera+=(target-camera)*(1-Math.exp(-dt*4));
 if(Math.abs(target-camera)<.1)camera=target;
}
$('#camera-left').onclick=()=>moveCamera(camera-W*.65);$('#camera-right').onclick=()=>moveCamera(camera+W*.65);
canvas.addEventListener('pointerdown',e=>{if(mode!=='battle'||paused||battle.cutLeft>0)return;drag={id:e.pointerId,start:e.clientX,camera};suppressTap=false;canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const dx=e.clientX-drag.start;if(Math.abs(dx)>6)suppressTap=true;moveCamera(drag.camera-dx/game.getBoundingClientRect().width*W)});
function endDrag(e){if(drag?.id===e.pointerId)drag=null}
canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);
canvas.addEventListener('wheel',e=>{if(mode!=='battle')return;e.preventDefault();moveCamera(camera+(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)/game.getBoundingClientRect().width*W)},{passive:false});
function start(){camera=0;manualCameraUntil=0;drag=null;battle=new Battle();effects.length=0;ghosts.length=0;mode='battle';paused=false;acc=0;last=0;resultTimer=0;$('#welcome').hidden=true;$('#motion-tools').hidden=true;$('#menu').hidden=true;$('#result').hidden=true;game.classList.remove('paused');hideCut();ui();draw()}
cards.forEach((b,i)=>b.onclick=()=>{if(paused||mode!=='battle')return;const u=battle.active(i);const done=u?.skill?battle.fireSpecial(u.uid):battle.deploy(i);if(done){events();ui();draw()}});
function motion(){mode='motion';paused=false;motionTime=0;acc=0;last=0;effects.length=0;ghosts.length=0;$('#welcome').hidden=true;$('#menu').hidden=true;$('#result').hidden=true;$('#motion-tools').hidden=false;hideCut();game.classList.remove('paused');$('#motion-pause').textContent='とめる Ⅱ';ui();draw()}
function welcome(){mode='welcome';paused=false;$('#welcome').hidden=false;$('#motion-tools').hidden=true;$('#menu').hidden=true;$('#result').hidden=true;hideCut();effects.length=0;ui();draw()}
 $('#start').onclick=start;$('#restart').onclick=start;$('#retry').onclick=start;$('#motion-preview').onclick=motion;$('#motions').onclick=motion;$('#motion-back').onclick=welcome;$('#motion-group').onclick=()=>{motionUnits=motionUnits===motionAllies?motionEnemies:motionAllies;$('#motion-group').textContent=motionUnits===motionAllies?'ようかいを 見る':'武将を 見る';motionTime=0;draw()};$('#motion-pause').onclick=()=>{paused=!paused;$('#motion-pause').textContent=paused?'うごかす ▶':'とめる Ⅱ';game.classList.toggle('paused',paused)};
$('#pause').onclick=()=>{if(mode==='welcome'){motion();return}if(mode==='motion'){welcome();return}paused=true;$('#menu').hidden=false;game.classList.add('paused');ui()};$('#resume').onclick=()=>{paused=false;$('#menu').hidden=true;game.classList.remove('paused');last=0;ui()};
document.addEventListener('visibilitychange',()=>{last=0;acc=0});
 let lastUI=0,lastDust=0;function tick(now){const dt=last?Math.min(.75,(now-last)/1000):0;last=now;if(ready&&!paused&&!document.hidden){clock+=dt;if(mode==='motion'){motionTime+=dt;for(const u of motionUnits){const p=(motionTime+u.uid*.13)%4.3;u.x=u.baseX+u.side*Math.min(25,p/2.3*25)}}if(mode==='battle'){acc+=dt;while(acc>=1/60){battle.step(1/60);events();acc-=1/60;if(battle.result){acc=0;break}}followLeader(dt);if(clock-lastDust>.13){for(const u of battle.units)if(u.moving)effect({type:'dust',x:u.x-u.side*10,life:.4});lastDust=clock}if(resultTimer>0){resultTimer-=dt;if(resultTimer<=0){$('#result-title').textContent=battle.result==='win'?'大しょうり！':'もう一回 ちょうせん！';$('#result-copy').textContent=battle.result==='win'?'お寺を とりもどしたよ！':'足軽で まもりながら 武将を出してみよう。';$('#result').hidden=false}}}
 for(let i=effects.length-1;i>=0;i--){effects[i].t+=dt;if(effects[i].t>=effects[i].life)effects.splice(i,1)}for(let i=ghosts.length-1;i>=0;i--){ghosts[i].t+=dt;if(ghosts[i].t>=.4)ghosts.splice(i,1)}if(now-lastUI>80){ui();lastUI=now}draw()}requestAnimationFrame(tick)}
try{meta=await fetch('./motion-meta-v052.json').then(r=>{if(!r.ok)throw Error('meta');return r.json()});await Promise.all(ids.map(id=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{sheets[id]=im;resolve()};im.onerror=reject;im.src=`./assets/motion-${id}-v050.webp`})));ready=true;resize();ui();if(new URLSearchParams(location.search).get('motion')==='1')motion();requestAnimationFrame(tick)}catch{announce('画像が よみこめませんでした。もういちど ひらいてね');$('#start').disabled=true;$('#start').textContent='もういちど よみこむ';$('#start').disabled=false;$('#start').onclick=()=>location.reload()}
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});

import{spriteFrame}from'./sprite-frames-v183.mjs';
import{runBattleFrame,FortressDamage}from'./battle-experience-v181.mjs';
import{particles,countUp}from'./presentation-v166.mjs';
import{battleBackground}from'./battle-backgrounds-v159.mjs';
import{formatTime}from'./companion-info-v144.mjs';
import{readAutoDeploy,writeAutoDeploy,runAutoDeploy}from'./auto-deploy-v119.mjs';
import{readAutoPreference,writeAutoPreference,fireAutoSpecial}from'./auto-special-v118.mjs';
import{statusFor}from'./card-status-v118.mjs';
import{statusArt}from'./status-art-v118.mjs';
import './shell-layout-v115.mjs';
import{battleAssetPlan,imageLoader,loadBattleAssets}from'./battle-assets-v182.mjs';
import{createBattleGuide}from'./battle-guide-v118.mjs';
import{portrait}from'./portrait-v106.mjs';
import{getStage}from'./expansion-v182.mjs';
import{getLoadout,creditWin,stageUnlocked,getStageRecord}from'./game-state-v182.mjs';
import{Battle,allies,enemies,WORLD_WIDTH,HOME_X,ENEMY_X}from'./lane-engine-v182.mjs';

// Use geometric icons rather than font glyphs so circular controls share an exact centre.
for(const [id,path]of[['camera-left','M15 6 9 12l6 6'],['camera-right','m9 6 6 6-6 6'],['pause','M9 7v10M15 7v10']]){const b=document.getElementById(id);if(b)b.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>`}

const $=s=>document.querySelector(s),game=$('#game'),canvas=$('#battle-canvas'),ctx=canvas.getContext('2d'),W=1000,H=941/1672*1000,GROUND=362,ids=[...allies,...enemies].map(u=>u.id),sheets={};let meta={},battle=new Battle(),mode='hub',paused=true,ready=false,last=0,acc=0,clock=0,motionTime=0,cutU=null,resultTimer=0;let camera=0,drag=null,suppressTap=false,manualCameraUntil=0;const effects=[],ghosts=[];let spotlightUntil=0;const reducedMotion=matchMedia('(prefers-reduced-motion:reduce)').matches;const spotlight=document.createElement('div');spotlight.className='battle-spotlight';spotlight.hidden=true;spotlight.setAttribute('aria-hidden','true');game.append(spotlight);function feature(u,label){spotlight.replaceChildren();const face=document.createElement('span');face.className='spotlight-face';face.innerHTML=portrait(u.id);const copy=document.createElement('span');const name=document.createElement('b');name.textContent=u.name;const detail=document.createElement('span');detail.textContent=label;copy.append(name,detail);spotlight.append(face,copy);spotlight.hidden=false;spotlightUntil=clock+2.4;for(const card of cards)card.classList.toggle('skill-featured',Number(card.dataset.index)===u.kind)}const cell=1672/6;let selectedStage=1,clearSummary='',victoryAge=-1,stopVictoryFX=()=>{},stopRewardCount=()=>{};
let battleSpeed=1;const fortress=new FortressDamage();let stopResultFX=()=>{};
function renderSpeed(){for(const id of ['battle-speed','battle-speed-menu']){const b=$('#'+id);b.textContent='はやさ ×'+battleSpeed;b.setAttribute('aria-pressed',String(battleSpeed===2));b.setAttribute('aria-label','戦闘のはやさ '+battleSpeed+'倍')}}
function toggleSpeed(){battleSpeed=battleSpeed===1?2:1;renderSpeed();announce('戦闘のはやさ '+battleSpeed+'倍')}
$('#battle-speed').onclick=toggleSpeed;$('#battle-speed-menu').onclick=toggleSpeed;renderSpeed();
let autoSkill=false;try{autoSkill=readAutoPreference(localStorage)}catch{}
function renderAutoSkill(){const button=$('#auto-skill');button.setAttribute('aria-pressed',String(autoSkill));button.setAttribute('aria-label','ひっさつ オート '+(autoSkill?'オン':'オフ'));button.querySelector('b').textContent='オート '+(autoSkill?'ON':'OFF');const menu=$('#auto-skill-menu');menu.textContent='ひっさつ オート '+(autoSkill?'ON':'OFF');menu.setAttribute('aria-pressed',String(autoSkill))}
function toggleAutoSkill(){autoSkill=!autoSkill;try{writeAutoPreference(localStorage,autoSkill)}catch{}renderAutoSkill();announce('ひっさつ オート '+(autoSkill?'オン':'オフ'))}
$('#auto-skill').onclick=toggleAutoSkill;$('#auto-skill-menu').onclick=toggleAutoSkill;renderAutoSkill();
let autoDeploy=false;try{autoDeploy=readAutoDeploy(localStorage)}catch{}
function renderAutoDeploy(){for(const id of ['auto-deploy','auto-deploy-menu']){const b=$('#'+id);b.setAttribute('aria-pressed',String(autoDeploy));b.setAttribute('aria-label','しゅつげき オート '+(autoDeploy?'オン':'オフ'));if(id==='auto-deploy')b.querySelector('b').textContent='オート '+(autoDeploy?'ON':'OFF');else b.textContent='しゅつげき オート '+(autoDeploy?'ON':'OFF')}}
function toggleAutoDeploy(){autoDeploy=!autoDeploy;try{writeAutoDeploy(localStorage,autoDeploy)}catch{}renderAutoDeploy();announce('しゅつげき オート '+(autoDeploy?'オン':'オフ'))}
$('#auto-deploy').onclick=toggleAutoDeploy;$('#auto-deploy-menu').onclick=toggleAutoDeploy;renderAutoDeploy();
let cards=[];function buildCards(){$('#cards').innerHTML=getLoadout().map(id=>{const i=allies.findIndex(a=>a.id===id),a=allies[i];return `<button class="card ${a.rarity}" data-hero="${a.id}" data-index="${i}" aria-label="${a.name}を出す おこめ${a.cost}"><span class="new-card-art ${a.rarity}"><span class="battle-card-portrait">${portrait(a.id)}</span><span class="battle-rarity">${{legend:'レジェンド',rare:'レア',normal:'ノーマル'}[a.rarity]}</span><b>${a.name}</b><small><span>おこめ</span> ${a.cost}</small></span><span class="veil"></span><span class="deploy-seal" aria-hidden="true">${statusArt('deploy')}</span><span class="skill-seal" aria-hidden="true">${statusArt('skill')}</span><span class="skill-charge" aria-hidden="true"><i></i><b></b></span><span class="active-caption" aria-hidden="true">こうげき中</span><span class="resources" aria-hidden="true"><span class="resource-row hp-row"><span class="resource-name"><span class="resource-heart" aria-hidden="true">♥</span> HP</span><span class="resource-bar hp-bar"><i></i></span></span></span><span class="meter"><i></i></span><span class="badge"></span>${a.rarity==='normal'?'':`<span class="sparkles"><i class="glint">✦</i><i class="glint">✦</i>${a.rarity==='legend'?'<i class="glint">✦</i>':''}</span>`}</button>`}).join('')+Array(6-getLoadout().length).fill('<div class=empty-card>＋<small>へんせい</small></div>').join('');cards=[...document.querySelectorAll('.card')];for(const b of cards)b.onclick=()=>{if(paused||mode!=='battle')return;const i=Number(b.dataset.index),u=battle.active(i);if(u?.skill?battle.fireSpecial(u.uid):battle.deploy(i)){guide.deployed();events();ui();draw()}};}
const guide=createBattleGuide({game,onPause(){paused=true;$('#menu').hidden=true;game.classList.add('paused');ui()},onResume(){paused=false;last=0;acc=0;game.classList.remove('paused');ui()},onFocusCard:()=>cards.find(b=>!b.disabled)});
buildCards();
const preview=[{...allies[0],x:65,uid:101,frame:0},{...allies[0],x:168,uid:102,frame:2},{...allies[1],x:288,uid:103,frame:7},{...allies[2],x:413,uid:104,frame:7},{...allies[3],x:533,uid:105,frame:7},{...enemies[0],x:621,uid:106,frame:0},{...enemies[0],x:710,uid:107,frame:2},{...enemies[1],x:795,uid:108,frame:7},{...enemies[2],x:915,uid:109,frame:7}].map(u=>({...u,side:u.art>=6?-1:1,hp:u.hp,max:u.hp,charge:65,hit:0,pose:0,walk:0}));
const motionAllies=allies.map((d,i)=>({...d,uid:200+i,x:60+i*156,baseX:60+i*156,side:1,hp:d.hp,max:d.hp,charge:50,hit:0,walk:0}));
const motionEnemies=enemies.map((d,i)=>({...d,uid:210+i,x:250+i*240,baseX:250+i*240,side:-1,hp:d.hp,max:d.hp,charge:50,hit:0,walk:0}));let motionUnits=motionAllies;
function announce(t){$('#announcement').textContent=t}
function resize(){const r=game.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);draw()}
if('ResizeObserver'in window)new ResizeObserver(resize).observe(game);else window.addEventListener('resize',resize);
function frameOf(u){if(mode==='welcome')return u.frame;if(mode==='motion'){const phase=(motionTime+u.uid*.13)%4.3;return phase<2.3?Math.floor(phase*9)%4:attackFrame((phase-2.3)%1)}if(u.action)return attackFrame(u.action.elapsed);if(u.pose>0)return 6;if(u.moving)return Math.floor(u.walk*9)%4;return 7}
function attackFrame(t){return t<.13?4:t<.28?5:t<.46?6:7}
function sprite(u,opacity=1){const im=sheets[u.id],m=meta[u.id];if(!im||!m)return;const f=frameOf(u),c=m.width/4,h=m.height/2,scale=u.size/(m.scaleWidth||c),foot=m.feet[f],anchor=m.anchor,sy=Math.floor(f/4)*h,sx=f%4*c;let lunge=0;if(u.action){const t=u.action.elapsed;lunge=t<.16?-2*Math.sin(t/.16*Math.PI):t<.46?8*Math.sin((t-.16)/.3*Math.PI):0}if(mode==='motion'&&f===6)lunge=6;const recoil=!reducedMotion&&u.hit>0?-u.side*3*Math.sin((.22-u.hit)/.22*Math.PI):0;const x=u.x-anchor*scale+lunge*u.side+recoil,y=GROUND-foot*scale;
 ctx.save();ctx.globalAlpha=opacity;ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';if(u.hit>0)ctx.filter='brightness(1.55)';const flipped=m.flipped?.includes(f);if(flipped){ctx.translate(u.x*2,0);ctx.scale(-1,1)}const texture=spriteFrame(im,m,f);ctx.drawImage(texture.canvas,x+(texture.x-sx)*scale,GROUND+(texture.y-foot)*scale,texture.width*scale,texture.height*scale);
 ctx.restore();
 if(opacity<1)return;
 if(u.skill&&mode!=='motion'){const barY=GROUND-m.head*scale-12;ctx.save();ctx.fillStyle='#39291c';round(u.x-23,barY,59,9,4);ctx.fill();ctx.strokeStyle='#ffe38c';ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle='#f4bf38';round(u.x-21,barY+2,55*Math.min(100,u.charge)/100,5,2);ctx.fill();ctx.translate(u.x-26,barY+4.5);ctx.rotate(Math.PI/4);ctx.fillStyle='#ffd750';ctx.fillRect(-5,-5,10,10);ctx.strokeStyle='#503516';ctx.lineWidth=1.4;ctx.strokeRect(-5,-5,10,10);ctx.restore()}
 if(mode==='battle'&&u.hp<u.max){ctx.save();ctx.globalAlpha=.8;ctx.fillStyle='#403122';round(u.x-22,GROUND+3,44,3,2);ctx.fill();ctx.fillStyle=u.side===1?'#94f16b':'#ff7463';round(u.x-22,GROUND+3,44*Math.max(0,u.hp/u.max),3,2);ctx.fill();ctx.restore()}
}
function round(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,Math.max(.1,w),h,r)}
function arc(x,y,r,tint,alpha=1){ctx.save();ctx.globalAlpha=alpha;for(const [color,thick,offset]of[[tint,23,0],['#fffaf0',12,-2]]){ctx.beginPath();for(let j=0;j<=32;j++){const t=j/32,a=-2.15+t*2.15,rr=r+offset+Math.sin(t*Math.PI)*thick/2;const xx=x+Math.cos(a)*rr,yy=y+Math.sin(a)*rr;if(j===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy)}for(let j=32;j>=0;j--){const t=j/32,a=-2.15+t*2.15,rr=r+offset-Math.sin(t*Math.PI)*thick/2;ctx.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}ctx.closePath();ctx.fillStyle=color;ctx.fill()}ctx.restore()}
function vfx(e){const p=e.t/e.life,a=1-p;ctx.save();ctx.globalAlpha=a;
 if(e.type==='dust'){ctx.fillStyle='#fff1d3';ctx.beginPath();ctx.ellipse(e.x,GROUND-2-e.t*8,3+p*10,2+p*6,0,0,Math.PI*2);ctx.fill()}
 if(e.type==='damage'){
 if(e.uid==null&&e.x===ENEMY_X)fortress.hit(battle.temple,battle.templeMax,reducedMotion);ctx.font=`900 ${e.big?27:19}px system-ui`;ctx.textAlign='center';ctx.strokeStyle='#44271b';ctx.lineWidth=3;ctx.fillStyle=e.big?'#ffe181':e.side===1?'#ffe3cf':'#fff9e4';const y=GROUND-(e.big?126:e.side===1?86:110)-p*30;ctx.strokeText(e.text,e.x,y);ctx.fillText(e.text,e.x,y)}
 if(e.type==='contact'){const r=e.big?27:15;ctx.translate(e.x,GROUND-62);ctx.strokeStyle=e.side===1?'#ffd7b1':'#fff7ca';ctx.lineWidth=e.big?3:2;for(let i=0;i<6;i++){const angle=i*Math.PI/3+.25;ctx.beginPath();ctx.moveTo(Math.cos(angle)*(4+p*r),Math.sin(angle)*(4+p*r));ctx.lineTo(Math.cos(angle)*(r+p*r),Math.sin(angle)*(r+p*r));ctx.stroke()}ctx.fillStyle='#fffbea';ctx.beginPath();ctx.arc(0,0,(e.big?7:4)*(1-p),0,Math.PI*2);ctx.fill()}
 if(e.type==='slash'){ctx.globalAlpha=a*.65;arc(e.x+e.side*8,GROUND-70,58+p*12,e.tint,a);if(e.style==='spear'){ctx.strokeStyle='#fff9df';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(e.x,GROUND-67);ctx.lineTo(e.x+e.side*(100+p*35),GROUND-67);ctx.stroke();ctx.strokeStyle=e.tint;ctx.lineWidth=12;ctx.globalAlpha=a*.5;ctx.stroke()}}
 if(e.type==='skill'){const x=e.x+50;arc(x,GROUND-83,105+p*60,e.tint,a);arc(x+70,GROUND-63,73+p*40,e.tint,a*.7);ctx.globalAlpha=a*.65;for(let i=0;i<9;i++){const q=i/8;const xx=x+q*175,yy=GROUND-20-Math.sin(q*Math.PI)*120-p*35;ctx.fillStyle=i%2?'#fff7dd':e.tint;ctx.beginPath();ctx.moveTo(xx,yy-18);ctx.lineTo(xx+10,yy+6);ctx.lineTo(xx-8,yy+14);ctx.closePath();ctx.fill()}}
 ctx.restore()}
function draw(){if(!ctx)return;ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);ctx.clearRect(0,0,W,H);if(!ready)return;const units=mode==='welcome'?preview:mode==='motion'?motionUnits:battle.units;ctx.save();ctx.translate(mode==='battle'?-camera:0,0);if(mode==='battle')fortress.draw(ctx,{x:ENEMY_X,ground:GROUND,hp:battle.temple,max:battle.templeMax,reduced:reducedMotion});ctx.fillStyle='#4c2a171c';for(const u of units){ctx.beginPath();ctx.ellipse(u.x,GROUND+1,u.size*.19,4,0,0,Math.PI*2);ctx.fill()}
 if(mode==='welcome'){arc(382,GROUND-117,100,'#ee342f',.95);arc(550,GROUND-77,58,'#48bcff',.85)}

 for(const u of [...units].sort((a,b)=>a.art===8?-1:b.art===8?1:a.x-b.x))sprite(u);for(const g of ghosts)sprite(g.u,Math.max(0,1-g.t/.4));for(const e of effects)vfx(e);ctx.restore();syncCamera();syncSpecials();
 canvas.dataset.mode=mode;canvas.dataset.frames=units.map(u=>u.id+':'+frameOf(u)).join(',');canvas.dataset.time=battle.time.toFixed(2);canvas.dataset.camera=String(Math.round(camera));
}
function effect(e){effects.push({t:0,life:.4,...e})}
function events(){for(const e of battle.takeEvents()){
 if(e.type==='reinforcements'){announce('てきの ぞうえん！ てきが 強くなるよ');spotlight.replaceChildren();const copy=document.createElement('strong');copy.textContent='てきの ぞうえん！';spotlight.append(copy);spotlight.hidden=false;spotlightUntil=clock+3}
 if(e.type==='spawn')announce(e.u.name+'、しゅつげき！');
 if(e.type==='damage'){
 if(e.uid==null&&e.x===ENEMY_X)fortress.hit(battle.temple,battle.templeMax,reducedMotion);
 const recent=effects.find(v=>v.type==='damage'&&v.uid===e.uid&&e.uid!=null&&v.t<.12);
 if(recent){recent.text+=e.amount;recent.big||=e.special}else effect({type:'damage',uid:e.uid,x:e.x,text:e.amount,side:e.side,big:!!e.special,life:.65});
 if(!reducedMotion&&effects.filter(v=>v.type==='contact').length<12)effect({type:'contact',x:e.x,side:e.side,big:!!e.special,life:e.special ? .32 : .2});
 }
 if(e.type==='attack')effect({type:'slash',x:e.u.x,side:e.u.side,style:e.u.style,tint:e.u.tint||(e.u.side===1?'#ff8a4c':'#994fbe'),life:.28});
 if(e.type==='fall'){if(e.u?.boss&&e.source)feature(e.source,e.u.name+'を たおした！');const u=battle.units.find(u=>u.uid===e.uid);if(u)ghosts.push({u:{...u,action:null,pose:0,moving:false},t:0})}
 if(e.type==='boss')announce(e.u.name+'が あらわれた！');
 if(e.type==='special'){cutU=e.u;showCut(e.u);announce(e.u.name+'の '+e.u.skill+'！')}
 if(e.type==='skill-impact'){hideCut();effect({type:'skill',x:e.u.x,tint:e.u.tint,life:.75})}
 if(e.type==='result'){resultTimer=battle.result==='win'?2.1:.6;victoryAge=battle.result==='win'?0:-1;hideCut();if(battle.result==='win'){game.classList.add('victory-moment');const banner=document.createElement('div');banner.className='victory-banner';banner.innerHTML='<span>合戦 クリア</span><strong>大しょうり！</strong>';banner.setAttribute('aria-hidden','true');game.append(banner);const stop=particles(game,{kind:'victory',count:52,duration:2400});stopVictoryFX=()=>{stop();banner.remove();game.classList.remove('victory-moment')}}if(battle.result==='win'){const old=getStageRecord(battle.stage.id),unlocksNext=battle.stage.id<5&&!stageUnlocked(battle.stage.id+1);creditWin(battle.stage.id,battle.time);const record=getStageRecord(battle.stage.id);clearSummary=`\n今回 ${formatTime(battle.time)}\nベスト ${formatTime(record.best)}${!old||battle.time<old.best?'\nベストこうしん！':''}${unlocksNext?'\nその '+(battle.stage.id+1)+'が あそべるように なったよ！':(battle.stage.id<5?'\nつぎの 合戦を えらんだよ！':'\nぜんステージ せいは！')}`;}}
 }}
// Use standalone artwork so animation-sheet crops cannot leak or clip weapons.
function isolatedCutArt(u){return `./assets/standing-${u.id}-v111.webp`}
function showCut(u){
 $('#cutin').innerHTML=`<div class="cut-lines"></div><div class="cut-spark"></div><div class="cutface"><img src="${isolatedCutArt(u)}" alt="${u.name}" /></div><div class="cutwords"><small>${u.name}</small><strong>${u.skill}</strong><span>ひっさつ！</span></div>`;
 $('#cutin').style.setProperty('--tint',u.tint);$('#cutin').hidden=false;
 $('#cutin').style.animation='none';void $('#cutin').offsetWidth;$('#cutin').style.animation='';
}
function hideCut(){$('#cutin').hidden=true;cutU=null}
function ui(){const welcome=mode!=='battle';$('#rice').textContent=welcome?'850':Math.floor(battle.rice);for(const [sel,value,max]of[['.home',battle.home,battle.homeMax],['.enemy',battle.temple,battle.templeMax]]){const e=$('.base-hp'+sel);e.querySelector('i').style.width=(welcome?100:value/max*100)+'%';e.setAttribute('aria-valuemax',String(max));e.setAttribute('aria-valuenow',String(welcome?max:value))}
 cards.forEach(b=>{const i=Number(b.dataset.index);
 const u=battle.active(i),alive=i>0&&!!u,isSkill=alive&&!!u.skill;
 const skillReady=isSkill&&battle.canSpecial(u.uid),can=mode==='battle'&&!paused&&(isSkill?skillReady:battle.canDeploy(i));
 b.disabled=!can;b.classList.toggle('disabled',mode==='battle'&&!can&&!alive);b.classList.toggle('deployed',alive);b.classList.toggle('ready',can);b.classList.toggle('deploy-ready',can&&!alive);
 b.classList.toggle('skill-charging',mode==='battle'&&isSkill);b.classList.toggle('skill-ready',mode==='battle'&&skillReady);b.classList.toggle('hp-active',mode==='battle'&&alive);b.classList.toggle('skill-waiting',isSkill&&u.charge>=100&&!skillReady&&battle.cutLeft<=0);b.querySelector('.hp-bar i').style.width=(alive?u.hp/u.max*100:0)+'%';
 const status=statusFor({deployed:alive,skill:!!u?.skill,charge:u?.charge,ready:skillReady,wait:battle.cooldowns[i],rice:battle.rice,cost:allies[i].cost,canDeploy:can&&!alive,atLimit:battle.units.filter(v=>v.side===1&&v.hp>0).length>=18});b.dataset.status=status.kind;b.querySelector('.active-caption').textContent=status.kind==='limit'?'これ以上\nでれない':'こうげき中';b.querySelector('.skill-charge i').style.width=status.progress+'%';b.querySelector('.skill-charge b').textContent=status.label;
 const cd=battle.cooldowns[i],badge=b.querySelector('.badge');
 badge.textContent=alive||status.kind==='limit'?'':cd>0?Math.ceil(cd)+'びょう':battle.rice<allies[i].cost?'おこめまち':'';
 b.setAttribute('aria-label',status.kind==='limit'?allies[i].name+' これ以上 でれない':isSkill?allies[i].name+'のひっさつ '+(skillReady?'使える':u.charge>=100?'まんタン てきが近づくまで待つ':Math.floor(u.charge)+'パーセント'):allies[i].name+'を出す おこめ'+allies[i].cost);
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
function start(){spotlight.hidden=true;spotlightUntil=0;stopVictoryFX();stopRewardCount();stopResultFX();fortress.reset();victoryAge=-1;$('#result-reward')?.remove();clearSummary='';buildCards();camera=0;manualCameraUntil=0;drag=null;battle=new Battle(selectedStage);$('#backdrop').dataset.stage=String(battle.stage.id);$('#backdrop').style.backgroundImage=`url("${battleBackground(battle.stage.id)}")`;$('.stage').innerHTML=`<span class=stage-label>その ${battle.stage.id}</span>`;effects.length=0;ghosts.length=0;mode='battle';paused=false;acc=0;last=0;resultTimer=0;$('#welcome').hidden=true;$('#motion-tools').hidden=true;$('#menu').hidden=true;$('#result').hidden=true;game.classList.remove('paused');hideCut();ui();draw();guide.open()}

function motion(){mode='motion';paused=false;motionTime=0;acc=0;last=0;effects.length=0;ghosts.length=0;$('#welcome').hidden=true;$('#menu').hidden=true;$('#result').hidden=true;$('#motion-tools').hidden=false;hideCut();game.classList.remove('paused');$('#motion-pause').textContent='とめる Ⅱ';ui();draw()}
function welcome(){mode='welcome';paused=false;$('#welcome').hidden=false;$('#motion-tools').hidden=true;$('#menu').hidden=true;$('#result').hidden=true;hideCut();effects.length=0;ui();draw()}
 $('#start').onclick=start;$('#restart').onclick=start;$('#retry').onclick=start;$('#motion-preview').onclick=motion;$('#motions')?.addEventListener('click',motion);$('#motion-back').onclick=welcome;$('#motion-group').onclick=()=>{motionUnits=motionUnits===motionAllies?motionEnemies:motionAllies;$('#motion-group').textContent=motionUnits===motionAllies?'ようかいを 見る':'武将を 見る';motionTime=0;draw()};$('#motion-pause').onclick=()=>{paused=!paused;$('#motion-pause').textContent=paused?'うごかす ▶':'とめる Ⅱ';game.classList.toggle('paused',paused)};
$('#pause').onclick=()=>{if(mode==='welcome'){motion();return}if(mode==='motion'){welcome();return}paused=true;$('#menu').hidden=false;game.classList.add('paused');ui()};$('#resume').onclick=()=>{paused=false;$('#menu').hidden=true;game.classList.remove('paused');last=0;ui()};
document.addEventListener('visibilitychange',()=>{last=0;acc=0});
 let lastUI=0,lastDust=0;function tick(now){const dt=last?Math.min(.75,(now-last)/1000):0;last=now;if(ready&&!paused&&!document.hidden&&!matchMedia('(orientation:portrait)').matches){clock+=dt;if(mode==='motion'){motionTime+=dt;for(const u of motionUnits){const p=(motionTime+u.uid*.13)%4.3;u.x=u.baseX+u.side*Math.min(25,p/2.3*25)}}if(mode==='battle'){if(victoryAge>=0){victoryAge+=dt;if(victoryAge<.5)for(const u of battle.units)if(u.action)u.action.elapsed=Math.min(.68,u.action.elapsed+dt*.25)}acc+=dt;while(acc>=1/60){runBattleFrame(battle,battleSpeed,()=>{if(runAutoDeploy(battle,autoDeploy,cards.map(b=>Number(b.dataset.index))))guide.deployed();fireAutoSpecial(battle,autoSkill);events()});acc-=1/60;if(battle.result){acc=0;break}}followLeader(dt);if(clock-lastDust>.13){for(const u of battle.units)if(u.moving)effect({type:'dust',x:u.x-u.side*10,life:.4});lastDust=clock}if(resultTimer>0){resultTimer-=dt;if(resultTimer<=0){$('#result-title').textContent=battle.result==='win'?'大しょうり！':'もう一回 ちょうせん！';$('#result-copy').textContent=battle.result==='win'?`${battle.stage.name}を クリア！${battle.stage.id===5?' ぜんステージ せいは！':''}${clearSummary}`:'あしがるで まもりながら 武将を出してみよう。';$('#result').classList.toggle('victory-result',battle.result==='win');$('#result-next').hidden=battle.result!=='win'||battle.stage.id>=5;$('#result-home').textContent='ほんじんへ';$('#result').hidden=false;if(battle.result==='win'){$('#result-next').textContent='その '+(battle.stage.id+1);stopResultFX=particles($('#result'),{kind:'victory',count:68,duration:4200});const reward=document.createElement('div');reward.id='result-reward';reward.innerHTML='<span>こばん ゲット</span><strong>＋0</strong>';$('#result-copy').before(reward);stopRewardCount=countUp(reward.querySelector('strong'),battle.stage.reward)}}}}
 fortress.update(dt);
 if(spotlightUntil&&clock>spotlightUntil){spotlight.hidden=true;spotlightUntil=0;for(const card of cards)card.classList.remove('skill-featured')}
 for(let i=effects.length-1;i>=0;i--){effects[i].t+=dt;if(effects[i].t>=effects[i].life)effects.splice(i,1)}for(let i=ghosts.length-1;i>=0;i--){ghosts[i].t+=dt;if(ghosts[i].t>=.4)ghosts.splice(i,1)}if(now-lastUI>80){ui();lastUI=now}draw()}requestAnimationFrame(tick)}
const loadImage=imageLoader(url=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('画像を よみこめませんでした'));im.src=url}));
let metaPromise;
export async function prepareBattle(stageId=1,onProgress){
 if(!stageUnlocked(stageId))throw Error('まだ ひらいていない 合戦です');
 if(!metaPromise)metaPromise=fetch('./motion-meta-v183.json').then(r=>{if(!r.ok)throw Error('画像の じゅんびに しっぱいしました');return r.json()}).catch(e=>{metaPromise=null;throw e});
 const [data,loaded]=await Promise.all([metaPromise,loadBattleAssets(battleAssetPlan(getLoadout(),stageId),loadImage,onProgress)]);
 meta=data;for(const item of loaded)if(item.kind==='sheet')sheets[item.id]=item.image;
 const celebration=new Image();celebration.src='./assets/victory-mascot-v182.webp';ready=true;resize();
}
requestAnimationFrame(tick);
$('#battle-guide-open').onclick=()=>guide.open(true);

export function startBattle(stageId=1){if(!stageUnlocked(stageId))throw Error("まだ ひらいていない 合戦です");selectedStage=getStage(stageId).id;if(!ready)throw Error("まだ よみこみ中です");start()}
export function leaveBattle(){spotlight.hidden=true;spotlightUntil=0;for(const card of cards)card.classList.remove('skill-featured');stopVictoryFX();stopRewardCount();stopResultFX();fortress.reset();guide.hide();paused=true;mode="hub";for(const id of ["menu","result","welcome","motion-tools"])$("#"+id).hidden=true;hideCut()}

const roster=[
 {id:'nobunaga',name:'おだ のぶなが',max:1250,attack:62,skill:'まおうのいちげき',power:390,color:'#a55a28'},
 {id:'yukimura',name:'さなだ ゆきむら',max:1100,attack:73,skill:'ほのおのやり',power:430,color:'#a93f30'},
 {id:'kenshin',name:'うえすぎ けんしん',max:1180,attack:65,skill:'こおりのかたな',power:410,color:'#3d6481'}
];
const $=id=>document.getElementById(id);
let party,boss,elapsed=0,last=0,paused=false,finished=false,attackAt,enemyAt,bannerTimer;
$('fighters').innerHTML=roster.map(p=>`<div class="fighter" id="${p.id}"><div class="sprite ${p.id}"></div></div>`).join('');
$('cards').innerHTML=roster.map((p,i)=>`<article class="card" style="border-top:3px solid ${p.color}"><h3>${p.name}</h3><div class="bar"><i id="hp-${i}"></i></div><span class="hp-label" id="label-${i}"></span><button class="skill" id="skill-${i}" disabled><span><b>ひっさつ！</b><em>${p.skill}</em><small id="charge-${i}">パワー 0%</small></span><i id="meter-${i}"></i></button></article>`).join('');
function banner(text){clearTimeout(bannerTimer);$('banner').textContent=text;$('banner').classList.add('show');bannerTimer=setTimeout(()=>$('banner').classList.remove('show'),1200)}
function render(){ $('boss-bar').style.width=`${boss/3600*100}%`;$('boss-hp').textContent=`${boss} / 3600`;party.forEach((p,i)=>{ $('hp-'+i).style.width=`${p.hp/p.max*100}%`;$('label-'+i).textContent=`${p.hp} / ${p.max}`;const ready=p.charge>=100&&p.hp>0&&!finished;$('skill-'+i).disabled=!ready||paused;$('skill-'+i).classList.toggle('ready',ready);$('charge-'+i).textContent=p.hp<=0?'たおれた':ready?'タップ！':`パワー ${Math.floor(p.charge)}%`;$('meter-'+i).style.width=p.charge+'%';$(p.id).classList.toggle('dead',p.hp<=0)})}
function animate(id,cls){const el=$(id);el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);setTimeout(()=>el.classList.remove(cls),350)}
function damage(id,n,special=false){const target=$(id),battle=document.querySelector('.battle'),r=target.getBoundingClientRect(),b=battle.getBoundingClientRect(),el=document.createElement('span');el.className='damage'+(special?' special':'');el.textContent=n;el.style.left=(r.left-b.left+r.width/2-15)+'px';el.style.top=(r.top-b.top+10)+'px';$('effects').append(el);setTimeout(()=>el.remove(),900);animate(id,'hit')}
function finish(win){finished=true;render();$('result-title').textContent=win?'かった！':'まけちゃった';$('result-description').textContent=win?'てんぐを たおした！ お寺を まもったよ。':'みんな たおれてしまった。 ひっさつわざを つかってみよう！';$('result').showModal();$('log').textContent=win?'てんぐを たおした！':'もういちど ちょうせんしよう！'}
function strike(i,special=false){const p=party[i];if(finished||paused||p.hp<=0||(special&&p.charge<100))return;if(special)p.charge=0;const n=special?p.power:p.attack+Math.floor(Math.random()*19);boss=Math.max(0,boss-n);animate(p.id,'attack');damage('enemy',n,special);$('log').textContent=`${p.name}の${special?p.skill:'こうげき'}！ ${n}ダメージ。`;if(special)banner(p.skill);render();if(boss===0)finish(true)}
function enemyStrike(){const alive=party.map((p,i)=>({p,i})).filter(x=>x.p.hp>0);if(!alive.length)return;const {p,i}=alive[Math.floor(Math.random()*alive.length)],n=135+Math.floor(Math.random()*45);p.hp=Math.max(0,p.hp-n);animate('enemy','attack');damage(p.id,n);$('log').textContent=`てんぐのこうげき！ ${p.name}に${n}ダメージ。`;render();if(party.every(p=>p.hp===0))finish(false)}
function reset(){clearTimeout(bannerTimer);if($('result').open)$('result').close();party=roster.map(p=>({...p,hp:p.max,charge:25}));boss=3600;elapsed=0;attackAt=[1.1,1.8,2.5];enemyAt=3;paused=false;finished=false;last=performance.now();$('pause').textContent='Ⅱ';$('pause').setAttribute('aria-label','おやすみ');$('effects').replaceChildren();$('enemy').classList.remove('dead');$('log').textContent='みんなで てんぐを たおそう！';render();banner('いくぞ！')}
function frame(now){const dt=Math.min((now-last)/1000,.1);last=now;if(!paused&&!finished&&!document.hidden){elapsed+=dt;party.forEach((p,i)=>{if(p.hp>0)p.charge=Math.min(100,p.charge+dt*7);if(elapsed>=attackAt[i]){attackAt[i]+=2.8;strike(i)}});if(!finished&&elapsed>=enemyAt){enemyAt+=2.45;enemyStrike()}render()}requestAnimationFrame(frame)}
roster.forEach((p,i)=>$('skill-'+i).onclick=()=>strike(i,true));
$('pause').onclick=()=>{if(finished)return;paused=!paused;$('pause').textContent=paused?'▶':'Ⅱ';$('pause').setAttribute('aria-label',paused?'つづける':'おやすみ');if(paused)banner('おやすみ');render()};
$('restart').onclick=reset;$('again').onclick=reset;
reset();requestAnimationFrame(frame);
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(console.error);

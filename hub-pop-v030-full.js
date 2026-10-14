import {catalog,getTeam,saveTeam,portrait,standing,tengu} from './units-pop-v030-full.js';
const $=id=>document.getElementById(id);
let selected=getTeam(),slot=0;
const unit=id=>catalog.find(p=>p.id===id);
const icon=(kind)=>`<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${kind==='home'?'<path d="M5 15 16 5 27 15M8 13v14h16V13M13 27v-8h6v8"/>':kind==='team'?'<circle cx="16" cy="10" r="4"/><path d="M9 25v-4a7 7 0 0 1 14 0v4M4 24v-3a5 5 0 0 1 3-4M28 24v-3a5 5 0 0 0-3-4"/><path d="M6 8a3 3 0 0 0 0 6M26 8a3 3 0 0 1 0 6"/>':'<path d="m8 25 17-17 4-5-5 3L7 23M4 19l9 9M6 26l-3 3M20 20l7 7M20 25l5-5"/>'}</svg>`;
function mini(p,key,extra=''){return `<span class="unit-art">${portrait(p,key)}</span><span class="unit-name">${p.name.replace(' ','<br>')}</span>${extra}`}
function refresh(){
 $('home-party').innerHTML=selected.map((id,i)=>`<button class="unit-card rarity-${unit(id).rarity}" data-screen="team" aria-label="${unit(id).name}をいれかえる">${mini(unit(id),'home'+i)}</button>`).join('');
 $('home-heroes').innerHTML=selected.map((id,i)=>`<div class="home-hero hero-${i}">${standing(unit(id),'hero'+i)}</div>`).join('');
 $('team-slots').innerHTML=selected.map((id,i)=>`<button class="unit-card team-slot rarity-${unit(id).rarity} ${slot===i?'selected-slot':''}" data-slot="${i}" aria-pressed="${slot===i}" aria-label="${i+1}ばんめ ${unit(id).name}をいれかえる"><span class="slot-number">${i+1}ばん</span>${mini(unit(id),'slot'+i)}</button>`).join('');
 $('unit-list').innerHTML=catalog.map(p=>`<button class="unit-card collection-card rarity-${p.rarity}" data-unit="${p.id}" aria-label="${p.name}を${slot+1}ばんめにいれる">${selected.includes(p.id)?'<span class="in-team">なかま</span>':''}${mini(p,'list',`<span class="unit-stat">HP ${p.max}</span>`)}</button>`).join('');
 $('slot-instruction').textContent=`${slot+1}ばんめに いれる なかまを えらぼう`;
}
export function showScreen(screen){
 document.querySelector('.game').classList.toggle('hub-open',screen!=='battle');
 document.querySelectorAll('.hub-page').forEach(e=>e.hidden=e.id!==`${screen}-screen`);
 document.querySelectorAll('[data-nav]').forEach(e=>{const active=e.dataset.nav===screen;e.classList.toggle('active',active);e.setAttribute('aria-current',active?'page':'false')});
 $('hub-nav').hidden=screen==='battle';
 window.dispatchEvent(new CustomEvent('screen-change',{detail:{screen}}));
 if(screen==='battle')window.dispatchEvent(new CustomEvent('start-battle',{detail:{ids:selected.slice()}}));
 else refresh();
 document.querySelector('.hub-page:not([hidden])')?.scrollTo({top:0});
}
document.addEventListener('click',e=>{
 const nav=e.target.closest('[data-screen]');if(nav){showScreen(nav.dataset.screen);return}
 const slotButton=e.target.closest('[data-slot]');if(slotButton){slot=Number(slotButton.dataset.slot);refresh();return}
 const choice=e.target.closest('[data-unit]');if(choice){const id=choice.dataset.unit,other=selected.indexOf(id);if(other!==-1&&other!==slot)[selected[slot],selected[other]]=[selected[other],selected[slot]];else selected[slot]=id;const saved=saveTeam(selected);refresh();$('team-message').textContent=`${unit(id).name}を ${slot+1}ばんめに いれたよ。${saved?'':' このブラウザでは きろくできないよ。'}`}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('result').open)showScreen('home')});
$('hub-nav').innerHTML=[['home','ホーム'],['team','なかま'],['battle','ぼうけん']].map(([screen,name])=>`<button data-screen="${screen}" data-nav="${screen}">${icon(screen)}<span>${name}</span></button>`).join('');
document.querySelector('.chapter-icon').innerHTML=portrait(tengu,'chapter');
showScreen('home');

const KEY='sengoku-yokai-battle-guide-v115';
export const GUIDE_STEPS=Object.freeze([
 {title:'お寺を こわすと 勝ち！',copy:'右にある ようかいの お寺を めざそう。\n左のお城を こわされると 負けだよ。',icon:'🏯'},
 {title:'おこめは じどうで ふえるよ',copy:'上のおこめを 使って、なかまを 出せるよ。\nたりないときは 少し まってみよう。',icon:'rice'},
 {title:'「でれるよ！」の 顔を タップ',copy:'出した なかまは、じどうで 進んで こうげき！\n「ひっさつ」が 出たら、同じ顔を もう一度 タップ。',icon:'face'}
].map(Object.freeze));
export function createBattleGuide({game,onPause,onResume,onFocusCard,storage}){
 let seen=false,step=0,previousFocus=null;try{storage??=globalThis.localStorage;seen=storage?.getItem(KEY)==='done'}catch{}
 const overlay=document.createElement('section');overlay.id='battle-guide';overlay.className='overlay';overlay.hidden=true;overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','guide-title');
 const coach=document.createElement('p');coach.id='battle-coach';coach.hidden=true;coach.textContent='「でれるよ！」の 顔を タップしてみよう ↓';
 game.append(overlay,coach);
 const mark=()=>{seen=true;try{storage?.setItem(KEY,'done')}catch{}};
 function clearCoach(){coach.hidden=true;game.querySelectorAll('.guide-target').forEach(e=>e.classList.remove('guide-target'))}
 function finish(){mark();overlay.hidden=true;onResume();coach.hidden=false;onFocusCard()?.classList.add('guide-target');onFocusCard()?.focus()}
 function render(){const s=GUIDE_STEPS[step];overlay.innerHTML=`<div class="sheet guide-sheet"><span class="guide-counter">はじめての 合戦　${step+1} / ${GUIDE_STEPS.length}</span><div class="guide-icon" aria-hidden="true">${s.icon==='rice'?'<span class="guide-rice">おこめ<br>1000 → 1100</span>':s.icon==='face'?'<img src="./assets/deploy-ready-v066.webp" alt="">':s.icon}</div><h2 id="guide-title" tabindex="-1">${s.title}</h2><p>${s.copy.replaceAll('\n','<br>')}</p><div class="guide-actions">${step?'<button id="guide-back">もどる</button>':''}<button id="guide-next">${step===GUIDE_STEPS.length-1?'合戦を はじめる ▶':'つぎへ →'}</button></div><button id="guide-skip">すぐ あそぶ</button></div>`;overlay.querySelector('#guide-next').onclick=()=>{if(step<GUIDE_STEPS.length-1){step++;render()}else finish()};const back=overlay.querySelector('#guide-back');if(back)back.onclick=()=>{step--;render()};overlay.querySelector('#guide-skip').onclick=finish;overlay.querySelector('#guide-title').focus()}
 function open(force=false){if(seen&&!force)return false;clearCoach();previousFocus=document.activeElement;step=0;onPause();overlay.hidden=false;render();return true}
 overlay.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();finish()}if(e.key==='Tab'){const buttons=[...overlay.querySelectorAll('button')],first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&(document.activeElement===first||document.activeElement===overlay.querySelector('#guide-title'))){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
 return{open,deployed:clearCoach,hide(){overlay.hidden=true;clearCoach();if(previousFocus?.isConnected&&game.contains(previousFocus))previousFocus.blur()}}
}

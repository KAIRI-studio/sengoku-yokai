// Keep pinch zoom and scrolling available; suppress only a repeated stationary tap.
// Safari can still apply its smart zoom when touch-action alone is insufficient.
export function installTouchGuard(surface){
 let start=null,last=null;
 const control=target=>target?.closest?.('button,a[href],[role="button"]')||target;
 const editable=target=>!!target?.closest?.('input,textarea,select,[contenteditable]:not([contenteditable="false"])');
 const reset=()=>{start=null;last=null};
 surface.addEventListener('touchstart',e=>{
  if(e.touches.length!==1||editable(e.target)){reset();return}
  const t=e.touches[0];start={x:t.clientX,y:t.clientY,time:e.timeStamp,target:control(e.target)};
 },{passive:true});
 surface.addEventListener('touchmove',e=>{
  if(!start)return;
  const t=e.touches[0];if(e.touches.length!==1||!t||Math.hypot(t.clientX-start.x,t.clientY-start.y)>12)reset();
 },{passive:true});
 surface.addEventListener('touchcancel',reset,{passive:true});
 surface.addEventListener('touchend',e=>{
  if(!start||e.touches.length||editable(e.target)){reset();return}
  const t=e.changedTouches[0],s=start;start=null;
  if(!t||e.timeStamp-s.time>350||Math.hypot(t.clientX-s.x,t.clientY-s.y)>12){last=null;return}
  const target=control(e.target),tap={x:t.clientX,y:t.clientY,time:e.timeStamp,target};
  const double=last&&tap.time-last.time<330&&Math.hypot(tap.x-last.x,tap.y-last.y)<24;
  last=tap;
  if(double&&e.cancelable){
   e.preventDefault();
   // Canceling touchend also cancels Safari's synthesized click. Restore exactly
   // one activation so fast deployment and repeated control taps still work.
   const button=target?.closest?.('button,a[href],[role="button"]');
   if(button&&!button.disabled)button.click();
  }
 },{passive:false});
 surface.addEventListener('dblclick',e=>{if(!editable(e.target)&&e.cancelable)e.preventDefault()});
}
if(typeof document!=='undefined')installTouchGuard(document.documentElement);

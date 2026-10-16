import{viewportLayout}from'./viewport-v107.mjs';
const game=document.querySelector('#game');
// Fit the complete 16:9 scene into the actual visible browser area.
// No fullscreen permission, installation or orientation lock is required.
let viewportFrame=0;
function fitViewport(){
 viewportFrame=0;
 const viewport=window.visualViewport;
 if(viewport&&Math.abs(viewport.scale-1)>.01)return;
 const width=viewport?.width||window.innerWidth,height=viewport?.height||window.innerHeight;
 const padding=getComputedStyle(document.body),insets={left:parseFloat(padding.paddingLeft)||0,right:parseFloat(padding.paddingRight)||0,top:parseFloat(padding.paddingTop)||0,bottom:parseFloat(padding.paddingBottom)||0};
 const layout=viewportLayout({width,height,left:viewport?.offsetLeft||0,top:viewport?.offsetTop||0,insets});
 document.documentElement.style.setProperty('--visible-height',height+'px');
 for(const [element,bounds]of [[game,layout.game],[document.querySelector('#side-brand'),layout.left],[document.querySelector('#side-guide'),layout.right]]){
  if(!element)continue;
  for(const key of ['left','top','width','height'])element.style[key]=bounds[key]+'px';
  element.style.right='auto';element.style.bottom='auto';
  if(element!==game)element.hidden=bounds.width<64||height<200;
 }

}
function scheduleViewport(){if(!viewportFrame)viewportFrame=requestAnimationFrame(fitViewport)}
window.addEventListener('resize',scheduleViewport,{passive:true});
window.addEventListener('orientationchange',scheduleViewport,{passive:true});
window.addEventListener('pageshow',scheduleViewport,{passive:true});
window.visualViewport?.addEventListener('resize',scheduleViewport,{passive:true});
window.visualViewport?.addEventListener('scroll',scheduleViewport,{passive:true});
fitViewport();

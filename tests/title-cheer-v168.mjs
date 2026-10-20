// Hand-drawn cel prototype. Each cel has its own source bounds and foot anchor.
// Keep the artwork rigid: no whole-body rotation, squash, or CSS transforms.
const canvas=document.querySelector('#cheer'),ctx=canvas.getContext('2d');
const status=document.querySelector('#status'),play=document.querySelector('#play');
const replay=document.querySelector('#replay'),pose=document.querySelector('#pose');
const sprite=new Image();
sprite.src='../assets/title-nobunaga-cheer-v168.webp';
const anchors=[203,218,202,201,213,217,212,201];
const cels=anchors.map((footX,i)=>({x:(i%4)*362,y:i<4?0:590,w:362,h:i<4?590:496,footX,footY:i<4?555:464}));
// Anticipation, raise, held cheer, then retrace the intermediate arm poses.
const sequence=[[0,1250],[1,150],[2,130],[3,130],[4,180],[5,580],[4,180],[3,130],[6,140],[2,130],[1,150],[7,220],[0,700]];
const duration=sequence.reduce((sum,[,ms])=>sum+ms,0);
let elapsed=0,previous=0,running=true,request=0,ready=false;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function draw(frame){
  const c= cels[frame],scale=.94,ground=485,center=540;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='#322b2140';ctx.beginPath();ctx.ellipse(center,ground+3,121,12,0,0,Math.PI*2);ctx.fill();
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  ctx.drawImage(sprite,c.x,c.y,c.w,c.h,center-c.footX*scale,ground-c.footY*scale,c.w*scale,c.h*scale);
  canvas.dataset.frame=String(frame);
}
function frameAt(time){let sum=0;for(const[frame,ms]of sequence){sum+=ms;if(time<sum)return frame}return 0}
function tick(now){if(!running)return;if(previous)elapsed+=(now-previous);previous=now;draw(frameAt(elapsed%duration));request=requestAnimationFrame(tick)}
function start(reset=false){if(!ready)return;cancelAnimationFrame(request);if(reset)elapsed=1250;previous=0;running=true;status.textContent='かちどき！';play.textContent='動きをとめる';request=requestAnimationFrame(tick)}
function stop(){running=false;cancelAnimationFrame(request);previous=0;play.textContent='動かす';status.textContent='とめています'}
play.addEventListener('click',()=>running?stop():start());
replay.addEventListener('click',()=>start(true));
pose.addEventListener('click',()=>{stop();elapsed=0;draw(0);status.textContent='もとの構え'});
document.addEventListener('visibilitychange',()=>{previous=0});
try{await sprite.decode();ready=true;for(const b of[play,replay,pose])b.disabled=false;draw(0);if(reduced){stop();status.textContent='「動かす」で始まります'}else start()}catch{status.textContent='読みこめませんでした。画面を更新してください。'}

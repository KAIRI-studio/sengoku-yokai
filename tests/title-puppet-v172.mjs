// Original-art proportions, fixed shoulder armor, and a restrained forward salute.
// The weapon and gripping hand are painted together. No wrist/body deformation.
const canvas=document.querySelector('#puppet'),ctx=canvas.getContext('2d');
const status=document.querySelector('#status'),play=document.querySelector('#play');
const buttons=[...document.querySelectorAll('button')],DEG=Math.PI/180;
const period=4500,shoulder=[550,640],upperPivot=[336,366],elbowPivot=[330,438],armScale=.69;
const keys=[[0,0,0],[850,0,0],[1100,2,-4],[1700,-66,-15],[1900,-65,-15],[2500,-65,-15],[3300,0,0],[4500,0,0]];
export function poseAt(ms){
  const t=ms%period;let a=keys[0],b=keys[1];
  for(let i=1;i<keys.length;i++){b=keys[i];if(t<=b[0])break;a=b}
  const p=Math.max(0,Math.min(1,(t-a[0])/(b[0]-a[0]))),e=p*p*(3-2*p);
  return {shoulder:a[1]+(b[1]-a[1])*e,elbow:a[2]+(b[2]-a[2])*e};
}
function polygon(points){const p=new Path2D();points.forEach(([x,y],i)=>i?p.lineTo(x,y):p.moveTo(x,y));p.closePath();return p}
function rotate(x,y,angle){const a=angle*DEG;return[x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a)]}
const original=new Image(),fill=new Image(),arm=new Image();
original.src='../assets/standing-nobunaga-v111.webp';fill.src='../assets/title-nobunaga-underarm-v171.webp';arm.src='../assets/title-nobunaga-arm-v171.webp';
const armHole=polygon([[445,628],[625,635],[623,720],[575,795],[604,899],[516,922],[413,895],[328,834],[328,768],[423,752]]);
const bladeHole=polygon([[500,815],[601,833],[815,962],[1008,1078],[1125,1115],[1248,1088],[1248,1192],[1138,1198],[1000,1175],[775,1052],[578,944],[500,905]]);
const upperMask=polygon([[249,337],[417,376],[438,408],[420,456],[389,474],[250,430],[242,412],[247,380]]);
// Both pieces overlap at the elbow band; the separation is along the cuff.
const foreMask=polygon([[0,250],[1254,814],[1254,1254],[0,1254]]);
const shoulderMask=polygon([[469,550],[575,544],[660,570],[656,598],[637,642],[608,662],[546,645],[477,646],[460,631]]);
let base,upper,fore,ready=false,running=true,elapsed=0,previous=0,request=0,comparison=true;
function cropByPath(image,path){const c=document.createElement('canvas');c.width=image.width;c.height=image.height;const g=c.getContext('2d');g.clip(path);g.drawImage(image,0,0);return c}
function makeBase(){
  const c=document.createElement('canvas');c.width=c.height=1248;const g=c.getContext('2d');g.drawImage(original,0,0);
  const mask=new Path2D();mask.addPath(armHole);mask.addPath(bladeHole);
  g.save();g.globalCompositeOperation='destination-out';g.fill(mask);g.restore();
  g.save();g.clip(mask);g.drawImage(fill,0,0,1248,1248);g.restore();return c;
}
function drawArmPart(image,x,y,px,py,angle){ctx.save();ctx.translate(x,y);ctx.rotate(angle*DEG);ctx.scale(armScale,armScale);ctx.drawImage(image,-px,-py);ctx.restore()}
function drawCharacter(cx,scale,animated,pose){
  ctx.save();ctx.translate(cx-700*scale,548-1230*scale);ctx.scale(scale,scale);
  if(!animated){ctx.drawImage(original,0,0)}else{
    ctx.drawImage(base,0,0);
    // Hidden black sleeve material fills the shoulder socket under its fixed
    // armor. The pivot sits where the sleeve emerges, not inside the chest.
    ctx.fillStyle='#191919';ctx.beginPath();ctx.ellipse(542,655,38,25,0,0,Math.PI*2);ctx.fill();
    const d=rotate((elbowPivot[0]-upperPivot[0])*armScale,(elbowPivot[1]-upperPivot[1])*armScale,pose.shoulder);
    drawArmPart(upper,...shoulder,...upperPivot,pose.shoulder);
    drawArmPart(fore,shoulder[0]+d[0],shoulder[1]+d[1],...elbowPivot,pose.shoulder+pose.elbow-3);
    // The original pauldron remains attached to the torso, in front of the joint.
    ctx.save();ctx.clip(shoulderMask);ctx.drawImage(original,0,0);ctx.restore();
  }
  ctx.restore();
}
function draw(ms){
  const pose=poseAt(ms);ctx.clearRect(0,0,1080,600);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  const centers=comparison?[270,810]:[540],scale=comparison?.32:.39;
  for(const x of centers){ctx.fillStyle='#322b2136';ctx.beginPath();ctx.ellipse(x,550,108*scale/.39,10,0,0,Math.PI*2);ctx.fill()}
  if(comparison){drawCharacter(270,scale,false,pose);drawCharacter(810,scale,true,pose)}else drawCharacter(540,scale,true,pose);
  document.querySelector('#original-label').hidden=!comparison;
  document.querySelector('#animated-label').textContent=comparison?'動きの試作':'動きの試作（大きく表示）';
  canvas.dataset.pose=ms%period>=1700&&ms%period<=2500?'salute':'moving';
}
function tick(now){if(!running)return;if(previous)elapsed+=Math.min(now-previous,80);previous=now;draw(elapsed);request=requestAnimationFrame(tick)}
function start(reset=false){if(!ready)return;cancelAnimationFrame(request);if(reset)elapsed=850;previous=0;running=true;play.textContent='動きをとめる';status.textContent='再生中';request=requestAnimationFrame(tick)}
function stop(){running=false;cancelAnimationFrame(request);previous=0;play.textContent='動かす';status.textContent='とめています'}
play.addEventListener('click',()=>running?stop():start());
document.querySelector('#replay').addEventListener('click',()=>start(true));
for(const b of document.querySelectorAll('[data-time]'))b.addEventListener('click',()=>{stop();elapsed=Number(b.dataset.time);draw(elapsed);status.textContent=b.textContent});
document.querySelector('#compare').addEventListener('click',()=>{comparison=!comparison;document.querySelector('#compare').textContent=comparison?'動きだけ大きく見る':'元絵と並べる';draw(elapsed)});
document.addEventListener('visibilitychange',()=>{previous=0});
try{
  await Promise.all([original.decode(),fill.decode(),arm.decode()]);base=makeBase();upper=cropByPath(arm,upperMask);fore=cropByPath(arm,foreMask);
  ready=true;buttons.forEach(b=>b.disabled=false);draw(0);
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){stop();status.textContent='「動かす」で始まります'}else start();
}catch(error){console.error(error);status.textContent='読みこめませんでした。画面を更新してください。'}

// A rigid-part puppet: shoulder -> elbow -> wrist, with separate cape and hair.
// The planted lower body is never warped, rotated, or translated.
const canvas=document.querySelector('#puppet'),ctx=canvas.getContext('2d');
const status=document.querySelector('#status'),play=document.querySelector('#play');
const buttons=[...document.querySelectorAll('button')];
const DEG=Math.PI/180,period=4800;
const keys=[
  // time, shoulder, elbow, sword (world angle), head, cape, ponytail
  [0,0,0,0,0,0,0],[850,0,0,0,0,0,0],
  [1110,-8,-9,7,2,3,4],[1560,126,36,-124,-3,-7,-12],
  [1750,120,35,-120,-2,3,5],[2010,124,33,-123,-3,-2,-4],
  [2250,120,35,-120,-2,1,2],[2500,120,35,-120,-2,0,0],
  [3250,0,0,0,0,-3,-5],[3500,0,0,0,0,1,2],
  [3800,0,0,0,0,0,0],[4800,0,0,0,0,0,0]
];
function poseAt(ms){
  const t=ms%period;let a=keys[0],b=keys[1];
  for(let i=1;i<keys.length;i++){b=keys[i];if(t<=b[0])break;a=b}
  const p=Math.max(0,Math.min(1,(t-a[0])/(b[0]-a[0]))),e=p*p*(3-2*p);
  return {values:a.slice(1).map((v,i)=>v+(b[i+1]-v)*e),shout:t>=1430&&t<2770};
}
const atlas=new Image();atlas.src='../assets/title-nobunaga-parts-v169.webp';
const definitions=[
  ['body','体と足',255,220],['head','顔',690,225],['shout','勝ちどきの顔',1090,225],
  ['upper','二のうで',225,620],['fore','ひじから手',645,685],['free','もう一方のうで',990,656],
  ['cape','マント',245,968],['pony','髪',650,1010],['sword','刀',995,1076]
];
// The artist left transparent gutters, but the parts are not a regular grid.
// Extract connected alpha islands so neighboring cape/hair pixels cannot leak.
function splitParts(image){
  const source=document.createElement('canvas');source.width=image.width;source.height=image.height;
  const c=source.getContext('2d',{willReadFrequently:true});c.drawImage(image,0,0);
  const pixels=c.getImageData(0,0,source.width,source.height),data=pixels.data,w=source.width,h=source.height;
  const visited=new Uint8Array(w*h),queue=new Int32Array(w*h),parts={};
  for(const[name,label,sx,sy]of definitions){
    const seed=sy*w+sx;if(data[seed*4+3]<4)throw Error('Missing part '+name);
    let read=0,write=1,minX=sx,maxX=sx,minY=sy,maxY=sy;queue[0]=seed;visited[seed]=1;
    while(read<write){
      const p=queue[read++],x=p%w,y=Math.floor(p/w);minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
      for(const n of[x>0?p-1:-1,x<w-1?p+1:-1,y>0?p-w:-1,y<h-1?p+w:-1]){
        if(n>=0&&!visited[n]&&data[n*4+3]>=4){visited[n]=1;queue[write++]=n}
      }
    }
    const out=document.createElement('canvas');out.width=maxX-minX+1;out.height=maxY-minY+1;
    const oc=out.getContext('2d'),outPixels=oc.createImageData(out.width,out.height);
    for(let i=0;i<write;i++){const p=queue[i],x=p%w-minX,y=Math.floor(p/w)-minY,d=(y*out.width+x)*4,s=p*4;outPixels.data.set(data.subarray(s,s+4),d)}
    oc.putImageData(outPixels,0,0);parts[name]=out;
    const fig=document.createElement('figure'),thumb=document.createElement('canvas');thumb.width=out.width;thumb.height=out.height;thumb.getContext('2d').drawImage(out,0,0);
    const caption=document.createElement('figcaption');caption.textContent=label;fig.append(thumb,caption);document.querySelector('#parts').append(fig);
  }
  return parts;
}
let parts,ready=false,running=true,elapsed=0,previous=0,request=0;
function part(name,px,py,ax,ay,scale,angle=0){
  const im=parts[name];ctx.save();ctx.translate(px,py);ctx.rotate(angle*DEG);ctx.scale(scale,scale);ctx.drawImage(im,-ax,-ay);ctx.restore();
}
function rotate(x,y,angle){const a=angle*DEG;return[x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a)]}
function draw(ms){
  const {values:[shoulder,elbow,sword,head,cape,pony],shout}=poseAt(ms);
  ctx.clearRect(0,0,1080,540);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  ctx.save();ctx.translate(540,489);ctx.scale(.83,.83);
  ctx.fillStyle='#322b213e';ctx.beginPath();ctx.ellipse(0,3,132,13,0,0,Math.PI*2);ctx.fill();
  part('cape',-22,-237,420,60,.5,cape);
  part('free',61,-215,75,42,.32,-4);
  part('body',-135,-264.6,0,0,.60);
  const shoulderX=-30,shoulderY=-213;
  const upperEnd=rotate((61-116)*.30,(238-40)*.30,shoulder);
  const elbowX=shoulderX+upperEnd[0],elbowY=shoulderY+upperEnd[1],foreAngle=shoulder+elbow;
  const lowerEnd=rotate((62-95)*.30,(247-27)*.30,foreAngle);
  const handX=elbowX+lowerEnd[0],handY=elbowY+lowerEnd[1];
  part('upper',shoulderX,shoulderY,116,40,.30,shoulder);
  // The katana handle sits inside the gripping fist; draw it behind the hand.
  part('sword',handX,handY,36,28,.47,sword);
  part('fore',elbowX,elbowY,95,27,.30,foreAngle);
  ctx.save();ctx.translate(43,-257);ctx.rotate(head*DEG);
  part('pony',-49,-185,343,151,.50,pony);
  part(shout?'shout':'head',0,0,180,335,.60);
  ctx.restore();ctx.restore();
  canvas.dataset.pose=shout?'cheer':'rest';
}
function tick(now){if(!running)return;if(previous)elapsed+=Math.min(now-previous,80);previous=now;draw(elapsed);request=requestAnimationFrame(tick)}
function start(reset=false){if(!ready)return;cancelAnimationFrame(request);if(reset)elapsed=850;previous=0;running=true;play.textContent='動きをとめる';status.textContent='かちどき！';request=requestAnimationFrame(tick)}
function stop(){running=false;cancelAnimationFrame(request);previous=0;play.textContent='動かす';status.textContent='とめています'}
play.addEventListener('click',()=>running?stop():start());
document.querySelector('#replay').addEventListener('click',()=>start(true));
document.querySelector('#raised').addEventListener('click',()=>{stop();elapsed=1900;draw(elapsed);status.textContent='刀を上げた姿'});
document.querySelector('#rest').addEventListener('click',()=>{stop();elapsed=0;draw(0);status.textContent='もとの構え'});
document.addEventListener('visibilitychange',()=>{previous=0});
try{await atlas.decode();parts=splitParts(atlas);ready=true;buttons.forEach(b=>b.disabled=false);draw(0);if(matchMedia('(prefers-reduced-motion: reduce)').matches){stop();status.textContent='「動かす」で始まります'}else start()}catch(error){console.error(error);status.textContent='読みこめませんでした。画面を更新してください。'}

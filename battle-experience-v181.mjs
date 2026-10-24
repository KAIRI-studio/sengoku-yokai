// Fixed 60 Hz combat: ×2 adds a second simulation step, while cut-ins stay at ×1.
export function runBattleFrame(battle,speed,onStep=()=>{}){
 const count=battle.cutLeft>0||battle.result?1:speed===2?2:1;
 for(let i=0;i<count;i++){battle.step(1/60);onStep();if(battle.cutLeft>0||battle.result)break}
}
const cracks=[
 [[-61,-157],[-46,-132],[-54,-108],[-28,-88],[-35,-58],[-12,-26]],
 [[47,-183],[34,-153],[46,-129],[22,-105],[31,-73],[11,-47]],
 [[-89,-81],[-63,-72],[-48,-48],[-22,-42],[-5,-13]],
 [[75,-118],[52,-98],[61,-79],[39,-56],[49,-28]],
 [[-46,-132],[-18,-140],[1,-126],[22,-105]],
 [[-35,-58],[-64,-42],[-62,-18]],
 [[34,-153],[7,-164],[-5,-187]],
 [[31,-73],[7,-85],[-28,-88]]
];
export function damageLevel(hp,max){return max>0?Math.min(4,Math.floor((1-Math.max(0,hp)/max)*4)):0}
export class FortressDamage{
 constructor(){this.reset()}
 reset(){this.chips=[];this.pulse=0;this.age=0;this.level=0;this.serial=0}
 hit(hp,max,reduced=false){this.level=damageLevel(hp,max);this.pulse=reduced?0:1;this.age=0;if(reduced)return;const n=hp<=0?30:8;for(let i=0;i<n;i++){const k=this.serial++;this.chips.push({x:((k*47)%155)-78,y:-35-((k*29)%125),vx:(((k*31)%110)-55)*1.3,vy:-35-(k%5)*11,t:0,size:2+k%4,shade:k%3})}if(this.chips.length>70)this.chips.splice(0,this.chips.length-70)}
 update(dt){this.age+=dt;this.pulse=Math.max(0,this.pulse-dt*4);for(const p of this.chips){p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=230*dt}this.chips=this.chips.filter(p=>p.t<1.2&&p.y<12)}
 draw(ctx,{x,ground,hp,max,reduced=false}){
 const damage=Math.max(0,1-hp/max),level=damageLevel(hp,max);if(damage<=0&&!this.chips.length)return;
 ctx.save();ctx.translate(x,ground);ctx.lineCap='round';ctx.lineJoin='round';
 // Cracks stay on the enemy building, behind the combatants.
 ctx.save();ctx.beginPath();ctx.rect(-103,-224,207,226);ctx.clip();
 if(!reduced&&this.pulse>0){ctx.fillStyle=`rgba(255,225,156,${this.pulse*.14})`;ctx.fillRect(-103,-224,207,226)}
 for(let i=0;i<Math.min(cracks.length,level*2);i++){const points=cracks[i];for(const [color,width,offset] of [['#f6d6ad',4,1.4],['#352330',2.1,0]]){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.globalAlpha=.55+damage*.35;ctx.beginPath();points.forEach(([px,py],j)=>j?ctx.lineTo(px+offset,py):ctx.moveTo(px+offset,py));ctx.stroke()}}
 // Missing plaster and roof fragments become more visible at each HP quarter.
 ctx.globalAlpha=.9;for(let i=0;i<level*4;i++){const px=-77+(i*41)%151,py=-20-(i*37)%159;ctx.fillStyle=i%2?'#44313b':'#69534a';ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+7+(i%3)*2,py-3);ctx.lineTo(px+12,py+8);ctx.lineTo(px+2,py+11);ctx.closePath();ctx.fill()}
 ctx.restore();
 for(let i=0;i<level*5;i++){const px=-91+(i*29)%181;ctx.fillStyle=['#66564f','#a48a6a','#504347'][i%3];ctx.beginPath();ctx.moveTo(px,3);ctx.lineTo(px+4,-2-(i%3)*2);ctx.lineTo(px+10,4);ctx.closePath();ctx.fill()}
 if(!reduced){for(const p of this.chips){ctx.globalAlpha=Math.max(0,1-p.t/1.2);ctx.fillStyle=['#7e6955','#c6ad87','#4d3d48'][p.shade];ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.t*4);ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*.7);ctx.restore()}
 if(this.pulse>0||hp<=0&&this.age<1.8){const t=hp<=0?this.age:1-this.pulse;ctx.globalAlpha=(hp<=0?.65:.22)*Math.max(0,1-t/1.8);ctx.fillStyle='#e4caa5';for(let i=0;i<7;i++){ctx.beginPath();ctx.ellipse(-85+i*29, -7-t*19,14+t*17,9+t*12,0,0,Math.PI*2);ctx.fill()}}}
 ctx.restore();
 }
}

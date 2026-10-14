export const allies=[
 {id:'ashigaru',name:'あしがる',rarity:'normal',art:0,cost:100,wait:1.4,hp:390,atk:35,speed:43,range:68,interval:1.4,size:120,style:'spear'},
 {id:'nobunaga',name:'のぶなが',rarity:'legend',art:1,cost:800,wait:14,hp:1450,atk:95,speed:30,range:120,interval:1.7,size:160,style:'sword',skill:'まおうのいちげき',power:390,tint:'#ff6439'},
 {id:'yukimura',name:'ゆきむら',rarity:'legend',art:2,cost:650,wait:12,hp:1200,atk:85,speed:35,range:185,interval:1.5,size:164,style:'spear',skill:'ほのおのやり',power:330,tint:'#f5454d'},
 {id:'kenshin',name:'けんしん',rarity:'legend',art:3,cost:650,wait:12,hp:1300,atk:82,speed:31,range:155,interval:1.6,size:144,style:'sword',skill:'こおりのかたな',power:350,tint:'#65d8ff'},
 {id:'mitsuhide',name:'みつひで',rarity:'rare',art:4,cost:350,wait:7,hp:920,atk:64,speed:31,range:115,interval:1.5,size:146,style:'sword',skill:'ききょうのつるぎ',power:250,tint:'#bda3ff'},
 {id:'kazutoyo',name:'かずとよ',rarity:'normal',art:5,cost:200,wait:4,hp:760,atk:45,speed:33,range:145,interval:1.7,size:140,style:'spear'}
];
export const enemies=[
 {id:'kappa',name:'かっぱ',art:6,hp:320,atk:34,speed:29,range:68,interval:1.6,size:104,style:'punch'},
 {id:'oni',name:'おに',art:7,hp:680,atk:63,speed:22,range:105,interval:1.8,size:130,style:'club'},
 {id:'tengu',name:'てんぐ',art:8,hp:2100,atk:110,speed:18,range:170,interval:2.1,size:194,style:'fan'}
];
export class Battle{
 constructor(){this.time=0;this.rice=1000;this.cap=2000;this.home=3000;this.temple=4600;this.units=[];this.cooldowns=allies.map(()=>0);this.nextId=1;this.spawnAt=4;this.wave=0;this.boss=false;this.result=null;this.events=[];this.cut=null;this.cutLeft=0;this.kills=0}
 emit(type,props={}){this.events.push({type,...props})}
 takeEvents(){return this.events.splice(0)}
 active(i){return this.units.find(u=>u.side===1&&u.kind===i&&u.hp>0)}
 canDeploy(i){const d=allies[i];return !!d&&!this.result&&this.rice>=d.cost&&this.cooldowns[i]<=0&&(i===0||!this.active(i))&&this.units.filter(u=>u.side===1&&u.hp>0).length<18}
 deploy(i){if(!this.canDeploy(i))return false;this.rice-=allies[i].cost;this.cooldowns[i]=allies[i].wait;this.add(1,i);return true}
 add(side,kind){const d=(side===1?allies:enemies)[kind],near=this.units.filter(v=>v.side===side&&Math.abs(v.x-(side===1?105:900))<80).length;const u={...d,uid:this.nextId++,side,kind,x:side===1?105-near*40:900+near*30,hp:d.hp,max:d.hp,charge:0,attackLeft:.4,pose:0,hit:0,walk:0,action:null,moving:false,stop:0};this.units.push(u);this.emit('spawn',{u});return u}
 damage(u,amount){if(u.hp<=0)return;u.hp=Math.max(0,u.hp-amount);u.hit=.22;this.emit('damage',{x:u.x,amount,side:u.side});if(!u.hp){this.emit('fall',{uid:u.uid});if(u.side===-1){this.rice=Math.min(this.cap,this.rice+(u.kind===2?220:55));this.kills++}}}
 target(u){return this.units.filter(v=>v.side!==u.side&&v.hp>0).sort((a,b)=>Math.abs(a.x-u.x)-Math.abs(b.x-u.x))[0]}
 special(u){u.charge=0;u.action=null;u.pose=.72;this.cut=u;this.cutLeft=.95;this.emit('special',{u})}
 specialImpact(u){this.emit('skill-impact',{u});this.units.filter(v=>v.side!==u.side&&v.hp>0&&Math.abs(v.x-u.x)<290).forEach(v=>{this.damage(v,u.power);if(v.hp>0)v.x=Math.min(900,Math.max(105,v.x+u.side*22))});if(Math.abs(900-u.x)<u.range+25){this.temple=Math.max(0,this.temple-u.power);this.emit('damage',{x:900,amount:u.power,side:-1})}this.checkResult()}
 impact(u,a){const t=this.units.find(v=>v.uid===a.target&&v.hp>0);if(t&&Math.abs(t.x-u.x)<u.range+40)this.damage(t,u.atk);else if(!a.target){if(u.side===1)this.temple=Math.max(0,this.temple-u.atk);else this.home=Math.max(0,this.home-u.atk);this.emit('damage',{x:u.side===1?900:105,amount:u.atk,side:-u.side})}u.stop=.055;this.emit('attack',{u});this.checkResult()}
 checkResult(){if(!this.result&&(this.home<=0||this.temple<=0)){this.result=this.home<=0?'lose':'win';this.emit('result',{result:this.result})}}
 step(dt){if(this.result)return;dt=Math.min(.1,Math.max(0,dt));if(this.cutLeft>0){this.cutLeft=Math.max(0,this.cutLeft-dt);if(this.cutLeft===0){const u=this.cut;this.cut=null;this.specialImpact(u)}return}this.time+=dt;this.rice=Math.min(this.cap,this.rice+dt*62);this.cooldowns=this.cooldowns.map(v=>Math.max(0,v-dt));
 if(this.time>=this.spawnAt){this.add(-1,this.wave%3===2?1:0);this.wave++;this.spawnAt=this.time+Math.max(4.4,7-this.time/75)}
 if(this.time>=32&&!this.boss){this.boss=true;this.add(-1,2);this.emit('boss')}
 for(const u of this.units){if(u.hp<=0)continue;u.moving=false;u.hit=Math.max(0,u.hit-dt);u.pose=Math.max(0,u.pose-dt);if(u.stop>0){u.stop=Math.max(0,u.stop-dt);continue}u.attackLeft=Math.max(0,u.attackLeft-dt);const target=this.target(u);const tx=target?target.x:u.side===1?900:105;const distance=Math.abs(tx-u.x);const fighting=distance<=u.range;
 if(u.action){u.action.elapsed+=dt;if(!u.action.hit&&u.action.elapsed>=.28){u.action.hit=true;this.impact(u,u.action);if(this.result)break}if(u.action.elapsed>=.68)u.action=null;continue}
 if(u.skill)u.charge=Math.min(100,u.charge+dt*(fighting?8.5:4));
 if(fighting&&u.skill&&u.charge>=100){this.special(u);break}
 if(fighting){if(u.attackLeft<=0){u.attackLeft=u.interval;u.action={elapsed:0,hit:false,target:target?.uid};this.emit('windup',{u})}}
 else{const front=this.units.filter(v=>v.side===u.side&&v.hp>0&&(v.x-u.x)*u.side>0).sort((a,b)=>Math.abs(a.x-u.x)-Math.abs(b.x-u.x))[0];if(!front||Math.abs(front.x-u.x)>52){u.x+=u.side*u.speed*dt;u.walk+=dt;u.moving=true;u.x=Math.min(930,Math.max(35,u.x))}}
 }this.units=this.units.filter(u=>u.hp>0);this.checkResult()}
}

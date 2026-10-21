import{allies,enemies}from'./catalog-v100.mjs';
import{getStage}from'./expansion-v100.mjs';
export{allies,enemies};
export const HOME_X=105, ENEMY_X=1700, WORLD_WIDTH=1800;
export class Battle{
 constructor(stageId=1){this.stage=getStage(stageId);this.homeMax=3000;this.templeMax=this.stage.temple;this.summonAt=55;this.time=0;this.rice=1000;this.cap=2000;this.home=3000;this.temple=this.templeMax;this.units=[];this.cooldowns=allies.map(()=>0);this.nextId=1;this.spawnAt=4;this.wave=0;this.boss=false;this.result=null;this.events=[];this.cut=null;this.cutLeft=0;this.kills=0}
 emit(type,props={}){this.events.push({type,...props})}
 takeEvents(){return this.events.splice(0)}
 active(i){return this.units.find(u=>u.side===1&&u.kind===i&&u.hp>0)}
 canDeploy(i){const d=allies[i];return !!d&&!this.result&&this.rice>=d.cost&&this.cooldowns[i]<=0&&(i===0||!this.active(i))&&this.units.filter(u=>u.side===1&&u.hp>0).length<18}
 deploy(i){if(!this.canDeploy(i))return false;this.rice-=allies[i].cost;this.cooldowns[i]=allies[i].wait;this.add(1,i);return true}
 add(side,kind){const base=(side===1?allies:enemies)[kind],d=side===-1?{...base,hp:Math.round(base.hp*this.stage.scale),atk:Math.round(base.atk*this.stage.scale)}:{...base},near=this.units.filter(v=>v.side===side&&Math.abs(v.x-(side===1?105:1700))<80).length;const u={...d,uid:this.nextId++,side,kind,x:side===1?105-near*40:1700+near*30,hp:d.hp,max:d.hp,charge:0,attackLeft:.4,pose:0,hit:0,walk:0,action:null,moving:false,stop:0};this.units.push(u);this.emit('spawn',{u});return u}
 damage(u,amount,source=null){if(u.hp<=0)return;amount=Math.round(amount*(u.guard>0?.55:1));u.hp=Math.max(0,u.hp-amount);u.hit=.22;this.emit('damage',{x:u.x,amount,side:u.side,uid:u.uid,source,special:this.cutLeft===0&&source?.pose>0});if(!u.hp){this.emit('fall',{uid:u.uid,u,source});if(u.side===-1){this.rice=Math.min(this.cap,this.rice+(u.boss?260:55));this.kills++}}}
 target(u){return this.units.filter(v=>v.side!==u.side&&v.hp>0).sort((a,b)=>Math.abs(a.x-u.x)-Math.abs(b.x-u.x))[0]}
 canSpecial(uid){const u=this.units.find(v=>v.uid===uid);return !!u&&u.side===1&&u.hp>0&&!!u.skill&&u.charge>=100&&!this.result&&this.cutLeft<=0&&(this.units.some(v=>v.side!==u.side&&v.hp>0&&Math.abs(v.x-u.x)<(u.effect==='wide'?380:290))||Math.abs(ENEMY_X-u.x)<u.range+25)}
 fireSpecial(uid){if(!this.canSpecial(uid))return false;this.special(this.units.find(v=>v.uid===uid));return true}
 special(u){u.charge=0;u.action=null;u.pose=.72;this.cut=u;this.cutLeft=1.05;this.emit('special',{u})}
 specialImpact(u){if(u.effect==='guard')this.units.filter(v=>v.side===1).forEach(v=>v.guard=8);this.emit('skill-impact',{u});this.units.filter(v=>v.side!==u.side&&v.hp>0&&Math.abs(v.x-u.x)<(u.effect==='wide'?380:290)).forEach(v=>{this.damage(v,u.power,u);if(u.effect==='weaken')v.weaken=8;if(v.hp>0)v.x=Math.min(1700,Math.max(105,v.x+u.side*22))});if(Math.abs(1700-u.x)<u.range+25){this.temple=Math.max(0,this.temple-u.power);this.emit('damage',{x:1700,amount:u.power,side:-1})}this.checkResult()}
 impact(u,a){const t=this.units.find(v=>v.uid===a.target&&v.hp>0);if(t&&Math.abs(t.x-u.x)<u.range+40){const amount=u.atk*(u.weaken>0?.6:1);this.damage(t,amount,u);if(u.knockback&&t.hp>0)t.x=Math.max(105,t.x-u.knockback);if(u.splash)this.units.filter(v=>v!==t&&v.side!==u.side&&v.hp>0&&Math.abs(v.x-t.x)<u.splash).forEach(v=>this.damage(v,amount*.55,u));}else if(!a.target){if(u.side===1)this.temple=Math.max(0,this.temple-u.atk);else this.home=Math.max(0,this.home-u.atk);this.emit('damage',{x:u.side===1?1700:105,amount:u.atk,side:-u.side})}u.stop=.055;this.emit('attack',{u});this.checkResult()}
 checkResult(){if(!this.result&&(this.home<=0||this.temple<=0)){this.result=this.home<=0?'lose':'win';this.emit('result',{result:this.result})}}
 step(dt){if(this.result)return;dt=Math.min(.1,Math.max(0,dt));if(this.cutLeft>0){this.cutLeft=Math.max(0,this.cutLeft-dt);if(this.cutLeft===0){const u=this.cut;this.cut=null;this.specialImpact(u)}return}this.time+=dt;this.rice=Math.min(this.cap,this.rice+dt*62);this.cooldowns=this.cooldowns.map(v=>Math.max(0,v-dt));
 if(this.time>=this.spawnAt){if(this.units.filter(u=>u.side===-1&&u.hp>0).length<22)this.add(-1,enemies.findIndex(e=>e.id===this.stage.waves[this.wave%this.stage.waves.length]));this.wave++;this.spawnAt=this.time+Math.max(3.7,this.stage.interval-this.time/130)}
 if((this.time>=this.stage.bossAt||this.temple<this.templeMax*.75)&&!this.boss){this.boss=true;const boss=this.add(-1,enemies.findIndex(e=>e.id===this.stage.boss));this.emit('boss',{u:boss})}
 if(this.time>=this.summonAt){for(const u of [...this.units])if(u.side===-1&&u.summon&&u.hp>0&&this.units.filter(v=>v.side===-1).length<22){const child=this.add(-1,enemies.findIndex(e=>e.id===u.summon));child.x=Math.min(1700,u.x+45)}this.summonAt=this.time+18}
 for(const u of this.units){if(u.hp<=0)continue;u.guard=Math.max(0,(u.guard||0)-dt);u.weaken=Math.max(0,(u.weaken||0)-dt);u.moving=false;u.hit=Math.max(0,u.hit-dt);u.pose=Math.max(0,u.pose-dt);if(u.stop>0){u.stop=Math.max(0,u.stop-dt);continue}u.attackLeft=Math.max(0,u.attackLeft-dt);const target=this.target(u);const tx=target?target.x:u.side===1?1700:105;const distance=Math.abs(tx-u.x);const fighting=distance<=u.range;
 if(u.action){u.action.elapsed+=dt;if(!u.action.hit&&u.action.elapsed>=.28){u.action.hit=true;this.impact(u,u.action);if(this.result)break}if(u.action.elapsed>=.68)u.action=null;continue}
 if(u.skill)u.charge=Math.min(100,u.charge+dt*(fighting?8.5:4));
 if(fighting){if(u.attackLeft<=0){u.attackLeft=u.interval;u.action={elapsed:0,hit:false,target:target?.uid};this.emit('windup',{u})}}
 else{u.x+=u.side*u.speed*dt;u.walk+=dt;u.moving=true;u.x=Math.min(1730,Math.max(35,u.x))}
 }this.units=this.units.filter(u=>u.hp>0);this.checkResult()}
}

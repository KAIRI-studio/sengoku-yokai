// Canvas flames: deterministic animation, no textures, allocations or per-frame randomness.
export function drawLegendAura(ctx,u,ground,time){
 if(u.side!==1||u.rarity!=='legend'||u.hp<=0)return;
 const w=u.size*.34,h=u.size*.88,t=time+u.uid*.37;
 ctx.save();ctx.translate(u.x,ground);ctx.globalAlpha=.7;
 const glow=ctx.createRadialGradient(0,-h*.35,w*.1,0,-h*.35,h*.8);glow.addColorStop(0,'#ffb21d38');glow.addColorStop(.6,'#ff491b20');glow.addColorStop(1,'#ff481b00');ctx.fillStyle=glow;ctx.fillRect(-h,-h*1.3,h*2,h*1.5);
 ctx.fillStyle='#ffbd3c70';ctx.beginPath();ctx.ellipse(0,-2,w*1.25,8,0,0,Math.PI*2);ctx.fill();
 // Tall tongues stay rooted at the feet and curl up both sides of the silhouette.
 for(let i=0;i<6;i++){
  const side=i%2?-1:1,k=Math.floor(i/2),x=side*w*(.62+k*.17),height=h*(.45+k*.19+Math.sin(t*4.2+i)*.09),sway=Math.sin(t*3.4+i)*10,base=13+k*2;
  ctx.globalAlpha=.56+k*.07;ctx.fillStyle=k%2?'#ff8c24':'#f34c24';ctx.beginPath();ctx.moveTo(x-base,1);ctx.bezierCurveTo(x-base*1.9,-height*.25,x+side*15,-height*.57,x+sway,-height);ctx.bezierCurveTo(x+side*13,-height*.7,x+base*1.3,-height*.25,x+base,1);ctx.quadraticCurveTo(x,8,x-base,1);ctx.fill();
  ctx.globalAlpha=.8;ctx.fillStyle='#ffd452';ctx.beginPath();ctx.moveTo(x-base*.55,0);ctx.quadraticCurveTo(x-base*.7,-height*.3,x+sway*.65,-height*.71);ctx.quadraticCurveTo(x+base*.8,-height*.2,x+base*.55,0);ctx.fill();
 }
 for(let i=0;i<9;i++){
  const p=((t*(.65+i%3*.09)+i*.317)%1),side=i%2?-1:1,x=side*(w*(.55+(i%3)*.19)+Math.sin(t*3+i)*4),y=-p*h*.95,fh=(19+Math.sin(t*5+i)*6)*(1-p*.35),fw=7+(i%3)*2;
  ctx.globalAlpha=(1-p)*.85;ctx.fillStyle=i%3===0?'#ffcf3f':'#f65b20';ctx.beginPath();ctx.moveTo(x-fw,y);ctx.bezierCurveTo(x-fw*1.7,y-fh*.4,x+side*fw,y-fh*.65,x+Math.sin(t*4+i)*fw,y-fh);ctx.bezierCurveTo(x+fw*.2,y-fh*.4,x+fw*1.8,y-fh*.25,x+fw,y);ctx.quadraticCurveTo(x,y+6,x-fw,y);ctx.fill();
  ctx.fillStyle='#fff1a2';ctx.beginPath();ctx.moveTo(x-fw*.4,y);ctx.quadraticCurveTo(x-fw*.4,y-fh*.3,x,y-fh*.6);ctx.quadraticCurveTo(x+fw*.7,y-fh*.15,x+fw*.4,y);ctx.fill();
 }
 ctx.restore();
}

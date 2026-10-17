export const RUNNERS=[{id:'nobunaga',size:111,flip:false},{id:'yukimura',size:126,flip:false},{id:'kenshin',size:119,flip:false},{id:'kappa',size:111,flip:true},{id:'oni',size:119,flip:true}];
export function runnerPose(index,time){return{x:((80+index*235+time*92+140)%1280)-140,frame:Math.floor(time*9+index*.8)%4};}

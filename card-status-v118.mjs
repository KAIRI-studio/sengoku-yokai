export function statusFor({deployed,skill,charge=0,ready=false,wait=0,rice=0,cost=0,canDeploy=false,atLimit=false}){
 if(deployed&&skill){if(ready)return{kind:'special',label:'ひっさつ',progress:100};const progress=Math.max(0,Math.min(100,Math.floor(charge)));return{kind:'charge',label:progress===100?'てきまち':`ひっさつ ${progress}%`,progress}}
 if(deployed)return{kind:'active',label:'こうげき中',progress:0};
 if(atLimit)return{kind:'limit',label:'これ以上 でれない',progress:0};
 if(canDeploy)return{kind:'deploy',label:'でれるよ！',progress:0};
 return{kind:'wait',label:wait>0?`${Math.ceil(wait)}びょう`:rice<cost?'おこめまち':'じゅんび中',progress:0}
}

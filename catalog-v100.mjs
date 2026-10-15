import{additions,yokai}from'./expansion-v100.mjs';
export const allies=[
 {id:'ashigaru',name:'あしがる',rarity:'normal',art:0,cost:100,wait:1.4,hp:390,atk:35,speed:43,range:68,interval:1.4,size:120,style:'spear'},
 {id:'nobunaga',name:'のぶなが',rarity:'legend',art:1,cost:800,wait:14,hp:1450,atk:95,speed:30,range:120,interval:1.7,size:160,style:'sword',skill:'まおうのいちげき',power:390,tint:'#ff6439'},
 {id:'yukimura',name:'ゆきむら',rarity:'rare',art:2,cost:650,wait:12,hp:1200,atk:85,speed:35,range:185,interval:1.5,size:164,style:'spear',skill:'ほのおのやり',power:330,tint:'#f5454d'},
 {id:'kenshin',name:'けんしん',rarity:'legend',art:3,cost:650,wait:12,hp:1300,atk:82,speed:31,range:155,interval:1.6,size:144,style:'sword',skill:'こおりのかたな',power:350,tint:'#65d8ff'},
 {id:'mitsuhide',name:'みつひで',rarity:'rare',art:4,cost:350,wait:7,hp:920,atk:64,speed:31,range:115,interval:1.5,size:146,style:'sword',skill:'ききょうのつるぎ',power:250,tint:'#bda3ff'},
 {id:'kazutoyo',name:'かずとよ',rarity:'normal',art:5,cost:200,wait:4,hp:760,atk:45,speed:33,range:145,interval:1.7,size:140,style:'spear'}
];
export const enemies=[
 {id:'kappa',name:'かっぱ',art:6,hp:320,atk:34,speed:29,range:68,interval:1.6,size:104,style:'punch'},
 {id:'oni',name:'おに',art:7,hp:680,atk:63,speed:22,range:105,interval:1.8,size:130,style:'club'},
 {id:'tengu',name:'てんぐ',art:8,hp:2100,atk:110,speed:18,range:170,interval:2.1,size:194,style:'fan'}
];

allies.push(...additions.map((a,i)=>({...a,art:9+i,asset:`./assets/motion-${a.id}-v100.webp`})));
enemies[2]={...enemies[2],name:'だいてんぐ',hp:4000,atk:140,boss:true,knockback:40};
enemies.push(...yokai.map((a,i)=>({...a,art:19+i,asset:`./assets/motion-${a.id}-v100.webp`})));

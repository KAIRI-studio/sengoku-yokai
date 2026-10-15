// Shared campaign definitions: stages, roster additions, and transparent assets.
export const additions=[
 {id:'shingen',name:'しんげん',rarity:'legend',cost:850,wait:16,hp:1900,atk:110,speed:24,range:135,interval:2,size:166,style:'fan',skill:'ふうりんかざん',power:430,tint:'#e85835'},
 {id:'hideyoshi',name:'ひでよし',rarity:'legend',cost:750,wait:15,hp:1250,atk:84,speed:33,range:160,interval:1.6,size:155,style:'spear',skill:'たいこうのひかり',power:360,tint:'#ffd44b',effect:'wide'},
 {id:'ieyasu',name:'いえやす',rarity:'legend',cost:700,wait:15,hp:2300,atk:68,speed:22,range:135,interval:1.9,size:156,style:'spear',skill:'てんかのまもり',power:240,tint:'#70cf95',effect:'guard'},
 {id:'masamune',name:'まさむね',rarity:'rare',cost:550,wait:10,hp:1050,atk:88,speed:39,range:130,interval:1.4,size:151,style:'sword',skill:'どくがんりゅう',power:310,tint:'#70bfff'},
 {id:'motonari',name:'もとなり',rarity:'rare',cost:480,wait:10,hp:740,atk:70,speed:27,range:260,interval:1.9,size:146,style:'bow',skill:'さんぼんのや',power:260,tint:'#88d575',effect:'wide'},
 {id:'yoshihiro',name:'よしひろ',rarity:'rare',cost:600,wait:11,hp:1500,atk:130,speed:23,range:105,interval:2.5,size:164,style:'sword',skill:'おにしまづ',power:380,tint:'#bb91e7'},
 {id:'hanzo',name:'はんぞう',rarity:'rare',cost:420,wait:8,hp:650,atk:51,speed:62,range:85,interval:.85,size:137,style:'sword',skill:'かげのじゅつ',power:240,tint:'#9998ff'},
 {id:'kanbei',name:'かんべえ',rarity:'rare',cost:450,wait:9,hp:850,atk:51,speed:28,range:230,interval:1.8,size:144,style:'fan',skill:'ぐんしのさく',power:190,tint:'#dcb275',effect:'weaken'},
 {id:'toshiie',name:'としいえ',rarity:'normal',cost:260,wait:5,hp:800,atk:57,speed:34,range:215,interval:1.9,size:146,style:'spear'},
 {id:'naomasa',name:'なおまさ',rarity:'normal',cost:230,wait:4.5,hp:720,atk:50,speed:51,range:100,interval:1.4,size:141,style:'spear'}
];
export const yokai=[
 {id:'aoni',name:'あおおに',hp:420,atk:42,speed:48,range:75,interval:1.3,size:118,style:'club'},
 {id:'karasu',name:'からすてんぐ',hp:540,atk:65,speed:37,range:245,interval:2.2,size:122,style:'fan'},
 {id:'kogumo',name:'こぐも',hp:250,atk:30,speed:55,range:55,interval:1.1,size:92,style:'punch'},
 {id:'ogappa',name:'おおがっぱ',hp:2300,atk:95,speed:18,range:125,interval:2.3,size:187,style:'punch',boss:true,knockback:28},
 {id:'onigashira',name:'おにがしら',hp:3300,atk:125,speed:17,range:135,interval:2.5,size:198,style:'club',boss:true,splash:95},
 {id:'tsuchigumo',name:'つちぐも',hp:4700,atk:140,speed:16,range:190,interval:2.7,size:221,style:'punch',boss:true,summon:'kogumo'},
 {id:'shuten',name:'しゅてんどうじ',hp:5200,atk:145,speed:17,range:180,interval:2.8,size:220,style:'sword',boss:true,splash:80,summon:'oni'}
];
export const stages=[
 {id:1,name:'ようかいの おてら',reward:120,temple:4300,scale:1,interval:7,bossAt:30,boss:'ogappa',waves:['kappa','kappa','oni'],background:'./assets/field-faithful-v050.webp',image:'./assets/stage-temple-v090.webp',hint:'かっぱたちから おてらを とりもどそう'},
 {id:2,name:'おにの やまみち',reward:160,temple:5400,scale:1.13,interval:6.8,bossAt:33,boss:'onigashira',waves:['kappa','aoni','oni','aoni'],background:'./assets/field-mountain-v100.webp',image:'./assets/field-mountain-v100.webp',hint:'すばやい あおおにに 気をつけよう'},
 {id:3,name:'てんぐの もり',reward:200,temple:6700,scale:1.3,interval:6.5,bossAt:35,boss:'tengu',waves:['aoni','karasu','oni','karasu'],background:'./assets/field-forest-v100.webp',image:'./assets/field-forest-v100.webp',hint:'とおくから ねらう てんぐたちが 登場'},
 {id:4,name:'あやかしの どうくつ',reward:250,temple:8000,scale:1.48,interval:5.8,bossAt:37,boss:'tsuchigumo',waves:['kogumo','oni','karasu','kogumo','aoni'],background:'./assets/field-cave-v100.webp',image:'./assets/field-cave-v100.webp',hint:'つちぐもが 小さな なかまを よびだすぞ'},
 {id:5,name:'しゅてんの しろ',reward:320,temple:10000,scale:1.55,interval:6,bossAt:40,boss:'shuten',waves:['oni','aoni','karasu','kogumo','oni'],background:'./assets/field-castle-v100.webp',image:'./assets/field-castle-v100.webp',hint:'ようかいの たいぐんと さいごの 大合戦！'}
];
export const getStage=id=>stages.find(s=>s.id===Number(id))||stages[0];

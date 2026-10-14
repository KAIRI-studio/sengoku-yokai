export const catalog=[
 {id:'nobunaga',bodyIndex:0,artIndex:0,rarity:'legend',name:'おだ のぶなが',max:1250,attack:62,skill:'まおうのいちげき',power:390,color:'#a55a28',note:'くろい よろいの まおう'},
 {id:'yukimura',bodyIndex:1,artIndex:1,rarity:'legend',name:'さなだ ゆきむら',max:1100,attack:73,skill:'ほのおのやり',power:430,color:'#a93f30',note:'あかい よろいの やりつかい'},
 {id:'kenshin',bodyIndex:2,artIndex:2,rarity:'legend',name:'うえすぎ けんしん',max:1180,attack:65,skill:'こおりのかたな',power:410,color:'#3d6481',note:'しろい ずきんの つわもの'},
 {id:'mitsuhide',bodyIndex:3,rarity:'rare',name:'あけち みつひで',max:1080,attack:55,skill:'ききょうのつるぎ',power:330,color:'#92b2d0',note:'ぎんの よろいで きりこむ'},
 {id:'kazutoyo',bodyIndex:4,rarity:'normal',name:'やまうち かずとよ',max:1000,attack:48,skill:'かぜのやり',power:280,color:'#4aab66',note:'みどりの よろいで まもる'}
];
const KEY='sengoku-yokai-team-v1';
export function getTeam(){try{const ids=JSON.parse(localStorage.getItem(KEY));if(Array.isArray(ids)&&ids.length===3&&new Set(ids).size===3&&ids.every(id=>catalog.some(p=>p.id===id)))return ids}catch{}return catalog.slice(0,3).map(p=>p.id)}
export function saveTeam(ids){try{localStorage.setItem(KEY,JSON.stringify(ids));return true}catch{return false}}
export const tengu={id:'tengu',name:'てんぐ',bodyIndex:5};
function atlas(index,key,kind,label){const c=512,wide=index===5&&kind!=='skill',x=wide?900:index%3*c,y=Math.floor(index/3)*c,w=wide?636:c,h=kind==='portrait'?370:c,id=`pop-${key}-${index}-${kind}`,url=kind==='skill'?'pop-skills-v030':'pop-characters-v030';const cuts=kind==='skill'?[]:({1:[[512,385,55,65]],2:[[1024,380,75,70]],3:[[480,700,32,160]],4:[[900,512,124,370]],5:[[900,880,150,75]]}[index]||[]);return `<svg viewBox="${x} ${y} ${w} ${h}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${label}"><defs><clipPath id="${id}"><rect x="${x}" y="${y+(index>=3?12:0)}" width="${w}" height="${h-(index>=3?12:0)}"/></clipPath><mask id="${id}-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1536" height="1024"><rect width="1536" height="1024" fill="white"/>${cuts.map(([cx,cy,cw,ch])=>`<rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" fill="black"/>`).join('')}</mask></defs><image href="./assets/${url}.webp" width="1536" height="1024" clip-path="url(#${id})" mask="url(#${id}-mask)"/></svg>`}

export function bodyArt(p,key){return atlas(p.bodyIndex,key,'body',p.name)}
export function portrait(p,key){return atlas(p.bodyIndex,key,'portrait',p.name)}
export function skillArt(p,key){return atlas(p.bodyIndex,key,'skill',p.skill||'かぜのうちわ')}
export function standing(p,key){return bodyArt(p,key)}

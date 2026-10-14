export const catalog=[
 {id:'nobunaga',artIndex:0,rarity:'legend',name:'おだ のぶなが',max:1250,attack:62,skill:'まおうのいちげき',power:390,color:'#a55a28',note:'くろい よろいの まおう'},
 {id:'yukimura',artIndex:1,rarity:'legend',name:'さなだ ゆきむら',max:1100,attack:73,skill:'ほのおのやり',power:430,color:'#a93f30',note:'あかい よろいの やりつかい'},
 {id:'kenshin',artIndex:2,rarity:'legend',name:'うえすぎ けんしん',max:1180,attack:65,skill:'こおりのかたな',power:410,color:'#3d6481',note:'しろい ずきんの つわもの'},
 {id:'mitsuhide',rarity:'rare',name:'あけち みつひで',max:1080,attack:55,skill:'ききょうのつるぎ',power:330,color:'#92b2d0',note:'ぎんの よろいで きりこむ'},
 {id:'kazutoyo',rarity:'normal',name:'やまうち かずとよ',max:1000,attack:48,skill:'かぜのやり',power:280,color:'#4aab66',note:'みどりの よろいで まもる'}
];
const KEY='sengoku-yokai-team-v1';
export function getTeam(){try{const ids=JSON.parse(localStorage.getItem(KEY));if(Array.isArray(ids)&&ids.length===3&&new Set(ids).size===3&&ids.every(id=>catalog.some(p=>p.id===id)))return ids}catch{}return catalog.slice(0,3).map(p=>p.id)}
export function saveTeam(ids){try{localStorage.setItem(KEY,JSON.stringify(ids));return true}catch{return false}}
export function unitTile(p,index,key){const w=1254,c=627,x=index%2*c,y=Math.floor(index/2)*c,id=`unit-${key}-${p.id}-${index}`;return `<svg viewBox="${x} ${y} ${c} ${c}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${p.name}"><defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${c}" height="${c}"/></clipPath></defs><image href="./assets/${p.id}-atlas-v020.webp" width="${w}" height="${w}" clip-path="url(#${id})"/></svg>`}
export function portrait(p,key){if(p.artIndex===undefined)return unitTile(p,1,key);const w=768,h=512,x=p.artIndex%2*w,y=Math.floor(p.artIndex/2)*h,id=`portrait-${key}-${p.id}`;return `<svg viewBox="${x} ${y} ${w} ${h}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${p.name}"><defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><image href="./assets/legend-portraits-v027.webp" width="1536" height="1024" clip-path="url(#${id})"/></svg>`}
export function standing(p,key){return p.artIndex===undefined?unitTile(p,0,key):`<img src="./assets/${p.id}-idle.png" alt="${p.name}">`}

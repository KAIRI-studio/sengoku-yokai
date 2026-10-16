const KEY='sengoku-yokai-auto-special-v118';
export function readAutoPreference(storage){try{return storage?.getItem(KEY)==='on'}catch{return false}}
export function writeAutoPreference(storage,value){try{storage?.setItem(KEY,value?'on':'off')}catch{}}
// The battle engine remains the authority for range, charge, life and cut-in guards.
export function fireAutoSpecial(battle,enabled){if(!enabled||battle.result||battle.cutLeft>0)return false;for(const u of battle.units)if(u.side===1&&u.hp>0&&u.skill&&battle.canSpecial(u.uid))return battle.fireSpecial(u.uid);return false}

import test from 'node:test';
import assert from 'node:assert/strict';
import {rewardTheme,summonTiming,rewardContent} from '../presentation-v166.mjs';
test('legend ceremony keeps each approved hero colour and a distinct reveal',()=>{
 const tones=['nobunaga','kenshin','hideyoshi','ieyasu','shingen'].map(id=>rewardTheme(id,'legend'));
 assert.equal(new Set(tones.map(t=>t.color)).size,5);
 assert.ok(tones.every(t=>t.legend&&t.particles<=48));
 assert.ok(summonTiming('legend')>summonTiming('normal'));
 assert.ok(summonTiming('legend',true)<summonTiming('normal'));
 assert.equal(rewardTheme('kazutoyo','normal').legend,false);
});

test('all reward ranks render without dependencies on the hub module',()=>{for(const rarity of ['legend','rare','normal']){const html=rewardContent({id:'nobunaga',name:'のぶなが',rarity},{isNew:true},id=>`<img alt="${id}">`);assert.match(html,/のぶなが/);assert.match(html,/reward-close/);assert.match(html,/reward-team/);assert.match(html,/あたらしい なかま/)} });

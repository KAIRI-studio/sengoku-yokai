import test from 'node:test';
import assert from 'node:assert/strict';
import {rewardTheme,summonTiming} from '../presentation-v165.mjs';
test('legend ceremony keeps each approved hero colour and a distinct reveal',()=>{
 const tones=['nobunaga','kenshin','hideyoshi','ieyasu','shingen'].map(id=>rewardTheme(id,'legend'));
 assert.equal(new Set(tones.map(t=>t.color)).size,5);
 assert.ok(tones.every(t=>t.legend&&t.particles<=48));
 assert.ok(summonTiming('legend')>summonTiming('normal'));
 assert.ok(summonTiming('legend',true)<summonTiming('normal'));
 assert.equal(rewardTheme('kazutoyo','normal').legend,false);
});

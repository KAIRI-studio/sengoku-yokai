import test from 'node:test';
import assert from 'node:assert/strict';

const key = 'sengoku-yokai-progress-v070';
const legacy = {
  legendRulesVersion: 1,
  coins: 850,
  wins: 2,
  owned: ['ashigaru', 'kazutoyo', 'motonari'],
  team: ['ashigaru', 'motonari'],
  cleared: [1, 4],
  selectedStage: 2,
  records: {4: {best: 278, clears: 1}},
};

async function startWithSave(progress, label) {
  const storage = new Map([[key, JSON.stringify(progress)]]);
  globalThis.localStorage = {
    getItem: name => storage.get(name) ?? null,
    setItem: (name, value) => storage.set(name, value),
  };
  return {game: await import('../game-state-v187.mjs?' + label), storage};
}

test('exports and restores an older save with nonconsecutive clears', async () => {
  const {game, storage} = await startWithSave(legacy, 'legacy');
  const backup = game.exportProgress();
  const original = game.snapshot();
  assert.equal(game.stageUnlocked(2), true);
  assert.equal(game.stageUnlocked(3), false);
  assert.equal(game.stageUnlocked(4), false);
  assert.equal(game.stageUnlocked(5), false);
  assert.deepEqual(game.restoreProgress(backup), original);
  const persisted = JSON.parse(storage.get(key));
  for (const property of ['cleared', 'selectedStage', 'records', 'coins', 'wins', 'owned', 'team']) {
    assert.deepEqual(persisted[property], legacy[property]);
  }
  assert.equal(game.stageUnlocked(4), false);
});

test('restores sequential campaign progress and rejects invalid or locked stages', async () => {
  const {game, storage} = await startWithSave(legacy, 'validation');
  const backup = JSON.parse(game.exportProgress());
  const original = storage.get(key);
  for (const changes of [
    {cleared: [1, 1]},
    {cleared: [1, 6]},
    {cleared: [1, '4']},
    {cleared: [1, 4], selectedStage: 5},
  ]) {
    const invalid = JSON.stringify({...backup, progress: {...backup.progress, ...changes}});
    assert.throws(() => game.restoreProgress(invalid));
    assert.equal(storage.get(key), original);
  }
  const sequential = {...backup.progress, cleared: [1, 2, 3, 4], selectedStage: 5};
  assert.equal(game.restoreProgress(JSON.stringify({...backup, progress: sequential})).selectedStage, 5);
  assert.equal(game.stageUnlocked(5), true);
});

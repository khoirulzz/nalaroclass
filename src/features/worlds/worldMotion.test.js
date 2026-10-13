import assert from 'node:assert/strict';
import test from 'node:test';
import { getFleeVector, getWorldEntityBudget, findNearestCreature } from './worldMotion.js';
import { getLivingWorld, READY_LIVING_WORLD_IDS } from './worldCatalog.js';

test('all five worlds are ready with unique scenes and nonempty visual contracts', () => {
  assert.deepEqual(READY_LIVING_WORLD_IDS, ['deep-current','prism-city','paperbound','pixel-frontier','inventors-workshop']);
  const scenes = new Set();
  for (const id of READY_LIVING_WORLD_IDS) {
    const world = getLivingWorld(id);
    assert.equal(world.status,'ready');
    assert.ok(world.canvas && world.surface && world.accent);
    assert.ok(world.creatures.length > 0 && world.effects.length > 0);
    scenes.add(world.scene);
  }
  assert.equal(scenes.size,5);
  assert.equal(getLivingWorld('invalid'), null);
});

test('animation density adapts without a user-facing mode toggle', () => {
  assert.deepEqual(getWorldEntityBudget({ reducedMotion: true }).tier, 'still');
  assert.equal(getWorldEntityBudget({ saveData: true }).tier, 'low');
  assert.equal(getWorldEntityBudget({ width: 390 }).fish, 2);
  assert.equal(getWorldEntityBudget({ width: 768 }).tier, 'medium');
  assert.equal(getWorldEntityBudget({ width: 1440, hardwareConcurrency: 8, deviceMemory: 8 }).tier, 'full');
  assert.equal(getWorldEntityBudget({ width: 1440, hardwareConcurrency: 2 }).tier, 'low');
});

test('nearest creature and flee vector react locally without taking over clicks', () => {
  const near = findNearestCreature([{ id: 'a', x: 40, y: 20 }, { id: 'b', x: 240, y: 20 }], 45, 22);
  assert.equal(near.id, 'a');
  assert.equal(findNearestCreature([{ id: 'far', x: 300, y: 300 }], 0, 0), null);
  assert.deepEqual(getFleeVector(100, 100, 50, 100), { x: 64, y: 0 });
  assert.deepEqual(getFleeVector(100, 100, 100, 100), { x: 64, y: 0 });
});

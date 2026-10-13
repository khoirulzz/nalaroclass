import assert from 'node:assert/strict';
import test from 'node:test';
import { getFleeVector, getWorldEntityBudget, findNearestCreature } from './worldMotion.js';
import { getLivingWorld, READY_LIVING_WORLD_IDS } from './worldCatalog.js';

test('only completed living world is eligible for class selection', () => {
  assert.deepEqual(READY_LIVING_WORLD_IDS, ['deep-current']);
  assert.equal(getLivingWorld('deep-current').status, 'ready');
  for (const id of ['prism-city', 'paperbound', 'pixel-frontier', 'inventors-workshop']) {
    assert.equal(getLivingWorld(id).status, 'planned');
  }
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

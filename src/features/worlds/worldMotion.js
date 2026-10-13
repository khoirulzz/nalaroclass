/**
 * Browser-only motion policy and interaction geometry.
 * Pure helpers so density / fleeing behaviour can be unit tested with Node.
 */
export function getWorldEntityBudget({
  width = 1024,
  hardwareConcurrency,
  deviceMemory,
  saveData = false,
  reducedMotion = false,
} = {}) {
  if (reducedMotion) return { tier: 'still', fish: 0, bubbles: 0, jellyfish: 0, fx: false };
  const constrained = saveData
    || (Number.isFinite(deviceMemory) && deviceMemory <= 2)
    || (Number.isFinite(hardwareConcurrency) && hardwareConcurrency <= 2);
  if (constrained || width <= 480) return { tier: 'low', fish: 2, bubbles: 4, jellyfish: 0, fx: true };
  if (width <= 900 || (Number.isFinite(deviceMemory) && deviceMemory <= 4)) {
    return { tier: 'medium', fish: 3, bubbles: 7, jellyfish: 1, fx: true };
  }
  return { tier: 'full', fish: 5, bubbles: 12, jellyfish: 1, fx: true };
}

export function getFleeVector(creatureX, creatureY, pointerX, pointerY, distance = 64) {
  const deltaX = creatureX - pointerX;
  const deltaY = creatureY - pointerY;
  const length = Math.hypot(deltaX, deltaY);
  // Deterministic direction for a tap directly at the centre.
  if (length < 0.001) return { x: distance, y: 0 };
  return { x: Math.round((deltaX / length) * distance), y: Math.round((deltaY / length) * distance) };
}

export function findNearestCreature(creatures, pointerX, pointerY, radius = 125) {
  let nearest = null;
  let best = radius * radius;
  for (const creature of creatures) {
    const { x, y } = creature;
    const d2 = (x - pointerX) ** 2 + (y - pointerY) ** 2;
    if (d2 < best) { best = d2; nearest = creature; }
  }
  return nearest;
}

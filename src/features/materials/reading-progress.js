// Estimates for inline content. External files/videos use a planning allowance;
// their full contents and playback are not visible to this reader.
const WORDS_PER_MINUTE = 200;
const MEDIA_SECONDS = { image: 15, link: 15, file: 120, youtube: 180 };
const countWords = (text) => typeof text === 'string' ? (text.trim().match(/\S+/g) || []).length : 0;

export function estimateMaterialReading(blocks = []) {
  let wordCount = 0;
  let hasExternalContent = false;
  const entries = blocks.flatMap((block) => {
    if (block.type === 'divider') return [];
    const words = countWords(block.content) + (block.items || []).reduce((sum, item) => sum + countWords(item), 0) + countWords(block.label);
    wordCount += words;
    const allowance = MEDIA_SECONDS[block.type] || 0;
    if (['file', 'youtube', 'link'].includes(block.type)) hasExternalContent = true;
    return [{ id: block.id, seconds: Math.max(3, words / WORDS_PER_MINUTE * 60) + allowance }];
  });
  const seconds = entries.reduce((sum, entry) => sum + entry.seconds, 0);
  return { entries, seconds, minutes: seconds ? Math.max(1, Math.ceil(seconds / 60)) : 0, wordCount, hasExternalContent };
}

export function createReadingTracker(estimate, initialPercent = 0) {
  const baseline = Math.max(0, Math.min(100, Number(initialPercent) || 0));
  let credit = estimate.seconds * baseline / 100;
  const entries = estimate.entries.map((entry) => {
    const spent = Math.min(entry.seconds, credit);
    credit -= spent;
    return { ...entry, spent, coverage: spent / entry.seconds };
  });
  let percent = baseline;
  return {
    tick(elapsedSeconds, visibleBlocks = [], active = true) {
      if (!active || baseline === 100 || !estimate.seconds) return percent;
      const visible = new Map(visibleBlocks.map((block) => [block.id, block]));
      const eligible = entries.filter((entry) => {
        const view = visible.get(entry.id);
        if (!view || view.fraction <= 0) return false;
        entry.coverage = Math.max(entry.coverage, Math.max(0, Math.min(1, view.coverage)));
        return entry.spent < entry.seconds * entry.coverage;
      });
      const weight = eligible.reduce((sum, entry) => sum + visible.get(entry.id).fraction, 0);
      // A delayed timer must not credit time spent while the page was suspended.
      const elapsed = Math.max(0, Math.min(2, elapsedSeconds));
      for (const entry of eligible) entry.spent = Math.min(entry.seconds * entry.coverage, entry.spent + elapsed * visible.get(entry.id).fraction / weight);
      const next = Math.floor(entries.reduce((sum, entry) => sum + entry.spent, 0) / estimate.seconds * 100);
      percent = Math.max(percent, Math.min(99, next));
      return percent;
    },
  };
}

// One queue for auto-save and explicit completion. Failed writes retain the
// latest value for retry; an earlier response never lowers a newer local value.
export function createProgressSaver({ initialPercent = 0, save, onSaved, onError }) {
  let desired = initialPercent;
  let saved = initialPercent;
  let running = null;
  let disposed = false;
  return {
    request(percent) { if (!disposed) desired = Math.max(desired, percent); },
    flush() {
      if (running) return running;
      if (disposed || desired <= saved) return Promise.resolve(true);
      running = (async () => {
        while (desired > saved) {
          const target = desired;
          try {
            const progress = await save(target);
            saved = Math.max(saved, progress.percent);
            if (!disposed) onSaved(progress);
          } catch (error) {
            if (!disposed) onError(error);
            return false;
          }
        }
        return true;
      })().finally(() => { running = null; });
      return running;
    },
    dispose() { disposed = true; },
  };
}

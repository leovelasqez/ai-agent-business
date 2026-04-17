type CounterKey = "storageFallbackToLocal" | "generationQueued" | "generationCompleted" | "generationFailed";

const counters: Record<CounterKey, number> = {
  storageFallbackToLocal: 0,
  generationQueued: 0,
  generationCompleted: 0,
  generationFailed: 0,
};

export function incrementMetric(key: CounterKey) {
  counters[key] += 1;
}

export function getMetrics() {
  return { ...counters };
}

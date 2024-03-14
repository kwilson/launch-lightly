type CacheKey = string[];

function has(key: CacheKey): boolean {
  let currentLevel = rootCache;
  for (const part of key) {
    if (!currentLevel.has(part)) {
      return false;
    }
    currentLevel = currentLevel.get(part);
  }
  return true;
}

function verifyString(value: string | undefined): string {
  if (!value) {
    throw Error("no value");
  }

  return value;
}

function set(key: CacheKey, value: any): void {
  let currentLevel = rootCache;
  for (let i = 0; i < key.length - 1; i++) {
    const part = verifyString(key[i]);
    if (!currentLevel.has(part)) {
      currentLevel.set(part, new Map());
    }
    currentLevel = currentLevel.get(part);
  }
  currentLevel.set(verifyString(key[key.length - 1]), value);
}

function get(key: CacheKey): unknown {
  let currentLevel = rootCache;
  for (const part of key) {
    if (!currentLevel.has(part)) {
      return undefined;
    }
    currentLevel = currentLevel.get(part);
  }
  return currentLevel;
}

function clear(key: CacheKey): void {
  let currentLevel = rootCache;
  for (let i = 0; i < key.length - 1; i++) {
    const part = verifyString(key[i]);
    if (!currentLevel.has(part)) {
      return;
    }
    currentLevel = currentLevel.get(part);
  }
  currentLevel.delete(verifyString(key[key.length - 1]));
}

const rootCache = new Map<string, any>();

export const cache = {
  has,
  set,
  get,
  clear,
};

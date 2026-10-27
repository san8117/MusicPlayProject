const ROOT_KEY = "musicplay:v1";
const SESSION_KEY = "musicplay:session";
const DEFAULT_ROOT = Object.freeze({ schemaVersion: 1 });

/**
 * Reads the versioned storage root, removing it if its JSON is corrupted.
 *
 * @returns {Record<string, unknown> | null}
 */
function readRoot() {
  try {
    const rawValue = localStorage.getItem(ROOT_KEY);

    if (rawValue === null) {
      return { ...DEFAULT_ROOT };
    }

    const value = JSON.parse(rawValue);

    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      localStorage.removeItem(ROOT_KEY);
      return { ...DEFAULT_ROOT };
    }

    return value;
  } catch {
    try {
      localStorage.removeItem(ROOT_KEY);
    } catch {
      return null;
    }

    return { ...DEFAULT_ROOT };
  }
}

/**
 * Reads a value from the versioned root or the separate session key.
 *
 * @template T
 * @param {string} key Logical storage key.
 * @param {T} fallback Value returned when storage is unavailable or missing.
 * @returns {T}
 */
export function getItem(key, fallback) {
  try {
    if (key === "session") {
      const rawSession = localStorage.getItem(SESSION_KEY);
      return rawSession === null ? fallback : JSON.parse(rawSession);
    }

    const root = readRoot();
    return root && Object.hasOwn(root, key) ? root[key] : fallback;
  } catch {
    if (key === "session") {
      try {
        localStorage.removeItem(SESSION_KEY);
      } catch {
        return fallback;
      }
    }

    return fallback;
  }
}

/**
 * Writes a value without allowing storage errors to escape.
 *
 * @param {string} key Logical storage key.
 * @param {unknown} value JSON-serializable value.
 * @returns {boolean} Whether the value was persisted.
 */
export function setItem(key, value) {
  try {
    const serializedValue = JSON.stringify(value);

    if (serializedValue === undefined) {
      return false;
    }

    if (key === "session") {
      localStorage.setItem(SESSION_KEY, serializedValue);
      return true;
    }

    const root = readRoot();

    if (!root) {
      return false;
    }

    root[key] = value;
    localStorage.setItem(ROOT_KEY, JSON.stringify(root));
    return true;
  } catch {
    return false;
  }
}

/**
 * Removes one logical value without allowing storage errors to escape.
 *
 * @param {string} key Logical storage key.
 * @returns {boolean} Whether the value was removed.
 */
export function removeItem(key) {
  try {
    if (key === "session") {
      localStorage.removeItem(SESSION_KEY);
      return true;
    }

    const root = readRoot();

    if (!root) {
      return false;
    }

    delete root[key];
    localStorage.setItem(ROOT_KEY, JSON.stringify(root));
    return true;
  } catch {
    return false;
  }
}

/**
 * Updates a logical value using an updater function.
 *
 * @template T
 * @param {string} key Logical storage key.
 * @param {(current: T) => T} updaterFn Pure updater that returns the next value.
 * @returns {T | false} The persisted value, or false if updating failed.
 */
export function update(key, updaterFn) {
  try {
    const currentValue = getItem(key, undefined);
    const nextValue = updaterFn(currentValue);

    if (nextValue === undefined || !setItem(key, nextValue)) {
      return false;
    }

    return nextValue;
  } catch {
    return false;
  }
}

/**
 * Removes the application data and session keys, preserving unrelated storage.
 *
 * @returns {boolean} Whether both keys were removed.
 */
export function clearAll() {
  try {
    localStorage.removeItem(ROOT_KEY);
    localStorage.removeItem(SESSION_KEY);
    return true;
  } catch {
    return false;
  }
}

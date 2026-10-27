const ROOT_KEY = "musicplay:v1";
const SESSION_KEY = "musicplay:session";
const SCHEMA_VERSION = 2;
const DEFAULT_ROOT = Object.freeze({ schemaVersion: SCHEMA_VERSION });

/**
 * Dispatches a storage failure event for the UI without depending on a page module.
 *
 * @returns {void}
 */
function notifyStorageError() {
  if (typeof globalThis.dispatchEvent === "function" && typeof globalThis.CustomEvent === "function") {
    globalThis.dispatchEvent(new globalThis.CustomEvent("musicplay:storage-error"));
  }
}

/**
 * Saves malformed raw data under a timestamped backup key when storage permits.
 *
 * @param {string} key Original localStorage key.
 * @param {string} rawValue Malformed serialized value.
 * @returns {void}
 */
export function backupCorruptValue(key, rawValue) {
  try {
    localStorage.setItem(`musicplay:backup:${key}:${Date.now()}`, rawValue);
  } catch {
    notifyStorageError();
  }
}

/**
 * Reads the versioned storage root, preserving malformed data before recovery.
 *
 * @returns {Record<string, unknown> | null}
 */
function readRoot() {
  let rawValue;

  try {
    rawValue = localStorage.getItem(ROOT_KEY);
  } catch {
    notifyStorageError();
    return null;
  }

  if (rawValue === null) {
    return { ...DEFAULT_ROOT };
  }

  try {
    const value = JSON.parse(rawValue);

    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      backupCorruptValue(ROOT_KEY, rawValue);
      return { ...DEFAULT_ROOT };
    }

    const version = Number.isInteger(value.schemaVersion) ? value.schemaVersion : 1;

    if (version > SCHEMA_VERSION) {
      notifyStorageError();
      return null;
    }

    return { ...value, schemaVersion: SCHEMA_VERSION };
  } catch {
    backupCorruptValue(ROOT_KEY, rawValue);
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
  if (key === "session") {
    try {
      const rawSession = localStorage.getItem(SESSION_KEY);

      if (rawSession === null) {
        return fallback;
      }

      const session = JSON.parse(rawSession);

      if (typeof session === "string" && session.trim()) {
        return session;
      }

      backupCorruptValue(SESSION_KEY, rawSession);
      localStorage.removeItem(SESSION_KEY);
      return fallback;
    } catch {
      notifyStorageError();
      return fallback;
    }
  }

  const root = readRoot();

  if (!root) {
    return fallback;
  }

  const value = root[key];

  if (key === "users" && (!value || typeof value !== "object" || Array.isArray(value))) {
    if (Object.hasOwn(root, key)) {
      backupCorruptValue(`${ROOT_KEY}:users`, JSON.stringify(value));
    }

    return fallback;
  }

  return Object.hasOwn(root, key) ? value : fallback;
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
      notifyStorageError();
      return false;
    }

    if (key === "session") {
      localStorage.setItem(SESSION_KEY, serializedValue);
      return true;
    }

    const root = readRoot();

    if (!root) {
      notifyStorageError();
      return false;
    }

    root[key] = value;
    root.schemaVersion = SCHEMA_VERSION;
    localStorage.setItem(ROOT_KEY, JSON.stringify(root));
    return true;
  } catch {
    notifyStorageError();
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
      notifyStorageError();
      return false;
    }

    delete root[key];
    root.schemaVersion = SCHEMA_VERSION;
    localStorage.setItem(ROOT_KEY, JSON.stringify(root));
    return true;
  } catch {
    notifyStorageError();
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
    notifyStorageError();
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
    notifyStorageError();
    return false;
  }
}

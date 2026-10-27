import { createUser, getCurrentUser, getUserByEmail, removeUser, setSession, clearSession } from "./state.js";
import { formatName, normalizeEmail } from "./utils.js";

// Projeto educacional sem backend: isto NÃO é segurança real.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const NAME_PATTERN = /^[\p{L}\p{M}]+(?:[ '-][\p{L}\p{M}]+)*$/u;

export const AUTH_MESSAGES = Object.freeze({
  duplicateEmail: "Este e-mail já tem uma conta. Entre ou use outro e-mail.",
  invalidCredentials: "Não encontramos essa combinação de e-mail e senha. Confira e tente de novo.",
  cryptoUnavailable: "Não foi possível preparar sua senha neste navegador. Abra o MUSICPLAY em localhost ou HTTPS e tente novamente.",
  storageUnavailable: "Não foi possível salvar seus dados agora. Confira o espaço disponível no navegador e tente novamente.",
});

/**
 * Hashes a password using SHA-256. Educational project without a backend: this is NOT real security.
 *
 * @param {string} password Plain-text password.
 * @returns {Promise<string>} Lowercase hexadecimal SHA-256 digest.
 * @throws {Error} When Web Crypto is unavailable or hashing fails.
 */
export async function hashPassword(password) {
  if (!globalThis.crypto?.subtle || typeof globalThis.TextEncoder !== "function") {
    throw new Error(AUTH_MESSAGES.cryptoUnavailable);
  }

  try {
    const bytes = new TextEncoder().encode(password);
    const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  } catch {
    throw new Error(AUTH_MESSAGES.cryptoUnavailable);
  }
}

/**
 * Validates signup form values without side effects.
 *
 * @param {{firstName?: string, lastName?: string, email?: string, password?: string, terms?: boolean}} fields Submitted fields.
 * @returns {Record<string, string>} Errors keyed by form field.
 */
export function validateSignup(fields = {}) {
  const values = fields && typeof fields === "object" ? fields : {};
  const errors = {};
  validateNameField(values.firstName, "firstName", "Nome", errors);
  validateNameField(values.lastName, "lastName", "Sobrenome", errors);
  validateEmailField(values.email, errors);

  if (typeof values.password !== "string" || values.password.length < 6) {
    errors.password = "Use uma senha com pelo menos 6 caracteres.";
  }

  if (values.terms !== true) {
    errors.terms = "Aceite os termos para criar sua conta.";
  }

  return errors;
}

/**
 * Validates login form values without side effects.
 *
 * @param {{email?: string, password?: string}} fields Submitted fields.
 * @returns {Record<string, string>} Errors keyed by form field.
 */
export function validateLogin(fields = {}) {
  const values = fields && typeof fields === "object" ? fields : {};
  const errors = {};
  validateEmailField(values.email, errors);

  if (typeof values.password !== "string" || values.password.length === 0) {
    errors.password = "Informe sua senha para continuar.";
  }

  return errors;
}

/**
 * Creates a local account, starts a session, and returns its next route.
 *
 * @param {{firstName: string, lastName: string, email: string, password: string, terms: boolean}} fields Signup values.
 * @returns {Promise<{ok: boolean, message?: string, redirect?: string}>} Operation result.
 */
export async function signup(fields) {
  const errors = validateSignup(fields);

  if (Object.keys(errors).length > 0) {
    return { ok: false, message: "Confira os campos destacados e tente novamente." };
  }

  const email = normalizeEmail(fields.email);

  if (getUserByEmail(email)) {
    return { ok: false, message: AUTH_MESSAGES.duplicateEmail };
  }

  let passwordHash;

  try {
    passwordHash = await hashPassword(fields.password);
  } catch (error) {
    return { ok: false, message: error.message || AUTH_MESSAGES.cryptoUnavailable };
  }

  const name = formatName(`${fields.firstName} ${fields.lastName}`);
  const user = createUser({ name, email, passwordHash });

  if (!user) {
    if (getUserByEmail(email)) {
      return { ok: false, message: AUTH_MESSAGES.duplicateEmail };
    }

    return { ok: false, message: AUTH_MESSAGES.storageUnavailable };
  }

  if (!setSession(email)) {
    removeUser(email);
    return { ok: false, message: AUTH_MESSAGES.storageUnavailable };
  }

  return { ok: true, redirect: "onboarding.html" };
}

/**
 * Authenticates a local account using its stored password digest.
 *
 * @param {{email: string, password: string}} fields Login values.
 * @returns {Promise<{ok: boolean, message?: string, redirect?: string}>} Operation result.
 */
export async function login(fields) {
  const errors = validateLogin(fields);

  if (Object.keys(errors).length > 0) {
    return { ok: false, message: "Confira os campos destacados e tente novamente." };
  }

  let candidateHash;

  try {
    candidateHash = await hashPassword(fields.password);
  } catch (error) {
    return { ok: false, message: error.message || AUTH_MESSAGES.cryptoUnavailable };
  }

  const user = getUserByEmail(normalizeEmail(fields.email));

  if (!user || typeof user.passwordHash !== "string" || !constantTimeEqual(user.passwordHash, candidateHash)) {
    return { ok: false, message: AUTH_MESSAGES.invalidCredentials };
  }

  if (!setSession(user.email)) {
    return { ok: false, message: AUTH_MESSAGES.storageUnavailable };
  }

  return { ok: true, redirect: user.onboardingDone ? "dashboard.html" : "onboarding.html" };
}

/**
 * Clears the active session and returns the route for the login page.
 *
 * @returns {{ok: boolean, redirect: string}} Logout result.
 */
export function logout() {
  return { ok: clearSession(), redirect: "login.html" };
}

/**
 * Resolves the relative route for the current root/pages directory.
 *
 * @param {string} page Target HTML filename.
 * @returns {string} Relative URL to the target page.
 */
export function getPageRoute(page) {
  const inPagesDirectory = /\/pages\/[^/]*$/u.test(globalThis.location?.pathname ?? "");
  return `${inPagesDirectory ? "./" : "./pages/"}${page}`;
}

/**
 * Redirects an already authenticated visitor away from signup or login.
 *
 * @returns {boolean} True if a redirect was initiated.
 */
export function redirectAuthenticatedUser() {
  const user = getCurrentUser();

  if (!user) {
    return false;
  }

  const page = user.onboardingDone ? "dashboard.html" : "onboarding.html";
  globalThis.location.assign(getPageRoute(page));
  return true;
}

/**
 * Keeps digest comparison independent of the first differing character.
 *
 * @param {string} storedHash Stored digest.
 * @param {string} candidateHash Candidate digest.
 * @returns {boolean} Whether both digests match.
 */
function constantTimeEqual(storedHash, candidateHash) {
  if (storedHash.length !== candidateHash.length) {
    return false;
  }

  let difference = 0;

  for (let index = 0; index < storedHash.length; index += 1) {
    difference |= storedHash.charCodeAt(index) ^ candidateHash.charCodeAt(index);
  }

  return difference === 0;
}

function validateNameField(value, field, label, errors) {
  if (typeof value !== "string" || value.trim().length === 0) {
    errors[field] = `Informe seu ${label.toLocaleLowerCase("pt-BR")}.`;
    return;
  }

  const normalizedName = value.trim().replace(/\s+/gu, " ");
  const letters = Array.from(normalizedName).filter((character) => /\p{L}/u.test(character));

  if (letters.length < 2 || !NAME_PATTERN.test(normalizedName)) {
    errors[field] = `${label} deve ter pelo menos 2 letras.`;
  }
}

function validateEmailField(value, errors) {
  if (typeof value !== "string" || !EMAIL_PATTERN.test(normalizeEmail(value))) {
    errors.email = "Ops, esse e-mail parece incompleto. Exemplo: nome@email.com";
  }
}

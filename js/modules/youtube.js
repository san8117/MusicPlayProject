const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/u;
const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtu.be"]);

/**
 * Extracts a valid YouTube video ID from an ID or a supported YouTube URL.
 *
 * @param {string} urlOrId Raw ID or YouTube URL.
 * @returns {string|null} Valid 11-character ID, or null for unsupported input.
 */
export function parseYouTubeId(urlOrId) {
  if (typeof urlOrId !== "string") {
    return null;
  }

  const value = urlOrId.trim();

  if (VIDEO_ID_PATTERN.test(value)) {
    return value;
  }

  let url;

  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (!["https:", "http:"].includes(url.protocol) || !YOUTUBE_HOSTS.has(url.hostname.toLowerCase())) {
    return null;
  }

  const segments = url.pathname.split("/").filter(Boolean);
  let candidate = null;

  if (url.hostname.endsWith("youtu.be")) {
    candidate = segments[0];
  } else if (segments[0] === "watch") {
    candidate = url.searchParams.get("v");
  } else if (["shorts", "embed"].includes(segments[0])) {
    candidate = segments[1];
  }

  return typeof candidate === "string" && VIDEO_ID_PATTERN.test(candidate) ? candidate : null;
}

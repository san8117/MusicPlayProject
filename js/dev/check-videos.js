import { VIDEOS_BY_INSTRUMENT } from "../data/videos.js";

/** @type {Array<{instrumentId: string, lessons: number, missingVideos: number}>} */
const report = Object.entries(VIDEOS_BY_INSTRUMENT).map(([instrumentId, lessons]) => {
  const entries = Object.values(lessons);
  const missing = entries.filter(({ videoId }) => videoId === null).length;

  return { instrumentId, lessons: entries.length, missingVideos: missing };
});

console.table(report);

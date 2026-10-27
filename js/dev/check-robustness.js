import { evaluateAchievementRule } from "../modules/achievements.js";
import { buildMonthCalendar } from "../modules/calendar.js";
import { calculateStreak } from "../modules/streak.js";
import { normalizeUser } from "../modules/state.js";
import { startQuiz } from "../modules/quiz.js";
import { addXp } from "../modules/xp.js";
import { formatName } from "../modules/utils.js";
import { parseYouTubeId } from "../modules/youtube.js";

const checks = [
  ["accented names", formatName("ÉRICO") === "Érico"],
  ["apostrophe and hyphen names", formatName("d'ÁVILA ana-clara") === "D'Ávila Ana-Clara"],
  ["Portuguese particles", formatName("maria da silva") === "Maria da Silva"],
  ["future dates do not extend a streak", calculateStreak(["2026-10-25", "2026-10-26", "2099-01-01"], "2026-10-26") === 2],
  ["fractional XP is truncated", addXp({ xp: 10.9 }, 5.9).progress.xp === 15],
  ["very large XP is capped", addXp({ xp: 999_999_999 }, 100).progress.xp === 1_000_000_000],
  ["lesson achievement reads legacy guitar progress", evaluateAchievementRule(
    { type: "lessonsCompleted", value: 1 },
    { instrument: "guitar", progress: { completedLessons: ["lesson-1"] } },
  )],
  ["invalid achievements are removed", Object.keys(normalizeUser({
    email: "student@example.com",
    name: "João",
    progress: { unlockedAchievements: { "unknown-award": "2026-01-01" } },
  }, "student@example.com")?.progress.unlockedAchievements ?? {}).length === 0],
  ["stored XP is normalized and capped", normalizeUser({
    email: "student@example.com",
    name: "João",
    progress: { xp: "9999999999" },
  }, "student@example.com")?.progress.xp === 1_000_000_000],
  ["malformed quiz questions are ignored", startQuiz([null, {}, { options: [] }]).questions.length === 0],
  ["February 2024 has 29 days", buildMonthCalendar(2024, 1, "2024-02-29").filter(({ day }) => day !== null).length === 29],
  ["valid YouTube ID accepted", parseYouTubeId("https://youtu.be/dQw4w9WgXcQ?t=10") === "dQw4w9WgXcQ"],
  ["foreign YouTube host rejected", parseYouTubeId("https://youtube.com.example.org/watch?v=dQw4w9WgXcQ") === null],
  ["malformed video ID rejected", parseYouTubeId("<script>bad</script>") === null],
];

const failed = checks.filter(([, passed]) => !passed);
console.table(checks.map(([name, passed]) => ({ check: name, result: passed ? "PASS" : "FAIL" })));

if (failed.length > 0) {
  throw new Error(`${failed.length} robustness checks failed.`);
}

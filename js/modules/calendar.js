import { todayKey } from "./utils.js";

const MONTH_FORMATTER = new Intl.DateTimeFormat("pt-BR", { month: "long" });
const DAY_MONTH_FORMATTER = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long" });

/**
 * Builds a local-calendar month with leading Sunday-first blanks and study states.
 *
 * @param {number} year Calendar year.
 * @param {number} month Zero-based month (0 is January).
 * @param {string} today Local date in YYYY-MM-DD format.
 * @param {string[]} studyDays Dates recorded as study days.
 * @returns {Array<{day: number | null, dateKey?: string, studied?: boolean, today?: boolean, future?: boolean, label?: string}>} Month cells in display order.
 */
export function buildMonthCalendar(year, month, today, studyDays = []) {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 0 || month > 11) {
    return [];
  }

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const validStudyDays = new Set(Array.isArray(studyDays) ? studyDays.filter(isDateKey) : []);
  const cells = Array.from({ length: firstWeekday }, () => ({ day: null }));

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateKey = localDateKey(year, month, day);
    const date = new Date(year, month, day);
    const isToday = dateKey === today;
    const isFuture = isDateKey(today) && dateKey > today;
    const studied = validStudyDays.has(dateKey);
    const dateLabel = DAY_MONTH_FORMATTER.format(date);
    const status = isToday
      ? studied ? "hoje, estudou" : "hoje, ainda não estudou"
      : isFuture
        ? "data futura"
        : studied
          ? "estudou"
          : "não estudou";

    cells.push({
      day,
      dateKey,
      studied,
      today: isToday,
      future: isFuture,
      label: `${dateLabel}, ${status}`,
    });
  }

  return cells;
}

/**
 * Renders the active user's current local month in the profile calendar.
 *
 * @param {ParentNode} root Profile document or an element containing calendar hooks.
 * @param {object} user Active learner record.
 * @param {Date} [date] Local date used for the displayed month.
 * @returns {Array<object>} The generated calendar cells.
 */
export function renderCalendar(root, user, date = new Date()) {
  const grid = root.querySelector('[data-calendar="grid"]');
  const title = root.querySelector('[data-calendar="title"]');
  const emptyState = root.querySelector('[data-calendar="empty-state"]');

  if (!grid || !title) {
    return [];
  }

  const year = date.getFullYear();
  const month = date.getMonth();
  const today = todayKey(date);
  const studyDays = Array.isArray(user?.progress?.studyDays) ? user.progress.studyDays : [];
  const ownerDocument = root.nodeType === 9 ? root : root.ownerDocument;
  const cells = buildMonthCalendar(year, month, today, studyDays);
  const monthName = MONTH_FORMATTER.format(new Date(year, month, 1));
  title.textContent = `Sequência de estudos — ${monthName.charAt(0).toLocaleUpperCase("pt-BR")}${monthName.slice(1)} ${year}`;

  grid.replaceChildren();
  cells.forEach((cell) => {
    const element = ownerDocument.createElement("div");
    element.className = "study-calendar__day";

    if (cell.day === null) {
      element.classList.add("study-calendar__day--empty");
      element.setAttribute("aria-hidden", "true");
      element.dataset.empty = "true";
    } else {
      element.textContent = String(cell.day);
      element.setAttribute("role", "group");
      element.setAttribute("aria-label", cell.label);
      element.title = cell.label;

      if (cell.studied) {
        element.classList.add("study-calendar__day--studied");
      }

      if (cell.today) {
        element.classList.add("study-calendar__day--today");
        element.dataset.today = "true";
      }

      if (cell.future) {
        element.dataset.state = "upcoming";
      } else if (cell.studied) {
        element.dataset.state = "studied";
      } else if (!cell.today) {
        element.dataset.state = "not-studied";
      }
    }

    grid.append(element);
  });

  if (emptyState) {
    emptyState.hidden = cells.every((cell) => (
      cell.day === null || !cell.studied
    ));
  }

  return cells;
}

function localDateKey(year, month, day) {
  const localDate = new Date(year, month, day);
  return todayKey(localDate);
}

function isDateKey(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/u.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

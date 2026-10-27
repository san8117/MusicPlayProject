export const ACHIEVEMENTS = Object.freeze([
  Object.freeze({ id: "first-lesson", title: "Primeira Aula", description: "Concluiu sua primeira aula", icon: "🏆", color: "gold", rule: Object.freeze({ type: "lessonsCompleted", value: 1 }) }),
  Object.freeze({ id: "three-day-streak", title: "3 Dias Seguidos", description: "Estudou por 3 dias consecutivos", icon: "🔥", color: "orange", rule: Object.freeze({ type: "streakDays", value: 3 }) }),
  Object.freeze({ id: "100-xp", title: "100 XP", description: "Conquistou 100 pontos de XP", icon: "⭐", color: "gold", rule: Object.freeze({ type: "totalXp", value: 100 }) }),
  Object.freeze({ id: "first-note", title: "Primeira Nota", description: "Tocou sua primeira nota ou som fundamental", icon: "🎵", color: "cyan", rule: Object.freeze({ type: "notesPlayed", value: 1 }) }),
  Object.freeze({ id: "first-chord", title: "Primeiro Acorde", description: "Dominou seu primeiro acorde ou padrão musical", icon: "🎸", color: "purple", rule: Object.freeze({ type: "chordsLearned", value: 1 }) }),
  Object.freeze({ id: "master-of-notes", title: "Mestre das Notas", description: "Acertou 100% do quiz de notas", icon: "📚", color: "purple", rule: Object.freeze({ type: "quizPerfect" }) }),
  Object.freeze({ id: "seven-day-streak", title: "7 Dias Seguidos", description: "Estudou por 7 dias consecutivos", icon: "🔥", color: "orange", rule: Object.freeze({ type: "streakDays", value: 7 }) }),
  Object.freeze({ id: "sharpshooter", title: "Atirador Certeiro", description: "Acertou 10 questões seguidas", icon: "🎯", color: "green", rule: Object.freeze({ type: "correctStreak", value: 10 }) }),
  Object.freeze({ id: "first-song", title: "Primeira Música", description: "Completou o aprendizado de uma música", icon: "🎵", color: "cyan", rule: Object.freeze({ type: "songsCompleted", value: 1 }) }),
  Object.freeze({ id: "speedster", title: "Velocista", description: "Completou uma aula em tempo recorde", icon: "⚡", color: "orange", rule: Object.freeze({ type: "lessonCompletedUnderMinutes", value: 10 }) }),
  Object.freeze({ id: "100-questions", title: "100 Questões", description: "Respondeu 100 questões nos quizzes", icon: "🧠", color: "purple", rule: Object.freeze({ type: "questionsAnswered", value: 100 }) }),
  Object.freeze({ id: "module-complete", title: "Módulo Completo", description: "Finalizou o Módulo 1", icon: "🏅", color: "gold", rule: Object.freeze({ type: "moduleCompleted", value: 1 }) }),
]);

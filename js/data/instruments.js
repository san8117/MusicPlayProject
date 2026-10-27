export const INSTRUMENTS = Object.freeze([
  Object.freeze({ id: "guitar", name: "Violão", emoji: "🎸" }),
  Object.freeze({ id: "keyboard", name: "Teclado", emoji: "🎹" }),
  Object.freeze({ id: "piano", name: "Piano", emoji: "🎹" }),
  Object.freeze({ id: "drums", name: "Bateria", emoji: "🥁" }),
  Object.freeze({ id: "electric-guitar", name: "Guitarra", emoji: "🎸" }),
  Object.freeze({ id: "violin", name: "Violino", emoji: "🎻" }),
  Object.freeze({ id: "flute", name: "Flauta", emoji: "🪈" }),
  Object.freeze({ id: "cavaquinho", name: "Cavaquinho", emoji: "🪕" }),
  Object.freeze({ id: "ukulele", name: "Ukulele", emoji: "🎸" }),
  Object.freeze({ id: "accordion", name: "Sanfona / Acordeão", emoji: "🪗" }),
]);

export const ONBOARDING_LEVELS = Object.freeze([
  Object.freeze({
    id: "never-played",
    title: "Nunca toquei",
    description: "Sou completamente iniciante",
    emoji: "🌱",
  }),
  Object.freeze({
    id: "beginner",
    title: "Sou iniciante",
    description: "Já tive contato mas sei pouco",
    emoji: "🎵",
  }),
  Object.freeze({
    id: "some-experience",
    title: "Já sei tocar um pouco",
    description: "Conheço o básico do instrumento",
    emoji: "🎼",
  }),
]);

export const ONBOARDING_GOALS = Object.freeze([
  Object.freeze({ id: "learn-songs", title: "Aprender músicas", description: "Tocar músicas que você gosta", emoji: "🎵" }),
  Object.freeze({ id: "learn-theory", title: "Aprender teoria", description: "Entender notas, ritmos e acordes", emoji: "📚" }),
  Object.freeze({ id: "improve-technique", title: "Melhorar minha técnica", description: "Praticar e ganhar precisão", emoji: "🎯" }),
  Object.freeze({ id: "play-for-fun", title: "Tocar por diversão", description: "Curtição e criatividade ao tocar", emoji: "😊" }),
]);

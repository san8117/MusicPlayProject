/** Fixed reward and progress increment for one simulated practice session. */
export const SONG_PRACTICE_REWARD = Object.freeze({
  progress: 20,
  xp: 10,
  minutes: 5,
});

export const SONGS = Object.freeze([
  Object.freeze({ id: "asa-branca", title: "Asa Branca", artist: "Luiz Gonzaga", chords: Object.freeze(["Am", "Em", "C"]), level: "beginner" }),
  Object.freeze({ id: "parabens-pra-voce", title: "Parabéns pra Você", artist: "Tradicional", chords: Object.freeze(["G", "D", "C"]), level: "beginner" }),
  Object.freeze({ id: "peixe-vivo", title: "Peixe Vivo", artist: "Folclore", chords: Object.freeze(["G", "D"]), level: "beginner" }),
  Object.freeze({ id: "noite-feliz", title: "Noite Feliz", artist: "Franz Gruber", chords: Object.freeze(["C", "G", "F"]), level: "beginner" }),
  Object.freeze({ id: "garota-de-ipanema", title: "Garota de Ipanema", artist: "Tom Jobim", chords: Object.freeze(["F", "G7", "Gm", "F#"]), level: "intermediate" }),
  Object.freeze({ id: "imagine", title: "Imagine", artist: "John Lennon", chords: Object.freeze(["C", "Cmaj7", "F", "Am"]), level: "intermediate" }),
  Object.freeze({ id: "hotel-california", title: "Hotel California", artist: "Eagles", chords: Object.freeze(["Am", "E", "G", "D", "F", "C"]), level: "advanced" }),
]);

const GUITAR_MODULES = Object.freeze([
  Object.freeze({
    id: "module-1",
    number: 1,
    title: "Primeiros Passos",
    lessons: Object.freeze([
      Object.freeze({
        id: "lesson-1",
        number: 1,
        title: "Conhecendo o violão",
        xp: 30,
        minutes: 12,
        objectives: Object.freeze(["Identificar as partes principais do violão.", "Conhecer a posição correta para começar."]),
        description: "Conheça o violão e as partes que você usará para tocar.",
        theory: Object.freeze([]),
      }),
      Object.freeze({
        id: "lesson-2",
        number: 2,
        title: "Como segurar o instrumento",
        xp: 30,
        minutes: 12,
        objectives: Object.freeze(["Ajustar a postura ao tocar.", "Segurar o violão com conforto e segurança."]),
        description: "Encontre uma postura confortável para tocar violão.",
        theory: Object.freeze([]),
      }),
      Object.freeze({
        id: "lesson-3",
        number: 3,
        title: "Conhecendo as cordas",
        xp: 30,
        minutes: 15,
        objectives: Object.freeze(["Reconhecer as seis cordas do violão.", "Praticar a sequência das cordas."]),
        description: "Aprenda a identificar e explorar as cordas do violão.",
        theory: Object.freeze([]),
      }),
      Object.freeze({
        id: "lesson-4",
        number: 4,
        title: "Primeiros Acordes",
        xp: 40,
        minutes: 18,
        objectives: Object.freeze([
          "Conhecer a formação dos acordes de Lá menor, Mi menor e Dó maior.",
          "Posicionar os dedos nas cordas e casas indicadas.",
          "Praticar a troca entre os acordes com calma e precisão.",
        ]),
        description: "Aprenda a montar seus primeiros acordes e prepare os dedos para tocar suas músicas favoritas.",
        theory: Object.freeze([
          Object.freeze({
            id: "am",
            name: "Am",
            description: "Lá menor",
            fingers: Object.freeze(["Dedo 1: corda 2, casa 1", "Dedo 2: corda 4, casa 2", "Dedo 3: corda 3, casa 2"]),
          }),
          Object.freeze({
            id: "em",
            name: "Em",
            description: "Mi menor",
            fingers: Object.freeze(["Dedo 1: corda 5, casa 2", "Dedo 2: corda 4, casa 2"]),
          }),
          Object.freeze({
            id: "c",
            name: "C",
            description: "Dó maior",
            fingers: Object.freeze(["Dedo 1: corda 2, casa 1", "Dedo 2: corda 4, casa 2", "Dedo 3: corda 5, casa 3"]),
          }),
        ]),
      }),
      Object.freeze({
        id: "lesson-5",
        number: 5,
        title: "Dedilhado básico",
        xp: 40,
        minutes: 15,
        objectives: Object.freeze(["Praticar um dedilhado simples.", "Manter a pulsação durante o exercício."]),
        description: "Experimente um padrão simples de dedilhado e pratique no seu ritmo.",
        theory: Object.freeze([]),
      }),
    ]),
  }),
  Object.freeze({
    id: "module-2",
    number: 2,
    title: "Ritmo e Coordenação",
    lessons: Object.freeze([
      Object.freeze({
        id: "lesson-6",
        number: 6,
        title: "Ritmos básicos",
        xp: 30,
        minutes: 15,
        objectives: Object.freeze(["Reconhecer uma pulsação regular.", "Praticar padrões rítmicos básicos."]),
        description: "Conheça ritmos simples e acompanhe uma pulsação constante.",
        theory: Object.freeze([]),
      }),
      Object.freeze({
        id: "lesson-7",
        number: 7,
        title: "Batida simples",
        xp: 30,
        minutes: 15,
        objectives: Object.freeze(["Executar uma batida simples.", "Coordenar a mão da batida com os acordes."]),
        description: "Combine uma batida simples com os acordes que você já conhece.",
        theory: Object.freeze([]),
      }),
    ]),
  }),
]);

export const LESSONS_BY_INSTRUMENT = Object.freeze({
  guitar: GUITAR_MODULES,
});

/**
 * Returns the authored lesson modules for an instrument.
 * Unsupported instruments intentionally receive an empty list rather than guitar content.
 *
 * @param {string} instrumentId Instrument identifier.
 * @returns {ReadonlyArray<object>} Frozen modules, or an empty list while content is unavailable.
 */
export function getLessonsForInstrument(instrumentId) {
  return LESSONS_BY_INSTRUMENT[instrumentId] ?? Object.freeze([]);
}

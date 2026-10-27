const INSTRUMENT_LESSONS = Object.freeze({
  guitar: {
    name: "violão",
    modules: ["Primeiros Passos", "Ritmo e Coordenação", "Repertório e Expressão"],
    firstNoteLesson: 3,
    firstChordLesson: 4,
    lessons: [
      ["Conhecendo o violão", "Reconheça corpo, braço, tarraxas e ponte antes de tocar."],
      ["Como segurar o instrumento", "Ajuste o apoio do violão e relaxe os ombros e as mãos."],
      ["Conhecendo as cordas", "Identifique as seis cordas da mais grave à mais aguda e toque cada corda solta para comparar os sons."],
      ["Primeiros Acordes", "Monte Lá menor, Mi menor e Dó maior e pratique a troca entre eles."],
      ["Dedilhado básico", "Alterne polegar e dedos em um padrão simples de dedilhado."],
      ["Ritmos básicos", "Mantenha uma pulsação regular usando cordas abafadas."],
      ["Batida simples", "Coordene a mão da batida com os acordes já estudados."],
      ["Trocas de acordes", "Mude entre Am, Em e C sem interromper a pulsação."],
      ["Acordes de Sol e Ré", "Conheça novas posições abertas para ampliar seu repertório."],
      ["Dedilhado com melodia", "Combine notas de uma melodia curta com um baixo regular."],
      ["Acompanhamento completo", "Una acordes, batida e dinâmica em uma sequência musical."],
      ["Sua primeira interpretação", "Toque uma sequência completa com ritmo e expressão."],
    ],
    fourthTheory: [
      ["Am", "Lá menor · dedo 1: corda 2, casa 1; dedo 2: corda 4, casa 2; dedo 3: corda 3, casa 2."],
      ["Em", "Mi menor · dedo 1: corda 5, casa 2; dedo 2: corda 4, casa 2."],
      ["C", "Dó maior · dedo 1: corda 2, casa 1; dedo 2: corda 4, casa 2; dedo 3: corda 5, casa 3."],
    ],
  },
  keyboard: {
    name: "teclado",
    modules: ["Primeiras Teclas", "Mãos e Ritmo", "Acordes e Melodias"],
    firstNoteLesson: 4,
    firstChordLesson: 9,
    lessons: [
      ["Conhecendo o teclado", "Localize as oitavas, as teclas brancas, as pretas e os controles do teclado."],
      ["Postura das mãos", "Apoie os braços com conforto e mantenha os dedos curvos sobre as teclas."],
      ["Grupos de teclas pretas", "Use os grupos de duas e três teclas pretas como referência visual."],
      ["Notas no teclado", "Encontre Dó, Ré, Mi, Fá, Sol, Lá e Si em diferentes oitavas."],
      ["Dedos numerados", "Associe os números dos dedos às notas de uma posição de cinco dedos."],
      ["Pulso e ritmo", "Toque notas com duração regular e acompanhe uma pulsação constante."],
      ["Mão direita e mão esquerda", "Coordene movimentos simples entre as duas mãos."],
      ["Escala de Dó maior", "Pratique a sequência de notas naturais com dedilhado confortável."],
      ["Acordes de três notas", "Monte tríades maiores e menores com notas simultâneas."],
      ["Acorde de Dó maior", "Toque Dó, Mi e Sol juntos e reconheça a sonoridade do acorde."],
      ["Acompanhamento em blocos", "Alterne acordes e notas de baixo mantendo o tempo."],
      ["Sua primeira melodia", "Una escala, ritmo e acordes em uma pequena interpretação."],
    ],
    lessonTheory: {
      10: [
        ["C", "Dó maior · teclas Dó, Mi e Sol tocadas juntas."],
        ["F", "Fá maior · teclas Fá, Lá e Dó tocadas juntas."],
        ["G", "Sol maior · teclas Sol, Si e Ré tocadas juntas."],
      ],
    },
  },
  piano: {
    name: "piano",
    modules: ["Primeiras Teclas", "Técnica e Coordenação", "Acordes e Repertório"],
    firstNoteLesson: 4,
    firstChordLesson: 9,
    lessons: [
      ["Conhecendo o piano", "Identifique teclado, estante, pedais e a posição central do instrumento."],
      ["Postura ao piano", "Ajuste o banco, a distância do teclado e o relaxamento dos ombros."],
      ["Curva natural dos dedos", "Mantenha as mãos arredondadas e o toque leve sobre as teclas."],
      ["Notas e oitavas", "Localize Dó central, nomes das notas e repetição das oitavas."],
      ["Dedilhado inicial", "Use os números dos dedos em uma posição confortável de cinco notas."],
      ["Pulso e duração", "Diferencie notas curtas e longas em exercícios com pulso estável."],
      ["Coordenação das mãos", "Combine uma nota longa na esquerda com uma sequência curta na direita."],
      ["Escala de Dó maior", "Suba e desça a escala de Dó usando o cruzamento correto dos dedos."],
      ["Tríades no piano", "Construa acordes de três sons e perceba a distância entre as notas."],
      ["Acorde de Dó maior", "Encontre Dó, Mi e Sol e pratique o acorde nas duas mãos."],
      ["Acompanhamento simples", "Alterne baixo e acorde mantendo dinâmica equilibrada."],
      ["Sua primeira peça", "Una melodia, acompanhamento e expressão em uma pequena peça."],
    ],
    lessonTheory: {
      10: [
        ["C", "Dó maior · teclas Dó, Mi e Sol tocadas juntas."],
        ["F", "Fá maior · teclas Fá, Lá e Dó tocadas juntas."],
        ["G", "Sol maior · teclas Sol, Si e Ré tocadas juntas."],
      ],
    },
  },
  drums: {
    name: "bateria",
    modules: ["Conhecendo o Kit", "Coordenação e Rudimentos", "Ritmos e Viradas"],
    firstNoteLesson: 4,
    firstChordLesson: 9,
    lessons: [
      ["Conhecendo a bateria", "Identifique bumbo, caixa, tons, surdo, chimbal e pratos."],
      ["Postura no kit", "Ajuste banco e pedais para manter equilíbrio e movimento confortável."],
      ["Pegada das baquetas", "Segure as baquetas sem tensão e encontre o ponto de equilíbrio."],
      ["Primeiros toques", "Produza toques controlados na caixa e nos tambores."],
      ["Pulso e contagem", "Conte tempos em compassos simples e mantenha velocidade constante."],
      ["Toques alternados", "Alterne mãos direita e esquerda com regularidade."],
      ["Bumbo e caixa", "Coordene bumbo e caixa em uma célula rítmica básica."],
      ["Chimbal no pulso", "Marque pulsos regulares no chimbal sem perder a contagem."],
      ["Primeiro ritmo", "Una bumbo, caixa e chimbal em um groove inicial."],
      ["Rudimento de toque simples", "Pratique toques simples alternados com controle de rebote."],
      ["Virada de quatro tempos", "Crie uma virada curta e retorne ao groove sem acelerar."],
      ["Sua primeira levada", "Toque uma levada completa com contagem e dinâmica equilibradas."],
    ],
  },
  "electric-guitar": {
    name: "guitarra",
    modules: ["Primeiros Passos", "Técnica e Ritmo", "Acordes e Timbres"],
    firstNoteLesson: 3,
    firstChordLesson: 4,
    lessons: [
      ["Conhecendo a guitarra", "Identifique corpo, braço, captadores, ponte, tarraxas e controles."],
      ["Postura e correia", "Ajuste a correia e mantenha punhos e ombros relaxados."],
      ["Cordas e afinação", "Reconheça as seis cordas, confira a afinação padrão e toque cada corda solta."],
      ["Primeiros acordes", "Monte acordes abertos e pressione as cordas sem excesso de força."],
      ["Palheta e palhetada", "Segure a palheta com firmeza leve e alterne movimentos."],
      ["Ritmo abafado", "Abafe as cordas e pratique ataques regulares no tempo."],
      ["Power chords", "Forme acordes de quinta e mova a posição pelo braço."],
      ["Trocas com palhetada", "Alterne acordes mantendo a palhetada contínua."],
      ["Notas no braço", "Localize notas naturais nas cordas graves e nas primeiras casas."],
      ["Dinâmica e timbre", "Explore volume e controles do instrumento com mudanças sutis."],
      ["Riff de duas cordas", "Combine notas e power chords em um riff curto."],
      ["Sua primeira interpretação", "Una riff, ritmo e dinâmica em uma frase musical completa."],
    ],
    fourthTheory: [
      ["E5", "Power chord de Mi · corda Mi grave solta e dedos nas casas 2 das cordas Lá e Ré."],
      ["A5", "Power chord de Lá · corda Lá solta e dedos nas casas 2 das cordas Ré e Sol."],
      ["G5", "Power chord de Sol · corda Mi grave na casa 3 e dedos nas casas 5 das cordas Lá e Ré."],
    ],
  },
  violin: {
    name: "violino",
    modules: ["Postura e Som", "Arco e Notas", "Melodias Iniciais"],
    firstNoteLesson: 4,
    firstChordLesson: 12,
    lessons: [
      ["Conhecendo o violino", "Identifique caixa, cavalete, queixeira, cravelhas e arco."],
      ["Postura e apoio", "Apoie o violino com conforto sem elevar os ombros."],
      ["Segurando o arco", "Posicione os dedos com flexibilidade e controle na vareta."],
      ["Cordas soltas", "Reconheça Sol, Ré, Lá e Mi e produza sons sem pressionar o espelho."],
      ["Movimento reto do arco", "Deslize o arco paralelo ao cavalete com pressão equilibrada."],
      ["Ritmo com cordas soltas", "Alterne golpes longos e curtos mantendo a pulsação."],
      ["Mão esquerda inicial", "Aproxime os dedos do espelho com a mão relaxada."],
      ["Primeiras notas", "Toque notas iniciais em uma corda com afinação e arco estáveis."],
      ["Mudança de corda", "Passe entre cordas vizinhas sem interromper o movimento."],
      ["Escala inicial", "Organize notas em sequência e ouça sua relação melódica."],
      ["Frase com arco", "Una notas longas e curtas em uma frase musical simples."],
      ["Sua primeira melodia", "Toque uma melodia curta com arco controlado e pulso regular."],
    ],
  },
  flute: {
    name: "flauta",
    modules: ["Respiração e Som", "Dedos e Notas", "Melodias Iniciais"],
    firstNoteLesson: 5,
    firstChordLesson: 12,
    lessons: [
      ["Conhecendo a flauta", "Identifique bocal, corpo, chaves e posição de montagem do instrumento."],
      ["Postura ao tocar", "Mantenha coluna alinhada e braços soltos para respirar com conforto."],
      ["Respiração controlada", "Inspire sem tensão e solte o ar de forma contínua."],
      ["Embocadura inicial", "Direcione o ar pelo bocal com lábios relaxados e abertura pequena."],
      ["Primeiro som", "Produza um som sustentado e estável sem forçar a garganta."],
      ["Pulso com notas longas", "Sustente sons por tempos regulares e controle a saída do ar."],
      ["Posição dos dedos", "Cubra as chaves necessárias sem apertar nem deixar vazamentos."],
      ["Primeiras notas", "Toque notas iniciais alternando dedos e mantendo o fluxo de ar."],
      ["Mudança de nota", "Alterne duas notas com movimento coordenado dos dedos."],
      ["Escala inicial", "Organize notas em sequência ascendente e descendente."],
      ["Articulação suave", "Inicie notas com língua leve e mantenha o som ligado quando indicado."],
      ["Sua primeira melodia", "Una respiração, dedos e ritmo em uma melodia curta."],
    ],
  },
  cavaquinho: {
    name: "cavaquinho",
    modules: ["Primeiros Acordes", "Ritmo e Batida", "Acompanhamento"],
    firstNoteLesson: 3,
    firstChordLesson: 4,
    lessons: [
      ["Conhecendo o cavaquinho", "Identifique corpo, braço, tarraxas e as quatro cordas."],
      ["Postura e apoio", "Apoie o cavaquinho com estabilidade e mantenha os punhos relaxados."],
      ["Cordas e afinação", "Reconheça a afinação Ré, Sol, Si e Ré deste percurso e toque cada corda solta."],
      ["Primeiros acordes", "Monte acordes abertos de C, G7 e D7 nas posições indicadas."],
      ["Palhetada inicial", "Segure a palheta e toque para baixo e para cima com leveza."],
      ["Pulsação do samba", "Conte o pulso e pratique uma batida regular nas cordas abafadas."],
      ["Batida básica", "Coordene a palhetada com o pulso em uma levada simples."],
      ["Trocas de acordes", "Alterne C, G7 e D7 mantendo a mão direita em movimento."],
      ["Acordes adicionais", "Conheça posições de F e Am para ampliar o acompanhamento."],
      ["Levadas e dinâmica", "Varie a intensidade da batida sem perder o andamento."],
      ["Acompanhamento completo", "Combine acordes e levada em uma sequência harmônica curta."],
      ["Sua primeira interpretação", "Toque uma levada completa com acordes e pulso constante."],
    ],
    fourthTheory: [
      ["C", "Dó maior · cordas Ré-Sol-Si-Ré; pressione as posições indicadas sem abafar cordas vizinhas."],
      ["G7", "Sol com sétima · use a posição aberta do cavaquinho e mantenha os dedos próximos aos trastes."],
      ["D7", "Ré com sétima · confira a afinação das quatro cordas e toque somente as cordas indicadas."],
    ],
  },
  ukulele: {
    name: "ukulele",
    modules: ["Primeiros Acordes", "Ritmo e Dedilhado", "Acompanhamento"],
    firstNoteLesson: 3,
    firstChordLesson: 4,
    lessons: [
      ["Conhecendo o ukulele", "Identifique corpo, braço, tarraxas e as quatro cordas do ukulele."],
      ["Postura e apoio", "Apoie o instrumento com conforto e mantenha os ombros relaxados."],
      ["Cordas e afinação", "Reconheça Sol, Dó, Mi e Lá na afinação reentrante e toque cada corda solta."],
      ["Primeiros acordes", "Monte C, Am e F com posições simples nas quatro cordas."],
      ["Dedilhado inicial", "Alterne polegar e dedos em um padrão suave de quatro tempos."],
      ["Pulso e batida", "Conte o pulso e pratique movimentos para baixo e para cima."],
      ["Batida básica", "Combine a batida com o acorde de C sem interromper o ritmo."],
      ["Trocas de acordes", "Alterne C, Am e F mantendo os dedos próximos às cordas."],
      ["Acordes de G e G7", "Aprenda novas posições e confira a clareza de cada corda."],
      ["Dedilhado com baixo", "Una uma nota de baixo a um padrão simples de dedilhado."],
      ["Acompanhamento completo", "Combine acordes, batida e mudanças de dinâmica."],
      ["Sua primeira interpretação", "Toque uma sequência completa com ritmo leve e constante."],
    ],
    fourthTheory: [
      ["C", "Dó maior · pressione a corda Lá na casa 3."],
      ["Am", "Lá menor · pressione a corda Sol na casa 2."],
      ["F", "Fá maior · use as posições de Lá na casa 1 e Sol na casa 2."],
    ],
  },
  accordion: {
    name: "sanfona / acordeão",
    modules: ["Conhecendo o Instrumento", "Fole e Coordenação", "Baixos e Melodias"],
    firstNoteLesson: 4,
    firstChordLesson: 9,
    lessons: [
      ["Conhecendo a sanfona", "Identifique teclado, baixos, fole, correias e registros do instrumento."],
      ["Postura e correias", "Ajuste as correias para sustentar o instrumento sem tensão."],
      ["Movimento do fole", "Abra e feche o fole com controle e pressão de ar constante."],
      ["Primeiras teclas", "Localize notas naturais no teclado da mão direita."],
      ["Toque com a mão direita", "Pratique notas próximas com dedos relaxados e articulação clara."],
      ["Pulso e fole", "Mantenha uma nota regular enquanto controla o movimento do fole."],
      ["Baixos fundamentais", "Reconheça baixos e botões de acorde da mão esquerda."],
      ["Coordenação das mãos", "Una uma nota da mão direita a um baixo simples."],
      ["Primeiro acompanhamento", "Combine baixo e acorde mantendo o fole estável."],
      ["Escala inicial", "Toque uma sequência de notas naturais no teclado."],
      ["Melodia e baixos", "Una uma pequena melodia a uma marcação simples na mão esquerda."],
      ["Sua primeira interpretação", "Combine fole, baixos e melodia em uma frase musical curta."],
    ],
  },
});

const EMPTY_LESSONS = Object.freeze([]);
const MODULES_BY_INSTRUMENT = Object.freeze(Object.fromEntries(
  Object.entries(INSTRUMENT_LESSONS).map(([instrumentId, instrument]) => [
    instrumentId,
    Object.freeze([1, 2, 3].map((moduleNumber) => {
      const start = (moduleNumber - 1) * 4;
      const lessons = instrument.lessons.slice(start, start + 4).map(([title, focus], lessonIndex) => {
        const number = start + lessonIndex + 1;
        const description = `${focus} Pratique no seu ritmo, com atenção ao som e à postura.`;
        const specialTheory = instrument.lessonTheory?.[number]
          ?? (number === 4 ? instrument.fourthTheory : null);
        const theory = specialTheory
          ? specialTheory.map(([name, details], index) => ({
            id: `topic-${number}-${index + 1}`,
            title: name,
            details: [details],
            color: ["purple", "cyan", "green"][index],
          }))
          : [{
            id: `topic-${number}`,
            title: focus.split(/[.!?]/u)[0],
            details: [description],
            color: ["purple", "cyan", "green"][(number - 1) % 3],
          }];

        return Object.freeze({
          id: instrumentId === "guitar" ? `lesson-${number}` : `${instrumentId}-m${moduleNumber}-a${lessonIndex + 1}`,
          number,
          title,
          xp: number <= 3 ? 30 : 40,
          minutes: 12 + ((number - 1) % 3) * 3,
          objectives: Object.freeze([
            `Reconhecer os elementos de ${instrument.name} trabalhados nesta aula.`,
            `Praticar: ${focus}`,
          ]),
          description,
          milestones: Object.freeze([
            ...(number === instrument.firstNoteLesson ? ["first-note"] : []),
            ...(number === instrument.firstChordLesson ? ["first-chord"] : []),
          ]),
          theory: Object.freeze(theory.map((block) => Object.freeze({
            ...block,
            details: Object.freeze(block.details),
          }))),
        });
      });

      return Object.freeze({
        id: `module-${moduleNumber}`,
        number: moduleNumber,
        title: instrument.modules[moduleNumber - 1],
        lessons: Object.freeze(lessons),
      });
    })),
  ]),
));

export const LESSONS_BY_INSTRUMENT = MODULES_BY_INSTRUMENT;

/**
 * Returns the three authored modules for an instrument.
 *
 * @param {string} instrumentId Instrument identifier.
 * @returns {ReadonlyArray<object>} Frozen modules, or an empty list for an unknown instrument.
 */
export function getLessonsForInstrument(instrumentId) {
  return LESSONS_BY_INSTRUMENT[instrumentId] ?? EMPTY_LESSONS;
}

/**
 * Returns the current instrument's lesson progress, reading legacy guitar fields when needed.
 *
 * @param {object} progress User progress record.
 * @param {string} instrumentId Instrument identifier.
 * @returns {{completedLessons: Array<string>, lessonProgress: object, currentLessonId: string|null, unlockedLessons: Array<string>}}
 */
export function getInstrumentLessonProgress(progress = {}, instrumentId) {
  const stored = progress.instrumentProgressById?.[instrumentId];
  const legacyGuitarProgress = instrumentId === "guitar" ? progress : {};
  const source = stored && typeof stored === "object" ? stored : legacyGuitarProgress;

  return {
    completedLessons: Array.isArray(source.completedLessons) ? source.completedLessons : [],
    lessonProgress: source.lessonProgress && typeof source.lessonProgress === "object"
      ? source.lessonProgress
      : {},
    currentLessonId: typeof source.currentLessonId === "string" ? source.currentLessonId : null,
    unlockedLessons: Array.isArray(source.unlockedLessons) ? source.unlockedLessons : [],
  };
}

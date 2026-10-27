/**
 * Creates a frozen four-option question with the correct option first.
 *
 * @param {string} id Stable question identifier.
 * @param {string|null} instrumentId Instrument ID or null for a common question.
 * @param {string} question Question text.
 * @param {string} answer Correct answer text.
 * @param {Array<string>} alternatives Three distractor answers.
 * @param {string} explanation Short answer explanation.
 * @returns {object} Frozen question record.
 */
function createQuestion(id, instrumentId, question, answer, alternatives, explanation) {
  return Object.freeze({
    id,
    ...(instrumentId ? { instrumentId } : {}),
    question,
    options: Object.freeze([answer, ...alternatives].map((text, index) => Object.freeze({
      id: String.fromCharCode(65 + index),
      text,
    }))),
    correctIndex: 0,
    explanation,
    xp: 20,
  });
}

const INSTRUMENT_QUESTIONS = Object.freeze([
  createQuestion("guitar-low-e-c-note", "guitar", "Qual destas é a nota Dó na 6ª corda do violão?", "8º traste", ["3º traste", "5º traste", "10º traste"], "A nota Dó está no 8º traste da 6ª corda, afinada em Mi."),
  createQuestion("guitar-string-count", "guitar", "Quantas cordas tem um violão tradicional?", "Seis cordas", ["Quatro cordas", "Cinco cordas", "Oito cordas"], "O violão tradicional tem seis cordas."),
  createQuestion("guitar-am-fingering", "guitar", "Qual acorde é conhecido como Lá menor e pode ser escrito como Am?", "Lá menor", ["Dó maior", "Mi menor", "Sol maior"], "A sigla Am representa o acorde de Lá menor."),
  createQuestion("guitar-first-string-tuning", "guitar", "Qual nota corresponde à 1ª corda solta do violão na afinação padrão?", "Mi", ["Lá", "Ré", "Sol"], "Na afinação padrão, a 1ª corda é afinada em Mi."),
  createQuestion("guitar-fret-semitone", "guitar", "Ao avançar uma casa no braço do violão, qual é a distância musical?", "Um semitom", ["Um tom inteiro", "Uma oitava", "Dois tons"], "Cada casa consecutiva aumenta a altura em um semitom."),
  createQuestion("guitar-em-notes", "guitar", "Quais notas formam a tríade básica do acorde Mi menor (Em)?", "Mi, Sol e Si", ["Dó, Mi e Sol", "Ré, Fá sustenido e Lá", "Lá, Dó e Mi"], "A tríade de Mi menor é formada por Mi, Sol e Si."),
  createQuestion("keyboard-black-keys", "keyboard", "Qual padrão ajuda a localizar as notas no teclado?", "Grupos de duas e três teclas pretas", ["Grupos de quatro teclas brancas", "Teclas pretas em grupos de quatro", "Uma tecla preta a cada oitava"], "Os grupos de duas e três teclas pretas se repetem e ajudam a encontrar as notas."),
  createQuestion("keyboard-c-natural", "keyboard", "Onde fica a nota Dó em relação a um grupo de duas teclas pretas?", "Imediatamente à esquerda do grupo", ["Entre as duas teclas pretas", "Imediatamente à direita do grupo", "À direita do grupo de três teclas"], "O Dó fica imediatamente à esquerda de cada grupo de duas teclas pretas."),
  createQuestion("keyboard-c-major", "keyboard", "Quais notas formam o acorde de Dó maior no teclado?", "Dó, Mi e Sol", ["Dó, Ré e Fá", "Ré, Fá e Lá", "Mi, Sol e Si"], "A tríade de Dó maior é formada por Dó, Mi e Sol."),
  createQuestion("keyboard-hand-shape", "keyboard", "Como os dedos devem ficar ao tocar as teclas?", "Curvos e relaxados", ["Esticados e rígidos", "Fechados em punho", "Apoiados nas teclas pretas"], "Dedos curvos e relaxados facilitam o controle e reduzem a tensão."),
  createQuestion("piano-middle-c", "piano", "Qual referência é usada para localizar o Dó central no piano?", "Fica próximo ao centro do teclado", ["É sempre a tecla mais grave", "Fica no extremo agudo", "É uma tecla preta"], "O Dó central é uma referência próxima ao centro do teclado."),
  createQuestion("piano-pedal", "piano", "Qual é uma função comum do pedal direito do piano?", "Sustentar o som", ["Aumentar a afinação", "Trocar a oitava automaticamente", "Silenciar as cordas"], "O pedal direito, chamado sustain, prolonga a ressonância das notas."),
  createQuestion("piano-scale-c", "piano", "Quais teclas brancas formam a escala de Dó maior?", "Dó, Ré, Mi, Fá, Sol, Lá e Si", ["Dó, Ré, Fá, Sol, Lá, Si e Dó sustenido", "Dó, Mi, Sol e Si", "Ré, Mi, Fá, Sol, Lá, Si e Dó"], "A escala de Dó maior usa as sete notas naturais."),
  createQuestion("piano-finger-crossing", "piano", "Por que se pratica o cruzamento de dedos em uma escala?", "Para continuar a sequência com movimento confortável", ["Para tocar somente teclas pretas", "Para evitar usar o polegar", "Para mudar a afinação"], "O cruzamento ajuda a mão a continuar a escala sem interromper o movimento."),
  createQuestion("drums-kick", "drums", "Qual peça da bateria é tocada principalmente com o pedal do pé?", "Bumbo", ["Caixa", "Chimbal", "Prato de ataque"], "O pedal do bumbo é acionado pelo pé."),
  createQuestion("drums-snare", "drums", "Qual peça costuma marcar acentos importantes em muitos grooves?", "Caixa", ["Surdo", "Prato de condução", "Tom agudo"], "A caixa costuma marcar acentos, frequentemente nos tempos 2 e 4 em grooves populares."),
  createQuestion("drums-sticks", "drums", "Ao segurar baquetas para praticar, qual princípio ajuda no controle?", "Manter pegada confortável sem apertar demais", ["Prender os dedos com força máxima", "Segurar somente pela ponta", "Manter os punhos rígidos"], "Uma pegada relaxada ajuda o rebote e o controle das baquetas."),
  createQuestion("drums-rudiment", "drums", "O que é um rudimento de bateria?", "Um padrão básico de movimentos e toques", ["Um tipo de pedal", "Um ajuste do banco", "Uma afinação das cordas"], "Rudimentos são padrões fundamentais de mãos e golpes usados na técnica de bateria."),
  createQuestion("electric-guitar-pickups", "electric-guitar", "Qual componente da guitarra elétrica capta a vibração das cordas?", "Captador", ["Cavalete acústico", "Fole", "Queixeira"], "Os captadores transformam a vibração das cordas em sinal elétrico."),
  createQuestion("electric-guitar-power-chord", "electric-guitar", "Quais intervalos formam a base de um power chord simples?", "Fundamental e quinta", ["Terça e sexta", "Segunda e quarta", "Sétima e nona"], "Um power chord básico usa fundamental e quinta, podendo incluir a oitava."),
  createQuestion("electric-guitar-pick", "electric-guitar", "Qual movimento ajuda a manter uma palhetada regular?", "Alternar movimentos para baixo e para cima", ["Palhetar sempre com o braço inteiro", "Segurar a palheta com o punho fechado", "Evitar movimentos entre notas"], "A palhetada alternada favorece regularidade e economia de movimento."),
  createQuestion("electric-guitar-volume", "electric-guitar", "O que o controle de volume da guitarra costuma ajustar?", "O nível do sinal enviado ao amplificador", ["A tensão das cordas", "A altura do cavalete", "A afinação das tarraxas"], "O controle de volume altera o nível do sinal elétrico da guitarra."),
  createQuestion("violin-strings", "violin", "Quais são as cordas do violino da mais grave para a mais aguda?", "Sol, Ré, Lá e Mi", ["Dó, Sol, Ré e Lá", "Mi, Lá, Ré e Sol", "Fá, Dó, Sol e Ré"], "A afinação padrão do violino, da mais grave à mais aguda, é Sol, Ré, Lá e Mi."),
  createQuestion("violin-bow-path", "violin", "Como o arco deve se mover em relação ao cavalete?", "Aproximadamente paralelo", ["Apontando para o espelho", "Perpendicular ao cavalete", "Em círculos"], "Um movimento aproximadamente paralelo favorece contato estável com a corda."),
  createQuestion("violin-chinrest", "violin", "Qual parte ajuda a apoiar o violino junto ao queixo?", "Queixeira", ["Cavalete", "Cravelha", "Estandarte"], "A queixeira oferece uma superfície de apoio para o queixo."),
  createQuestion("violin-open-string", "violin", "O que significa tocar uma corda solta no violino?", "Tocar sem pressionar a corda com a mão esquerda", ["Tocar sem usar o arco", "Retirar a corda do instrumento", "Pressionar todas as cordas"], "Uma corda solta vibra sem que os dedos da mão esquerda encurtem seu comprimento."),
  createQuestion("flute-air", "flute", "O que ajuda a manter uma nota longa e estável na flauta?", "Fluxo de ar contínuo e controlado", ["Prender a respiração", "Apertar as chaves com força", "Mover a cabeça rapidamente"], "O fluxo de ar constante ajuda a sustentar o som."),
  createQuestion("flute-embouchure", "flute", "O que é a embocadura na flauta?", "A forma como os lábios direcionam o ar ao bocal", ["A posição dos pés", "A afinação das chaves", "O apoio do instrumento no ombro"], "A embocadura direciona o ar para produzir o som."),
  createQuestion("flute-keys", "flute", "Para que servem as chaves da flauta?", "Alterar as notas ao abrir ou fechar passagens de ar", ["Aumentar o tamanho do bocal", "Prender o instrumento ao ombro", "Regular o volume do alto-falante"], "As chaves controlam aberturas e combinações usadas para produzir notas."),
  createQuestion("flute-tongue", "flute", "Qual é uma função da língua ao iniciar uma nota articulada?", "Separar o início das notas com um movimento leve", ["Fechar todas as chaves", "Substituir a respiração", "Aumentar a pressão dos dedos"], "A língua pode articular o início de uma nota sem interromper a respiração."),
  createQuestion("cavaquinho-strings", "cavaquinho", "Quantas cordas tem o cavaquinho tradicional?", "Quatro cordas", ["Três cordas", "Seis cordas", "Oito cordas"], "O cavaquinho tradicional possui quatro cordas."),
  createQuestion("cavaquinho-tuning", "cavaquinho", "Qual afinação é usada como referência neste curso de cavaquinho?", "Ré, Sol, Si e Ré", ["Sol, Dó, Mi e Lá", "Mi, Lá, Ré e Sol", "Dó, Sol, Ré e Lá"], "Neste percurso, a referência é Ré, Sol, Si e Ré; afinações podem variar por região."),
  createQuestion("cavaquinho-pick", "cavaquinho", "Qual ferramenta é comum para tocar as cordas do cavaquinho?", "Palheta", ["Arco", "Baqueta", "Fole"], "A palheta é usada com frequência para tocar e acompanhar no cavaquinho."),
  createQuestion("cavaquinho-chord", "cavaquinho", "O que é importante ao montar um acorde no cavaquinho?", "Pressionar as posições indicadas sem abafar cordas vizinhas", ["Segurar o corpo pela ponte", "Tocar somente as tarraxas", "Apertar todas as cordas em todas as casas"], "A posição correta deve permitir que as cordas desejadas soem com clareza."),
  createQuestion("ukulele-strings", "ukulele", "Quantas cordas tem o ukulele tradicional?", "Quatro cordas", ["Duas cordas", "Seis cordas", "Oito cordas"], "O ukulele tradicional possui quatro cordas."),
  createQuestion("ukulele-tuning", "ukulele", "Qual é a afinação padrão mais comum do ukulele soprano?", "Sol, Dó, Mi e Lá", ["Ré, Sol, Si e Ré", "Mi, Lá, Ré e Sol", "Dó, Mi, Sol e Si"], "A afinação padrão comum é Sol, Dó, Mi e Lá."),
  createQuestion("ukulele-c-chord", "ukulele", "Qual posição forma o acorde de Dó maior (C) em uma forma simples de ukulele?", "Corda Lá na casa 3", ["Corda Sol na casa 2", "Todas as cordas na casa 1", "Corda Dó na casa 4"], "Uma forma comum de C pressiona a corda Lá na casa 3."),
  createQuestion("ukulele-strum", "ukulele", "Qual movimento pode compor uma batida básica de ukulele?", "Movimentos leves para baixo e para cima", ["Golpes de arco", "Pressionar as tarraxas", "Acionar um pedal de bumbo"], "Batidas comuns combinam movimentos para baixo e para cima."),
  createQuestion("accordion-bellows", "accordion", "Qual é a função do fole da sanfona/acordeão?", "Movimentar o ar que faz as palhetas livres vibrarem", ["Afinar as teclas automaticamente", "Apoiar o instrumento no ombro", "Percutir os baixos"], "O fole controla o fluxo de ar através das palhetas livres."),
  createQuestion("accordion-bass-buttons", "accordion", "Onde ficam geralmente os botões de baixos do acordeão?", "No lado esquerdo do instrumento", ["No centro do fole", "No extremo do teclado direito", "Na correia das costas"], "Os botões de baixos ficam normalmente no lado esquerdo."),
  createQuestion("accordion-keyboard", "accordion", "Qual mão toca normalmente o teclado melódico do acordeão piano?", "Mão direita", ["Mão esquerda", "Os dois pés", "Somente o polegar esquerdo"], "No acordeão piano, a mão direita toca o teclado melódico."),
  createQuestion("accordion-straps", "accordion", "Para que servem as correias do acordeão?", "Ajudar a sustentar e estabilizar o instrumento", ["Afinar os baixos", "Substituir o fole", "Alterar a duração das notas"], "As correias distribuem o peso e ajudam a manter o instrumento estável."),
]);

const COMMON_QUESTIONS = Object.freeze([
  createQuestion("common-semitone", null, "Qual é a menor distância entre duas notas consecutivas na escala cromática ocidental?", "Um semitom", ["Um tom", "Uma terça", "Uma oitava"], "O semitom é a menor distância entre notas consecutivas na escala cromática."),
  createQuestion("common-c-major-scale", null, "Qual sequência corresponde à escala de Dó maior?", "Dó, Ré, Mi, Fá, Sol, Lá, Si", ["Dó, Ré, Fá, Sol, Lá, Si, Dó sustenido", "Dó, Mi, Sol, Si", "Ré, Mi, Fá, Sol, Lá, Si, Dó"], "A escala de Dó maior usa as sete notas naturais."),
  createQuestion("common-triad", null, "Quantas notas diferentes formam uma tríade básica?", "Três", ["Duas", "Quatro", "Sete"], "Uma tríade é formada por três notas."),
  createQuestion("common-tempo", null, "O que o andamento musical indica?", "A velocidade da pulsação", ["A altura do instrumento", "O nome da tonalidade", "A quantidade de cordas"], "O andamento indica quão rápido ou lento é o pulso musical."),
  createQuestion("common-dynamics", null, "O que a dinâmica musical descreve?", "A intensidade do som", ["A duração do compasso", "A ordem das notas", "A afinação do instrumento"], "Dinâmica se refere a variações de intensidade, como tocar mais forte ou suave."),
  createQuestion("common-measure", null, "Para que servem as barras de compasso na notação musical?", "Separar grupos de tempos", ["Indicar a marca do instrumento", "Mostrar a posição das mãos", "Substituir as notas"], "As barras separam os compassos, organizando os tempos da música."),
]);

export const QUIZ_QUESTIONS = Object.freeze([...INSTRUMENT_QUESTIONS, ...COMMON_QUESTIONS]);

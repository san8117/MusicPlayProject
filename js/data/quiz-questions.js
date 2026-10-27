export const QUIZ_QUESTIONS = Object.freeze([
  Object.freeze({
    id: "guitar-low-e-c-note",
    instrumentId: "guitar",
    question: "Qual destas é a nota Dó na 6ª corda do violão?",
    options: Object.freeze([
      Object.freeze({ id: "A", text: "3º traste" }),
      Object.freeze({ id: "B", text: "5º traste" }),
      Object.freeze({ id: "C", text: "8º traste" }),
      Object.freeze({ id: "D", text: "10º traste" }),
    ]),
    correctIndex: 2,
    explanation: "A nota Dó está no 8º traste da 6ª corda, que é afinada em Mi.",
    xp: 20,
  }),
  Object.freeze({
    id: "guitar-string-count",
    instrumentId: "guitar",
    question: "Quantas cordas tem um violão tradicional?",
    options: Object.freeze([
      Object.freeze({ id: "A", text: "Quatro cordas" }),
      Object.freeze({ id: "B", text: "Cinco cordas" }),
      Object.freeze({ id: "C", text: "Seis cordas" }),
      Object.freeze({ id: "D", text: "Oito cordas" }),
    ]),
    correctIndex: 2,
    explanation: "O violão tradicional tem seis cordas, que são contadas da mais fina para a mais grossa.",
    xp: 20,
  }),
  Object.freeze({
    id: "guitar-am-fingering",
    instrumentId: "guitar",
    question: "Qual acorde é conhecido como Lá menor e pode ser escrito como Am?",
    options: Object.freeze([
      Object.freeze({ id: "A", text: "Dó maior" }),
      Object.freeze({ id: "B", text: "Lá menor" }),
      Object.freeze({ id: "C", text: "Mi menor" }),
      Object.freeze({ id: "D", text: "Sol maior" }),
    ]),
    correctIndex: 1,
    explanation: "A sigla Am representa o acorde de Lá menor: A é Lá e m indica menor.",
    xp: 20,
  }),
]);

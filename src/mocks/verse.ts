interface VerseOfDay {
  text: string;
  reference: string;
}

/**
 * Mock do versículo do dia. Futuramente poderá ser calculado a partir
 * da data atual (ex: rotacionando por um array indexado pelo dia da
 * missão) ou vindo de uma coleção no Firestore.
 */
export const verseOfDayMock: VerseOfDay = {
  text: "Portanto, ide e fazei discípulos de todas as nações...",
  reference: "Mateus 28:19",
};

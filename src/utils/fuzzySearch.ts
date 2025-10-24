import levenshtein from "js-levenshtein";

export function fuzzySearch<El extends Record<string, unknown>>(
  array: El[],
  searchArg: string,
  getValue: (el: El) => string,
  options: {
    maxAllowedModifications?: number;
    caseSensitive?: boolean;
  } = {}
) {
  const { caseSensitive = false, maxAllowedModifications = 2 } = options;

  const normalize = (s: string) => (caseSensitive ? s : s.toLowerCase());

  const computeBestScore = (el: El) => {
    let value = getValue(el);
    const normalizedValue = normalize(value);
    const normalizedSearch = normalize(searchArg);

    const words = normalizedValue.split(" ");
    const searchWords = normalizedSearch.split(" ");

    let totalScore = 0;
    let matchesAllWords = true;

    for (const sw of searchWords) {
      let bestWordScore = Infinity;
      for (const w of words) {
        const score = levenshtein(sw, w);
        if (score < bestWordScore) bestWordScore = score;
      }

      if (!normalizedValue.includes(sw)) matchesAllWords = false;
      totalScore += bestWordScore;
    }

    const partialMatch = normalizedValue.includes(normalizedSearch);
    const startsWith = normalizedValue.startsWith(normalizedSearch);

    // бонусы
    if (startsWith) totalScore -= 2;

    return {
      ...el,
      bestScore: totalScore,
      partialMatch,
      startsWith,
      matchesAllWords,
    };
  };

  return array
    .map(computeBestScore)
    .filter(
      (el) =>
        el.partialMatch ||
        el.matchesAllWords ||
        el.bestScore <= maxAllowedModifications * 2
    )
    .sort((a, b) => {
      if (a.startsWith !== b.startsWith) return a.startsWith ? -1 : 1;
      if (a.matchesAllWords !== b.matchesAllWords)
        return a.matchesAllWords ? -1 : 1;
      if (a.partialMatch !== b.partialMatch) return a.partialMatch ? -1 : 1;
      return a.bestScore - b.bestScore;
    });
}

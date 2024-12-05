// Common profanity words to filter
const profanityList = [
  'fuck', 'shit', 'ass', 'bitch', 'bastard', 'damn', 'cunt', 'dick', 'piss',
  // Add more words as needed, this is just a basic list
];

// Create regex pattern for whole word matching with common letter substitutions
const createProfanityRegex = (word: string): RegExp => {
  const letterMap: { [key: string]: string } = {
    'a': '[a@4]',
    'i': '[i1!]',
    'o': '[o0]',
    'e': '[e3]',
    's': '[s$5]',
    't': '[t7]',
  };

  const pattern = word
    .split('')
    .map(char => letterMap[char.toLowerCase()] || char)
    .join('');

  return new RegExp(`\\b${pattern}\\b`, 'gi');
};

// Create regex patterns for all profanity words
const profanityPatterns = profanityList.map(createProfanityRegex);

export const containsProfanity = (text: string): boolean => {
  // Check for exact matches and common substitutions
  return profanityPatterns.some(pattern => pattern.test(text));
};

export const getProfanityMatches = (text: string): string[] => {
  const matches = new Set<string>();
  
  profanityPatterns.forEach(pattern => {
    const found = text.match(pattern);
    if (found) {
      found.forEach(match => matches.add(match.toLowerCase()));
    }
  });

  return Array.from(matches);
};

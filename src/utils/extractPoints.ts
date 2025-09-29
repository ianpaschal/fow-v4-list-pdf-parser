export function extractPoints(tokens: string[]): number {
  for (const token of tokens) {
    // Check if the string is an integer (allowing optional + or - sign)
    if (/^-?\d+$/.test(token)) {
      return parseInt(token, 10);
    }
  }
  return 0;
}

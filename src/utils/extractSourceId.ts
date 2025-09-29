export function extractSourceId(tokens: string[]): string | null {
  for (const token of tokens) {
    if (/^[A-Z]{2,3}\d{3}$/.test(token)) {
      return token;
    }
  }
  return null;
}

const nationalities: Record<string, string> = {
  'B': 'British',
  'FI': 'Finland',
  'G': 'German',
  'H': 'Hungarian',
  'I': 'Italian',
  'R': 'Romanian',
  'S': 'Soviet',
  'U': 'U.S.',
};

export function extractNationality(tokens: string[]): string | null {
  return tokens.find((token) => Object.values(nationalities).includes(token)) ?? null;
}

export function extractNationalityFromSourceId(sourceId: string): string {
  let key: keyof typeof nationalities | null = null;
  if (sourceId?.length === 6) {
    key = sourceId.slice(1,3);
  }
  if (sourceId?.length === 5) {
    key = sourceId.slice(1,2);
  }
  if (!key) {
    throw new Error(`Could not extract nationality from ${sourceId}!`);
  }
  return nationalities[key];
}

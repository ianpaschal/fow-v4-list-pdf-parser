export function checkIsEndOfList(tokens: string[]): boolean {
  const totalPointsPattern = /Total Points:/;
  const unitCountPattern = /Unit Count:/;
  for (const token of tokens) {
    if (totalPointsPattern.test(token) || unitCountPattern.test(token)) {
      return true;
    }
  }
  return false;
}

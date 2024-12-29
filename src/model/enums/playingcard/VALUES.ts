export enum VALUES {
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
  EIGHT = 8,
  NINE = 9,
  TEN = 10,
  KNIGHT = 11,
  QUEEN = 12,
  KING = 13,
  ACE = 1
}

export function getValueByName(name: string): number | undefined {
  return VALUES[name as keyof typeof VALUES];
}
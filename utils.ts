export function sortByValueAscending(list: number[]): number[] {
  return list.toSorted((a, b) => a - b);
}

export function sum(a: number, b: number): number {
  return a + b;
}

export function getLength(
  _total: number,
  _value: unknown,
  index: number
): number {
  return index + 1;
}

export function sortByValueAscending(list: number[]): number[] {
  return list.toSorted((a, b) => a - b);
}

export function sum(a: number, b: number): number {
  return a + b;
}

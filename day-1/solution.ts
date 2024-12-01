import { sortByValueAscending, sum } from "../utils";

const ID_DELIMITER = "   ";

function parseInput(input: string): [number[], number[]] {
  const firstList: number[] = [];
  const secondList: number[] = [];

  for (const line of input.split("\n")) {
    const ids = line.split(ID_DELIMITER).map(Number);

    firstList.push(ids[0]);
    secondList.push(ids[1]);
  }

  return [firstList, secondList];
}

function solvePartOne(input: string): number {
  const [firstList, secondList] = parseInput(input).map(sortByValueAscending);
  let result = 0;

  for (const index of firstList.keys()) {
    const difference = Math.abs(firstList[index] - secondList[index]);
    result += difference;
  }

  return result;
}

function solvePartTwo(input: string): number {
  const [firstList, secondList] = parseInput(input);
  const frequencyMap = new Map<number, number>();

  for (const id of firstList) {
    const currentFrequency = frequencyMap.get(id) ?? 0;
    frequencyMap.set(id, currentFrequency + 1);
  }

  return secondList
    .map((id) => id * (frequencyMap.get(id) ?? 0))
    .reduce(sum, 0);
}

const exampleInput = await Bun.file(`${__dirname}/example-input.txt`).text();
const actualInput = await Bun.file(`${__dirname}/input.txt`).text();

console.table({
  "Part 1": {
    Example: solvePartOne(exampleInput),
    Actual: solvePartOne(actualInput),
  },
  "Part 2": {
    Example: solvePartTwo(exampleInput),
    Actual: solvePartTwo(actualInput),
  },
});

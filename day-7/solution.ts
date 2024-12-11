import { sum } from "../utils";

interface CalibrationLine {
  expectedResult: number;
  values: number[];
}

function parseInput(input: string): CalibrationLine[] {
  return input.split("\n").map((line) => {
    const [expectedResultString, valuesString] = line.split(":");

    return {
      expectedResult: Number(expectedResultString),
      values: valuesString.split(" ").map(Number),
    };
  });
}

function isCalibrationResultAchievable({
  expectedResult,
  values,
}: CalibrationLine): boolean {
  return values
    .reduce(generateAllPermutations, new Set([values[0]]))
    .has(expectedResult);
}

let INCLUDE_CONCATENATION = false;

function generateAllPermutations(
  previous: Set<number>,
  current: number
): Set<number> {
  return new Set(
    previous
      .values()
      .flatMap((result) => [
        result + current,
        result * current,
        INCLUDE_CONCATENATION ? Number(`${result}${current}`) : NaN,
      ])
  );
}

function solvePartOne(input: string): number {
  INCLUDE_CONCATENATION = false;

  return parseInput(input)
    .filter(isCalibrationResultAchievable)
    .map((line) => line.expectedResult)
    .reduce(sum, 0);
}

function solvePartTwo(input: string): number {
  INCLUDE_CONCATENATION = true;

  return parseInput(input)
    .filter(isCalibrationResultAchievable)
    .map((line) => line.expectedResult)
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

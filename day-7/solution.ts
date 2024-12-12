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

interface SearchContext {
  expectedResult: number;
  values: number[];
  currentIndex?: number;
  previousValue?: number;
  includeConcatenation?: boolean;
}

const isCalibrationResultAchievable = ({
  expectedResult,
  values,
  currentIndex = 1,
  previousValue = values[0],
  includeConcatenation = false,
}: SearchContext): boolean => {
  const currentValue = values[currentIndex];
  const results = [previousValue + currentValue, previousValue * currentValue];

  if (includeConcatenation) {
    results.push(Number(`${previousValue}${currentValue}`));
  }

  if (currentIndex === values.length - 1) {
    return results.includes(expectedResult);
  }

  return results.some((result) =>
    isCalibrationResultAchievable({
      expectedResult,
      values,
      currentIndex: currentIndex + 1,
      previousValue: result,
      includeConcatenation,
    })
  );
};

function solvePartOne(input: string): number {
  return parseInput(input)
    .filter(isCalibrationResultAchievable)
    .map((line) => line.expectedResult)
    .reduce(sum, 0);
}

function solvePartTwo(input: string): number {
  return parseInput(input)
    .filter(({ expectedResult, values }) =>
      isCalibrationResultAchievable({
        expectedResult,
        values,
        includeConcatenation: true,
      })
    )
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

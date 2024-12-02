function parseInput(input: string): number[][] {
  return input.split("\n").map((line) => line.split(" ").map(Number));
}

enum Direction {
  Up,
  Down,
}

function isReportSafe(report: number[], tolerence: number): boolean {
  const direction = report[1] - report[0] > 0 ? Direction.Up : Direction.Down;

  const isSafe = report
    .keys()
    .every((index) => isDifferenceWithNextLevelSafe(report, index, direction));

  if (isSafe) {
    return true;
  }

  if (tolerence === 0) {
    return false;
  }

  return report.keys().some((index) => {
    const reportWithoutLevel = report.toSpliced(index, 1);
    return isReportSafe(reportWithoutLevel, tolerence - 1);
  });
}

const MIN_DIFFERENCE = 1;
const MAX_DIFFERENCE = 3;

function isDifferenceWithNextLevelSafe(
  report: number[],
  index: number,
  direction: Direction
): boolean {
  const currentLevel = report[index];
  const nextLevel = report[index + 1];

  if (!nextLevel) {
    return true;
  }

  const directionModifier = direction === Direction.Down ? -1 : 1;
  const difference = (nextLevel - currentLevel) * directionModifier;

  return difference >= MIN_DIFFERENCE && difference <= MAX_DIFFERENCE;
}

function solvePartOne(input: string): number {
  return parseInput(input).filter((report) => isReportSafe(report, 0)).length;
}

function solvePartTwo(input: string): number {
  return parseInput(input).filter((report) => isReportSafe(report, 1)).length;
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

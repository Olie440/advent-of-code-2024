import { sum } from "../utils";

interface InstructionParts {
  a: number;
  b: number;
}

const INSTRUCTION_REGEX = /mul\((?<a>\d{1,3}),(?<b>\d{1,3})\)/g;

function parseInput(input: string): IteratorObject<InstructionParts> {
  return input
    .matchAll(INSTRUCTION_REGEX)
    .map((match) => match.groups as unknown as InstructionParts);
}

const STOP_EXECUTION_SYMBOL_REGEX = /don't\(\)/g;
const CONTINUE_EXECUTION_SYMBOL = "do()";

function removeNonExecutableSections(input: string): string {
  let executableInput = input;

  for (const match of input.matchAll(STOP_EXECUTION_SYMBOL_REGEX)) {
    const continueIndex = input.indexOf(CONTINUE_EXECUTION_SYMBOL, match.index);
    const endIndex = continueIndex === -1 ? input.length : continueIndex;
    const nonExecutableSection = input.substring(match.index, endIndex);

    executableInput = executableInput.replace(nonExecutableSection, "");
  }

  return executableInput;
}

function solvePartOne(input: string): number {
  return parseInput(input)
    .map(({ a, b }) => a * b)
    .reduce(sum);
}

function solvePartTwo(input: string): number {
  const executableInput = removeNonExecutableSections(input);

  return parseInput(executableInput)
    .map(({ a, b }) => a * b)
    .reduce(sum);
}

const exampleInputPartOne = await Bun.file(
  `${__dirname}/example-input-part-1.txt`
).text();
const exampleInputPartTwo = await Bun.file(
  `${__dirname}/example-input-part-2.txt`
).text();

const actualInput = await Bun.file(`${__dirname}/input.txt`).text();

console.table({
  "Part 1": {
    Example: solvePartOne(exampleInputPartOne),
    Actual: solvePartOne(actualInput),
  },
  "Part 2": {
    Example: solvePartTwo(exampleInputPartTwo),
    Actual: solvePartTwo(actualInput),
  },
});

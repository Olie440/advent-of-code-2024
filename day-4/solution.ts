import { getLength, sum } from "../utils";

type Grid = string[][];

function parseInput(input: string): Grid {
  return input.split("\n").map((line) => line.split(""));
}

interface XY {
  x: number;
  y: number;
}

const DIRECTIONS: XY[] = [
  { x: 0, y: -1 }, // North
  { x: 1, y: -1 }, // NorthEast
  { x: 1, y: 0 }, // East
  { x: 1, y: 1 }, // SouthEast
  { x: 0, y: 1 }, // South
  { x: -1, y: 1 }, // SouthWest
  { x: -1, y: 0 }, // West
  { x: -1, y: -1 }, // NorthWest
];

function countAmountOfXmasFoundFromPosition(grid: Grid, startPos: XY): number {
  return DIRECTIONS.values()
    .map((direction) =>
      directionContainsString("XMAS", grid, startPos, direction)
    )
    .filter(Boolean)
    .reduce(getLength, 0);
}

function isOutOfBounds(grid: Grid, pos: XY): boolean {
  return (
    pos.y < 0 ||
    pos.y >= grid.length ||
    pos.x < 0 ||
    pos.x >= grid[pos.y].length
  );
}

function directionContainsString(
  stringToMatch: string,
  grid: Grid,
  startPos: XY,
  direction: XY
): boolean {
  let lettersFound = "";
  let pos = startPos;

  while (
    lettersFound.length < stringToMatch.length &&
    stringToMatch.startsWith(lettersFound) &&
    !isOutOfBounds(grid, pos)
  ) {
    lettersFound = lettersFound + grid[pos.y][pos.x];
    pos = {
      x: pos.x + direction.x,
      y: pos.y + direction.y,
    };
  }

  return lettersFound === stringToMatch;
}

function solvePartOne(input: string): number {
  const grid = parseInput(input);

  return grid
    .keys()
    .flatMap((y) =>
      grid[y]
        .keys()
        .map((x) => countAmountOfXmasFoundFromPosition(grid, { x, y }))
    )
    .reduce(sum);
}

const MAS_CROSS_DIRECTIONS: XY[] = [
  { x: 1, y: -1 }, // NorthEast
  { x: 1, y: 1 }, // SouthEast
  { x: -1, y: 1 }, // SouthWest
  { x: -1, y: -1 }, // NorthWest
];

function positionContainsMasCross(grid: Grid, pos: XY): boolean {
  const amountOfMasCrossPartsFound = MAS_CROSS_DIRECTIONS.values()
    .map((direction) =>
      positionContainsMasCrossPartInDirection(grid, pos, direction)
    )
    .filter(Boolean)
    .reduce(getLength, 0);

  return amountOfMasCrossPartsFound === 2;
}

function positionContainsMasCrossPartInDirection(
  grid: Grid,
  pos: XY,
  direction: XY
): boolean {
  const startPos = {
    x: pos.x + direction.x * -1,
    y: pos.y + direction.y * -1,
  };

  return directionContainsString("MAS", grid, startPos, direction);
}

function solvePartTwo(input: string): number {
  const grid = parseInput(input);

  return grid
    .keys()
    .flatMap((y) =>
      grid[y].keys().map((x) => positionContainsMasCross(grid, { x, y }))
    )
    .filter(Boolean)
    .reduce(getLength, 0);
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

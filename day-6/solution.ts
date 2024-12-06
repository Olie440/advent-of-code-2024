import { getLength } from "../utils";

enum Tile {
  Empty,
  Obstacle,
}

type Grid = Tile[][];

interface XY {
  x: number;
  y: number;
}

interface ParsedInput {
  grid: Grid;
  startPosition: XY;
}

const OBSTACLE_SYMBOL = "#";
const EMPTY_TILE_SYMBOL = ".";
const GUARD_SYMBOL = "^";

const DIRECTIONS = [
  { x: 0, y: -1 }, // Up
  { x: 1, y: 0 }, // Right
  { x: 0, y: 1 }, // Down
  { x: -1, y: 0 }, // Left
];

function parseInput(input: string): ParsedInput {
  const gridCharacters = input.split("\n").map((row) => row.split(""));

  const grid = gridCharacters.map((row) =>
    row.map((cell) => (cell === OBSTACLE_SYMBOL ? Tile.Obstacle : Tile.Empty))
  );

  const startPositionY = gridCharacters.findIndex((row) =>
    row.find((cell) => cell === GUARD_SYMBOL)
  );

  if (startPositionY === -1) {
    throw new Error("Unable to find guards starting position");
  }

  const startPosition = {
    y: startPositionY,
    x: gridCharacters[startPositionY].findIndex(
      (cell) => cell === GUARD_SYMBOL
    ),
  };

  return {
    grid,
    startPosition,
  };
}

function isOutOfBounds(grid: Grid, { x, y }: XY): boolean {
  return y < 0 || x < 0 || y >= grid.length || x >= grid[y].length;
}

function getNextDirection(
  grid: Grid,
  currentPosition: XY,
  currentDirection: XY
): XY {
  let nextDirection = currentDirection;

  while (true) {
    const nextTilePosition = {
      x: currentPosition.x + nextDirection.x,
      y: currentPosition.y + nextDirection.y,
    };

    if (isOutOfBounds(grid, nextTilePosition)) {
      return nextDirection;
    }

    const nextTile = grid[nextTilePosition.y][nextTilePosition.x];

    if (nextTile === Tile.Empty) {
      return nextDirection;
    }

    const nextDirectionIndex = DIRECTIONS.indexOf(nextDirection) + 1;
    nextDirection = DIRECTIONS[nextDirectionIndex % 4];
  }
}

function addObstacleToInput(input: string, position: XY) {
  const rowLength = input.split("\n")[0].length + 1;
  const tileIndex = rowLength * position.y + position.x;

  const charatersBeforeTile = input.substring(0, tileIndex);
  const charactersAfterTile = input.substring(tileIndex + 1);

  return charatersBeforeTile + OBSTACLE_SYMBOL + charactersAfterTile;
}

function doesGuardGoInALoop(input: string): boolean {
  const { grid, startPosition } = parseInput(input);
  const movesPerformed = new Set<string>();

  let currentPosition = startPosition;
  let currentDirection = DIRECTIONS[0];

  while (!isOutOfBounds(grid, currentPosition)) {
    currentDirection = getNextDirection(
      grid,
      currentPosition,
      currentDirection
    );

    const moveKey = JSON.stringify([currentPosition, currentDirection]);

    if (movesPerformed.has(moveKey)) {
      return true;
    }

    movesPerformed.add(moveKey);

    currentPosition = {
      x: currentPosition.x + currentDirection.x,
      y: currentPosition.y + currentDirection.y,
    };
  }

  return false;
}

function solvePartOne(input: string): number {
  const { grid, startPosition } = parseInput(input);
  const tilesVisited = new Set<string>();

  let currentPosition = startPosition;
  let currentDirection = DIRECTIONS[0];

  while (!isOutOfBounds(grid, currentPosition)) {
    const tileKey = JSON.stringify(currentPosition);
    tilesVisited.add(tileKey);

    currentDirection = getNextDirection(
      grid,
      currentPosition,
      currentDirection
    );

    currentPosition = {
      x: currentPosition.x + currentDirection.x,
      y: currentPosition.y + currentDirection.y,
    };
  }

  return tilesVisited.size;
}

function solvePartTwo(input: string): number {
  const rows = input.split("\n");
  const emptyTilePositions = rows.flatMap((row, y) =>
    row
      .split("")
      .map((_cell, x) => ({ x, y }))
      .filter((position) => row[position.x] === EMPTY_TILE_SYMBOL)
  );

  return emptyTilePositions
    .values()
    .map((position) => addObstacleToInput(input, position))
    .filter(doesGuardGoInALoop)
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

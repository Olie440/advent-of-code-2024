import { sum } from "../utils";

interface ParsedInput {
  rules: Rule[];
  pageUpdates: PageUpdate[];
}

interface Rule {
  before: number;
  after: number;
}

type PageUpdate = number[];

function parseInput(input: string): ParsedInput {
  const [rulesInput, pageUpdatesInput] = input.split("\n\n");

  return {
    rules: parseRules(rulesInput),
    pageUpdates: parsePageUpdates(pageUpdatesInput),
  };
}

function parseRules(input: string): Rule[] {
  return input.split("\n").map((line) => {
    const [before, after] = line.split("|").map(Number);

    return { before, after };
  });
}

function parsePageUpdates(input: string): PageUpdate[] {
  return input.split("\n").map((line) => line.split(",").map(Number));
}

function findBrokenRule(
  page: number,
  pageUpdate: PageUpdate,
  rules: Rule[]
): Rule | undefined {
  return rules.find(
    (rule) =>
      rule.after === page &&
      pageUpdate.includes(rule.before) &&
      pageUpdate.indexOf(rule.before) > pageUpdate.indexOf(page)
  );
}

function getMiddlePage(pageUpdate: PageUpdate): number {
  const middleIndex = Math.floor(pageUpdate.length / 2);
  return pageUpdate[middleIndex];
}

function isPageUpdateSorted(pageUpdate: PageUpdate, rules: Rule[]): boolean {
  return pageUpdate.every(
    (page) => findBrokenRule(page, pageUpdate, rules) === undefined
  );
}

function sortPageUpdate(pageUpdate: PageUpdate, rules: Rule[]): PageUpdate {
  const pageUpdateSorted = structuredClone(pageUpdate);

  while (!isPageUpdateSorted(pageUpdateSorted, rules)) {
    for (const [index, page] of pageUpdateSorted.entries()) {
      const brokenRule = findBrokenRule(page, pageUpdateSorted, rules);

      if (!brokenRule) {
        continue;
      }

      const insertIndex = pageUpdateSorted.indexOf(brokenRule.before);

      pageUpdateSorted.splice(index, 1);
      pageUpdateSorted.splice(insertIndex, 0, page);
    }
  }

  return pageUpdateSorted;
}

function solvePartOne(input: string): number {
  const { rules, pageUpdates } = parseInput(input);

  return pageUpdates
    .values()
    .filter((pageUpdate) => isPageUpdateSorted(pageUpdate, rules))
    .map(getMiddlePage)
    .reduce(sum);
}

function solvePartTwo(input: string): number {
  const { rules, pageUpdates } = parseInput(input);

  return pageUpdates
    .values()
    .filter((pageUpdate) => !isPageUpdateSorted(pageUpdate, rules))
    .map((pageUpdate) => sortPageUpdate(pageUpdate, rules))
    .map(getMiddlePage)
    .reduce(sum);
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

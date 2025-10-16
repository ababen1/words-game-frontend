import type { Vector2 } from "../types/GridTypes";

const letterFrequencies: { [letter: string]: number } = {
  A: 8.2,
  B: 1.5,
  C: 2.8,
  D: 4.3,
  E: 12.7,
  F: 2.2,
  G: 2.0,
  H: 6.1,
  I: 7.0,
  J: 0.15,
  K: 0.77,
  L: 4.0,
  M: 2.4,
  N: 6.7,
  O: 7.5,
  P: 1.9,
  Q: 0.095,
  R: 6.0,
  S: 6.3,
  T: 9.1,
  U: 2.8,
  V: 0.98,
  W: 2.4,
  X: 0.15,
  Y: 2.0,
  Z: 0.074,
};

export function getRandomLetter(): string {
  // Compute cumulative frequencies
  const cumulative: { letter: string; cumulative: number }[] = [];
  let sum = 0;
  for (const letter in letterFrequencies) {
    sum += letterFrequencies[letter];
    cumulative.push({ letter, cumulative: sum });
  }

  // Pick random number and find corresponding letter
  const rand = Math.random() * 100;
  for (const entry of cumulative) {
    if (rand <= entry.cumulative) return entry.letter;
  }

  return "E"; // fallback
}

export function generateGrid(size: Vector2): string[][] {
  let grid: string[][] = [];
  for (let y = 0; y < size.row; y++) {
    const row: string[] = [];
    for (let x = 0; x < size.col; x++) {
      row.push(getRandomLetter());
    }
    grid.push(row);
  }
  return grid;
}

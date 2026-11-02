export type Mark = 'X' | 'O';
export type Cell = Mark | null;
export type Board = readonly Cell[];
export type GameCount = 1 | 3 | 5;

export interface Player {
  name: string;
  mark: Mark;
}

export interface PlayerRecord {
  id: string;
  name: string;
  wins: number;
  losses: number;
  draws: number;
}

export interface TournamentConfig {
  players: readonly [Player, Player];
  totalGames: GameCount;
}

export interface GameResult {
  game: number;
  winner: Mark | null;
}

export interface Scores {
  X: number;
  O: number;
  draws: number;
}

export interface TournamentState {
  players: readonly [Player, Player] | null;
  totalGames: GameCount;
  currentGame: number;
  board: Board;
  turn: Mark;
  results: readonly GameResult[];
}

export const WIN_LINES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

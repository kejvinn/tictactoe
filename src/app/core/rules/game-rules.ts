import { Board, GameResult, Mark, Scores, WIN_LINES } from '@core/models/tournament.model';

export function emptyBoard(): Board {
  return Array(9).fill(null);
}

export function isBoardFull(board: Board): boolean {
  return !board.includes(null);
}

export function findWinningLine(board: Board): readonly [number, number, number] | null {
  return (
    WIN_LINES.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]) ??
    null
  );
}

export function opposite(mark: Mark): Mark {
  return mark === 'X' ? 'O' : 'X';
}

export function firstMarkFor(gameNumber: number): Mark {
  return gameNumber % 2 === 1 ? 'X' : 'O';
}

export function placeMark(board: Board, index: number, mark: Mark): Board {
  return board.map((cell, i) => (i === index ? mark : cell));
}

export function countScores(results: readonly GameResult[]): Scores {
  const scores: Scores = { X: 0, O: 0, draws: 0 };
  for (const { winner } of results) {
    scores[winner ?? 'draws']++;
  }
  return scores;
}

export function winsNeeded(totalGames: number): number {
  return Math.floor(totalGames / 2) + 1;
}

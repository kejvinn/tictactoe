import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import {
  countScores,
  emptyBoard,
  findWinningLine,
  firstMarkFor,
  isBoardFull,
  opposite,
  placeMark,
  winsNeeded,
} from '@core/rules/game-rules';
import {
  GameResult,
  Mark,
  Player,
  TournamentConfig,
  TournamentState,
} from '@core/models/tournament.model';
import { LeaderboardService } from '@core/services/leaderboard.service';

const initialState: TournamentState = {
  players: null,
  totalGames: 1,
  currentGame: 1,
  board: emptyBoard(),
  turn: 'X',
  results: [],
};

export const TournamentStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ board, players, results, currentGame, totalGames }) => {
    const winningLine = computed(() => findWinningLine(board()));
    const roundWinner = computed(() => {
      const line = winningLine();
      return line ? board()[line[0]] : null;
    });
    const isRoundOver = computed(() => roundWinner() !== null || isBoardFull(board()));

    const names = computed<Record<Mark, string>>(() => ({
      X: findPlayer(players(), 'X')?.name ?? '',
      O: findPlayer(players(), 'O')?.name ?? '',
    }));

    const scores = computed(() => countScores(results()));
    const progressLabel = computed(() => `Game ${currentGame()} of ${totalGames()}`);
    const isTournamentOver = computed(() => {
      const hasWinner = Math.max(scores().X, scores().O) >= winsNeeded(totalGames());
      const allGamesPlayed = results().length === totalGames();
      return hasWinner || allGamesPlayed;
    });
    const tournamentWinner = computed(() => {
      const { X, O } = scores();
      return X === O ? null : findPlayer(players(), X > O ? 'X' : 'O');
    });

    return {
      winningLine,
      roundWinner,
      isRoundOver,
      names,
      scores,
      progressLabel,
      isTournamentOver,
      tournamentWinner,
    };
  }),

  withMethods((store, leaderboard = inject(LeaderboardService)) => {
    function start(config: TournamentConfig): void {
      patchState(store, { ...initialState, ...config });
    }

    function play(index: number): void {
      if (!canPlay(index)) {
        return;
      }

      patchState(store, { board: placeMark(store.board(), index, store.turn()) });

      if (!store.isRoundOver()) {
        patchState(store, { turn: opposite(store.turn()) });
        return;
      }

      recordGameResult();
      if (store.isTournamentOver()) {
        leaderboard.record(store.players() ?? [], store.tournamentWinner()).subscribe();
      }
    }

    function nextGame(): void {
      if (!store.isRoundOver() || store.isTournamentOver()) {
        return;
      }

      const currentGame = store.currentGame() + 1;
      patchState(store, { currentGame, board: emptyBoard(), turn: firstMarkFor(currentGame) });
    }

    function restart(): void {
      patchState(store, {
        ...initialState,
        players: store.players(),
        totalGames: store.totalGames(),
      });
    }

    function canPlay(index: number): boolean {
      return store.players() !== null && store.board()[index] === null && !store.isRoundOver();
    }

    function recordGameResult(): void {
      const result: GameResult = { game: store.currentGame(), winner: store.roundWinner() };
      patchState(store, { results: [...store.results(), result] });
    }

    return { start, play, nextGame, restart };
  }),
);

function findPlayer(players: TournamentState['players'], mark: Mark): Player | null {
  return players?.find((player) => player.mark === mark) ?? null;
}

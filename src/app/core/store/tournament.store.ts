import { HttpClient } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';
import {
  emptyBoard,
  findWinningLine,
  firstMarkFor,
  isBoardFull,
  opposite,
} from '../engine/game-engine';
import {
  GameResult,
  Mark,
  Player,
  Scores,
  TournamentConfig,
  TournamentState,
} from '../models/tournament.model';

const API_URL = 'http://localhost:3000';

const initialState: TournamentState = {
  players: null,
  totalGames: 1,
  gameNumber: 1,
  board: emptyBoard(),
  turn: 'X',
  results: [],
  saveStatus: 'idle',
};

function findPlayer(players: TournamentState['players'], mark: Mark): Player | null {
  return players?.find((player) => player.mark === mark) ?? null;
}

function countScores(results: readonly GameResult[]): Scores {
  const scores: Scores = { X: 0, O: 0, draws: 0 };
  for (const { winner } of results) {
    scores[winner ?? 'draws']++;
  }
  return scores;
}

export const TournamentStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ board }) => {
    const winningLine = computed(() => findWinningLine(board()));
    const roundWinner = computed(() => {
      const line = winningLine();
      return line ? board()[line[0]] : null;
    });

    return {
      winningLine,
      roundWinner,
      isRoundOver: computed(() => roundWinner() !== null || isBoardFull(board())),
    };
  }),

  withComputed(({ players, turn }) => ({
    currentPlayer: computed(() => findPlayer(players(), turn())),
    names: computed<Record<Mark, string>>(() => ({
      X: findPlayer(players(), 'X')?.name ?? '',
      O: findPlayer(players(), 'O')?.name ?? '',
    })),
  })),

  withComputed(({ players, results, gameNumber, totalGames }) => {
    const scores = computed(() => countScores(results()));

    return {
      scores,
      progressLabel: computed(() => `Game ${gameNumber()} of ${totalGames()}`),
      isTournamentOver: computed(() => results().length === totalGames()),
      tournamentWinner: computed(() => {
        const { X, O } = scores();
        return X === O ? null : findPlayer(players(), X > O ? 'X' : 'O');
      }),
    };
  }),

  withMethods((store, http = inject(HttpClient)) => {
    const setSaveStatus = (saveStatus: TournamentState['saveStatus']) =>
      patchState(store, { saveStatus });

    const postTournament = () =>
      http.post(`${API_URL}/games`, {
        players: store.players(),
        totalGames: store.totalGames(),
        results: store.results(),
        winner: store.tournamentWinner()?.name ?? null,
        playedAt: new Date().toISOString(),
      });

    return {
      saveResults: rxMethod<void>(
        pipe(
          tap(() => setSaveStatus('saving')),
          switchMap(() =>
            postTournament().pipe(
              tap(() => setSaveStatus('saved')),
              catchError(() => {
                setSaveStatus('error');
                return EMPTY;
              }),
            ),
          ),
        ),
      ),
    };
  }),

  withMethods((store) => {
    const canPlay = (index: number) =>
      store.players() !== null && store.board()[index] === null && !store.isRoundOver();

    const placeMark = (index: number) => {
      const board = store.board().map((cell, i) => (i === index ? store.turn() : cell));
      patchState(store, { board });
    };

    const recordResult = () => {
      const result: GameResult = { game: store.gameNumber(), winner: store.roundWinner() };
      patchState(store, { results: [...store.results(), result] });
    };

    return {
      start(config: TournamentConfig): void {
        patchState(store, { ...initialState, ...config });
      },

      play(index: number): void {
        if (!canPlay(index)) {
          return;
        }

        placeMark(index);

        if (!store.isRoundOver()) {
          patchState(store, { turn: opposite(store.turn()) });
          return;
        }

        recordResult();
        if (store.isTournamentOver()) {
          store.saveResults();
        }
      },

      nextGame(): void {
        if (!store.isRoundOver() || store.isTournamentOver()) {
          return;
        }

        const gameNumber = store.gameNumber() + 1;
        patchState(store, { gameNumber, board: emptyBoard(), turn: firstMarkFor(gameNumber) });
      },

      reset(): void {
        patchState(store, initialState);
      },
    };
  }),
);

import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, forkJoin, pipe, switchMap, tap } from 'rxjs';
import { PlayersApiService } from '@core/api/players-api.service';
import {
  emptyBoard,
  findWinningLine,
  firstMarkFor,
  isBoardFull,
  opposite,
} from '@core/engine/game-engine';
import {
  GameResult,
  Mark,
  Player,
  PlayerRecord,
  Scores,
  TournamentConfig,
  TournamentState,
} from '@core/models/tournament.model';

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

function sameName(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
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

  withMethods((store, api = inject(PlayersApiService)) => {
    const setSaveStatus = (saveStatus: TournamentState['saveStatus']) =>
      patchState(store, { saveStatus });

    const outcomeFor = (player: Player): 'wins' | 'losses' | 'draws' => {
      const winner = store.tournamentWinner();
      if (!winner) {
        return 'draws';
      }
      return winner.mark === player.mark ? 'wins' : 'losses';
    };

    const recordPlayer = (records: readonly PlayerRecord[], player: Player) => {
      const record = records.find((r) => sameName(r.name, player.name));
      const totals = {
        wins: record?.wins ?? 0,
        losses: record?.losses ?? 0,
        draws: record?.draws ?? 0,
      };
      totals[outcomeFor(player)]++;
      return record ? api.update(record.id, totals) : api.create({ name: player.name, ...totals });
    };

    const recordPlayers = (records: readonly PlayerRecord[]) =>
      forkJoin((store.players() ?? []).map((player) => recordPlayer(records, player)));

    return {
      recordTournament: rxMethod<void>(
        pipe(
          tap(() => setSaveStatus('saving')),
          switchMap(() =>
            api.list().pipe(
              switchMap(recordPlayers),
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
          store.recordTournament();
        }
      },

      nextGame(): void {
        if (!store.isRoundOver() || store.isTournamentOver()) {
          return;
        }

        const gameNumber = store.gameNumber() + 1;
        patchState(store, { gameNumber, board: emptyBoard(), turn: firstMarkFor(gameNumber) });
      },

      restart(): void {
        patchState(store, {
          ...initialState,
          players: store.players(),
          totalGames: store.totalGames(),
        });
      },
    };
  }),
);

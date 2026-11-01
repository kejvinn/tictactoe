import { inject, Service } from '@angular/core';
import { catchError, EMPTY, forkJoin, map, Observable, switchMap } from 'rxjs';
import { PlayersApiService } from '@core/api/players-api.service';
import { Player, PlayerRecord } from '@core/models/tournament.model';

@Service()
export class LeaderboardService {
  private readonly playersApi = inject(PlayersApiService);

  ranked(): Observable<PlayerRecord[]> {
    return this.playersApi.list().pipe(map(rank));
  }

  record(players: readonly Player[], winner: Player | null): Observable<PlayerRecord[]> {
    return this.playersApi.list().pipe(
      switchMap((records) =>
        forkJoin(players.map((player) => this.recordPlayer(records, player, winner))),
      ),
      catchError(() => EMPTY),
    );
  }

  private recordPlayer(records: readonly PlayerRecord[], player: Player, winner: Player | null) {
    const outcome = !winner ? 'draws' : winner.mark === player.mark ? 'wins' : 'losses';
    const record = records.find((r) => r.name.toLowerCase() === player.name.toLowerCase());

    if (!record) {
      return this.playersApi.create({
        name: player.name,
        wins: 0,
        losses: 0,
        draws: 0,
        [outcome]: 1,
      });
    }
    return this.playersApi.update(record.id, { [outcome]: record[outcome] + 1 });
  }
}

function rank(players: PlayerRecord[]): PlayerRecord[] {
  return [...players].sort(
    (a, b) => b.wins - a.wins || a.losses - b.losses || a.name.localeCompare(b.name),
  );
}

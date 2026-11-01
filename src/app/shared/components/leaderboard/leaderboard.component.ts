import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { PlayersApiService } from '@core/api/players-api.service';
import { PlayerRecord } from '@core/models/tournament.model';

function rank(players: PlayerRecord[]): PlayerRecord[] {
  return [...players].sort(
    (a, b) => b.wins - a.wins || a.losses - b.losses || a.name.localeCompare(b.name),
  );
}

@Component({
  selector: 'app-leaderboard',
  template: `
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Player</th>
          <th>Wins</th>
          <th>Losses</th>
          <th>Draws</th>
        </tr>
      </thead>
      <tbody>
        @for (player of players(); track player.id) {
          <tr>
            <td>{{ $index + 1 }}</td>
            <td>{{ player.name }}</td>
            <td>{{ player.wins }}</td>
            <td>{{ player.losses }}</td>
            <td>{{ player.draws }}</td>
          </tr>
        } @empty {
          <tr>
            <td colspan="5">No games recorded yet</td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class LeaderboardComponent {
  players = toSignal(
    inject(PlayersApiService)
      .list()
      .pipe(
        map(rank),
        catchError(() => of([])),
      ),
    { initialValue: [] },
  );
}

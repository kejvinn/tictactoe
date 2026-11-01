import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { LeaderboardService } from '@core/services/leaderboard.service';

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
    inject(LeaderboardService)
      .ranked()
      .pipe(catchError(() => of([]))),
    { initialValue: [] },
  );
}

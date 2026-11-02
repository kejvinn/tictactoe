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
          <tr [class]="'rank-' + ($index + 1)">
            <td>{{ $index + 1 }}</td>
            <td>{{ player.name }}</td>
            <td>{{ player.wins }}</td>
            <td>{{ player.losses }}</td>
            <td>{{ player.draws }}</td>
          </tr>
        } @empty {
          <tr>
            <td class="empty" colspan="5">No games recorded yet</td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: `
    th {
      border-bottom: 3px solid var(--color-border);
    }

    tbody tr {
      transition: background 0.15s steps(3);
    }

    tbody tr:hover {
      background: var(--color-surface);
    }

    td:first-child {
      font-family: var(--font-pixel);
      font-size: 0.8rem;
    }

    .rank-1 {
      color: var(--color-x);
      text-shadow: 0 0 8px var(--color-x);
    }

    .rank-2 {
      color: var(--color-o);
      text-shadow: 0 0 8px var(--color-o);
    }

    .rank-3 {
      color: var(--color-accent);
      text-shadow: 0 0 8px var(--color-accent);
    }

    .empty {
      padding: 1.5rem 0.5rem;
      text-align: center;
      color: var(--color-accent);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
  `,
})
export class LeaderboardComponent {
  readonly players = toSignal(
    inject(LeaderboardService)
      .ranked()
      .pipe(catchError(() => of([]))),
    { initialValue: [] },
  );
}

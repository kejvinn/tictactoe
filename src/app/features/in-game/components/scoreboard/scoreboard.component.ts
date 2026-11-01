import { Component, input } from '@angular/core';
import { Player, Scores } from '@core/models/tournament.model';

@Component({
  selector: 'app-scoreboard',
  template: `
    <p>{{ progressLabel() }}</p>
    <dl>
      @for (player of players(); track player.mark) {
        <dt>{{ player.name }} ({{ player.mark }}) wins</dt>
        <dd>{{ scores()[player.mark] }}</dd>
      }
      <dt>Draws</dt>
      <dd>{{ scores().draws }}</dd>
    </dl>
  `,
  styles: `
    dl {
      display: grid;
      grid-template-columns: auto auto;
      gap: 0 var(--space);
      margin: 0;
    }

    dd {
      margin: 0;
    }
  `,
})
export class ScoreboardComponent {
  players = input.required<readonly [Player, Player]>();
  scores = input.required<Scores>();
  progressLabel = input.required<string>();
}

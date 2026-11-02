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
    :host {
      display: block;
      width: min(100%, 24rem);
      padding: var(--space);
      border: 3px solid var(--color-border);
      box-shadow: 0 0 12px var(--color-accent);
    }

    p {
      margin: 0 0 0.5rem;
      color: var(--color-accent);
      text-transform: uppercase;
      letter-spacing: 0.2em;
    }

    dl {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 0.25rem var(--space);
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    dd {
      margin: 0;
      font-weight: 700;
    }
  `,
})
export class ScoreboardComponent {
  readonly players = input.required<readonly [Player, Player]>();
  readonly scores = input.required<Scores>();
  readonly progressLabel = input.required<string>();
}

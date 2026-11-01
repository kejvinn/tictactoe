import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameResult, Player, Scores } from '@core/models/tournament.model';

@Component({
  imports: [RouterLink],
  selector: 'app-results',
  template: `
    <p>{{ headline() }}</p>

    <ul>
      @for (row of rows(); track row.game) {
        <li>Game {{ row.game }}: {{ row.outcome }}</li>
      }
    </ul>

    <ul>
      @for (player of players(); track player.mark) {
        <li>{{ player.name }}: {{ scores()[player.mark] }} wins</li>
      }
      <li>Draws: {{ scores().draws }}</li>
    </ul>

    <button type="button" (click)="playAgain.emit()">Play again</button>
    <button type="button" routerLink="/">Home</button>
  `,
})
export class ResultsComponent {
  players = input.required<readonly [Player, Player]>();
  results = input.required<readonly GameResult[]>();
  scores = input.required<Scores>();
  winner = input.required<Player | null>();
  playAgain = output<void>();

  headline = computed(() => {
    const winner = this.winner();
    return winner ? `${winner.name} wins the tournament!` : 'The tournament is a tie';
  });

  rows = computed(() =>
    this.results().map((result) => {
      const winner = this.players().find((player) => player.mark === result.winner);
      return { game: result.game, outcome: winner ? `${winner.name} won` : 'Draw' };
    }),
  );
}

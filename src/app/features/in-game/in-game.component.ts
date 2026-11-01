import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { TournamentStore } from '@core/store/tournament.store';
import { LeaderboardComponent } from '@shared/components/leaderboard/leaderboard.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { BoardComponent } from './components/board/board.component';
import { ResultsComponent } from './components/results/results.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';

@Component({
  imports: [
    BoardComponent,
    ScoreboardComponent,
    ModalComponent,
    ResultsComponent,
    LeaderboardComponent,
  ],
  selector: 'app-in-game',
  styleUrl: './in-game.component.scss',
  templateUrl: './in-game.component.html',
})
export class InGameComponent {
  store = inject(TournamentStore);

  status = computed(() => {
    const store = this.store;
    const winner = store.roundWinner();

    if (!store.isRoundOver()) {
      return `${store.currentPlayer()?.name}'s turn (${store.turn()})`;
    }
    if (winner) {
      return `${store.names()[winner]} wins game ${store.gameNumber()}!`;
    }
    return `Game ${store.gameNumber()} is a draw.`;
  });

  showNextGame = computed(() => this.store.isRoundOver() && !this.store.isTournamentOver());

  resultsOpen = linkedSignal(() => this.store.isTournamentOver());
  leaderboardOpen = signal(false);

  playAgain(): void {
    this.store.restart();
  }
}

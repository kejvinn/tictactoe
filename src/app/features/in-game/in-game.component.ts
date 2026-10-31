import { Component, computed, inject } from '@angular/core';
import { TournamentStore } from '../../core/store/tournament.store';
import { BoardComponent } from './components/board/board.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';

@Component({
  imports: [BoardComponent, ScoreboardComponent],
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
}

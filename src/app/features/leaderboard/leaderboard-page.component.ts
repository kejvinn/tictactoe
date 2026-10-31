import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LeaderboardComponent } from '../../shared/components/leaderboard/leaderboard.component';

@Component({
  imports: [LeaderboardComponent, RouterLink],
  selector: 'app-leaderboard-page',
  template: `
    <h1>Leaderboard</h1>
    <app-leaderboard />
    <a routerLink="/">Back to menu</a>
  `,
})
export class LeaderboardPageComponent {}

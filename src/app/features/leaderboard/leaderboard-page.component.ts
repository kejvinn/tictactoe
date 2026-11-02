import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LeaderboardComponent } from '@shared/components/leaderboard/leaderboard.component';

@Component({
  imports: [LeaderboardComponent, RouterLink],
  selector: 'app-leaderboard-page',
  template: `
    <h1>Leaderboard</h1>
    <app-leaderboard />
    <button type="button" routerLink="/">Back to menu</button>
  `,
  styles: `
    :host {
      display: block;
      width: min(100%, 36rem);
      margin: 0 auto;
      padding: clamp(1rem, 5vw, 2rem);
      border: 3px solid var(--color-border);
      box-shadow: 0 0 16px var(--color-accent);
      animation: fadeIn 0.3s steps(4);
    }

    h1 {
      margin-top: 0;
      text-align: center;
    }

    button {
      display: block;
      margin: var(--space) auto 0;
    }
  `,
})
export class LeaderboardPageComponent {}

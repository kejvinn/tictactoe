import { Routes } from '@angular/router';
import { tournamentGuard } from './features/in-game/tournament.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'game',
    canActivate: [tournamentGuard],
    loadComponent: () =>
      import('./features/in-game/in-game.component').then((m) => m.InGameComponent),
  },
  { path: '**', redirectTo: '' },
];

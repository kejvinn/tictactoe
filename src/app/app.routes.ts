import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'game',
    loadComponent: () =>
      import('./features/in-game/in-game.component').then((m) => m.InGameComponent),
  },
  { path: '**', redirectTo: '' },
];
